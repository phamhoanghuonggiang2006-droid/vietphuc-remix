import React, { useState } from 'react';
import { RENTAL_LOCATIONS, RentalLocation } from '../data/heritageData';
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
  Check
} from 'lucide-react';

export const HeritageMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string>(RENTAL_LOCATIONS[0].id);
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Filter locations
  const filteredLocations = RENTAL_LOCATIONS.filter((loc) => {
    const matchesCity = selectedCity === 'all' || loc.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesCategory && matchesSearch;
  });

  const activeLocation = RENTAL_LOCATIONS.find(l => l.id === activeLocationId) || RENTAL_LOCATIONS[0];

  const handleBookStylist = (locName: string) => {
    setBookingSuccess(locName);
    setTimeout(() => {
      setBookingSuccess(null);
    }, 3000);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="relative border-b border-[#24242d] pb-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-[#c5a059] font-medium tracking-wide mb-1">
              Bản Đồ Cổ Phục · Mạng Lưới Di Sản
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f2eb]">
              Mạng Lưới Tiệm Thuê & Bảo Tàng Y Quan
            </h1>
            <p className="mt-2 text-stone-300 text-sm max-w-2xl leading-relaxed">
              Khám phá các không gian cho thuê Áo Ngũ Thân, Áo Tấc, Nhật Bình chuẩn quy cách, tiệm may đo nghệ nhân và bảo tàng trưng bày báu vật triều Nguyễn tại 4 kinh đô văn hóa.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs text-stone-300 bg-[#141418] p-3 rounded-xl border border-[#242430]">
            <div>
              <span className="text-base text-[#c5a059] block font-bold">4 Kinh Đô</span>
              <span className="text-[11px] text-stone-400">Hà Nội · Huế · Hội An · TP.HCM</span>
            </div>
            <div className="w-[1px] h-6 bg-[#2a2a38]" />
            <div>
              <span className="text-base text-[#c5a059] block font-bold">100% Chuẩn</span>
              <span className="text-[11px] text-stone-400">Quy chế y quan</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#141418] border border-[#23232c] rounded-xl p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên tiệm, phố phường, dịch vụ (makeup, thuê áo tấc)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d12] border border-[#272736] focus:border-[#c5a059] text-xs text-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none"
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#0d0d12] border border-[#272736] focus:border-[#c5a059] text-xs text-stone-200 rounded-xl px-3 py-2.5 focus:outline-none"
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
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0d0d12] border border-[#272736] focus:border-[#c5a059] text-xs text-stone-200 rounded-xl px-3 py-2.5 focus:outline-none"
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
        <div className="lg:col-span-6 bg-[#141419] border border-[#23232c] rounded-2xl p-6 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c5a059]" />
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
                BẢN ĐỒ GIẢ LẬP ĐỊA ĐIỂM
              </span>
            </div>
            <span className="text-xs text-stone-400">
              {filteredLocations.length} địa điểm hiển thị
            </span>
          </div>

          {/* Interactive SVG Radar Map */}
          <div className="relative w-full aspect-[4/3] bg-[#0c0c11] rounded-2xl border border-[#232332] overflow-hidden select-none">
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
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all transform cursor-pointer group ${
                    isActive ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                >
                  <div className="relative">
                    {/* Pulsing ring for active pin */}
                    {isActive && (
                      <span className="absolute -inset-2 rounded-full bg-[#c5a059]/30 animate-ping" />
                    )}
                    
                    <div className={`p-2 rounded-full border shadow-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-[#c5a059] border-white text-[#0d0d10]'
                        : 'bg-[#181824] border-[#383848] text-[#e5c365]'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Hover Name Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap bg-black/90 text-stone-200 text-[10px] px-2 py-1 rounded border border-white/10 pointer-events-none shadow-md">
                      {loc.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Active Location Summary inside Map Box */}
          <div className="p-4 rounded-xl bg-[#0e0e13] border border-[#242432] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Điểm đang chọn:</span>
              <span className="text-[#c5a059] font-medium">{activeLocation.city} · Cách {activeLocation.distanceKm} km</span>
            </div>
            <div className="font-semibold text-sm text-[#f5f2eb]">
              {activeLocation.name}
            </div>
            <p className="text-xs text-stone-400">
              {activeLocation.address}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowDirectionsModal(true)}
                className="px-3 py-1.5 bg-[#c5a059] text-[#0d0d10] text-xs font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Xem đường đi</span>
              </button>
              <button
                onClick={() => handleBookStylist(activeLocation.name)}
                className="px-3 py-1.5 bg-[#1f1f2a] text-stone-300 hover:text-white text-xs rounded-lg border border-[#2c2c3e] transition-colors"
              >
                Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCATION LISTINGS & CARDS (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {bookingSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Đã kết nối yêu cầu tư vấn stylist tới: <strong>{bookingSuccess}</strong>! Tư vấn viên sẽ liên hệ trong 5 phút.</span>
            </div>
          )}

          {filteredLocations.length === 0 ? (
            <div className="text-center py-16 bg-[#141419] rounded-2xl border border-[#23232c] p-8 space-y-3">
              <Building2 className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-stone-300 text-sm">Không tìm thấy địa điểm phù hợp với bộ lọc.</p>
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#c5a059] hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = loc.id === activeLocationId;
              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                    isSelected
                      ? 'bg-[#1a1a23] border-[#c5a059] shadow-[0_4px_25px_rgba(197,160,89,0.12)] ring-1 ring-[#c5a059]'
                      : 'bg-[#141419] border-[#23232c] hover:border-[#383849] hover:bg-[#171720]'
                  }`}
                >
                  {/* Top Row: Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded bg-[#c5a059]/15 text-[#e5c365] border border-[#c5a059]/30">
                      {loc.category === 'rental' ? 'THUÊ CỔ PHỤC' : loc.category === 'tailor' ? 'MAY ĐO BESPOKE' : 'BẢO TÀNG DI SẢN'}
                    </span>
                    
                    <div className="flex items-center gap-1 text-xs text-[#c5a059]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold">{loc.rating}</span>
                      <span className="text-stone-500">({loc.reviewCount})</span>
                    </div>
                  </div>

                  {/* Name & City */}
                  <div>
                    <h3 className="text-base font-royal font-bold text-[#f5f2eb]">
                      {loc.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{loc.address}</span>
                      <span>·</span>
                      <span className="text-stone-300 font-mono">~{loc.distanceKm} km</span>
                    </div>
                  </div>

                  {/* Price & Hours */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#22222e]">
                    <div className="text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{loc.openHours}</span>
                    </div>
                    <div className="text-right text-[#c5a059] font-medium font-mono text-[11px]">
                      {loc.priceRange}
                    </div>
                  </div>

                  {/* Service tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {loc.services.map((svc, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#101015] border border-[#232330] text-stone-300">
                        {svc}
                      </span>
                    ))}
                  </div>

                  {/* Highlight */}
                  <p className="text-xs text-stone-400 italic bg-[#0f0f14] p-2.5 rounded-lg border-l-2 border-[#c5a059]">
                    "{loc.highlight}"
                  </p>

                  {/* Bottom Action buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`tel:${loc.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#282838]"
                    >
                      <Phone className="w-3 h-3 text-[#c5a059]" />
                      <span>{loc.phone}</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookStylist(loc.name);
                      }}
                      className="text-xs font-semibold text-[#0d0d10] px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#e5c365] hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
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
                onClick={() => setShowDirectionsModal(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1"
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
              onClick={() => setShowDirectionsModal(false)}
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
