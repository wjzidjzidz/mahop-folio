import React from 'react';
import { BrandStar } from './BrandStar';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'loader';
  as?: 'span' | 'div' | 'h1' | 'h2';
  className?: string;
  starClassName?: string;
  withDot?: boolean;
}

/**
 * Official BrandLogo Component: MAH★P
 * Assembled from "MAH", precision vector Star icon, and "P".
 * Consistent typography, optical kerning, and baseline alignment across all sizes.
 */
export function BrandLogo({
  size = 'md',
  as: Component = 'span',
  className = '',
  starClassName = '',
  withDot = false,
}: BrandLogoProps) {
  // Size-specific typography styles
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'text-lg sm:text-xl';
      break;
    case 'md':
      sizeClasses = 'text-2xl sm:text-3xl';
      break;
    case 'lg':
      sizeClasses = 'text-4xl sm:text-5xl';
      break;
    case 'hero':
      sizeClasses = 'text-[19vw] sm:text-[18vw] lg:text-[16vw] leading-[0.8]';
      break;
    case 'loader':
      sizeClasses = 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl';
      break;
    default:
      sizeClasses = '';
  }

  return (
    <Component
      className={`inline-flex items-center font-display uppercase tracking-tighter select-none ${sizeClasses} ${className}`}
      aria-label="MAH★P"
    >
      <span className="leading-none">MAH</span>
      <span
        className="inline-flex items-center justify-center mx-[0.05em] shrink-0"
        aria-hidden="true"
      >
        <BrandStar
          className={`text-current inline-block ${starClassName}`}
          style={{ width: '0.68em', height: '0.68em' }}
        />
      </span>
      <span className="leading-none">P</span>
      {withDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#F5F3EF]/40 ml-2 self-baseline mb-1 group-hover:bg-[#F5F3EF] transition-colors"
          aria-hidden="true"
        />
      )}
    </Component>
  );
}
