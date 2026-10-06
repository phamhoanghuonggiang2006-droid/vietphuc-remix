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
let isMutedState = true;

// Initialize mute state from localStorage if available (Mặc định TẮT theo yêu cầu để thân thiện người dùng)
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    isMutedState = saved === null ? true : saved === 'true';
  } catch {
    isMutedState = true;
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

/**
 * 8. ÂM THANH "NO!" CẢNH BÁO TABOOS (Vàng Minh Hoàng, Không Mặc Đơn Y, Cúc Vải/Cúc Tàu)
 * Âm thanh cảnh báo dứt khoát, mô phỏng khẩu âm "NO!" điện tử / denial buzzer
 */
export function playTabooDenialSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Dual descending square/sawtooth oscillators for denial urgency
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();

  osc1.type = 'sawtooth';
  osc2.type = 'square';

  // Pitch sweep down imitating the "NO!" syllable (inflection)
  osc1.frequency.setValueAtTime(260, now);
  osc1.frequency.exponentialRampToValueAtTime(140, now + 0.22);

  osc2.frequency.setValueAtTime(180, now);
  osc2.frequency.exponentialRampToValueAtTime(95, now + 0.22);

  // Formant Filter to shape the "Oh" vocal resonance
  const formant = ctx.createBiquadFilter();
  formant.type = 'bandpass';
  formant.frequency.setValueAtTime(620, now);
  formant.Q.setValueAtTime(3.2, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  // Initial "N-" consonant attack
  gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
  // Full "-O!" vowel burst
  gain.gain.linearRampToValueAtTime(0.24, now + 0.05);
  // Rapid decay
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  osc1.connect(formant);
  osc2.connect(formant);
  formant.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.25);
  osc2.stop(now + 0.25);
}

/**
 * 9. ÂM THANH "TING!" CỦA CHUÔNG (Mục "Toàn Thân", "Moodboard", "Chi Tiết 2D")
 * Tiếng chuông gió / khánh đồng trong vắt khi chuyển view mode
 */
export function playBellTingSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const f0 = 1174.66; // D6

  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(f0, now);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(f0 * 2.76, now); // Metallic chime partial

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.002);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, now);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.002);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(ctx.destination);
  gain2.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.56);
  osc2.stop(now + 0.56);
}

/**
 * 10. ÂM THANH "TOE TOE" CỦA KÈN ĐỒNG ("Studio Cung Đình")
 * 2 nốt kèn staccato oai nghiêm, rộn rã cung đình hoàng gia
 */
export function playCourtBrassSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Note 1: "Toe" (Bb4 = 466.16Hz)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(466.16, now);

  const filter1 = ctx.createBiquadFilter();
  filter1.type = 'lowpass';
  filter1.frequency.setValueAtTime(700, now);
  filter1.frequency.exponentialRampToValueAtTime(2600, now + 0.03);
  filter1.frequency.exponentialRampToValueAtTime(900, now + 0.11);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.16, now + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.13);

  // Note 2: "Toe!" (F5 = 698.46Hz) - sounding immediately after
  const t2 = now + 0.12;
  const osc2 = ctx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(698.46, t2);

  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'lowpass';
  filter2.frequency.setValueAtTime(800, t2);
  filter2.frequency.exponentialRampToValueAtTime(3200, t2 + 0.04);
  filter2.frequency.exponentialRampToValueAtTime(1000, t2 + 0.24);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, t2);
  gain2.gain.linearRampToValueAtTime(0.2, t2 + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.25);

  osc2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(t2);
  osc2.stop(t2 + 0.26);
}

/**
 * 11. ÂM THANH "VÉO VON" CỦA NHẠC CỤ TIÊU - SÁO ("Cố Đô Huế")
 * Sáo trúc luyến láy mượt mà, ngân vang tha thiết sông Hương núi Ngự
 */
