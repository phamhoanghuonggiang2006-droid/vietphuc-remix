import React, { useState, useEffect } from 'react';
import { HERITAGE_STORIES } from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  CircleDot, 
  Crown, 
  Waves, 
  Sparkles, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';

export interface HeritageHotspotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentGarmentId?: string;
  currentTier?: 'heritage' | 'modern' | 'fusion';
}

export const HeritageHotspotDrawer: React.FC<HeritageHotspotDrawerProps> = ({
  isOpen,
  onClose,
  currentGarmentId = 'ngu-than-tay-chen',
  currentTier = 'heritage'
}) => {
  const isModern = currentTier === 'modern';
  const isFusion = currentTier === 'fusion';

  const [activeGarmentTab, setActiveGarmentTab] = useState<'ngu_than' | 'nhat_binh'>(
    currentGarmentId === 'ao-nhat-binh' ? 'nhat_binh' : 'ngu_than'
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    currentGarmentId === 'ao-nhat-binh' ? 'story-phuong-o' : 'story-5-panels'
  );
  const [interactiveHotspot, setInteractiveHotspot] = useState<string>('panels');

  useEffect(() => {
    if (currentGarmentId === 'ao-nhat-binh') {
      setActiveGarmentTab('nhat_binh');
      setSelectedStoryId('story-phuong-o');
      setInteractiveHotspot('pattern');
    } else {
      setActiveGarmentTab('ngu_than');
      setSelectedStoryId('story-5-panels');
      setInteractiveHotspot('panels');
    }
  }, [currentGarmentId, isOpen]);

  if (!isOpen) return null;

  const activeStory = HERITAGE_STORIES.find(s => s.id === selectedStoryId) || HERITAGE_STORIES[0];

  const handleSelectHotspot = (hotspot: string) => {
    setInteractiveHotspot(hotspot);
    if (hotspot === 'collar') {
      setSelectedStoryId('story-don-y');
    } else if (hotspot === 'buttons') {
      setSelectedStoryId('story-5-buttons');
    } else if (hotspot === 'panels') {
      setSelectedStoryId('story-5-panels');
    } else if (hotspot === 'pattern') {
      setSelectedStoryId('story-phuong-o');
    }
  };

  const getStoryIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <ShieldCheck className="w-4 h-4 text-[#c5a059]" />;
      case 'CircleDot': return <CircleDot className="w-4 h-4 text-[#c5a059]" />;
      case 'Crown': return <Crown className="w-4 h-4 text-[#c5a059]" />;
      case 'Waves': return <Waves className="w-4 h-4 text-[#c5a059]" />;
      default: return <BookOpen className="w-4 h-4 text-[#c5a059]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className={`w-screen max-w-xl shadow-2xl flex flex-col border-l transition-all animate-slideInRight ${
          isModern
            ? 'bg-[#FAF8F5] border-stone-300 text-stone-900'
            : isFusion
            ? 'bg-[#0e0e14] border-white/10 text-stone-100'
            : 'bg-[#121218] border-[#c5a059]/30 text-[#f5f2eb]'
        }`}>
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
            isModern ? 'border-stone-200 bg-white/70' : 'border-[#22222d] bg-black/40'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#e5c365]" />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'
                }`}>
                  Side-Panel Khám Phá Nhanh
                </span>
                <h3 className="text-sm sm:text-base font-bold font-royal">
                  Triết Lý 5 Thân & Điểm Chạm Y Quan
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isModern
                  ? 'bg-stone-100 border-stone-200 hover:bg-stone-200 text-stone-700'
                  : 'bg-white/5 border-white/10 hover:bg-white/15 text-stone-300 hover:text-white'
              }`}
              title="Đóng bảng trượt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Quick Switcher */}
            <div className={`flex items-center justify-between p-1.5 rounded-xl border ${
              isModern ? 'bg-stone-100 border-stone-200' : 'bg-black/50 border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setActiveGarmentTab('ngu_than');
                  setSelectedStoryId('story-5-panels');
                  setInteractiveHotspot('panels');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGarmentTab === 'ngu_than'
                    ? 'bg-[#c5a059] text-stone-950 shadow-sm'
                    : isModern ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Áo Ngũ Thân
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveGarmentTab('nhat_binh');
                  setSelectedStoryId('story-phuong-o');
                  setInteractiveHotspot('pattern');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGarmentTab === 'nhat_binh'
                    ? 'bg-[#c5a059] text-stone-950 shadow-sm'
                    : isModern ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Áo Nhật Bình
              </button>
            </div>

            {/* Hotspot Instruction */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
              isModern ? 'bg-amber-50/80 border-amber-200 text-stone-800' : 'bg-[#181822] border-[#c5a059]/20 text-[#faedd0]'
            }`}>
              <Info className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span>Chạm vào các chấm tròn vàng nhấp nháy trên áo để giải mã triết lý cổ nhân!</span>
            </div>

            {/* Robe with Interactive Hotspots */}
            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center relative ${
              isModern ? 'bg-stone-50 border-stone-200' : 'bg-[#09090d] border-white/10'
            }`}>
              <div className="w-full max-w-[280px]">
                <RobeVisualizer
                  type={activeGarmentTab === 'ngu_than' ? 'ngu_than' : 'nhat_binh'}
                  primaryColor={activeGarmentTab === 'ngu_than' ? '#1e3a5f' : '#7a1f2b'}
                  hasDonY={true}
                  buttonType="btn-metal-copper"
                  interactive={true}
                  activeHotspot={interactiveHotspot}
                  onSelectHotspot={handleSelectHotspot}
                />
              </div>

              {/* Quick Hotspot Pills */}
              <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectHotspot('collar')}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                    interactiveHotspot === 'collar'
                      ? 'bg-[#c5a059] text-stone-950 font-bold border-transparent shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>1. Cổ Áo Đơn Y</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectHotspot('buttons')}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                    interactiveHotspot === 'buttons'
                      ? 'bg-[#c5a059] text-stone-950 font-bold border-transparent shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>2. 5 Cúc Ngũ Thường</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectHotspot('panels')}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                    interactiveHotspot === 'panels'
                      ? 'bg-[#c5a059] text-stone-950 font-bold border-transparent shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>3. 5 Thân Phụ Mẫu</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectHotspot('pattern')}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                    interactiveHotspot === 'pattern'
                      ? 'bg-[#c5a059] text-stone-950 font-bold border-transparent shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>4. Hoa Văn Hoàng Cung</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Explanation Card */}
            <div className={`p-4 sm:p-5 rounded-xl border space-y-3.5 ${
              isModern ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#15151e] border-[#252535]'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/30 shrink-0">
                  {getStoryIcon(activeStory.iconName)}
                </div>
                <div>
                  <span className={`text-[11px] font-bold block ${
                    isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'
                  }`}>
                    {activeStory.tagline}
                  </span>
                  <h4 className="text-base font-bold font-royal">
                    {activeStory.title}
                  </h4>
                </div>
              </div>

              {/* Gen Z Callout */}
              <div className={`p-3 rounded-lg border-l-2 text-xs italic leading-relaxed ${
                isModern ? 'bg-amber-50/70 border-[#8a6825] text-stone-800' : 'bg-[#111118] border-[#c5a059] text-stone-200'
              }`}>
                {activeStory.genZTone}
              </div>

              {/* Deep Dive */}
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isModern ? 'text-stone-700' : 'text-stone-300'
              }`}>
                {activeStory.deepDive}
              </p>

              {/* Points */}
              <div className={`space-y-2 pt-2 border-t ${
                isModern ? 'border-stone-200' : 'border-white/10'
              }`}>
                {activeStory.points?.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className={isModern ? 'text-stone-900' : 'text-[#e5c365]'}>{pt.label}: </strong>
                      <span className={isModern ? 'text-stone-700' : 'text-stone-300'}>{pt.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with return action */}
          <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
            isModern ? 'border-stone-200 bg-white/70' : 'border-[#22222d] bg-black/40'
          }`}>
            <span className={`text-[11px] ${isModern ? 'text-stone-500' : 'text-stone-400'}`}>
              Trang phục của bạn vẫn giữ nguyên
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-bold text-xs shadow-md hover:brightness-110 cursor-pointer transition-all"
            >
              Tiếp tục phối đồ ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
