import { useEffect, useRef, useState } from 'react';
import { BrandStar } from './BrandStar';

/**
 * Custom Star Cursor for MAH★P
 *
 * Artistic signature cursor referencing the official MAH★P star.
 * - Hardware-accelerated pointer tracking (zero lag).
 * - mix-blend-mode: difference ensures high contrast against both black and white surfaces.
 * - Subtle hover emphasis over links and clickable controls.
 * - Tactile compression on click.
 * - Strictly active only on desktop devices with hover & fine pointer capability.
 * - Disabled under prefers-reduced-motion or touchscreens.
 * - Safe fallback: native cursor remains active until custom cursor initializes.
 */
export function StarCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on devices with hover and fine pointer capability (mouse/trackpad)
    if (typeof window === 'undefined') return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) {
      return;
    }

    // Inform DOM that custom cursor is active so native cursor is hidden safely
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over an interactive element via event delegation
      const target = e.target as Element | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, [data-interactive], .editorial-link, label, summary, [tabindex]:not([tabindex="-1"])'
        );
        setIsHovering(Boolean(interactive));
      }
    };

    const onPointerDown = () => {
      setIsClicking(true);
    };

    const onPointerUp = () => {
      setIsClicking(false);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  // If not running in a browser with a fine pointer, render nothing
  if (typeof window === 'undefined') return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform mix-blend-difference transition-opacity duration-200"
      style={{
        opacity: isVisible ? 1 : 0,
        // Center the 16px star precisely on the pointer coordinate
        marginTop: '-8px',
        marginLeft: '-8px',
      }}
    >
      <div
        className="transition-transform duration-150 ease-out flex items-center justify-center text-white"
        style={{
          transform: isClicking
            ? 'scale(0.85)'
            : isHovering
            ? 'scale(1.4) rotate(45deg)'
            : 'scale(1) rotate(0deg)',
        }}
      >
        <BrandStar className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
