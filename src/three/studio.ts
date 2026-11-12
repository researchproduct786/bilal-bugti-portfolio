/**
 * The studio — a single, self-contained Three.js scene.
 *
 * Framework-free on purpose: React only mounts a <canvas> and forwards scroll progress.
 * Everything is procedural (no model or texture downloads), so the whole signature
 * experience costs one code-split JS chunk and zero additional network requests.
 *
 * The seated figure is a deliberately faceless placeholder — not a likeness of anyone.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

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

export interface StudioOptions { onReady?: () => void; maxDpr?: number }

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

    this.path = new THREE.CatmullRomCurve3([V(3.5, 2.05, 5.4), V(2.1, 1.6, 3.5), V(0.2, 1.5, 2.75), V(-1.55, 1.42, 1.75), V(-1.95, 1.36, 0.55)], false, 'catmullrom', 0.5);
    this.look = new THREE.CatmullRomCurve3([V(-1.25, 1.0, -0.3), V(-0.35, 1.1, 0), V(0, 1.18, 0.2), V(0, 1.2, 0.45), V(0, 1.22, 0.6)]);

    this.buildRoom(); this.buildDesk(); this.buildFigure(); this.buildLights(); this.buildFx();
    this.resize(); this.applyCamera(0); this.renderer.compile(this.scene, this.camera);
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
      const s = this.mesh(new THREE.PlaneGeometry(0.656, 0.378), this.track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })), V(0, 0, 0.0125), g, false); s.receiveShadow = false;
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
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.22, 0.52, 1.0) * 2.6 * smoothstep(0.05, 0.0, mf - thr) * step(0.002, uMorph);');
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
    const skin = this.dissolving({ color: 0x9c755c, roughness: 0.72 });
    const hair = this.dissolving({ color: 0x050506, roughness: 0.55 });
    const plate = this.plated({ color: 0x596069, roughness: 0.36, metalness: 1, envMapIntensity: 2.0 });
    const joint = this.std({ color: 0x15181d, roughness: 0.4, metalness: 0.9, envMapIntensity: 2 });
    const g = new THREE.Group(); this.scene.add(g);
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
    pair(new THREE.CylinderGeometry(0.05, 0.058, 0.12, 16), skin, V(0, 1.325, 0.7), undefined, undefined, 0.8);       // neck
    pair(new THREE.SphereGeometry(0.115, 32, 24), skin, V(0, 1.465, 0.68), undefined, V(0.9, 1.1, 1.0), 0.94);        // head
    pair(new THREE.SphereGeometry(0.122, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.68), hair, V(0, 1.48, 0.7), new THREE.Quaternion().setFromEuler(new THREE.Euler(0.6, 0, 0)), V(0.95, 1.08, 1.04), 0.5);
    for (const sx of [-1, 1]) {
      const sh = V(0.235 * sx, 1.2, 0.71), el = V(0.29 * sx, 0.93, 0.56), wr = V(0.16 * sx, 0.815, 0.27);
      limb(sh, el, 0.058, cloth); limb(el, wr, 0.047, cloth);
      pair(new THREE.SphereGeometry(0.045, 16, 12), skin, V(0.15 * sx, 0.812, 0.2), undefined, V(0.95, 0.5, 1.5), 0.92);
      const hip = V(0.1 * sx, 0.6, 0.78), kn = V(0.14 * sx, 0.585, 0.34), an = V(0.14 * sx, 0.13, 0.4);
      limb(hip, kn, 0.082, trousers); limb(kn, an, 0.06, trousers);
      pair(new THREE.BoxGeometry(0.095, 0.07, 0.25), trousers, V(0.14 * sx, 0.04, 0.33), undefined, undefined, 0.94);
    }
    // Machine-only details: emissive spine and visor, driven by the morph value.
    const lit = (c: number) => { const m = this.std({ color: 0x05070a, emissive: c, emissiveIntensity: 0, roughness: 0.3, metalness: 0.6 }); this.fx.extras.push(m); return m; };
    const blue = lit(0x5a9bff);
    for (let i = 0; i < 6; i++) this.box(0.03, 0.028, 0.012, blue, V(0, 0.76 + i * 0.075, 0.905 - i * 0.011), g, false);
    const visor = this.mesh(new THREE.SphereGeometry(0.1165, 32, 6, Math.PI * 1.5 - 0.95, 1.9, Math.PI * 0.43, Math.PI * 0.085), blue, V(0, 1.465, 0.68), g, false); visor.scale.set(0.9, 1.1, 1.0).multiplyScalar(0.955);
    for (const sx of [-1, 1]) this.mesh(new THREE.TorusGeometry(0.052, 0.006, 8, 24), blue, V(0.29 * sx, 0.93, 0.56), g, false).rotation.y = Math.PI / 2;
    g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.frustumCulled = false; });
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
    const m = this.morphOverride ?? smooth(0.26, 0.9, p);
    this.uniforms.uMorph.value = m;
    const late = smooth(0.45, 1, m);
    for (const e of this.fx.extras) e.emissiveIntensity = late * 2.4;
    (this.fx.mats[0] as THREE.MeshBasicMaterial).opacity = late * 0.55;
    (this.fx.mats[1] as THREE.PointsMaterial).opacity = late * 0.4;
    if (this.fx.screenLight) this.fx.screenLight.intensity = 3.4 + late * 2.2;
  }

  private tick = () => {
    if (!this.active) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.applyCamera(dt);
    if (this.fx.points) { this.fx.points.rotation.y = Math.sin(this.clock.elapsedTime * 0.07) * 0.25; this.fx.points.position.y = Math.sin(this.clock.elapsedTime * 0.3) * 0.04; }
    this.renderer.render(this.scene, this.camera);
    if (!this.ready) { this.ready = true; this.opts.onReady?.(); }
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
    this.setActive(false);
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

export function webglAvailable() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
