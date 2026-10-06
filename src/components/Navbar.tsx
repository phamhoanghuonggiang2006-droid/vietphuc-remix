import React from 'react';
import { playDanTranhTabSound } from '../utils/soundEffects';
import { SoundToggle } from './SoundToggle';

interface NavbarProps {
  activeTab: 'remix' | 'story' | 'map';
  onSelectTab: (tab: 'remix' | 'story' | 'map') => void;
  onOpenTaboosModal: () => void;
  onOpenQuizModal?: () => void;
  currentContext?: string;
  onChangeContext?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTaboosModal,
  onOpenQuizModal,
  currentContext,
  onChangeContext
}) => {
  const handleTabChange = (tab: 'remix' | 'story' | 'map') => {
    if (tab !== activeTab) {
      playDanTranhTabSound();
    }
    onSelectTab(tab);
  };

  const contextLabels: Record<string, { label: string; icon: string }> = {
    heritage: { label: 'Chốn Tôn Nghiêm', icon: '⛩️' },
    modern: { label: 'Thanh Lịch Đời Thường', icon: '🍃' },
    fusion: { label: 'Phố Thị Phá Cách', icon: '⚡' }
  };

  const currentCtxData = currentContext ? contextLabels[currentContext] : null;

  const isModern = currentContext === 'modern';

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors duration-500 backdrop-blur-md border-b ${
      isModern
        ? 'bg-white/85 border-stone-200/90 text-stone-800 shadow-xs'
        : 'bg-[#0e0e12]/90 border-[#22222b] text-[#f5f2eb]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => handleTabChange('remix')}
          className={`text-lg md:text-xl font-royal font-bold tracking-tight transition-colors whitespace-nowrap cursor-pointer ${
            isModern 
              ? 'text-stone-900 hover:text-[#3B5938]' 
              : 'text-[#f5f2eb] hover:text-[#c5a059]'
          }`}
        >
          Việt Phục Remix
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-6 md:gap-8 text-xs md:text-sm font-medium">
          <button
            onClick={() => handleTabChange('remix')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'remix'
                ? (isModern ? 'text-[#2E482B] font-bold' : 'text-[#c5a059] font-semibold')
                : (isModern ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            Stylist Remix
            {activeTab === 'remix' && (
              <span className={`absolute bottom-0 left-0 w-full h-[2px] ${
                isModern ? 'bg-[#5C715E]' : 'bg-[#c5a059]'
              }`} />
            )}
          </button>

          <button
            onClick={() => handleTabChange('story')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'story'
                ? (isModern ? 'text-[#2E482B] font-bold' : 'text-[#c5a059] font-semibold')
                : (isModern ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            Di Sản Story
            {activeTab === 'story' && (
              <span className={`absolute bottom-0 left-0 w-full h-[2px] ${
                isModern ? 'bg-[#5C715E]' : 'bg-[#c5a059]'
              }`} />
            )}
          </button>

          <button
            onClick={() => handleTabChange('map')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'map'
                ? (isModern ? 'text-[#2E482B] font-bold' : 'text-[#c5a059] font-semibold')
                : (isModern ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            Bản Đồ Cổ Phục
            {activeTab === 'map' && (
              <span className={`absolute bottom-0 left-0 w-full h-[2px] ${
                isModern ? 'bg-[#5C715E]' : 'bg-[#c5a059]'
              }`} />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle (Web Audio API) */}
          <SoundToggle variant="navbar" />

          {/* Quick Context Switcher */}
          {onChangeContext && currentCtxData && (
            <button
              onClick={onChangeContext}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all hidden lg:inline-flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isModern
                  ? 'bg-stone-100/90 hover:bg-stone-200 text-stone-700 border border-stone-300/80'
                  : 'bg-[#181822] hover:bg-[#232332] text-stone-300 border border-[#D4AF37]/35 hover:border-[#D4AF37]'
              }`}
              title="Nhấn để đổi bối cảnh tỏa sáng (Chốn Tôn Nghiêm / Thanh Lịch Đời Thường / Phố Thị Phá Cách)"
            >
              <span>{currentCtxData.icon}</span>
              <span className={`font-serif font-semibold ${
                isModern ? 'text-[#2E482B]' : 'text-[#D4AF37]'
              }`}>
                {currentCtxData.label}
              </span>
            </button>
          )}

          {onOpenQuizModal && (
            <button
              onClick={onOpenQuizModal}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap hidden md:inline-flex items-center gap-1.5 cursor-pointer ${
                isModern
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/70'
                  : 'bg-[#261015] hover:bg-[#34161d] text-rose-200 border border-rose-500/40'
              }`}
            >
              <span>👑 Check Phạm Húy</span>
            </button>
          )}

          <button
            onClick={onOpenTaboosModal}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 cursor-pointer ${
              isModern
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                : 'bg-[#181822] hover:bg-[#222230] text-[#e5c365] border border-[#38384d]'
            }`}
          >
            <span>Quy Chuẩn Taboos</span>
          </button>

          <button
            onClick={() => handleTabChange('remix')}
            className={`px-3.5 py-1.5 text-xs font-royal font-bold rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer ${
              isModern
                ? 'bg-[#8BA888] hover:bg-[#72946F] text-white shadow-xs'
                : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0e0e12]'
            }`}
          >
            Tạo Outfit
          </button>
        </div>

      </div>
    </header>
  );
};
