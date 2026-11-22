import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useExhibitionStage } from '../context/ExhibitionStageContext';
import { computeIntroTimelineMetrics, type IntroTimelineMetrics } from '../utils/journeyLogic';

interface IntroLoaderProps {
  onComplete: () => void;
}

/**
 * Pure Editorial Loading Sequence (Zero Three.js):
 * - Stage 1 (writing): Light beam curves across M A H ★ P while the ONE persistent
 *   JourneyStarCompanion traces the path and unlocks each letter in sequence.
 * - Stage 2 (star-glow): Star docks at full Hero scale in [data-intro-star-slot] with a
 *   refined CSS/SVG radial starlight shimmer over pure deep black #000000.
 * - Stage 3 (hero-handoff): Loader fades seamlessly onto the identical Hero wordmark slot
 *   so the exact same visual star remains present with zero jump, cut, or duplicate star.
 */
export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const reducedMotion = useReducedMotion();
  const { introStateRef, introStarGuideRef } = useExhibitionStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const traceSvgRef = useRef<SVGSVGElement>(null);
  const tracePathRef = useRef<SVGPathElement>(null);
  const glowOrbRef = useRef<HTMLDivElement>(null);
  const introStarSlotRef = useRef<HTMLSpanElement>(null);
  const completedRef = useRef(false);

  const [revealedCount, setRevealedCount] = useState(0); // 0..5 across M, A, H, ★, P
  const [phase, setPhase] = useState<IntroTimelineMetrics['phase']>('writing');

  const finishImmediately = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--mahop-hero-wordmark', '1');
    rootStyle.setProperty('--mahop-nav-reveal', '1');
    introStateRef.current = {
      active: false,
      phase: 'settled',
      starGlow: 0,
      heroWordmarkOpacity: 1,
    };
    introStarGuideRef.current = {
      active: false,
      mode: 'slot',
      clientX: 0,
      clientY: 0,
      sizePx: 24,
      rotationDeg: 0,
      starGlow: 0,
    };
    onComplete();
  };

  useEffect(() => {
    if (reducedMotion) {
      finishImmediately();
      return;
    }

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--mahop-hero-wordmark', '0');
    rootStyle.setProperty('--mahop-nav-reveal', '0');

    let rafId = 0;
    let lastTimestamp = performance.now();
    let elapsed = 0;
    let warmupFrames = 0;
    let maxRevealed = 0;
    let lastPhase: IntroTimelineMetrics['phase'] = 'writing';

    const pathLen = tracePathRef.current?.getTotalLength() || 520;
    const safetyTimer = window.setTimeout(() => finishImmediately(), 5200);

    const tick = (now: number) => {
      if (warmupFrames < 2) {
        warmupFrames += 1;
        lastTimestamp = now;
      } else {
        const dt = Math.min(0.1, Math.max(0.004, (now - lastTimestamp) / 1000));
        lastTimestamp = now;
        elapsed += dt;
      }

      const m = computeIntroTimelineMetrics(elapsed, false);

      introStateRef.current = {
        active: !m.isComplete,
        phase: m.phase,
        starGlow: m.starGlow,
        heroWordmarkOpacity: m.heroWordmarkOpacity,
      };

      rootStyle.setProperty('--mahop-hero-wordmark', String(m.heroWordmarkOpacity));
      rootStyle.setProperty('--mahop-nav-reveal', String(m.heroWordmarkOpacity));

      if (m.revealedCount > maxRevealed) {
        maxRevealed = m.revealedCount;
        setRevealedCount(m.revealedCount);
      }
      if (m.phase !== lastPhase) {
        lastPhase = m.phase;
        setPhase(m.phase);
      }

      // Calligraphic light trace across MAH★P
      const traceEl = tracePathRef.current;
      const svgEl = traceSvgRef.current;
      const wT = m.writeProgress;
      const writeEase = wT < 0.5 ? 2 * wT * wT : 1 - Math.pow(-2 * wT + 2, 2) / 2;

      if (traceEl) {
        traceEl.style.strokeDasharray = `${pathLen}`;
        traceEl.style.strokeDashoffset = `${pathLen * (1 - writeEase)}`;
        traceEl.style.opacity =
          elapsed < 1.44
            ? '0.72'
            : String(Math.max(0, 0.72 * (1 - (elapsed - 1.44) / 0.36)));
      }

      // Compute pixel coordinates for the ONE persistent star during Stage 1 writing -> Stage 2 logo star slot
      const slotEl = introStarSlotRef.current;
      const slotRect = slotEl?.getBoundingClientRect();
      const slotCenterX = slotRect ? slotRect.left + slotRect.width * 0.5 : window.innerWidth * 0.5;
      const slotCenterY = slotRect ? slotRect.top + slotRect.height * 0.5 : window.innerHeight * 0.5;
      const slotSizePx = slotRect && slotRect.width > 16 ? slotRect.width : Math.min(180, window.innerWidth * 0.16);

      if (traceEl && svgEl && m.starSettleT < 1) {
        const pt = traceEl.getPointAtLength(pathLen * writeEase);
        const svgRect = svgEl.getBoundingClientRect();
        const pathX = svgRect.left + (pt.x / 520) * svgRect.width;
        const pathY = svgRect.top + (pt.y / 140) * svgRect.height;
        const penSize = Math.min(44, Math.max(26, window.innerWidth * 0.032));
        const sT = m.starSettleT;

        introStarGuideRef.current = {
          active: true,
          mode: sT > 0.08 ? 'slot' : 'writing',
          clientX: pathX + (slotCenterX - pathX) * sT,
          clientY: pathY + (slotCenterY - pathY) * sT,
          sizePx: penSize + (slotSizePx - penSize) * sT,
          rotationDeg: (1 - sT) * (writeEase * 220),
          starGlow: m.starGlow,
        };
      } else {
        introStarGuideRef.current = {
          active: !m.isComplete,
          mode: 'slot',
          clientX: slotCenterX,
          clientY: slotCenterY,
          sizePx: slotSizePx,
          rotationDeg: 0,
          starGlow: m.starGlow,
        };
      }

      if (glowOrbRef.current && slotRect) {
        glowOrbRef.current.style.opacity = String(Number((m.starGlow * 0.72).toFixed(3)));
        glowOrbRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${(0.7 + m.starGlow * 0.45).toFixed(3)})`;
      }

      if (wordmarkWrapRef.current) {
        wordmarkWrapRef.current.style.opacity = String(m.loaderOpacity);
      }
      if (subtitleRef.current) {
        const subShow = m.revealedCount >= 5 ? 0.9 : 0;
        subtitleRef.current.style.opacity = String(subShow * m.loaderOpacity);
      }
      if (rootRef.current) {
        rootRef.current.style.opacity = String(m.loaderOpacity);
      }

      if (m.isComplete) {
        finishImmediately();
        return;
      }

      if (!completedRef.current) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(safetyTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      rootStyle.setProperty('--mahop-hero-wordmark', '1');
      rootStyle.setProperty('--mahop-nav-reveal', '1');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      data-testid="intro-loader"
      data-intro-phase={phase}
      role="status"
      aria-label="Loading MAH★P Nocturnal Textile Theatre"
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden px-4 ${
        phase === 'hero-handoff' || phase === 'settled'
          ? 'pointer-events-none'
          : 'pointer-events-auto'
      }`}
    >
      {/* Centered Pure-Black Logo Stage geometry matched 1:1 to Hero H1 for zero-jump handoff */}
      <div
        ref={wordmarkWrapRef}
        className="relative z-10 flex flex-col items-center justify-center text-center select-none"
      >
        <div className="relative inline-flex items-center font-display uppercase tracking-tighter text-[#F5F3EF] text-[22vw] sm:text-[19vw] lg:text-[17vw] leading-[0.8]">
          {/* Stage 1 Continuous Calligraphic Trace across M A H ★ P */}
          <svg
            ref={traceSvgRef}
            aria-hidden="true"
            viewBox="0 0 520 140"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-[4%] -inset-y-[10%] w-[108%] h-[120%]"
          >
            <path
              ref={tracePathRef}
              d="M 18 112 L 42 26 L 68 88 L 94 26 L 118 110 C 138 56 154 24 176 28 C 194 32 204 86 226 108 L 246 28 L 252 72 L 292 68 L 300 28 C 318 46 334 62 356 70 C 378 76 392 52 406 32 L 434 110 L 444 26 C 476 24 504 38 502 64 C 500 84 468 88 446 84"
              fill="none"
              stroke="rgba(245, 243, 239, 0.78)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span
            className="leading-none transition-all duration-300"
            style={{
              opacity: revealedCount >= 1 ? 1 : 0,
              transform: revealedCount >= 1 ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            M
          </span>
          <span
            className="leading-none transition-all duration-300"
            style={{
              opacity: revealedCount >= 2 ? 1 : 0,
              transform: revealedCount >= 2 ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            A
          </span>
          <span
            className="leading-none transition-all duration-300"
            style={{
              opacity: revealedCount >= 3 ? 1 : 0,
              transform: revealedCount >= 3 ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            H
          </span>

          {/* Exact Optical Slot Occupied by the ONE Persistent JourneyStarCompanion */}
          <span
            ref={introStarSlotRef}
            data-star-slot="intro"
            data-intro-star-slot="true"
            className="relative inline-flex items-center justify-center mx-[0.09em] shrink-0"
            style={{ width: '0.88em', height: '0.88em' }}
            aria-hidden="true"
          >
            {/* Stage 2 Refined Editorial Light Glow */}
            <div
              ref={glowOrbRef}
              className="pointer-events-none absolute top-1/2 left-1/2 w-[185%] h-[185%] rounded-full"
              style={{
                opacity: 0,
                background:
                  'radial-gradient(circle, rgba(245,243,239,0.28) 0%, rgba(245,243,239,0.09) 38%, rgba(0,0,0,0) 72%)',
              }}
            />
          </span>

          <span
            className="leading-none transition-all duration-300"
            style={{
              opacity: revealedCount >= 5 ? 1 : 0,
              transform: revealedCount >= 5 ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            P
          </span>
        </div>

        <p
          ref={subtitleRef}
          className="mt-6 sm:mt-8 font-serif italic text-lg sm:text-3xl text-[#F5F3EF]/90 tracking-wide px-4 text-center"
          style={{ opacity: 0 }}
        >
          Nocturnal Textile Theatre — Aurelia Mahop Di Toro
        </p>
      </div>

      {/* Accessible Non-Blocking Skip Control */}
      <button
        type="button"
        onClick={finishImmediately}
        className="pointer-events-auto absolute bottom-6 right-6 z-20 min-h-[44px] min-w-[44px] px-4 py-2 font-mono text-[10px] tracking-[0.26em] uppercase text-[#B8B5B1] hover:text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
      >
        Enter Stage
      </button>
    </div>
  );
}
