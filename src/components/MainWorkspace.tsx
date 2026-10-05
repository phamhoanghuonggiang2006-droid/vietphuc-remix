import React, { useState, useEffect } from 'react';
import { 
  playDanTranhTabSound, 
  playGarmentSelectSound, 
  playFabricRustleSound, 
  playButtonClinkSound, 
  playWoodClogSound, 
  playFanFlutterSound, 
  playBellTingSound,
  playTabooDenialSound
} from '../utils/soundEffects';
import { RobeVisualizer } from './RobeVisualizer';
import { 
  HERITAGE_GARMENTS, 
  TRADITIONAL_COLORS, 
  REMIX_ITEMS,
  HeritageItem 
} from '../data/heritageData';
import {
  GARMENTS,
  INNER_LAYERS,
  BUTTONS,
  BOTTOMS,
  SHOES,
  ACCESSORIES
} from '../data/data.js';
import { Sparkles, Check, Share2, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

export interface MainWorkspaceProps {
  initialContext?: string;
  onBackToOnboarding?: () => void;
  onToggleStudio?: () => void;
}

interface ItemOption {
  id: string;
  name: string;
  sub: string;
  category: 'ao' | 'lot' | 'cuc' | 'quan' | 'giay' | 'phukien';
  img: string;
  realImg?: string;
  colorHex?: string;
  isTaboo?: boolean;
  styleLine?: string;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  initialContext = 'heritage',
  onBackToOnboarding,
  onToggleStudio
}) => {
  const [activeTab, setActiveTab] = useState<'ao' | 'lot' | 'cuc' | 'quan' | 'giay' | 'phukien'>('ao');

  // Selected State
  const [selectedRobeId, setSelectedRobeId] = useState<string>('ngu_than_tay_chen_nu_heritage');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#2B5B84');
  const [hasDonY, setHasDonY] = useState<boolean>(true);
  const [selectedLotId, setSelectedLotId] = useState<string>('layer-don-y-white');
  const [selectedButtonId, setSelectedButtonId] = useState<string>('btn-metal-copper');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('bottom-silk-wide-pants');
  const [selectedShoesId, setSelectedShoesId] = useState<string>('shoes-wooden-clogs');
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('acc-khan-dong');

  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Custom uploaded images from localStorage (if any)
  const [customItemImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_custom_item_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const tabs = [
    { id: 'ao', label: 'Áo Cổ Phục' },
    { id: 'lot', label: 'Áo Lót (Đơn y)' },
    { id: 'cuc', label: 'Khuy Cúc' },
    { id: 'quan', label: 'Thân Dưới' },
    { id: 'giay', label: 'Giày/Guốc' },
    { id: 'phukien', label: 'Phụ Kiện' }
  ] as const;

  // Sync initial presets based on initialContext
  useEffect(() => {
    if (initialContext === 'heritage') {
      setSelectedRobeId('ao_tac_nu_heritage');
      setSelectedColorHex('#7A222C'); // Đỏ Tấc Son
      setHasDonY(true);
      setSelectedLotId('layer-don-y-white');
      setSelectedButtonId('btn-metal-copper');
      setSelectedBottomId('bottom-silk-wide-pants');
      setSelectedShoesId('shoes-wooden-clogs');
      setSelectedAccessoryId('acc-khan-dong');
    } else if (initialContext === 'modern') {
      setSelectedRobeId('ngu_than_modern_nu');
      setSelectedColorHex('#334D3C'); // Xanh Rêu Trầm
      setHasDonY(true);
      setSelectedLotId('layer-don-y-white');
      setSelectedButtonId('btn-wood-agarwood');
      setSelectedBottomId('bottom-linen-wide-pants');
      setSelectedShoesId('shoes-white-sneakers');
      setSelectedAccessoryId('acc-paper-fan');
    } else if (initialContext === 'fusion') {
      setSelectedRobeId('heritage_top_fusion_unisex');
      setSelectedColorHex('#181820'); // Đen Khói Charcoal
      setHasDonY(true);
      setSelectedLotId('layer-tee-graphic-fusion');
      setSelectedButtonId('btn-mother-of-pearl');
      setSelectedBottomId('bottom-cargo-pants');
      setSelectedShoesId('shoes-boots-dr-martens');
      setSelectedAccessoryId('acc-silver-chain-cuban');
    }
  }, [initialContext]);

  // Items database mapped to categories dynamically from data.js
  const categoryItems: Record<'ao' | 'lot' | 'cuc' | 'quan' | 'giay' | 'phukien', ItemOption[]> = {
    ao: GARMENTS.map(item => ({
      id: item.id,
      name: item.name,
      sub: `${item.dynasty} · ${item.materials ? item.materials[0] : ''}`,
      category: 'ao',
      img: item.img || '👘',
      realImg: item.realImg,
      colorHex: item.defaultColorHex,
      styleLine: item.styleLine
    })),
    lot: INNER_LAYERS.map(item => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      category: 'lot',
      img: item.img || '🥼',
      realImg: item.realImg,
      isTaboo: item.isTaboo,
      styleLine: item.styleLine
    })),
    cuc: BUTTONS.map(item => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      category: 'cuc',
      img: item.img || '🪙',
      realImg: customItemImages[item.id] || item.realImg,
      isTaboo: item.isTaboo,
      styleLine: item.styleLine
    })),
    quan: BOTTOMS.map(item => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      category: 'quan',
      img: item.img || '👖',
      realImg: customItemImages[item.id] || item.realImg,
      isTaboo: item.isTaboo,
      styleLine: item.styleLine
    })),
    giay: SHOES.map(item => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      category: 'giay',
      img: item.img || '🪵',
      realImg: customItemImages[item.id] || item.realImg,
      isTaboo: item.isTaboo,
      styleLine: item.styleLine
    })),
    phukien: ACCESSORIES.map(item => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      category: 'phukien',
      img: item.img || '🪭',
      realImg: customItemImages[item.id] || item.realImg,
      isTaboo: item.isTaboo,
      styleLine: item.styleLine
    }))
  };

  // Real-time calculation of Slay & Heritage Scores
  const calculateScores = () => {
    let slay = 82;
    let heritage = 100;

    const isCeremonial = selectedRobeId === 'ao-tac' || selectedRobeId === 'ao-nhat-binh' || selectedRobeId === 'ao-vien-linh';

    // Đơn Y check
    if (!hasDonY) {
      heritage -= 25;
      slay -= 8;
    }

    // Button check
    if (selectedButtonId === 'btn-chinese-cloth') {
      heritage -= 35;
      slay -= 15;
    } else if (selectedButtonId === 'btn-silver-lotus' || selectedButtonId === 'btn-mother-of-pearl') {
      slay += 8;
    }

    // Shoes & Pants
    if (selectedShoesId === 'shoes-white-sneakers') {
      if (isCeremonial) heritage -= 20;
      else heritage -= 5;
      slay += (initialContext === 'fusion' ? 8 : 4);
    } else if (selectedShoesId === 'shoes-chunky-loafers') {
      if (isCeremonial) heritage -= 8;
      slay += 9;
    } else {
      heritage += 5;
      slay += 6;
    }

    if (selectedBottomId === 'bottom-high-waist-jeans') {
      if (isCeremonial) heritage -= 12;
      slay += (initialContext === 'fusion' ? 9 : 5);
    } else {
      slay += 6;
    }

    // Accessory
    if (selectedAccessoryId === 'acc-smartwatch') {
      heritage -= 15;
      slay -= 5;
    } else if (selectedAccessoryId === 'acc-kieng-bac' || selectedAccessoryId === 'acc-khan-dong') {
      slay += 7;
      heritage += 5;
    }

    return {
      slay: Math.min(99, Math.max(35, slay)),
      heritage: Math.min(100, Math.max(20, heritage))
    };
  };

  const scores = calculateScores();

  // Smart tag computation
  const getSmartTag = () => {
    if (selectedButtonId === 'btn-chinese-cloth') {
      return { tag: '[TABOO ALERT]', badge: '⚠️ Vi Phạm Quy Chuẩn Y Quan', color: 'bg-rose-600 text-white', badgeStyle: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (selectedBottomId.includes('cargo') || selectedBottomId.includes('jeans') || selectedBottomId.includes('jorts') || selectedShoesId.includes('dr-martens') || selectedShoesId.includes('skater') || selectedRobeId.includes('fusion')) {
      return { tag: '[FUSION STREETWEAR]', badge: 'Heritage Inspired (Lấy cảm hứng)', color: 'bg-[#1A1A1A] text-white', badgeStyle: 'bg-yellow-100/90 text-yellow-800 border-yellow-200' };
    }
    if (selectedRobeId.includes('tac') || selectedRobeId.includes('nhat_binh_nu_heritage') || selectedRobeId.includes('ao_chau')) {
      return { tag: '[ROYAL CEREMONIAL]', badge: 'Triều Nghi Chuẩn Mực 100%', color: 'bg-[#D4AF37] text-stone-950 font-bold', badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    return { tag: '[QUIET LUXURY TRADITION]', badge: 'Tinh Tế · Chuẩn Cổ Phong', color: 'bg-[#1A1A1A] text-white', badgeStyle: 'bg-emerald-100/90 text-emerald-800 border-emerald-200' };
  };

  const smartTag = getSmartTag();

  // Dynamic AI feedback quote
  const getAiQuote = () => {
    if (selectedButtonId === 'btn-chinese-cloth') {
      return '“Báo động đỏ hú hồn! Áo ngũ thân nước Nam mình xịn sò khuy đồng khuy ngọc Ngũ Thường, sao bạn hiền lại gắn cúc vải Tàu lai căng zậy nè? Đổi sang Cúc Bạc Hoa Sen hoặc Cúc Đồng cho chuẩn gu nào!”';
    }
    if (!hasDonY || selectedLotId === 'layer-none' || selectedLotId === 'lot-none') {
      return '“Outfit rất bén nhưng thiếu mất lớp Áo Đơn Y trắng viền cổ rồi nè! Thêm lớp lót trắng cao hơn 2mm để hoàn thiện cốt cách đoan chính của cổ nhân nhé!”';
    }
    if ((selectedShoesId === 'shoes-white-sneakers' || selectedShoesId.includes('skater')) && (selectedRobeId.includes('tac') || selectedRobeId.includes('nhat'))) {
      return '“Mix Sneaker với Áo Lễ là ra đúng vibe Tet-Core dạo phố cực keo! Nhưng nhớ nha, set đồ này dạo phố thì slay chứ mang vào chốn tôn nghiêm đền chùa là hơi cấn đó!”';
    }
    if (selectedShoesId === 'shoes-chunky-loafers' || selectedBottomId.includes('cargo') || selectedBottomId.includes('jeans')) {
      return '“Keo lỳ hết nước chấm! Sự kết hợp giữa phom áo cổ phong với Chunky Loafers và Thân Dưới cách tân chuẩn chất Modern Sartorial Chic, thần thái ngút ngàn ai cũng phải ngoái nhìn!”';
    }
    if (scores.heritage >= 90) {
      return '“Xuất sắc mười điểm không có nhưng! Bản phối đạt tỷ lệ vàng cổ phong: sắc phục hài hòa, cúc áo chuẩn đạo Ngũ Thường, vừa tôn vinh di sản vừa đậm chất Quiet Luxury!”';
    }
    return '“Bản phối giao thoa cổ kim rất có duyên! Từng chi tiết đều toát lên nét thanh lịch, nhẹ nhàng và đúng chuẩn tinh thần thời trang Gen Z!”';
  };

  const handleItemClick = (item: ItemOption) => {
    if (item.category === 'ao') {
      setSelectedRobeId(item.id);
      if (item.colorHex) setSelectedColorHex(item.colorHex);
      playGarmentSelectSound();
    } else if (item.category === 'lot') {
      const isDonY = item.id.includes('don-y') || item.id === 'lot-don-y';
      setHasDonY(isDonY);
      setSelectedLotId(item.id);
      if (item.isTaboo || item.id.includes('none')) playTabooDenialSound();
      else playFabricRustleSound();
    } else if (item.category === 'cuc') {
      setSelectedButtonId(item.id);
      if (item.id === 'btn-chinese-cloth') playTabooDenialSound();
      else playButtonClinkSound();
    } else if (item.category === 'quan') {
      setSelectedBottomId(item.id);
      playFabricRustleSound();
    } else if (item.category === 'giay') {
      setSelectedShoesId(item.id);
      playWoodClogSound();
    } else if (item.category === 'phukien') {
      setSelectedAccessoryId(item.id);
      if (item.id === 'acc-smartwatch') playTabooDenialSound();
      else playFanFlutterSound();
    }
  };

  const isItemSelected = (item: ItemOption) => {
    if (item.category === 'ao') return selectedRobeId === item.id;
    if (item.category === 'lot') return selectedLotId === item.id;
    if (item.category === 'cuc') return selectedButtonId === item.id;
    if (item.category === 'quan') return selectedBottomId === item.id;
    if (item.category === 'giay') return selectedShoesId === item.id;
    if (item.category === 'phukien') return selectedAccessoryId === item.id;
    return false;
  };

  // Robe SVG Type for Visualizer
  const getRobeSvgType = (): 'ngu_than' | 'ao_tac' | 'nhat_binh' | 'giao_linh' | 'vien_linh' => {
    const id = selectedRobeId.toLowerCase();
    if (id.includes('tac')) return 'ao_tac';
    if (id.includes('nhat') || id.includes('chau') || id.includes('vuong')) return 'nhat_binh';
    if (id.includes('giao')) return 'giao_linh';
    if (id.includes('vien')) return 'vien_linh';
    return 'ngu_than';
  };

  const handleReEvaluate = () => {
    setIsAiAnalyzing(true);
    playBellTingSound();
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setShareToast('✨ AI Stylist đã cập nhật thẩm định outfit!');
      setTimeout(() => setShareToast(null), 3000);
    }, 600);
  };

  const handleShareLookbook = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast('🔗 Đã sao chép link Lookbook thành công!');
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-4 lg:p-8 flex flex-col lg:flex-row gap-8 font-sans text-[#2C302E]">
      
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#D4AF37]/50 text-xs animate-fadeIn backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* CỘT TRÁI: CONTROL PANEL (40% / lg:w-5/12) */}
      <div className="w-full lg:w-5/12 flex flex-col h-auto lg:h-[calc(100vh-4rem)]">
        
        {/* Header với nút quay lại Onboarding và Studio */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-serif text-[#1A1A1A]">Tủ Đồ Cá Nhân</h2>
          <div className="flex items-center gap-2">
            {onToggleStudio && (
              <button
                type="button"
                onClick={onToggleStudio}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 transition-all cursor-pointer shadow-xs"
                title="Chuyển sang Chế độ Studio Cổ Phong Triều Nguyễn"
              >
                <span>🏛️ Studio Cổ Điển</span>
              </button>
            )}
            {onBackToOnboarding && (
              <button
                type="button"
                onClick={onBackToOnboarding}
                className="text-xs font-medium text-stone-500 hover:text-[#1A1A1A] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Đổi bối cảnh</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">Mix & match theo gu của bạn. AI Stylist sẽ tự động chấm điểm.</p>
        
        {/* Thanh Tabs ngang (Cuộn được trên mobile) */}
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2 scrollbar-hide shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playDanTranhTabSound();
              }}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                ${activeTab === tab.id 
                  ? 'bg-[#1A1A1A] text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Danh sách Items (Dạng Grid lưới) */}
        <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {categoryItems[activeTab].map(item => {
              const selected = isItemSelected(item);
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleItemClick(item)}
                  className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer group relative flex flex-col justify-between
                    ${selected 
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md scale-[1.02]' 
                      : 'border-gray-100 hover:border-[#D4AF37]/60 hover:shadow-md hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Selected check badge */}
                  {selected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4AF37] text-stone-950 flex items-center justify-center text-xs font-bold shadow z-10">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Thumbnail / Emoji */}
                  <div className="h-32 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform">
                    {item.realImg ? (
                      <img 
                        src={item.realImg} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-5xl">{item.img}</span>
                    )}

                    {item.isTaboo && (
                      <div className="absolute bottom-2 left-2 right-2 bg-rose-950/80 text-rose-200 text-[10px] px-2 py-0.5 rounded font-semibold text-center border border-rose-500/40">
                        ⚠️ Cảnh Báo Phạm Quy
                      </div>
                    )}
                  </div>

                  <div>
                    {item.styleLine && (
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 w-fit
                        ${item.styleLine === 'heritage_core' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : item.styleLine === 'modern_heritage'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {item.styleLine === 'heritage_core' ? '🏛️ Heritage Core' : item.styleLine === 'modern_heritage' ? '🌿 Modern' : '⚡ Fusion'}
                      </span>
                    )}
                    <h3 className="font-serif text-[#1A1A1A] text-sm font-bold leading-snug line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: LOOKBOOK CANVAS (60% / lg:w-7/12) */}
      <div className="w-full lg:w-7/12 flex flex-col h-auto lg:h-[calc(100vh-4rem)] relative rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Background gradient nhẹ tạo chiều sâu cho Canvas */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 z-0"></div>

        {/* Thẻ Nhãn Thông Minh (Smart Naming Tag) - Nhận từ AI */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
          <div className={`${smartTag.color} px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md flex items-center gap-1.5`}>
            <span>{smartTag.tag}</span>
          </div>
          <div className={`${smartTag.badgeStyle} backdrop-blur border px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 w-max shadow-sm`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            <span>{smartTag.badge}</span>
          </div>
        </div>

        {/* Khu vực hiển thị Fashion Flat-lay / Mannequin với RobeVisualizer */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-10 px-4 min-h-[380px]">
          <div className="w-full max-w-sm h-[360px] md:h-[420px] rounded-3xl flex flex-col items-center justify-center relative">
            
            {/* SVG Visualizer Canvas */}
            <div className="w-full h-full flex items-center justify-center p-2">
              <RobeVisualizer
                type={getRobeSvgType()}
                primaryColor={selectedColorHex}
                hasDonY={hasDonY}
                buttonType={selectedButtonId}
                borderless={true}
              />
            </div>

            {/* Chi tiết phụ kiện gắn kèm bên dưới (Micro Lookbook chips) */}
            <div className="absolute bottom-1 flex items-center gap-2 flex-wrap justify-center max-w-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/90 shadow-sm border border-gray-200 text-[10px] font-medium text-gray-700">
                👖 {categoryItems.quan.find(q => q.id === selectedBottomId)?.name || 'Quần'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/90 shadow-sm border border-gray-200 text-[10px] font-medium text-gray-700">
                👞 {categoryItems.giay.find(g => g.id === selectedShoesId)?.name || 'Giày'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/90 shadow-sm border border-gray-200 text-[10px] font-medium text-gray-700">
                🪭 {categoryItems.phukien.find(p => p.id === selectedAccessoryId)?.name || 'Phụ kiện'}
              </span>
            </div>
          </div>
        </div>

        {/* Bảng Đánh Giá AI (Vibe Check Dashboard) - Glassmorphism */}
        <div className="relative z-20 m-4 lg:m-6 p-5 lg:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-serif text-lg text-[#1A1A1A] flex items-center gap-2 font-bold">
                ✨ AI Stylist Vibe Check
                {isAiAnalyzing && (
                  <span className="text-xs text-[#D4AF37] font-sans font-normal animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Đang thẩm định...
                  </span>
                )}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 mt-1 italic leading-relaxed">
                {getAiQuote()}
              </p>
            </div>
          </div>

          {/* Thanh điểm số */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Slay Score */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span className="text-pink-600">Slay Score</span>
                <span className="text-gray-800">{scores.slay}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-600 transition-all duration-500 rounded-full" 
                  style={{ width: `${scores.slay}%` }}
                />
              </div>
            </div>

            {/* Heritage Score */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span className="text-emerald-600">Độ Chuẩn Di Sản</span>
                <span className="text-gray-800">{scores.heritage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${scores.heritage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-5">
            <button 
              type="button"
              onClick={handleReEvaluate}
              disabled={isAiAnalyzing}
              className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-xl text-xs md:text-sm font-medium hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
              <span>Nhờ AI Thẩm Định Lại</span>
            </button>
            <button 
              type="button"
              onClick={handleShareLookbook}
              className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-3 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-50 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Xuất Lookbook (Share)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainWorkspace;
