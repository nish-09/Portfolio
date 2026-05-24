'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './CinematicLayer.module.css';

// ─── Particle config ─────────────────────────────────────────────────────────
const LARGE_COUNT  = 55;   // big dreamy bokeh blobs
const MEDIUM_COUNT = 200;  // mid-field particles
const SMALL_COUNT  = 120;  // tiny sparkle dust
const TOTAL        = LARGE_COUNT + MEDIUM_COUNT + SMALL_COUNT;

// ─── Soft-circle sprite texture ──────────────────────────────────────────────
function buildSpriteTexture(): THREE.CanvasTexture {
  const SIZE = 128;
  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    SIZE / 2, SIZE / 2, 0,
    SIZE / 2, SIZE / 2, SIZE / 2,
  );
  grad.addColorStop(0.00, 'rgba(255,255,255,1)');
  grad.addColorStop(0.20, 'rgba(255,210,130,0.85)');
  grad.addColorStop(0.55, 'rgba(255,160, 60,0.30)');
  grad.addColorStop(1.00, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  return new THREE.CanvasTexture(canvas);
}

// ─── Vertex shader — per-vertex size ─────────────────────────────────────────
const vert = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  varying   vec3  vColor;
  varying   float vAlpha;

  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (380.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;

    // soft depth fade for back-layer particles
    float d  = clamp((-mv.z - 0.8) / 4.0, 0.0, 1.0);
    vAlpha   = 1.0 - d * 0.55;
  }
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
const frag = /* glsl */ `
  uniform sampler2D uTex;
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec4 t = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(vColor, vAlpha) * t;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CinematicLayer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── scene / camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6);

    // ── geometry arrays ───────────────────────────────────────────────────────
    const positions  = new Float32Array(TOTAL * 3);
    const sizes      = new Float32Array(TOTAL);
    const colors     = new Float32Array(TOTAL * 3);
    const phases     = new Float32Array(TOTAL);     // per-particle sine phase
    const freqs      = new Float32Array(TOTAL);     // oscillation frequency
    const ampX       = new Float32Array(TOTAL);     // horizontal amplitude
    const ampY       = new Float32Array(TOTAL);     // vertical amplitude
    const basePos    = new Float32Array(TOTAL * 3); // original resting positions

    const rng = Math.random;

    for (let i = 0; i < TOTAL; i++) {
      const isLarge  = i < LARGE_COUNT;
      const isMedium = i >= LARGE_COUNT && i < LARGE_COUNT + MEDIUM_COUNT;

      // ── spread ──────────────────────────────────────────────────────────────
      const px = (rng() - 0.5) * 16;
      const py = (rng() - 0.5) * 10;
      const pz = isLarge ? (rng() - 0.5) * 4 : (rng() - 0.5) * 6;
      basePos[i * 3]     = positions[i * 3]     = px;
      basePos[i * 3 + 1] = positions[i * 3 + 1] = py;
      basePos[i * 3 + 2] = positions[i * 3 + 2] = pz;

      // ── sizes ───────────────────────────────────────────────────────────────
      if (isLarge)       sizes[i] = 0.55 + rng() * 0.45;   // large bokeh
      else if (isMedium) sizes[i] = 0.12 + rng() * 0.14;
      else               sizes[i] = 0.03 + rng() * 0.05;   // sparkle dust

      // ── colours: warm orange (60%) · cream white (30%) · cool accent (10%) ─
      const pick = rng();
      if (pick < 0.60) {
        // warm amber → orange
        const v = rng();
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.38 + v * 0.42;
        colors[i * 3 + 2] = 0.05 + v * 0.12;
      } else if (pick < 0.90) {
        // cream / warm white
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.92 + rng() * 0.08;
        colors[i * 3 + 2] = 0.80 + rng() * 0.20;
      } else {
        // rare: cool monitor-blue hint
        colors[i * 3]     = 0.55 + rng() * 0.20;
        colors[i * 3 + 1] = 0.82 + rng() * 0.10;
        colors[i * 3 + 2] = 1.0;
      }

      // ── motion params ────────────────────────────────────────────────────────
      phases[i] = rng() * Math.PI * 2;
      freqs[i]  = 0.12 + rng() * 0.28;
      ampX[i]   = (isLarge ? 0.06 : 0.10) + rng() * 0.10;
      ampY[i]   = (isLarge ? 0.08 : 0.12) + rng() * 0.12;
    }

    // ── build geometry ────────────────────────────────────────────────────────
    const geo = new THREE.BufferGeometry();
    const posAttr   = new THREE.BufferAttribute(positions, 3);
    const sizeAttr  = new THREE.BufferAttribute(sizes,     1);
    const colorAttr = new THREE.BufferAttribute(colors,    3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('aSize',    sizeAttr);
    geo.setAttribute('aColor',   colorAttr);

    // ── material ──────────────────────────────────────────────────────────────
    const tex = buildSpriteTexture();
    const mat = new THREE.ShaderMaterial({
      uniforms:       { uTex: { value: tex } },
      vertexShader:   vert,
      fragmentShader: frag,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── mouse parallax ────────────────────────────────────────────────────────
    let rawMX = 0;
    let rawMY = 0;
    let camX  = 0;
    let camY  = 0;

    const onMouseMove = (e: MouseEvent) => {
      rawMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      rawMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── animation loop ────────────────────────────────────────────────────────
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;

      // sine-wave oscillation
      for (let i = 0; i < TOTAL; i++) {
        const ph = phases[i];
        const fr = freqs[i];
        posAttr.setXYZ(
          i,
          basePos[i * 3]     + Math.cos(t * fr * 0.8 + ph) * ampX[i],
          basePos[i * 3 + 1] + Math.sin(t * fr       + ph) * ampY[i],
          basePos[i * 3 + 2] + Math.sin(t * fr * 0.5 + ph + 1.2) * 0.06,
        );
      }
      posAttr.needsUpdate = true;

      // smooth camera parallax (lerp)
      camX += (rawMX * 0.45 - camX) * 0.025;
      camY += (-rawMY * 0.28 - camY) * 0.025;
      camera.position.set(camX, camY, 6);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    // ── cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden="true" />;
}
