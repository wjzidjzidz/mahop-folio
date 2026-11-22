import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BotanicalGroundBackdropProps {
  scrollProgress: number;
}

/**
 * Pure 2D Nocturnal Botanical Environment for Act II (Editorial Studio Photography).
 * Zero Three.js / WebGL.
 * Deep black stage layered with acid-green (#39FF14) and botanical green (#345727 / #485E39 / #618F65)
 * organic botanical silhouettes, swaying stems, evolving contour rings, and drifting spores.
 */
export function BotanicalGroundBackdrop({ scrollProgress }: BotanicalGroundBackdropProps) {
  const reducedMotion = useReducedMotion();
  const sporeCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  // Lightweight 2D Canvas floating chlorophyll spore & organic dew particle drift
  useEffect(() => {
    const canvas = sporeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spores = Array.from({ length: 48 }, (_, i) => ({
      xNorm: ((i * 73) % 97) / 97,
      yNorm: ((i * 41) % 89) / 89,
      radius: 1.4 + (i % 4) * 1.1,
      driftSpeed: 0.25 + (i % 6) * 0.08,
      swayAmp: 8 + (i % 5) * 6,
      phase: i * 0.92,
      acid: i % 3 === 0,
    }));

    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = reducedMotion ? 0 : (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pOffset = reducedMotion ? 0 : progressRef.current * 90;

      spores.forEach((sp) => {
        const px =
          sp.xNorm * w +
          Math.sin(elapsed * sp.driftSpeed + sp.phase) * sp.swayAmp;
        const py =
          ((sp.yNorm * h - elapsed * 14 * sp.driftSpeed - pOffset + h * 2) % h);
        const alpha = sp.acid
          ? 0.28 + Math.sin(elapsed * 1.4 + sp.phase) * 0.14
          : 0.2 + Math.cos(elapsed * 1.1 + sp.phase) * 0.1;

        const r = sp.radius * 3.2;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        if (sp.acid) {
          grad.addColorStop(0, `rgba(57, 255, 20, ${alpha})`);
          grad.addColorStop(0.45, `rgba(97, 143, 101, ${alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, `rgba(147, 186, 150, ${alpha})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    if (reducedMotion) {
      draw(performance.now());
    } else {
      rafId = window.requestAnimationFrame(draw);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  const p = reducedMotion ? 0 : scrollProgress;
  const parallaxSlow = (p - 0.5) * -65;
  const parallaxMid = (p - 0.5) * -125;
  const parallaxFast = (p - 0.5) * 95;

  return (
    <div
      aria-hidden="true"
      data-testid="botanical-ground-2d-stage"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#020402]"
    >
      {/* Nocturnal emerald & acid-green radial atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 24%, rgba(57,255,20,0.08) 0%, transparent 44%), radial-gradient(circle at 82% 58%, rgba(52,87,39,0.28) 0%, transparent 52%), radial-gradient(circle at 46% 85%, rgba(97,143,101,0.16) 0%, transparent 48%)',
        }}
      />

      {/* Layer 1: Fluid evolving organic botanical contour curves (SVG) */}
      <svg
        className={`absolute inset-0 w-full h-full opacity-45 ${
          reducedMotion ? '' : 'animate-botanical-breathe'
        }`}
        viewBox="0 0 1440 1600"
        preserveAspectRatio="none"
        style={{ transform: `translate3d(0, ${parallaxSlow}px, 0)` }}
      >
        <defs>
          <linearGradient id="botanical-contour-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#485E39" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020402" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="botanical-contour-b" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#618F65" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#39FF14" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#020402" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sweeping organic botanical veins / contour arcs */}
        <path
          d="M-60,340 C260,180 510,560 880,310 C1140,140 1320,390 1510,270"
          fill="none"
          stroke="url(#botanical-contour-a)"
          strokeWidth="2.2"
        />
        <path
          d="M-80,780 C240,940 560,620 920,840 C1180,990 1340,720 1520,860"
          fill="none"
          stroke="url(#botanical-contour-b)"
          strokeWidth="1.8"
          strokeDasharray="10 14"
        />
        <path
          d="M120,1260 C410,1040 690,1360 1020,1140 C1230,1000 1380,1220 1500,1160"
          fill="none"
          stroke="#39FF14"
          strokeOpacity="0.28"
          strokeWidth="1.4"
        />
        {/* Subtle white contrast hairline registration ring */}
        <ellipse
          cx="1180"
          cy="440"
          rx="260"
          ry="135"
          transform="rotate(-18 1180 440)"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.12"
          strokeWidth="0.9"
          strokeDasharray="4 12"
        />
      </svg>

      {/* Layer 2: Organic botanical silhouettes & tall nocturnal stems — Left perimeter */}
      <svg
        className={`absolute top-[4%] -left-[3%] w-[36vw] max-w-[440px] h-[88%] opacity-75 ${
          reducedMotion ? '' : 'animate-botanical-sway-a'
        }`}
        viewBox="0 0 360 1100"
        preserveAspectRatio="xMinYMid meet"
        style={{ transform: `translate3d(0, ${parallaxMid}px, 0)` }}
      >
        <path
          d="M42,1100 C56,820 120,620 74,340 C58,240 94,120 142,46"
          fill="none"
          stroke="#39FF14"
          strokeOpacity="0.55"
          strokeWidth="2.4"
        />
        <path
          d="M78,860 C150,790 218,808 242,742 C175,748 118,782 78,860 Z"
          fill="#345727"
          fillOpacity="0.62"
        />
        <path
          d="M84,610 C18,540 -8,548 12,486 C58,505 88,548 84,610 Z"
          fill="#39FF14"
          fillOpacity="0.26"
        />
        <path
          d="M82,420 C168,350 236,368 272,292 C196,304 128,348 82,420 Z"
          fill="#485E39"
          fillOpacity="0.58"
        />
        <path
          d="M114,195 C154,142 198,148 228,108 C184,112 140,145 114,195 Z"
          fill="#39FF14"
          fillOpacity="0.48"
        />
        <circle cx="142" cy="46" r="5" fill="#39FF14" fillOpacity="0.88" />
        <circle cx="272" cy="292" r="3.5" fill="#FFFFFF" fillOpacity="0.45" />
      </svg>

      {/* Layer 3: Organic botanical silhouettes & curving reeds — Right perimeter */}
      <svg
        className={`absolute top-[10%] -right-[2%] w-[34vw] max-w-[420px] h-[85%] opacity-78 ${
          reducedMotion ? '' : 'animate-botanical-sway-b'
        }`}
        viewBox="0 0 360 1050"
        preserveAspectRatio="xMaxYMid meet"
        style={{ transform: `translate3d(0, ${parallaxFast}px, 0)` }}
      >
        <path
          d="M298,1050 C272,780 198,580 246,320 C268,200 226,110 182,40"
          fill="none"
          stroke="#618F65"
          strokeOpacity="0.65"
          strokeWidth="2.2"
        />
        <path
          d="M254,740 C166,685 112,704 82,638 C148,648 214,680 254,740 Z"
          fill="#39FF14"
          fillOpacity="0.22"
        />
        <path
          d="M236,490 C318,430 344,442 354,378 C298,392 254,430 236,490 Z"
          fill="#345727"
          fillOpacity="0.72"
        />
        <path
          d="M242,290 C158,236 102,248 76,184 C146,194 206,232 242,290 Z"
          fill="#618F65"
          fillOpacity="0.42"
        />
        <path
          d="M240,1040 C205,830 296,650 282,420"
          fill="none"
          stroke="#39FF14"
          strokeOpacity="0.42"
          strokeWidth="1.4"
          strokeDasharray="6 10"
        />
        <circle cx="182" cy="40" r="4.5" fill="#39FF14" fillOpacity="0.85" />
      </svg>

      {/* Layer 4: Foreground organic ground reeds framing bottom border */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-36 sm:h-52 opacity-72"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
      >
        <path
          d="M0,240 Q120,110 185,48 Q210,130 255,240 Z"
          fill="#11220E"
        />
        <path
          d="M110,240 Q190,135 235,64 Q255,155 290,240 Z"
          fill="#345727"
          fillOpacity="0.45"
        />
        <path
          d="M540,240 Q610,165 655,112 Q675,180 715,240 Z"
          fill="#39FF14"
          fillOpacity="0.14"
        />
        <path
          d="M1080,240 Q1170,120 1235,54 Q1260,150 1310,240 Z"
          fill="#1A3315"
          fillOpacity="0.8"
        />
        <path
          d="M1240,240 Q1335,140 1390,72 Q1415,165 1440,240 Z"
          fill="#39FF14"
          fillOpacity="0.18"
        />
      </svg>

      {/* Layer 5: Floating luminous chlorophyll spores (Canvas 2D) */}
      <canvas
        ref={sporeCanvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
