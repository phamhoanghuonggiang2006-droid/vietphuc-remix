import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Bookmark, 
  MapPin, 
  Palette,
  ArrowRight
} from 'lucide-react';
import { 
  playPageFlipSound, 
  playButtonClinkSound 
} from '../utils/soundEffects';

export interface BentoLookbookPreset {
  id: string;
  badge: string;
  issuePage: string;
  title: string;
  subtitle: string;
  tagline: string;
  stylistNote: string;
  whereToWear: string;
  vibe: string;
  accentColor: string;
  bgGradient: string;
  imageUrl: string;
  palette: Array<{ name: string; hex: string }>;
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
    issuePage: 'PAGE 08 · S/S 2026',
    title: 'Chic Minimalist',
    subtitle: 'Lụa Nhăn & Quần Tây Ống Suông',
    tagline: 'Phối sẵn tone Be/Xám cho buổi hẹn cà phê Phê La hay chạy deadline văn phòng.',
    stylistNote: 'Sự giao thoa giữa lụa nhăn Cố Đô và quần âu ống suông – tuyên ngôn của phong thái Quiet Luxury thời thượng, thanh lịch và tự do.',
    whereToWear: 'Cà phê Phê La · Co-working Space',
    vibe: 'Quiet Luxury Công Sở',
    accentColor: '#8BA888',
    bgGradient: 'from-[#F5F2EB] via-[#EFECE6] to-[#E6E1D8]',
    imageUrl: '/2.png',
    palette: [
      { name: 'Trắng Ngà', hex: '#F2EAD8' },
      { name: 'Xanh Xô Thơm', hex: '#8BA888' },
      { name: 'Xám Tro', hex: '#6B7280' }
    ],
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
    issuePage: 'PAGE 14 · S/S 2026',
    title: 'Sartorial Dandy',
    subtitle: 'Áo Tấc Cách Tân & Kaki Xếp Ly',
    tagline: 'Tone Rêu/Nâu đất nam tính, lịch thiệp cho buổi tối ăn Pizza 4P’s cùng bạn bè.',
    stylistNote: 'Áo Tấc tay lỡ hòa quyện cùng quần xếp ly tone đất – vẻ đẹp nho nhã của quý ông Indochine hiện đại, đĩnh đạc giữa phố đêm.',
    whereToWear: 'Pizza 4P’s Tối Cuối Tuần · Hẹn Hò Lịch Thiệp',
    vibe: 'Modern Gentleman',
    accentColor: '#5C715E',
    bgGradient: 'from-[#EAECE6] via-[#DFE3D8] to-[#D5DACB]',
    imageUrl: '/1.png',
    palette: [
      { name: 'Xanh Rêu Thẫm', hex: '#334D3C' },
      { name: 'Kaki Be Đất', hex: '#D5DACB' },
      { name: 'Nâu Trầm', hex: '#634832' }
    ],
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
    issuePage: 'PAGE 22 · S/S 2026',
    title: 'Tết Casual Pastel',
    subtitle: 'Đỏ Gạch & Lụa Đũi Mộc',
    tagline: 'Tone Đỏ Gạch nung & Hồng phấn dịu êm, nhẹ nhàng đi chúc Tết hoặc dạo phố xuân.',
    stylistNote: 'Tone Đỏ gạch nung nồng ấm trên dáng Áo Ngũ Thân Tay Chẽn thanh thoát – nét duyên thầm dịu êm dạo bước phố xuân ngày đầu năm.',
    whereToWear: 'Dạo Phố Tràng Tiền · Chúc Tết Gia Đình & Bạn Bè',
    vibe: 'Duyên Dáng Thanh Lịch',
    accentColor: '#D97746',
    bgGradient: 'from-[#FAF2EE] via-[#F4E6DF] to-[#EBD8CE]',
    imageUrl: '/4.png',
    palette: [
      { name: 'Đỏ Gạch Son', hex: '#7A222C' },
      { name: 'Lụa Trắng', hex: '#FFFFFF' },
      { name: 'Hồng Đũi Mộc', hex: '#F4E6DF' }
    ],
    outfit: {
      garmentId: 'ngu-than-tay-chen',
      garmentName: 'Áo Ngũ Thân Tay Chẽn Vải Đũi',
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
    details: ['Áo Ngũ Thân Tay Chẽn', 'Quần Lụa Trắng', 'Mules Da Tối Giản', 'Túi Tote Da Be']
  },
  {
    id: 'bento-coffee-deadline',
    badge: 'Daily Routine',
    issuePage: 'PAGE 30 · S/S 2026',
    title: 'Phê La & Deadline',
    subtitle: 'Xanh Khói & Sneaker Trắng',
    tagline: 'Bộ phối linh hoạt cho một ngày làm việc năng suất giữa lòng phố thị.',
    stylistNote: 'Sự phóng khoáng của sneakers trắng kết hợp cùng vẻ đĩnh đạc của Áo Ngũ Thân lam khói – nguồn năng lượng làm việc tích cực, hiện đại.',
    whereToWear: 'Cà phê Phê La Làm Việc · Dạo Phố Sau Giờ Làm',
    vibe: 'Modern Urban Casual',
    accentColor: '#4A6B82',
    bgGradient: 'from-[#F0F4F8] via-[#E4ECF2] to-[#D8E3EB]',
    imageUrl: '/2.png',
    palette: [
      { name: 'Lam Khói', hex: '#2B5B84' },
      { name: 'Xám Tro', hex: '#E4ECF2' },
      { name: 'Trắng Sáng', hex: '#FFFFFF' }
    ],
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

  // Đồng bộ currentIndex nếu activePresetId được chọn từ bên ngoài
  useEffect(() => {
    if (activePresetId) {
      const idx = BENTO_PRESETS.findIndex(p => p.id === activePresetId);
      if (idx !== -1 && idx !== currentIndex) {
        setCurrentIndex(idx);
      }
    }
  }, [activePresetId]);

  const handlePrev = () => {
    try {
      playPageFlipSound();
    } catch {}
    setCurrentIndex(prev => (prev === 0 ? BENTO_PRESETS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    try {
      playPageFlipSound();
    } catch {}
    setCurrentIndex(prev => (prev === BENTO_PRESETS.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handlePresetClick = (preset: BentoLookbookPreset) => {
    try {
      playPageFlipSound();
    } catch {}
    onSelectPreset(preset);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-[0_12px_45px_rgba(0,0,0,0.06)] bg-[#FAF8F5] transition-all">
      {/* Texture Giấy Mỹ Thuật Sợi Dó Nhẹ Nhàng */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#2A2A2E 0.75px, transparent 0.75px), radial-gradient(#8BA888 0.75px, #FAF8F5 0.75px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Dấu Ấn Định Vị Bản In Tạp Chí (Crop Marks + ở 4 Góc) */}
      <div className="absolute top-2.5 left-2.5 text-[10px] text-stone-300 font-mono select-none pointer-events-none">+</div>
      <div className="absolute top-2.5 right-2.5 text-[10px] text-stone-300 font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-2.5 left-2.5 text-[10px] text-stone-300 font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-2.5 right-2.5 text-[10px] text-stone-300 font-mono select-none pointer-events-none">+</div>

      {/* Quầng Sáng Studio Nền (Ambient Studio Aura Glow Thích Ứng Theo Preset) */}
      <div 
        className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: BENTO_PRESETS[currentIndex]?.accentColor || '#8BA888' }}
      />
      <div 
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-15"
        style={{ backgroundColor: BENTO_PRESETS[currentIndex]?.accentColor || '#8BA888' }}
      />

      {/* Dấu Ấn Biên Tập Góc Bìa Tạp Chí */}
      <div className="absolute top-3 left-4 font-mono text-[9px] text-stone-400 select-none tracking-widest uppercase">
        [VOL. 04]
      </div>
      <div className="absolute top-3 right-4 font-mono text-[9px] text-stone-400 select-none tracking-widest uppercase">
        HERITAGE × ACUBI
      </div>

      {/* Header Bìa Tạp Chí Thời Trang (Editorial Header) */}
      <div className="relative z-10 px-5 pt-5 pb-3 text-center border-b border-stone-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8BA888]/15 border border-[#8BA888]/30 text-[#2E482B] text-[10px] font-sans font-bold tracking-widest uppercase mb-1 shadow-sm">
          <BookOpen className="w-3 h-3 text-[#5C715E]" />
          <span>Ấn Bản Phố Thị · S/S 2026</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-stone-900 drop-shadow-sm flex items-center justify-center">
          <span>Tạp Chí Thời Trang</span>
        </h2>

        <p className="text-[11px] text-stone-500 max-w-sm mx-auto mt-0.5 font-serif italic">
          4 Trang Lookbook Phối Sẵn · Bấm lật trang hoặc vuốt để xem trọn từng ấn bản
        </p>
      </div>

      {/* Dải Điều Hướng "Lật Trang" (Page-Turn Toolbar) */}
      <div className="relative z-10 px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-stone-700">
          <Bookmark className="w-3.5 h-3.5 text-[#5C715E]" />
          <span className="font-sans font-bold uppercase tracking-wider text-[10.5px] text-stone-800">
            Lật Trang #{currentIndex + 1} / {BENTO_PRESETS.length}
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-[10.5px] font-medium text-stone-500 italic truncate max-w-[120px] sm:max-w-none">
            {BENTO_PRESETS[currentIndex].title}
          </span>
        </div>

        {/* Nút lật trang Trái / Phải có âm thanh Xoạt lật trang sách */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm"
            title="Lật trang trước"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Vạch Tiến Trình Lật Trang (Editorial Page Bars) */}
          <div className="flex items-center gap-1 px-1">
            {BENTO_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  try {
                    playPageFlipSound();
                  } catch {}
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx 
                    ? 'bg-[#5C715E] w-5 shadow-sm' 
                    : 'bg-stone-200 hover:bg-stone-300 w-2'
                }`}
                title={`Lật đến trang ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm relative"
            title="Lật trang tiếp theo"
          >
            {/* Vòng sáng nhấp nháy báo hiệu có thể lật trang */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8BA888] animate-ping opacity-75" />
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#2E482B]" />
          </button>
        </div>
      </div>

      {/* CAROUSEL KHUNG HIỂN THỊ TRỌN VẸN 100% CỦA TỪNG TRANG TẠP CHÍ */}
      <div 
        className="relative z-10 p-3.5 sm:p-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BENTO_PRESETS.map((preset, index) => {
            const isSelected = activePresetId === preset.id;

            return (
              <div
                key={preset.id}
                className="w-full min-w-full flex-shrink-0 px-0.5"
              >
                <div
                  onClick={() => handlePresetClick(preset)}
                  className={`relative rounded-2xl p-4 sm:p-4.5 text-left transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col justify-between group shadow-sm ${
                    isSelected
                      ? 'border-[#8BA888] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5F1EB] ring-4 ring-[#8BA888]/15 shadow-xl'
                      : 'border-stone-200/90 bg-white/80 hover:bg-white hover:border-stone-300 hover:shadow-md'
                  }`}
                >
                  {/* Quầng Sáng Studio Spotlight Trong Thẻ */}
                  <div 
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-2xl pointer-events-none transition-all duration-700"
                    style={{
                      backgroundColor: preset.accentColor,
                      opacity: isSelected ? 0.16 : 0.05
                    }}
                  />

                  {/* Watermark Số Trang In Chìm Chuẩn Tạp Chí (Didot Haute Couture Typography) */}
                  <div className="absolute right-2 -bottom-4 text-7xl sm:text-8xl font-serif font-black tracking-tighter select-none pointer-events-none opacity-[0.05] group-hover:opacity-[0.09] transition-opacity text-stone-900 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10">
                    {/* Header Thẻ: Badge + Mini Barcode + Trang số */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        isSelected 
                          ? 'bg-[#8BA888] text-white border-[#6c8869]' 
                          : 'bg-[#8BA888]/15 text-[#2E482B] border-[#8BA888]/30'
                      }`}>
                        {preset.badge}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Mini Barcode thời trang */}
                        <div className="flex items-center gap-0.5 opacity-60" title="Mã lưu chiểu ấn phẩm">
                          <span className="w-[1.5px] h-3 bg-stone-700" />
                          <span className="w-[1px] h-3 bg-stone-700" />
                          <span className="w-[2.5px] h-3 bg-stone-700" />
                          <span className="w-[1px] h-3 bg-stone-700" />
                          <span className="w-[2px] h-3 bg-stone-700" />
                          <span className="w-[1px] h-3 bg-stone-700" />
                        </div>
                        <span className="font-mono text-[10px] text-stone-500 font-semibold tracking-wider">
                          {preset.issuePage}
                        </span>
                      </div>
                    </div>

                    {/* Tiêu đề Trang Tạp Chí */}
                    <h3 className="text-xl font-serif font-black text-stone-900 group-hover:text-[#2E482B] transition-colors flex items-center justify-between">
                      <span>{preset.title}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#8BA888] text-white flex items-center justify-center text-[11px] font-bold shadow">
                          ✓
                        </span>
                      )}
                    </h3>

                    <div className="text-xs text-[#5C715E] font-medium mt-0.5">
                      {preset.subtitle}
                    </div>

                    {/* Stylist's Note (Lời tựa Ban Biên Tập) */}
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#F8F6F0]/90 border border-stone-200/70 text-xs text-stone-600 font-serif italic leading-relaxed relative">
                      <span className="text-[#8BA888] font-serif text-lg leading-none absolute top-1 left-1.5 select-none opacity-60">“</span>
                      <p className="pl-3.5">
                        {preset.stylistNote}
                      </p>
                    </div>

                    {/* Bối cảnh diện đồ & Bảng màu Palette */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      {/* Bối cảnh phù hợp */}
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#5C715E] shrink-0" />
                        <span className="font-medium text-stone-700">{preset.whereToWear}</span>
                      </div>

                      {/* Palette Swatches (Không còn chữ Tone, tinh giản sang trọng) */}
                      <div className="flex items-center gap-1.5" title="Bảng màu trang phục">
                        {preset.palette.map((c, ci) => (
                          <span
                            key={ci}
                            className="w-3.5 h-3.5 rounded-full border border-stone-300/80 shadow-2xs transition-transform hover:scale-125"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Danh mục phối sẵn (Pills) */}
                  <div className="relative z-10 mt-3 pt-2.5 border-t border-stone-100">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#5C715E]" />
                      <span>Cấu Kiện Phối Sẵn (Look Breakdown):</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {preset.details.map((item, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#8BA888]/15 text-[#1F331D] border border-[#8BA888]/40'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Nút bấm diện trang phục to rõ, chuẩn Editorial */}
                    <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#2E482B] group-hover:text-[#182916] transition-colors flex items-center gap-1">
                        {isSelected ? '✦ Đang trình diễn trang này' : 'Nhấn để diện trang phục (Auto-Layer) →'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">100% Acubi Editorial</span>
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
