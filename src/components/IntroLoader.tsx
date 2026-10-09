import { useState, useEffect, useRef } from 'react';
import { BrandStar } from './BrandStar';

interface IntroLoaderProps {
  onComplete?: () => void;
}

/**
 * Signature Intro Loader for MAH★P
 *
 * Sequence:
 * Phase A (0–550ms): The isolated star appears and rotates 360deg at viewport center.
 * Phase B (450–1000ms): Letters "MAH" and "P" arrive from left & right, locking onto baseline.
 * Phase C (1000–1250ms): The assembled MAH★P mark settles in pristine theatrical darkness.
 * Phase D (1250–1750ms): Theatrical curtain split reveals the underlying stage.
 *
 * Finished by ~1.75s. Dismisses immediately under prefers-reduced-motion.
 */
export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<'animating' | 'revealing' | 'done'>('animating');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      onCompleteRef.current?.();
      return;
    }

    // Phase D: Trigger theatrical curtain reveal at 1250ms
    const revealTimer = setTimeout(() => {
      setPhase('revealing');
    }, 1250);

    // Complete and unmount overlay at 1750ms
    const completeTimer = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current?.();
    }, 1750);

    // Safety timeout ensuring overlay never traps the user
    const safetyTimer = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current?.();
    }, 2200);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  const isRevealing = phase === 'revealing';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="MAH★P opening stage"
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{
        pointerEvents: isRevealing ? 'none' : 'auto',
      }}
    >
      {/* Left Theatrical Curtain Panel */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-black z-0 border-r border-[#F5F3EF]/10 ${
          isRevealing ? 'animate-curtain-left' : ''
        }`}
        aria-hidden="true"
      />

      {/* Right Theatrical Curtain Panel */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-black z-0 border-l border-[#F5F3EF]/10 ${
          isRevealing ? 'animate-curtain-right' : ''
        }`}
        aria-hidden="true"
      />

      {/* Centerpiece Stage: Assembling MAH★P Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          className={`flex items-center font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F3EF] tracking-tighter select-none ${
            isRevealing ? 'animate-intro-logo-exit' : ''
          }`}
          aria-label="MAH★P"
        >
          {/* MAH slides in from left */}
          <span className="animate-intro-mah leading-none inline-block">
            MAH
          </span>

          {/* Precision Star rotates in isolation first */}
          <span
            className="inline-flex items-center justify-center mx-[0.05em] shrink-0"
            aria-hidden="true"
          >
            <BrandStar
              className="text-[#F5F3EF] animate-intro-star inline-block"
              style={{ width: '0.68em', height: '0.68em' }}
            />
          </span>

          {/* P slides in from right */}
          <span className="animate-intro-p leading-none inline-block">
            P
          </span>
        </div>
      </div>
    </div>
  );
}
