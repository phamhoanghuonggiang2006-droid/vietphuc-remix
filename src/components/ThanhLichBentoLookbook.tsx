import React from 'react';
import { Sparkles, ArrowUpRight, Check, Compass, Coffee, Briefcase, Heart } from 'lucide-react';
import { playButtonClinkSound, playDanTranhTabSound, playFabricRustleSound } from '../utils/soundEffects';

export interface BentoLookbookPreset {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  vibe: string;
  accentColor: string;
  bgGradient: string;
  imageUrl: string;
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
  details: string[];
}

export const BENTO_PRESETS: BentoLookbookPreset[] = [
  {
    id: 'bento-chic-minimalist',
    badge: 'Trending Acubi',
    title: 'Chic Minimalist',
    subtitle: 'Lụa Nhăn & Quần Tây Ống Suông',
    tagline: 'Phối sẵn tone Be/Xám cho buổi hẹn cà phê Phê La hay chạy deadline văn phòng.',
    vibe: 'Quiet Luxury Công Sở',
    accentColor: '#8BA888',
    bgGradient: 'from-[#F5F2EB] via-[#EFECE6] to-[#E6E1D8]',
    imageUrl: '/2.png',
    outfit: {
      garmentId: 'ngu-than-tay-chen',
      garmentName: 'Áo Ngũ Thân Tay Chẽn Lụa Mộc',
      colorHex: '#F2EAD8',
      colorName: 'Trắng Ngà Tự Nhiên',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-mother-of-pearl',
      buttonName: 'Cúc Xà Cừ Ánh Trăng',
      bottomId: 'bottom-tailored-wide-leg',
      bottomName: 'Quần Tây Wide-Leg Be/Xám',
      shoesId: 'shoes-chunky-loafers',
      shoesName: 'Chunky Loafers Da',
      accessoryId: 'acc-sunglasses-gold',
      accessoryName: 'Kính Râm Gọng Mảnh Vàng',
      styleVibe: 'Chic Minimalist Quiet Luxury'
    },
    details: ['Áo Ngũ Thân Lụa Nhăn', 'Quần Tây Ống Suông', 'Loafers Da Bóng', 'Kính Gọng Kim Loại Mảnh']
  },
  {
    id: 'bento-sartorial-dandy',
    badge: 'Indochine Dandy',
    title: 'Sartorial Dandy',
    subtitle: 'Áo Tấc Cách Tân & Kaki Xếp Ly',
    tagline: 'Tone Rêu/Nâu đất nam tính, lịch thiệp cho buổi tối ăn Pizza 4P’s cùng bạn bè.',
    vibe: 'Modern Gentleman',
    accentColor: '#5C715E',
    bgGradient: 'from-[#EAECE6] via-[#DFE3D8] to-[#D5DACB]',
    imageUrl: '/1.png',
    outfit: {
      garmentId: 'ao-tac',
      garmentName: 'Áo Tấc Cách Tân (Tay Lửng)',
      colorHex: '#334D3C',
      colorName: 'Xanh Rêu Thẫm',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-wood-agarwood',
      buttonName: 'Cúc Gỗ Trầm Hương',
      bottomId: 'bottom-linen-wide-pants',
      bottomName: 'Quần Kaki Xếp Ly Tone Đất',
      shoesId: 'shoes-chunky-loafers',
      shoesName: 'Giày Derby Da Cổ Điển',
      accessoryId: 'acc-paper-fan',
      accessoryName: 'Quạt Giấy Trầm Hương',
      styleVibe: 'Sartorial Indochine Dandy'
    },
    details: ['Áo Tấc Tay Lửng', 'Quần Kaki Ống Rộng', 'Derby Da Nâu Trầm', 'Khuy Gỗ Trầm Tự Nhiên']
  },
  {
    id: 'bento-tet-casual',
    badge: 'Tết Dạo Phố',
    title: 'Tết Casual Pastel',
    subtitle: 'Đỏ Gạch & Lụa Đũi Mộc',
    tagline: 'Tone Đỏ Gạch nung & Hồng phấn dịu êm, nhẹ nhàng đi chúc Tết hoặc dạo phố xuân.',
    vibe: 'Duyên Dáng Thanh Lịch',
    accentColor: '#D97746',
    bgGradient: 'from-[#FAF2EE] via-[#F4E6DF] to-[#EBD8CE]',
    imageUrl: '/4.png',
    outfit: {
      garmentId: 'ao-giao-linh',
      garmentName: 'Áo Giao Lĩnh Cách Tân Vải Đũi',
      colorHex: '#7A222C',
      colorName: 'Đỏ Gạch Nung Ấm',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-silver-lotus',
      buttonName: 'Cúc Bạc Hoa Sen',
      bottomId: 'bottom-silk-wide-pants',
      bottomName: 'Quần Lụa Trắng Buông Rủ',
      shoesId: 'shoes-mules-leather',
      shoesName: 'Mules Da Đế Bệt',
      accessoryId: 'acc-leather-tote',
      accessoryName: 'Túi Tote Da Cấu Trúc',
      styleVibe: 'Tết Casual Dạo Phố'
    },
    details: ['Áo Giao Lĩnh Cách Tân', 'Quần Lụa Trắng', 'Mules Da Tối Giản', 'Túi Tote Da Be']
  },
  {
    id: 'bento-coffee-deadline',
    badge: 'Daily Routine',
    title: 'Phê La & Deadline',
    subtitle: 'Xanh Khói & Sneaker Trắng',
    tagline: 'Bộ phối linh hoạt cho một ngày làm việc năng suất giữa lòng phố thị.',
    vibe: 'Modern Urban Casual',
    accentColor: '#4A6B82',
    bgGradient: 'from-[#F0F4F8] via-[#E4ECF2] to-[#D8E3EB]',
    imageUrl: '/2.png',
    outfit: {
      garmentId: 'ngu-than-tay-chen',
      garmentName: 'Áo Ngũ Thân Tay Chẽn',
      colorHex: '#2B5B84',
      colorName: 'Xanh Khói Lam Nhạt',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-metal-copper',
      buttonName: 'Cúc Đồng Đúc Bát Bửu',
      bottomId: 'bottom-tailored-wide-leg',
      bottomName: 'Quần Tây Ống Suông Xám Tro',
      shoesId: 'shoes-white-sneakers',
      shoesName: 'Sneakers Trắng Tối Giản',
      accessoryId: 'acc-kieng-bac',
      accessoryName: 'Kiềng Bạc Chạm Uốn Lượn',
      styleVibe: 'Coffee Deadline Chic'
    },
    details: ['Áo Ngũ Thân Lam Khói', 'Quần Tây Xám Tro', 'Sneakers Trắng', 'Kiềng Bạc Mảnh']
  }
];

