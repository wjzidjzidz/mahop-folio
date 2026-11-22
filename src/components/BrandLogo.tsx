import type React from 'react';
import { BrandStar } from './BrandStar';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'loader' | 'contact';
  as?: 'span' | 'div' | 'h1' | 'h2';
  className?: string;
  starClassName?: string;
  starHidden?: boolean;
  starSlotId?: 'hero' | 'intro' | 'footer';
  starSizeEm?: number;
  letterOpacity?: number;
  letterSpreadPx?: number;
  leftGlyphStyle?: React.CSSProperties;
  rightGlyphStyle?: React.CSSProperties;
}

/**
 * Official BrandLogo Component: MAH★P
 * Assembled from "MAH", precision 5-point vector Star icon, and "P".
 * Supports reserved optical star slots (`starHidden` + `starSlotId`) so the single
 * persistent JourneyStarCompanion docks pixel-perfectly without duplicate stars.
 */
export function BrandLogo({
  size = 'md',
  as: Component = 'span',
  className = '',
  starClassName = '',
  starHidden = false,
  starSlotId,
  starSizeEm,
  letterOpacity,
  letterSpreadPx = 0,
  leftGlyphStyle,
  rightGlyphStyle,
}: BrandLogoProps) {
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'text-lg sm:text-xl';
      break;
    case 'md':
      sizeClasses = 'text-2xl sm:text-3xl';
      break;
    case 'lg':
      sizeClasses = 'text-4xl sm:text-6xl';
      break;
    case 'hero':
      sizeClasses = 'text-[22vw] sm:text-[19vw] lg:text-[17vw] leading-[0.8]';
      break;
    case 'loader':
      sizeClasses = 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl';
      break;
    case 'contact':
      sizeClasses = 'text-[17vw] sm:text-[13vw] lg:text-[10.5vw] leading-[0.82]';
      break;
    default:
      sizeClasses = '';
  }

  const resolvedStarEm =
    starSizeEm ?? (size === 'hero' ? 0.88 : size === 'contact' ? 0.82 : 0.68);
  const starMarginClass =
    size === 'hero'
      ? 'mx-[0.09em]'
      : size === 'contact'
        ? 'mx-[0.08em]'
        : 'mx-[0.045em]';

  const leftStyle: React.CSSProperties = {
    opacity: letterOpacity,
    transform: letterSpreadPx ? `translate3d(${-letterSpreadPx}px, 0, 0)` : undefined,
    ...leftGlyphStyle,
  };

  const rightStyle: React.CSSProperties = {
    opacity: letterOpacity,
    transform: letterSpreadPx ? `translate3d(${letterSpreadPx}px, 0, 0)` : undefined,
    ...rightGlyphStyle,
  };

  return (
    <Component
      className={`inline-flex items-center font-display uppercase tracking-tighter select-none ${sizeClasses} ${className}`}
      aria-label="MAH★P"
    >
      <span className="leading-none inline-block" style={leftStyle}>
        MAH
      </span>
      <span
        data-star-slot={starSlotId}
        data-hero-star-slot={starSlotId === 'hero' ? 'true' : undefined}
        data-intro-star-slot={starSlotId === 'intro' ? 'true' : undefined}
        data-footer-star-slot={starSlotId === 'footer' ? 'true' : undefined}
        data-footer-star-emblem={starSlotId === 'footer' ? 'true' : undefined}
        className={`inline-flex items-center justify-center shrink-0 ${starMarginClass}`}
        aria-hidden="true"
      >
        <BrandStar
          className={`text-current inline-block ${starClassName}`}
          style={{
            width: `${resolvedStarEm}em`,
            height: `${resolvedStarEm}em`,
            opacity: starHidden ? 0 : 1,
          }}
        />
      </span>
      <span className="leading-none inline-block" style={rightStyle}>
        P
      </span>
    </Component>
  );
}
