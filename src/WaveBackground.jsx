import React, { useEffect, useRef } from "react";

// Glass's wave background, ported from fun-redesign-2. Runs on the graphics card,
// and three.js only downloads when Glass is on.

const MARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 41.5"><path fill="%23e9ddc8" d="M38.5,17v13.9h-6V9.5h16.1c-0.3,0.3-0.2,0.8-0.7,1.5c-0.6,0.8-1.2,0.4-1.7,1c-0.4,0.5-0.3,1.1-0.7,1.7c-0.6,0.8-1.5,0.5-2.2,1.3c-0.5,0.7-0.5,1.3-1,2H38.5z"/><path fill="%23e9ddc8" d="M24.1,9.5c-0.3,0.3-0.2,0.9-0.7,1.5c-0.6,0.8-1.2,0.4-1.7,1c-0.4,0.5-0.3,1.1-0.7,1.6c-0.6,0.8-1.5,0.5-2.2,1.3c-0.5,0.7-0.5,1.3-1,2h7.8v7h-6.5c-0.5,0-1,0.1-1.3-0.3c-0.3-0.3-0.3-0.6-0.3-1l0-13.1h-6.9l0,15.1c0,1.8,1.2,3.5,1.8,4.1c0.8,0.8,2.5,2.2,4.5,2.2h9.1l5.5-6.3l0-15.1h34.1z"/></svg>';

const DURATION = 22; // seconds per wave cycle
const MARKS_PER_WAVE = 13;
const MARKS_PER_BUMP = 9;
const COLS = 52, ROWS = 36;
const GRID_WIDTH = 180, GRID_DEPTH = 150;
const MARK_WIDTH = 2.4, MARK_HEIGHT = 1.75; // keep the mark's ~1.4:1 shape
const LIFT_HEIGHT = 5;
const TILT_STRENGTH = 0.4;
const MARK_BRIGHTNESS = 0.7;
const FOG_NEAR = 55, FOG_FAR = 140; // far rows fade out instead of ending in a hard line

const vertexShader = `
attribute float aPhase;
attribute float aAmp;
uniform float uTime;
uniform float uLift;
uniform vec2 uWaveDir;
uniform float uTilt;
uniform float uBrightness;
varying vec2 vUv;
varying float vOpacity;
varying float vFogDepth;
void main(){
  float local = fract(uTime - aPhase + 1.0);
  float lift = (1.0 - cos(local * 6.283185)) / 2.0;
  float slope = sin(local * 6.283185);
  vOpacity = (0.28 + lift * aAmp * 0.3) * uBrightness;
  float proj = position.x * uWaveDir.x + position.z * uWaveDir.y;
  float tilt = -slope * aAmp * uTilt * proj;
  vec4 p = instanceMatrix * vec4(position, 1.0);
  p.y += lift * aAmp * uLift + tilt;
  vec4 mv = modelViewMatrix * p;
  gl_Position = projectionMatrix * mv;
  vUv = uv;
  vFogDepth = -mv.z;
}`;

const fragmentShader = `
uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec2 vUv;
varying float vOpacity;
varying float vFogDepth;
void main(){
  vec4 tex = texture2D(uMap, vUv);
  float fog = smoothstep(uFogNear, uFogFar, vFogDepth);
  float a = tex.a * vOpacity * (1.0 - fog);
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}`;

const SAND = [233 / 255, 221 / 255, 200 / 255];
const NAVY = [11 / 255, 34 / 255, 64 / 255];

