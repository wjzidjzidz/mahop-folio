import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AuroraPunkBackdropProps {
  scrollProgress: number;
}

/**
 * Pure 2D Underground Punk Visual Stage for AURORA DE LIAGE X AURO DA'PUNK.
 * Zero Three.js / WebGL. Combines procedural Canvas 2D xerox/concrete texture,
 * torn wheatpaste poster layers, SVG black crochet netting overlay, and restrained
 * crimson/gold/purple photocopy print displacement.
 */
export function AuroraPunkBackdrop({ scrollProgress }: AuroraPunkBackdropProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  // Lightweight procedural xerox/concrete print surface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#0B0A0C';
    ctx.fillRect(0, 0, size, size);

    // Deterministic distressed concrete + photocopy speckles
    let s = 1337;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };

    for (let i = 0; i < 2200; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const w = 1 + rand() * 3.5;
      const h = 1 + rand() * 2;
      const light = rand() > 0.72;
      ctx.fillStyle = light
        ? `rgba(218, 212, 200, ${0.04 + rand() * 0.09})`
        : `rgba(26, 22, 28, ${0.25 + rand() * 0.3})`;
      ctx.fillRect(x, y, w, h);
    }

    // Subdued xerox scan lines
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    for (let y = 0; y < size; y += 6) {
      ctx.fillRect(0, y, size, 1);
    }
  }, []);

  const p = reducedMotion ? 0 : scrollProgress;
  const jitterX = reducedMotion ? 0 : Math.sin(p * Math.PI * 6) * 14;

  return (
    <div
      aria-hidden="true"
      data-testid="aurora-punk-2d-stage"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#09080A]"
    >
      {/* Distressed concrete & photocopy wall base */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Aged gold, deep rust, and restrained underground violet tonal washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 24%, rgba(145,12,12,0.34) 0%, transparent 50%), radial-gradient(circle at 82% 62%, rgba(124,17,184,0.28) 0%, transparent 52%), radial-gradient(circle at 52% 45%, rgba(201,162,77,0.18) 0%, transparent 48%)',
        }}
      />

      {/* Torn paper wheatpaste background strips drifting diagonally */}
      <div
        className="torn-paper-edge absolute top-[8%] -left-[4%] w-[46vw] max-w-[520px] h-28 sm:h-40 opacity-45"
        style={{
          background: 'linear-gradient(105deg, #272324 0%, #5C1A1A 58%, #1C191E 100%)',
          transform: `translate3d(${jitterX * 1.4}px, ${p * -45}px, 0) rotate(-3deg)`,
        }}
      />

      <div
        className="torn-paper-edge absolute top-[40%] right-[-5%] w-[40vw] max-w-[460px] h-32 sm:h-48 opacity-40"
        style={{
          background: 'linear-gradient(135deg, #C9A24D 0%, #4A371E 48%, #141215 100%)',
          transform: `translate3d(${-jitterX * 1.6}px, ${(p - 0.5) * 70}px, 0) rotate(2.5deg)`,
        }}
      />

      <div
        className="torn-paper-edge absolute bottom-[14%] left-[6%] w-[52vw] max-w-[580px] h-24 sm:h-36 opacity-34"
        style={{
          background: 'linear-gradient(90deg, rgba(228,223,212,0.45) 0%, rgba(124,17,184,0.34) 65%, transparent 100%)',
          transform: `translate3d(${jitterX}px, 0, 0) rotate(1.4deg)`,
        }}
      />

      {/* SVG Black Crochet / Open-Mesh Netting Overlay referencing p03 collage fabric */}
      <svg
        className="absolute inset-0 w-full h-full opacity-42"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate3d(0, ${(p - 0.5) * -36}px, 0)`,
        }}
      >
        <defs>
          <pattern id="aurora-crochet-mesh" width="38" height="38" patternUnits="userSpaceOnUse">
            <path
              d="M19 0 L38 19 L19 38 L0 19 Z"
              fill="none"
              stroke="rgba(228, 223, 212, 0.28)"
              strokeWidth="1"
            />
            <circle cx="19" cy="19" r="1.6" fill="rgba(201, 162, 77, 0.36)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aurora-crochet-mesh)" />
      </svg>

      {/* Raw edge vignette so Brazy studio photography reads clearly */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.68) 100%)',
        }}
      />
    </div>
  );
}
