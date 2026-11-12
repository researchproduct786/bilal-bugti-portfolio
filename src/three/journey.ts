/**
 * The seven-step process as one connected 3D journey.
 * A single track of light runs through seven small dioramas; the camera travels along it with scroll.
 * Everything is procedural (no downloads), unshadowed and cheap enough for integrated GPUs.
 */
import * as THREE from 'three';

const GAP = 7;
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
type Part = { o: THREE.Object3D; from: THREE.Vector3; to: THREE.Vector3; s0: number; delay: number };

export class JourneyScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
  private stations: { g: THREE.Group; parts: Part[]; light: THREE.PointLight; spin: THREE.Object3D[] }[] = [];
  private disposables: { dispose(): void }[] = [];
  private mats: Record<string, THREE.Material> = {};
  private progress = 0; private target = 0; private raf = 0; private active = false; private disposed = false; private t0 = performance.now();
  private pulse!: THREE.Mesh; private rtl: boolean;
  private scan?: THREE.Mesh; private pointer = new THREE.Vector2();

  constructor(private canvas: HTMLCanvasElement, opts: { rtl?: boolean } = {}) {
    this.rtl = !!opts.rtl;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.scene.fog = new THREE.Fog(0x060709, 13, 34);
    const M = (k: string, p: THREE.MeshStandardMaterialParameters) => { const m = new THREE.MeshStandardMaterial(p); this.mats[k] = m; this.disposables.push(m); return m; };
    M('dark', { color: 0x23272e, roughness: 0.6, metalness: 0.35 });
    M('mid', { color: 0x59616d, roughness: 0.55, metalness: 0.3 });
    M('warm', { color: 0xd39a52, roughness: 0.6, metalness: 0.1 });
    M('paper', { color: 0xe9e4da, roughness: 0.85 });
    M('blue', { color: 0x0a1220, emissive: 0x6aa3ff, emissiveIntensity: 1.6, roughness: 0.4 });
    M('amber', { color: 0x1a1206, emissive: 0xe8a04b, emissiveIntensity: 1.5, roughness: 0.4 });
    M('glass', { color: 0x9db8e8, transparent: true, opacity: 0.16, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide, depthWrite: false });
    M('screen', { color: 0x0b1220, emissive: 0x22406f, emissiveIntensity: 0.38, roughness: 0.35, metalness: 0.2 });
    const line = new THREE.LineBasicMaterial({ color: 0x6aa3ff, transparent: true, opacity: 0.75 }); this.mats.line = line; this.disposables.push(line);

    this.scene.add(new THREE.HemisphereLight(0xa9bbe0, 0x14100c, 1.0));
    const key = new THREE.DirectionalLight(0xfff0dc, 2.4); key.position.set(-4, 7, 6); this.scene.add(key);

    // ground + the connecting track
    const ground = new THREE.Mesh(this.geo(new THREE.PlaneGeometry(GAP * 9, 30)), M('ground', { color: 0x0d1016, roughness: 0.9, metalness: 0.1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(GAP * 3, 0, 0); this.scene.add(ground);
    const grid = new THREE.GridHelper(GAP * 9, 63, 0x2a3550, 0x171c27); grid.position.set(GAP * 3, 0.002, 0); this.scene.add(grid); this.disposables.push(grid.geometry, grid.material as THREE.Material);
    const track = new THREE.Mesh(this.geo(new THREE.BoxGeometry(GAP * 6 + 2, 0.012, 0.05)), this.mats.blue); track.position.set(GAP * 3, 0.01, 1.55); this.scene.add(track);
    this.pulse = new THREE.Mesh(this.geo(new THREE.SphereGeometry(0.07, 16, 12)), this.mats.amber); this.pulse.position.set(0, 0.08, 1.55); this.scene.add(this.pulse);

    const builders = [this.s1, this.s2, this.s3, this.s4, this.s5, this.s6, this.s7];
    builders.forEach((b, i) => {
      const g = new THREE.Group(); g.position.x = i * GAP; this.scene.add(g);
      const light = new THREE.PointLight(i % 2 ? 0x6aa3ff : 0xffc98a, 0, 9, 1.6); light.position.set(0.8, 2.8, 2.6); g.add(light);
      const node = new THREE.Mesh(this.geo(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 32)), this.mats.blue); node.position.set(0, 0.012, 1.55); g.add(node);
      const st = { g, parts: [] as Part[], light, spin: [] as THREE.Object3D[] }; this.stations.push(st);
      b.call(this, st);
    });
    canvas.addEventListener('webglcontextlost', this.onLost); canvas.addEventListener('webglcontextrestored', this.onRestored);
    this.resize(); this.frame(true);
  }

  private geo<T extends THREE.BufferGeometry>(g: T) { this.disposables.push(g); return g; }
  /** Adds a mesh that rises/assembles into place as its station becomes active. */
  private add(st: { g: THREE.Group; parts: Part[] }, geo: THREE.BufferGeometry, mat: string, to: [number, number, number], o: { from?: [number, number, number]; delay?: number; rot?: [number, number, number]; s0?: number } = {}) {
    const m = new THREE.Mesh(this.geo(geo), this.mats[mat]); if (o.rot) m.rotation.set(...o.rot);
    const toV = new THREE.Vector3(...to); const fromV = o.from ? new THREE.Vector3(...o.from) : toV.clone().add(new THREE.Vector3(0, -0.5, 0));
    m.position.copy(toV); st.g.add(m); st.parts.push({ o: m, from: fromV, to: toV, s0: o.s0 ?? 0.001, delay: o.delay ?? 0 }); return m;
  }
  private edges(st: { g: THREE.Group; parts: Part[] }, geo: THREE.BufferGeometry, to: [number, number, number], delay = 0) {
    const e = this.geo(new THREE.EdgesGeometry(geo)); geo.dispose();
    const l = new THREE.LineSegments(e, this.mats.line as THREE.LineBasicMaterial); const v = new THREE.Vector3(...to); l.position.copy(v); st.g.add(l);
    st.parts.push({ o: l, from: v.clone(), to: v, s0: 0.001, delay }); return l;
  }
  private person(st: { g: THREE.Group; parts: Part[] }, x: number, z: number, delay: number, mat = 'mid') {
    this.add(st, new THREE.CapsuleGeometry(0.11, 0.42, 4, 12), mat, [x, 0.34, z], { delay });
    this.add(st, new THREE.SphereGeometry(0.1, 16, 12), 'paper', [x, 0.78, z], { delay: delay + 0.05 });
  }

  /* 1 — Understand the business: a small shop, its counter and the people in it. */
  private s1(st: JourneyScene['stations'][number]) {
    this.add(st, new THREE.BoxGeometry(2.4, 1.5, 1.4), 'dark', [0, 0.75, -0.4]);
    this.add(st, new THREE.BoxGeometry(2.6, 0.08, 1.7), 'mid', [0, 1.54, -0.3], { delay: 0.1 });
    this.add(st, new THREE.BoxGeometry(2.4, 0.06, 0.6), 'warm', [0, 1.2, 0.5], { delay: 0.2, rot: [0.35, 0, 0] });
    this.add(st, new THREE.PlaneGeometry(1.2, 0.8), 'screen', [-0.4, 0.75, 0.305], { delay: 0.25 });
    this.add(st, new THREE.BoxGeometry(0.5, 1.0, 0.04), 'mid', [0.75, 0.5, 0.31], { delay: 0.3 });
    this.add(st, new THREE.BoxGeometry(1.1, 0.5, 0.4), 'mid', [-0.2, 0.25, 1.0], { delay: 0.35 });
    this.person(st, -0.3, 0.72, 0.4, 'dark'); this.person(st, 0.9, 1.25, 0.5); this.person(st, 1.35, 0.9, 0.58);
  }
  /* 2 — Identify the real problem: a workflow chain with one link broken. */
  private s2(st: JourneyScene['stations'][number]) {
    for (let i = 0; i < 5; i++) {
      const bad = i === 2;
      this.add(st, new THREE.BoxGeometry(0.55, 0.55, 0.55), bad ? 'warm' : 'mid', [-1.6 + i * 0.8, bad ? 0.95 : 0.5, bad ? 0.45 : 0], { delay: i * 0.08, rot: bad ? [0.3, 0.5, 0.2] : [0, 0, 0] });
      if (i < 4) this.add(st, new THREE.BoxGeometry(0.25, 0.04, 0.04), (i === 1 || i === 2) ? 'dark' : 'blue', [-1.2 + i * 0.8, 0.5, 0], { delay: 0.3 + i * 0.05 });
    }
    const ring = this.add(st, new THREE.TorusGeometry(0.62, 0.012, 8, 64), 'amber', [0, 0.95, 0.45], { delay: 0.55 }); st.spin.push(ring);
    const ring2 = this.add(st, new THREE.TorusGeometry(0.78, 0.006, 8, 64), 'blue', [0, 0.95, 0.45], { delay: 0.62, rot: [1.1, 0, 0] }); st.spin.push(ring2);
  }
  /* 3 — Plan the solution: a blueprint with the structure drawn in outline. */
  private s3(st: JourneyScene['stations'][number]) {
    this.add(st, new THREE.BoxGeometry(3.2, 0.03, 2.2), 'screen', [0, 0.02, 0], { from: [0, 0.02, 0] });
    for (let i = 0; i < 7; i++) this.add(st, new THREE.BoxGeometry(3.0, 0.004, 0.008), 'blue', [0, 0.045, -0.9 + i * 0.3], { from: [0, 0.045, -0.9 + i * 0.3], delay: 0.05 + i * 0.03 });
    for (let i = 0; i < 9; i++) this.add(st, new THREE.BoxGeometry(0.008, 0.004, 2.0), 'blue', [-1.4 + i * 0.35, 0.045, 0], { from: [-1.4 + i * 0.35, 0.045, 0], delay: 0.1 + i * 0.03 });
    this.edges(st, new THREE.BoxGeometry(0.9, 0.9, 0.9), [-0.8, 0.5, -0.2], 0.4);
    this.edges(st, new THREE.BoxGeometry(0.7, 1.4, 0.7), [0.2, 0.75, -0.3], 0.5);
    this.edges(st, new THREE.BoxGeometry(0.9, 0.5, 0.9), [1.05, 0.3, 0.3], 0.6);
    this.add(st, new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), 'paper', [-0.2, 0.2, 0.85], { delay: 0.7, rot: [0, 0, 1.2] });
    for (let i = 0; i < 3; i++) this.add(st, new THREE.SphereGeometry(0.05, 12, 10), 'amber', [-0.8 + i * 0.95, 0.07, 0.7 - i * 0.2], { delay: 0.75 + i * 0.06 });
  }
  /* 4 — Design the experience: a browser frame and a phone, their layout blocks arriving. */
  private s4(st: JourneyScene['stations'][number]) {
    this.add(st, new THREE.BoxGeometry(2.3, 1.45, 0.05), 'dark', [-0.45, 1.05, -0.2], { from: [-0.45, 1.05, -1.4] });
    this.add(st, new THREE.PlaneGeometry(2.16, 1.3), 'screen', [-0.45, 1.05, -0.172], { from: [-0.45, 1.05, -1.37] });
    const blocks: [number, number, number, number, string][] = [[-1.0, 1.45, 0.9, 0.22, 'paper'], [0.25, 1.45, 0.5, 0.22, 'blue'], [-0.85, 1.0, 1.2, 0.45, 'mid'], [0.2, 1.0, 0.6, 0.45, 'warm'], [-0.45, 0.58, 2.0, 0.2, 'mid']];
    blocks.forEach(([x, y, w, h, m], i) => this.add(st, new THREE.BoxGeometry(w, h, 0.03), m, [x, y, -0.15], { from: [x, y, 1.6], delay: 0.2 + i * 0.09 }));
    this.add(st, new THREE.BoxGeometry(0.62, 1.2, 0.06), 'dark', [1.25, 0.72, 0.5], { from: [1.25, 0.72, 2.2], delay: 0.35, rot: [0, -0.35, 0] });
    this.add(st, new THREE.PlaneGeometry(0.54, 1.1), 'screen', [1.24, 0.72, 0.535], { from: [1.24, 0.72, 2.24], delay: 0.35, rot: [0, -0.35, 0] });
    for (let i = 0; i < 3; i++) this.add(st, new THREE.BoxGeometry(0.42, 0.2, 0.02), i === 0 ? 'blue' : 'mid', [1.23, 1.05 - i * 0.3, 0.55], { from: [1.23, 1.05 - i * 0.3, 2.3], delay: 0.5 + i * 0.08, rot: [0, -0.35, 0] });
    this.add(st, new THREE.CylinderGeometry(0.5, 0.5, 0.04, 40), 'mid', [-0.45, 0.02, -0.2], { from: [-0.45, 0.02, -0.2] });
    this.add(st, new THREE.BoxGeometry(0.12, 0.3, 0.12), 'mid', [-0.45, 0.18, -0.2]);
  }
  /* 5 — Build the product: the planned structure, now solid, assembled block by block. */
  private s5(st: JourneyScene['stations'][number]) {
    let k = 0;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4 - y; x++) for (let z = 0; z < 2; z++) {
      const m = (x + y + z) % 5 === 0 ? 'blue' : (x + z) % 2 ? 'mid' : 'dark';
      this.add(st, new THREE.BoxGeometry(0.5, 0.5, 0.5), m, [-0.82 + x * 0.55 + y * 0.275, 0.26 + y * 0.52, -0.3 + z * 0.55], { from: [-0.82 + x * 0.55 + y * 0.275, 3.2 + y, -0.3 + z * 0.55], delay: k++ * 0.035, s0: 0.6 });
    }
    this.add(st, new THREE.BoxGeometry(0.06, 2.6, 0.06), 'mid', [1.7, 1.3, -0.5]);
    this.add(st, new THREE.BoxGeometry(1.8, 0.06, 0.06), 'mid', [0.9, 2.55, -0.5], { delay: 0.1 });
    this.add(st, new THREE.BoxGeometry(0.02, 0.7, 0.02), 'amber', [0.3, 2.2, -0.5], { delay: 0.2 });
  }
  /* 6 — Test and improve: the product under a scanning plane, with checks lighting up. */
  private s6(st: JourneyScene['stations'][number]) {
    this.add(st, new THREE.CylinderGeometry(1.25, 1.35, 0.14, 48), 'dark', [0, 0.07, 0], { from: [0, 0.07, 0] });
    this.add(st, new THREE.BoxGeometry(1.5, 0.95, 0.06), 'mid', [0, 0.95, 0], { delay: 0.1 });
    this.add(st, new THREE.PlaneGeometry(1.4, 0.85), 'screen', [0, 0.95, 0.035], { delay: 0.12 });
    this.add(st, new THREE.BoxGeometry(0.14, 0.4, 0.14), 'mid', [0, 0.32, 0], { delay: 0.05 });
    this.scan = this.add(st, new THREE.PlaneGeometry(2.1, 1.5), 'glass', [0, 0.95, 0.4], { from: [0, 0.95, 0.4], delay: 0.3 });
    this.edges(st, new THREE.BoxGeometry(1.9, 1.3, 0.9), [0, 0.95, 0], 0.3);
    for (let i = 0; i < 5; i++) this.add(st, new THREE.SphereGeometry(0.06, 14, 10), i === 3 ? 'amber' : 'blue', [-0.5 + i * 0.25, 0.72, 0.05], { delay: 0.45 + i * 0.09, from: [-0.5 + i * 0.25, 0.72, 0.05] });
    for (let i = 0; i < 3; i++) this.add(st, new THREE.BoxGeometry(0.9 - i * 0.22, 0.07, 0.01), 'paper', [-0.15 - i * 0.11, 1.2 - i * 0.14, 0.05], { delay: 0.4 + i * 0.07, from: [-0.15 - i * 0.11, 1.2 - i * 0.14, 0.05] });
  }
  /* 7 — Deliver and support: the finished product on a plinth, handed over and kept running. */
  private s7(st: JourneyScene['stations'][number]) {
    this.add(st, new THREE.CylinderGeometry(0.95, 1.05, 0.5, 48), 'dark', [0, 0.25, 0], { from: [0, 0.25, 0] });
    this.add(st, new THREE.CylinderGeometry(0.97, 0.97, 0.02, 48), 'amber', [0, 0.51, 0], { from: [0, 0.51, 0], delay: 0.15 });
    this.add(st, new THREE.BoxGeometry(1.25, 0.8, 0.05), 'mid', [-0.15, 1.2, 0], { delay: 0.2 });
    this.add(st, new THREE.PlaneGeometry(1.16, 0.71), 'screen', [-0.15, 1.2, 0.03], { delay: 0.22 });
    this.add(st, new THREE.BoxGeometry(0.5, 0.26, 0.012), 'paper', [-0.42, 1.34, 0.04], { delay: 0.4 });
    this.add(st, new THREE.BoxGeometry(0.5, 0.26, 0.012), 'blue', [0.14, 1.34, 0.04], { delay: 0.46 });
    this.add(st, new THREE.BoxGeometry(1.06, 0.2, 0.012), 'mid', [-0.15, 1.03, 0.04], { delay: 0.52 });
    this.add(st, new THREE.BoxGeometry(0.1, 0.3, 0.1), 'mid', [-0.15, 0.66, 0], { delay: 0.1 });
    this.add(st, new THREE.BoxGeometry(0.32, 0.62, 0.035), 'dark', [0.72, 0.84, 0.35], { delay: 0.5, rot: [0, -0.4, 0] });
    this.add(st, new THREE.PlaneGeometry(0.27, 0.55), 'screen', [0.715, 0.84, 0.37], { delay: 0.52, rot: [0, -0.4, 0] });
    const r = this.add(st, new THREE.TorusGeometry(1.5, 0.008, 8, 96), 'blue', [0, 1.0, 0], { from: [0, 1.0, 0], delay: 0.6, rot: [Math.PI / 2, 0, 0] }); st.spin.push(r);
    const sat = this.add(st, new THREE.SphereGeometry(0.06, 14, 10), 'amber', [1.5, 1.0, 0], { from: [1.5, 1.0, 0], delay: 0.7 }); st.spin.push(sat);
    this.person(st, -1.45, 1.0, 0.6, 'dark'); this.person(st, -1.9, 0.75, 0.68);
  }

  /** 0–1 across the whole journey. */
  setProgress(p: number) { this.target = Math.min(1, Math.max(0, p)); if (!this.active) this.frame(true); }
  jumpTo(p: number) { this.target = this.progress = Math.min(1, Math.max(0, p)); this.frame(true); }
  setPointer(x: number, y: number) { this.pointer.set(x, y); }
  setActive(a: boolean) { if (this.disposed || a === this.active) return; this.active = a; cancelAnimationFrame(this.raf); if (a) this.raf = requestAnimationFrame(() => this.frame()); }
  resize() {
    const w = this.canvas.clientWidth || 1, h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.fov = w / h < 1 ? 52 : 36; this.camera.updateProjectionMatrix(); if (!this.active) this.frame(true);
  }
  renderOnce() { this.frame(true); }

  private frame(once = false) {
    if (this.disposed) return;
    const t = (performance.now() - this.t0) / 1000;
    this.progress += (this.target - this.progress) * (once ? 1 : 0.085);
    const f = this.progress * 6;                       // 0..6 in station units
    const side = this.rtl ? -1 : 1;                    // keep the diorama on the side opposite the text
    const sway = Math.sin(f * Math.PI) * 0.0;
    const cx = f * GAP;
    this.camera.position.set(cx - side * 2.7 + this.pointer.x * 0.15, 2.5 + sway - this.pointer.y * 0.08, 7.6);
    this.camera.lookAt(cx - side * 1.75, 0.7, 0);
    this.pulse.position.x = cx; this.pulse.position.y = 0.09 + Math.sin(t * 3) * 0.015;
    this.stations.forEach((st, i) => {
      const d = f - i;                                  // <0 before, 0 at the station
      const local = smooth(-0.62, 0.02, d);
      const gone = smooth(0.3, 0.72, d); st.g.scale.setScalar(1 - gone * 0.999); st.g.position.y = -gone * 0.6;
      st.g.visible = d > -2.2 && gone < 0.999;
      if (!st.g.visible) return;
      st.light.intensity = (1 - Math.min(1, Math.abs(d) / 0.9)) * 22;
      for (const p of st.parts) {
        const k = smooth(p.delay * 0.75, p.delay * 0.75 + 0.3, local);
        const e = 1 - Math.pow(1 - k, 3);
        p.o.position.lerpVectors(p.from, p.to, e); p.o.scale.setScalar(Math.max(0.001, p.s0 + (1 - p.s0) * e)); p.o.visible = k > 0.001;
      }
      if (i === 1) { st.spin[0].rotation.z = t * 0.5; st.spin[1].rotation.y = t * 0.35; }
      if (i === 6) { st.spin[1].position.set(Math.cos(t * 0.7) * 1.5, 1.0, Math.sin(t * 0.7) * 1.5); }
    });
    if (this.scan) this.scan.position.z = 0.05 + Math.sin(t * 1.3) * 0.5;
    this.renderer.render(this.scene, this.camera);
    if (this.active && !once) this.raf = requestAnimationFrame(() => this.frame());
  }
  private onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(this.raf); };
  private onRestored = () => { if (this.active) this.raf = requestAnimationFrame(() => this.frame()); else this.frame(true); };
  dispose() {
    this.disposed = true; cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('webglcontextlost', this.onLost); this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
    this.disposables.forEach((d) => d.dispose()); this.renderer.dispose();
  }
}
