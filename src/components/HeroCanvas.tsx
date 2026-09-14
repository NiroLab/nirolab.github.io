import { useEffect, useRef } from "react";

/**
 * Hero background: "Blueprint arm" (approved design C) - a 2D-canvas
 * engineering-sketch animation of a 3-link planar robotic arm:
 * base anchor + hatching, joint circles, theta arcs + JetBrains Mono
 * labels, link-1 dimension line with arrow ticks, gripper, a 200-point
 * dotted end-effector trail, and a tracking crosshair with dashed
 * construction lines back to the base axes. Ported from
 * design-preview/index.html (ARM renderer). Plain canvas + rAF,
 * DPR capped at 2, relative geometry anchored right-of-center,
 * paused offscreen, single static frame under prefers-reduced-motion.
 */

const INK = "rgba(138,216,230,0.35)";
const INK_SOFT = "rgba(138,216,230,0.5)";
const TRAIL = "rgba(47,184,206,0.15)";

interface ArmState {
  baseX: number;
  baseY: number;
  L1: number;
  L2: number;
  L3: number;
  trail: [number, number][];
}

export default function HeroCanvas({ className }: { className?: string }) {
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
    let inView = true;
    let cleanupIO: (() => void) | undefined;
    const start = performance.now();

    const arm: ArmState = { baseX: 0, baseY: 0, L1: 0, L2: 0, L3: 0, trail: [] };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // relative geometry (preview: base at 0.68w / 0.58h)
      if (W < 640) {
        // mobile framing: bigger sketch pinned to the bottom-right corner,
        // anchored so the arm's full reach (+ labels) stays on-canvas
        const scale = Math.max(0.5, Math.min(1, W / 1100, H / 700));
        arm.baseX = Math.min(W * 0.8, W - 220 * scale - 28);
        arm.baseY = H * 0.94;
        arm.L1 = 130 * scale;
        arm.L2 = 105 * scale;
        arm.L3 = 80 * scale;
      } else {
        arm.baseX = W * 0.68;
        arm.baseY = H * 0.58;
        const scale = Math.min(1, W / 1100, H / 700);
        arm.L1 = 130 * scale;
        arm.L2 = 105 * scale;
        arm.L3 = 80 * scale;
      }
      arm.trail = [];
    };

    // gentle joint oscillation on slow 12-20s periods
    const angles = (t: number) => ({
      a1: -Math.PI / 2 + 0.35 * Math.sin(t * ((Math.PI * 2) / 16) + 0.5),
      a2: 0.65 + 0.3 * Math.sin(t * ((Math.PI * 2) / 12) + 2.1),
      a3: -0.45 + 0.28 * Math.sin(t * ((Math.PI * 2) / 20) + 4.0),
    });

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      // keep the sketch from fighting the hero text on narrow screens
      ctx.globalAlpha = W < 640 ? 0.55 : W < 1024 ? 0.8 : 1;

      const A = angles(t);
      const bx = arm.baseX;
      const by = arm.baseY;

      // forward kinematics
      const j1x = bx + Math.cos(A.a1) * arm.L1;
      const j1y = by + Math.sin(A.a1) * arm.L1;
      const a12 = A.a1 + A.a2;
      const j2x = j1x + Math.cos(a12) * arm.L2;
      const j2y = j1y + Math.sin(a12) * arm.L2;
      const a123 = a12 + A.a3;
      const ex = j2x + Math.cos(a123) * arm.L3;
      const ey = j2y + Math.sin(a123) * arm.L3;

      // --- base mount + hatching ---
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - 26, by);
      ctx.lineTo(bx + 26, by);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let h = -24; h <= 24; h += 8) {
        ctx.moveTo(bx + h, by);
        ctx.lineTo(bx + h - 6, by + 8);
      }
      ctx.strokeStyle = "rgba(138,216,230,0.22)";
      ctx.stroke();

      // --- faint end-effector trail (buffer ~200 pts) ---
      arm.trail.push([ex, ey]);
      if (arm.trail.length > 200) arm.trail.shift();
      ctx.fillStyle = TRAIL;
      for (let p = 0; p < arm.trail.length; p += 2) {
        ctx.beginPath();
        ctx.arc(arm.trail[p][0], arm.trail[p][1], 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- dashed construction lines from end-effector to axes ---
      ctx.strokeStyle = "rgba(138,216,230,0.16)";
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(bx, ey);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex, by);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- links ---
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(j1x, j1y);
      ctx.moveTo(j1x, j1y);
      ctx.lineTo(j2x, j2y);
      ctx.moveTo(j2x, j2y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // parallel "wireframe" offset lines for sketch feel
      ctx.strokeStyle = "rgba(138,216,230,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 3, by);
      ctx.lineTo(j1x + 3, j1y);
      ctx.moveTo(j1x + 3, j1y);
      ctx.lineTo(j2x + 3, j2y);
      ctx.moveTo(j2x + 3, j2y);
      ctx.lineTo(ex + 3, ey);
      ctx.stroke();

      // --- joint circles at each pivot ---
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      const joints: [number, number, number][] = [
        [bx, by, 7],
        [j1x, j1y, 6],
        [j2x, j2y, 5],
      ];
      joints.forEach((j) => {
        ctx.beginPath();
        ctx.arc(j[0], j[1], j[2], 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(j[0], j[1], 1.6, 0, Math.PI * 2);
        ctx.stroke();
      });

      // --- end-effector gripper ---
      const gx = Math.cos(a123);
      const gy = Math.sin(a123);
      const px = -gy;
      const py = gx; // perpendicular
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + gx * 12 + px * 7, ey + gy * 12 + py * 7);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + gx * 12 - px * 7, ey + gy * 12 - py * 7);
      ctx.stroke();

      // --- angle arcs + theta labels (JetBrains Mono 10px) ---
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = INK_SOFT;
      ctx.strokeStyle = "rgba(138,216,230,0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by, 22, A.a1, 0, A.a1 < 0);
      ctx.stroke();
      ctx.fillText("θ1", bx + 26, by - 4);
      ctx.beginPath();
      ctx.arc(j1x, j1y, 18, A.a1, a12, A.a2 < 0);
      ctx.stroke();
      ctx.fillText("θ2", j1x + 20, j1y - 6);
      ctx.beginPath();
      ctx.arc(j2x, j2y, 14, a12, a123, A.a3 < 0);
      ctx.stroke();
      ctx.fillText("θ3", j2x + 16, j2y - 6);

      // --- dimension line with arrow ticks along link 1 ---
      const ux = Math.cos(A.a1);
      const uy = Math.sin(A.a1);
      const nx = -uy;
      const ny = ux; // link normal
      const off = 14;
      const d1x = bx + nx * off;
      const d1y = by + ny * off;
      const d2x = j1x + nx * off;
      const d2y = j1y + ny * off;
      ctx.strokeStyle = "rgba(138,216,230,0.30)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // extension lines
      ctx.moveTo(bx + nx * 5, by + ny * 5);
      ctx.lineTo(d1x + nx * 3, d1y + ny * 3);
      ctx.moveTo(j1x + nx * 5, j1y + ny * 5);
      ctx.lineTo(d2x + nx * 3, d2y + ny * 3);
      // dimension line
      ctx.moveTo(d1x, d1y);
      ctx.lineTo(d2x, d2y);
      // arrow ticks at both ends (45° slashes)
      const ends: [number, number, number][] = [
        [d1x, d1y, 1],
        [d2x, d2y, -1],
      ];
      ends.forEach((e) => {
        const ax = e[0];
        const ay = e[1];
        const dir = e[2];
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + dir * (ux * 7 + nx * 3), ay + dir * (uy * 7 + ny * 3));
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + dir * (ux * 7 - nx * 3), ay + dir * (uy * 7 - ny * 3));
      });
      ctx.stroke();
      // tiny dimension label
      const mx = (d1x + d2x) / 2 + nx * 8;
      const my = (d1y + d2y) / 2 + ny * 8;
      ctx.fillStyle = "rgba(138,216,230,0.4)";
      ctx.fillText("L1", mx - 5, my);

      // --- tracking crosshair on the end-effector ---
      ctx.strokeStyle = "rgba(47,184,206,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ex - 9, ey);
      ctx.lineTo(ex + 9, ey);
      ctx.moveTo(ex, ey - 9);
      ctx.lineTo(ex, ey + 9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1;
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
          inView = entry.isIntersecting;
          if (inView) {
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