interface ThanhLichBentoLookbookProps {
  activePresetId: string | null;
  onSelectPreset: (preset: BentoLookbookPreset) => void;
}

export const ThanhLichBentoLookbook: React.FC<ThanhLichBentoLookbookProps> = ({
  activePresetId,
  onSelectPreset
}) => {
  const handleSelect = (preset: BentoLookbookPreset) => {
    try {
      playButtonClinkSound();
      playFabricRustleSound();
    } catch {
      // Audio fallback
    }
    onSelectPreset(preset);
  };

  const chicPreset = BENTO_PRESETS[0];
  const dandyPreset = BENTO_PRESETS[1];
  const tetPreset = BENTO_PRESETS[2];
  const coffeePreset = BENTO_PRESETS[3];

  return (
    <div className="space-y-3.5">
      {/* Editorial Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#8BA888]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Bento Box Lookbook</span>
              <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#8BA888]/15 text-[#3b5938] border border-[#8BA888]/30">
                Editorial Edit
              </span>
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Gợi ý bản phối Acubi & Quiet Luxury sẵn sàng dạo phố, công sở hoặc cà phê
          </p>
        </div>

        <span className="text-[11px] font-mono font-medium text-stone-400 hidden sm:inline-block">
          Pinterest Curation ✦
        </span>
      </div>

      {/* ASYMMETRIC BENTO GRID (4 Khối dạng iOS Widget / Pinterest Board) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
        
        {/* ======================================================== */}
        {/* 1. Ô LỚN NHẤT (CHIC MINIMALIST) - Chiếm 7 Cột sm */}
        {/* ======================================================== */}
        <div 
          onClick={() => handleSelect(chicPreset)}
          className={`sm:col-span-7 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
            activePresetId === chicPreset.id
              ? 'bg-gradient-to-br from-white via-[#FAF7F2] to-[#F2EDE4] border-[#8BA888] ring-2 ring-[#8BA888]/40 shadow-xl'
              : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-lg'
          }`}
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#8BA888]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#8BA888]/15 text-[#2E482B] text-[10px] font-bold uppercase tracking-wider border border-[#8BA888]/30">
                  {chicPreset.badge}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">· Tone Be / Xám</span>
              </div>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                activePresetId === chicPreset.id
                  ? 'bg-[#8BA888] text-white shadow-md'
                  : 'bg-stone-100 text-stone-400 group-hover:text-stone-700 group-hover:bg-stone-200'
              }`}>
                {activePresetId === chicPreset.id ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-3">
              <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#2E482B] transition-colors leading-tight">
                {chicPreset.title}
              </h4>
              <p className="text-xs font-medium text-stone-600 mt-0.5">
                {chicPreset.subtitle}
              </p>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {chicPreset.tagline}
              </p>
            </div>

            {/* Bottom Flat-lay Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200/60">
              {chicPreset.details.map((item, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 text-[10px] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. Ô VUÔNG (TẾT CASUAL / PASTEL) - Chiếm 5 Cột sm */}
        {/* ======================================================== */}
        <div 
          onClick={() => handleSelect(tetPreset)}
          className={`sm:col-span-5 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
            activePresetId === tetPreset.id
              ? 'bg-gradient-to-br from-white via-[#FDF7F4] to-[#F8EEE9] border-[#D97746] ring-2 ring-[#D97746]/40 shadow-xl'
              : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#D97746]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
            <div className="flex items-start justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D97746]/15 text-[#9C4318] text-[10px] font-bold uppercase tracking-wider border border-[#D97746]/30">
                {tetPreset.badge}
              </span>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                activePresetId === tetPreset.id
                  ? 'bg-[#D97746] text-white shadow-md'
                  : 'bg-stone-100 text-stone-400 group-hover:text-stone-700 group-hover:bg-stone-200'
              }`}>
                {activePresetId === tetPreset.id ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </div>
            </div>

            <div className="my-2">
              <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#9C4318] transition-colors leading-tight">
                {tetPreset.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                {tetPreset.subtitle} · Đỏ gạch nung ấm
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-200/60">
              {tetPreset.details.slice(0, 2).map((item, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 text-[10px] font-medium truncate"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. Ô NGANG (SARTORIAL DANDY) - Chiếm 7 Cột sm */}
        {/* ======================================================== */}
        <div 
          onClick={() => handleSelect(dandyPreset)}
          className={`sm:col-span-7 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
            activePresetId === dandyPreset.id
              ? 'bg-gradient-to-br from-white via-[#F5F8F4] to-[#E9EFE7] border-[#5C715E] ring-2 ring-[#5C715E]/40 shadow-xl'
              : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5C715E]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#5C715E]/15 text-[#2B3B2D] text-[10px] font-bold uppercase tracking-wider border border-[#5C715E]/30">
                  {dandyPreset.badge}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">· Tone Rêu / Nâu</span>
              </div>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                activePresetId === dandyPreset.id
                  ? 'bg-[#5C715E] text-white shadow-md'
                  : 'bg-stone-100 text-stone-400 group-hover:text-stone-700 group-hover:bg-stone-200'
              }`}>
                {activePresetId === dandyPreset.id ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </div>
            </div>

            <div className="my-2">
              <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#2B3B2D] transition-colors leading-tight">
                {dandyPreset.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                {dandyPreset.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200/60">
              {dandyPreset.details.map((item, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 text-[10px] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. Ô NGANG/VUÔNG (COFFEE DEADLINE) - Chiếm 5 Cột sm */}
        {/* ======================================================== */}
        <div 
          onClick={() => handleSelect(coffeePreset)}
          className={`sm:col-span-5 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
            activePresetId === coffeePreset.id
              ? 'bg-gradient-to-br from-white via-[#F4F7FA] to-[#E8F0F6] border-[#4A6B82] ring-2 ring-[#4A6B82]/40 shadow-xl'
              : 'bg-white/80 hover:bg-white border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#4A6B82]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-start justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4A6B82]/15 text-[#1C3B52] text-[10px] font-bold uppercase tracking-wider border border-[#4A6B82]/30">
                {coffeePreset.badge}
              </span>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                activePresetId === coffeePreset.id
                  ? 'bg-[#4A6B82] text-white shadow-md'
                  : 'bg-stone-100 text-stone-400 group-hover:text-stone-700 group-hover:bg-stone-200'
              }`}>
                {activePresetId === coffeePreset.id ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </div>
            </div>

            <div className="my-2">
              <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#1C3B52] transition-colors leading-tight">
                {coffeePreset.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                {coffeePreset.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-200/60">
              {coffeePreset.details.slice(0, 2).map((item, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-700 text-[10px] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
