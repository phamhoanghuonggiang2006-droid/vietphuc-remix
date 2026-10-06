import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RemixStudio } from './components/RemixStudio';
import { HeritageStory } from './components/HeritageStory';
import { HeritageMap } from './components/HeritageMap';
import { TaboosGuideModal } from './components/TaboosGuideModal';
import { CourtQuizModal } from './components/CourtQuizModal';
import { SoundToggle } from './components/SoundToggle';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [selectedContext, setSelectedContext] = useState<string>('heritage');
  const [activeTab, setActiveTab] = useState<'remix' | 'story' | 'map'>('remix');
  const [isTaboosModalOpen, setIsTaboosModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);

  // Màn hình mở đầu Onboarding (Chọn bối cảnh)
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

  const isModern = selectedContext === 'modern';

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-500 ${
      isModern
        ? 'bg-[#FAF8F5] text-[#2A2A2E] selection:bg-[#8BA888]/30 selection:text-[#1F331D]'
        : 'bg-[#0e0e12] text-[#f5f2eb] selection:bg-[#c5a059]/30 selection:text-[#faedd0]'
    }`}>
      {/* ======================================================== */}
      {/* HỆ THỐNG NỀN THÍCH ỨNG THEO BỐI CẢNH (CỔ PHONG VS ACUBI QUIET LUXURY) */}
      {/* ======================================================== */}
      {isModern ? (
        <>
          {/* MÀN HÌNH 2: NỀN TRẮNG NGÀ / BE SÁNG / GIẤY DÓ MỸ THUẬT & ÁNH SÁNG STUDIO */}
          {/* Lớp 1: Gradient Tạp Chí Thời Trang (Off-white / Warm Beige) */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EB] to-[#E9E4DB]"
          />

          {/* Lớp 2: Gợn sớ lụa & giấy dó sáng màu mộc mạc */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] mix-blend-multiply"
            style={{
              backgroundImage: 'url(/patterns/so-lua-giay-do.svg)',
              backgroundSize: '48px 48px',
              backgroundRepeat: 'repeat'
            }}
          />

          {/* Lớp 3: Ánh sáng Studio Tự Nhiên (Natural Soft Key Lighting) */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.95)_0%,rgba(244,241,235,0.5)_50%,rgba(224,218,208,0.45)_100%)]"
          />
        </>
      ) : (
        <>
          {/* MÀN HÌNH 1: NỀN VÂN MÂY CUNG ĐÌNH + SỚ LỤA ĐEN & GIẤY DÓ CỔ TRUYỀN (OPACITY 7-8%) */}
          {/* Lớp 1: Họa tiết Vân Mây Cung Đình Ngũ Sắc thêu chỉ kim tuyến */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-screen"
            style={{
              backgroundImage: 'url(/patterns/van-may-cung-dinh.jpg)',
              backgroundSize: '580px auto',
              backgroundPosition: 'top center',
              backgroundRepeat: 'repeat'
            }}
          />

          {/* Lớp 2: Sớ Vải Lụa Đen & Giấy Dó Nhuộm Tối */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage: 'url(/patterns/so-lua-giay-do.svg)',
              backgroundSize: '48px 48px',
              backgroundRepeat: 'repeat'
            }}
          />

          {/* Lớp 3: Hiệu ứng Chiều sâu Sơn Mài Cố Đô */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_30%,transparent_20%,rgba(14,14,18,0.45)_65%,rgba(10,10,14,0.85)_100%)]"
          />
        </>
      )}

      {/* Top Bar (Single-row 3-zone contract) */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
          onOpenTaboosModal={() => setIsTaboosModalOpen(true)}
          onOpenQuizModal={() => setIsQuizModalOpen(true)}
          currentContext={selectedContext}
          onChangeContext={() => setIsOnboarding(true)}
        />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-30">
        {activeTab === 'remix' && (
          <ErrorBoundary>
            <RemixStudio 
              initialContext={selectedContext}
              onChangeContext={() => setIsOnboarding(true)}
              onContextSwitch={(newCtx) => setSelectedContext(newCtx)}
            />
          </ErrorBoundary>
        )}
        {activeTab === 'story' && <HeritageStory />}
        {activeTab === 'map' && <HeritageMap />}
      </main>

      {/* Heritage Citation Footer */}
      <footer className={`w-full border-t py-10 mt-16 text-xs relative z-10 transition-colors ${
        isModern
          ? 'border-stone-200/90 bg-white/70 text-stone-500'
          : 'border-[#1f1f28] bg-[#09090d] text-stone-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-600">
            <span className={`font-royal font-bold ${isModern ? 'text-stone-900' : 'text-stone-300'}`}>
              Việt Phục Remix
            </span>
            <span>·</span>
            <span className={isModern ? 'text-stone-600' : 'text-stone-400'}>
              Stylist Cổ Phục Viễn Đông &copy; 2026
            </span>
          </div>

          <div className="text-center sm:text-right text-[11px] leading-relaxed">
            Dựa trên tư liệu <em className={isModern ? 'text-stone-800' : 'text-stone-400'}>Khâm Định Đại Nam Hội Điển Sự Lệ</em> & Di sản Y quan Triều Nguyễn.
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
