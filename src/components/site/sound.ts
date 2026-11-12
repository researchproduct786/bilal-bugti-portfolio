/** Optional interface sound. Off by default; nothing is created until the visitor turns it on. */
let ctx: AudioContext | null = null;
let enabled = false;

export function soundEnabled() { return enabled; }
export function setSound(on: boolean) {
  enabled = on;
  try { localStorage.setItem('bb-sound', on ? '1' : '0'); } catch {}
  if (on && !ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (on) blip(660, 0.05);
}
export function restoreSound() {
  try { return localStorage.getItem('bb-sound') === '1'; } catch { return false; }
}
export function blip(freq = 520, gain = 0.03) {
  if (!enabled || !ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.09);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.13);
}