export function playHueFluteSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.65;

  // Sine oscillator with portamento/pitch inflection (E5 -> G5 -> A5)
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(659.25, now); // E5
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // Lượn lên G5
  osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.32); // Ngân ở A5

  // Vibrato LFO (5.5Hz) adding soulful vibrato at tail
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(5.5, now);
  lfoGain.gain.setValueAtTime(0.0001, now);
  lfoGain.gain.linearRampToValueAtTime(12, now + 0.25); // 12Hz pitch vibrato
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  // Breathy noise component (tiếng hơi qua lỗ sáo)
  const noiseBuf = createNoiseBuffer(ctx, duration);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1600, now);
  noiseFilter.Q.setValueAtTime(3.0, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.linearRampToValueAtTime(0.025, now + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // Main Tone Envelope
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0.0001, now);
  mainGain.gain.linearRampToValueAtTime(0.18, now + 0.06);
  mainGain.gain.exponentialRampToValueAtTime(0.09, now + 0.35);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(mainGain);
  mainGain.connect(ctx.destination);

  lfo.start(now);
  osc.start(now);
  noise.start(now);
  lfo.stop(now + duration);
  osc.stop(now + duration);
  noise.stop(now + duration);
}

/**
 * 12. ÂM THANH NỐT "FA" CỦA NHẠC CỤ PIANO ("Phố Cổ Hội An")
 * Nốt Fa (F4 = 349.23Hz) trong trẻo, hoài niệm phố Hội
 */
export function playHoiAnPianoFaSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const f0 = 349.23; // Fa (F4)

  // Piano harmonic partials
  const partials = [
    { freq: f0, gain: 0.18, decay: 1.1 },
    { freq: f0 * 2, gain: 0.09, decay: 0.8 },
    { freq: f0 * 3, gain: 0.04, decay: 0.5 },
  ];

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    // Instant hammer attack
    gain.gain.linearRampToValueAtTime(p.gain, now + 0.002);
    // Initial decay then slow release
    gain.gain.exponentialRampToValueAtTime(p.gain * 0.45, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + p.decay + 0.02);
  });

  // Felt hammer transient click
  const clickOsc = ctx.createOscillator();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(520, now);
  clickOsc.frequency.exponentialRampToValueAtTime(180, now + 0.015);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.linearRampToValueAtTime(0.06, now + 0.001);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);

  clickOsc.start(now);
  clickOsc.stop(now + 0.02);
}

/**
 * 13. ÂM THANH "TƯNG TƯNG" CỦA NHẠC CỤ UKULELE ("Thành Thăng Long")
 * 2 nốt gảy dây nylon tươi tắn, nảy giòn giã thanh lịch Thăng Long
 */
export function playThangLongUkuleleSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Pluck 1: "Tưng" (C5 = 523.25Hz)
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(528, now); // Slight tension bend
  osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.015);

  const filter1 = ctx.createBiquadFilter();
  filter1.type = 'bandpass';
  filter1.frequency.setValueAtTime(1300, now);
  filter1.Q.setValueAtTime(1.8, now);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.003);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.16);

  // Pluck 2: "Tưng!" (E5 = 659.25Hz) after 110ms
  const t2 = now + 0.11;
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(665, t2);
  osc2.frequency.exponentialRampToValueAtTime(659.25, t2 + 0.015);

  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(1400, t2);
  filter2.Q.setValueAtTime(1.8, t2);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, t2);
  gain2.gain.linearRampToValueAtTime(0.2, t2 + 0.003);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.28);

  osc2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(t2);
  osc2.stop(t2 + 0.29);
}

/**
 * 15. TIẾNG "XOẠT" LẬT TRANG SÁCH / TẠP CHÍ THỜI TRANG (Magazine Page Turn)
 * Mô phỏng ma sát bề mặt giấy mỹ thuật / giấy lụa tạp chí thời trang lật giòn tan
 */
