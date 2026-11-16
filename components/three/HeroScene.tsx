"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  PerformanceMonitor,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

type Pointer = { x: number; y: number };

/** Normalised (-1..1) pointer position tracked on the window, so the scene
 *  reacts even though HTML content sits on top of the canvas. */
function usePointer() {
  const p = useRef<Pointer>({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return p;
}

type ShapeKind = "ico" | "octa" | "torus" | "dodeca" | "sphere" | "box" | "cone";

type ShapeDef = {
  kind: ShapeKind;
  color: string;
  emissive: string;
  position: [number, number, number];
  scale: number;
  depth: number; // how strongly it follows the pointer
  speed: number;
};

const SHAPES: ShapeDef[] = [
  { kind: "ico", color: "#ff3d9a", emissive: "#7a0f4a", position: [-2.6, 1.7, 0.4], scale: 0.85, depth: 1.2, speed: 1.4 },
  { kind: "octa", color: "#22d3ee", emissive: "#0a5566", position: [2.9, 2, -0.6], scale: 0.8, depth: 0.8, speed: 1.1 },
  { kind: "torus", color: "#ff8a3d", emissive: "#7a3a10", position: [3.2, -1.7, 0.6], scale: 0.7, depth: 1.5, speed: 1.6 },
  { kind: "dodeca", color: "#8dff5a", emissive: "#2f6a14", position: [-0.4, -3.3, -1.4], scale: 0.6, depth: 1, speed: 1.2 },
  { kind: "sphere", color: "#8b5cf6", emissive: "#3b1d8f", position: [0.4, 2.9, -1.4], scale: 0.55, depth: 0.5, speed: 1.8 },
  { kind: "box", color: "#3b82f6", emissive: "#12337a", position: [2.4, -3.1, 0.4], scale: 0.6, depth: 1.3, speed: 1.3 },
  { kind: "cone", color: "#f472ff", emissive: "#5a1d66", position: [-0.6, 0.2, 2], scale: 0.38, depth: 2, speed: 2 },
];

function Geometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case "ico":
      return <icosahedronGeometry args={[1, 0]} />;
    case "octa":
      return <octahedronGeometry args={[1, 0]} />;
    case "torus":
      return <torusGeometry args={[0.8, 0.32, 24, 64]} />;
    case "dodeca":
      return <dodecahedronGeometry args={[1, 0]} />;
    case "sphere":
      return <sphereGeometry args={[1, 48, 48]} />;
    case "box":
      return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    case "cone":
      return <coneGeometry args={[0.9, 1.6, 6]} />;
  }
}

function Shape({ def, pointer, animate }: { def: ShapeDef; pointer: React.RefObject<Pointer>; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!animate) return;
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const p = pointer.current;
    g.position.x = THREE.MathUtils.damp(g.position.x, def.position[0] + p.x * 0.55 * def.depth, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, def.position[1] + p.y * 0.4 * def.depth, 3, dt);
    m.rotation.x += dt * 0.25 * def.speed;
    m.rotation.y += dt * 0.35 * def.speed;
  });

  return (
    <group ref={group} position={def.position}>
      <Float speed={def.speed} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh ref={mesh} scale={def.scale}>
          <Geometry kind={def.kind} />
          <meshPhysicalMaterial
            color={def.color}
            emissive={def.emissive}
            emissiveIntensity={0.7}
            roughness={0.18}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={0.6}
            iridescenceIOR={1.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

/** The centrepiece: a liquid, distorting torus knot. */
function Centerpiece({ pointer, animate, mobile }: { pointer: React.RefObject<Pointer>; animate: boolean; mobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m || !animate) return;
    m.rotation.y += dt * 0.28;
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, 0.4 + pointer.current.y * 0.5, 3, dt);
    m.rotation.z = THREE.MathUtils.damp(m.rotation.z, pointer.current.x * 0.35, 3, dt);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={ref} scale={mobile ? 0.85 : 1.15}>
        <torusKnotGeometry args={[1, 0.34, mobile ? 128 : 220, mobile ? 20 : 32]} />
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#2a1470"
          emissiveIntensity={0.55}
          roughness={0.12}
          metalness={0.55}
          distort={0.28}
          speed={animate ? 1.6 : 0}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const palette = ["#22d3ee", "#8b5cf6", "#ff3d9a", "#ff8a3d", "#8dff5a", "#ffffff"].map(
      (c) => new THREE.Color(c),
    );
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col.set([c.r, c.g, c.b], i * 3);
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, dt) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += dt * 0.025;
    ref.current.rotation.x += dt * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function World({ mobile, animate }: { mobile: boolean; animate: boolean }) {
  const pointer = usePointer();
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Desktop: scene sits on the right half. Mobile: centred, pushed up behind the headline.
  const targetX = mobile ? 0 : viewport.width * 0.2;
  const targetY = mobile ? viewport.height * 0.2 : 0;
  const scale = mobile ? 0.62 : Math.min(1, viewport.width / 11);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, dt);
    if (animate) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.25, 2.5, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.current.y * 0.15, 2.5, dt);
    }
  });

  const shapes = mobile ? SHAPES.slice(0, 5) : SHAPES;

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[-4, 3, 3]} intensity={60} color="#ff3d9a" />
      <pointLight position={[4, -2, 3]} intensity={55} color="#22d3ee" />
      <pointLight position={[0, 4, -2]} intensity={40} color="#8b5cf6" />

      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="rect" intensity={3} position={[0, 5, -9]} scale={[12, 12, 1]} />
          <Lightformer form="ring" color="#ff3d9a" intensity={6} position={[-5, 1, -1]} scale={4} />
          <Lightformer form="rect" color="#22d3ee" intensity={5} position={[6, 0, -2]} scale={[3, 8, 1]} />
          <Lightformer form="circle" color="#8b5cf6" intensity={4} position={[0, -5, 2]} scale={5} />
        </group>
      </Environment>

      <group ref={group} scale={scale}>
        <Centerpiece pointer={pointer} animate={animate} mobile={mobile} />
        {shapes.map((s) => (
          <Shape key={s.kind} def={s} pointer={pointer} animate={animate} />
        ))}
      </group>

      <Particles count={mobile ? 220 : 520} animate={animate} />
    </>
  );
}

type Props = {
  /** Whether the hero is on screen. Rendering stops when it isn't. */
  active: boolean;
  mobile: boolean;
  reduced: boolean;
};

export default function HeroScene({ active, mobile, reduced }: Props) {
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.75);

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ position: [0, 0, 8.5], fov: 42 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <World mobile={mobile} animate={!reduced} />
      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.65} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
