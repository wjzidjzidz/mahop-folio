import * as THREE from 'three';

export interface WebGLCapabilitiesReport {
  supported: boolean;
  isSoftwareGl: boolean;
  rendererName: string;
}

let cachedReport: WebGLCapabilitiesReport | null = null;

export function probeWebGLCapabilities(): WebGLCapabilitiesReport {
  if (cachedReport) return cachedReport;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cachedReport = { supported: false, isSoftwareGl: false, rendererName: 'ssr' };
    return cachedReport;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null) ||
      (canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null);

    if (!gl) {
      cachedReport = { supported: false, isSoftwareGl: false, rendererName: 'unavailable' };
      return cachedReport;
    }

    let rendererName = '';
    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugExt) {
      rendererName = String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '');
    } else {
      rendererName = String(gl.getParameter(gl.RENDERER) || '');
    }

    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererName);

    const loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) {
      loseCtx.loseContext();
    }

    cachedReport = {
      supported: true,
      isSoftwareGl,
      rendererName,
    };
    return cachedReport;
  } catch {
    cachedReport = { supported: false, isSoftwareGl: false, rendererName: 'error' };
    return cachedReport;
  }
}

export function resetWebGLProbeCacheForTesting() {
  cachedReport = null;
}

function seededNoise(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface ProceduralPlanetTextures {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  emissiveMap?: THREE.CanvasTexture;
  ringMap?: THREE.CanvasTexture;
  dispose: () => void;
}

export function createPlanetTextures(
  planet: 'mercury' | 'uranus' | 'pluto' | 'mars',
  size = 512,
  maxAnisotropy = 4
): ProceduralPlanetTextures {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  const rand = seededNoise(
    planet === 'mercury' ? 101 : planet === 'uranus' ? 202 : planet === 'pluto' ? 303 : 404
  );

  // 1. Base coat by planetary identity
  if (planet === 'mercury') {
    const grad = cCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#5A5555');
    grad.addColorStop(0.38, '#8E8887');
    grad.addColorStop(0.68, '#6B6665');
    grad.addColorStop(1, '#3D3A3A');
    cCtx.fillStyle = grad;
    rCtx.fillStyle = '#707070';
  } else if (planet === 'uranus') {
    const grad = cCtx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#5B8E90');
    grad.addColorStop(0.28, '#95BFBC');
    grad.addColorStop(0.5, '#C4E4E2');
    grad.addColorStop(0.76, '#7BB0AE');
    grad.addColorStop(1, '#4C7A7D');
    cCtx.fillStyle = grad;
    rCtx.fillStyle = '#858585';
  } else if (planet === 'pluto') {
    const grad = cCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#27292C');
    grad.addColorStop(0.45, '#454644');
    grad.addColorStop(0.75, '#72767A');
    grad.addColorStop(1, '#1A1B1E');
    cCtx.fillStyle = grad;
    rCtx.fillStyle = '#C8C8C8';
  } else {
    const grad = cCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#782610');
    grad.addColorStop(0.4, '#D9662C');
    grad.addColorStop(0.72, '#E87F3E');
    grad.addColorStop(1, '#4A1409');
    cCtx.fillStyle = grad;
    rCtx.fillStyle = '#D0D0D0';
  }
  cCtx.fillRect(0, 0, size, size);
  rCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  let emissiveMap: THREE.CanvasTexture | undefined;
  let ringMap: THREE.CanvasTexture | undefined;

  if (planet === 'uranus') {
    // Soft banded cyan/turquoise icy cloud currents + faint polar vortex
    for (let i = 0; i < 38; i++) {
      const y = rand() * size;
      const h = 4 + rand() * 26;
      cCtx.fillStyle =
        rand() > 0.45 ? 'rgba(218, 246, 244, 0.16)' : 'rgba(54, 102, 108, 0.16)';
      cCtx.fillRect(0, y, size, h);
      bCtx.fillStyle = rand() > 0.5 ? 'rgba(205,205,205,0.08)' : 'rgba(95,95,95,0.08)';
      bCtx.fillRect(0, y, size, h);
    }

    // Ring gradient map
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 256;
    ringCanvas.height = 32;
    const rgCtx = ringCanvas.getContext('2d')!;
    const rg = rgCtx.createLinearGradient(0, 0, 256, 0);
    rg.addColorStop(0, 'rgba(149,191,188,0)');
    rg.addColorStop(0.18, 'rgba(174,213,210,0.45)');
    rg.addColorStop(0.32, 'rgba(149,191,188,0.12)');
    rg.addColorStop(0.48, 'rgba(215,244,242,0.58)');
    rg.addColorStop(0.68, 'rgba(149,191,188,0.18)');
    rg.addColorStop(0.85, 'rgba(174,213,210,0.42)');
    rg.addColorStop(1, 'rgba(149,191,188,0)');
    rgCtx.fillStyle = rg;
    rgCtx.fillRect(0, 0, 256, 32);
    ringMap = new THREE.CanvasTexture(ringCanvas);
    ringMap.colorSpace = THREE.SRGBColorSpace;
  } else {
    // Mineral / rocky texture speckling
    const speckCount = planet === 'pluto' ? 500 : 720;
    for (let i = 0; i < speckCount; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1 + rand() * 14;
      const bright = rand() > 0.52;

      if (planet === 'mercury') {
        cCtx.fillStyle = bright
          ? `rgba(218, 214, 212, ${0.08 + rand() * 0.16})`
          : `rgba(28, 26, 26, ${0.08 + rand() * 0.18})`;
        rCtx.fillStyle = bright ? 'rgba(65,65,65,0.28)' : 'rgba(190,190,190,0.22)';
      } else if (planet === 'pluto') {
        cCtx.fillStyle = bright
          ? `rgba(176, 186, 198, ${0.08 + rand() * 0.16})`
          : `rgba(16, 17, 20, ${0.12 + rand() * 0.22})`;
        rCtx.fillStyle = bright ? 'rgba(95,95,95,0.24)' : 'rgba(225,225,225,0.22)';
      } else {
        cCtx.fillStyle = bright
          ? `rgba(246, 162, 98, ${0.08 + rand() * 0.18})`
          : `rgba(60, 16, 8, ${0.1 + rand() * 0.22})`;
        rCtx.fillStyle = 'rgba(180,180,180,0.22)';
      }

      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.fill();

      rCtx.beginPath();
      rCtx.arc(x, y, r, 0, Math.PI * 2);
      rCtx.fill();

      bCtx.fillStyle = bright
        ? `rgba(218,218,218,${0.12 + rand() * 0.18})`
        : `rgba(42,42,42,${0.14 + rand() * 0.22})`;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Impact craters & mineral rays
    const craterCount = planet === 'mercury' ? 68 : planet === 'mars' ? 42 : 34;
    for (let i = 0; i < craterCount; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 6 + rand() * 26;

      cCtx.strokeStyle =
        planet === 'mercury' ? 'rgba(232,228,225,0.22)' : 'rgba(255,255,255,0.10)';
      cCtx.lineWidth = 1.6;
      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.stroke();

      cCtx.fillStyle = 'rgba(12,10,12,0.28)';
      cCtx.beginPath();
      cCtx.arc(x + 1.5, y + 1.5, r * 0.7, 0, Math.PI * 2);
      cCtx.fill();

      bCtx.strokeStyle = 'rgba(245,245,245,0.58)';
      bCtx.lineWidth = 2.2;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.stroke();

      bCtx.fillStyle = 'rgba(25,25,25,0.62)';
      bCtx.beginPath();
      bCtx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Mars glowing volcanic magma tectonic fissures
    if (planet === 'mars') {
      const emCanvas = document.createElement('canvas');
      emCanvas.width = size;
      emCanvas.height = size;
      const eCtx = emCanvas.getContext('2d')!;
      eCtx.fillStyle = '#000000';
      eCtx.fillRect(0, 0, size, size);

      for (let v = 0; v < 18; v++) {
        let px = rand() * size;
        let py = rand() * size;
        eCtx.strokeStyle = v % 2 === 0 ? 'rgba(255, 118, 42, 0.72)' : 'rgba(210, 48, 12, 0.62)';
        eCtx.lineWidth = 1.2 + rand() * 2.2;
        eCtx.beginPath();
        eCtx.moveTo(px, py);
        const steps = 6 + Math.floor(rand() * 6);
        for (let s = 0; s < steps; s++) {
          px += (rand() - 0.5) * 65;
          py += (rand() - 0.5) * 55;
          eCtx.lineTo(px, py);
        }
        eCtx.stroke();
      }
      emissiveMap = new THREE.CanvasTexture(emCanvas);
      emissiveMap.colorSpace = THREE.SRGBColorSpace;
      emissiveMap.anisotropy = maxAnisotropy;
    }

    // Pluto nitrogen frost heart/basins
    if (planet === 'pluto') {
      for (let p = 0; p < 5; p++) {
        const fx = size * (0.2 + rand() * 0.6);
        const fy = size * (0.25 + rand() * 0.5);
        const fr = 28 + rand() * 52;
        const frost = cCtx.createRadialGradient(fx, fy, 4, fx, fy, fr);
        frost.addColorStop(0, 'rgba(188, 198, 210, 0.36)');
        frost.addColorStop(1, 'rgba(188, 198, 210, 0)');
        cCtx.fillStyle = frost;
        cCtx.fillRect(0, 0, size, size);
      }
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;

  return {
    map,
    bumpMap,
    roughnessMap,
    emissiveMap,
    ringMap,
    dispose: () => {
      map.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
      emissiveMap?.dispose();
      ringMap?.dispose();
    },
  };
}

export interface UrbanTextureSet {
  concreteMap: THREE.CanvasTexture;
  concreteBump: THREE.CanvasTexture;
  posterPurple: THREE.CanvasTexture;
  posterCrimson: THREE.CanvasTexture;
  dispose: () => void;
}

export function createUrbanGalleryTextures(size = 512, maxAnisotropy = 4): UrbanTextureSet {
  const rand = seededNoise(909);

  // 1. Poured concrete wall color + bump
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const ctx = cCanvas.getContext('2d')!;

  const bCanvas = document.createElement('canvas');
  bCanvas.width = size;
  bCanvas.height = size;
  const bCtx = bCanvas.getContext('2d')!;

  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Concrete board-form seams
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 2;
  bCtx.strokeStyle = 'rgba(30,30,30,0.6)';
  bCtx.lineWidth = 2;
  for (let y = 0; y < size; y += size / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
    bCtx.beginPath();
    bCtx.moveTo(0, y);
    bCtx.lineTo(size, y);
    bCtx.stroke();
  }

  for (let i = 0; i < 1600; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const w = 1 + rand() * 8;
    const h = 1 + rand() * 4;
    const shade = 20 + Math.floor(rand() * 42);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade + 3}, ${0.14 + rand() * 0.25})`;
    ctx.fillRect(x, y, w, h);

    const bShade = 95 + Math.floor(rand() * 68);
    bCtx.fillStyle = `rgba(${bShade}, ${bShade}, ${bShade}, 0.28)`;
    bCtx.fillRect(x, y, w, h);
  }

  // Abstract punk spray-paint drips & gestural marks in #7C11B8 & #7B0000
  const washes = [
    { x: size * 0.28, y: size * 0.42, r: size * 0.36, color: '124, 17, 184', a: 0.42 },
    { x: size * 0.76, y: size * 0.62, r: size * 0.32, color: '123, 0, 0', a: 0.36 },
    { x: size * 0.55, y: size * 0.24, r: size * 0.24, color: '165, 158, 170', a: 0.14 },
  ];
  washes.forEach((w) => {
    const g = ctx.createRadialGradient(w.x, w.y, 4, w.x, w.y, w.r);
    g.addColorStop(0, `rgba(${w.color}, ${w.a})`);
    g.addColorStop(1, `rgba(${w.color}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });

  // Expressive abstract punk brush/spray arcs (non-textual)
  for (let s = 0; s < 14; s++) {
    ctx.strokeStyle =
      s % 3 === 0
        ? 'rgba(124, 17, 184, 0.48)'
        : s % 3 === 1
          ? 'rgba(123, 0, 0, 0.42)'
          : 'rgba(228, 224, 218, 0.22)';
    ctx.lineWidth = 2 + rand() * 6;
    ctx.beginPath();
    const sx = rand() * size;
    const sy = rand() * size;
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + (rand() - 0.5) * 160, sy + (rand() - 0.5) * 120, sx + (rand() - 0.5) * 200, sy + (rand() - 0.5) * 160);
    ctx.stroke();
  }

  // Vertical paint drips
  for (let d = 0; d < 26; d++) {
    const dx = rand() * size;
    const dy = rand() * size * 0.7;
    const dl = 18 + rand() * 85;
    ctx.strokeStyle = d % 2 === 0 ? 'rgba(124, 17, 184, 0.32)' : 'rgba(123, 0, 0, 0.28)';
    ctx.lineWidth = 1.5 + rand() * 2;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.lineTo(dx + (rand() - 0.5) * 3, dy + dl);
    ctx.stroke();
  }

  // 2. Torn wheatpaste poster textures
  const makePoster = (bg: string, stripe: string, seedOffset: number): THREE.CanvasTexture => {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 256;
    pCanvas.height = 384;
    const pCtx = pCanvas.getContext('2d')!;
    const pRand = seededNoise(999 + seedOffset);

    pCtx.fillStyle = bg;
    pCtx.fillRect(0, 0, 256, 384);

    // Torn paper layers
    for (let i = 0; i < 6; i++) {
      pCtx.fillStyle = i % 2 === 0 ? stripe : 'rgba(245, 243, 239, 0.14)';
      pCtx.beginPath();
      pCtx.moveTo(0, 30 + i * 56);
      for (let x = 0; x <= 256; x += 24) {
        pCtx.lineTo(x, 30 + i * 56 + (pRand() - 0.5) * 18);
      }
      pCtx.lineTo(256, 70 + i * 56);
      pCtx.lineTo(0, 70 + i * 56);
      pCtx.closePath();
      pCtx.fill();
    }

    const pTex = new THREE.CanvasTexture(pCanvas);
    pTex.colorSpace = THREE.SRGBColorSpace;
    pTex.anisotropy = maxAnisotropy;
    return pTex;
  };

  const concreteMap = new THREE.CanvasTexture(cCanvas);
  concreteMap.colorSpace = THREE.SRGBColorSpace;
  concreteMap.anisotropy = maxAnisotropy;

  const concreteBump = new THREE.CanvasTexture(bCanvas);
  const posterPurple = makePoster('#1A1421', 'rgba(124, 17, 184, 0.42)', 1);
  const posterCrimson = makePoster('#1D1214', 'rgba(123, 0, 0, 0.46)', 2);

  return {
    concreteMap,
    concreteBump,
    posterPurple,
    posterCrimson,
    dispose: () => {
      concreteMap.dispose();
      concreteBump.dispose();
      posterPurple.dispose();
      posterCrimson.dispose();
    },
  };
}
