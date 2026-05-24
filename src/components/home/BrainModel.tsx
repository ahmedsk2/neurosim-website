'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';

type BrainModelProps = {
  reducedMotion?: boolean;
};

type Region = 'L' | 'R' | 'C' | 'B';

/**
 * BrainModel, anatomical network brain.
 *
 *   - 4 regions: left hemisphere, right hemisphere, cerebellum, brainstem
 *   - ~640 luminous points, ~1,200 edges (k-NN with region crossing rules)
 *   - 5 monitoring-channel hotspots with pulsing colored halos
 *   - 6 multi-hop signal pulses traversing the network
 *   - Rotation period 24 s, gentle floating bob
 *   - prefers-reduced-motion: static SVG fallback (no WebGL load at all)
 *   - IntersectionObserver pauses rendering when off-screen
 */
export default function BrainModel({ reducedMotion = false }: BrainModelProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Reduced-motion / low-power fallback: skip the WebGL initialisation
    // entirely. The static SVG fallback is rendered below.
    if (reducedMotion) return;
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | undefined;

    (async () => {
      const Three = (await import('three')) as typeof THREE;
      const { createNoise3D } = await import('simplex-noise');
      if (disposed) return;

      // ---------- Scene, camera, renderer ----------
      const scene = new Three.Scene();
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const camera = new Three.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0.05, 6.0);
      const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = Three.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      // ---------- Configuration ----------
      const COUNT_HEMI = 220;
      const COUNT_CEREBELLUM = 120;
      const COUNT_BRAINSTEM = 80;
      const KNN_K = 5;
      const PULSE_COUNT = 6;
      const PULSE_HOPS_MIN = 3;
      const PULSE_HOPS_MAX = 5;
      const HUB_FRACTION = 0.15;
      const ROTATION_PERIOD_SEC = 24;
      const BRAIN_SCALE = 0.82;

      // ---------- Generate nodes ----------
      const noise3 = createNoise3D();
      type Node = {
        position: THREE.Vector3;
        region: Region;
        isHub: boolean;
      };
      const nodes: Node[] = [];

      const addHemisphere = (side: -1 | 1, count: number) => {
        const seedOffset = side * 100;
        for (let i = 0; i < count; i++) {
          const u = Math.random();
          const v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);
          let x = Math.sin(phi) * Math.cos(theta);
          let y = Math.sin(phi) * Math.sin(theta);
          let z = Math.cos(phi);

          const gyri =
            0.06 * noise3(x * 3.5 + seedOffset, y * 3.5, z * 3.5) +
            0.028 * noise3(x * 8 + seedOffset, y * 8, z * 8) +
            0.013 * noise3(x * 16 + seedOffset, y * 16, z * 16);

          const medialness = Math.max(0, x * side);
          const medialFlatten = -0.1 * medialness * Math.max(0, y + 0.1);

          const lateralness = Math.max(0, -x * side);
          const sylvian =
            -0.09 *
            Math.exp(-Math.pow((y + 0.05) * 5, 2)) *
            Math.exp(-Math.pow((z - 0.35) * 1.8, 2)) *
            lateralness;

          const r = 1 + gyri + medialFlatten + sylvian;
          x *= r;
          y *= r;
          z *= r;

          x *= 0.62;
          y *= 0.95;
          z *= 1.3;

          x += side * 0.42;
          y += 0.1;

          nodes.push({
            position: new Three.Vector3(x, y, z),
            region: side === -1 ? 'L' : 'R',
            isHub: Math.random() < HUB_FRACTION,
          });
        }
      };

      const addCerebellum = (count: number) => {
        for (let i = 0; i < count; i++) {
          const u = Math.random();
          const v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);
          let x = Math.sin(phi) * Math.cos(theta);
          let y = Math.sin(phi) * Math.sin(theta);
          let z = Math.cos(phi);

          const foliation =
            0.045 * noise3(x * 5, y * 12, z * 5) +
            0.02 * noise3(x * 12, y * 22, z * 12);
          const vermis = -0.04 * Math.exp(-Math.pow(x * 12, 2));
          const r = 1 + foliation + vermis;
          x *= r;
          y *= r;
          z *= r;

          x *= 0.7;
          y *= 0.4;
          z *= 0.55;

          y -= 0.62;
          z -= 0.55;

          nodes.push({
            position: new Three.Vector3(x, y, z),
            region: 'C',
            isHub: Math.random() < HUB_FRACTION * 0.6,
          });
        }
      };

      const addBrainstem = (count: number) => {
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const angle = Math.random() * Math.PI * 2;
          const baseRadius = 0.2 - 0.11 * t;
          const radius = baseRadius * (0.92 + 0.16 * Math.random());
          const x = radius * Math.cos(angle);
          const y = -0.3 - t * 0.85;
          const z = -0.15 + radius * Math.sin(angle);
          nodes.push({
            position: new Three.Vector3(x, y, z),
            region: 'B',
            isHub: false,
          });
        }
      };

      addHemisphere(-1, COUNT_HEMI);
      addHemisphere(1, COUNT_HEMI);
      addCerebellum(COUNT_CEREBELLUM);
      addBrainstem(COUNT_BRAINSTEM);

      // ---------- Build edges (k-NN with region rules) ----------
      const canConnect = (i: number, j: number): boolean => {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const ra = a.region;
        const rb = b.region;
        if ((ra === 'L' && rb === 'R') || (ra === 'R' && rb === 'L')) {
          return Math.abs(a.position.x) < 0.2 && Math.abs(b.position.x) < 0.2;
        }
        if (
          ((ra === 'L' || ra === 'R') && rb === 'C') ||
          ((rb === 'L' || rb === 'R') && ra === 'C')
        ) {
          return a.position.distanceTo(b.position) < 0.32;
        }
        if (ra === 'B' || rb === 'B') {
          return a.position.distanceTo(b.position) < 0.38;
        }
        return true;
      };

      const edgeIndices: Array<[number, number]> = [];
      const edgeSet = new Set<string>();
      const adjacency: number[][] = Array.from({ length: nodes.length }, () => []);
      for (let i = 0; i < nodes.length; i++) {
        const candidates: Array<{ idx: number; d: number }> = [];
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          if (!canConnect(i, j)) continue;
          candidates.push({
            idx: j,
            d: nodes[i]!.position.distanceTo(nodes[j]!.position),
          });
        }
        candidates.sort((a, b) => a.d - b.d);
        for (let n = 0; n < KNN_K && n < candidates.length; n++) {
          const j = candidates[n]!.idx;
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edgeIndices.push([i, j]);
            adjacency[i]!.push(j);
            adjacency[j]!.push(i);
          }
        }
      }

      // ---------- Point clouds ----------
      const regularNodes = nodes.filter((n) => !n.isHub);
      const hubNodes = nodes.filter((n) => n.isHub);

      const regionColor = (r: Region): THREE.Color => {
        switch (r) {
          case 'L':
            return new Three.Color(0x2dd4bf);
          case 'R':
            return new Three.Color(0x2dd4bf);
          case 'C':
            return new Three.Color(0x14b8a6);
          case 'B':
            return new Three.Color(0x67e8d4);
        }
      };

      const buildPointCloud = (
        subset: Node[],
        size: number,
        baseOpacity: number,
        brightnessRange: [number, number],
      ) => {
        const positions = new Float32Array(subset.length * 3);
        const colors = new Float32Array(subset.length * 3);
        for (let i = 0; i < subset.length; i++) {
          const n = subset[i]!;
          positions[i * 3] = n.position.x;
          positions[i * 3 + 1] = n.position.y;
          positions[i * 3 + 2] = n.position.z;
          const base = regionColor(n.region);
          const b =
            brightnessRange[0] +
            (brightnessRange[1] - brightnessRange[0]) * Math.random();
          colors[i * 3] = Math.min(1, base.r * b);
          colors[i * 3 + 1] = Math.min(1, base.g * b);
          colors[i * 3 + 2] = Math.min(1, base.b * b);
        }
        const geo = new Three.BufferGeometry();
        geo.setAttribute('position', new Three.BufferAttribute(positions, 3));
        geo.setAttribute('color', new Three.BufferAttribute(colors, 3));
        const mat = new Three.PointsMaterial({
          size,
          transparent: true,
          opacity: baseOpacity,
          vertexColors: true,
          sizeAttenuation: true,
          blending: Three.AdditiveBlending,
          depthWrite: false,
        });
        return { cloud: new Three.Points(geo, mat), geo, mat };
      };

      const regular = buildPointCloud(regularNodes, 0.032, 0.85, [0.75, 1.1]);
      const hubs = buildPointCloud(hubNodes, 0.052, 0.95, [1.05, 1.4]);

      // ---------- Edges ----------
      const edgePositions = new Float32Array(edgeIndices.length * 6);
      for (let e = 0; e < edgeIndices.length; e++) {
        const [i, j] = edgeIndices[e]!;
        const a = nodes[i]!.position;
        const b = nodes[j]!.position;
        edgePositions[e * 6] = a.x;
        edgePositions[e * 6 + 1] = a.y;
        edgePositions[e * 6 + 2] = a.z;
        edgePositions[e * 6 + 3] = b.x;
        edgePositions[e * 6 + 4] = b.y;
        edgePositions[e * 6 + 5] = b.z;
      }
      const edgeGeo = new Three.BufferGeometry();
      edgeGeo.setAttribute('position', new Three.BufferAttribute(edgePositions, 3));
      const edgeMat = new Three.LineBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0.12,
        blending: Three.AdditiveBlending,
        depthWrite: false,
      });
      const edgeLines = new Three.LineSegments(edgeGeo, edgeMat);

      // ---------- Assemble brain group ----------
      const brainGroup = new Three.Group();
      brainGroup.add(edgeLines);
      brainGroup.add(regular.cloud);
      brainGroup.add(hubs.cloud);
      scene.add(brainGroup);
      brainGroup.scale.setScalar(BRAIN_SCALE);

      // ---------- Monitoring hotspots ----------
      type HotspotDef = {
        position: [number, number, number];
        color: number;
      };
      const hotspotDefs: HotspotDef[] = [
        { position: [0.05, 1.3, 0.3], color: 0xf59e0b },
        { position: [0.55, 0.65, 1.65], color: 0x14b8a6 },
        { position: [-0.4, 1.18, 0.85], color: 0x8b5cf6 },
        { position: [1.55, 0.1, 0.45], color: 0xfbbf24 },
        { position: [0.85, -0.05, 1.75], color: 0x2dd4bf },
      ];

      const makeHaloTexture = (rgbHex: number): THREE.CanvasTexture => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const r = (rgbHex >> 16) & 0xff;
        const g = (rgbHex >> 8) & 0xff;
        const b = rgbHex & 0xff;
        const grad = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2,
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        const tex = new Three.CanvasTexture(canvas);
        tex.colorSpace = Three.SRGBColorSpace;
        return tex;
      };

      type Hotspot = {
        dot: THREE.Mesh;
        halo: THREE.Sprite;
        haloTex: THREE.CanvasTexture;
        phase: number;
      };

      const hotspots: Hotspot[] = hotspotDefs.map((h, i) => {
        const dotGeo = new Three.SphereGeometry(0.055, 16, 16);
        const dotMat = new Three.MeshBasicMaterial({ color: h.color });
        const dot = new Three.Mesh(dotGeo, dotMat);
        dot.position.set(...h.position);
        brainGroup.add(dot);
        const haloTex = makeHaloTexture(h.color);
        const haloMat = new Three.SpriteMaterial({
          map: haloTex,
          transparent: true,
          blending: Three.AdditiveBlending,
          depthWrite: false,
        });
        const halo = new Three.Sprite(haloMat);
        halo.scale.setScalar(0.5);
        halo.position.set(...h.position);
        brainGroup.add(halo);
        return { dot, halo, haloTex, phase: i * 0.85 };
      });

      // ---------- Signal pulses ----------
      type Pulse = {
        mesh: THREE.Mesh;
        path: number[];
        hop: number;
        hopStartTime: number;
        hopDuration: number;
      };
      const randomPath = (length: number, startIdx?: number): number[] => {
        let cur = startIdx ?? Math.floor(Math.random() * nodes.length);
        const path = [cur];
        for (let i = 0; i < length - 1; i++) {
          const neighbors = adjacency[cur];
          if (!neighbors || neighbors.length === 0) break;
          const prev = path.length >= 2 ? path[path.length - 2]! : -1;
          const filtered =
            neighbors.length > 1 ? neighbors.filter((n) => n !== prev) : neighbors;
          cur = filtered[Math.floor(Math.random() * filtered.length)]!;
          path.push(cur);
        }
        return path;
      };
      const pulseGeo = new Three.SphereGeometry(0.032, 12, 12);
      const pulses: Pulse[] = [];
      for (let i = 0; i < PULSE_COUNT; i++) {
        const pulseMat = new Three.MeshBasicMaterial({
          color: 0xa7f3e8,
          transparent: true,
          opacity: 0,
          blending: Three.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new Three.Mesh(pulseGeo, pulseMat);
        brainGroup.add(mesh);
        const hops =
          PULSE_HOPS_MIN +
          Math.floor(Math.random() * (PULSE_HOPS_MAX - PULSE_HOPS_MIN + 1));
        pulses.push({
          mesh,
          path: randomPath(hops + 1),
          hop: 0,
          hopStartTime: performance.now() / 1000 + i * 0.5,
          hopDuration: 0.55 + Math.random() * 0.3,
        });
      }

      // ---------- Resize handling ----------
      const handleResize = () => {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // ---------- Visibility pause ----------
      let isOnScreen = true;
      const io = new IntersectionObserver(
        (entries) => {
          isOnScreen = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 },
      );
      io.observe(mount);

      // ---------- Animate ----------
      const startTime = performance.now();
      const ROT_RATE = (Math.PI * 2) / ROTATION_PERIOD_SEC;
      const tick = () => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        if (!isOnScreen) return;

        const now = performance.now() / 1000;
        const t = (performance.now() - startTime) / 1000;

        if (reducedMotion) {
          brainGroup.rotation.y = -Math.PI * 0.22;
          brainGroup.rotation.x = 0;
          brainGroup.position.y = 0;
        } else {
          brainGroup.rotation.y = t * ROT_RATE;
          brainGroup.rotation.x = Math.sin(t * 0.18) * 0.06;
          brainGroup.position.y = Math.sin(t * 0.55) * 0.04;
        }

        for (const h of hotspots) {
          const pulse = 0.85 + 0.35 * Math.sin(t * 2.2 + h.phase);
          h.halo.scale.setScalar(0.45 + 0.2 * pulse);
          (h.halo.material as THREE.SpriteMaterial).opacity = 0.45 + 0.3 * pulse;
        }

        for (const p of pulses) {
          let progress = (now - p.hopStartTime) / p.hopDuration;
          if (progress < 0) {
            p.mesh.visible = false;
            continue;
          }
          p.mesh.visible = true;
          while (progress >= 1) {
            p.hop += 1;
            if (p.hop >= p.path.length - 1) {
              const hops =
                PULSE_HOPS_MIN +
                Math.floor(Math.random() * (PULSE_HOPS_MAX - PULSE_HOPS_MIN + 1));
              p.path = randomPath(hops + 1);
              p.hop = 0;
            }
            p.hopStartTime = now - (progress - 1) * p.hopDuration;
            p.hopDuration = 0.55 + Math.random() * 0.3;
            progress = (now - p.hopStartTime) / p.hopDuration;
          }
          const fromIdx = p.path[p.hop]!;
          const toIdx = p.path[p.hop + 1];
          if (toIdx == null) continue;
          const from = nodes[fromIdx]!.position;
          const to = nodes[toIdx]!.position;
          const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
          p.mesh.position.lerpVectors(from, to, eased);
          const nodeFlash = Math.exp(-Math.pow((progress - 0.5) * 4, 2));
          (p.mesh.material as THREE.MeshBasicMaterial).opacity =
            0.5 + 0.45 * nodeFlash;
        }

        renderer.render(scene, camera);
      };
      tick();

      // ---------- Cleanup ----------
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        io.disconnect();
        regular.geo.dispose();
        regular.mat.dispose();
        hubs.geo.dispose();
        hubs.mat.dispose();
        edgeGeo.dispose();
        edgeMat.dispose();
        pulseGeo.dispose();
        for (const h of hotspots) {
          (h.dot.geometry as THREE.BufferGeometry).dispose();
          (h.dot.material as THREE.Material).dispose();
          (h.halo.material as THREE.SpriteMaterial).dispose();
          h.haloTex.dispose();
        }
        for (const p of pulses) {
          (p.mesh.material as THREE.Material).dispose();
        }
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <BrainStaticFallback />;
  }

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="A three-dimensional rotating network of luminous teal dots that forms the anatomical shape of a pediatric brain: two cerebral hemispheres divided by an interhemispheric fissure, a cerebellum below and behind, and a brainstem descending. Five colored monitoring-channel hotspots glow at sensor positions, and signal pulses travel along the network connections."
      className="brain-model-mount"
    />
  );
}

