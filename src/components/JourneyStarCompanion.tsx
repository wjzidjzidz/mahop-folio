import { useEffect, useRef } from 'react';
import { BrandStar } from './BrandStar';
import {
  computeContactStarMorph,
  computeHeroStarDetachState,
  computeStarCompanionState,
  lerp,
  smoothStep,
} from '../utils/journeyLogic';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useExhibitionStage } from '../context/ExhibitionStageContext';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r || 245, g || 243, b || 239];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
      return [r, g, b];
    }
  }
  return [245, 243, 239];
}

const COMPANION_BASE_PX = 24;

/**
 * The ONE and ONLY Persistent Star of MAH★P:
 * Unified single-instance lifecycle with native vector sizing (no blurry CSS scale upscaling)
 * across Intro Writing & Glow -> Hero MAH★P -> Scroll Detach -> Exhibition Companion -> Contact MAH★P.
 */
export function JourneyStarCompanion() {
  const starWrapperRef = useRef<HTMLDivElement>(null);
  const starGraphicRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { introStarGuideRef } = useExhibitionStage();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    let rafId = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let smoothedVelocity = 0;
    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.5;
    let currentSizePx = COMPANION_BASE_PX;
    let currentRot = 0;
    let wasSettled = false;
    let lastHeroDocked: boolean | null = null;
    let activeAccentHex = '#F5F3EF';

    const setHeroDockedAttribute = (docked: boolean) => {
      if (lastHeroDocked === docked) return;
      lastHeroDocked = docked;
      document.documentElement.dataset.mahopHeroStarDocked = docked ? 'true' : 'false';
      window.dispatchEvent(new CustomEvent('mahop:hero-star-dock', { detail: docked }));
    };

    const applyStarVisual = (
      x: number,
      y: number,
      sizePx: number,
      rotDeg: number,
      color: string,
      blendMode: 'normal' | 'difference',
      opacity: number
    ) => {
      const wrapper = starWrapperRef.current;
      const graphic = starGraphicRef.current;
      if (!wrapper || !graphic) return;

      const safeSize = Math.max(12, sizePx);
      wrapper.style.mixBlendMode = blendMode;
      wrapper.style.opacity = String(opacity);
      wrapper.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
        2
      )}px, 0) translate(-50%, -50%)`;

      // Resize container natively in CSS px so SVG always rasterizes at full razor-sharp vector crispness
      graphic.style.width = `${safeSize.toFixed(2)}px`;
      graphic.style.height = `${safeSize.toFixed(2)}px`;
      graphic.style.color = color;
      graphic.style.transform = `rotate(${rotDeg.toFixed(2)}deg)`;
    };

    const updateFrame = () => {
      const now = performance.now();
      const dt = Math.max(0.008, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;

      const wrapper = starWrapperRef.current;
      const graphic = starGraphicRef.current;
      const halo = haloRef.current;
      if (!wrapper || !graphic) {
        rafId = 0;
        return;
      }

      // STAGE 0: Intro Sequence — drive the single star cleanly above IntroLoader
      const guide = introStarGuideRef.current;
      if (guide.active && guide.sizePx > 0) {
        const hasValidGuide = guide.clientX > 0 || guide.clientY > 0;
        currentX = hasValidGuide ? guide.clientX : window.innerWidth * 0.5;
        currentY = hasValidGuide ? guide.clientY : window.innerHeight * 0.5;
        currentSizePx = guide.sizePx;
        currentRot = guide.rotationDeg;

        wrapper.style.zIndex = '60';
        applyStarVisual(
          currentX,
          currentY,
          currentSizePx,
          currentRot,
          '#FFFDF7',
          'normal',
          hasValidGuide ? 1 : 0
        );

        if (halo) {
          const glowAlpha = Math.min(0.65, 0.14 + guide.starGlow * 0.42);
          halo.style.opacity = String((0.35 + guide.starGlow * 0.65).toFixed(3));
          halo.style.boxShadow = 'none';
          halo.style.background = `radial-gradient(circle, rgba(255, 246, 224, ${glowAlpha.toFixed(
            3
          )}) 0%, rgba(255, 246, 224, ${(glowAlpha * 0.36).toFixed(3)}) 44%, rgba(255, 246, 224, 0) 74%)`;
        }

        setHeroDockedAttribute(true);
        rafId = window.requestAnimationFrame(updateFrame);
        return;
      }

      wrapper.style.zIndex = '30';

      const scrollY = window.scrollY;
      const rawVel = (scrollY - lastScrollY) / dt;
      lastScrollY = scrollY;
      smoothedVelocity = smoothedVelocity * 0.84 + rawVel * 0.16;

      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Check Stage A / Stage B: Hero MAH★P Slot on "/"
      const heroSlot = document.querySelector<HTMLElement>('[data-hero-star-slot="true"]');
      const heroRect = heroSlot?.getBoundingClientRect();
      const heroSection = heroSlot?.closest('section');
      const heroHeight = heroSection?.getBoundingClientRect().height || window.innerHeight;
      const detachThreshold = Math.min(window.innerHeight * 0.58, heroHeight * 0.58);
      const rawDetach = heroSlot ? Math.min(1, Math.max(0, scrollY / Math.max(200, detachThreshold))) : 1;

      if (heroSlot && heroRect && heroRect.width > 16 && rawDetach < 1) {
        const heroState = computeHeroStarDetachState(rawDetach, false);
        const heroCenterX = heroRect.left + heroRect.width * 0.5;
        const heroCenterY = heroRect.top + heroRect.height * 0.5;
        const heroSizePx = heroRect.width;

        const dir: -1 | 0 | 1 = smoothedVelocity > 15 ? 1 : smoothedVelocity < -15 ? -1 : 0;
        const compState = computeStarCompanionState(progress, false, false, smoothedVelocity, dir);
        const isCompact = window.innerWidth < 768;
        const compXPercent = isCompact
          ? Math.min(93, Math.max(88, compState.xPercent))
          : compState.xPercent;
        const compX = (compXPercent / 100) * window.innerWidth;
        const compY = (compState.yPercent / 100) * window.innerHeight;
        const compSizePx = compState.scale * COMPANION_BASE_PX;

        const blendT = smoothStep(0, 1, rawDetach);
        const targetX = lerp(heroCenterX, compX, blendT);
        const targetY = lerp(heroCenterY, compY, blendT) + heroState.arcOffsetY;
        const targetSizePx = lerp(heroSizePx, compSizePx, blendT);
        const targetRot = lerp(0, compState.rotationDeg, blendT);

        if (heroState.isDockedInHero) {
          currentX = targetX;
          currentY = targetY;
          currentSizePx = targetSizePx;
          currentRot = 0;
        } else {
          const kHero = 1 - Math.exp(-15 * dt);
          currentX += (targetX - currentX) * kHero;
          currentY += (targetY - currentY) * kHero;
          currentSizePx += (targetSizePx - currentSizePx) * kHero;
          currentRot += (targetRot - currentRot) * kHero;
        }

        applyStarVisual(
          currentX,
          currentY,
          currentSizePx,
          currentRot,
          '#F5F3EF',
          blendT > 0.25 ? 'difference' : 'normal',
          1
        );

        if (halo) {
          const heroGlow = blendT > 0.05 ? blendT * 0.34 : 0.12;
          halo.style.opacity = String(heroGlow.toFixed(3));
          halo.style.boxShadow = 'none';
          halo.style.background =
            'radial-gradient(circle, rgba(245, 243, 239, 0.36) 0%, rgba(245, 243, 239, 0.12) 45%, rgba(245, 243, 239, 0) 74%)';
        }

        if (wasSettled) {
          wasSettled = false;
          wrapper.setAttribute('data-settled', 'false');
          window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: false }));
        }
        setHeroDockedAttribute(blendT < 0.2);

        if (
          !heroState.isDockedInHero ||
          Math.abs(smoothedVelocity) > 8 ||
          Math.abs(targetX - currentX) > 0.5 ||
          Math.abs(targetY - currentY) > 0.5 ||
          Math.abs(targetSizePx - currentSizePx) > 0.5
        ) {
          rafId = window.requestAnimationFrame(updateFrame);
        } else {
          rafId = 0;
        }
        return;
      }

      setHeroDockedAttribute(false);

      // Check Stage D: Contact Closing MAH★P Slot in White Footer
      const dock = document.getElementById('footer-star-dock');
      const footerEl = document.getElementById('white-footer');
      let footerDockVisible = false;
      let emblemAboveViewport = false;
      let dockCenterX = window.innerWidth * 0.5;
      let dockCenterY = window.innerHeight * 0.5;
      let targetEmblemPx = 64;

      if (dock) {
        const slotTarget =
          dock.querySelector('[data-footer-star-slot="true"]') ||
          dock.querySelector('[data-footer-star-emblem]');
        const svgTarget = slotTarget?.querySelector('svg') || slotTarget || dock;
        const rect = svgTarget.getBoundingClientRect();
        const footerRect = footerEl?.getBoundingClientRect();
        const dockThreshold = window.innerHeight * 0.88;
        const inFooterZone = footerRect
          ? footerRect.top < dockThreshold && footerRect.bottom > 0
          : rect.top < dockThreshold && rect.bottom > 24;
        emblemAboveViewport = rect.bottom <= 24 && inFooterZone;
        footerDockVisible =
          inFooterZone &&
          (rect.bottom > 24 || emblemAboveViewport) &&
          (progress > 0.65 || maxScroll < 360);
        dockCenterX = rect.left + rect.width * 0.5;
        dockCenterY = rect.top + rect.height * 0.5;
        if (rect.width > 16) {
          targetEmblemPx = rect.width;
        }
      }

      const dir: -1 | 0 | 1 =
        smoothedVelocity > 15 ? 1 : smoothedVelocity < -15 ? -1 : 0;

      const state = computeStarCompanionState(
        progress,
        footerDockVisible,
        false,
        smoothedVelocity,
        dir
      );

      if (state.settledInFooter) {
        if (emblemAboveViewport) {
          currentX = dockCenterX;
          currentY = dockCenterY;
          currentSizePx = targetEmblemPx;
          currentRot = Math.round(currentRot / 360) * 360;
          document.documentElement.style.setProperty('--star-accent', '#525252');
          applyStarVisual(currentX, currentY, currentSizePx, currentRot, '#000000', 'normal', 0);
          if (!wasSettled) {
            wasSettled = true;
            wrapper.setAttribute('data-settled', 'true');
            window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: true }));
          }
          smoothedVelocity = 0;
          rafId = 0;
          return;
        }

        const glideK = 1 - Math.exp(-12 * dt);
        currentX += (dockCenterX - currentX) * glideK;
        currentY += (dockCenterY - currentY) * glideK;
        const dist = Math.hypot(dockCenterX - currentX, dockCenterY - currentY);

        const morph = computeContactStarMorph(
          true,
          dist,
          280,
          targetEmblemPx,
          COMPANION_BASE_PX
        );

        const targetZeroRot = Math.round(currentRot / 360) * 360;
        currentRot += (targetZeroRot - currentRot) * glideK;
        const targetMorphSizePx = morph.targetScaleMultiplier * COMPANION_BASE_PX;
        currentSizePx += (targetMorphSizePx - currentSizePx) * glideK;

        const [ar, ag, ab] = hexToRgb(activeAccentHex);
        const mix = morph.inkMix;
        const r = Math.round(ar * (1 - mix));
        const g = Math.round(ag * (1 - mix));
        const b = Math.round(ab * (1 - mix));

        document.documentElement.style.setProperty(
          '--star-accent',
          morph.morphT > 0.5 ? '#525252' : activeAccentHex
        );

        applyStarVisual(
          currentX,
          currentY,
          currentSizePx,
          currentRot,
          `rgb(${r}, ${g}, ${b})`,
          morph.morphT > 0.2 ? 'normal' : 'difference',
          morph.dockEmblemVisible ? 0 : 1
        );

        if (halo) {
          halo.style.opacity = String(morph.haloOpacity.toFixed(3));
          halo.style.boxShadow = 'none';
          halo.style.background =
            morph.haloOpacity > 0.02
              ? `radial-gradient(circle, rgba(${ar}, ${ag}, ${ab}, ${(
                  0.42 * (1 - morph.morphT)
                ).toFixed(3)}) 0%, rgba(${ar}, ${ag}, ${ab}, 0) 72%)`
              : 'none';
        }

        if (morph.dockEmblemVisible) {
          if (!wasSettled) {
            wasSettled = true;
            wrapper.setAttribute('data-settled', 'true');
            window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: true }));
          }
          smoothedVelocity = 0;
          rafId = 0;
          return;
        }

        if (wasSettled) {
          wasSettled = false;
          wrapper.setAttribute('data-settled', 'false');
          window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: false }));
        }

        rafId = window.requestAnimationFrame(updateFrame);
        return;
      }

      // Stage C: Global Exhibition Companion orbiting softly without blocking photography
      if (wasSettled) {
        wasSettled = false;
        wrapper.setAttribute('data-settled', 'false');
        window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: false }));
      }
      document.documentElement.style.setProperty('--star-accent', activeAccentHex);

      const isCompact = window.innerWidth < 768;
      const targetXPercent = isCompact ? Math.min(93, Math.max(88, state.xPercent)) : state.xPercent;
      const targetX = (targetXPercent / 100) * window.innerWidth;
      const targetY = (state.yPercent / 100) * window.innerHeight;
      const targetSizePx = state.scale * COMPANION_BASE_PX;

      const k = 1 - Math.exp(-8.5 * dt);
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      currentSizePx += (targetSizePx - currentSizePx) * k;
      currentRot += (state.rotationDeg - currentRot) * k;

      applyStarVisual(
        currentX,
        currentY,
        currentSizePx,
        currentRot,
        activeAccentHex,
        'difference',
        state.opacity
      );

      if (halo) {
        const [ar, ag, ab] = hexToRgb(activeAccentHex);
        const auraScale = isCompact ? 0.55 : Math.min(1.4, Math.max(0.6, state.trailSpreadPx / 18));
        halo.style.opacity = String((0.38 * auraScale).toFixed(3));
        halo.style.boxShadow = 'none';
        halo.style.background = `radial-gradient(circle, rgba(${ar}, ${ag}, ${ab}, 0.55) 0%, rgba(${ar}, ${ag}, ${ab}, 0.18) 46%, rgba(${ar}, ${ag}, ${ab}, 0) 74%)`;
      }

      if (
        Math.abs(smoothedVelocity) > 8 ||
        Math.abs(targetX - currentX) > 0.8 ||
        Math.abs(targetY - currentY) > 0.8 ||
        Math.abs(targetSizePx - currentSizePx) > 0.5
      ) {
        rafId = window.requestAnimationFrame(updateFrame);
      } else {
        rafId = 0;
      }
    };

    const scheduleTick = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(updateFrame);
      }
    };

    const onRouteChange = () => {
      lastScrollY = window.scrollY;
      smoothedVelocity = 0;
      wasSettled = false;
      if (starWrapperRef.current) {
        starWrapperRef.current.setAttribute('data-settled', 'false');
        starWrapperRef.current.style.mixBlendMode = 'difference';
      }
      window.dispatchEvent(new CustomEvent('mahop:star-dock-status', { detail: false }));
      window.requestAnimationFrame(scheduleTick);
    };

    const onSceneAccent = (e: Event) => {
      const custom = e as CustomEvent<string>;
      const accent = custom.detail || '#F5F3EF';
      activeAccentHex = accent;
      document.documentElement.style.setProperty('--star-accent', accent);
      if (starGraphicRef.current && !wasSettled) {
        starGraphicRef.current.style.color = accent;
      }
    };

    const onPointerOver = (e: Event) => {
      const target = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"]'
      ) as HTMLElement | null;
      if (target) {
        target.dataset.starLit = 'true';
      }
    };
    const onPointerOut = (e: Event) => {
      const target = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"]'
      ) as HTMLElement | null;
      if (target) {
        delete target.dataset.starLit;
      }
    };

    document.documentElement.style.setProperty('--star-accent', '#F5F3EF');
    scheduleTick();

    window.addEventListener('scroll', scheduleTick, { passive: true });
    window.addEventListener('resize', scheduleTick, { passive: true });
    window.addEventListener('mahop:route-change', onRouteChange);
    window.addEventListener('mahop:scene-accent', onSceneAccent);
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleTick);
      window.removeEventListener('resize', scheduleTick);
      window.removeEventListener('mahop:route-change', onRouteChange);
      window.removeEventListener('mahop:scene-accent', onSceneAccent);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, [reducedMotion, introStarGuideRef]);

  if (reducedMotion) return null;

  return (
    <div
      ref={starWrapperRef}
      data-testid="journey-star-companion"
      data-settled="false"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 will-change-transform"
      style={{ opacity: 1 }}
    >
      <div
        ref={haloRef}
        className="pointer-events-none absolute -inset-[45%] rounded-full opacity-20"
      />
      <div
        ref={starGraphicRef}
        className="relative flex items-center justify-center text-[#F5F3EF] will-change-transform"
        style={{ width: `${COMPANION_BASE_PX}px`, height: `${COMPANION_BASE_PX}px` }}
      >
        <BrandStar className="w-full h-full block" />
      </div>
    </div>
  );
}