// onSoftwareGraphics: called if the computer has no real graphics card, so 3D will be slow
export default function WaveBackground({ light = false, onSoftwareGraphics }) {
  const canvasRef = useRef(null);
  const materialRef = useRef(null);
  const redrawRef = useRef(() => {});
  const lightRef = useRef(light);
  lightRef.current = light;

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uColor.value.fromArray(light ? NAVY : SAND);
    material.uniforms.uBrightness.value = light ? MARK_BRIGHTNESS * 1.6 : MARK_BRIGHTNESS;
    redrawRef.current();
  }, [light]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import("three")
      .then((THREE) => {
        if (disposed) return;
        const canvas = canvasRef.current;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        } catch {
          return; // no WebGL, so just keep the plain gradient
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const gl = renderer.getContext();
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || "");
        if (/swiftshader|llvmpipe|software|basic render/i.test(gpu)) onSoftwareGraphics?.();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 35, 70);
        camera.lookAt(0, 0, -10);

        const texCanvas = document.createElement("canvas");
        texCanvas.width = texCanvas.height = 128;
        const texture = new THREE.CanvasTexture(texCanvas);
        texture.minFilter = THREE.LinearFilter; // mipmaps blur the thin strokes into blobs at this size
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        const img = new Image();
        img.onload = () => {
          texCanvas.getContext("2d").drawImage(img, 10, 25, 108, 77);
          texture.needsUpdate = true;
          if (reduceMotion) renderer.render(scene, camera); // redraw the still frame now that the mark exists
        };
        img.src = "data:image/svg+xml," + MARK_SVG;

        const count = COLS * ROWS;
        const travelMax = COLS + ROWS;
        const wavelength = travelMax / Math.max(1, Math.round(travelMax / MARKS_PER_WAVE));
        const bumps = Math.max(1, Math.round(travelMax / MARKS_PER_BUMP));
        const stepX = GRID_WIDTH / COLS, stepZ = GRID_DEPTH / ROWS;

        const geometry = new THREE.PlaneGeometry(MARK_WIDTH, MARK_HEIGHT);
        geometry.rotateX(-Math.PI / 2);
        const phase = new Float32Array(count);
        const amp = new Float32Array(count);
        geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
        geometry.setAttribute("aAmp", new THREE.InstancedBufferAttribute(amp, 1));

        let dirX = 1 / stepX, dirZ = -1 / stepZ;
        const len = Math.hypot(dirX, dirZ);
        dirX /= len; dirZ /= len;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uMap: { value: texture },
            uColor: { value: new THREE.Color().fromArray(lightRef.current ? NAVY : SAND) },
            uLift: { value: LIFT_HEIGHT },
            uFogNear: { value: FOG_NEAR },
            uFogFar: { value: FOG_FAR },
            uWaveDir: { value: new THREE.Vector2(dirX, dirZ) },
            uTilt: { value: TILT_STRENGTH },
            uBrightness: { value: lightRef.current ? MARK_BRIGHTNESS * 1.6 : MARK_BRIGHTNESS },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        materialRef.current = material;
        // with reduced motion there's no loop, so a recolor needs a manual redraw
        redrawRef.current = () => { if (reduceMotion) renderer.render(scene, camera); };
        const mesh = new THREE.InstancedMesh(geometry, material, count);
        const m = new THREE.Matrix4();
        let p = 0;
        for (let ix = 0; ix < COLS; ix++) {
          for (let iz = 0; iz < ROWS; iz++) {
            m.makeTranslation((ix - COLS / 2) * stepX, 0, (iz - ROWS / 2) * stepZ);
            mesh.setMatrixAt(p, m);
            phase[p] = ((ix + (ROWS - iz)) % wavelength) / wavelength;
            amp[p] = 0.5 + 0.5 * Math.sin(((ix + iz) / travelMax) * bumps * 2 * Math.PI);
            p++;
          }
        }
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);

        const resize = () => {
          const w = canvas.clientWidth, h = canvas.clientHeight;
          if (!w || !h) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          if (reduceMotion) renderer.render(scene, camera);
        };
        resize();
        window.addEventListener("resize", resize);

        let frame = 0;
        const start = performance.now();
        const render = (now) => {
          material.uniforms.uTime.value = (now - start) / 1000 / DURATION;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(render);
        };
        if (reduceMotion) renderer.render(scene, camera);
        else frame = requestAnimationFrame(render);

        cleanup = () => {
          materialRef.current = null;
          redrawRef.current = () => {};
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          img.onload = null;
          geometry.dispose();
          material.dispose();
          texture.dispose();
          mesh.dispose?.();
          renderer.dispose();
        };
      })
      .catch(() => {}); // if three.js fails to load, the gradient still shows

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="wave-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
