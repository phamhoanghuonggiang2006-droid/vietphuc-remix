import React, { useState } from 'react';
import { HERITAGE_STORIES, COURT_TABOO_QUIZ, HeritageQuizOption } from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import { 
  playDanTranhTabSound, 
  playButtonClinkSound, 
  playGarmentSelectSound, 
  playCourtBrassSound 
} from '../utils/soundEffects';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  Flame, 
  Check, 
  X,
  Compass,
  Layers,
  CircleDot,
  Crown,
  Waves,
  AlertTriangle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export interface HeritageStoryProps {
  currentContext?: 'heritage' | 'modern' | 'fusion';
  onGoToRemix?: () => void;
}

export const HeritageStory: React.FC<HeritageStoryProps> = ({ 
  currentContext = 'heritage',
  onGoToRemix
}) => {
  const isModern = currentContext === 'modern';
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-5-panels');
  const [interactiveHotspot, setInteractiveHotspot] = useState<string>('panels');
  const [activeGarmentTab, setActiveGarmentTab] = useState<'ngu_than' | 'nhat_binh'>('ngu_than');

  // Interactive Quiz states
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(100);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<HeritageQuizOption | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const activeStoryIndex = HERITAGE_STORIES.findIndex(s => s.id === selectedStoryId);
  const activeStory = HERITAGE_STORIES[activeStoryIndex >= 0 ? activeStoryIndex : 0];
  const currentQuiz = COURT_TABOO_QUIZ[quizIdx];

  const handleSelectHotspot = (hotspot: string) => {
    playButtonClinkSound();
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

  const handleSelectStory = (storyId: string) => {
    playDanTranhTabSound();
    setSelectedStoryId(storyId);
    if (storyId === 'story-phuong-o' || storyId === 'story-thuy-ba') {
      setActiveGarmentTab('nhat_binh');
      setInteractiveHotspot(storyId === 'story-phuong-o' ? 'pattern' : 'panels');
    } else {
      setActiveGarmentTab('ngu_than');
      if (storyId === 'story-5-panels') setInteractiveHotspot('panels');
      else if (storyId === 'story-5-buttons') setInteractiveHotspot('buttons');
      else if (storyId === 'story-don-y') setInteractiveHotspot('collar');
      else setInteractiveHotspot('pattern');
    }
  };

  const handleSwitchGarmentTab = (tab: 'ngu_than' | 'nhat_binh') => {
    playDanTranhTabSound();
    setActiveGarmentTab(tab);
    if (tab === 'nhat_binh') {
      setSelectedStoryId('story-phuong-o');
      setInteractiveHotspot('pattern');
    } else {
      setSelectedStoryId('story-5-panels');
      setInteractiveHotspot('panels');
    }
  };

  const getStoryIcon = (name: string) => {
    const iconColor = isModern ? 'text-[#8a6825]' : 'text-[#c5a059]';
    switch (name) {
      case 'Shield': return <ShieldCheck className={`w-5 h-5 ${iconColor}`} />;
      case 'CircleDot': return <CircleDot className={`w-5 h-5 ${iconColor}`} />;
      case 'Crown': return <Crown className={`w-5 h-5 ${iconColor}`} />;
      case 'Waves': return <Waves className={`w-5 h-5 ${iconColor}`} />;
      case 'Sparkles': return <Sparkles className={`w-5 h-5 ${iconColor}`} />;
      default: return <BookOpen className={`w-5 h-5 ${iconColor}`} />;
    }
  };

  const handleSelectQuizOption = (opt: HeritageQuizOption) => {
    if (selectedOpt !== null) return;
    if (opt.isCorrect) {
      playButtonClinkSound();
    } else {
      playCourtBrassSound();
    }
    setSelectedOpt(opt);
    setScoreDelta(opt.pointsChange);
    setQuizScore(prev => Math.max(0, prev + opt.pointsChange));
    if (opt.isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setShowPopup(true);
  };

  const handleNextQuizQuestion = () => {
    playDanTranhTabSound();
    setShowPopup(false);
    setSelectedOpt(null);
    setScoreDelta(null);

    if (quizIdx < COURT_TABOO_QUIZ.length - 1) {
      setQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // If completed with score >= 100, grant Slay Boost buff in localStorage
      if (quizScore >= 100) {
        try {
          localStorage.setItem('heritstyle_slay_boost', 'true');
        } catch {
          // ignore
        }
      }
    }
  };

  const handleResetQuiz = () => {
    playDanTranhTabSound();
    setQuizIdx(0);
    setQuizScore(100);
    setScoreDelta(null);
    setSelectedOpt(null);
    setShowPopup(false);
    setQuizFinished(false);
    setCorrectAnswers(0);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className={`relative border-b pb-6 pt-2 ${isModern ? 'border-stone-300' : 'border-[#24242d]'}`}>
        <div className={`text-xs font-medium tracking-wide mb-1 ${isModern ? 'text-[#8a6825] font-semibold' : 'text-[#c5a059]'}`}>
          Di Sản Story · Tri Thức Cung Đình
        </div>
        <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
          Ý Nghĩa Triết Lý Y Quan Triều Nguyễn
        </h1>
        <p className={`mt-2 text-sm max-w-2xl leading-relaxed ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>
          Giải mã 5 thân áo, 5 cúc Ngũ Thường, hoa văn Phượng Ổ, Thủy Ba Tam Sơn bằng góc nhìn trẻ trung, dí dỏm nhưng chuẩn mực nghiên cứu lịch sử.
        </p>
      </div>

      {/* ======================================================== */}
      {/* BỐ CỤC 2 CỘT TƯƠNG TỰ BẢN ĐỒ CỔ PHỤC */}
      {/* CỘT TRÁI (CỐ ĐỊNH): KHÁM PHÁ CHI TIẾT TRÊN THÂN ÁO & BÀI ĐỌC */}
      {/* CỘT PHẢI: KHO TÀI LIỆU VĂN HÓA (6 QUY TẮC CỐT LÕI) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BOX CỐ ĐỊNH "KHÁM PHÁ CHI TIẾT TRÊN THÂN ÁO" (6 Cols) */}
        <div className={`lg:col-span-6 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 space-y-5 border ${
          isModern ? 'bg-white/90 border-stone-200/90 shadow-md backdrop-blur-md' : 'bg-[#141419] border-[#23232c] shadow-xl'
        }`}>
          {/* Header & Garment Switcher */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 ${
            isModern ? 'border-stone-200' : 'border-[#202028]'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`} />
                <h3 className={`text-base font-bold ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
                  Khám Phá Chi Tiết Trên Thân Áo
                </h3>
              </div>
              <span className={`text-[11px] block mt-0.5 ${isModern ? 'text-stone-500' : 'text-stone-400'}`}>
                Chạm vào điểm tròn trên áo hoặc bấm chọn quy tắc bên phải
              </span>
            </div>

            {/* Garment Switcher */}
            <div className={`flex items-center p-1 rounded-xl border shrink-0 ${
              isModern ? 'bg-stone-100 border-stone-200' : 'bg-[#0d0d12] border-[#242430]'
            }`}>
              <button
                onClick={() => handleSwitchGarmentTab('ngu_than')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeGarmentTab === 'ngu_than'
                    ? 'bg-[#c5a059] text-[#0d0d12] shadow-xs'
                    : isModern ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Áo Ngũ Thân
              </button>
              <button
                onClick={() => handleSwitchGarmentTab('nhat_binh')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeGarmentTab === 'nhat_binh'
                    ? 'bg-[#c5a059] text-[#0d0d12] shadow-xs'
                    : isModern ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Áo Nhật Bình
              </button>
            </div>
          </div>

          {/* Interactive Robe Visualizer */}
          <div className="flex flex-col items-center justify-center py-1">
            <RobeVisualizer
              type={activeGarmentTab === 'ngu_than' ? 'ngu_than' : 'nhat_binh'}
              primaryColor={activeGarmentTab === 'ngu_than' ? '#1e3a5f' : '#7a1f2b'}
              hasDonY={true}
              buttonType="btn-metal-copper"
              interactive={true}
              activeHotspot={interactiveHotspot}
              onSelectHotspot={handleSelectHotspot}
            />
            <div className={`text-[11px] mt-2 flex items-center gap-1.5 ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping" />
              <span>Điểm tròn vàng tương tác: Bấm điểm trên áo hoặc click bài viết bên phải để đọc</span>
            </div>
          </div>

          {/* BÀI ĐỌC CHI TIẾT TRONG BOX (Được cập nhật khi click bất kỳ bài nào) */}
          <div className={`p-4 sm:p-5 rounded-xl border space-y-3.5 transition-all duration-300 ${
            isModern 
              ? 'bg-[#FBF9F5] border-stone-200 shadow-xs' 
              : 'bg-[#0f0f14] border-[#242430] shadow-inner'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/30 shrink-0 shadow-sm">
                  {getStoryIcon(activeStory.iconName)}
                </div>
                <div>
                  <span className={`text-[11px] font-semibold tracking-wide uppercase ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>
                    {activeStory.tagline}
                  </span>
                  <h3 className={`text-base font-bold leading-tight ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
                    {activeStory.title}
                  </h3>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/35 font-mono font-bold shrink-0">
                {activeStoryIndex >= 0 ? activeStoryIndex + 1 : 1}/6 QUY TẮC
              </span>
            </div>

            {/* Gen Z Persona Callout */}
            <div className={`p-3 rounded-xl border-l-2 text-xs italic leading-relaxed ${
              isModern ? 'bg-amber-50/90 border-[#8a6825] text-stone-800' : 'bg-[#14141e] border-[#c5a059] text-stone-200'
            }`}>
              {activeStory.genZTone}
            </div>

            {/* Deep Dive Historical Fact */}
            <p className={`text-xs sm:text-sm leading-relaxed ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>
              {activeStory.deepDive}
            </p>

            {/* 3 Key Breakdown Bullets */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t ${
              isModern ? 'border-stone-200' : 'border-[#1e1e28]'
            }`}>
              {activeStory.points.map((pt, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border ${
                  isModern ? 'bg-white border-stone-200 shadow-xs' : 'bg-[#0a0a0e] border-[#1d1d24]'
                }`}>
                  <div className={`text-[11px] font-bold mb-0.5 ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>{pt.label}</div>
                  <div className={`text-[11px] leading-normal ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>{pt.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KHO TÀI LIỆU VĂN HÓA (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* HEADER THEO PHONG CÁCH "NGHI THỨC GIA TIÊN" MÀN HÌNH 1, BỎ CỐ ĐỊNH, BỎ NHẤP NHÁY */}
          <div className={`relative rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 overflow-hidden border ${
            isModern 
              ? 'border-[#8a6825] bg-gradient-to-b from-[#FDFBF7] via-[#F6F0E2] to-[#EAE0CA] ring-2 ring-[#c5a059] shadow-[0_0_20px_rgba(138,104,37,0.22)]' 
              : 'border-[#f5e6c8] bg-gradient-to-b from-[#2d1b10] via-[#1b1008] to-[#120a06] ring-2 ring-[#e5c365] shadow-[0_0_25px_rgba(245,230,200,0.35)]'
          }`}>
            {/* Luồng ánh sáng hoàng gia ấm áp (giống box Nghi Thức Gia Tiên, không nhấp nháy) */}
            <div className={`absolute inset-0 pointer-events-none ${
              isModern 
                ? 'bg-gradient-to-tr from-[#c5a059]/10 via-[#e5c365]/10 to-transparent' 
                : 'bg-gradient-to-tr from-[#e5c365]/12 via-[#faedd0]/15 to-transparent'
            }`} />

            {/* Bóng mờ biểu tượng cổ */}
            <div className="absolute right-3 -bottom-2 text-7xl select-none pointer-events-none opacity-10">
              ⛩️
            </div>

            <div className="relative z-10">
              {/* Header Thẻ: Tag + Điển Lễ Tri Thức */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border shadow-sm ${
                  isModern
                    ? 'bg-[#8a6825] text-white border-[#c5a059]'
                    : 'bg-[#e5c365] text-stone-950 border-[#f5e6c8]'
                }`}>
                  KHO TÀI LIỆU VĂN HÓA
                </span>
                <span className={`font-serif font-black text-xs ${
                  isModern ? 'text-[#8a6825]' : 'text-[#D4AF37]/85'
                }`}>
                  Điển Lễ Tri Thức #6
                </span>
              </div>

              {/* Tiêu đề Cuộn */}
              <h2 className={`text-2xl sm:text-[28px] md:text-3xl font-serif font-bold tracking-wide mt-2 leading-snug ${
                isModern ? 'text-stone-900' : 'text-[#faedd0]'
              }`}>
                6 Quy Tắc Cốt Lõi Định Hình Bản Sắc
              </h2>
              <div className={`text-xs font-serif mt-1 ${
                isModern ? 'text-[#8a6825]' : 'text-[#e5c365]/90'
              }`}>
                Cung Đình Khâm Định · Tinh Hoa Điển Chế
              </div>

              {/* Đoạn mô tả */}
              <p className={`text-xs sm:text-sm mt-2.5 leading-relaxed ${
                isModern ? 'text-stone-700' : 'text-[#faedd0]/80'
              }`}>
                Bấm chọn từng bài viết để nạp tri thức và xem vị trí minh họa chi tiết trên thân áo bên trái.
              </p>

              {/* Thanh trạng thái dưới cùng giống box Nghi Thức Gia Tiên */}
              <div className={`flex items-center justify-between pt-3 mt-3.5 border-t text-[11px] font-serif ${
                isModern 
                  ? 'border-[#8a6825]/25 text-[#8a6825]' 
                  : 'border-[#D4AF37]/25 text-[#e5c365]'
              }`}>
                <span>✦ 6 Quy Tắc Cung Đình Khâm Định</span>
                <span className={`font-mono ${isModern ? 'text-stone-600' : 'text-[#faedd0]/70'}`}>
                  100% Chuẩn Di Sản
                </span>
              </div>
            </div>
          </div>

          {/* 6 Story Cards (Cuộn mượt mà, ẩn thanh cuộn đen, không bị lẹm biên trái) */}
          <div className="space-y-3.5 max-h-[calc(100vh-21rem)] overflow-y-auto no-scrollbar p-1">
            {HERITAGE_STORIES.map((story, idx) => {
              const isSelected = selectedStoryId === story.id;
              return (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(story.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? isModern
                        ? 'bg-white border-[#8a6825] ring-2 ring-[#8a6825]/40 shadow-lg'
                        : 'bg-[#1a1a23] border-[#c5a059] shadow-[0_4px_25px_rgba(197,160,89,0.25)] ring-1 ring-[#c5a059]'
                      : isModern
                      ? 'bg-white/80 border-stone-200/90 hover:border-stone-400 hover:bg-white shadow-xs'
                      : 'bg-[#141418] border-[#22222a] hover:border-[#383848] hover:bg-[#171720]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* ICON GIỮ NGUYÊN, KHÔNG ĐỔI MÀU, KHÔNG MẤT LINE BÊN TRÁI HÌNH CHỮ NHẬT */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                          isModern
                            ? 'bg-[#8a6825]/10 text-[#8a6825] border-[#8a6825]/30'
                            : 'bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/30'
                        }`}>
                          {getStoryIcon(story.iconName)}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                          isSelected 
                            ? (isModern ? 'text-[#8a6825]' : 'text-[#e5c365]') 
                            : (isModern ? 'text-stone-500' : 'text-stone-400')
                        }`}>
                          Quy tắc 0{idx + 1} · {story.tagline}
                        </span>
                      </div>
                      
                      {/* CHỮ "Đang đọc" VÀ "Nhấp để đọc" VÀNG ĐẬM CÓ GLOWING NHẸ, KHÔNG BỊ XUỐNG DÒNG */}
                      {isSelected ? (
                        <span className="text-xs px-3 py-1 rounded-full bg-[#c5a059]/25 text-[#FFD700] font-bold border border-[#FFD700]/60 flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.55)] animate-pulse">
                          <span>📖</span>
                          <span className="tracking-wide">Đang đọc</span>
                        </span>
                      ) : (
                        <span className={`text-xs font-bold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                          isModern 
                            ? 'text-[#8a6825] drop-shadow-[0_0_4px_rgba(138,104,37,0.3)] hover:text-[#b8860b]' 
                            : 'text-[#e5c365] drop-shadow-[0_0_6px_rgba(229,195,101,0.4)] hover:text-[#ffd700]'
                        }`}>
                          <span>Nhấp để đọc</span>
                          <span>→</span>
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm sm:text-base font-bold leading-snug ${
                      isSelected 
                        ? (isModern ? 'text-[#8a6825]' : 'text-[#f5f2eb]') 
                        : (isModern ? 'text-stone-900 font-royal' : 'text-[#ede8dc]')
                    }`}>
                      {story.title}
                    </h4>

                    <p className={`text-xs leading-relaxed line-clamp-2 ${isModern ? 'text-stone-600' : 'text-stone-300'}`}>
                      {story.deepDive}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 3: QUICK 1-MINUTE CULTURAL KNOWLEDGE CHECK */}
      <div className={`rounded-xl p-5 sm:p-6 space-y-5 border ${
        isModern ? 'bg-white/85 border-stone-200/90 shadow-sm' : 'bg-[#141418] border-[#2a241e]'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
          isModern ? 'border-stone-200' : 'border-[#24201a]'
        }`}>
          <div>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isModern ? 'text-[#8a6825]' : 'text-[#e5c365]'}`}>
              <Award className="w-4 h-4" />
              <span>Thử thách 1 phút</span>
            </div>
            <h3 className={`text-lg font-bold mt-0.5 ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
              Check Xem Bạn Có Phạm Húy Triều Đình?
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`text-xs ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>
              Điểm số: <span className={`font-bold ${isModern ? 'text-[#8a6825]' : 'text-[#e5c365]'}`}>{quizScore}đ</span>
            </div>
            {!quizFinished && (
              <div className={`text-xs ${isModern ? 'text-stone-500' : 'text-stone-400'}`}>
                Câu hỏi: {quizIdx + 1} / {COURT_TABOO_QUIZ.length}
              </div>
            )}
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-4 pt-1">
            <div className={`p-4 rounded-xl border space-y-1 ${
              isModern ? 'bg-[#FAF7F0] border-stone-200' : 'bg-[#0e0e13] border-[#26201a]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>
                <span>Câu hỏi {currentQuiz.questionNumber}: {currentQuiz.scenarioContext}</span>
              </div>
              <p className={`text-sm font-bold mt-1 leading-relaxed ${isModern ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                {currentQuiz.question}
              </p>
            </div>

            <div className="space-y-2.5">
              {currentQuiz.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={selectedOpt !== null}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isModern
                      ? 'bg-white border-stone-200 hover:border-[#8a6825] text-stone-800 hover:text-stone-950 shadow-xs'
                      : 'bg-[#101015] border-[#242430] hover:border-[#c5a059]/60 text-stone-200 hover:text-white'
                  }`}
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${isModern ? 'text-stone-400' : 'text-stone-500'}`} />
                </button>
              ))}
            </div>

            {/* Instruction tooltip */}
            <div className={`text-[11px] italic ${isModern ? 'text-stone-500' : 'text-stone-400'}`}>
              💡 Bấm chọn đáp án để xem phản hồi và đánh giá từ Stylist Cổ Phục Viễn Đông!
            </div>
          </div>
        ) : (
          /* Gamified Quiz Certificate & Digital Badge */
          <div className="py-6 sm:py-8 space-y-6 animate-fadeIn">
            <div className={`p-6 sm:p-8 rounded-2xl border-2 relative overflow-hidden text-center space-y-5 max-w-xl mx-auto shadow-2xl ${
              isModern 
                ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-[#8a6825]/40 text-stone-900' 
                : 'bg-gradient-to-b from-[#181822] via-[#121218] to-[#0d0d12] border-[#c5a059]/60 text-[#f5f2eb]'
            }`}>
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#c5a059] text-xs opacity-60">❖</div>
              <div className="absolute top-2 right-2 text-[#c5a059] text-xs opacity-60">❖</div>
              <div className="absolute bottom-2 left-2 text-[#c5a059] text-xs opacity-60">❖</div>
              <div className="absolute bottom-2 right-2 text-[#c5a059] text-xs opacity-60">❖</div>

              {/* Royal Badge Crown */}
              <div className="relative inline-block mx-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#e5c365] text-[#0d0d10] mx-auto flex items-center justify-center text-3xl shadow-xl ring-4 ring-[#c5a059]/30 animate-bounce">
                  👑
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                  {quizScore} ĐIỂM
                </span>
              </div>
              
              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#c5a059] block mb-1">
                  CHỨNG CHỈ KHẢO THÍ Y QUAN TRIỀU NGUYỄN
                </span>
                <h4 className={`text-xl sm:text-2xl font-bold font-royal tracking-tight ${isModern ? 'text-[#8a6825]' : 'text-[#f5f2eb]'}`}>
                  {quizScore >= 110
                    ? 'Trạng Nguyên Y Quan Triều Nguyễn 👑'
                    : quizScore >= 90
                    ? 'Bảng Nhãn Y Quan Triều Nguyễn 📜'
                    : 'Sĩ Tử Cần Ôn Lại Taboos 📚'}
                </h4>
                <p className={`text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>
                  {quizScore >= 100
                    ? '“Đỉnh nóc kịch trần luôn bạn hiền ơi! Kiến thức y quan của người đẹp thuộc hàng học sĩ uyên bác, thấu suốt điển lệ Khâm Định Đại Nam, phối đồ tự tin không sợ phạm húy!”'
                    : '“Kiến thức rất đáng khen nha bạn hiền! Hãy nhớ các quy tắc vàng: cúc áo khuy rời kim loại/ngọc, bắt buộc Áo Đơn Y và tránh sắc Vàng Minh Hoàng nhé!”'}
                </p>
              </div>

              {/* UNLOCKED SLAY BUFF REWARD CARD */}
              {quizScore >= 100 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#c5a059]/25 via-amber-500/15 to-[#c5a059]/20 border border-[#c5a059]/60 text-left space-y-1.5 shadow-md animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚡</span>
                    <span className="text-xs font-bold text-[#e5c365] uppercase tracking-wider">
                      ĐẶC QUYỀN ĐÃ KÍCH HOẠT: +10% SLAY SCORE BUFF!
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed pl-5">
                    Huy hiệu danh giá đã được lưu vào hệ thống! Mọi bộ outfit bạn phối trong <strong>Remix Studio</strong> sẽ tự động nhận thêm <strong>+10 điểm Thần Thái & Di Sản</strong> kèm hiệu ứng viền vàng hoàng triều.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onGoToRemix && quizScore >= 100 && (
                  <button
                    onClick={onGoToRemix}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold font-royal bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-[#0d0d10] hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Vào Studio Sử Dụng Buff +10%</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleResetQuiz}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold border transition-colors inline-flex items-center justify-center gap-2 cursor-pointer ${
                    isModern
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                      : 'bg-[#1f1f28] hover:bg-[#282834] text-stone-200 border-[#2d2d3a]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khảo thí lại</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP FEEDBACK DIALOG (Green for correct, Red for warning) */}
        {showPopup && selectedOpt && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div
              className={`rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 border shadow-2xl animate-scaleUp ${
                selectedOpt.isCorrect
                  ? 'bg-[#0f1f18] border-emerald-500/80 shadow-emerald-950/60'
                  : 'bg-[#261014] border-rose-500/80 shadow-rose-950/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    selectedOpt.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  }`}
                >
                  {selectedOpt.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      selectedOpt.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {selectedOpt.isCorrect
                      ? `+${selectedOpt.pointsChange} ĐIỂM`
                      : `${selectedOpt.pointsChange} ĐIỂM`}
                  </span>
                  <h4
                    className={`text-lg sm:text-xl font-bold mt-0.5 tracking-tight ${
                      selectedOpt.isCorrect ? 'text-emerald-200' : 'text-rose-200'
                    }`}
                  >
                    {selectedOpt.badgeTitle}
                  </h4>
                </div>
              </div>

              {/* Cultural Explanation */}
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  selectedOpt.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                    : 'bg-rose-950/50 border-rose-500/30 text-rose-100'
                }`}
              >
                {selectedOpt.culturalExplanation}
              </div>

              {/* Stylist Quote */}
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed italic ${
                  selectedOpt.isCorrect
                    ? 'bg-black/30 border-emerald-500/20 text-[#faedd0]'
                    : 'bg-black/40 border-rose-500/20 text-[#fde2e4]'
                }`}
              >
                <span className="font-bold not-italic block mb-0.5 text-[#e5c365]">
                  Stylist Cổ Phục Viễn Đông nhắn nhủ:
                </span>
                “{selectedOpt.stylistFeedback}”
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuizQuestion}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    selectedOpt.isCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                      : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0e0e12]'
                  }`}
                >
                  <span>{quizIdx < COURT_TABOO_QUIZ.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
