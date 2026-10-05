import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RemixStudio } from './components/RemixStudio';
import { HeritageStory } from './components/HeritageStory';
import { HeritageMap } from './components/HeritageMap';
import { TaboosGuideModal } from './components/TaboosGuideModal';
import { CourtQuizModal } from './components/CourtQuizModal';
import { SoundToggle } from './components/SoundToggle';
import { OnboardingScreen } from './components/OnboardingScreen';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [selectedContext, setSelectedContext] = useState<string>('heritage');
  const [activeTab, setActiveTab] = useState<'remix' | 'story' | 'map'>('remix');
  const [isTaboosModalOpen, setIsTaboosModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);

  // Màn hình mở đầu Onboarding Acubi / Quiet Luxury
  if (isOnboarding) {
    return (
      <div className="relative">
        <OnboardingScreen
          initialContext={selectedContext}
          onNext={(contextId) => {
            setSelectedContext(contextId);
            setIsOnboarding(false);
          }}
        />
        {/* Floating Sound Toggle Button (Web Audio API) */}
        <SoundToggle variant="floating" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#f5f2eb] flex flex-col font-sans selection:bg-[#c5a059]/30 selection:text-[#faedd0]">
      {/* Top Bar (Single-row 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenTaboosModal={() => setIsTaboosModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        currentContext={selectedContext}
        onChangeContext={() => setIsOnboarding(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'remix' && (
          <RemixStudio 
            initialContext={selectedContext}
            onChangeContext={() => setIsOnboarding(true)}
          />
        )}
        {activeTab === 'story' && <HeritageStory />}
        {activeTab === 'map' && <HeritageMap />}
      </main>

      {/* Heritage Citation Footer */}
      <footer className="w-full border-t border-[#1f1f28] bg-[#09090d] py-10 mt-16 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="font-royal font-bold text-stone-300">Việt Phục Remix</span>
            <span>·</span>
            <span>Stylist Cổ Phục Viễn Đông &copy; 2026</span>
          </div>

          <div className="text-center sm:text-right text-stone-500 text-[11px] leading-relaxed">
            Dựa trên tư liệu <em className="text-stone-400">Khâm Định Đại Nam Hội Điển Sự Lệ</em> & Di sản Y quan Triều Nguyễn.
          </div>
        </div>
      </footer>

      {/* Taboos Engine Modal */}
      <TaboosGuideModal
        isOpen={isTaboosModalOpen}
        onClose={() => setIsTaboosModalOpen(false)}
      />

      {/* Court Taboo Quiz Modal */}
      <CourtQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* Floating Sound Toggle Button (Web Audio API) */}
      <SoundToggle variant="floating" />
    </div>
  );
}
