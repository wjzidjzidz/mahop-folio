import { BrandStar } from './BrandStar';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'loader';
  as?: 'span' | 'div' | 'h1' | 'h2';
  className?: string;
  starClassName?: string;
}

/**
 * Official BrandLogo Component: MAH★P
 * Assembled from "MAH", precision 5-point vector Star icon, and "P".
 * Pure unboxed exhibition typography across all display scales.
 */
export function BrandLogo({
  size = 'md',
  as: Component = 'span',
  className = '',
  starClassName = '',
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
      sizeClasses = 'text-[22vw] sm:text-[20vw] lg:text-[18vw] leading-[0.78]';
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
        className="inline-flex items-center justify-center mx-[0.045em] shrink-0"
        aria-hidden="true"
      >
        <BrandStar
          className={`text-current inline-block ${starClassName}`}
          style={{ width: '0.68em', height: '0.68em' }}
        />
      </span>
      <span className="leading-none">P</span>
    </Component>
  );
}
