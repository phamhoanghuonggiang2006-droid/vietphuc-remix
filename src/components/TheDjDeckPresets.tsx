import React, { useState, useEffect } from 'react';
import { Disc3, Zap, Radio, Sliders, Volume2, Sparkles, Flame, Activity } from 'lucide-react';
import { playDjScratchSound, play808BassDropSound } from '../utils/soundEffects';

export interface DjDeckPreset {
  id: string;
  trackIndex: number; // 0, 1, 2
  title: string;
  subTitle: string;
  tag: string;
  location: string;
  description: string;
  accentNeon: string;
  borderNeon: string;
  shadowNeon: string;
  bpm: number;
  outfit: {
    garmentId: string;
    garmentName: string;
    colorHex: string;
    colorName: string;
    layerId: string;
    layerName: string;
    buttonId: string;
    buttonName: string;
    bottomId: string;
    bottomName: string;
    shoesId: string;
    shoesName: string;
    accessoryId: string;
    accessoryName: string;
    styleVibe: string;
  };
  highlights: string[];
}

export const DJ_DECK_TRACKS: DjDeckPreset[] = [
  {
    id: 'track-tet-core-skater',
    trackIndex: 0,
    title: 'TET-CORE SKATER',
    subTitle: 'Áo cổ đứng Graphic Tứ Quý + Quần Cargo + Sneaker Dunk',
    tag: 'TRẠM 1 · SKATEPARK 30/4',
    location: 'Công viên 30/4 · Phố Bùi Viện',
    description: 'Phối sẵn Áo cổ đứng in graphic Tứ Quý + Quần Cargo túi hộp + Sneaker Dunk. Dành cho những buổi trượt ván ở công viên 30/4 hay dạo phố Bùi Viện.',
    accentNeon: '#00F0FF',
    borderNeon: 'border-[#00F0FF]',
    shadowNeon: 'shadow-[4px_4px_0px_#00F0FF]',
    bpm: 130,
    highlights: ['Áo ngũ thân tay chẽn Graphic', 'Quần Cargo túi hộp', 'Sneaker Dunk Skate', 'Túi Chest Bag', 'Mũ Bucket'],
    outfit: {
      garmentId: 'ngu-than-tay-chen',
      garmentName: 'Áo Ngũ Thân Tay Chẽn (Graphic Tứ Quý)',
      colorHex: '#2B5B84',
      colorName: 'Xanh Thanh Thiên Phá Cách',
      layerId: 'layer-none',
      layerName: 'Không mặc đơn y (Phá cách)',
      buttonId: 'btn-metal-copper',
      buttonName: 'Cúc Đồng Đúc Bát Bửu',
      bottomId: 'bottom-cargo-pants',
      bottomName: 'Quần Cargo Túi Hộp Siêu Rộng',
      shoesId: 'shoes-skater-vans',
      shoesName: 'Vans / Sneaker Dunk Đế Bằng',
      accessoryId: 'acc-chest-bag',
      accessoryName: 'Túi Crossbody Chest Bag',
      styleVibe: 'Tet-Core Skater Streetwear'
    }
  },
  {
    id: 'track-royal-y2k',
    trackIndex: 1,
    title: 'ROYAL Y2K',
    subTitle: 'Áo cổ vuông Nhật Bình Crop-top + Váy xếp ly + Mary Jane',
    tag: 'TRẠM 2 · NEON PRINCESS',
    location: 'Saigon Concert · Phố Đi Bộ',
    description: 'Phối sẵn Áo cổ vuông (lấy cảm hứng Nhật Bình) form crop-top + Váy xếp ly + Giày Mary Jane. Tone màu bẻ sang Hồng Neon cá tính.',
    accentNeon: '#FF007F',
    borderNeon: 'border-[#FF007F]',
    shadowNeon: 'shadow-[4px_4px_0px_#FF007F]',
    bpm: 138,
    highlights: ['Áo Nhật Bình form Crop-top', 'Hồng Hot Pink Neon', 'Chân váy xếp ly Y2K', 'Mary Jane đế bánh mì', 'Kính râm gọng dày'],
    outfit: {
      garmentId: 'ao-nhat-binh',
      garmentName: 'Áo Cổ Vuông Nhật Bình Form Crop-Top',
      colorHex: '#FF007F',
      colorName: 'Hồng Hot Pink Neon Y2K',
      layerId: 'layer-none',
      layerName: 'Crop-top không đơn y',
      buttonId: 'btn-silver-lotus',
      buttonName: 'Cúc Bạc Sen Y2K',
      bottomId: 'bottom-y2k-pleated-skirt',
      bottomName: 'Chân Váy Xếp Ly Ngắn Y2K',
      shoesId: 'shoes-platform-mary-jane',
      shoesName: 'Platform Mary Jane + Tất Trắng',
      accessoryId: 'acc-chunky-sunglasses',
      accessoryName: 'Kính Râm Gọng Dày Bản To (Chunky Shades)',
      styleVibe: 'Royal Y2K Princess Core'
    }
  },
  {
    id: 'track-dark-heritage',
    trackIndex: 2,
    title: 'DARK HERITAGE',
    subTitle: 'Áo khoác tay thụng nhung đen + Ripped Jeans + Dr. Martens + Xích bạc',
    tag: 'TRẠM 3 · GOTHIC CỔ PHONG',
    location: 'Underground Vault · Rock Club',
    description: 'Áo khoác tay thụng nhung đen + Quần jean rách + Boots Dr. Martens + Xích bạc layer. Một chút bí ẩn, sắc lạnh, đúng chất Gothic cổ phong.',
    accentNeon: '#39FF14',
    borderNeon: 'border-[#39FF14]',
    shadowNeon: 'shadow-[4px_4px_0px_#39FF14]',
    bpm: 142,
    highlights: ['Áo tay thụng nhung đen', 'Quần jeans rách wash xám', 'Boots Dr. Martens 1460', 'Xích bạc Cuban layer', 'Gothic cổ phong'],
    outfit: {
      garmentId: 'ao-tac',
      garmentName: 'Áo Khoác Tay Thụng Nhung Đen Gothic',
      colorHex: '#1A1A1E',
      colorName: 'Đen Nhung Gothic Pitch Black',
      layerId: 'layer-none',
      layerName: 'Tối giản không đơn y',
      buttonId: 'btn-silver-lotus',
      buttonName: 'Cúc Bạc Hoa Sen Khắc Sắc Lạnh',
      bottomId: 'bottom-high-waist-jeans',
      bottomName: 'Quần Jeans Rách Wash Xám',
      shoesId: 'shoes-boots-dr-martens',
      shoesName: 'Boots Dr. Martens 1460 Da Cứng',
      accessoryId: 'acc-silver-chain-cuban',
      accessoryName: 'Vòng Cổ Xích Bạc Cuban Link',
      styleVibe: 'Dark Heritage Gothic Underground'
    }
  }
];

