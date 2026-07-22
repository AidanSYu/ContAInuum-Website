import jetBrainsMonoUrl from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';

type Tint = 'ember' | 'ice';

type AsciiWorkerOptions = {
  host: HTMLDivElement;
  canvas: HTMLCanvasElement;
  src: string;
  type: 'video' | 'image';
  poster?: string;
  cols: number;
  speed: number;
  fps: number;
  tint: Tint;
  contrast: number;
  interactive: boolean;
};

type VideoWithFrameCallbacks = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: (now: number) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function canUseAsciiWorker(canvas: HTMLCanvasElement): boolean {
  return (
    typeof Worker !== 'undefined' &&
    typeof OffscreenCanvas !== 'undefined' &&
    typeof canvas.transferControlToOffscreen === 'function'
  );
}

/**
 * Starts the worker renderer after React's StrictMode probe has completed.
 * Callers intentionally schedule this one animation frame after their effect:
 * the probe cleanup then runs before transferControlToOffscreen, so a canvas is
 * never transferred twice in development.
 */
export function startAsciiWorker({
  host,
  canvas,
  src,
  type,
  poster,
  cols,
  speed,
  fps,
  tint,
  contrast,
  interactive,
}: AsciiWorkerOptions): () => void {
  const worker = new Worker(new URL('./ascii.worker.ts', import.meta.url), {
    type: 'module',
    name: interactive ? 'interactive-ascii' : 'ascii-media',
  });
  const offscreen = canvas.transferControlToOffscreen();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let disposed = false;
  let workerReady = false;
  let nearViewport = false;
  let visible = false;
  let inFlight = false;
  let source: HTMLVideoElement | HTMLImageElement | null = null;
  let captureCanvas: OffscreenCanvas | null = null;
  let sourceReady = false;
  let loaded = false;
  let lastFrameAt = -Infinity;
  let frameCallback = 0;
  let fallbackRaf = 0;
  let pointerRaf = 0;
  let pendingPointer: { x: number; y: number; now: number } | null = null;
  let hostRect = host.getBoundingClientRect();
  let hostDocumentLeft = hostRect.left + window.scrollX;
  let hostDocumentTop = hostRect.top + window.scrollY;

  worker.postMessage(
    {
      type: 'init',
      canvas: offscreen,
      cols,
      tint,
      contrast,
      interactive,
      fontUrl: jetBrainsMonoUrl,
    },
    [offscreen],
  );

  const sourceAspect = () => {
    if (source instanceof HTMLVideoElement) {
      return (source.videoWidth || 16) / (source.videoHeight || 9);
    }
    if (source instanceof HTMLImageElement) {
      return (source.naturalWidth || 16) / (source.naturalHeight || 9);
    }
    return 16 / 9;
  };

  const captureFallback = (media: HTMLVideoElement | HTMLImageElement) => {
    const captureRows = Math.max(8, Math.round((cols / Math.max(0.01, sourceAspect())) * 0.52));
    if (!captureCanvas) captureCanvas = new OffscreenCanvas(cols, captureRows);
    if (captureCanvas.width !== cols) captureCanvas.width = cols;
    if (captureCanvas.height !== captureRows) captureCanvas.height = captureRows;
    const context = captureCanvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not create an ASCII capture context.');
    context.drawImage(media, 0, 0, cols, captureRows);
    return captureCanvas.transferToImageBitmap();
  };

  const layout = () => {
    hostRect = host.getBoundingClientRect();
    hostDocumentLeft = hostRect.left + window.scrollX;
    hostDocumentTop = hostRect.top + window.scrollY;
    if (!workerReady || !hostRect.width || !hostRect.height) return;
    worker.postMessage({
      type: 'resize',
      width: hostRect.width,
      height: hostRect.height,
      aspect: sourceAspect(),
    });
    if (sourceReady && source instanceof HTMLImageElement) {
      requestAnimationFrame(() => void sendFrame(performance.now()));
    }
  };

  async function sendFrame(now: number) {
    if (disposed || inFlight || !sourceReady || !source) return;
    inFlight = true;

    try {
      let frame: ImageBitmap | VideoFrame;
      try {
        if (source instanceof HTMLVideoElement && typeof VideoFrame !== 'undefined') {
          frame = new VideoFrame(source);
        } else {
          frame = await createImageBitmap(source);
        }
      } catch {
        // Older Safari releases expose OffscreenCanvas but cannot create an
        // ImageBitmap directly from video. Sampling into a tiny offscreen
        // buffer preserves the effect and remains far cheaper than main-thread
        // glyph rendering.
        frame = captureFallback(source);
      }

      if (disposed) {
        frame.close();
        return;
      }
      worker.postMessage({ type: 'frame', frame, now }, [frame]);
    } catch {
      inFlight = false;
    }
  }

  const cancelVideoLoop = () => {
    const video = source as VideoWithFrameCallbacks | null;
    if (video instanceof HTMLVideoElement && frameCallback && video.cancelVideoFrameCallback) {
      video.cancelVideoFrameCallback(frameCallback);
    }
    frameCallback = 0;
    cancelAnimationFrame(fallbackRaf);
    fallbackRaf = 0;
  };

  const scheduleVideoFrame = () => {
    const video = source as VideoWithFrameCallbacks | null;
    if (!(video instanceof HTMLVideoElement) || !visible || disposed) return;

    if (video.requestVideoFrameCallback) {
      if (frameCallback) return;
      frameCallback = video.requestVideoFrameCallback((now) => {
        frameCallback = 0;
        if (now - lastFrameAt >= 1000 / fps) {
          lastFrameAt = now;
          void sendFrame(now);
        }
        scheduleVideoFrame();
      });
      return;
    }

    if (fallbackRaf) return;
    const tick = (now: number) => {
      fallbackRaf = 0;
      if (!visible || disposed) return;
      if (now - lastFrameAt >= 1000 / fps) {
        lastFrameAt = now;
        void sendFrame(now);
      }
      fallbackRaf = requestAnimationFrame(tick);
    };
    fallbackRaf = requestAnimationFrame(tick);
  };

  const updatePlayback = () => {
    if (!(source instanceof HTMLVideoElement) || !sourceReady) return;
    if (visible) {
      source.play().catch(() => {});
      scheduleVideoFrame();
    } else {
      source.pause();
      cancelVideoLoop();
    }
  };

  const markSourceReady = () => {
    if (disposed) return;
    sourceReady = true;
    layout();

    if (source instanceof HTMLVideoElement) {
      source.playbackRate = speed;
      updatePlayback();
    } else {
      void sendFrame(performance.now());
    }
  };

  const loadSource = () => {
    if (loaded || !workerReady || !nearViewport || disposed) return;
    loaded = true;

    if (type === 'video' && !reduceMotion) {
      const video: VideoWithFrameCallbacks = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.crossOrigin = 'anonymous';
      source = video;
      video.addEventListener('loadeddata', markSourceReady, { once: true });
      video.src = src;
      video.load();
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    source = image;
    image.addEventListener('load', markSourceReady, { once: true });
    image.src = type === 'video' ? poster || src : src;
    if (image.complete) markSourceReady();
  };

  worker.onmessage = (event: MessageEvent<{ type?: string }>) => {
    if (event.data.type === 'ready') {
      workerReady = true;
      layout();
      loadSource();
    } else if (event.data.type === 'frame-done') {
      inFlight = false;
    }
  };

  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(host);

  const loadObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      nearViewport = true;
      loadSource();
      loadObserver.disconnect();
    },
    { rootMargin: '75% 0px' },
  );
  loadObserver.observe(host);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting) && !document.hidden;
      updatePlayback();
      if (visible && sourceReady && source instanceof HTMLImageElement) {
        void sendFrame(performance.now());
      }
    },
    { threshold: 0.01 },
  );
  visibilityObserver.observe(host);

  const onVisibilityChange = () => {
    const viewportTop = hostDocumentTop - window.scrollY;
    visible =
      !document.hidden && viewportTop + hostRect.height > 0 && viewportTop < window.innerHeight;
    updatePlayback();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const onPointerMove = (event: PointerEvent) => {
    if (!interactive || !visible) return;
    pendingPointer = {
      x: event.clientX + window.scrollX - hostDocumentLeft,
      y: event.clientY + window.scrollY - hostDocumentTop,
      now: performance.now(),
    };
    if (pointerRaf) return;
    pointerRaf = requestAnimationFrame(() => {
      pointerRaf = 0;
      if (!pendingPointer || disposed) return;
      worker.postMessage({ type: 'pointer', ...pendingPointer });
      pendingPointer = null;
    });
  };
  if (interactive) window.addEventListener('pointermove', onPointerMove, { passive: true });

  return () => {
    disposed = true;
    cancelVideoLoop();
    cancelAnimationFrame(pointerRaf);
    resizeObserver.disconnect();
    loadObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (interactive) window.removeEventListener('pointermove', onPointerMove);
    if (source instanceof HTMLVideoElement) {
      source.pause();
      source.removeAttribute('src');
      source.load();
    }
    worker.postMessage({ type: 'dispose' });
    worker.terminate();
  };
}
