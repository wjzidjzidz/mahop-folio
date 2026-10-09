import type { ImgHTMLAttributes } from 'react';

export interface PortfolioAsset {
  slot: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  publicationReview?: 'rights' | 'consent';
}

interface PortfolioImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
  asset: PortfolioAsset;
  eager?: boolean;
}

export function PortfolioImage({ asset, eager = false, ...props }: PortfolioImageProps) {
  return (
    <img
      {...props}
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