/**
 * BrainStaticFallback, used when prefers-reduced-motion is on, or when the
 * caller opts in. Pure SVG, no WebGL, no animation, anatomical brain
 * silhouette + five monitoring-channel hotspots in matching colours.
 */
function BrainStaticFallback() {
  return (
    <div
      role="img"
      aria-label="A static anatomical illustration of a pediatric brain: two cerebral hemispheres divided by an interhemispheric fissure, a cerebellum below and behind, and a brainstem descending. Five colored monitoring-channel hotspots mark the sensor positions."
      className="brain-model-mount flex items-center justify-center"
    >
      <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="brainHaze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hotspotL" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hotspotR" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#14B8A6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hotspotC" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hotspotF" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FBBF24" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hotspotE" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx="300" cy="300" r="230" fill="url(#brainHaze)" />

        {/* Cerebral hemispheres (two lobes joined by interhemispheric fissure) */}
        <g fill="none" stroke="#14B8A6" strokeWidth="1.2" opacity="0.45">
          <path d="M 160 230 Q 130 170 200 130 Q 270 90 300 110 L 300 360 Q 240 380 200 360 Q 130 330 160 230 Z" />
          <path d="M 440 230 Q 470 170 400 130 Q 330 90 300 110 L 300 360 Q 360 380 400 360 Q 470 330 440 230 Z" />
        </g>

        {/* Sulci texture, dotted strokes hint at gyri/sulci */}
        <g fill="none" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="2 4" opacity="0.4">
          <path d="M 180 200 Q 210 170 250 180 Q 280 190 290 220" />
          <path d="M 200 280 Q 230 260 270 280 Q 290 290 290 320" />
          <path d="M 410 200 Q 380 170 340 180 Q 320 190 310 220" />
          <path d="M 400 280 Q 370 260 330 280 Q 310 290 310 320" />
        </g>

        {/* Cerebellum (below and behind the hemispheres) */}
        <g fill="none" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.4">
          <ellipse cx="300" cy="430" rx="120" ry="50" />
          <path d="M 200 430 Q 250 415 300 430 Q 350 445 400 430" />
          <line x1="300" y1="380" x2="300" y2="480" />
        </g>

        {/* Brainstem (descending below the cerebellum) */}
        <g fill="none" stroke="#94A3B8" strokeWidth="1.2" opacity="0.55">
          <path d="M 285 470 Q 290 510 295 540 L 305 540 Q 310 510 315 470 Z" />
        </g>

        {/* 640-dot mesh stand-in: pepper a sparse grid of luminous dots inside the cortex */}
        <g fill="#5EEAD4" opacity="0.55">
          {Array.from({ length: 90 }).map((_, i) => {
            // pseudo-random but deterministic placement
            const seed = i * 9301 + 49297;
            const x = ((seed * 233280) % 100) / 100;
            const y = ((seed * 4) % 100) / 100;
            const angle = x * Math.PI * 2;
            const radius = 110 + y * 110;
            const cx = 300 + Math.cos(angle) * radius * 0.85;
            const cy = 250 + Math.sin(angle) * radius * 0.7;
            const r = 1 + ((seed * 7) % 3) * 0.4;
            return <circle key={i} cx={cx} cy={cy} r={r} />;
          })}
        </g>

        {/* Five monitoring-channel hotspots */}
        {/* ICP, frontal vertex (amber) */}
        <circle cx="300" cy="120" r="40" fill="url(#hotspotL)" />
        <circle cx="300" cy="120" r="5" fill="#F59E0B" />
        {/* NIRS, right frontal cortex (teal) */}
        <circle cx="395" cy="200" r="36" fill="url(#hotspotR)" />
        <circle cx="395" cy="200" r="4.5" fill="#14B8A6" />
        {/* cEEG, left parietal (purple) */}
        <circle cx="195" cy="230" r="36" fill="url(#hotspotC)" />
        <circle cx="195" cy="230" r="4.5" fill="#8B5CF6" />
        {/* TCD, right MCA window (yellow) */}
        <circle cx="425" cy="305" r="34" fill="url(#hotspotF)" />
        <circle cx="425" cy="305" r="4.5" fill="#FBBF24" />
        {/* NPi, left orbital (mint) */}
        <circle cx="215" cy="320" r="32" fill="url(#hotspotE)" />
        <circle cx="215" cy="320" r="4.5" fill="#2DD4BF" />
      </svg>
    </div>
  );
}
