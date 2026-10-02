/**
 * Web Audio API Sound Effects Engine (Cổ Phong Synthesizer)
 * Tích hợp âm thanh giả lập 100% bằng Web Audio API thuần (không dùng file ngoài, không lo lỗi 404/CORS)
 * Bao gồm:
 * 1. Tiếng Đàn Tranh thanh thoát khi chuyển tab.
 * 2. Tiếng "Keng" kim loại / khuy áo va chạm nhẹ khi chọn cúc áo.
 * 3. Tiếng "Xoạch" xòe quạt giấy nhẹ nhàng khi chọn phụ kiện.
 * 4. Tiếng "Ting!" của chuông khi chọn các trang phục trong mục "Chọn Dòng Cổ Phục".
 * 5. Tiếng "Xoạch!" của quần / váy khi chọn trong mục "Thân Dưới Phối Cùng".
 * 6. Tiếng "Cạch!" của guốc giày trên sàn gỗ khi chọn trong mục "Giày / Guốc".
 * 7. Nốt ngũ cung nhẹ nhàng khi đổi màu sắc phục.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vietphuc_sound_muted';

let audioCtx: AudioContext | null = null;
let isMutedState = false;

// Initialize mute state from localStorage if available
if (typeof window !== 'undefined') {
  try {
    isMutedState = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    isMutedState = false;
  }
}

const muteListeners: Array<(muted: boolean) => void> = [];

export function isSoundMuted(): boolean {
  return isMutedState;
}

export function subscribeSoundMute(listener: (muted: boolean) => void): () => void {
  muteListeners.push(listener);
  return () => {
    const idx = muteListeners.indexOf(listener);
    if (idx !== -1) muteListeners.splice(idx, 1);
  };
}

export function setSoundMuted(muted: boolean): void {
  isMutedState = muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
  } catch {}
  muteListeners.forEach((fn) => fn(muted));
}

export function toggleSoundMute(): boolean {
  const next = !isMutedState;
  setSoundMuted(next);
  return next;
}

/**
 * React hook to observe and toggle sound mute state
 */
export function useSoundMute(): { isMuted: boolean; toggleMute: () => void; setMuted: (muted: boolean) => void } {
  const [muted, setMutedLocal] = useState<boolean>(() => isSoundMuted());

  useEffect(() => {
    return subscribeSoundMute((nextMuted) => {
      setMutedLocal(nextMuted);
    });
  }, []);

  return {
    isMuted: muted,
    toggleMute: () => toggleSoundMute(),
    setMuted: (m: boolean) => setSoundMuted(m),
  };
}

/**
 * Lazy initialize or resume the Web Audio Context
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Generate a short white noise buffer for realistic texture sounds (quạt giấy, vải vóc)
 */
function createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * 1. TIẾNG ĐÀN TRANH (Chuyển Tab Navbar / Chuyển Trang)
 * Rải ngũ cung 4 nốt nhanh thánh thót: D5 -> G5 -> A5 -> D6
 */
export function playDanTranhTabSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Pentatonic notes in Hz (D5, G5, A5, D6)
  const notes = [587.33, 783.99, 880.0, 1174.66];
  const stagger = 0.045; // 45ms between each pluck

  notes.forEach((freq, idx) => {
    const startTime = now + idx * stagger;

    // Primary string oscillation (Triangle for wooden resonance)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic overtone (Sine at 2x freq for metallic shimmer of bronze/silk strings)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Subtle pitch vibrato/bend
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.008, startTime + 0.08);
    osc1.frequency.exponentialRampToValueAtTime(freq, startTime + 0.35);

    // Body Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.8, startTime);
    filter.Q.setValueAtTime(1.8, startTime);

    // Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, startTime);
    // Pluck attack
    gainNode.gain.exponentialRampToValueAtTime(0.12, startTime + 0.008);
    // Pluck decay
    gainNode.gain.exponentialRampToValueAtTime(0.04, startTime + 0.12);
    // Ring out
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + 0.46);
    osc2.stop(startTime + 0.46);
  });
}

