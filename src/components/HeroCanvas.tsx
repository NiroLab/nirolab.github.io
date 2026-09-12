import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero particle field (design.md §5): ~600 drifting nodes connected by
 * hairlines when within threshold — the robot-swarm topology motif.
 * Nodes gently repel the cursor (separate displacement + lerp decay —
 * base positions are never modified). DPR-capped, paused offscreen.
 */

const NODE_COUNT = 600;
const LINK_DIST = 1.15;
const BOUNDS = { x: 10, y: 5.6, z: 3 };

function Swarm() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport, pointer } = useThree();

  const { base, phases, pairs } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT * 2);
    for (let i = 0; i < NODE_COUNT; i++) {
      base[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      base[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      base[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
      phases[i * 2] = Math.random() * Math.PI * 2;
      phases[i * 2 + 1] = 0.3 + Math.random() * 0.7;
    }
    // static topology: connect nodes within threshold (cap degree)
    const pairs: number[] = [];
    const degree = new Uint8Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (degree[i] >= 4 || degree[j] >= 4) continue;
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
          pairs.push(i, j);
          degree[i]++;
          degree[j]++;
        }
      }
    }
    return { base, phases, pairs };
  }, []);

  const current = useMemo(() => new Float32Array(base), [base]);
  const displacement = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const linePositions = useMemo(
    () => new Float32Array(pairs.length * 3),
    [pairs],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // pointer in world units (hero plane is roughly z=0)
    const mx = pointer.x * (viewport.width / 2);
    const my = pointer.y * (viewport.height / 2);
    const REPEL_R = 2.2;
    const REPEL_F = 0.16;

    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      // gentle sine drift
      const ox =
        Math.sin(t * phases[i * 2 + 1] + phases[i * 2]) * 0.22;
      const oy =
        Math.cos(t * phases[i * 2 + 1] * 0.8 + phases[i * 2]) * 0.18;
      const bx = base[ix] + ox;
      const by = base[ix + 1] + oy;

      // cursor repulsion on displacement, then lerp decay
      const px = bx + displacement[ix];
      const py = by + displacement[ix + 1];
      const dx = px - mx;
      const dy = py - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_R * REPEL_R && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
        displacement[ix] += (dx / d) * f;
        displacement[ix + 1] += (dy / d) * f;
      }
      displacement[ix] *= 0.95;
      displacement[ix + 1] *= 0.95;
      displacement[ix + 2] *= 0.95;

      current[ix] = bx + displacement[ix];
      current[ix + 1] = by + displacement[ix + 1];
      current[ix + 2] = base[ix + 2] + displacement[ix + 2];
    }

    for (let p = 0; p < pairs.length; p += 2) {
      const a = pairs[p] * 3;
      const b = pairs[p + 1] * 3;
      const o = p * 3;
      linePositions[o] = current[a];
      linePositions[o + 1] = current[a + 1];
      linePositions[o + 2] = current[a + 2];
      linePositions[o + 3] = current[b];
      linePositions[o + 4] = current[b + 1];
      linePositions[o + 5] = current[b + 2];
    }

    const pts = pointsRef.current;
    const lns = linesRef.current;
    if (pts) {
      (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
    }
    if (lns) {
      (lns.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#3D8FE0"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3D8FE0"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function HeroCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // pause render loop when the hero leaves the viewport
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1)}
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Swarm />
      </Canvas>
    </div>
  );
}
