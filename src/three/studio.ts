/**
 * The studio — a single, self-contained Three.js scene.
 *
 * Framework-free on purpose: React only mounts a <canvas> and forwards scroll progress.
 * The room, desk, screens and body are procedural. The head is the one downloaded asset:
 * `/avatar/head.glb`, Bilal's personal avatar, reconstructed from a single photograph
 * (see tools/avatar/README.md). During the transformation the face is never replaced —
 * plating grows over the neck, skull and one side of the jaw while the face stays human.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const NOISE_GLSL = /* glsl */ `
  varying vec3 vWPos; uniform float uMorph; uniform vec3 uOrigin;
  float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
  float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
  float morphField(){ float d = clamp(distance(vWPos, uOrigin) / 1.05, 0.0, 1.0);
    float n = vnoise(vWPos * 13.0) * 0.62 + vnoise(vWPos * 41.0) * 0.38; return d * 0.56 + n * 0.44; }
`;

export interface StudioOptions { onReady?: () => void; maxDpr?: number; avatarUrl?: string }

export class StudioScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  private uniforms = { uMorph: { value: 0 }, uOrigin: { value: V(0, 0.8, 0.2) } };
  private disposables: { dispose: () => void }[] = [];
  private raf = 0;
  private active = false;
  private target = 0;
  private progress = 0;
  private morphOverride: number | null = null;
  private pointer = new THREE.Vector2();
  private pointerEase = new THREE.Vector2();
  private path: THREE.CatmullRomCurve3;
  private look: THREE.CatmullRomCurve3;
  private fx: { mats: (THREE.MeshBasicMaterial | THREE.PointsMaterial)[]; extras: THREE.MeshStandardMaterial[]; points?: THREE.Points; screenLight?: THREE.PointLight } = { mats: [], extras: [] };
  private head = new THREE.Group(); private headParts: THREE.Object3D[] = []; private figure = new THREE.Group();
  private screens: THREE.MeshBasicMaterial[] = []; private holos: { m: THREE.Mesh; base: THREE.Vector3; out: THREE.Vector3; ph: number; q: THREE.Quaternion }[] = []; private tmpQ = new THREE.Quaternion(); private tmpM = new THREE.Matrix4();
  private avatarLoaded = false; private disposed = false; private faceLight?: THREE.SpotLight;
  private clock = new THREE.Clock();
  private frames = 0; private slow = 0; private dpr: number; private ready = false;
  private w = 1; private h = 1;

  constructor(private canvas: HTMLCanvasElement, private opts: StudioOptions = {}) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false });
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 1.75);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(0x040507);
    this.scene.fog = new THREE.FogExp2(0x05070b, 0.058);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = env; this.scene.environmentIntensity = 0.22;
    pmrem.dispose(); this.disposables.push(env);

    this.path = new THREE.CatmullRomCurve3([V(3.5, 2.05, 5.4), V(2.1, 1.6, 3.5), V(0.2, 1.5, 2.75), V(-1.5, 1.44, 1.9), V(-1.9, 1.42, 0.7), V(-1.3, 1.5, 0.12), V(-0.6, 1.52, 0.1)], false, 'catmullrom', 0.5);
    this.look = new THREE.CatmullRomCurve3([V(-1.25, 1.0, -0.3), V(-0.35, 1.1, 0), V(0, 1.18, 0.2), V(0, 1.22, 0.45), V(0, 1.3, 0.6), V(0, 1.42, 0.66), V(0.02, 1.46, 0.66)]);

    this.buildRoom(); this.buildDesk(); this.buildFigure(); this.buildLights(); this.buildFx(); this.buildHolograms();
    this.resize(); this.applyCamera(0); this.renderer.compile(this.scene, this.camera);
    canvas.addEventListener('webglcontextlost', this.onLost, false); canvas.addEventListener('webglcontextrestored', this.onRestored, false);
    this.loadAvatar(opts.avatarUrl ?? '/avatar/head.glb');
  }

  /* ───────── helpers ───────── */
  private track<T extends { dispose: () => void }>(o: T) { this.disposables.push(o); return o; }
  private std(p: THREE.MeshStandardMaterialParameters) { return this.track(new THREE.MeshStandardMaterial(p)); }
  private mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos?: THREE.Vector3, parent: THREE.Object3D = this.scene, shadow = true) {
    this.track(geo); const m = new THREE.Mesh(geo, mat); if (pos) m.position.copy(pos);
    m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
  }
  private box(w: number, h: number, d: number, mat: THREE.Material, pos: THREE.Vector3, parent?: THREE.Object3D, shadow = true) { return this.mesh(new THREE.BoxGeometry(w, h, d), mat, pos, parent, shadow); }
  private canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d')!);
    const t = this.track(new THREE.CanvasTexture(cv)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }

  /* ───────── room ───────── */
  private buildRoom() {
    const floor = this.std({ color: 0x0b0c0f, roughness: 0.46, metalness: 0.5 });
    const f = this.mesh(new THREE.PlaneGeometry(22, 22), floor, V(0, 0, 0), this.scene, false); f.rotation.x = -Math.PI / 2;
    const wall = this.std({ color: 0x0c0e12, roughness: 0.85, metalness: 0.1 });
    this.box(16, 5, 0.2, wall, V(0, 2.5, -3.1), this.scene, false);
    this.box(0.2, 5, 14, wall, V(-5.2, 2.5, 1), this.scene, false);
    // Slatted acoustic panel behind the desk — gives the back wall physical depth.
    const slatGeo = this.track(new THREE.BoxGeometry(0.07, 3.2, 0.09));
    const slats = new THREE.InstancedMesh(slatGeo, this.std({ color: 0x15181d, roughness: 0.7, metalness: 0.2 }), 44);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 44; i++) { m4.setPosition(-2.9 + i * 0.135, 1.75, -2.96); slats.setMatrixAt(i, m4); }
    slats.receiveShadow = true; this.scene.add(slats);
    // Two restrained light bars, and an LED wash behind the desk.
    const bar = this.track(new THREE.MeshBasicMaterial({ color: 0x4f86e8 }));
    this.box(0.035, 2.6, 0.03, bar, V(-3.25, 1.7, -2.93), this.scene, false);
    this.box(0.035, 2.6, 0.03, bar, V(3.25, 1.7, -2.93), this.scene, false);
    // Shelf with a few objects, right side.
    const wood = this.std({ color: 0x19130f, roughness: 0.6 });
    const dark = this.std({ color: 0x0d0e11, roughness: 0.55, metalness: 0.3 });
    for (const y of [1.1, 1.75]) this.box(1.5, 0.04, 0.3, wood, V(4.05, y, -2.8));
    const rnd = (s: number) => { const x = Math.sin(s * 91.7) * 43758.5; return x - Math.floor(x); };
    for (let i = 0; i < 9; i++) { const hh = 0.2 + rnd(i) * 0.14; this.box(0.04 + rnd(i + 3) * 0.04, hh, 0.2, i % 3 ? dark : wood, V(3.5 + i * 0.085, 1.12 + hh / 2, -2.8)); }
    this.mesh(new THREE.SphereGeometry(0.11, 24, 16), this.std({ color: 0x2a2d33, roughness: 0.25, metalness: 0.9 }), V(4.45, 1.88, -2.8));
    // Plant, left — dark silhouettes that catch the warm light.
    const pot = this.std({ color: 0x101114, roughness: 0.5 });
    this.mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.4, 24), pot, V(-2.7, 0.2, -1.7));
    const leafMat = this.std({ color: 0x12301f, roughness: 0.55, side: THREE.DoubleSide });
    const leafGeo = this.track(new THREE.SphereGeometry(1, 10, 8));
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + rnd(i) * 0.5, r = 0.18 + rnd(i + 7) * 0.3, hgt = 0.6 + rnd(i + 11) * 0.95;
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.scale.set(0.085, 0.012, 0.24 + rnd(i + 2) * 0.1);
      leaf.position.set(-2.7 + Math.cos(a) * r, hgt, -1.7 + Math.sin(a) * r);
      leaf.rotation.set(-0.6 + rnd(i + 5) * 0.5, -a + Math.PI / 2, 0, 'YXZ'); leaf.castShadow = true; this.scene.add(leaf);
      const stem = this.mesh(new THREE.CylinderGeometry(0.006, 0.008, hgt - 0.35, 5), leafMat, V(-2.7 + Math.cos(a) * r * 0.5, 0.35 + (hgt - 0.35) / 2, -1.7 + Math.sin(a) * r * 0.5), this.scene, false);
      stem.rotation.z = Math.cos(a) * -0.25; stem.rotation.x = Math.sin(a) * 0.25;
    }
    // Pendant lamp: the warm key light has a visible source.
    const shade = this.std({ color: 0x08090b, roughness: 0.4, metalness: 0.7, side: THREE.DoubleSide });
    this.mesh(new THREE.ConeGeometry(0.26, 0.2, 32, 1, true), shade, V(1.9, 2.52, -0.9));
    this.mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.6, 6), shade, V(1.9, 3.4, -0.9), this.scene, false);
    this.mesh(new THREE.SphereGeometry(0.06, 16, 12), this.track(new THREE.MeshBasicMaterial({ color: 0xffd9a6 })), V(1.9, 2.47, -0.9), this.scene, false);
  }

  /* ───────── desk, screens, chair ───────── */
  private codeTex(seed: number) {
    return this.canvasTex(640, 372, (c) => {
      c.fillStyle = '#04070c'; c.fillRect(0, 0, 640, 372);
      c.fillStyle = '#0a1019'; c.fillRect(0, 0, 640, 20); c.fillRect(0, 20, 92, 352);
      const cols = ['#6aa3ff', '#9fb4c8', '#7fd1b9', '#e6c08a', '#5d6b7c', '#c7a6ff'];
      let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      for (let i = 0; i < 9; i++) { c.fillStyle = i === 2 ? '#31465f' : '#18222f'; c.fillRect(10, 34 + i * 16, 30 + r() * 44, 5); }
      for (let l = 0; l < 30; l++) {
        const y = 32 + l * 11.2; c.fillStyle = '#243040'; c.fillRect(102, y, 10, 4);
        let x = 124 + Math.floor(r() * 4) * 16; if (r() < 0.14) continue;
        const n = 1 + Math.floor(r() * 5);
        for (let k = 0; k < n; k++) { const w = 12 + r() * 70; c.fillStyle = cols[Math.floor(r() * cols.length)]; c.globalAlpha = 0.55 + r() * 0.45; c.fillRect(x, y, w, 4.2); x += w + 7; if (x > 600) break; }
        c.globalAlpha = 1;
      }
    });
  }
  private dashTex() {
    return this.canvasTex(640, 372, (c) => {
      c.fillStyle = '#04070c'; c.fillRect(0, 0, 640, 372);
      c.fillStyle = '#0b121c'; for (const [x, y, w, h] of [[20, 20, 380, 200], [416, 20, 204, 96], [416, 124, 204, 96], [20, 236, 190, 116], [226, 236, 394, 116]]) c.fillRect(x, y, w, h);
      c.strokeStyle = '#6aa3ff'; c.lineWidth = 2.5; c.beginPath();
      for (let i = 0; i <= 30; i++) { const x = 36 + i * 11.6, y = 180 - (Math.sin(i * 0.5) * 18 + i * 3.4 + Math.sin(i * 1.7) * 9); if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
      c.fillStyle = '#e6c08a'; c.fillRect(432, 40, 70, 10); c.fillStyle = '#eef2f7'; c.fillRect(432, 62, 120, 22); c.fillRect(432, 166, 96, 22); c.fillStyle = '#7fd1b9'; c.fillRect(432, 144, 54, 10);
      for (let i = 0; i < 12; i++) { c.fillStyle = i % 4 === 3 ? '#6aa3ff' : '#22364f'; const h = 20 + ((i * 37) % 60); c.fillRect(244 + i * 30, 336 - h, 18, h); }
      c.fillStyle = '#1a2738'; for (let i = 0; i < 5; i++) c.fillRect(34, 254 + i * 18, 90 + ((i * 53) % 70), 6);
    });
  }
  private buildDesk() {
    const top = this.std({ color: 0x1c1511, roughness: 0.42, metalness: 0.05 });
    const metal = this.std({ color: 0x0b0c0e, roughness: 0.45, metalness: 0.85 });
    const alu = this.std({ color: 0x8e9197, roughness: 0.34, metalness: 0.95 });
    this.box(2.5, 0.045, 0.98, top, V(0, 0.752, -0.06));
    for (const x of [-1.15, 1.15]) { this.box(0.05, 0.73, 0.7, metal, V(x, 0.365, -0.06)); this.box(0.06, 0.03, 0.85, metal, V(x, 0.015, -0.06)); }
    this.box(2.3, 0.012, 0.012, this.track(new THREE.MeshBasicMaterial({ color: 0x2f62c8 })), V(0, 0.722, -0.545), this.scene, false);

    const bezel = this.std({ color: 0x050506, roughness: 0.35, metalness: 0.6 });
    const glow = this.canvasTex(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, 'rgba(90,150,255,.55)'); g.addColorStop(1, 'rgba(90,150,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });
    const screens: [number, number, number, THREE.Texture][] = [[0, -0.36, 0, this.codeTex(7)], [-0.69, -0.23, 0.42, this.dashTex()], [0.69, -0.23, -0.42, this.codeTex(31)]];
    for (const [x, z, ry, tex] of screens) {
      const g = new THREE.Group(); g.position.set(x, 1.2, z); g.rotation.y = ry; this.scene.add(g);
      this.box(0.68, 0.4, 0.022, bezel, V(0, 0, 0), g);
      const sm = this.track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); this.screens.push(sm);
      const s = this.mesh(new THREE.PlaneGeometry(0.656, 0.378), sm, V(0, 0, 0.0125), g, false); s.receiveShadow = false;
      const halo = this.mesh(new THREE.PlaneGeometry(1.7, 1.2), this.track(new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 })), V(0, 0, -0.03), g, false); halo.receiveShadow = false;
      this.box(0.04, 0.3, 0.03, metal, V(0, -0.3, -0.03), g); this.box(0.24, 0.012, 0.16, metal, V(0, -0.431, -0.02), g);
    }
    // Laptop, left of the keyboard.
    const lap = new THREE.Group(); lap.position.set(-0.86, 0.776, 0.14); lap.rotation.y = 0.5; this.scene.add(lap);
    this.box(0.33, 0.012, 0.225, alu, V(0, 0.006, 0), lap);
    this.box(0.29, 0.002, 0.11, this.std({ color: 0x0c0d0f, roughness: 0.6 }), V(0, 0.013, -0.035), lap, false);
    const lid = new THREE.Group(); lid.position.set(0, 0.012, -0.1125); lid.rotation.x = -0.3; lap.add(lid);
    this.box(0.33, 0.215, 0.008, alu, V(0, 0.1075, 0), lid);
    const ls = this.mesh(new THREE.PlaneGeometry(0.31, 0.195), this.track(new THREE.MeshBasicMaterial({ map: this.dashTex(), toneMapped: false })), V(0, 0.1075, 0.0045), lid, false); ls.receiveShadow = false;
    // Keyboard, mouse, mug, notebook.
    this.box(0.44, 0.016, 0.135, this.std({ color: 0x0d0e10, roughness: 0.55, metalness: 0.4 }), V(0, 0.783, 0.19));
    const keys = this.canvasTex(256, 80, (c) => { c.fillStyle = '#0d0e10'; c.fillRect(0, 0, 256, 80); c.fillStyle = '#23262b'; for (let r = 0; r < 5; r++) for (let k = 0; k < 15; k++) c.fillRect(5 + k * 16.6, 5 + r * 15, 13.5, 11.5); });
    const kp = this.mesh(new THREE.PlaneGeometry(0.43, 0.126), this.std({ map: keys, roughness: 0.6 }), V(0, 0.7915, 0.19), this.scene, false); kp.rotation.x = -Math.PI / 2;
    const mouse = this.mesh(new THREE.SphereGeometry(0.035, 16, 12), metal, V(0.36, 0.785, 0.2)); mouse.scale.set(0.9, 0.5, 1.5);
    this.mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.095, 24), this.std({ color: 0x0a0a0b, roughness: 0.3 }), V(0.82, 0.822, 0.16));
    const nb = this.box(0.2, 0.014, 0.27, this.std({ color: 0x14161a, roughness: 0.8 }), V(0.6, 0.782, 0.2)); nb.rotation.y = -0.2;

    // Chair.
    const fabric = this.std({ color: 0x0b0c0e, roughness: 0.9 });
    this.box(0.5, 0.085, 0.5, fabric, V(0, 0.5, 0.82));
    const back = this.box(0.47, 0.5, 0.07, fabric, V(0, 0.84, 1.1)); back.rotation.x = 0.12;
    this.mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), metal, V(0, 0.27, 0.82));
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; const leg = this.box(0.34, 0.03, 0.045, metal, V(Math.cos(a) * 0.17, 0.07, 0.82 + Math.sin(a) * 0.17)); leg.rotation.y = -a; }
    for (const x of [-0.27, 0.27]) this.box(0.05, 0.03, 0.26, metal, V(x, 0.7, 0.86));
  }

  /* ───────── figure: human shell over a machine core ───────── */
  private dissolving(p: THREE.MeshStandardMaterialParameters) {
    const mat = this.std(p); const u = this.uniforms;
    mat.onBeforeCompile = (s) => {
      s.uniforms.uMorph = u.uMorph; s.uniforms.uOrigin = u.uOrigin;
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\n' + NOISE_GLSL)
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nfloat mf = morphField(); float thr = uMorph * 1.14 - 0.07; if (mf < thr) discard;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.22, 0.52, 1.0) * 1.7 * smoothstep(0.016, 0.0, mf - thr) * step(0.002, uMorph);');
    };
    mat.customProgramCacheKey = () => 'dissolve';
    return mat;
  }
  private plated(p: THREE.MeshStandardMaterialParameters) {
    const mat = this.std(p); const u = this.uniforms;
    mat.onBeforeCompile = (s) => {
      s.uniforms.uMorph = u.uMorph; s.uniforms.uOrigin = u.uOrigin;
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\n' + NOISE_GLSL)
        .replace('#include <color_fragment>', '#include <color_fragment>\nfloat seam = step(0.955, fract(vWPos.y * 6.5 + 0.2)); float pnl = step(0.52, vnoise(vWPos * vec3(7.0, 5.0, 7.0))); diffuseColor.rgb *= (0.72 + 0.28 * pnl) * (1.0 - 0.8 * seam);')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.2, 0.5, 1.0) * seam * 0.3 * uMorph;');
    };
    mat.customProgramCacheKey = () => 'plated';
    return mat;
  }
  private buildFigure() {
    const cloth = this.dissolving({ color: 0x111319, roughness: 0.94 });
    const trousers = this.dissolving({ color: 0x0b0c0f, roughness: 0.9 });
    const skin = this.dissolving({ color: 0xa8775f, roughness: 0.72 });
    const plate = this.plated({ color: 0x596069, roughness: 0.36, metalness: 1, envMapIntensity: 2.0 });
    const joint = this.std({ color: 0x15181d, roughness: 0.4, metalness: 0.9, envMapIntensity: 2 });
    const g = this.figure; this.scene.add(g);
    const up = V(0, 1, 0);
    const pair = (geo: THREE.BufferGeometry, shell: THREE.Material, pos: THREE.Vector3, q?: THREE.Quaternion, scale?: THREE.Vector3, core = 0.9) => {
      this.track(geo);
      for (const [mat, k] of [[shell, 1], [plate, core]] as [THREE.Material, number][]) {
        const m = new THREE.Mesh(geo, mat); m.position.copy(pos); if (q) m.quaternion.copy(q);
        m.scale.copy(scale ?? V(1, 1, 1)).multiplyScalar(k); m.castShadow = k === 1; m.receiveShadow = true; g.add(m);
      }
    };
    const limb = (a: THREE.Vector3, b: THREE.Vector3, r: number, shell: THREE.Material) => {
      const d = b.clone().sub(a); const len = d.length();
      pair(new THREE.CapsuleGeometry(r, len, 6, 16), shell, a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(up, d.normalize()), undefined, 0.88);
      this.mesh(new THREE.SphereGeometry(r * 0.86, 14, 10), joint, a, g, false);
    };
    const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.16, 0, 0));
    pair(new THREE.CapsuleGeometry(0.175, 0.36, 8, 24), cloth, V(0, 0.93, 0.76), lean, V(1.12, 1, 0.82));          // torso
    pair(new THREE.SphereGeometry(0.2, 24, 16), trousers, V(0, 0.62, 0.8), undefined, V(1.05, 0.62, 0.95));           // pelvis
    pair(new THREE.SphereGeometry(0.15, 20, 14), cloth, V(0, 1.265, 0.8), undefined, V(1.25, 0.55, 0.8), 0.25);       // hood
    for (const sx of [-1, 1]) {
      const sh = V(0.235 * sx, 1.2, 0.71), el = V(0.29 * sx, 0.93, 0.56), wr = V(0.16 * sx, 0.815, 0.27);
      limb(sh, el, 0.058, cloth); limb(el, wr, 0.047, cloth);
      pair(new THREE.SphereGeometry(0.045, 16, 12), skin, V(0.15 * sx, 0.812, 0.2), undefined, V(0.95, 0.5, 1.5), 0.92);
      const hip = V(0.1 * sx, 0.6, 0.78), kn = V(0.14 * sx, 0.585, 0.34), an = V(0.14 * sx, 0.13, 0.4);
      limb(hip, kn, 0.082, trousers); limb(kn, an, 0.06, trousers);
      pair(new THREE.BoxGeometry(0.095, 0.07, 0.25), trousers, V(0.14 * sx, 0.04, 0.33), undefined, undefined, 0.94);
    }
    this.mesh(new THREE.CylinderGeometry(0.05, 0.062, 0.2, 20), joint, V(0, 1.2, 0.738), g, false);   // neck column, hidden by the hood until it dissolves
    // Machine-only details: emissive spine and visor, driven by the morph value.
    const lit = (c: number) => { const m = this.std({ color: 0x05070a, emissive: c, emissiveIntensity: 0, roughness: 0.3, metalness: 0.6 }); this.fx.extras.push(m); return m; };
    const blue = lit(0x5a9bff);
    for (let i = 0; i < 6; i++) this.box(0.03, 0.028, 0.012, blue, V(0, 0.76 + i * 0.075, 0.905 - i * 0.011), g, false);
    for (const sx of [-1, 1]) this.mesh(new THREE.TorusGeometry(0.052, 0.006, 8, 24), blue, V(0.29 * sx, 0.93, 0.56), g, false).rotation.y = Math.PI / 2;
    g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.frustumCulled = false; });
  }

  /* ───────── head: the personal avatar ───────── */
  private skinShader(mat: THREE.MeshStandardMaterial) {
    const u = this.uniforms;
    mat.onBeforeCompile = (s) => {
      s.uniforms.uMorph = u.uMorph; s.uniforms.uToHead = { value: mat.userData.toHead ?? new THREE.Matrix4() };
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOPos; uniform mat4 uToHead;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvOPos = (uToHead * vec4(position, 1.0)).xyz;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', /* glsl */ `#include <common>
        varying vec3 vOPos; uniform float uMorph; float gMech; float gSeam; float gGlow;
        float c3(vec3 p){ return fract(sin(dot(floor(p), vec3(12.9898,78.233,37.719))) * 43758.5453); }`)
        .replace('#include <map_fragment>', /* glsl */ `#include <map_fragment>
        {
          vec3 p = vOPos;
          // where plating may grow: neck, back of the skull, behind the ears, and the right side of the jaw
          if (p.y < 0.052 || (p.y < 0.09 && length(p.xz - vec2(0.0, -0.012)) > 0.066)) discard;   // the bust below the collar is never shown
          float neck = smoothstep(0.112, 0.075, p.y);
          float back = smoothstep(0.012, -0.075, p.z) * smoothstep(0.06, 0.13, p.y);
          float side = smoothstep(0.052, 0.074, abs(p.x)) * smoothstep(0.05, -0.012, p.z);
          float jaw  = smoothstep(0.02, 0.05, -p.x) * smoothstep(0.2, 0.15, p.y) * smoothstep(0.085, 0.045, p.z);
          float temple = smoothstep(0.03, 0.058, -p.x) * smoothstep(0.228, 0.256, p.y) * 0.95;
          float region = max(max(neck, back), max(max(side, jaw), temple));
          vec3 cell = p * vec3(46.0, 34.0, 46.0);
          float order = region + (c3(cell) - 0.5) * 0.26;                 // panels arrive one by one
          float thr = 1.12 - uMorph * 0.78;
          gMech = smoothstep(thr, thr + 0.012, order) * step(0.001, uMorph);
          vec3 fc = abs(fract(cell) - 0.5); float line = smoothstep(0.455, 0.49, max(fc.x, max(fc.y, fc.z)));
          float rings = smoothstep(0.42, 0.49, abs(fract(p.y * 62.0) - 0.5)) * neck;
          gSeam = max(line, rings) * gMech;
          gGlow = smoothstep(0.035, 0.0, abs(order - thr)) * step(0.001, uMorph) * (1.0 - step(0.999, uMorph) * 0.6);
          vec3 metal = vec3(0.115, 0.125, 0.14) * (0.8 + 0.4 * c3(cell + 7.0));
          diffuseColor.rgb = mix(diffuseColor.rgb, metal * (1.0 - 0.75 * gSeam), gMech);
        }`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.34, gMech);')
        .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 1.0, gMech);')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.2, 0.5, 1.0) * (gGlow * 2.2 + gSeam * step(0.86, c3(vOPos * vec3(46.0, 34.0, 46.0) + 3.0)) * 1.6 * uMorph);');
    };
    mat.customProgramCacheKey = () => 'avatar-skin';
  }
  private loadAvatar(url: string) {
    const head = this.head; head.position.set(0, 1.238, 0.725); head.rotation.y = Math.PI; this.figure.add(head);
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, (gltf) => {
      if (this.disposed) return;
      const u = this.uniforms;
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((o) => {
        const m = o as THREE.Mesh; if (!m.isMesh) return;
        (m.material as THREE.Material).userData.toHead = m.matrixWorld.clone();   // compressed meshes are quantised + node-transformed; shaders work in head space
        m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
        const mat = m.material as THREE.MeshStandardMaterial; this.track(mat); this.track(m.geometry); if (mat.map) { mat.map.anisotropy = 8; this.track(mat.map); }
        if (m.name === 'Skin') { mat.roughness = 0.58; mat.envMapIntensity = 0.6; this.skinShader(mat); }
        if (m.name === 'Hair') { mat.vertexColors = true; mat.color.set(0x0d0b0a); mat.roughness = 0.66; mat.envMapIntensity = 0.5; }
        if (m.name === 'Eyes') {
          mat.vertexColors = true; mat.roughness = 0.08; mat.envMapIntensity = 1.4;
          mat.onBeforeCompile = (s) => {
            s.uniforms.uMorph = u.uMorph; s.uniforms.uToHead = { value: mat.userData.toHead ?? new THREE.Matrix4() };
            s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOPos; uniform mat4 uToHead;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvOPos = (uToHead * vec4(position, 1.0)).xyz;');
            s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vOPos; uniform float uMorph;')
              .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat iris = step(vColor.r, 0.2) * step(0.02, vColor.r) * step(vOPos.x, 0.0); totalEmissiveRadiance += vec3(0.16, 0.45, 1.0) * iris * smoothstep(0.55, 1.0, uMorph) * 9.0;');
          };
          mat.customProgramCacheKey = () => 'avatar-eyes';
        }
      });
      head.add(gltf.scene);
      // Hardware that seats itself as the plating completes: ear module, jaw rail, neck collar.
      const dark = this.std({ color: 0x14171c, roughness: 0.32, metalness: 1, envMapIntensity: 2 });
      const glow = this.std({ color: 0x05070a, emissive: 0x5a9bff, emissiveIntensity: 0, roughness: 0.3, metalness: 0.6 }); this.fx.extras.push(glow);
      const part = (m: THREE.Mesh) => { m.castShadow = false; this.headParts.push(m); m.scale.setScalar(0.001); return m; };
      const ear = part(this.mesh(new THREE.CylinderGeometry(0.017, 0.02, 0.012, 24), dark, V(-0.079, 0.208, -0.012), head)); ear.rotation.z = Math.PI / 2;
      const earRing = part(this.mesh(new THREE.TorusGeometry(0.0125, 0.0022, 8, 28), glow, V(-0.0855, 0.208, -0.012), head)); earRing.rotation.y = Math.PI / 2;
      const rail = part(this.box(0.004, 0.006, 0.058, dark, V(-0.071, 0.158, 0.012), head)); rail.rotation.x = 0.5;
      const collar = part(this.mesh(new THREE.TorusGeometry(0.058, 0.007, 10, 40), dark, V(0, 0.062, -0.012), head)); collar.rotation.x = Math.PI / 2 + 0.18; collar.scale.z = 1;
      const collarGlow = part(this.mesh(new THREE.TorusGeometry(0.0595, 0.0018, 6, 40), glow, V(0, 0.071, -0.012), head)); collarGlow.rotation.x = Math.PI / 2 + 0.18;
      this.avatarLoaded = true; this.renderer.compile(this.scene, this.camera);
      if (!this.active) this.renderOnce();
      if (!this.ready) { this.ready = true; this.opts.onReady?.(); }
    }, undefined, () => { if (this.disposed) return; this.buildFallbackHead(); if (!this.ready) { this.ready = true; this.opts.onReady?.(); } });
  }
  /** Only used if the avatar file cannot be fetched: a neutral, clearly non-personal head so the scene still reads. */
  private buildFallbackHead() {
    const skin = this.dissolving({ color: 0xa8775f, roughness: 0.72 }); const plate = this.plated({ color: 0x596069, roughness: 0.36, metalness: 1 });
    for (const [mat, k] of [[skin, 1], [plate, 0.94]] as [THREE.Material, number][]) { const m = this.mesh(new THREE.SphereGeometry(0.115, 32, 24), mat, V(0, 1.465, 0.68), this.figure); m.scale.set(0.9, 1.1, 1).multiplyScalar(k); }
  }
  /** Floating interface panels — the work the desk produces — that surface as the scene comes alive. */
  private buildHolograms() {
    const panel = (w: number, h: number, draw: (c: CanvasRenderingContext2D, W: number, H: number) => void) => this.canvasTex(w, h, (c) => {
      c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(8,14,24,.82)'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(120,170,255,.75)'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2); draw(c, w, h);
    });
    const blue = '#7fb0ff', pale = '#dfe8f5', dim = '#2a3d5c', warm = '#e6c08a';
    const defs: { tex: THREE.Texture; w: number; h: number; base: THREE.Vector3; out: THREE.Vector3; ry: number }[] = [
      { // storefront
        tex: panel(320, 220, (c) => { c.fillStyle = pale; c.fillRect(16, 16, 90, 8); c.fillStyle = dim; for (let i = 0; i < 3; i++) { c.fillRect(16 + i * 98, 40, 88, 96); } c.fillStyle = warm; c.fillRect(34, 70, 52, 34); c.fillRect(140, 62, 36, 50); c.fillRect(230, 78, 56, 22); c.fillStyle = pale; for (let i = 0; i < 3; i++) c.fillRect(16 + i * 98, 146, 60, 6); c.fillStyle = blue; c.fillRect(16, 176, 120, 26); }),
        w: 0.4, h: 0.275, base: V(-1.02, 1.62, 0.1), out: V(0.1, 1.78, 1.85), ry: 0.6 },
      { // phone
        tex: panel(150, 290, (c) => { c.fillStyle = pale; c.fillRect(16, 20, 60, 8); c.fillStyle = blue; c.fillRect(16, 40, 118, 54); c.fillStyle = dim; for (let i = 0; i < 4; i++) c.fillRect(16, 108 + i * 36, 118, 26); c.fillStyle = warm; for (let i = 0; i < 4; i++) c.fillRect(24, 116 + i * 36, 10, 10); c.fillStyle = pale; for (let i = 0; i < 4; i++) c.fillRect(42, 118 + i * 36, 50 + (i * 17) % 30, 5); }),
        w: 0.17, h: 0.33, base: V(1.02, 1.6, 0.16), out: V(1.12, 1.6, 0.8), ry: -0.55 },
      { // pipeline
        tex: panel(340, 180, (c) => { for (let k = 0; k < 4; k++) { c.fillStyle = dim; c.fillRect(14 + k * 80, 14, 72, 152); c.fillStyle = pale; c.fillRect(20 + k * 80, 22, 40, 5); for (let i = 0; i < 3 - (k % 2); i++) { c.fillStyle = k === 3 ? '#7fd1b9' : blue; c.globalAlpha = 0.85; c.fillRect(20 + k * 80, 38 + i * 40, 60, 30); c.globalAlpha = 1; } } }),
        w: 0.42, h: 0.222, base: V(0.42, 1.86, -0.3), out: V(0.42, 2.0, 1.6), ry: -0.18 },
      { // growth chart
        tex: panel(300, 180, (c) => { c.fillStyle = pale; c.fillRect(16, 16, 80, 8); c.strokeStyle = blue; c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 20; i++) { const x = 18 + i * 13.2, y = 150 - i * 4.6 - Math.sin(i * 0.9) * 12; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.fillStyle = dim; for (let i = 0; i < 9; i++) c.fillRect(22 + i * 30, 160 - (14 + (i * 23) % 40), 16, 14 + (i * 23) % 40); }),
        w: 0.36, h: 0.216, base: V(-0.46, 1.84, -0.32), out: V(1.4, 1.28, 0.5), ry: 0.2 },
    ];
    for (const [i, d] of defs.entries()) {
      const mat = this.track(new THREE.MeshBasicMaterial({ map: d.tex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
      const m = this.mesh(new THREE.PlaneGeometry(d.w, d.h), mat, d.base, this.scene, false); m.receiveShadow = false; m.rotation.y = d.ry; m.renderOrder = 2;
      this.holos.push({ m, base: d.base, out: d.out, ph: i * 1.7, q: m.quaternion.clone() });
    }
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0x2a3a55, 0x060606, 0.5));
    const key = new THREE.SpotLight(0xffb878, 46, 12, 0.7, 0.85, 1.4);
    key.position.set(1.9, 2.45, -0.9); key.target.position.set(0, 0.7, 0.55); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0008; key.shadow.radius = 5;
    this.scene.add(key, key.target);
    const screen = new THREE.PointLight(0x6aa0ff, 3.4, 5, 1.6); screen.position.set(0, 1.25, 0.05); this.scene.add(screen); this.fx.screenLight = screen;
    const rim = new THREE.DirectionalLight(0x7fa6e8, 0.85); rim.position.set(-3.5, 2.6, 3.4); this.scene.add(rim);
    const wash = new THREE.PointLight(0x2f62c8, 1.4, 4, 1.8); wash.position.set(0, 0.6, -0.9); this.scene.add(wash);
    const far = new THREE.PointLight(0xffa868, 5, 7, 1.7); far.position.set(3.6, 2.2, -2.2); this.scene.add(far);
    // A soft key that only comes up when the camera reaches the face, so the likeness is actually lit.
    const face = new THREE.SpotLight(0xffd2a8, 0, 4, 0.5, 0.9, 1.2); face.position.set(-0.2, 2.1, -0.75); face.target.position.set(0, 1.45, 0.66); this.scene.add(face, face.target); this.faceLight = face;
  }

  private buildFx() {
    // Floor traces that light up as the figure becomes part of the system.
    const g = new THREE.Group(); g.position.y = 0.004; this.scene.add(g);
    const mat = this.track(new THREE.MeshBasicMaterial({ color: 0x4f8dff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); this.fx.mats.push(mat);
    const seg = (x1: number, z1: number, x2: number, z2: number) => {
      const len = Math.hypot(x2 - x1, z2 - z1); const m = this.mesh(new THREE.PlaneGeometry(len, 0.012), mat, V((x1 + x2) / 2, 0, (z1 + z2) / 2), g, false);
      m.rotation.set(-Math.PI / 2, -Math.atan2(z2 - z1, x2 - x1), 0, 'YXZ'); m.receiveShadow = false;
    };
    const runs: number[][] = [[0, 0.82, 0, 2.4, 1.6, 2.4, 1.6, 6], [-0.3, 0.82, -1.6, 0.82, -1.6, 2.0, -4.6, 2.0], [0.3, 0.82, 2.2, 0.82, 2.2, -0.4, 5, -0.4], [-0.15, 0.6, -0.15, -2.2, -2.0, -2.2, -2.0, -3], [0.15, 0.6, 0.15, -1.6, 1.3, -1.6, 1.3, -3]];
    for (const r of runs) for (let i = 0; i + 3 < r.length; i += 2) seg(r[i], r[i + 1], r[i + 2], r[i + 3]);
    // Drifting data motes in front of the screens.
    const n = 220, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 2.6; pos[i * 3 + 1] = 0.8 + Math.random() * 1.5; pos[i * 3 + 2] = -0.4 + Math.random() * 1.5; }
    const pg = this.track(new THREE.BufferGeometry()); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = this.track(new THREE.PointsMaterial({ color: 0x8fb8ff, size: 0.007, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
    this.fx.mats.push(pm); this.fx.points = new THREE.Points(pg, pm); this.fx.points.frustumCulled = false; this.scene.add(this.fx.points);
  }

  /* ───────── public API ───────── */
  setProgress(p: number) { this.target = Math.min(1, Math.max(0, p)); }
  jumpTo(p: number) { this.target = this.progress = Math.min(1, Math.max(0, p)); }
  setMorph(m: number | null) { this.morphOverride = m; }
  setPointer(x: number, y: number) { this.pointer.set(x, y); }
  setActive(on: boolean) {
    if (on === this.active) return; this.active = on;
    if (on) { this.clock.getDelta(); this.raf = requestAnimationFrame(this.tick); } else cancelAnimationFrame(this.raf);
  }
  resize() {
    const w = this.canvas.clientWidth || 1, h = this.canvas.clientHeight || 1; this.w = w; this.h = h;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h;
    // Portrait viewports get a wider lens so the composition still reads.
    this.camera.fov = w / h < 1 ? 52 : w / h < 1.5 ? 40 : 34; this.camera.updateProjectionMatrix();
    if (!this.active) this.renderOnce();
  }
  renderOnce() { this.applyCamera(0); this.renderer.render(this.scene, this.camera); }

  private applyCamera(dt: number) {
    const k = dt ? 1 - Math.exp(-dt * 4.2) : 1;
    this.progress += (this.target - this.progress) * k;
    this.pointerEase.lerp(this.pointer, dt ? 1 - Math.exp(-dt * 3) : 1);
    const p = this.progress;
    const pos = this.path.getPoint(p), look = this.look.getPoint(p);
    pos.x += this.pointerEase.x * 0.16; pos.y += this.pointerEase.y * -0.08;
    this.camera.position.copy(pos); this.camera.lookAt(look);
    const m = this.morphOverride ?? smooth(0.47, 0.9, p);
    this.uniforms.uMorph.value = m;
    const late = smooth(0.45, 1, m);
    for (const e of this.fx.extras) e.emissiveIntensity = late * 2.4;
    (this.fx.mats[0] as THREE.MeshBasicMaterial).opacity = late * 0.55;
    (this.fx.mats[1] as THREE.PointsMaterial).opacity = late * 0.4;
    // Screens wake up as the camera approaches; the light they throw follows.
    const wake = smooth(0.02, 0.24, p), t = this.clock.elapsedTime;
    this.screens.forEach((sm, i) => sm.color.setScalar(0.1 + 0.9 * smooth(i * 0.12, 0.6 + i * 0.12, wake)));
    if (this.fx.screenLight) this.fx.screenLight.intensity = (0.6 + 2.8 * wake) + late * 2.2;
    // Interface panels surface (scene 2–3), then drift outwards into the wider world (scene 6).
    const show = smooth(0.26, 0.4, p) * (1 - smooth(0.56, 0.68, p) * (1 - smooth(0.8, 0.95, p)) * 0.8), spread = smooth(0.7, 0.94, p);
    for (const h of this.holos) {
      h.m.position.lerpVectors(h.base, h.out, spread); h.m.position.y += Math.sin(t * 0.6 + h.ph) * 0.012 - (1 - smooth(0.2, 0.36, p)) * 0.08;
      this.tmpM.lookAt(this.camera.position, h.m.position, this.camera.up); this.tmpQ.setFromRotationMatrix(this.tmpM); h.m.quaternion.slerpQuaternions(h.q, this.tmpQ, spread); h.m.scale.setScalar(1 + spread * 0.45);
      (h.m.material as THREE.MeshBasicMaterial).opacity = show * 0.92; h.m.visible = show > 0.01;
    }
    // The head: an idle, then a turn towards the viewer as the transformation resolves.
    const turn = smooth(0.6, 0.9, p);
    this.head.rotation.set(-0.05 + turn * 0.03 + Math.sin(t * 0.5) * 0.008, Math.PI + turn * 0.62 + Math.sin(t * 0.33) * 0.012 + this.pointerEase.x * 0.04, turn * -0.03);
    for (const part of this.headParts) { const k = Math.max(0.001, smooth(0.5, 0.85, m)); part.scale.set(k, k, k); part.visible = k > 0.002; }
    if (this.faceLight) this.faceLight.intensity = smooth(0.55, 0.9, p) * 5.5;
  }
  private onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(this.raf); };
  private onRestored = () => { if (this.active) { this.clock.getDelta(); this.raf = requestAnimationFrame(this.tick); } else this.renderOnce(); };

  private tick = () => {
    if (!this.active) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.applyCamera(dt);
    if (this.fx.points) { this.fx.points.rotation.y = Math.sin(this.clock.elapsedTime * 0.07) * 0.25; this.fx.points.position.y = Math.sin(this.clock.elapsedTime * 0.3) * 0.04; }
    this.renderer.render(this.scene, this.camera);
    // Automatic quality: if frames run long, step resolution down, then drop shadows.
    this.frames++; if (dt > 0.03) this.slow++;
    if (this.frames >= 90) {
      if (this.slow > 36) {
        if (this.dpr > 1) { this.dpr = Math.max(1, this.dpr - 0.375); this.renderer.setPixelRatio(this.dpr); this.renderer.setSize(this.w, this.h, false); }
        else if (this.renderer.shadowMap.enabled) { this.renderer.shadowMap.enabled = false; this.scene.traverse((o) => { const mm = (o as THREE.Mesh).material as THREE.Material | undefined; if (mm) mm.needsUpdate = true; }); }
      }
      this.frames = 0; this.slow = 0;
    }
  };

  dispose() {
    this.disposed = true; this.setActive(false);
    this.canvas.removeEventListener('webglcontextlost', this.onLost); this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

export function webglAvailable() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
