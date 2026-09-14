import { useEffect, useRef } from "react";

/**
 * Dark banner background: "Contour Drift" (approved design B) -
 * marching-squares iso-lines over a smoothly evolving layered sine
 * field (~30s evolution, SLAM/elevation-map feel). ~6 iso levels,
 * every 3rd a slightly stronger "major" contour; strokes stay subtle
 * (rgba(47,184,206,0.10-0.16), majors rgba(138,216,230,0.14), 1px)
 * so the canvas can sit behind banner text. Ported from
 * design-preview/index.html (CONTOUR renderer). Plain canvas + rAF,
 * DPR capped at 2, ResizeObserver resize, IntersectionObserver pause,
 * single static frame under prefers-reduced-motion.
 */

const CELL = 28;
const LEVELS = 6;

/** Layered smooth pseudo-noise, continuous in time (no jitter). */
function field(x: number, y: number, t: number): number {
  const s1 = Math.sin(x * 0.006 + t * 0.21) * Math.cos(y * 0.007 - t * 0.17);
  const s2 =
    Math.sin((x + y) * 0.004 - t * 0.13) * Math.cos((x - y) * 0.005 + t * 0.19);
  const s3 = Math.sin(x * 0.011 - t * 0.09) * Math.sin(y * 0.009 + t * 0.15);
  return s1 * 0.5 + s2 * 0.35 + s3 * 0.25; // roughly [-1.1, 1.1]
}

export default function ContourCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    let rafId = 0;
    let cleanupIO: (() => void) | undefined;
    const start = performance.now();

    const resize = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / CELL) + 1;
      const rows = Math.ceil(H / CELL) + 1;

      // sample field once per frame into a grid
      const grid = new Float32Array(cols * rows);
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = field(i * CELL, j * CELL, t);
          grid[j * cols + i] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
      const span = max - min;
      if (span <= 0) return;

      // marching squares for each iso level
      for (let li = 1; li <= LEVELS; li++) {
        const level = min + span * (li / (LEVELS + 1));
        const major = li % 3 === 0;
        ctx.strokeStyle = major
          ? "rgba(138,216,230,0.14)"
          : `rgba(47,184,206,${(0.1 + 0.06 * (li / LEVELS)).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols - 1; x++) {
            const tl = grid[y * cols + x];
            const tr = grid[y * cols + x + 1];
            const bl = grid[(y + 1) * cols + x];
            const br = grid[(y + 1) * cols + x + 1];
            const idx =
              (tl > level ? 8 : 0) |
              (tr > level ? 4 : 0) |
              (br > level ? 2 : 0) |
              (bl > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const px = x * CELL;
            const py = y * CELL;
            // interpolated crossing points on each cell edge
            const top: [number, number] = [
              px + (CELL * (level - tl)) / (tr - tl),
              py,
            ];
            const right: [number, number] = [
              px + CELL,
              py + (CELL * (level - tr)) / (br - tr),
            ];
            const bottom: [number, number] = [
              px + (CELL * (level - bl)) / (br - bl),
              py + CELL,
            ];
            const left: [number, number] = [
              px,
              py + (CELL * (level - tl)) / (bl - tl),
            ];
            const seg = (a: [number, number], b: [number, number]) => {
              ctx.moveTo(a[0], a[1]);
              ctx.lineTo(b[0], b[1]);
            };
            switch (idx) {
              case 1:
              case 14:
                seg(left, bottom);
                break;
              case 2:
              case 13:
                seg(bottom, right);
                break;
              case 3:
              case 12:
                seg(left, right);
                break;
              case 4:
              case 11:
                seg(top, right);
                break;
              case 5:
                seg(top, right);
                seg(left, bottom);
                break;
              case 6:
              case 9:
                seg(top, bottom);
                break;
              case 7:
              case 8:
                seg(left, top);
                break;
              case 10:
                seg(left, top);
                seg(bottom, right);
                break;
            }
          }
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      draw((performance.now() - start) / 1000);
      rafId = requestAnimationFrame(loop);
    };

    resize();

    if (reduced) {
      // single static frame, no animation loop
      draw(6);
    } else {
      rafId = requestAnimationFrame(loop);
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
          }
        },
        { threshold: 0 },
      );
      io.observe(host);
      cleanupIO = () => io.disconnect();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(6);
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      cleanupIO?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
