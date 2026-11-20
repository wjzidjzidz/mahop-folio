import { useEffect, useRef } from 'react';
import { BrandStar } from './BrandStar';
import { computeStarCompanionState } from '../utils/journeyLogic';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Single persistent BrandStar companion guiding the visitor along the quiet
 * right periphery during scroll and gliding into #footer-star-dock on the white finale.
 */
export function JourneyStarCompanion() {
  const starWrapperRef = useRef<HTMLDivElement>(null);
  const starGraphicRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    let rafId = 0;

    const updatePosition = () => {
      rafId = 0;
      const wrapper = starWrapperRef.current;
      const graphic = starGraphicRef.current;
      if (!wrapper || !graphic) return;

      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      const dock = document.getElementById('footer-star-dock');
      let footerDockVisible = false;
      if (dock) {
        const rect = dock.getBoundingClientRect();
        footerDockVisible = rect.top < window.innerHeight * 0.78;
      }

      const state = computeStarCompanionState(progress, footerDockVisible, false);

      if (state.settledInFooter) {
        wrapper.style.opacity = '0';
        return;
      }

      const isCompact = window.innerWidth < 640;
      const xPercent = isCompact ? Math.min(93.5, state.xPercent) : state.xPercent;
      const xPx = (xPercent / 100) * window.innerWidth;
      const yPx = (state.yPercent / 100) * window.innerHeight;
      wrapper.style.opacity = String(state.opacity);
      wrapper.style.transform = `translate3d(${xPx}px, ${yPx}px, 0) translate(-50%, -50%)`;
      graphic.style.transform = `scale(${state.scale}) rotate(${state.rotationDeg}deg)`;
    };

    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updatePosition);
      }
    };

    const onSceneAccent = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (starGraphicRef.current && custom.detail) {
        starGraphicRef.current.style.color = custom.detail;
      }
    };

    updatePosition();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('mahop:scene-accent', onSceneAccent);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('mahop:scene-accent', onSceneAccent);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={starWrapperRef}
      data-testid="journey-star-companion"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 transition-opacity duration-300 will-change-transform mix-blend-difference"
      style={{ opacity: 0.88 }}
    >
      <div
        ref={starGraphicRef}
        className="flex items-center justify-center transition-colors duration-500 text-[#F5F3EF]"
      >
        <BrandStar className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
}