export interface TheDjDeckPresetsProps {
  activePresetId?: string;
  onSelectPreset: (preset: DjDeckPreset) => void;
}

export const TheDjDeckPresets: React.FC<TheDjDeckPresetsProps> = ({
  activePresetId,
  onSelectPreset
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isBassShaking, setIsBassShaking] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [vuLevels, setVuLevels] = useState<number[]>([65, 80, 45, 95, 70, 85, 90, 60]);

  // Sync index from activePresetId
  useEffect(() => {
    if (activePresetId) {
      const found = DJ_DECK_TRACKS.find(t => t.id === activePresetId);
      if (found) {
        setCurrentTrackIndex(found.trackIndex);
      }
    }
  }, [activePresetId]);

  // VU meter jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels(prev => prev.map(() => Math.floor(40 + Math.random() * 60)));
    }, 280);
    return () => clearInterval(interval);
  }, []);

  const triggerTrackSwitch = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= DJ_DECK_TRACKS.length) return;
    
    // SFX
    playDjScratchSound();
    play808BassDropSound();

    // Trigger visual bass shake animation
    setIsBassShaking(true);
    setIsScratching(true);
    setTimeout(() => setIsBassShaking(false), 500);
    setTimeout(() => setIsScratching(false), 350);

    setCurrentTrackIndex(newIndex);
    const targetPreset = DJ_DECK_TRACKS[newIndex];
    onSelectPreset(targetPreset);
  };

  const activeTrack = DJ_DECK_TRACKS[currentTrackIndex];

  return (
    <div
      className={`font-streetwear relative bg-[#08080C] text-stone-100 border-2 border-[#00F0FF] p-4 sm:p-5 transition-all duration-300 shadow-[6px_6px_0px_#FF007F] ${
        isBassShaking ? 'animate-bass-shake' : ''
      }`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 0, 127, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }}
    >
      {/* GLITCH & CORNER ACCENTS (BRUTALISM) */}
      <div className="absolute -top-2.5 -left-2.5 bg-[#FF007F] text-black font-black text-[9px] px-2 py-0.5 tracking-widest uppercase border border-white">
        DECK // MK-303
      </div>
      <div className="absolute -top-2.5 -right-2.5 bg-[#00F0FF] text-black font-black text-[9px] px-2 py-0.5 tracking-widest uppercase border border-white">
        BASS BOOST 808
      </div>

      {/* TOP HEADER: DECK STATUS & BPM & ON-AIR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-8 h-8 rounded-none border-2 border-white/80 bg-black flex items-center justify-center ${
              isScratching ? 'animate-spin' : ''
            }`}>
              <Disc3 className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black italic uppercase tracking-wider text-base text-white flex items-center gap-1.5">
                <span>TRẠM TRỘN MIXSET</span>
                <span className="text-[#00F0FF] text-xs font-mono not-italic">[THE DJ DECK]</span>
              </h2>
            </div>
            <p className="text-[10px] text-stone-400 font-mono tracking-tight">
              FUSION STREETWEAR CONTROLLER · PRESET TRACK SELECTOR
            </p>
          </div>
        </div>

        {/* LED STATUS & VU METERS */}
        <div className="flex items-center gap-3">
          {/* VU METER BARS */}
          <div className="hidden sm:flex items-end gap-1 h-5 px-2 py-0.5 bg-black/80 border border-white/20">
            {vuLevels.map((lvl, i) => (
              <div
                key={i}
                className="w-1 transition-all duration-150"
                style={{
                  height: `${lvl}%`,
                  backgroundColor: lvl > 85 ? '#FF007F' : lvl > 65 ? '#00F0FF' : '#39FF14'
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-black border border-white/30 px-2.5 py-1">
            <Radio className="w-3 h-3 text-[#FF007F] animate-pulse" />
            <span className="font-mono font-black text-xs text-[#FF007F]">ON AIR</span>
            <span className="text-stone-500 font-mono">|</span>
            <span className="font-mono text-xs text-[#00F0FF]">{activeTrack.bpm} BPM</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HORIZONTAL CROSSFADER SLIDER (THANH TRƯỢT LỚN) */}
      {/* ======================================================== */}
      <div className="bg-[#0f0f16] border-2 border-white/20 p-3 sm:p-4 mb-4 relative">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-stone-400 flex items-center gap-1 font-bold">
            <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
            CROSSFADER TRACK SLIDER
          </span>
          <span className="text-[10px] text-[#39FF14] font-mono uppercase bg-black px-1.5 py-0.5 border border-[#39FF14]/40">
            KÉO ĐỔI TRẠM · RUNG BASS 808
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative py-2">
          {/* Track Bar Background with 3 Notch Points */}
          <div className="h-4 bg-black border border-white/40 flex items-center justify-between px-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/20 via-[#FF007F]/20 to-[#39FF14]/20" />
            {/* 3 Notch Markers */}
            <div className="relative z-10 w-2 h-2 bg-[#00F0FF] border border-white" />
            <div className="relative z-10 w-2 h-2 bg-[#FF007F] border border-white" />
            <div className="relative z-10 w-2 h-2 bg-[#39FF14] border border-white" />
          </div>

          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={currentTrackIndex}
            onChange={(e) => triggerTrackSwitch(parseInt(e.target.value, 10))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            title="Kéo thanh trượt để đổi Trạm Mixset"
          />

          {/* Visual Fader Knob Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-black border-2 border-white shadow-[0_0_12px_#00F0FF] flex items-center justify-center pointer-events-none transition-all duration-200 z-10"
            style={{
              left: currentTrackIndex === 0 ? '0%' : currentTrackIndex === 1 ? 'calc(50% - 16px)' : 'calc(100% - 32px)',
              borderColor: activeTrack.accentNeon
            }}
          >
            <div
              className="w-1.5 h-4"
              style={{ backgroundColor: activeTrack.accentNeon }}
            />
          </div>
        </div>

        {/* Slider Labels Below */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-1 text-center font-mono">
          {DJ_DECK_TRACKS.map((t, idx) => {
            const isCur = currentTrackIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => triggerTrackSwitch(idx)}
                className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tight py-1 px-1 border transition-all cursor-pointer ${
                  isCur
                    ? `bg-white text-black font-extrabold border-white ${t.shadowNeon}`
                    : 'bg-black/60 text-stone-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {t.tag.split('·')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE MECHANICAL DRUM PADS (BÀN PHÍM CƠ / MPC PADS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        {DJ_DECK_TRACKS.map((track, idx) => {
          const isSelected = currentTrackIndex === idx;

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => triggerTrackSwitch(idx)}
              className={`relative text-left p-3 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-black ${track.borderNeon} ${track.shadowNeon} scale-[1.02] ring-1 ring-white`
                  : 'bg-[#121219] border-white/15 hover:border-white/50 hover:bg-[#181824]'
              }`}
            >
              {/* LED Pad Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 border ${
                  isSelected 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-stone-400 border-white/20'
                }`}>
                  PAD 0{idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-none border border-black inline-block"
                    style={{
                      backgroundColor: isSelected ? track.accentNeon : '#333340',
                      boxShadow: isSelected ? `0 0 8px ${track.accentNeon}` : 'none'
                    }}
                  />
                  <span className="font-mono text-[9px] text-stone-400">{track.bpm}BPM</span>
                </div>
              </div>

              <div>
                <h4 className="font-black italic uppercase text-sm tracking-wide text-white">
                  {track.title}
                </h4>
                <p className="text-[10.5px] text-stone-300 font-sans line-clamp-2 mt-1 leading-snug">
                  {track.subTitle}
                </p>
              </div>

              {/* Vibe tag */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] font-mono text-stone-400 truncate max-w-[110px]">
                  📍 {track.location.split('·')[0].trim()}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-black uppercase text-[#00F0FF] flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 text-[#FF007F]" />
                    ACTIVE
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. ACTIVE TRACK PLAYOUT BANNER & HIGHLIGHT TAGS */}
      {/* ======================================================== */}
      <div className="bg-black/90 border-2 border-white/20 p-3 sm:p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#FF007F] text-black uppercase">
                {activeTrack.tag}
              </span>
              <span className="text-xs text-stone-300 font-mono">
                📍 {activeTrack.location}
              </span>
            </div>
            <p className="text-xs text-stone-200 mt-1.5 leading-relaxed font-sans">
              {activeTrack.description}
            </p>
          </div>

          {/* Quick Sound Scratch Button */}
          <button
            type="button"
            onClick={() => {
              playDjScratchSound();
              play808BassDropSound();
              setIsBassShaking(true);
              setTimeout(() => setIsBassShaking(false), 450);
            }}
            className="shrink-0 px-2.5 py-1.5 bg-[#161622] hover:bg-[#202030] text-[#00F0FF] border border-[#00F0FF]/50 text-[10px] font-mono font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Nhấn để kích hoạt hiệu ứng scratch và bass drop"
          >
            <Zap className="w-3 h-3 text-[#FF007F]" />
            <span>DROP BASS</span>
          </button>
        </div>

        {/* Streetwear tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10">
          <span className="text-[10px] font-mono text-stone-400 uppercase mr-1">SET GỒM:</span>
          {activeTrack.highlights.map((h, i) => (
            <span
              key={i}
              className="text-[10px] font-sans font-bold px-2 py-0.5 bg-[#12121c] border border-white/20 text-stone-200"
            >
              #{h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
