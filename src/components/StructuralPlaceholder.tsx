import React from 'react';

export interface StructuralPlaceholderProps {
  id: string; // e.g. "HOME-HERO-TBD", "SWATCH-01", "MAHP-COLLAGE-01"
  aspectRatio?: string; // e.g. "16/9", "4/5", "1/1", "3/4"
  variant?: 'stage' | 'cast' | 'white-collage' | 'chapter' | 'aurora' | 'swatch';
  accentColor?: string; // e.g. "#7B7373", "#95BFBC", "#7C11B8"
  title?: string;
  sourceRef?: string;
  className?: string;
  showStatusBadge?: boolean;
}

export function StructuralPlaceholder({
  id,
  aspectRatio = '4/3',
  variant = 'stage',
  accentColor,
  title,
  sourceRef,
  className = '',
  showStatusBadge = true,
}: StructuralPlaceholderProps) {
  // Variant specifics
  const isWhiteCollage = variant === 'white-collage';
  const isCast = variant === 'cast';
  const isSwatch = variant === 'swatch';

  return (
    <div
      className={`relative w-full overflow-hidden border transition-all animate-image-reveal ${
        isWhiteCollage
          ? 'bg-[#F9F8F6] text-black border-[#E2DFD8] shadow-sm animate-white-interlude'
          : isCast
          ? 'bg-[#0A0A0A] text-[#F5F3EF] border-[#F5F3EF]/20'
          : 'bg-[#080808] text-[#F5F3EF] border-[#F5F3EF]/15'
      } ${className}`}
      style={{
        aspectRatio,
        borderColor: accentColor ? `${accentColor}55` : undefined,
      }}
      role="img"
      aria-label={`Structural placeholder for ${title || id}`}
    >
      {/* Background Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${id}`}
            width={isSwatch ? '16' : '32'}
            height={isSwatch ? '16' : '32'}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={isSwatch ? 'M 16 0 L 0 0 0 16' : 'M 32 0 L 0 0 0 32'}
              fill="none"
              stroke={isWhiteCollage ? '#000000' : accentColor || '#F5F3EF'}
              strokeWidth="0.5"
              strokeDasharray={isCast ? '2,2' : undefined}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* Silhouette Graphic for Cut-outs with M05 Gentle Drift */}
      {isCast && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none md:animate-cutout-drift">
          <svg viewBox="0 0 100 120" className="w-2/3 h-2/3 stroke-[#F5F3EF] fill-none" strokeWidth="0.75">
            <path d="M 50 15 C 42 15 42 28 50 28 C 58 28 58 15 50 15 Z" />
            <path d="M 50 28 L 50 42" />
            <path d="M 32 42 Q 50 38 68 42 L 75 75 L 60 78 L 55 110 L 45 110 L 40 78 L 25 75 Z" />
            <path d="M 32 42 L 20 65" />
            <path d="M 68 42 L 80 65" />
          </svg>
        </div>
      )}

      {/* Tactile Weave Representation for Swatches */}
      {isSwatch && (
        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
          <svg viewBox="0 0 80 80" className="w-full h-full stroke-current fill-none" strokeWidth="0.6">
            <line x1="0" y1="20" x2="80" y2="20" />
            <line x1="0" y1="40" x2="80" y2="40" />
            <line x1="0" y1="60" x2="80" y2="60" />
            <line x1="20" y1="0" x2="20" y2="80" />
            <line x1="40" y1="0" x2="40" y2="80" />
            <line x1="60" y1="0" x2="60" y2="80" />
            <circle cx="40" cy="40" r="18" strokeDasharray="2 3" />
          </svg>
        </div>
      )}

      {/* Decorative Technical Crosshairs */}
      <div
        className={`absolute top-2 left-2 text-[9px] font-mono tracking-tighter opacity-60 ${
          isWhiteCollage ? 'text-black' : 'text-[#B8B5B1]'
        }`}
      >
        + {id}
      </div>
      <div
        className={`absolute top-2 right-2 text-[9px] font-mono tracking-tighter opacity-60 ${
          isWhiteCollage ? 'text-black' : 'text-[#B8B5B1]'
        }`}
      >
        [{aspectRatio}]
      </div>

      {/* Centered Editorial Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
        {title && (
          <h4
            className={`text-sm sm:text-base md:text-lg font-display uppercase tracking-wide mb-1 ${
              isWhiteCollage ? 'text-black' : 'text-[#F5F3EF]'
            }`}
          >
            {title}
          </h4>
        )}
        {sourceRef && (
          <p
            className={`text-[10px] sm:text-xs font-mono tracking-wider mb-2 ${
              isWhiteCollage ? 'text-black/60' : 'text-[#B8B5B1]'
            }`}
          >
            {sourceRef}
          </p>
        )}

        {showStatusBadge && (
          <div
            className={`mt-2 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase border ${
              isWhiteCollage
                ? 'bg-black/5 text-black/80 border-black/20'
                : 'bg-black/60 text-[#B8B5B1] border-[#F5F3EF]/20'
            }`}
          >
            PLACEHOLDER — REPLACE WITH VERIFIED MAHOP ASSET
          </div>
        )}
      </div>

      {/* Accent Corner Flash if accent provided */}
      {accentColor && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
          style={{
            backgroundColor: accentColor,
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
