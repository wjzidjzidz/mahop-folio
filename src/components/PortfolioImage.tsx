import type { ImgHTMLAttributes } from 'react';
import { OPTIMIZED_ASSET_VARIANTS } from '../data/optimizedAssetMap';

export interface PortfolioAsset {
  slot: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  publicationReview?: 'rights' | 'consent';
}

interface PortfolioImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
  asset: PortfolioAsset;
  eager?: boolean;
  priority?: boolean;
  sizes?: string;
}

export function PortfolioImage({
  asset,
  eager = false,
  priority = false,
  sizes,
  ...props
}: PortfolioImageProps) {
  const variants = OPTIMIZED_ASSET_VARIANTS[asset.src];
  const hasResponsive640 = Boolean(variants?.avif640 || variants?.webp640);
  const effectiveSizes = hasResponsive640
    ? sizes || '(max-width: 767px) 92vw, 100vw'
    : sizes;

  const avifSrcSet = variants?.avif
    ? variants.avif640
      ? `${variants.avif640} 640w, ${variants.avif} ${variants.width}w`
      : variants.avif
    : undefined;

  const webpSrcSet = variants?.webp
    ? variants.webp640
      ? `${variants.webp640} 640w, ${variants.webp} ${variants.width}w`
      : variants.webp
    : undefined;

  return (
    <picture className="contents">
      {avifSrcSet && (
        <source type="image/avif" srcSet={avifSrcSet} sizes={effectiveSizes} />
      )}
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={effectiveSizes} />
      )}
      <img
        {...props}
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={effectiveSizes}
        loading={eager || priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

