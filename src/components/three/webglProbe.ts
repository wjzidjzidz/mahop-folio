export interface WebGLCapabilitiesReport {
  supported: boolean;
  isSoftwareGl: boolean;
  rendererName: string;
  quickBenchmarkMs: number;
}

let cachedReport: WebGLCapabilitiesReport | null = null;

/**
 * Zero-dependency WebGL1/2 hardware & software-renderer capability probe.
 * Deliberately excludes `three` imports so mobile/2D routes never download or parse Three.js.
 */
export function probeWebGLCapabilities(): WebGLCapabilitiesReport {
  if (cachedReport) return cachedReport;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cachedReport = {
      supported: false,
      isSoftwareGl: false,
      rendererName: 'ssr',
      quickBenchmarkMs: 0,
    };
    return cachedReport;
  }

  try {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const gl =
      (canvas.getContext('webgl2', {
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('webgl', {
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null);

    if (!gl) {
      cachedReport = {
        supported: false,
        isSoftwareGl: false,
        rendererName: 'unavailable',
        quickBenchmarkMs: 0,
      };
      return cachedReport;
    }

    let rendererName = '';
    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugExt) {
      rendererName = String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '');
    } else {
      rendererName = String(gl.getParameter(gl.RENDERER) || '');
    }

    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
      rendererName
    );

    gl.viewport(0, 0, 16, 16);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) {
      loseCtx.loseContext();
    }

    cachedReport = {
      supported: true,
      isSoftwareGl,
      rendererName,
      quickBenchmarkMs: Number(Math.max(0, t1 - t0).toFixed(2)),
    };
    return cachedReport;
  } catch {
    cachedReport = {
      supported: false,
      isSoftwareGl: false,
      rendererName: 'error',
      quickBenchmarkMs: 0,
    };
    return cachedReport;
  }
}

export function resetWebGLProbeCacheForTesting() {
  cachedReport = null;
}

export interface BrowserDeviceInputs {
  viewportWidth: number;
  isCoarsePointer: boolean;
  maxTouchPoints: number;
  hardwareConcurrency: number;
  deviceMemory: number;
}

export function readBrowserDeviceInputs(): BrowserDeviceInputs {
  if (typeof window === 'undefined') {
    return {
      viewportWidth: 1440,
      isCoarsePointer: false,
      maxTouchPoints: 0,
      hardwareConcurrency: 0,
      deviceMemory: 0,
    };
  }
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const deviceMemory =
    nav &&
    'deviceMemory' in nav &&
    typeof (nav as Navigator & { deviceMemory?: number }).deviceMemory === 'number'
      ? (nav as Navigator & { deviceMemory: number }).deviceMemory
      : 0;
  return {
    viewportWidth: window.innerWidth,
    isCoarsePointer: Boolean(window.matchMedia?.('(pointer: coarse)')?.matches),
    maxTouchPoints: nav?.maxTouchPoints ?? 0,
    hardwareConcurrency: nav?.hardwareConcurrency ?? 0,
    deviceMemory,
  };
}
