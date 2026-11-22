import { useEffect, useRef } from 'react';
import type { PlanetKind } from '../../utils/journeyLogic';

interface Planetary2DWorldsProps {
  activePlanet: PlanetKind;
  reducedMotion: boolean;
  parallaxRef: React.MutableRefObject<number>;
}

/**
 * Lightweight 2D Canvas atmospheric drift layer adapted uniquely per planet:
 * - Mercury: rising incandescent mineral embers & thermal motes
 * - Uranus: suspended translucent cyan ice prisms gliding horizontally
 * - Pluto: sparse, slow cryogenic frost grains conveying vast stillness
 * - Mars: sweeping diagonal iron-oxide dust current & warm ochre motes
 */
function PlanetAtmosphereParticles({
  planet,
  reducedMotion,
  parallaxRef,
}: {
  planet: PlanetKind;
  reducedMotion: boolean;
  parallaxRef: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    const count = planet === 'pluto' ? 28 : 42;
    const particles = Array.from({ length: count }, (_, i) => ({
      xNorm: ((i * 67 + 19) % 97) / 97,
      yNorm: ((i * 43 + 11) % 89) / 89,
      size: 1.2 + (i % 4) * 0.95,
      speed: 0.22 + (i % 5) * 0.11,
      phase: i * 1.13,
      variant: i % 3,
    }));

    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = reducedMotion ? 0 : (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const pScroll = reducedMotion ? 0 : parallaxRef.current;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        let px = pt.xNorm * w;
        let py = pt.yNorm * h;

        if (planet === 'mercury') {
          px += Math.sin(elapsed * pt.speed * 1.5 + pt.phase) * 14;
          py = (pt.yNorm * h - elapsed * 24 * pt.speed - pScroll * 95 + h * 3) % h;
          const alpha = 0.22 + (Math.sin(elapsed * 2.1 + pt.phase) * 0.14 + 0.14);
          const r = pt.size * 3.4;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
          if (pt.variant === 0) {
            grad.addColorStop(0, `rgba(255, 198, 128, ${alpha})`);
            grad.addColorStop(0.5, `rgba(217, 138, 78, ${alpha * 0.45})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
          } else {
            grad.addColorStop(0, `rgba(228, 214, 206, ${alpha * 0.8})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
          }
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (planet === 'uranus') {
          px = (pt.xNorm * w + elapsed * 14 * pt.speed + pScroll * 55 + w * 2) % w;
          py += Math.sin(elapsed * pt.speed + pt.phase) * 10 - pScroll * 40;
          py = ((py % h) + h) % h;
          const alpha = 0.18 + Math.cos(elapsed * 1.2 + pt.phase) * 0.09;
          const s = pt.size * 2.6;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(pt.phase + elapsed * 0.18);
          ctx.fillStyle =
            pt.variant === 0
              ? `rgba(174, 213, 210, ${alpha})`
              : `rgba(149, 191, 188, ${alpha * 0.78})`;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.65, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.65, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (planet === 'pluto') {
          px = (pt.xNorm * w + Math.sin(elapsed * 0.25 + pt.phase) * 6 + w) % w;
          py = (pt.yNorm * h + elapsed * 4 * pt.speed - pScroll * 38 + h * 2) % h;
          const alpha = 0.16 + Math.sin(elapsed * 0.6 + pt.phase) * 0.08;
          ctx.fillStyle =
            pt.variant === 0
              ? `rgba(182, 196, 210, ${alpha})`
              : `rgba(142, 146, 150, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(px, py, pt.size * 1.35, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Mars: diagonal windborne ochre & terracotta dust stream
          px = (pt.xNorm * w + elapsed * 28 * pt.speed + pScroll * 80 + w * 2) % w;
          py = (pt.yNorm * h + elapsed * 7 * pt.speed - pScroll * 45 + h * 2) % h;
          const alpha = 0.2 + Math.sin(elapsed * 1.4 + pt.phase) * 0.1;
          const r = pt.size * 3.1;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
          grad.addColorStop(
            0,
            pt.variant === 0
              ? `rgba(232, 127, 62, ${alpha})`
              : `rgba(198, 141, 104, ${alpha * 0.85})`
          );
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
  }, [planet, reducedMotion, parallaxRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function Mercury2DWorld({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div data-testid="planet-2d-world-mercury" className="absolute inset-0 overflow-hidden bg-[#080606]">
      {/* Scorched solar corona & metallic obsidian atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 18%, rgba(235, 174, 114, 0.34) 0%, rgba(144, 133, 132, 0.18) 32%, rgba(8, 6, 6, 0.96) 76%)',
        }}
      />

      {/* Luminous scorched solar disc & metallic flare */}
      <div
        className="absolute -top-12 right-[-6%] w-[58vw] max-w-[340px] aspect-square rounded-full opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 224, 186, 0.34) 0%, rgba(217, 138, 78, 0.16) 44%, rgba(0, 0, 0, 0) 74%)',
          transform: 'translate3d(calc(var(--p2d-parallax, 0) * -28px), calc(var(--p2d-parallax, 0) * 22px), 0)',
        }}
      />

      {/* Heat-shimmer mirage ribbons across mid-horizon */}
      <svg
        className={`absolute inset-x-0 top-[24%] w-full h-[36%] ${reducedMotion ? '' : 'animate-mercury-shimmer'}`}
        viewBox="0 0 800 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="p2d-mercury-heat-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#908584" stopOpacity="0" />
            <stop offset="35%" stopColor="#E5B88B" stopOpacity="0.34" />
            <stop offset="68%" stopColor="#D98A4E" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#908584" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-20,120 Q180,82 380,124 T820,112"
          fill="none"
          stroke="url(#p2d-mercury-heat-a)"
          strokeWidth="2.4"
        />
        <path
          d="M-20,196 Q210,164 430,202 T820,188"
          fill="none"
          stroke="url(#p2d-mercury-heat-a)"
          strokeWidth="1.6"
          strokeDasharray="18 10"
        />
      </svg>

      {/* Abstract metallic mineral crystal & fractured basalt formations */}
      <svg
        className="absolute inset-0 w-full h-full opacity-85"
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: 'translate3d(0, calc(var(--p2d-parallax, 0) * -42px), 0)',
        }}
      >
        <defs>
          <linearGradient id="p2d-mercury-shard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8AFAF" stopOpacity="0.56" />
            <stop offset="48%" stopColor="#5C5454" stopOpacity="0.64" />
            <stop offset="100%" stopColor="#141111" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="p2d-mercury-ridge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D3635" />
            <stop offset="100%" stopColor="#090707" />
          </linearGradient>
        </defs>

        {/* Floating mineral crystal shards */}
        <polygon points="74,210 116,162 128,236 86,262" fill="url(#p2d-mercury-shard)" opacity="0.65" />
        <polygon points="482,300 546,246 534,344 468,354" fill="url(#p2d-mercury-shard)" opacity="0.58" />
        <polygon points="94,520 144,478 132,576 74,562" fill="url(#p2d-mercury-shard)" opacity="0.48" />

        {/* Distant jagged crater rim */}
        <path
          d="M0,690 L75,638 L155,668 L242,608 L330,654 L418,596 L510,642 L600,614 L600,1000 L0,1000 Z"
          fill="#1B1717"
        />
        <path
          d="M0,690 L75,638 L155,668 L242,608 L330,654 L418,596 L510,642 L600,614"
          fill="none"
          stroke="#C89E78"
          strokeOpacity="0.46"
          strokeWidth="1.4"
        />
        {/* Foreground obsidian volcanic ridges */}
        <path
          d="M0,782 L98,722 L188,768 L286,704 L388,756 L496,694 L600,742 L600,1000 L0,1000 Z"
          fill="url(#p2d-mercury-ridge)"
        />
        <path
          d="M188,768 L286,704 L344,734"
          fill="none"
          stroke="#E5B88B"
          strokeOpacity="0.34"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

function Uranus2DWorld({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div data-testid="planet-2d-world-uranus" className="absolute inset-0 overflow-hidden bg-[#03090C]">
      {/* Cold frozen methane cyan radial bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 26% 24%, rgba(174, 213, 210, 0.28) 0%, rgba(19, 104, 150, 0.24) 42%, rgba(3, 9, 12, 0.98) 82%)',
        }}
      />

      {/* Oblique translucent crystalline rings cutting across the atmosphere */}
      <svg
        className={`absolute inset-0 w-full h-full opacity-85 ${reducedMotion ? '' : 'animate-uranus-aurora'}`}
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: 'translate3d(0, calc(var(--p2d-parallax, 0) * -28px), 0)',
        }}
      >
        <defs>
          <linearGradient id="p2d-uranus-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#AED5D2" stopOpacity="0" />
            <stop offset="32%" stopColor="#D6F4F2" stopOpacity="0.52" />
            <stop offset="68%" stopColor="#95BFBC" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#136896" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="p2d-uranus-veil" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#136896" stopOpacity="0" />
            <stop offset="50%" stopColor="#AED5D2" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#95BFBC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Tilted signature Uranus ice arcs */}
        <g transform="rotate(-24 300 420)">
          <ellipse
            cx="300"
            cy="410"
            rx="440"
            ry="108"
            fill="none"
            stroke="url(#p2d-uranus-ring)"
            strokeWidth="2.2"
          />
          <ellipse
            cx="300"
            cy="410"
            rx="380"
            ry="84"
            fill="none"
            stroke="#AED5D2"
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeDasharray="10 14"
          />
          <ellipse
            cx="300"
            cy="410"
            rx="510"
            ry="136"
            fill="none"
            stroke="#95BFBC"
            strokeOpacity="0.2"
            strokeWidth="1.2"
          />
        </g>

        {/* Ethereal fluid aurora curtains */}
        <path
          d="M-60,260 C130,180 280,310 470,210 C550,170 620,210 660,190 L660,340 C510,360 320,280 -60,360 Z"
          fill="url(#p2d-uranus-veil)"
        />
        <path
          d="M-40,560 C160,480 340,610 640,470 L640,590 C380,670 160,560 -40,640 Z"
          fill="url(#p2d-uranus-veil)"
          opacity="0.7"
        />

        {/* Suspended translucent crystal prisms */}
        <polygon points="108,290 128,250 148,290 128,334" fill="#AED5D2" fillOpacity="0.18" stroke="#D8F5F3" strokeOpacity="0.38" strokeWidth="1" />
        <polygon points="468,210 492,164 516,210 492,258" fill="#95BFBC" fillOpacity="0.16" stroke="#AED5D2" strokeOpacity="0.34" strokeWidth="1" />
      </svg>

      {/* Glacial icy horizon dunes */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-[32%] opacity-88"
        viewBox="0 0 600 320"
        preserveAspectRatio="none"
        style={{
          transform: 'translate3d(0, calc(var(--p2d-parallax, 0) * -18px), 0)',
        }}
      >
        <path
          d="M0,150 Q160,92 310,142 T600,118 L600,320 L0,320 Z"
          fill="#091D26"
        />
        <path
          d="M0,150 Q160,92 310,142 T600,118"
          fill="none"
          stroke="#AED5D2"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <path
          d="M0,224 Q190,178 390,218 T600,196 L600,320 L0,320 Z"
          fill="#040D12"
        />
      </svg>
    </div>
  );
}

function Pluto2DWorld({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div data-testid="planet-2d-world-pluto" className="absolute inset-0 overflow-hidden bg-[#040507]">
      {/* Deep desaturated slate & steel-blue cryogenic void */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 64% 26%, rgba(142, 158, 176, 0.18) 0%, rgba(69, 70, 68, 0.14) 38%, rgba(4, 5, 7, 0.98) 78%)',
        }}
      />

      {/* Distant Twin-Moon Charon & pale cryogenic halo */}
      <div
        className={`absolute top-[11%] right-[14%] w-16 h-16 sm:w-24 sm:h-24 rounded-full ${
          reducedMotion ? '' : 'animate-planetary-drift-slow'
        }`}
        style={{
          background:
            'radial-gradient(circle at 36% 34%, #CBD6E2 0%, #6A727A 45%, #16181C 85%)',
          boxShadow: '0 0 32px rgba(182, 196, 210, 0.16)',
          transform: 'translate3d(calc(var(--p2d-parallax, 0) * -22px), 0, 0)',
        }}
      />

      {/* Tombaugh pale nitrogen-frost basin glow in far distance */}
      <div
        className="absolute bottom-[22%] left-[12%] w-[70vw] max-w-[380px] h-32 rounded-full opacity-45 blur-2xl"
        style={{
          background: 'radial-gradient(ellipse, rgba(182, 196, 210, 0.28) 0%, rgba(0, 0, 0, 0) 72%)',
        }}
      />

      {/* Stark cryogenic ridges & layered frost plains */}
      <svg
        className="absolute inset-0 w-full h-full opacity-92"
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: 'translate3d(0, calc(var(--p2d-parallax, 0) * -32px), 0)',
        }}
      >
        <defs>
          <linearGradient id="p2d-pluto-glacier" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#32373E" />
            <stop offset="100%" stopColor="#080A0D" />
          </linearGradient>
        </defs>

        {/* Minimal crisp horizon ring suggesting vast planetary curvature */}
        <ellipse
          cx="300"
          cy="1040"
          rx="520"
          ry="440"
          fill="none"
          stroke="#B6C4D2"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />

        {/* Far jagged nitrogen-ice peaks */}
        <path
          d="M0,670 L88,632 L162,658 L256,612 L348,652 L442,606 L526,644 L600,624 L600,1000 L0,1000 Z"
          fill="#15181C"
        />
        <path
          d="M0,670 L88,632 L162,658 L256,612 L348,652 L442,606 L526,644 L600,624"
          fill="none"
          stroke="#A6B4C2"
          strokeOpacity="0.34"
          strokeWidth="1.1"
        />

        {/* Foreground dark slate glacier basin */}
        <path
          d="M0,762 L134,718 L244,748 L368,708 L482,746 L600,722 L600,1000 L0,1000 Z"
          fill="url(#p2d-pluto-glacier)"
        />
        <path
          d="M0,762 L134,718 L244,748 L368,708"
          fill="none"
          stroke="#D0DCE8"
          strokeOpacity="0.24"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function Mars2DWorld({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div data-testid="planet-2d-world-mars" className="absolute inset-0 overflow-hidden bg-[#080302]">
      {/* Warm directional ochre & deep terracotta atmospheric lighting */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 78% 18%, rgba(232, 127, 62, 0.36) 0%, rgba(154, 48, 22, 0.24) 36%, rgba(8, 3, 2, 0.96) 78%)',
        }}
      />

      {/* Directional warm light shaft */}
      <div
        className="absolute -top-24 right-[-20%] w-[120%] h-[78%] opacity-35"
        style={{
          background:
            'linear-gradient(125deg, rgba(232,127,62,0) 20%, rgba(232,127,62,0.28) 48%, rgba(198,141,104,0.08) 70%, rgba(0,0,0,0) 90%)',
          transform: 'translate3d(calc(var(--p2d-parallax, 0) * -26px), 0, 0)',
        }}
      />

      {/* Sweeping moving iron-oxide dust currents */}
      <svg
        className={`absolute inset-x-0 top-[20%] w-full h-[46%] ${reducedMotion ? '' : 'animate-mars-dust'}`}
        viewBox="0 0 800 420"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="p2d-mars-dust-band" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E87F3E" stopOpacity="0" />
            <stop offset="45%" stopColor="#E87F3E" stopOpacity="0.24" />
            <stop offset="75%" stopColor="#C68D68" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6B1111" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-60,120 C180,75 440,175 860,92 L860,192 C480,254 220,162 -60,210 Z"
          fill="url(#p2d-mars-dust-band)"
        />
        <path
          d="M-40,290 C220,248 480,334 840,268 L840,342 C520,388 210,318 -40,356 Z"
          fill="url(#p2d-mars-dust-band)"
          opacity="0.72"
        />
      </svg>

      {/* Stratified canyon mesas, terracotta dunes & volcanic magma fissures */}
      <svg
        className="absolute inset-0 w-full h-full opacity-92"
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: 'translate3d(0, calc(var(--p2d-parallax, 0) * -40px), 0)',
        }}
      >
        <defs>
          <linearGradient id="p2d-mars-mesa-far" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5C2012" />
            <stop offset="100%" stopColor="#1B0805" />
          </linearGradient>
          <linearGradient id="p2d-mars-mesa-near" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2B0E08" />
            <stop offset="100%" stopColor="#090302" />
          </linearGradient>
        </defs>

        {/* Stratified far canyon mesas */}
        <path
          d="M0,664 L78,664 L106,608 L194,608 L224,658 L352,658 L384,598 L482,598 L516,650 L600,644 L600,1000 L0,1000 Z"
          fill="url(#p2d-mars-mesa-far)"
        />
        <path
          d="M106,608 L194,608 M384,598 L482,598"
          stroke="#E87F3E"
          strokeOpacity="0.52"
          strokeWidth="1.6"
        />

        {/* Foreground sweeping rust dunes & warm magma veins */}
        <path
          d="M0,748 Q160,692 318,744 T600,718 L600,1000 L0,1000 Z"
          fill="url(#p2d-mars-mesa-near)"
        />
        <path
          d="M0,748 Q160,692 318,744 T600,718"
          fill="none"
          stroke="#C68D68"
          strokeOpacity="0.38"
          strokeWidth="1.3"
        />
        {/* Glowing crust magma fissure */}
        <path
          d="M142,846 L196,832 L248,864 L322,848 L368,876"
          fill="none"
          stroke="#FF6E2E"
          strokeOpacity="0.58"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function Planetary2DWorlds({
  activePlanet,
  reducedMotion,
  parallaxRef,
}: Planetary2DWorldsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {activePlanet === 'mercury' && <Mercury2DWorld reducedMotion={reducedMotion} />}
      {activePlanet === 'uranus' && <Uranus2DWorld reducedMotion={reducedMotion} />}
      {activePlanet === 'pluto' && <Pluto2DWorld reducedMotion={reducedMotion} />}
      {activePlanet === 'mars' && <Mars2DWorld reducedMotion={reducedMotion} />}
      <PlanetAtmosphereParticles
        planet={activePlanet}
        reducedMotion={reducedMotion}
        parallaxRef={parallaxRef}
      />
    </div>
  );
}