/**
 * 2. TIẾNG "KENG" KIM LOẠI / KHUY ÁO (Chọn Hạt Cúc Áo)
 * Hai tần số kim loại va chạm nhẹ, đanh và trong trẻo
 */
export function playButtonClinkSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const f1 = 2850;
  const f2 = 4220;

  [f1, f2].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    const peak = idx === 0 ? 0.14 : 0.08;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(1500, now);

    osc.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  });
}

/**
 * 3. TIẾNG "XOẠCH" XÒE QUẠT GIẤY (Chọn Phụ Kiện / Quạt Cầm Tay)
 * Lọc dải băng White Noise sweep nhanh mô phỏng nan tre và giấy bung mở
 */
export function playFanFlutterSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.18;
  const buffer = createNoiseBuffer(ctx, duration);

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(2.2, now);
  // Frequency sweep upward like fan unfolding
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(2500, now + 0.06);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration + 0.02);
}

/**
 * 4. TIẾNG "TING!" CỦA CHUÔNG KHÁNH CỔ PHỤC (Mục "Chọn Dòng Cổ Phục")
 * Chuông đồng hoàng cung ngân vang trang nghiêm, tỷ lệ âm sắc chuông khánh
 */
export function playGarmentSelectSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const fundamental = 880; // A5

  // Bell partial frequencies
  const partials = [
    { freq: fundamental, type: 'sine' as OscillatorType, gain: 0.15, decay: 0.75 },
    { freq: fundamental * 2.76, type: 'sine' as OscillatorType, gain: 0.07, decay: 0.45 },
    { freq: fundamental * 5.4, type: 'triangle' as OscillatorType, gain: 0.03, decay: 0.25 },
  ];

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(p.gain, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + p.decay + 0.02);
  });
}

/**
 * 5. TIẾNG "XOẠCH!" CỦA QUẦN / VÁY (Mục "Thân Dưới Phối Cùng")
 * Tiếng sột soạt vải lụa tơ tằm, gấm vóc êm dịu khi cử động
 */
export function playFabricRustleSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.22;
  const buffer = createNoiseBuffer(ctx, duration);

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(850, now);
  filter.Q.setValueAtTime(1.6, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  // Double-swish wave for fabric motion
  gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
  gain.gain.linearRampToValueAtTime(0.09, now + 0.13);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration + 0.02);
}

/**
 * 6. TIẾNG "CẠCH!" CỦA GUỐC GIÀY TRÊN SÀN GỖ (Mục "Giày / Guốc")
 * Guốc mộc gõ nền ván gỗ cung đình, dứt khoát và giòn giã
 */
export function playWoodClogSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Transient click (đầu mũi guốc tiếp xúc mặt gỗ)
  const clickOsc = ctx.createOscillator();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(780, now);
  clickOsc.frequency.exponentialRampToValueAtTime(280, now + 0.02);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.linearRampToValueAtTime(0.16, now + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);

  clickOsc.start(now);
  clickOsc.stop(now + 0.035);

  // 2. Thump body resonance (độ cộng hưởng của khối gỗ)
  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = 'triangle';
  bodyOsc.frequency.setValueAtTime(220, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

  const bodyFilter = ctx.createBiquadFilter();
  bodyFilter.type = 'lowpass';
  bodyFilter.frequency.setValueAtTime(550, now);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.linearRampToValueAtTime(0.14, now + 0.004);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  bodyOsc.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(ctx.destination);

  bodyOsc.start(now);
  bodyOsc.stop(now + 0.095);
}

/**
 * 7. TIẾNG ĐỔI SẮC PHỤC TRUYỀN THỐNG (Mục "Sắc Phục Truyền Thống")
 * Nốt ngũ cung thanh thoát vuốt nhẹ
 */
export function playColorPickSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(659.25, now); // E5

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.29);
}