export function playPageFlipSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.22;
  const buffer = createNoiseBuffer(ctx, duration);

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  // Lọc dải thông băng tần (Bandpass filter) quét lướt tiếng cọ xát của trang giấy
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(1.9, now);
  filter.frequency.setValueAtTime(1100, now);
  filter.frequency.exponentialRampToValueAtTime(3200, now + 0.07);
  filter.frequency.exponentialRampToValueAtTime(800, now + duration);

  // Âm lượng phong bì kép (Attack - Swish - Release)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.025);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.09);
  gain.gain.linearRampToValueAtTime(0.14, now + 0.13);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration + 0.02);

  // Âm vỗ nhẹ của trang giấy áp xuống (Thump của gáy sách)
  const thumpOsc = ctx.createOscillator();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(160, now + 0.08);
  thumpOsc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.0001, now + 0.08);
  thumpGain.gain.linearRampToValueAtTime(0.06, now + 0.095);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

  thumpOsc.connect(thumpGain);
  thumpGain.connect(ctx.destination);

  thumpOsc.start(now + 0.08);
  thumpOsc.stop(now + 0.2);
}

/**
 * 16. TIẾNG "TÁCH" MÀN TRẬP MÁY ẢNH (Studio Tạp Chí)
 * Âm thanh click màn trập máy ảnh cơ Leica / Hasselblad studio chuyên nghiệp
 */
export function playCameraShutterSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const buffer = createNoiseBuffer(ctx, 0.12);

  // Shutter click 1 (Front curtain)
  const noiseSource1 = ctx.createBufferSource();
  noiseSource1.buffer = buffer;
  const filter1 = ctx.createBiquadFilter();
  filter1.type = 'highpass';
  filter1.frequency.setValueAtTime(2200, now);
  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.005);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  noiseSource1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(ctx.destination);
  noiseSource1.start(now);
  noiseSource1.stop(now + 0.045);

  // Shutter click 2 (Mirror slap & rear curtain)
  const t2 = now + 0.055;
  const noiseSource2 = ctx.createBufferSource();
  noiseSource2.buffer = buffer;
  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(1400, t2);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, t2);
  gain2.gain.linearRampToValueAtTime(0.22, t2 + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.06);
  noiseSource2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(ctx.destination);
  noiseSource2.start(t2);
  noiseSource2.stop(t2 + 0.07);
}

/**
 * 17. TIẾNG "CẠCH" GỐM SỨ & CÀ PHÊ MỘC (Cà Phê Mộc)
 * Âm thanh đặt tách sứ nhẹ nhàng trên đĩa gỗ sồi ấm áp
 */
export function playCoffeeChimeSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1760, now); // A6
  osc.frequency.exponentialRampToValueAtTime(1580, now + 0.08);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.23);
}

/**
 * 18. TIẾNG CHUÔNG NGÂN SÂU LẮNG (Bảo Tàng Nghệ Thuật)
 * Âm thanh chuông khánh đồng ngân dài trong không gian viện bảo tàng tĩnh mịch
 */
export function playMuseumEchoSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const f0 = 880; // A5

  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(f0, now);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(f0 * 2.01, now);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.14, now + 0.005);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, now);
  gain2.gain.linearRampToValueAtTime(0.06, now + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(ctx.destination);
  gain2.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.66);
  osc2.stop(now + 0.66);
}

/**
 * 19. TIẾNG GIÓ THU XÀO XẠC & LÁ BÀNG RƠI (Góc Phố Tràng Tiền)
 * Giai điệu mộc acoustic 2 nốt lãng mạn mang phong vị Hà Nội mùa thu
 */
export function playAutumnBreezeSound(): void {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Note 1: E5 (659.25Hz)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(659.25, now);
  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.12, now + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.36);

  // Note 2: B5 (987.77Hz)
  const t2 = now + 0.12;
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(987.77, t2);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, t2);
  gain2.gain.linearRampToValueAtTime(0.14, t2 + 0.015);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.42);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(t2);
  osc2.stop(t2 + 0.43);
}

