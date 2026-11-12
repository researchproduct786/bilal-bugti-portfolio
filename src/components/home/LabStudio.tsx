'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { StudioScene } from '@/three/studio';

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false });

/** Manual control of the hero scene: one slider for the camera move, one for the transformation. */
export function LabStudio() {
  const scene = useRef<StudioScene | null>(null);
  const [cam, setCam] = useState(62);
  const [morph, setMorph] = useState(45);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    try { const c = document.createElement('canvas'); setGl(!!(c.getContext('webgl2') || c.getContext('webgl'))); } catch { setGl(false); }
  }, []);
  useEffect(() => { scene.current?.setProgress(cam / 100); }, [cam]);
  useEffect(() => { scene.current?.setMorph(morph / 100); }, [morph]);

  return (
    <div className="labstudio">
      <div className="labstudio-view">
        {gl === false && <p className="notice"><b>WebGL unavailable</b>This browser or device cannot run the 3D scene. The stills on the home page show the same environment.</p>}
        {gl && <StudioCanvas parallax={false} onScene={(s) => {
          scene.current = s;
          if (s) { s.jumpTo(cam / 100); s.setMorph(morph / 100); (window as unknown as { __studio?: StudioScene }).__studio = s; }
        }} />}
      </div>
      <div className="labstudio-ctl">
        <label><span className="mono">Camera path</span><input type="range" min={0} max={100} value={cam} onChange={(e) => setCam(+e.target.value)} /><output className="mono">{cam}%</output></label>
        <label><span className="mono">Human → machine</span><input type="range" min={0} max={100} value={morph} onChange={(e) => setMorph(+e.target.value)} /><output className="mono">{morph}%</output></label>
      </div>
    </div>
  );
}
