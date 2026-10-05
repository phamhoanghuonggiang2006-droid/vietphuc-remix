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

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0e0e12]/90 backdrop-blur-md border-b border-[#22222b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => handleTabChange('remix')}
          className="text-lg md:text-xl font-royal font-bold tracking-tight text-[#f5f2eb] hover:text-[#c5a059] transition-colors whitespace-nowrap cursor-pointer"
        >
          Việt Phục Remix
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-6 md:gap-8 text-xs md:text-sm font-medium">
          <button
            onClick={() => handleTabChange('remix')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'remix'
                ? 'text-[#c5a059] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Stylist Remix
            {activeTab === 'remix' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059]" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('story')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'story'
                ? 'text-[#c5a059] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Di Sản Story
            {activeTab === 'story' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059]" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('map')}
            className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
              activeTab === 'map'
                ? 'text-[#c5a059] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Bản Đồ Cổ Phục
            {activeTab === 'map' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059]" />
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
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#181822] hover:bg-[#232332] text-stone-300 border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all hidden lg:inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Nhấn để đổi bối cảnh tỏa sáng (Chốn Tôn Nghiêm / Thanh Lịch Đời Thường / Phố Thị Phá Cách)"
            >
              <span>{currentCtxData.icon}</span>
              <span className="text-[#D4AF37] font-serif font-semibold">{currentCtxData.label}</span>
            </button>
          )}

          {onOpenQuizModal && (
            <button
              onClick={onOpenQuizModal}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#261015] hover:bg-[#34161d] text-rose-200 border border-rose-500/40 transition-colors whitespace-nowrap hidden md:inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>👑 Check Phạm Húy</span>
            </button>
          )}

          <button
            onClick={onOpenTaboosModal}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#181822] hover:bg-[#222230] text-[#e5c365] border border-[#38384d] transition-colors whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Quy Chuẩn Taboos</span>
          </button>

          <button
            onClick={() => handleTabChange('remix')}
            className="px-3.5 py-1.5 text-xs font-royal font-bold text-[#0e0e12] bg-[#c5a059] hover:bg-[#d8b566] rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer"
          >
            Tạo Outfit
          </button>
        </div>

      </div>
    </header>
  );
};
