import React from 'react';

interface BrandStarProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Official MAH★P Star Icon
 * High-precision, solid 5-point vector silhouette.
 * Sharp, geometrically balanced, perfectly aligned with Anton display typography.
 */
export function BrandStar({ className = '', size, ...props }: BrandStarProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {/* Precision 5-point solid star coordinates centered at (12, 12) */}
      <path d="M12 2.25L14.92 8.76L22 9.44L16.63 14.15L18.2 21.12L12 17.38L5.8 21.12L7.37 14.15L2 9.44L9.08 8.76L12 2.25Z" />
    </svg>
  );
}
