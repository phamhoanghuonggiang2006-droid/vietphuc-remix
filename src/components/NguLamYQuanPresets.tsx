import React, { useState, useEffect } from 'react';
import { Sparkles, Scroll, Check, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { playCourtBrassSound, playDanTranhTabSound } from '../utils/soundEffects';

export interface HeritagePreset {
  id: string;
  title: string;
  subTitle: string;
  tag: string;
  description: string;
  bgAtmosphere: string;
  bgSilhouette: string;
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

export const HERITAGE_CORE_PRESETS: HeritagePreset[] = [
  {
    id: 'preset-hoang-gia-chi-le',
    title: 'Hoàng Gia Chi Lễ',
    subTitle: 'Luxury Heritage · Đại Triều Phục Cung Đình',
    tag: 'Bậc Nhất Uy Nghiêm',
    description: 'Dành cho những dịp trọng đại bậc nhất vương triều, mang trọn phong thái tôn quý của Mẫu nghi thiên hạ và Hoàng tộc Cố Đô.',
    bgAtmosphere: 'from-[#3b111a]/95 via-[#230c12]/90 to-[#14080a]/95',
    bgSilhouette: '🏛️',
    highlights: ['Áo Nhật Bình Đỏ Tấc', 'Quần Lụa Trắng', 'Hài Thêu Kim Tuyến', 'Trâm Phượng Cung Đình', 'Cúc Ngọc Bích'],
    outfit: {
      garmentId: 'ao-nhat-binh',
      garmentName: 'Áo Nhật Bình Hoàng Tộc',
      colorHex: '#7A222C',
      colorName: 'Đỏ Tấc Son',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-jade-green',
      buttonName: 'Cúc Ngọc Bích Cẩm Thạch',
      bottomId: 'bottom-silk-wide-pants',
      bottomName: 'Quần Ống Sớ Lụa Trắng',
      shoesId: 'shoes-embroidered-slippers',
      shoesName: 'Hài Thêu Cung Đình',
      accessoryId: 'acc-tram-phuong',
      accessoryName: 'Trâm Phượng Hoàng Cung',
      styleVibe: 'Đại Triều Phục Hoàng Gia'
    }
  },
  {
    id: 'preset-nghi-thuc-gia-tien',
    title: 'Nghi Thức Gia Tiên',
    subTitle: 'Formal Heritage · Lễ Nghi Tôn Kính',
    tag: 'Kính Cẩn Đoan Trang',
    description: 'Kín đáo, uy nghiêm, dành cho các đại lễ tế tự, giỗ chạp gia tộc, chiêm bái đền chùa tôn kính với cốt cách nho nhã trượng phu.',
    bgAtmosphere: 'from-[#2a1329]/95 via-[#1a0c1b]/90 to-[#100712]/95',
    bgSilhouette: '⛩️',
    highlights: ['Áo Tấc Tay Thụng Tím Thẫm', 'Đơn Y Trắng Cổ Cao', 'Quần Lụa Đen Rộng', 'Guốc Mộc Cố Đô', 'Khăn Đóng Chữ Nhân'],
    outfit: {
      garmentId: 'ao-tac',
      garmentName: 'Áo Tấc (Lễ Phục Tay Thụng)',
      colorHex: '#5E3A58',
      colorName: 'Tím Chính Sắc',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-metal-copper',
      buttonName: 'Cúc Đồng Đúc Bát Bửu',
      bottomId: 'bottom-silk-wide-pants',
      bottomName: 'Quần Lụa Đen Rộng',
      shoesId: 'shoes-wooden-clogs',
      shoesName: 'Guốc Mộc Quai Nhung',
      accessoryId: 'acc-khan-dong',
      accessoryName: 'Khăn Đóng Chữ Nhân',
      styleVibe: 'Lễ Nghi Tôn Nghiêm Gia Tộc'
    }
  },
  {
    id: 'preset-kinh-ky-dao-buoc',
    title: 'Kinh Kỳ Dạo Bước',
    subTitle: 'Casual Heritage · Phong Lưu Nho Sĩ',
    tag: 'Thanh Nhã Nếp Xưa',
    description: 'Nhẹ nhàng, thanh tao cho những chuyến vãn cảnh di tích Cố Đô, thưởng trà ngắm hoa, lưu giữ nét duyên ngàn năm đất kinh kỳ.',
    bgAtmosphere: 'from-[#122538]/95 via-[#0c1825]/90 to-[#08101a]/95',
    bgSilhouette: '🏯',
    highlights: ['Áo Ngũ Thân Xanh Thanh Thiên', 'Quần Lụa Trắng Buông Rủ', 'Dép Lát Mộc Mạc', 'Quạt Giấy Trầm Hương', 'Cúc Gỗ Trầm'],
    outfit: {
      garmentId: 'ngu-than-tay-chen',
      garmentName: 'Áo Ngũ Thân Tay Chẽn',
      colorHex: '#2B5B84',
      colorName: 'Xanh Thanh Thiên',
      layerId: 'layer-don-y-white',
      layerName: 'Áo Đơn Y Trắng Cổ Đứng',
      buttonId: 'btn-wood-agarwood',
      buttonName: 'Cúc Gỗ Trầm Hương',
      bottomId: 'bottom-silk-wide-pants',
      bottomName: 'Quần Ống Sớ Lụa Trắng',
      shoesId: 'shoes-flat-straw-slippers',
      shoesName: 'Dép Lát Đế Phẳng',
      accessoryId: 'acc-paper-fan',
      accessoryName: 'Quạt Giấy Trầm Hương',
      styleVibe: 'Nho Sĩ Phong Lưu Kinh Kỳ'
    }
  }
];

interface NguLamYQuanPresetsProps {
  activePresetId: string | null;
  onSelectPreset: (preset: HeritagePreset) => void;
}

export const NguLamYQuanPresets: React.FC<NguLamYQuanPresetsProps> = ({
  activePresetId,
  onSelectPreset
}) => {
  // Chỉ số cuộn thư tịch đang hiển thị (0, 1, 2)
  const initialIndex = HERITAGE_CORE_PRESETS.findIndex(p => p.id === activePresetId);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Đồng bộ index khi activePresetId bên ngoài thay đổi
  useEffect(() => {
    const idx = HERITAGE_CORE_PRESETS.findIndex(p => p.id === activePresetId);
    if (idx >= 0 && idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  }, [activePresetId]);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % HERITAGE_CORE_PRESETS.length;
    setCurrentIndex(nextIdx);
    playDanTranhTabSound();
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + HERITAGE_CORE_PRESETS.length) % HERITAGE_CORE_PRESETS.length;
    setCurrentIndex(prevIdx);
    playDanTranhTabSound();
  };

  const handlePresetClick = (preset: HeritagePreset) => {
    playCourtBrassSound();
    onSelectPreset(preset);
  };

  // Hỗ trợ vuốt chạm cảm ứng / trackpad
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

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_12px_45px_rgba(0,0,0,0.6)] bg-[#100d0e] transition-all">
      {/* Texture giấy điệp / lụa tơ tằm cổ viền mộc */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#C5A059 0.75px, #100d0e 0.75px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Họa tiết mây chìm trang trí 2 góc */}
      <div className="absolute top-2 left-3 w-28 h-20 pointer-events-none opacity-20 text-[#D4AF37]">
        <svg viewBox="0 0 100 60" fill="currentColor">
          <path d="M10 40 Q25 25 40 40 Q55 20 70 35 Q85 30 95 45 Q70 55 50 48 Q30 55 10 40 Z" />
          <path d="M20 25 Q35 12 55 22 Q75 10 85 28 Q60 38 40 30 Q28 35 20 25 Z" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute top-2 right-3 w-28 h-20 pointer-events-none opacity-20 text-[#D4AF37] scale-x-[-1]">
        <svg viewBox="0 0 100 60" fill="currentColor">
          <path d="M10 40 Q25 25 40 40 Q55 20 70 35 Q85 30 95 45 Q70 55 50 48 Q30 55 10 40 Z" />
          <path d="M20 25 Q35 12 55 22 Q75 10 85 28 Q60 38 40 30 Q28 35 20 25 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Header Thư Pháp Hoàng Cung */}
      <div className="relative z-10 px-5 pt-4 pb-2.5 text-center border-b border-[#D4AF37]/20">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#f5e6c8] text-[10px] font-semibold tracking-widest uppercase mb-1 shadow-inner">
          <Crown className="w-3 h-3 text-[#e5c365]" />
          <span>Cẩm Nang Y Quan Triều Nguyễn</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#faedd0] via-[#e5c365] to-[#c5a059] drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]">
          Ngự Lãm Y Quan
        </h2>

        <p className="text-[10.5px] text-[#e8dcbf]/85 max-w-sm mx-auto mt-0.5 font-serif italic">
          3 Cuộn Thư Tịch Phối Sẵn · Bấm mũi tên hoặc vuốt để xem trọn vẹn từng cuộn
        </p>
      </div>

      {/* Dải Điều Hướng & Chỉ Báo Trang (Top Toolbar của Slider) */}
      <div className="relative z-10 px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]">
          <Scroll className="w-3.5 h-3.5 text-[#e5c365]" />
          <span className="font-semibold uppercase tracking-wider text-[10.5px]">
            Cuộn Thư Tịch #{currentIndex + 1} / {HERITAGE_CORE_PRESETS.length}
          </span>
        </div>

        {/* Nút điều hướng Trái / Phải có hiệu ứng nhấp nháy báo hiệu chuyển trang */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 text-[#faedd0] border border-[#D4AF37]/30 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm"
            title="Cuộn trước"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1 px-1">
            {HERITAGE_CORE_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  playDanTranhTabSound();
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx 
                    ? 'bg-[#e5c365] w-5 shadow-[0_0_8px_rgba(229,195,101,0.7)]' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`Xem cuộn ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 text-[#faedd0] border border-[#D4AF37]/30 flex items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-sm relative"
            title="Cuộn tiếp theo"
          >
            {/* Vòng sáng nhấp nháy báo hiệu có thể sang trang theo yêu cầu của Giang */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e5c365] animate-ping opacity-75" />
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#e5c365]" />
          </button>
        </div>
      </div>

      {/* CAROUSEL KHUNG HIỂN THỊ TRỌN VẸN 100% (KHÔNG CÒN BỊ NỬA NỬA) */}
      <div 
        className="relative z-10 p-3.5 sm:p-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {HERITAGE_CORE_PRESETS.map((preset, index) => {
            const isSelected = activePresetId === preset.id;

            return (
              <div
                key={preset.id}
                className="w-full min-w-full flex-shrink-0 px-0.5"
              >
                <div
                  onClick={() => handlePresetClick(preset)}
                  className={`relative rounded-2xl p-4 sm:p-4.5 text-left transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col justify-between group shadow-lg ${
                    isSelected
                      ? 'border-[#f5e6c8] bg-gradient-to-b from-[#2d1b10] via-[#1b1008] to-[#120a06] ring-2 ring-[#e5c365] shadow-[0_0_25px_rgba(245,230,200,0.35)]'
                      : 'border-[#D4AF37]/35 bg-[#161214] hover:border-[#D4AF37]/80 hover:bg-[#1c1618]'
                  }`}
                >
                  {/* Luồng sáng vàng khi Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#e5c365]/10 via-[#faedd0]/15 to-transparent pointer-events-none animate-pulse" />
                  )}

                  {/* Bóng mờ biểu tượng cổ */}
                  <div className="absolute right-2 -bottom-2 text-7xl select-none pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                    {preset.bgSilhouette}
                  </div>

                  <div className="relative z-10">
                    {/* Header Thẻ: Tag + Cuộn số */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        isSelected 
                          ? 'bg-[#e5c365] text-stone-950 border-[#f5e6c8]' 
                          : 'bg-[#D4AF37]/15 text-[#e5c365] border-[#D4AF37]/35'
                      }`}>
                        {preset.tag}
                      </span>
                      <span className="font-serif font-black text-xs text-[#D4AF37]/75">
                        Điển Lễ #{index + 1}
                      </span>
                    </div>

                    {/* Tiêu đề Cuộn */}
                    <h3 className="text-xl font-serif font-bold text-[#faedd0] group-hover:text-[#e5c365] transition-colors flex items-center justify-between">
                      <span>{preset.title}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#e5c365] text-stone-950 flex items-center justify-center text-[11px] font-bold shadow">
                          ✓
                        </span>
                      )}
                    </h3>

                    <div className="text-xs text-[#c5a059] font-medium mt-0.5">
                      {preset.subTitle}
                    </div>

                    <p className="text-xs text-stone-300/90 mt-2 leading-relaxed font-serif">
                      {preset.description}
                    </p>
                  </div>

                  {/* Danh mục phối sẵn (Pills) */}
                  <div className="relative z-10 mt-3 pt-3 border-t border-white/10">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#e5c365]" />
                      <span>Cấu Kiện Y Quan Quy Chuẩn:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {preset.highlights.map((item, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#D4AF37]/25 text-[#faedd0] border border-[#D4AF37]/50'
                              : 'bg-white/5 text-stone-300 border border-white/10 group-hover:border-white/20'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Nút bấm diện trang phục to rõ, thanh nhã */}
                    <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#e5c365] group-hover:text-white transition-colors flex items-center gap-1">
                        {isSelected ? '✦ Đang diện bộ y quan này' : 'Nhấn để diện trang phục (Auto-Layer) →'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">100% Chuẩn Di Sản</span>
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
