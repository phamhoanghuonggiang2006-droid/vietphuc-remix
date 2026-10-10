import React, { useState } from 'react';
import { playDanTranhTabSound, playBellTingSound } from '../utils/soundEffects';

export interface ContextOption {
  id: string;
  title: string;
  desc: string;
  vibe: string;
}

export const CONTEXTS: ContextOption[] = [
  {
    id: 'heritage',
    title: 'Chốn Tôn Nghiêm',
    desc: 'Đền chùa, di tích lịch sử, Lễ nghi truyền thống.',
    vibe: 'Trang trọng & Chuẩn mực'
  },
  {
    id: 'modern',
    title: 'Thanh Lịch Đời Thường',
    desc: 'Công sở, Dạo phố nhẹ nhàng, Tết gia đình.',
    vibe: 'Tinh tế & Hiện đại'
  },
  {
    id: 'fusion',
    title: 'Phố Thị Phá Cách',
    desc: 'Concert, Cafe check-in, Dạo phố đêm.',
    vibe: 'Cá tính & Nổi loạn'
  }
];

export interface OnboardingScreenProps {
  onNext: (selectedContextId: string) => void;
  initialContext?: string | null;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  onNext, 
  initialContext = null 
}) => {
  const [selectedContext, setSelectedContext] = useState<string | null>(initialContext);

  const handleSelectContext = (ctxId: string) => {
    setSelectedContext(ctxId);
    try {
      playDanTranhTabSound();
    } catch {
      // Audio fallback
    }
  };

  const handleProceed = () => {
    if (!selectedContext) return;
    try {
      playBellTingSound();
    } catch {
      // Audio fallback
    }
    onNext(selectedContext);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C302E] flex flex-col items-center justify-center p-6 font-sans relative selection:bg-[#D4AF37]/30 selection:text-[#1A1A1A]">
      {/* Brand Watermark / Acubi Accent */}
      <div className="absolute top-8 left-8 md:left-12 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
        <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
          HeritStyle AI · Cổ Phục Viễn Đông
        </span>
      </div>

      <div className="max-w-5xl w-full space-y-12 py-12 md:py-0">
        
        {/* Tiêu đề chính */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D4AF37]/40 shadow-sm text-xs font-semibold text-[#8C7320] tracking-wider uppercase mb-1">
            ✦ Trải nghiệm Stylist Cá Nhân Hóa
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight">
            Hôm nay bạn muốn tỏa sáng ở đâu?
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Hãy chọn một bối cảnh để AI Stylist tư vấn cho bạn những outfit chuẩn vibe và không lo "phạm lỗi" văn hóa nhé.
          </p>
        </div>

        {/* 3 Thẻ Bối cảnh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTEXTS.map((ctx) => {
            const isSelected = selectedContext === ctx.id;
            return (
              <div
                key={ctx.id}
                onClick={() => handleSelectContext(ctx.id)}
                className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-500 border-[1.5px] text-left
                  ${isSelected 
                    ? 'border-[#D4AF37] bg-white shadow-xl scale-105 ring-2 ring-[#D4AF37]/20' 
                    : 'border-transparent bg-white shadow-sm hover:shadow-md hover:-translate-y-2'
                  }
                `}
              >
                {/* Dấu check vàng Champagne khi được chọn */}
                {isSelected && (
                  <div className="absolute top-5 right-5 text-[#D4AF37] animate-fadeIn">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
                
                <h3 className="text-2xl font-serif mb-3 text-[#1A1A1A]">{ctx.title}</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed min-h-[40px]">{ctx.desc}</p>
                
                <div className={`inline-block px-4 py-1.5 text-xs font-semibold tracking-wide rounded-full uppercase transition-colors ${
                  isSelected 
                    ? 'bg-[#D4AF37]/15 text-[#8C7320]' 
                    : 'bg-gray-100/80 text-gray-600'
                }`}>
                  {ctx.vibe}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút Call To Action */}
        <div className="text-center pt-4">
          <button 
            type="button"
            onClick={handleProceed}
            disabled={!selectedContext}
            className={`px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 cursor-pointer shadow-sm
              ${selectedContext 
                ? 'bg-[#1A1A1A] text-white shadow-lg hover:bg-black hover:shadow-xl hover:scale-105 active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
              }
            `}
          >
            Vào Phòng Thay Đồ
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingScreen;
