/*
 * The ASCII films are intentionally rendered with Canvas 2D rather than a
 * visually different shader. Running that exact renderer in a worker keeps the
 * signature glyph treatment while taking its per-cell sampling and fillText
 * work off the scroll-critical main thread.
 */

const GLYPHS = " .'^\",:;Il!i~+_-?][}{1)|/tfjrxnuvczXYUCLQ0OZmwqpdbkhao*#MW&8%B@$";

type Tint = 'ember' | 'ice';
type ColorStop = [number, [number, number, number]];

const RAMPS: Record<Tint, ColorStop[]> = {
  ember: [
    [0, [22, 18, 24]],
    [0.34, [96, 44, 52]],
    [0.6, [206, 78, 52]],
    [0.82, [247, 120, 56]],
    [1, [255, 234, 208]],
  ],
  ice: [
    [0, [18, 24, 32]],
    [0.34, [40, 78, 104]],
    [0.6, [72, 150, 196]],
    [0.82, [130, 200, 236]],
    [1, [232, 246, 255]],
  ],
};

const INTERACTIVE_STOPS: ColorStop[] = [
  [0, [20, 17, 22]],
  [0.4, [92, 50, 52]],
  [0.66, [206, 96, 66]],
  [0.85, [246, 108, 52]],
  [1, [255, 236, 216]],
];

type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  cols: number;
  tint: Tint;
  contrast: number;
  interactive: boolean;
  fontUrl: string;
};

type ResizeMessage = {
  type: 'resize';
  width: number;
  height: number;
  aspect: number;
};

type FrameMessage = {
  type: 'frame';
  frame: ImageBitmap | VideoFrame;
  now: number;
};

type PointerMessage = {
  type: 'pointer';
  x: number;
  y: number;
  now: number;
};

type DisposeMessage = { type: 'dispose' };
type WorkerMessage = InitMessage | ResizeMessage | FrameMessage | PointerMessage | DisposeMessage;

type WorkerPort = {
  postMessage: (message: unknown) => void;
  close: () => void;
  fonts?: { add: (font: FontFace) => void };
};

const port = self as unknown as WorkerPort;

let output: OffscreenCanvas | null = null;
let outputContext: OffscreenCanvasRenderingContext2D | null = null;
const sampler = new OffscreenCanvas(1, 1);
const samplerContext = sampler.getContext('2d', { willReadFrequently: true });

let cols = 110;
let rows = 32;
let cellWidth = 1;
let cellHeight = 1;
let contrast = 1.15;
let interactive = false;
let levels = 28;
let colors: string[] = [];
let buckets: number[][] = [];

let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;
let lastPointerAt = -Infinity;
let lastFrameAt = 0;

function buildPalette(stops: ColorStop[], count: number): string[] {
  const palette: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    let from = stops[0];
    let to = stops[stops.length - 1];

    for (let stop = 0; stop < stops.length - 1; stop += 1) {
      if (t >= stops[stop][0] && t <= stops[stop + 1][0]) {
        from = stops[stop];
        to = stops[stop + 1];
        break;
      }
    }

    const span = to[0] - from[0] || 1;
    const amount = (t - from[0]) / span;
    const red = Math.round(from[1][0] + (to[1][0] - from[1][0]) * amount);
    const green = Math.round(from[1][1] + (to[1][1] - from[1][1]) * amount);
    const blue = Math.round(from[1][2] + (to[1][2] - from[1][2]) * amount);
    palette.push(`rgb(${red},${green},${blue})`);
  }
  return palette;
}

function resize(width: number, height: number, aspect: number) {
  if (!output || !outputContext) return;

  output.width = Math.max(1, Math.floor(width));
  output.height = Math.max(1, Math.floor(height));
  rows = Math.max(8, Math.round((cols / Math.max(0.01, aspect)) * 0.52));
  sampler.width = cols;
  sampler.height = rows;
  cellWidth = output.width / cols;
  cellHeight = output.height / rows;
  outputContext.textBaseline = 'top';
  outputContext.font = `${Math.ceil(cellHeight * (interactive ? 1.06 : 1.08))}px "JetBrains Mono Variable", ui-monospace, monospace`;

  if (pointerX === 0 && pointerY === 0) {
    pointerX = targetX = output.width / 2;
    pointerY = targetY = output.height / 2;
  }
}

