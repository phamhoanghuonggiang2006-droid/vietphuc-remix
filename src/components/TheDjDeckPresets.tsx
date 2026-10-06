import React, { useState, useEffect } from 'react';
import { Disc3, Radio, Sliders, Volume2, Sparkles, Flame, Activity, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
  genre: string;
  watermark: string;
  emblemUrl: string;
  emblemScale?: string;
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
    description: 'Dành cho những buổi trượt ván ở công viên 30/4 hay dạo phố Bùi Viện.',
    accentNeon: '#00f3ff',
    borderNeon: 'border-[#00f3ff]',
    shadowNeon: 'shadow-[0_0_20px_rgba(0,243,255,0.35)]',
    genre: 'BOOM-BAP 90s',
    watermark: '🛹',
    emblemUrl: '/presets/tet-core-skater.png',
    emblemScale: 'scale-100',
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
    description: 'Tone màu bẻ sang Hồng Neon cá tính.',
    accentNeon: '#FF007F',
    borderNeon: 'border-[#FF007F]',
    shadowNeon: 'shadow-[0_0_20px_rgba(255,0,127,0.35)]',
    genre: 'HYPERPOP',
    watermark: '👑',
    emblemUrl: '/presets/royal-y2k.png',
    emblemScale: 'scale-100',
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
    description: 'Một chút bí ẩn, sắc lạnh, đúng chất Gothic cổ phong.',
    accentNeon: '#39FF14',
    borderNeon: 'border-[#39FF14]',
    shadowNeon: 'shadow-[0_0_20px_rgba(57,255,20,0.35)]',
    genre: 'DARK TECHNO',
    watermark: '🦇',
    emblemUrl: '/presets/dark-heritage.png',
    emblemScale: 'scale-110',
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
    
    // SFX: duy nhất 1 âm thanh bass drop sạch và uy lực
    play808BassDropSound();

    // Trigger visual bass shake animation (đã giảm độ rung xuống 30% ở CSS, thời lượng ngắn gọn 320ms)
    setIsBassShaking(true);
    setIsScratching(true);
    setTimeout(() => setIsBassShaking(false), 320);
    setTimeout(() => setIsScratching(false), 300);

    setCurrentTrackIndex(newIndex);
    const targetPreset = DJ_DECK_TRACKS[newIndex];
    onSelectPreset(targetPreset);
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % DJ_DECK_TRACKS.length;
    triggerTrackSwitch(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + DJ_DECK_TRACKS.length) % DJ_DECK_TRACKS.length;
    triggerTrackSwitch(prevIdx);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    setTouchStartX(null);
  };

  const activeTrack = DJ_DECK_TRACKS[currentTrackIndex];

  return (
    <div
      className={`font-streetwear relative bg-[#121212]/95 text-stone-100 border border-white/10 p-4 sm:p-5 transition-all duration-300 shadow-[0_0_30px_rgba(0,243,255,0.06)] rounded-none ${
        isBassShaking ? 'animate-bass-shake' : ''
      }`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 243, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 243, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}
    >
      {/* CORNER TAGS (SUBTLE CYBER ACCENTS) */}
      <div className="absolute -top-2.5 -left-2 bg-black/90 text-[#00f3ff] font-mono font-bold text-[9px] px-2 py-0.5 tracking-widest uppercase border border-[#00f3ff]/40">
        DECK // MK-303
      </div>
      <div className="absolute -top-2.5 -right-2 bg-black/90 text-[#39ff14] font-mono font-bold text-[9px] px-2 py-0.5 tracking-widest uppercase border border-[#39ff14]/40">
        BASS BOOST 808
      </div>

      {/* TOP HEADER: DECK STATUS & BPM & ON-AIR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-8 h-8 rounded-none border border-white/40 bg-black flex items-center justify-center ${
              isScratching ? 'animate-spin' : ''
            }`}>
              <Disc3 className="w-5 h-5 text-[#00f3ff]" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black not-italic font-bold uppercase tracking-wider text-[21px] sm:text-[23px] text-white flex items-center gap-2">
                <span>TRẠM LÊN ĐỒ MIXSET</span>
                <span className="text-[#00f3ff] text-xs sm:text-sm font-mono not-italic">[THE DJ DECK]</span>
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
          <div className="hidden sm:flex items-end gap-1 h-5 px-2 py-0.5 bg-black/80 border border-white/10">
            {vuLevels.map((lvl, i) => (
              <div
                key={i}
                className="w-1 transition-all duration-150"
                style={{
                  height: `${lvl}%`,
                  backgroundColor: lvl > 85 ? '#FF007F' : lvl > 65 ? '#00f3ff' : '#39FF14'
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-black/90 border border-white/15 px-2.5 py-1">
            <Radio className="w-3 h-3 text-[#39FF14] animate-pulse" />
            <span className="font-mono font-bold text-xs text-[#00f3ff]">ON AIR</span>
            <span className="text-stone-500 font-mono">|</span>
            <span className="font-mono text-xs text-stone-300">{activeTrack.bpm} BPM</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HORIZONTAL CROSSFADER SLIDER (THANH TRƯỢT LỚN) */}
      {/* ======================================================== */}
      <div className="bg-[#0d0d12] border border-white/10 p-3 sm:p-4 mb-4 relative shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-stone-300 flex items-center gap-1.5 font-bold">
            <Sliders className="w-3.5 h-3.5 text-[#00f3ff]" />
            CROSSFADER TRACK SLIDER
          </span>
          <span className="text-[10px] text-[#39FF14] font-mono uppercase bg-black px-1.5 py-0.5 border border-[#39FF14]/30">
            KÉO ĐỔI TRẠM · RUNG BASS 808
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative py-2">
          {/* Track Bar Background with 3 Notch Points */}
          <div className="h-3.5 bg-black border border-white/20 flex items-center justify-between px-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/20 via-[#39ff14]/20 to-[#00f3ff]/20" />
            {/* 3 Notch Markers */}
            <div className="relative z-10 w-2 h-2 bg-[#00f3ff] border border-black" />
            <div className="relative z-10 w-2 h-2 bg-[#39ff14] border border-black" />
            <div className="relative z-10 w-2 h-2 bg-[#00f3ff] border border-black" />
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
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-black border border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.5)] flex items-center justify-center pointer-events-none transition-all duration-200 z-10"
            style={{
              left: currentTrackIndex === 0 ? '0%' : currentTrackIndex === 1 ? 'calc(50% - 14px)' : 'calc(100% - 28px)',
              borderColor: activeTrack.accentNeon
            }}
          >
            <div
              className="w-1.5 h-3.5"
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
                className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tight py-1.5 px-2 border transition-all cursor-pointer rounded-sm ${
                  isCur
                    ? 'text-white'
                    : 'bg-black/40 text-stone-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
                style={isCur ? {
                  backgroundColor: `${t.accentNeon}22`,
                  borderColor: t.accentNeon,
                  boxShadow: `0 0 15px ${t.accentNeon}66`
                } : undefined}
              >
                {t.tag.split('·')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DẢI ĐIỀU HƯỚNG TRẠM MIXSET (GIỐNG MÀN HÌNH 1) */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between px-1 mb-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: activeTrack.accentNeon }}>
          <Disc3 className={`w-3.5 h-3.5 ${isScratching ? 'animate-spin' : ''}`} style={{ color: activeTrack.accentNeon }} />
          <span className="font-bold uppercase tracking-wider text-[11px] text-stone-200">
            TRẠM MIXSET #{currentTrackIndex + 1} / {DJ_DECK_TRACKS.length}
          </span>
        </div>

        {/* Nút điều hướng Trái / Phải & Dots Indicator */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm"
            title="Trạm trước"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1 px-1">
            {DJ_DECK_TRACKS.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => triggerTrackSwitch(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentTrackIndex === idx ? 'w-5' : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
                style={currentTrackIndex === idx ? {
                  backgroundColor: t.accentNeon,
                  boxShadow: `0 0 8px ${t.accentNeon}`
                } : undefined}
                title={`Xem Trạm ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm relative"
            title="Trạm tiếp theo"
          >
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: activeTrack.accentNeon }}
            />
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style={{ color: activeTrack.accentNeon }} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CAROUSEL KHUNG HIỂN THỊ TRỌN VẸN (GIỐNG FORMAT BẢNG MÀN HÌNH 1) */}
      {/* ======================================================== */}
      <div
        className="relative overflow-hidden py-2.5 px-1.5 -my-2 -mx-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out py-0.5"
          style={{ transform: `translateX(-${currentTrackIndex * 100}%)` }}
        >
          {DJ_DECK_TRACKS.map((track, index) => {
            const isSelected = currentTrackIndex === index;

            return (
              <div
                key={track.id}
                className="w-full min-w-full flex-shrink-0 p-2"
              >
                <div
                  onClick={() => triggerTrackSwitch(index)}
                  className={`relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col justify-between group shadow-xl ${
                    isSelected
                      ? 'border-[#f5e6c8] bg-gradient-to-b from-[#251e18] via-[#161214] to-[#0d0a0f] ring-2 ring-[#e5c365] shadow-[0_0_28px_rgba(229,195,101,0.38)]'
                      : 'border-white/10 bg-[#121218] hover:border-white/30 hover:bg-[#181824]'
                  }`}
                  style={isSelected ? {
                    boxShadow: `0 0 28px rgba(229,195,101,0.38), inset 0 0 18px rgba(229,195,101,0.15)`
                  } : undefined}
                >
                  {/* Luồng sáng vàng nhấp nháy bên trong hình chữ nhật khi Selected (Breathing Light Vàng Kim) */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#e5c365]/20 via-[#faedd0]/25 to-transparent pointer-events-none animate-pulse" />
                  )}

                  {/* Background Watermark Crest từ thư mục ANH/ (Downloads/ANH/) - Tinh chỉnh kích cỡ đồng đều */}
                  <div
                    className="absolute right-2 -bottom-2 select-none pointer-events-none transition-all duration-300 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden"
                    style={{
                      opacity: isSelected ? 0.28 : 0.08
                    }}
                  >
                    <img
                      src={track.emblemUrl}
                      alt={track.title}
                      className={`w-full h-full object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-transform duration-300 ${track.emblemScale || 'scale-100'}`}
                    />
                  </div>

                  <div className="relative z-10">
                    {/* Header Thẻ: Box TRẠM bên trái + PAD / BPM / Genre bên phải */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Box TRẠM... glowing màu neon riêng của từng Trạm, chữ trắng */}
                      <div
                        className="px-2.5 sm:px-3 py-1 rounded-lg flex items-center gap-1.5 shrink min-w-0 transition-all truncate"
                        style={{
                          backgroundColor: `${track.accentNeon}18`,
                          border: `1px solid ${track.accentNeon}`,
                          boxShadow: `0 0 15px ${track.accentNeon}66, inset 0 0 10px ${track.accentNeon}22`
                        }}
                      >
                        <span className="text-xs sm:text-[13px] font-black text-white uppercase tracking-wider font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] shrink-0">
                          {track.tag.split('·')[0].trim()}
                        </span>
                        <span className="text-xs font-bold shrink-0" style={{ color: track.accentNeon }}>·</span>
                        <span className="text-xs sm:text-[13px] font-bold text-white uppercase tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] truncate">
                          {track.tag.split('·')[1]?.trim()}
                        </span>
                      </div>

                      {/* Genre + PAD Number + BPM indicator - Chống tràn dòng & cố định cỡ chữ */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Huy hiệu Thể loại Âm nhạc riêng */}
                        <span
                          className="hidden sm:inline-block text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap"
                          style={{
                            color: track.accentNeon,
                            borderColor: `${track.accentNeon}55`,
                            backgroundColor: 'rgba(0,0,0,0.6)'
                          }}
                        >
                          {track.genre}
                        </span>

                        <span
                          className="text-[10px] font-mono font-black px-2 py-0.5 rounded border flex items-center gap-1 transition-all shrink-0"
                          style={isSelected ? {
                            backgroundColor: track.accentNeon,
                            color: '#000000',
                            borderColor: track.accentNeon,
                            boxShadow: `0 0 10px ${track.accentNeon}88`
                          } : {
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#a8a29e',
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}
                        >
                          <span>{track.watermark}</span>
                          <span>PAD 0{index + 1}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tiêu đề Track (In đậm, không nghiêng) + Dấu Checkmark ✓ khi active */}
                    <h3
                      className="text-xl sm:text-2xl font-black not-italic font-bold uppercase text-white transition-colors flex items-center justify-between tracking-wide"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform font-black not-italic font-bold">{track.title}</span>
                      {isSelected && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shadow bg-[#e5c365] text-stone-950 shadow-[0_0_12px_rgba(229,195,101,0.6)]"
                        >
                          ✓
                        </span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed font-sans mt-2.5 italic">
                      {track.description}
                    </p>
                  </div>

                  {/* Danh mục phối sẵn (Pills) */}
                  <div className="relative z-10 mt-3 pt-3 border-t border-white/10">
                    <div
                      className="text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1 font-mono"
                      style={{ color: track.accentNeon }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: track.accentNeon }} />
                      <span>CẤU KIỆN MIXSET QUY CHUẨN:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {track.highlights.map((item, i) => (
                        <span
                          key={i}
                          className="text-[10.5px] px-2.5 py-0.5 rounded font-medium transition-all"
                          style={isSelected ? {
                            backgroundColor: `${track.accentNeon}20`,
                            color: '#ffffff',
                            border: `1px solid ${track.accentNeon}55`,
                            boxShadow: `0 0 6px ${track.accentNeon}33`
                          } : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: '#d6d3d1',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          #{item}
                        </span>
                      ))}
                    </div>

                    {/* Nút bấm trạng thái + Địa chỉ glowing màu trắng nhẹ chống xuống dòng */}
                    <div className="mt-3.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                        style={{ color: isSelected ? track.accentNeon : '#a8a29e' }}
                      >
                        <Flame className="w-3.5 h-3.5 animate-pulse" style={{ color: track.accentNeon }} />
                        <span>{isSelected ? '⚡ Đang diện bản phối này' : 'Nhấn để diện track mixset này →'}</span>
                      </span>

                      {/* Địa chỉ glowing màu trắng nhẹ */}
                      <div className="flex items-center gap-1.5 text-xs font-mono whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] shrink-0 animate-pulse" />
                        <span className="text-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] font-semibold tracking-wider">
                          {track.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
