import React, { useState } from 'react';
import { RENTAL_LOCATIONS, RentalLocation } from '../data/heritageData';
import { 
  playDanTranhTabSound, 
  playButtonClinkSound, 
  playGarmentSelectSound, 
  playFanFlutterSound 
} from '../utils/soundEffects';
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Phone, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Building2, 
  Scissors, 
  Camera, 
  Sparkles,
  Compass,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export interface MatchedOutfitInfo {
  tier: 'heritage' | 'modern' | 'fusion';
  garmentId: string;
  garmentName: string;
  hasSneakers?: boolean;
  styleTitle?: string;
}

export interface HeritageMapProps {
  currentContext?: 'heritage' | 'modern' | 'fusion';
  matchedOutfit?: MatchedOutfitInfo | null;
  onClearOutfitFilter?: () => void;
}

export const HeritageMap: React.FC<HeritageMapProps> = ({ 
  currentContext = 'heritage',
  matchedOutfit = null,
  onClearOutfitFilter
}) => {
  const isModern = currentContext === 'modern';
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string>(RENTAL_LOCATIONS[0].id);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Helper to calculate match rating with user's active outfit
  const getOutfitMatchInfo = (loc: RentalLocation) => {
    if (!matchedOutfit) return null;

    const isFusionOrStreet = matchedOutfit.tier === 'fusion' || matchedOutfit.hasSneakers;
    
    if (isFusionOrStreet) {
      if (loc.styleVibes.includes('fusion') || loc.styleVibes.includes('streetwear') || loc.styleVibes.includes('concept')) {
        return {
          percentage: 98,
          isHighMatch: true,
          label: '✨ 98% Hoàn Hảo Cho Outfit Fusion',
          isDimmed: false,
          mismatchReason: null
        };
      }
      if (loc.category === 'museum') {
        return {
          percentage: 75,
          isHighMatch: false,
          label: '🏛️ 75% Không Gian Triển Lãm & Check-in',
          isDimmed: false,
          mismatchReason: null
        };
      }
      return {
        percentage: 60,
        isHighMatch: false,
        label: '⚠️ 60% May Đo Nghi Lễ Truyền Thống',
        isDimmed: true,
        mismatchReason: loc.mismatchNotice || 'Tiệm chuyên lễ phục trang trọng, hạn chế nhận phối cùng sneaker/phụ kiện phá cách.'
      };
    } else {
      // Heritage or Modern refined
      if (loc.isAiVerified && (loc.styleVibes.includes('heritage') || loc.styleVibes.includes('ceremonial'))) {
        return {
          percentage: 99,
          isHighMatch: true,
          label: '✨ 99% Chuẩn Y Quan Hoàng Triều',
          isDimmed: false,
          mismatchReason: null
        };
      }
      if (loc.styleVibes.includes('fusion') || loc.styleVibes.includes('streetwear')) {
        return {
          percentage: 65,
          isHighMatch: false,
          label: '⚠️ 65% Tiệm Concept Phố Thị',
          isDimmed: true,
          mismatchReason: loc.mismatchNotice || 'Tiệm chuyên concept trẻ trung đường phố, ít sẵn lễ phục trang trọng.'
        };
      }
      return {
        percentage: 88,
        isHighMatch: true,
        label: '88% Phù Hợp Phong Cách',
        isDimmed: false,
        mismatchReason: null
      };
    }
  };

  // Filter & sort locations
  const filteredLocations = RENTAL_LOCATIONS.filter((loc) => {
    const matchesCity = selectedCity === 'all' || loc.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (matchedOutfit) {
      const matchA = getOutfitMatchInfo(a)?.percentage || 50;
      const matchB = getOutfitMatchInfo(b)?.percentage || 50;
      return matchB - matchA;
    }
    return 0;
  });

  const activeLocation = RENTAL_LOCATIONS.find(l => l.id === activeLocationId) || RENTAL_LOCATIONS[0];

  const handleBookStylist = (locName: string) => {
    playGarmentSelectSound();
    setBookingSuccess(locName);
    setTimeout(() => {
      setBookingSuccess(null);
    }, 3000);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className={`relative border-b pb-6 pt-2 ${isModern ? 'border-stone-300' : 'border-[#24242d]'}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className={`text-xs font-medium tracking-wide mb-1 ${isModern ? 'text-[#8a6825] font-semibold' : 'text-[#c5a059]'}`}>
              Bản Đồ Cổ Phục · Mạng Lưới Di Sản
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
              Mạng Lưới Tiệm Thuê & Bảo Tàng Y Quan
            </h1>
            <p className={`mt-2 text-sm max-w-2xl leading-relaxed ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>
              Khám phá các không gian cho thuê Áo Ngũ Thân, Áo Tấc, Nhật Bình chuẩn quy cách, tiệm may đo nghệ nhân và bảo tàng trưng bày báu vật triều Nguyễn tại 4 kinh đô văn hóa.
            </p>
          </div>

          {/* Quick Stats */}
          <div className={`flex items-center gap-4 text-xs p-3 rounded-xl border ${
            isModern ? 'bg-white/85 border-stone-200/90 text-stone-800 shadow-sm' : 'bg-[#141418] border-[#242430] text-stone-300'
          }`}>
            <div>
              <span className={`text-base block font-bold ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>4 Kinh Đô</span>
              <span className={`text-[11px] ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>Hà Nội · Huế · Hội An · TP.HCM</span>
            </div>
            <div className={`w-[1px] h-6 ${isModern ? 'bg-stone-300' : 'bg-[#2a2a38]'}`} />
            <div>
              <span className={`text-base block font-bold ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>100% Chuẩn</span>
              <span className={`text-[11px] ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>Quy chế y quan</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI AUTO-SYNC FROM LOOKBOOK BANNER (IF MATCHED OUTFIT EXISTS) */}
      {matchedOutfit && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059]/10 to-transparent border border-[#c5a059]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#e5c365] text-[#0d0d10] flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              📍
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#e5c365] tracking-wide uppercase">
                  AI Auto-Filter · Đồng Bộ Từ Studio Lookbook
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#c5a059]/25 text-[#faedd0] border border-[#c5a059]/40">
                  {matchedOutfit.tier.toUpperCase()} {matchedOutfit.hasSneakers ? '+ SNEAKERS' : ''}
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                Đang đề xuất các tiệm thuê & may đo tối ưu nhất cho bộ outfit <strong className="text-white">{matchedOutfit.garmentName}</strong>. Các studio chuyên biệt được ưu tiên lên đầu, tiệm không phù hợp đã được làm mờ nhẹ và gắn ghi chú.
              </p>
            </div>
          </div>
          {onClearOutfitFilter && (
            <button
              onClick={() => {
                playDanTranhTabSound();
                onClearOutfitFilter();
              }}
              className="px-3.5 py-2 rounded-xl border border-white/20 text-stone-300 hover:text-white hover:bg-white/10 text-xs shrink-0 cursor-pointer transition-colors font-medium self-end sm:self-center"
            >
              ✕ Bỏ lọc / Hiện tất cả ({RENTAL_LOCATIONS.length})
            </button>
          )}
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className={`rounded-xl p-4 sm:p-5 space-y-3 border ${
        isModern ? 'bg-white/85 border-stone-200/90 shadow-sm' : 'bg-[#141418] border-[#23232c]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isModern ? 'text-stone-500' : 'text-stone-400'}`} />
            <input
              type="text"
              placeholder="Tìm theo tên tiệm, phố phường, dịch vụ (makeup, thuê áo tấc)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none border ${
                isModern
                  ? 'bg-stone-50/80 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-[#8a6825]'
                  : 'bg-[#0d0d12] border-[#272736] focus:border-[#c5a059] text-stone-200'
              }`}
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => {
                playDanTranhTabSound();
                setSelectedCity(e.target.value);
              }}
              className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none border ${
                isModern
                  ? 'bg-stone-50/80 border-stone-200 text-stone-900 focus:border-[#8a6825]'
                  : 'bg-[#0d0d12] border-[#272736] focus:border-[#c5a059] text-stone-200'
              }`}
            >
              <option value="all">Tất cả thành phố</option>
              <option value="Hà Nội">Hà Nội (Thăng Long)</option>
              <option value="Huế">Huế (Cố Đô)</option>
              <option value="Hội An">Hội An (Phố Cổ)</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Gia Định)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                playDanTranhTabSound();
                setSelectedCategory(e.target.value);
              }}
              className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none border ${
                isModern
                  ? 'bg-stone-50/80 border-stone-200 text-stone-900 focus:border-[#8a6825]'
                  : 'bg-[#0d0d12] border-[#272736] focus:border-[#c5a059] text-stone-200'
              }`}
            >
              <option value="all">Tất cả loại hình</option>
              <option value="rental">Cho thuê Cổ phục</option>
              <option value="tailor">May đo Bespoke</option>
              <option value="museum">Bảo tàng & Triển lãm</option>
            </select>
          </div>

        </div>
      </div>

      {/* MAP & LISTING SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SIMULATED INTERACTIVE MAP (6 Cols) */}
        <div className={`lg:col-span-6 rounded-2xl p-6 lg:sticky lg:top-24 space-y-4 border ${
          isModern ? 'bg-white/85 border-stone-200/90 shadow-sm' : 'bg-[#141419] border-[#23232c]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className={`w-4 h-4 ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`} />
              <span className={`text-xs uppercase tracking-wider font-semibold ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>
                BẢN ĐỒ TƯƠNG TÁC ĐỊA ĐIỂM
              </span>
            </div>
            <span className={`text-xs ${isModern ? 'text-stone-500' : 'text-stone-400'}`}>
              {filteredLocations.length} địa điểm hiển thị
            </span>
          </div>

          {/* Interactive SVG Radar Map */}
          <div className="relative w-full aspect-[4/3] bg-[#0c0c11] rounded-2xl border border-[#232332] overflow-hidden select-none shadow-inner">
            {/* Topographic Map Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #c5a059 1px, transparent 1px)',
                backgroundSize: '28px 28px'
              }}
            />

            {/* Stylized Vietnam S-Curve Contour Background */}
            <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="mapCoast" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#252535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#12121a" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Minimal Stylized Coastline */}
              <path
                d="M 120 20 Q 220 50 190 120 Q 240 180 160 250 Q 140 280 180 295"
                fill="none"
                stroke="#333346"
                strokeWidth="4"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Regional Ambient Rings */}
              {/* North / Hà Nội */}
              <circle cx="160" cy="60" r="35" fill="#c5a059" fillOpacity="0.04" />
              <text x="110" y="55" fill="#71717a" fontSize="10" fontFamily="sans-serif">Thăng Long / HN</text>

              {/* Central / Huế & Hội An */}
              <circle cx="210" cy="140" r="35" fill="#c5a059" fillOpacity="0.04" />
              <text x="235" y="135" fill="#71717a" fontSize="10" fontFamily="sans-serif">Cố Đô Huế</text>
              <text x="235" y="150" fill="#71717a" fontSize="10" fontFamily="sans-serif">Hội An</text>

              {/* South / Sài Gòn */}
              <circle cx="170" cy="240" r="35" fill="#c5a059" fillOpacity="0.04" />
              <text x="105" y="240" fill="#71717a" fontSize="10" fontFamily="sans-serif">Sài Gòn / Gia Định</text>
            </svg>

            {/* Simulated Radar Sweep Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#c5a059]/20 pointer-events-none" />

            {/* Interactive Pins */}
            {filteredLocations.map((loc) => {
              const isActive = loc.id === activeLocationId;
              const isHovered = loc.id === hoveredLocationId;
              const matchInfo = getOutfitMatchInfo(loc);

              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    playButtonClinkSound();
                    setActiveLocationId(loc.id);
                    document.getElementById(`loc-card-${loc.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  onMouseEnter={() => setHoveredLocationId(loc.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                  style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform cursor-pointer group ${
                    isActive || isHovered ? 'scale-125 z-30' : 'hover:scale-115 z-10'
                  }`}
                  aria-label={loc.name}
                >
                  <div className="relative">
                    {/* Glowing / Pulsing ring for active or hovered pin */}
                    {(isActive || isHovered) && (
                      <span className="absolute -inset-2.5 rounded-full bg-[#c5a059]/40 animate-ping" />
                    )}
                    
                    <div className={`p-2 rounded-full border shadow-xl flex items-center justify-center transition-all ${
                      isActive || isHovered
                        ? 'bg-gradient-to-br from-[#c5a059] to-[#e5c365] border-white text-[#0d0d10] ring-4 ring-[#c5a059]/30'
                        : matchInfo?.isDimmed
                        ? 'bg-[#14141c] border-[#2c2c3a] text-stone-500'
                        : 'bg-[#181824] border-[#383848] text-[#e5c365]'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Rich Hover Tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 ${
                      isHovered || isActive ? 'opacity-100 scale-100 pointer-events-none' : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100'
                    } transition-all duration-200 z-40 whitespace-nowrap bg-stone-900/95 text-stone-100 text-[10px] px-2.5 py-1.5 rounded-lg border border-[#c5a059]/40 shadow-2xl space-y-0.5`}>
                      <div className="font-bold flex items-center gap-1">
                        <span>{loc.name}</span>
                        {loc.isAiVerified && <span className="text-emerald-400">🛡️</span>}
                      </div>
                      {matchInfo && (
                        <div className={`text-[9px] font-semibold ${matchInfo.isHighMatch ? 'text-emerald-300' : 'text-amber-300'}`}>
                          {matchInfo.label}
                        </div>
                      )}
                      <div className="text-[9px] text-stone-400">
                        {loc.city} · {loc.priceRange}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Active Location Summary inside Map Box */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isModern ? 'bg-[#FBF9F5] border-stone-200' : 'bg-[#0e0e13] border-[#242432]'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={isModern ? 'text-stone-500' : 'text-stone-400'}>Điểm đang chọn:</span>
              <span className={`font-medium ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>{activeLocation.city} · Cách {activeLocation.distanceKm} km</span>
            </div>
            <div className={`font-semibold text-sm ${isModern ? 'text-stone-900 font-royal' : 'text-[#f5f2eb]'}`}>
              {activeLocation.name}
            </div>
            <p className={`text-xs ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>
              {activeLocation.address}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  playFanFlutterSound();
                  setShowDirectionsModal(true);
                }}
                className="px-3 py-1.5 bg-[#c5a059] text-[#0d0d10] text-xs font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Xem đường đi</span>
              </button>
              <button
                onClick={() => handleBookStylist(activeLocation.name)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                  isModern 
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300' 
                    : 'bg-[#1f1f2a] text-stone-300 hover:text-white border-[#2c2c3e]'
                }`}
              >
                Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCATION LISTINGS & CARDS (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {bookingSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đã kết nối yêu cầu tư vấn stylist tới: <strong>{bookingSuccess}</strong>! Tư vấn viên sẽ liên hệ trong 5 phút.</span>
            </div>
          )}

          {filteredLocations.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border p-8 space-y-3 ${
              isModern ? 'bg-white/80 border-stone-200 text-stone-700' : 'bg-[#141419] border-[#23232c] text-stone-300'
            }`}>
              <Building2 className={`w-10 h-10 mx-auto ${isModern ? 'text-stone-400' : 'text-stone-600'}`} />
              <p className={`text-sm ${isModern ? 'text-stone-700' : 'text-stone-300'}`}>Không tìm thấy địa điểm phù hợp với bộ lọc.</p>
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  onClearOutfitFilter?.();
                }}
                className={`text-xs hover:underline ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = loc.id === activeLocationId;
              const isHovered = loc.id === hoveredLocationId;
              const matchInfo = getOutfitMatchInfo(loc);

              return (
                <div
                  key={loc.id}
                  id={`loc-card-${loc.id}`}
                  onClick={() => {
                    playDanTranhTabSound();
                    setActiveLocationId(loc.id);
                  }}
                  onMouseEnter={() => setHoveredLocationId(loc.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer space-y-4 scroll-mt-28 ${
                    matchInfo?.isDimmed ? 'opacity-70 hover:opacity-100' : 'opacity-100'
                  } ${
                    isSelected || isHovered
                      ? isModern
                        ? 'bg-white border-[#8a6825] ring-2 ring-[#8a6825]/30 shadow-lg scale-[1.01]'
                        : 'bg-[#1a1a23] border-[#c5a059] shadow-[0_4px_25px_rgba(197,160,89,0.18)] ring-1 ring-[#c5a059] scale-[1.01]'
                      : isModern
                      ? 'bg-white/80 border-stone-200/90 hover:border-stone-400 hover:bg-white shadow-xs'
                      : 'bg-[#141419] border-[#23232c] hover:border-[#383849] hover:bg-[#171720]'
                  }`}
                >
                  {/* Top Row: Category, Rating & AI Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded border ${
                        isModern 
                          ? 'bg-[#8a6825]/10 text-[#8a6825] border-[#8a6825]/25' 
                          : 'bg-[#c5a059]/15 text-[#e5c365] border-[#c5a059]/30'
                      }`}>
                        {loc.category === 'rental' ? 'THUÊ CỔ PHỤC' : loc.category === 'tailor' ? 'MAY ĐO BESPOKE' : 'BẢO TÀNG DI SẢN'}
                      </span>

                      {/* AI VERIFIED HERITAGE BADGE */}
                      {loc.isAiVerified && (
                        <div className="relative group/verified inline-flex items-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-xs cursor-help">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>AI Verified Heritage</span>
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover/verified:block z-30 w-64 p-2.5 rounded-xl bg-stone-900 text-stone-200 text-[11px] leading-relaxed border border-emerald-500/40 shadow-2xl pointer-events-none">
                            <span className="font-bold text-emerald-400 block mb-0.5">Xác thực bởi HeritStyle AI:</span>
                            {loc.aiVerifiedReason || 'Chuẩn quy cách Y quan triều Nguyễn, phom dáng 5 thân truyền thống, không lai căng cúc vải/sườn xám.'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex items-center gap-1 text-xs ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold">{loc.rating}</span>
                      <span className={isModern ? 'text-stone-500' : 'text-stone-500'}>({loc.reviewCount})</span>
                    </div>
                  </div>

                  {/* AI Outfit Match Pill (When matchedOutfit is active) */}
                  {matchInfo && (
                    <div className={`px-3 py-1 rounded-xl text-xs flex items-center justify-between border ${
                      matchInfo.isHighMatch
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    }`}>
                      <span className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{matchInfo.label}</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-80">{matchInfo.percentage}% Match</span>
                    </div>
                  )}

                  {/* Name & City */}
                  <div>
                    <h3 className={`text-base font-royal font-bold ${isModern ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                      {loc.name}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-xs mt-1 ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>
                      <MapPin className={`w-3.5 h-3.5 ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`} />
                      <span>{loc.address}</span>
                      <span>·</span>
                      <span className={`font-mono ${isModern ? 'text-stone-800' : 'text-stone-300'}`}>~{loc.distanceKm} km</span>
                    </div>
                  </div>

                  {/* Price & Hours */}
                  <div className={`grid grid-cols-2 gap-2 text-xs pt-1 border-t ${isModern ? 'border-stone-200' : 'border-[#22222e]'}`}>
                    <div className={`flex items-center gap-1.5 ${isModern ? 'text-stone-600' : 'text-stone-400'}`}>
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{loc.openHours}</span>
                    </div>
                    <div className={`text-right font-medium font-mono text-[11px] ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`}>
                      {loc.priceRange}
                    </div>
                  </div>

                  {/* Service tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {loc.services.map((svc, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded border ${
                        isModern 
                          ? 'bg-stone-100 border-stone-200 text-stone-700' 
                          : 'bg-[#101015] border-[#232330] text-stone-300'
                      }`}>
                        {svc}
                      </span>
                    ))}
                  </div>

                  {/* Highlight */}
                  <p className={`text-xs italic p-2.5 rounded-lg border-l-2 ${
                    isModern 
                      ? 'bg-amber-50/80 border-[#8a6825] text-stone-800' 
                      : 'bg-[#0f0f14] border-[#c5a059] text-stone-400'
                  }`}>
                    "{loc.highlight}"
                  </p>

                  {/* Mismatch Warning (if any) */}
                  {matchInfo?.mismatchReason && (
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{matchInfo.mismatchReason}</span>
                    </div>
                  )}

                  {/* Bottom Action buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`tel:${loc.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                        isModern
                          ? 'bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200'
                          : 'bg-[#1a1a24] border-[#282838] text-stone-300 hover:text-white'
                      }`}
                    >
                      <Phone className={`w-3 h-3 ${isModern ? 'text-[#8a6825]' : 'text-[#c5a059]'}`} />
                      <span>{loc.phone}</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookStylist(loc.name);
                      }}
                      className="text-xs font-semibold text-[#0d0d10] px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#e5c365] hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Đặt Thử Đồ</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* SIMULATED DIRECTIONS MODAL */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141419] border border-[#2e2e3e] rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#252535] pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#c5a059]" />
                <h4 className="text-base font-royal text-[#f5f2eb] font-semibold">
                  Chỉ Đường Đến {activeLocation.name}
                </h4>
              </div>
              <button
                onClick={() => {
                  playDanTranhTabSound();
                  setShowDirectionsModal(false);
                }}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 rounded-xl bg-[#0f0f14] border border-[#222230] space-y-1">
                <div className="text-stone-400">Điểm đến:</div>
                <div className="font-semibold text-white">{activeLocation.address}</div>
                <div className="text-[#c5a059]">Khoảng cách ước tính: ~{activeLocation.distanceKm} km (12 phút di chuyển)</div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-stone-200">Lộ trình gợi ý:</div>
                <div className="space-y-1.5 text-stone-400 pl-4 border-l border-[#c5a059]/40">
                  <div>1. Đi theo trục phố chính hướng về trung tâm {activeLocation.city}.</div>
                  <div>2. Rẽ vào phố {activeLocation.address.split(',')[1] || activeLocation.address}.</div>
                  <div>3. Đến số nhà {activeLocation.address.split(',')[0]} (Khu vực có biển hiệu Cổ Phục).</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playDanTranhTabSound();
                setShowDirectionsModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#c5a059] text-[#0d0d10] font-semibold text-xs font-royal hover:brightness-110 transition-all cursor-pointer"
            >
              ĐÃ XÁC NHẬN LỘ TRÌNH
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
