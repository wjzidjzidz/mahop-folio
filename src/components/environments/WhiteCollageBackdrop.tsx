import { useReducedMotion } from '../../hooks/useReducedMotion';

interface WhiteCollageBackdropProps {
  scrollProgress: number;
}

/**
 * Pure 2D Experimental Fashion-Print Stage for MAH★P Act I (White Collage Interlude).
 * Zero Three.js / WebGL. Strictly uses fluorescent green (#39FF14), black (#000000), and white (#FFFFFF)
 * with animated torn-paper strips, horizontal/vertical kinetic masks, and brutalist geometry.
 */
export function WhiteCollageBackdrop({ scrollProgress }: WhiteCollageBackdropProps) {
  const reducedMotion = useReducedMotion();
  const p = reducedMotion ? 0 : scrollProgress;

  return (
    <div
      aria-hidden="true"
      data-testid="white-collage-2d-stage"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-white"
    >
      {/* Top horizontal acid-green razor strip sweeping with scroll */}
      <div
        className="absolute top-[7%] -left-[8%] h-10 sm:h-16 w-[62%] sm:w-[46%] torn-paper-edge transition-transform duration-150"
        style={{
          backgroundColor: '#39FF14',
          transform: `translate3d(${p * 110}px, 0, 0) rotate(-1.5deg)`,
          opacity: 0.88,
        }}
      />

      {/* Contrast black paper cut-out ribbon slicing top right */}
      <div
        className="absolute top-[13%] -right-[6%] h-6 sm:h-9 w-[54%] sm:w-[38%] bg-black transition-transform duration-150"
        style={{
          transform: `translate3d(${-p * 120}px, ${p * 18}px, 0) rotate(1.2deg)`,
        }}
      />

      {/* Vertical fluorescent-green kinetic editorial field on left flank */}
      <div
        className="hidden sm:block absolute top-[26%] left-[3%] w-4 lg:w-7 h-[46%] bg-[#39FF14]"
        style={{
          transform: `translate3d(0, ${(p - 0.5) * -90}px, 0)`,
          opacity: 0.72,
        }}
      />

      {/* Torn-paper geometric black & white split band across center threshold */}
      <div
        className="absolute top-[48%] inset-x-0 h-28 sm:h-40 opacity-90"
        style={{
          transform: `translate3d(${(p - 0.5) * 80}px, 0, 0)`,
        }}
      >
        <div
          className="torn-paper-edge w-[74%] ml-auto h-full"
          style={{
            background:
              'repeating-linear-gradient(90deg, #000000 0px, #000000 14px, #FFFFFF 14px, #FFFFFF 28px, #39FF14 28px, #39FF14 34px)',
            opacity: 0.14,
          }}
        />
      </div>

      {/* Lower dynamic fluorescent green geometric block + black cutout bar */}
      <div
        className="absolute bottom-[12%] left-[4%] w-[44vw] max-w-[460px] h-14 sm:h-24 torn-paper-edge"
        style={{
          backgroundColor: '#39FF14',
          opacity: 0.68,
          transform: `translate3d(${(p - 0.5) * 95}px, 0, 0) rotate(1deg)`,
        }}
      />
      <div
        className="absolute bottom-[8%] right-[3%] w-[36vw] max-w-[380px] h-4 sm:h-6 bg-black"
        style={{
          transform: `translate3d(${(p - 0.5) * -105}px, 0, 0)`,
        }}
      />

      {/* Crisp SVG registration / brutalist print crop marks (fluorescent green & black) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="none"
      >
        <line x1="60" y1="0" x2="60" y2="1600" stroke="#000000" strokeWidth="1" strokeDasharray="10 14" />
        <line x1="1140" y1="0" x2="1140" y2="1600" stroke="#39FF14" strokeWidth="2" />
        <rect x="920" y="220" width="210" height="8" fill="#39FF14" />
        <rect x="78" y="1180" width="160" height="6" fill="#000000" />
      </svg>
    </div>
  );
}