function bucketStandard(data: Uint8ClampedArray) {
  for (let level = 0; level < levels; level += 1) buckets[level].length = 0;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const pixel = (y * cols + x) * 4;
      let luminance =
        (0.299 * data[pixel] + 0.587 * data[pixel + 1] + 0.114 * data[pixel + 2]) / 255;
      luminance = Math.min(1, Math.max(0, (luminance - 0.5) * contrast + 0.5));
      const level = Math.min(levels - 1, Math.max(0, Math.floor(luminance * levels)));
      if (level > 0) buckets[level].push(x, y);
    }
  }
}

function bucketInteractive(data: Uint8ClampedArray, now: number) {
  const delta = Math.min(64, lastFrameAt ? now - lastFrameAt : 16);
  lastFrameAt = now;

  if (now - lastPointerAt > 1400 && output) {
    const phase = now * 0.00022;
    targetX = output.width * (0.5 + 0.32 * Math.cos(phase));
    targetY = output.height * (0.5 + 0.3 * Math.sin(phase * 1.3));
  }

  const response = 0.22;
  const smoothing = 1 - Math.pow(1 - response, delta / 16.667);
  pointerX += (targetX - pointerX) * smoothing;
  pointerY += (targetY - pointerY) * smoothing;

  const radius = Math.min(output?.width ?? 1, output?.height ?? 1) * 0.36;
  const inverseRadius = 1 / Math.max(1, radius);

  for (let level = 0; level < levels; level += 1) buckets[level].length = 0;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const pixel = (y * cols + x) * 4;
      let luminance =
        (0.299 * data[pixel] + 0.587 * data[pixel + 1] + 0.114 * data[pixel + 2]) / 255;
      const deltaX = (x + 0.5) * cellWidth - pointerX;
      const deltaY = (y + 0.5) * cellHeight - pointerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * inverseRadius;

      if (distance < 1) {
        const falloff = (1 - distance) * (1 - distance);
        const ripple = 0.5 + 0.5 * Math.sin(distance * 9 - now * 0.006);
        luminance = luminance * (0.72 + 0.28 * falloff) + falloff * (0.42 + 0.34 * ripple);
      } else {
        luminance *= 0.82;
      }

      let level = (luminance * levels) | 0;
      if (level <= 0) continue;
      if (level >= levels) level = levels - 1;
      buckets[level].push(x, y);
    }
  }
}

function render(frame: ImageBitmap | VideoFrame, now: number) {
  if (!output || !outputContext || !samplerContext) return;

  samplerContext.drawImage(frame, 0, 0, cols, rows);
  const data = samplerContext.getImageData(0, 0, cols, rows).data;
  if (interactive) bucketInteractive(data, now);
  else bucketStandard(data);

  outputContext.fillStyle = '#06080b';
  outputContext.fillRect(0, 0, output.width, output.height);

  const glyphSpan = GLYPHS.length - 1;
  for (let level = 1; level < levels; level += 1) {
    const cells = buckets[level];
    if (!cells.length) continue;
    outputContext.fillStyle = colors[level];
    const glyph = GLYPHS[Math.min(glyphSpan, Math.round((level / (levels - 1)) * glyphSpan))];
    for (let index = 0; index < cells.length; index += 2) {
      outputContext.fillText(glyph, cells[index] * cellWidth, cells[index + 1] * cellHeight);
    }
  }
}

async function initialize(message: InitMessage) {
  output = message.canvas;
  outputContext = output.getContext('2d', { alpha: false });
  cols = message.cols;
  contrast = message.contrast;
  interactive = message.interactive;
  levels = interactive ? 30 : 28;
  colors = buildPalette(interactive ? INTERACTIVE_STOPS : RAMPS[message.tint], levels);
  buckets = Array.from({ length: levels }, () => []);

  try {
    const font = new FontFace('JetBrains Mono Variable', `url(${message.fontUrl})`);
    await font.load();
    port.fonts?.add(font);
  } catch {
    // The system monospace fallback keeps the effect usable if a browser does
    // not expose worker FontFaceSet support.
  }

  port.postMessage({ type: 'ready' });
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  if (message.type === 'init') {
    void initialize(message);
    return;
  }
  if (message.type === 'resize') {
    resize(message.width, message.height, message.aspect);
    return;
  }
  if (message.type === 'pointer') {
    targetX = message.x;
    targetY = message.y;
    lastPointerAt = message.now;
    return;
  }
  if (message.type === 'frame') {
    try {
      render(message.frame, message.now);
    } finally {
      message.frame.close();
      port.postMessage({ type: 'frame-done' });
    }
    return;
  }

  port.close();
};

