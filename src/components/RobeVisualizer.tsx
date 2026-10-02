import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RobeVisualizerProps {
  type: 'ngu_than' | 'ao_tac' | 'nhat_binh' | 'giao_linh' | 'vien_linh';
  primaryColor: string;
  hasDonY: boolean;
  buttonType: string;
  activeHotspot?: string | null;
  onSelectHotspot?: (hotspotId: string) => void;
  interactive?: boolean;
  borderless?: boolean;
}

export const RobeVisualizer: React.FC<RobeVisualizerProps> = ({
  type,
  primaryColor,
  hasDonY,
  buttonType,
  activeHotspot,
  onSelectHotspot,
  interactive = false,
  borderless = false,
}) => {
  // Determine button color, label and style
  const getButtonConfig = () => {
    const bType = (buttonType || '').toLowerCase();
    if (bType.includes('silver') || bType.includes('bac') || bType.includes('sen')) {
      return {
        id: 'btn-silver-lotus',
        fill: 'url(#btnSilverLotus)',
        stroke: '#CBD5E1',
        cordColor: '#E2E8F0',
        label: 'Cúc Bạc Chạm Hoa Sen (Mới - Thanh Tao)',
        isTaboo: false
      };
    }
    if (bType.includes('pearl') || bType.includes('xa_cu') || bType.includes('xa-cu') || bType.includes('oc')) {
      return {
        id: 'btn-mother-of-pearl',
        fill: 'url(#btnMotherOfPearl)',
        stroke: '#FDE68A',
        cordColor: '#EDE9FE',
        label: 'Cúc Xà Cừ Khảm Ốc Ánh Kim (Mới - Tinh Xảo)',
        isTaboo: false
      };
    }
    if (bType.includes('jade') || bType.includes('ngoc')) {
      return {
        id: 'btn-jade-green',
        fill: 'url(#btnJadeGreen)',
        stroke: '#E5C365',
        cordColor: '#10B981',
        label: 'Cúc Ngọc Bích Cẩm Thạch (Vương Giả)',
        isTaboo: false
      };
    }
    if (bType.includes('wood') || bType.includes('go') || bType.includes('tram')) {
      return {
        id: 'btn-wood-agarwood',
        fill: 'url(#btnWoodAgarwood)',
        stroke: '#C5A059',
        cordColor: '#D4AF37',
        label: 'Cúc Gỗ Trầm Hương Khắc Chữ Thọ (Nho Nhã)',
        isTaboo: false
      };
    }
    if (bType.includes('chinese') || bType.includes('cloth') || bType.includes('vai') || bType.includes('tau')) {
      return {
        id: 'btn-chinese-cloth',
        fill: 'url(#btnChineseCloth)',
        stroke: '#991B1B',
        cordColor: '#DC2626',
        label: 'Cúc Vải Tết Dây / Cúc Tàu (Phạm Húy Taboo Alert)',
        isTaboo: true
      };
    }
    return {
      id: 'btn-metal-copper',
      fill: 'url(#btnMetalCopper)',
      stroke: '#E5C365',
      cordColor: '#E5C365',
      label: 'Cúc Đồng Đúc Bát Bửu (Đồng Cổ Đĩnh Đạc)',
      isTaboo: false
    };
  };

  const buttonConfig = getButtonConfig();
  const buttonFill = buttonConfig.fill;
  const isChineseButton = buttonConfig.isTaboo;

  // Render authentic button based on selected buttonType
  const renderAuthenticButton = (cx: number, cy: number, radius: number = 6, withCord: boolean = true) => {
    const isChinese = buttonConfig.isTaboo;
    const isJade = buttonConfig.id === 'btn-jade-green';
    const isWood = buttonConfig.id === 'btn-wood-agarwood';
    const isSilver = buttonConfig.id === 'btn-silver-lotus';
    const isMotherOfPearl = buttonConfig.id === 'btn-mother-of-pearl';

    return (
      <g key={`${cx}-${cy}`} filter="url(#softShadowFilter)">
        {/* Quai Cài / Khuyết Đơm Cúc Sang 2 Bên Vạt Áo */}
        {withCord && (
          <g>
            <line
              x1={cx - radius - 5}
              y1={cy}
              x2={cx + radius + 5}
              y2={cy}
              stroke={buttonConfig.cordColor}
              strokeWidth={radius > 7 ? 2.5 : 1.8}
              strokeLinecap="round"
            />
            {/* Khuyên Kim Loại / Khuy Cài 2 Đầu */}
            <circle cx={cx - radius - 4} cy={cy} r={radius > 7 ? 1.8 : 1.2} fill={buttonConfig.stroke} />
            <circle cx={cx + radius + 4} cy={cy} r={radius > 7 ? 1.8 : 1.2} fill={buttonConfig.stroke} />
          </g>
        )}

        {isChinese ? (
          // Cúc Vải / Cúc Tàu (Phạm Húy Triều Đình) - Cúc bện đỏ kiểu sườn xám
          <g>
            <circle cx={cx} cy={cy} r={radius} fill="url(#btnChineseCloth)" stroke="#7F1D1D" strokeWidth="1.5" />
            <line x1={cx - radius * 0.6} y1={cy - radius * 0.6} x2={cx + radius * 0.6} y2={cy + radius * 0.6} stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
            <line x1={cx + radius * 0.6} y1={cy - radius * 0.6} x2={cx - radius * 0.6} y2={cy + radius * 0.6} stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={radius * 0.3} fill="#991B1B" />
          </g>
        ) : isJade ? (
          // Cúc Ngọc Bích Cẩm Thạch (Vương Giả)
          <g>
            {/* Vành Khảm Vàng Hoàng Cung */}
            <circle cx={cx} cy={cy} r={radius} fill="#E5C365" stroke="#C5A059" strokeWidth="1" />
            {/* Lõi Ngọc Cẩm Thạch Xanh */}
            <circle cx={cx} cy={cy} r={radius * 0.85} fill="url(#btnJadeGreen)" stroke="#064E3B" strokeWidth="0.8" />
            {/* Vệt Phản Quang Ngọc Bích Sáng Bóng */}
            <ellipse
              cx={cx - radius * 0.28}
              cy={cy - radius * 0.28}
              rx={radius * 0.38}
              ry={radius * 0.22}
              transform={`rotate(-35 ${cx - radius * 0.28} ${cy - radius * 0.28})`}
              fill="#FFFFFF"
              opacity="0.85"
            />
            <circle cx={cx + radius * 0.25} cy={cy + radius * 0.25} r={radius * 0.18} fill="#A7F3D0" opacity="0.65" />
          </g>
        ) : isWood ? (
          // Cúc Gỗ Trầm Hương Khắc Chữ Thọ (Nho Nhã)
          <g>
            {/* Thân Hạt Cúc Gỗ Trầm Hương Nâu Ấm */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#btnWoodAgarwood)" stroke="#4A2800" strokeWidth="1.4" />
            {/* Thớ Vân Gỗ Tự Nhiên */}
            <path
              d={`M ${cx - radius * 0.7} ${cy - radius * 0.25} Q ${cx} ${cy - radius * 0.45} ${cx + radius * 0.7} ${cy - radius * 0.2}`}
              stroke="#3B1D04"
              strokeWidth="0.7"
              fill="none"
              opacity="0.6"
            />
            <path
              d={`M ${cx - radius * 0.7} ${cy + radius * 0.25} Q ${cx} ${cy + radius * 0.45} ${cx + radius * 0.7} ${cy + radius * 0.2}`}
              stroke="#3B1D04"
              strokeWidth="0.7"
              fill="none"
              opacity="0.6"
            />
            {/* Chạm Khắc Chữ Thọ Vàng Kim */}
            <circle cx={cx} cy={cy} r={radius * 0.45} fill="none" stroke="#E5C365" strokeWidth="0.9" />
            <line x1={cx - radius * 0.25} y1={cy} x2={cx + radius * 0.25} y2={cy} stroke="#E5C365" strokeWidth="0.8" />
            <line x1={cx} y1={cy - radius * 0.25} x2={cx} y2={cy + radius * 0.25} stroke="#E5C365" strokeWidth="0.8" />
            <circle cx={cx - radius * 0.3} cy={cy - radius * 0.3} r={radius * 0.2} fill="#FDE68A" opacity="0.65" />
          </g>
        ) : isSilver ? (
          // Cúc Bạc Chạm Hoa Sen (Mới - Thanh Tao)
          <g>
            {/* Vành Bạc Sáng Khắc Hạt Li Ti */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#btnSilverLotus)" stroke="#CBD5E1" strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r={radius * 0.78} fill="none" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
            {/* Hoa Sen Chạm Nổi Giữa Tâm */}
            <path
              d={`M ${cx} ${cy + radius * 0.35} C ${cx - radius * 0.45} ${cy + radius * 0.15}, ${cx - radius * 0.45} ${cy - radius * 0.3}, ${cx} ${cy - radius * 0.4} C ${cx + radius * 0.45} ${cy - radius * 0.3}, ${cx + radius * 0.45} ${cy + radius * 0.15}, ${cx} ${cy + radius * 0.35} Z`}
              fill="#F8FAFC"
              stroke="#64748B"
              strokeWidth="0.6"
            />
            <circle cx={cx} cy={cy - radius * 0.1} r={radius * 0.18} fill="#E2E8F0" />
            {/* Vệt Sáng Bạc Lấp Lánh */}
            <circle cx={cx - radius * 0.3} cy={cy - radius * 0.3} r={radius * 0.22} fill="#FFFFFF" opacity="0.95" />
          </g>
        ) : isMotherOfPearl ? (
          // Cúc Xà Cừ Khảm Ốc Ánh Kim (Mới - Tinh Xảo)
          <g>
            {/* Vỏ Xà Cừ Óng Ánh Ngũ Sắc */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#btnMotherOfPearl)" stroke="#FDE68A" strokeWidth="1.2" />
            {/* Viền Khảm Kim Tuyến Vàng */}
            <circle cx={cx} cy={cy} r={radius * 0.8} fill="none" stroke="#D97706" strokeWidth="0.6" strokeDasharray="2 1.5" />
            {/* Họa Tiết Cánh Hoa Khảm Ốc Ánh Kim */}
            <path
              d={`M ${cx} ${cy - radius * 0.45} L ${cx + radius * 0.35} ${cy} L ${cx} ${cy + radius * 0.45} L ${cx - radius * 0.35} ${cy} Z`}
              fill="#FEF08A"
              stroke="#B45309"
              strokeWidth="0.6"
              opacity="0.85"
            />
            {/* Vệt Phản Quang Xà Cừ Óng Ánh */}
            <ellipse
              cx={cx - radius * 0.25}
              cy={cy - radius * 0.25}
              rx={radius * 0.35}
              ry={radius * 0.2}
              transform={`rotate(-25 ${cx - radius * 0.25} ${cy - radius * 0.25})`}
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        ) : (
          // Cúc Đồng Đúc Bát Bửu (Đồng Cổ Đĩnh Đạc)
          <g>
            {/* Khuy Đồng Tròn Đầy Đặn */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#btnMetalCopper)" stroke="#E5C365" strokeWidth="1.6" />
            {/* Vành Chạm Hạt Châu Li Ti */}
            <circle cx={cx} cy={cy} r={radius * 0.72} fill="none" stroke="#FFF3B0" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            {/* Tâm Cúc Hoa Cúc / Bát Bửu Chạm Nổi */}
            <circle cx={cx} cy={cy} r={radius * 0.35} fill="#E5C365" stroke="#7A5210" strokeWidth="0.6" />
            {/* Điểm Phản Quang Kim Loại Sáng Lóa */}
            <circle cx={cx - radius * 0.3} cy={cy - radius * 0.3} r={radius * 0.25} fill="#FFFFFF" opacity="0.9" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className={
      borderless
        ? "relative w-full flex items-center justify-center bg-transparent border-0 p-0 select-none"
        : "relative w-full aspect-[4/5] max-h-[500px] flex items-center justify-center bg-gradient-to-b from-[#18181f] to-[#101014] rounded-2xl border border-[#2a2a35] overflow-hidden p-4 group select-none"
    }>
      {/* Subtle traditional watermark texture */}
      {!borderless && (
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {/* SVG Garment Illustration */}
      <svg
        id="robe-visualizer-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 500"
        className="w-full h-full max-w-[360px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-all duration-500"
      >
        <defs>
          {/* Pure Luminous Robe Gradient - Không bao giờ có vệt đen */}
          <linearGradient id={`robeGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="60%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.95" />
          </linearGradient>

          {/* Ánh Lụa Tơ Tằm Tự Nhiên (Pure Silk Highlight) */}
          <linearGradient id="silkSheen" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
          </linearGradient>

          {/* Hoa Văn Gấm Đoàn Thọ & Cúc Dây Triều Nguyễn (Chuẩn Ảnh Mẫu 01_163.jpg) */}
          <pattern id={`brocade-${type}`} width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 0 30 C 15 18, 45 42, 60 30 M 30 0 C 42 15, 18 45, 30 60"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.14"
            />
            {/* Đồ Án Đoàn Thọ Tròn */}
            <g transform="translate(30, 30)">
              <circle cx="0" cy="0" r="11" fill="none" stroke="#E5C365" strokeWidth="0.9" strokeOpacity="0.35" />
              <circle cx="0" cy="0" r="8.5" fill="none" stroke="#E5C365" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 1.5" />
              <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.35" />
              <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.35" />
              <path d="M -4 -3 L 4 -3 M -4 3 L 4 3" stroke="#FFFFFF" strokeWidth="0.7" strokeOpacity="0.3" />
            </g>
            <circle cx="0" cy="0" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="60" cy="0" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="0" cy="60" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="60" cy="60" r="1.4" fill="#E5C365" fillOpacity="0.35" />
          </pattern>

          {/* Đồ Án Phượng Ổ Hoàng Gia (Biểu Tượng Chuẩn Nhật Bình Hoàng Tộc) */}
          <g id="phuong-o-symbol">
            <circle cx="0" cy="0" r="16" fill="none" stroke="#E5C365" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="13.5" fill="none" stroke="#FFF3B0" strokeWidth="0.6" strokeDasharray="2 1.5" />
            <circle cx="0" cy="0" r="11" fill="#7F1D1D" fillOpacity="0.35" />
            {/* Phượng Hoàng Ngũ Sắc Cuộn Tròn */}
            <path d="M -7 -4 C -4 -10, 6 -9, 8 -2 C 9 6, 1 10, -6 7 C -9 4, -8 -1, -2 0 C 4 1, 6 -4, 2 -7 C -2 -8, -5 -6, -7 -4 Z" fill="#E5C365" />
            <path d="M 0 -7 C 5 -11, 10 -5, 8 2 C 6 7, 0 10, -6 7" fill="none" stroke="#2563EB" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M 2 -4 C 7 -7, 10 -2, 7 4" fill="none" stroke="#10B981" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M -3 -9 L 0 -7 L 3 -9" fill="none" stroke="#F87171" strokeWidth="0.9" />
            <circle cx="-3" cy="-6" r="1.2" fill="#FFF" />
          </g>

          {/* Cụm Hoa Rơi Điểm Xuyết (Floral Blossom Sprig) */}
          <g id="flower-sprig-symbol">
            <circle cx="0" cy="0" r="4.2" fill="#E11D48" stroke="#FFF3B0" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.8" fill="#FDE047" />
            <path d="M -4 2.5 C -7 4, -7 8, -4 7 C -2 6, -3 3.5, -4 2.5 Z" fill="#059669" />
            <path d="M 4 2.5 C 7 4, 7 8, 4 7 C 2 6, 3 3.5, 4 2.5 Z" fill="#059669" />
          </g>

          {/* 3D Button Radial Gradients */}
          <radialGradient id="btnMetalCopper" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="35%" stopColor="#E5C365" />
            <stop offset="75%" stopColor="#A67C28" />
            <stop offset="100%" stopColor="#4A3408" />
          </radialGradient>

          <radialGradient id="btnJadeGreen" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="35%" stopColor="#10B981" />
            <stop offset="80%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          <radialGradient id="btnWoodAgarwood" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#D4A373" />
            <stop offset="40%" stopColor="#8B5A2B" />
            <stop offset="85%" stopColor="#583110" />
            <stop offset="100%" stopColor="#2E1705" />
          </radialGradient>

          <radialGradient id="btnChineseCloth" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          <radialGradient id="btnSilverLotus" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#E2E8F0" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>

          <radialGradient id="btnMotherOfPearl" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#DDD6FE" />
            <stop offset="75%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </radialGradient>

          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5C365" />
            <stop offset="50%" stopColor="#FFF3B0" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>

          {/* Mannequin Luxury Titanium/Porcelain Skin */}
          <linearGradient id="mannequinSkin" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#F6F0E8" />
            <stop offset="35%" stopColor="#E2D7C7" />
            <stop offset="70%" stopColor="#BFB09E" />
            <stop offset="100%" stopColor="#8E7B68" />
          </linearGradient>

          <linearGradient id="mannequinGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5C365" />
            <stop offset="50%" stopColor="#FFF3B0" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>

          <filter id="softShadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.18"/>
          </filter>
        </defs>

        {/* MÓC ÁO GỖ ATELIER (Gallery Atelier Display Hanger) */}
        <g id="traditional-wooden-hanger" opacity={borderless ? 0.75 : 0.85}>
          <circle cx="200" cy="56" r="8.5" fill="none" stroke="#2F2F3B" strokeWidth="2.5" />
          <path d="M 200 64.5 L 200 74" stroke="#2F2F3B" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M 152 110 Q 200 76 248 110 L 242 115 Q 200 86 158 115 Z"
            fill="#272732"
            stroke="#1D1D26"
            strokeWidth="1"
          />
        </g>

        {/* HAUTE COUTURE MANNEQUIN: HEAD & NECK */}
        <g id="mannequin-head-neck" filter="url(#softShadowFilter)">
          <path
            d="M 184 56 L 184 96 Q 200 99 216 96 L 216 56 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.6"
          />
          <path d="M 193 64 Q 195 82 194 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none" />
          <path d="M 207 64 Q 205 82 206 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none" />

          {/* Búi Tóc Cổ Phục */}
          <ellipse cx="200" cy="18" rx="14" ry="9" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.6" />
          <circle cx="200" cy="18" r="3" fill="#FFF3B0" />

          {/* Đầu & Khung Mặt Điêu Khắc Thanh Thoát */}
          <path
            d="M 172 42 C 166 16, 234 16, 228 42 C 228 60, 215 74, 200 78 C 185 74, 172 60, 172 42 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.8"
          />
          <path d="M 183 38 Q 190 35 195 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 205 38 Q 210 35 217 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 200 34 L 202 48 L 198 52 L 201 54" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 193 63 Q 200 66 207 63" stroke="#8E7B68" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M 178 48 Q 188 64 200 73 Q 212 64 222 48" stroke="#C5A059" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        </g>

        {/* ======================================================== */}
        {/* 1. ÁO NGŨ THÂN TAY CHẼN (Chuẩn Ảnh Mẫu Khamphahue)        */}
        {/* ======================================================== */}
        {type === 'ngu_than' && (
          <g id="ao-ngu-than-tay-chen">
            {/* Tay Áo Trái: Cắt liền vai, ôm thon mềm mại qua cùi chỏ về cổ tay */}
            <path
              d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z" fill={`url(#brocade-${type})`} />
            <path d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z" fill="url(#silkSheen)" />

            {/* Tay Áo Phải */}
            <path
              d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z" fill={`url(#brocade-${type})`} />
            <path d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z" fill="url(#silkSheen)" />

            {/* Viền Kim Hoàn Cửa Tay Chẽn */}
            <path d="M 90 274 C 96 280, 112 276, 116 268" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 310 274 C 304 280, 288 276, 284 268" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* 2 Bàn Tay Ma Nơ Canh */}
            <g id="mannequin-hands-ngu-than">
              <g transform="translate(94, 274) rotate(32)" filter="url(#softShadowFilter)">
                <path d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 22 L -7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(306, 274) rotate(-32)" filter="url(#softShadowFilter)">
                <path d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 22 L 7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Thân Áo Ngũ Thân: Dáng Suông Tự Nhiên, Tà Vạt Bầu Uốn Cánh Cung */}
            <path
              d="M 160 100 C 140 104, 132 140, 130 185 C 128 240, 122 340, 102 472 C 145 480, 255 480, 298 472 C 278 340, 272 240, 270 185 C 268 140, 260 104, 240 100 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 160 100 C 140 104, 132 140, 130 185 C 128 240, 122 340, 102 472 C 145 480, 255 480, 298 472 C 278 340, 272 240, 270 185 C 268 140, 260 104, 240 100 Z" fill={`url(#brocade-${type})`} />
            <path d="M 160 100 C 140 104, 132 140, 130 185 C 128 240, 122 340, 102 472 C 145 480, 255 480, 298 472 C 278 340, 272 240, 270 185 C 268 140, 260 104, 240 100 Z" fill="url(#silkSheen)" />

            {/* Gấu Áo Vạt Bầu Uốn Cánh Cung Mềm Mại */}
            <path
              d="M 102 472 C 145 480, 255 480, 298 472"
              stroke="#E5C365"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Đường Can Sống Áo Chính Giữa Thân Trước (Đường Trung Phẫu) */}
            <line
              x1="200"
              y1="165"
              x2="200"
              y2="478"
              stroke="rgba(255,255,255,0.26)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* Vạt Hò Khép Chéo Uốn Lượn Hình Chữ S Sang Nách Phải */}
            <path
              d="M 194 112 C 215 125, 230 145, 235 185 C 238 230, 242 350, 246 476"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="1.4"
              fill="none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 2. ÁO TẤC / TAY THỤNG (Chuẩn Ảnh Mẫu 01_163.jpg)          */}
        {/* ======================================================== */}
        {type === 'ao_tac' && (
          <g id="ao-tac-tay-thung">
            {/* Tay Áo Trái Thụng Buông Rủ Sâu */}
            <path
              d="M 160 100 C 130 108, 90 135, 52 185 C 40 230, 38 310, 48 375 C 55 405, 88 418, 118 390 C 130 378, 135 340, 134 260 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 160 100 C 130 108, 90 135, 52 185 C 40 230, 38 310, 48 375 C 55 405, 88 418, 118 390 C 130 378, 135 340, 134 260 Z" fill={`url(#brocade-${type})`} />
            <path d="M 160 100 C 130 108, 90 135, 52 185 C 40 230, 38 310, 48 375 C 55 405, 88 418, 118 390 C 130 378, 135 340, 134 260 Z" fill="url(#silkSheen)" />

            {/* Nếp Rủ Lụa Tay Thụng Trái */}
            <path d="M 75 220 C 65 290, 68 360, 95 390" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" strokeLinecap="round" fill="none" />

            {/* Tay Áo Phải Thụng Buông Rủ Sâu */}
            <path
              d="M 240 100 C 270 108, 310 135, 348 185 C 360 230, 362 310, 352 375 C 345 405, 312 418, 282 390 C 270 378, 265 340, 266 260 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 240 100 C 270 108, 310 135, 348 185 C 360 230, 362 310, 352 375 C 345 405, 312 418, 282 390 C 270 378, 265 340, 266 260 Z" fill={`url(#brocade-${type})`} />
            <path d="M 240 100 C 270 108, 310 135, 348 185 C 360 230, 362 310, 352 375 C 345 405, 312 418, 282 390 C 270 378, 265 340, 266 260 Z" fill="url(#silkSheen)" />

            {/* Nếp Rủ Lụa Tay Thụng Phải */}
            <path d="M 325 220 C 335 290, 332 360, 305 390" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" strokeLinecap="round" fill="none" />

            {/* 2 Bàn Tay Ma Nơ Canh */}
            <g id="mannequin-hands-ao-tac">
              <g transform="translate(85, 360) rotate(16)" filter="url(#softShadowFilter)">
                <path d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(315, 360) rotate(-16)" filter="url(#softShadowFilter)">
                <path d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Thân Áo Tấc Rộng Rãi Buông Rủ Đường Bệ */}
            <path
              d="M 160 100 C 138 106, 134 160, 132 260 C 130 330, 120 400, 92 475 C 145 484, 255 484, 308 475 C 280 400, 270 330, 268 260 C 266 160, 262 106, 240 100 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 160 100 C 138 106, 134 160, 132 260 C 130 330, 120 400, 92 475 C 145 484, 255 484, 308 475 C 280 400, 270 330, 268 260 C 266 160, 262 106, 240 100 Z" fill={`url(#brocade-${type})`} />
            <path d="M 160 100 C 138 106, 134 160, 132 260 C 130 330, 120 400, 92 475 C 145 484, 255 484, 308 475 C 280 400, 270 330, 268 260 C 266 160, 262 106, 240 100 Z" fill="url(#silkSheen)" />

            {/* Gấu Áo Tấc Uốn Lượn Bầu Hoàng Kim */}
            <path
              d="M 92 475 C 145 484, 255 484, 308 475"
              stroke="#E5C365"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Nẹp Vạt Chéo Hữu Khép Chữ S */}
            <path
              d="M 194 112 C 215 125, 232 148, 236 195 C 240 245, 244 360, 248 478"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.4"
              fill="none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 3. ÁO NHẬT BÌNH CHUẨN THIẾT KẾ CUNG ĐÌNH TRIỀU NGUYỄN     */}
        {/* ======================================================== */}
        {/* 3. ÁO NHẬT BÌNH CHUẨN THIẾT KẾ CUNG ĐÌNH TRIỀU NGUYỄN     */}
        {/* Tuân thủ 100% bản vẽ kỹ thuật media_1790941714705.jpg    */}
        {/* ======================================================== */}
        {type === 'nhat_binh' && (
          <g id="ao-nhat-binh-authentic">
            {/* Lớp áo trong / tà trong có chiều sâu */}
            <path d="M 132 205 L 88 476 L 112 476 L 140 205 Z" fill="#24151C" opacity="0.4" />
            <path d="M 268 205 L 312 476 L 288 476 L 260 205 Z" fill="#24151C" opacity="0.4" />

            {/* ỐNG TAY ÁO TRÁI: Dáng thụng rộng vươn ngang, cửa tay thẳng đứng, lượn cong hõm nách */}
            <path
              d="M 158 92 L 20 128 L 20 240 C 55 240, 95 235, 132 205 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 158 92 L 20 128 L 20 240 C 55 240, 95 235, 132 205 Z" fill={`url(#brocade-${type})`} />
            <path d="M 158 92 L 20 128 L 20 240 C 55 240, 95 235, 132 205 Z" fill="url(#silkSheen)" />

            {/* ỐNG TAY ÁO PHẢI: Dáng thụng rộng vươn ngang, cửa tay thẳng đứng, lượn cong hõm nách */}
            <path
              d="M 242 92 L 380 128 L 380 240 C 345 240, 305 235, 268 205 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 242 92 L 380 128 L 380 240 C 345 240, 305 235, 268 205 Z" fill={`url(#brocade-${type})`} />
            <path d="M 242 92 L 380 128 L 380 240 C 345 240, 305 235, 268 205 Z" fill="url(#silkSheen)" />

            {/* DẢI NGŨ SẮC CỬA TAY ĐỨNG CHUẨN XÁC THEO BẢN VẼ (Lục - Bạch - Lam - Hoàng - Cam) */}
            {/* Cửa tay trái */}
            <g id="cuff-stripes-left">
              <rect x="20" y="128" width="8" height="112" fill="#047857" />
              <line x1="24" y1="130" x2="24" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
              <rect x="28" y="128" width="8" height="112" fill="#FAF7F0" />
              <line x1="32" y1="130" x2="32" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
              <rect x="36" y="128" width="9" height="112" fill="#14243B" />
              <line x1="40.5" y1="130" x2="40.5" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
              <rect x="45" y="128" width="6" height="112" fill="#E5C365" />
              <rect x="51" y="128" width="4" height="112" fill="#C27803" />
            </g>

            {/* Cửa tay phải */}
            <g id="cuff-stripes-right">
              <rect x="345" y="128" width="4" height="112" fill="#C27803" />
              <rect x="349" y="128" width="6" height="112" fill="#E5C365" />
              <rect x="355" y="128" width="9" height="112" fill="#14243B" />
              <line x1="359.5" y1="130" x2="359.5" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
              <rect x="364" y="128" width="8" height="112" fill="#FAF7F0" />
              <line x1="368" y1="130" x2="368" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
              <rect x="372" y="128" width="8" height="112" fill="#047857" />
              <line x1="376" y1="130" x2="376" y2="238" stroke="#E5C365" strokeWidth="0.8" strokeDasharray="3 2" />
            </g>

            {/* 2 Bàn Tay Ma Nơ Canh Xuất Hiện Dưới Ống Tay Thụng Rộng */}
            <g id="mannequin-hands-nhat-binh">
              <g transform="translate(45, 248) rotate(18)" filter="url(#softShadowFilter)">
                <path d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(355, 248) rotate(-18)" filter="url(#softShadowFilter)">
                <path d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* THÂN ÁO CHÍNH: DÁNG CHỮ A ĐỐI KHÂM */}
            <path
              d="M 158 92 C 144 96, 136 150, 132 205 C 128 265, 115 370, 88 476 C 145 484, 255 484, 312 476 C 285 370, 272 265, 268 205 C 264 150, 256 96, 242 92 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 158 92 C 144 96, 136 150, 132 205 C 128 265, 115 370, 88 476 C 145 484, 255 484, 312 476 C 285 370, 272 265, 268 205 C 264 150, 256 96, 242 92 Z" fill={`url(#brocade-${type})`} />
            <path d="M 158 92 C 144 96, 136 150, 132 205 C 128 265, 115 370, 88 476 C 145 484, 255 484, 312 476 C 285 370, 272 265, 268 205 C 264 150, 256 96, 242 92 Z" fill="url(#silkSheen)" />

            {/* 8 ĐỒ ÁN PHƯỢNG Ổ HOÀNG GIA CHUẨN XÁC 100% THEO BẢN VẼ KỸ THUẬT */}
            {/* 2 Phượng Ổ Trên 2 Ống Tay Áo */}
            <use href="#phuong-o-symbol" x="58" y="180" />
            <use href="#phuong-o-symbol" x="342" y="180" />
            {/* 2 Phượng Ổ Trên Vai */}
            <use href="#phuong-o-symbol" x="115" y="145" />
            <use href="#phuong-o-symbol" x="285" y="145" />
            {/* 2 Phượng Ổ Giữa Ngực Cạnh Bản Cổ */}
            <use href="#phuong-o-symbol" x="136" y="215" />
            <use href="#phuong-o-symbol" x="264" y="215" />
            {/* 2 Phượng Ổ Ở Thân Dưới */}
            <use href="#phuong-o-symbol" x="132" y="345" />
            <use href="#phuong-o-symbol" x="268" y="345" />

            {/* CÁC CỤM HOA RƠI ĐIỂM XUYẾT (Mẫu Đơn / Mai Ngũ Sắc Chuẩn Bản Vẽ) */}
            <use href="#flower-sprig-symbol" x="142" y="112" />
            <use href="#flower-sprig-symbol" x="258" y="112" />
            <use href="#flower-sprig-symbol" x="85" y="240" />
            <use href="#flower-sprig-symbol" x="315" y="240" />
            <use href="#flower-sprig-symbol" x="138" y="280" />
            <use href="#flower-sprig-symbol" x="262" y="280" />
            <use href="#flower-sprig-symbol" x="105" y="415" />
            <use href="#flower-sprig-symbol" x="295" y="415" />

            {/* ======================================================== */}
            {/* ĐỒ ÁN THỦY BA TAM SƠN KINH ĐIỂN CHÂN VẠT (Sóng Chéo Ngũ Sắc) */}
            {/* ======================================================== */}
            <g id="thuy-ba-authentic">
              {/* Dải Sóng Chéo Đối Xứng Bên Trái (Nghiêng 45 độ lên trục giữa) */}
              <g id="diagonal-waves-left">
                <polygon points="88,474 135,420 143,420 93,474" fill="#162846" />
                <polygon points="93,474 143,420 151,420 99,474" fill="#FAF7F0" />
                <polygon points="99,474 151,420 159,420 105,474" fill="#EAB308" />
                <polygon points="105,474 159,420 167,420 111,474" fill="#DC2626" />
                <polygon points="111,474 167,420 175,420 117,474" fill="#047857" />
                <polygon points="117,474 175,420 183,420 123,474" fill="#7C3AED" />
                <polygon points="123,474 183,420 191,420 129,474" fill="#EA580C" />
                <polygon points="129,474 191,420 199,420 135,474" fill="#1E3A8A" />
                <polygon points="135,474 199,420 200,420 200,432 143,474" fill="#FAF7F0" />
                <polygon points="143,474 200,432 200,444 153,474" fill="#EAB308" />
                <polygon points="153,474 200,444 200,456 166,474" fill="#DC2626" />
                <polygon points="166,474 200,456 200,468 180,474" fill="#047857" />
                <polygon points="180,474 200,468 200,474 200,474" fill="#162846" />
              </g>

              {/* Dải Sóng Chéo Đối Xứng Bên Phải (Nghiêng 45 độ lên trục giữa) */}
              <g id="diagonal-waves-right">
                <polygon points="312,474 265,420 257,420 307,474" fill="#162846" />
                <polygon points="307,474 257,420 249,420 301,474" fill="#FAF7F0" />
                <polygon points="301,474 249,420 241,420 295,474" fill="#EAB308" />
                <polygon points="295,474 241,420 233,420 289,474" fill="#DC2626" />
                <polygon points="289,474 233,420 225,420 283,474" fill="#047857" />
                <polygon points="283,474 225,420 217,420 277,474" fill="#7C3AED" />
                <polygon points="277,474 217,420 209,420 271,474" fill="#EA580C" />
                <polygon points="271,474 209,420 201,420 265,474" fill="#1E3A8A" />
                <polygon points="265,474 201,420 200,420 200,432 257,474" fill="#FAF7F0" />
                <polygon points="257,474 200,432 200,444 247,474" fill="#EAB308" />
                <polygon points="247,474 200,444 200,456 234,474" fill="#DC2626" />
                <polygon points="234,474 200,456 200,468 220,474" fill="#047857" />
                <polygon points="220,474 200,468 200,474 200,474" fill="#162846" />
              </g>

              {/* Các Cung Sóng Tròn (Sóng Cuộn Thủy Ba) Phía Trên */}
              <path
                d="M 95 435 C 120 395, 160 395, 185 435"
                fill="none"
                stroke="#165A73"
                strokeWidth="12"
                opacity="0.9"
              />
              <path
                d="M 95 435 C 120 395, 160 395, 185 435"
                fill="none"
                stroke="#25859E"
                strokeWidth="4"
              />
              <path
                d="M 215 435 C 240 395, 280 395, 305 435"
                fill="none"
                stroke="#165A73"
                strokeWidth="12"
                opacity="0.9"
              />
              <path
                d="M 215 435 C 240 395, 280 395, 305 435"
                fill="none"
                stroke="#25859E"
                strokeWidth="4"
              />

              {/* Vòm Sóng Lớn Trung Tâm (Nâng Đỡ Tam Sơn) */}
              <path
                d="M 152 435 C 170 380, 230 380, 248 435"
                fill="none"
                stroke="#0E3D52"
                strokeWidth="18"
              />
              <path
                d="M 152 435 C 170 380, 230 380, 248 435"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />

              {/* Ngũ Sắc Tường Vân (Mây Cuộn Ngũ Sắc Quanh Núi) */}
              <g id="rolling-clouds" transform="translate(200, 395)">
                <circle cx="-38" cy="0" r="7" fill="#F472B6" opacity="0.8" />
                <circle cx="-28" cy="-5" r="8" fill="#FDE047" opacity="0.8" />
                <circle cx="-16" cy="-2" r="7" fill="#38BDF8" opacity="0.8" />
                <circle cx="38" cy="0" r="7" fill="#F472B6" opacity="0.8" />
                <circle cx="28" cy="-5" r="8" fill="#FDE047" opacity="0.8" />
                <circle cx="16" cy="-2" r="7" fill="#38BDF8" opacity="0.8" />
                <circle cx="0" cy="2" r="9" fill="#FAF7F0" />
              </g>

              {/* ĐỈNH NÚI TAM SƠN HOÀNG GIA (Ba Ngọn Núi Thiêng Vươn Cao Đỡ Dải Lụa Trắng) */}
              <g id="tam-son-peaks" transform="translate(200, 345)">
                {/* Núi Chính Giữa Vươn Cao Chạm Đuôi Dải Lụa Bạch */}
                <path d="M 0 -22 L 12 28 L -12 28 Z" fill="#0D4859" stroke="#E5C365" strokeWidth="1.2" />
                <line x1="0" y1="-22" x2="0" y2="28" stroke="#FFF3B0" strokeWidth="1" />
                {/* Núi Trái */}
                <path d="M -16 -6 L -4 28 L -24 28 Z" fill="#0E3D52" stroke="#E5C365" strokeWidth="1" />
                {/* Núi Phải */}
                <path d="M 16 -6 L 24 28 L 4 28 Z" fill="#0E3D52" stroke="#E5C365" strokeWidth="1" />
                {/* Khí Thiêng / Lửa Ngọc Đỉnh Núi */}
                <circle cx="0" cy="-24" r="2.5" fill="#EAB308" />
              </g>

              {/* Dải Viền Gấm Mây Sóng Đáy Gấu Áo */}
              <path
                d="M 88 472 C 145 464, 255 464, 312 472 L 312 484 C 255 476, 145 476, 88 484 Z"
                fill="#6B1724"
                stroke="#E5C365"
                strokeWidth="1.6"
              />
              <path
                d="M 88 472 C 145 464, 255 464, 312 472"
                stroke="#FFF3B0"
                strokeWidth="2.2"
                fill="none"
              />
            </g>

            {/* ĐƯỜNG XẺ ĐỐI KHÂM TRUNG TÂM (Từ Đáy Bản Cổ Xuống Gấu) */}
            <line x1="200" y1="230" x2="200" y2="480" stroke="#1D1D26" strokeWidth="1.2" />

            {/* DẢI LỤA TRẮNG DỌC CHÍNH GIỮA (Từ Đáy Bản Cổ Ngực Xuống Tam Sơn) */}
            <g id="central-white-streamer">
              {/* Dải lụa trắng kem viền vàng kim */}
              <rect x="195" y="230" width="10" height="120" fill="#FAF7F0" stroke="#E5C365" strokeWidth="0.8" />
              <line x1="200" y1="230" x2="200" y2="350" stroke="#E5C365" strokeWidth="0.5" strokeDasharray="3 2" />
              {/* Đồ án ngọn lửa ngọc / thủy ba đuôi dải lụa chạm Tam Sơn */}
              <path d="M 195 330 C 190 345, 200 355, 200 355 C 200 355, 210 345, 205 330 Z" fill="#EAB308" stroke="#E5C365" strokeWidth="0.8" />
              <circle cx="200" cy="342" r="2.5" fill="#DC2626" />
            </g>

            {/* ======================================================== */}
            {/* BẢN CỔ NHẬT BÌNH CHỮ NHẬT / CHỮ U ĐỐI KHÂM HOÀN HẢO      */}
            {/* Chuẩn xác 100% theo bản vẽ kỹ thuật media_1790941714705  */}
            {/* ======================================================== */}
            <g id="nhat-binh-authentic-collar">
              {/* 1. LỚP ÁO ĐƠN Y TRẮNG LÓT TRONG & CỔ MA NƠ CANH */}
              <g id="don-y-inner-v">
                {/* Lớp áo lót trắng bên trong cổ chữ V */}
                <path
                  d="M 172 92 L 200 178 L 228 92 Z"
                  fill="#FAF7F0"
                />
                {/* Cổ Đứng Áo Lót Trắng (Mandarin Collar cao thanh thoát) */}
                <path
                  d="M 176 92 C 176 65, 224 65, 224 92 L 228 100 L 172 100 Z"
                  fill="#FFFFFF"
                  stroke="#E5C365"
                  strokeWidth="1.2"
                />
                <path
                  d="M 176 92 C 176 65, 224 65, 224 92"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Cúc nhỏ cài giữa cổ đứng trắng (Chuẩn ảnh mẫu người mặc) */}
                <circle cx="200" cy="78" r="2.2" fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="0.8" />
              </g>

              {/* 2. KHUNG BẢN CỔ NGOÀI MÀU XANH CHÀM (Outer Navy Blue Frame with Gold & Terracotta Trim) */}
              {/* Khung chữ U / Chữ Nhật vuông vắn ôm trọn vùng ngực (158 -> 242, 92 -> 230) */}
              <g id="outer-navy-frame">
                {/* Khối Khung Chữ U Xanh Chàm */}
                <path
                  d="M 158 92 L 242 92 L 242 230 L 158 230 L 158 92 M 172 92 L 172 214 L 228 214 L 228 92 L 172 92 Z"
                  fill="#12233C"
                  stroke="#E5C365"
                  strokeWidth="1.4"
                />

                {/* Viền Cam Đất / Vàng Kim Mép Ngoài Cùng Của Khung Bản Cổ */}
                <path
                  d="M 156 92 L 156 232 L 244 232 L 244 92"
                  stroke="#C27803"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M 158 92 L 158 230 L 242 230 L 242 92"
                  stroke="#E5C365"
                  strokeWidth="1"
                  fill="none"
                />

                {/* Viền Kim Tuyến Sáng Bên Trong Lòng Khung */}
                <path
                  d="M 172 92 L 172 214 L 228 214 L 228 92"
                  stroke="#FFF3B0"
                  strokeWidth="1"
                  fill="none"
                />

                {/* Hoa Văn Cung Đình Thêu Vàng & Hồng Đào Trên Nền Xanh Chàm */}
                <g id="navy-frame-embroidery" opacity="0.85">
                  {/* Hoa cúc / mẫu đơn hoàng gia bên dải trái */}
                  <circle cx="165" cy="120" r="3" fill="#F472B6" />
                  <circle cx="165" cy="120" r="1.5" fill="#FBBF24" />
                  <circle cx="165" cy="155" r="3" fill="#F472B6" />
                  <circle cx="165" cy="155" r="1.5" fill="#FBBF24" />
                  <circle cx="165" cy="190" r="3" fill="#F472B6" />
                  <circle cx="165" cy="190" r="1.5" fill="#FBBF24" />

                  {/* Hoa cúc / mẫu đơn hoàng gia bên dải phải */}
                  <circle cx="235" cy="120" r="3" fill="#F472B6" />
                  <circle cx="235" cy="120" r="1.5" fill="#FBBF24" />
                  <circle cx="235" cy="155" r="3" fill="#F472B6" />
                  <circle cx="235" cy="155" r="1.5" fill="#FBBF24" />
                  <circle cx="235" cy="190" r="3" fill="#F472B6" />
                  <circle cx="235" cy="190" r="1.5" fill="#FBBF24" />

                  {/* Hoa văn thêu trên cạnh đáy ngang */}
                  <circle cx="185" cy="222" r="2.8" fill="#FBBF24" />
                  <circle cx="215" cy="222" r="2.8" fill="#FBBF24" />
                </g>
              </g>

              {/* 3. LÒNG TRONG KHUNG BẢN CỔ: DẢI NẸP KEM THÊU PHƯỢNG & MẢNG SÓNG NƯỚC */}
              {/* MẢNG THÊU SÓNG NƯỚC THỦY BA DƯỚI CHÂN CÚC (y = 180 -> 214) */}
              <g id="inner-chest-wave-panel">
                <rect x="172" y="180" width="56" height="34" fill="#0D4859" />
                {/* Các vòm sóng nước xanh ngọc vươn lên */}
                <path d="M 172 214 C 180 195, 200 195, 200 214" fill="#165A73" />
                <path d="M 200 214 C 200 195, 220 195, 228 214" fill="#165A73" />
                <path d="M 180 214 C 190 200, 210 200, 220 214" fill="#25859E" />
                <circle cx="186" cy="198" r="4" fill="#F472B6" opacity="0.8" />
                <circle cx="214" cy="198" r="4" fill="#FDE047" opacity="0.8" />
                <circle cx="200" cy="194" r="5" fill="#FAF7F0" />
              </g>

              {/* DẢI NẸP TRẮNG KEM NGÀ (Inner Band - Từ vai xuống ngực thêu Phượng Ngũ Sắc) */}
              <g id="inner-collar-ivory-band">
                {/* Dải nẹp kem bên trái */}
                <path
                  d="M 172 92 L 198 178 L 186 178 L 172 92 Z"
                  fill="#FAF6EB"
                  stroke="#E5C365"
                  strokeWidth="0.8"
                />
                {/* Dải nẹp kem bên phải */}
                <path
                  d="M 228 92 L 202 178 L 214 178 L 228 92 Z"
                  fill="#FAF6EB"
                  stroke="#E5C365"
                  strokeWidth="0.8"
                />

                {/* Hoa văn dây lá thảo mộc ngũ sắc uốn lượn nửa trên */}
                <g id="ivory-floral-scrolls" strokeWidth="0.8" fill="none">
                  <path d="M 174 105 Q 182 118 180 132" stroke="#1E3A8A" />
                  <circle cx="180" cy="115" r="1.3" fill="#059669" />
                  <circle cx="182" cy="132" r="1.3" fill="#D97706" />

                  <path d="M 226 105 Q 218 118 220 132" stroke="#1E3A8A" />
                  <circle cx="220" cy="115" r="1.3" fill="#059669" />
                  <circle cx="218" cy="132" r="1.3" fill="#D97706" />
                </g>

                {/* 2 CHIM PHƯỢNG HOÀNG NGŨ SẮC ĐỐI XỨNG Ở CHÂN DẢI NẸP KEM (Chầu Cúc Ngực) */}
                {/* Phượng Hoàng Trái */}
                <g id="phoenix-left-collar" transform="translate(187, 160)">
                  <path d="M -3 10 C -2 3, 2 0, 5 -2 C 6 -3, 8 -3, 9 -1 C 10 1, 9 3, 6 5 C 3 7, 0 12, -2 16 Z" fill="#0284C7" />
                  <path d="M 9 -1 L 12 -1 L 8 1 Z" fill="#EAB308" />
                  <path d="M 7 -3 C 8 -7, 6 -9, 5 -10" stroke="#DC2626" strokeWidth="1.2" fill="none" />
                  <path d="M 2 2 C -3 -2, -7 0, -8 4 C -5 6, -1 5, 2 4" fill="#059669" />
                  <path d="M -2 16 C -6 18, -10 14, -8 8 C -9 4, -4 6, -3 12" stroke="#EA580C" strokeWidth="1.2" fill="none" />
                  <path d="M -2 16 C -4 20, -8 20, -9 16" stroke="#EAB308" strokeWidth="1" fill="none" />
                </g>

                {/* Phượng Hoàng Phải */}
                <g id="phoenix-right-collar" transform="translate(213, 160)">
                  <path d="M 3 10 C 2 3, -2 0, -5 -2 C -6 -3, -8 -3, -9 -1 C -10 1, -9 3, -6 5 C -3 7, 0 12, 2 16 Z" fill="#0284C7" />
                  <path d="M -9 -1 L -12 -1 L -8 1 Z" fill="#EAB308" />
                  <path d="M -7 -3 C -8 -7, -6 -9, -5 -10" stroke="#DC2626" strokeWidth="1.2" fill="none" />
                  <path d="M -2 2 C 3 -2, 7 0, 8 4 C 5 6, 1 5, -2 4" fill="#059669" />
                  <path d="M 2 16 C 6 18, 10 14, 8 8 C 9 4, 4 6, 3 12" stroke="#EA580C" strokeWidth="1.2" fill="none" />
                  <path d="M 2 16 C 4 20, 8 20, 9 16" stroke="#EAB308" strokeWidth="1" fill="none" />
                </g>
              </g>

              {/* 4. CÚC CÀI TRÒN LỚN HOÀNG GIA CHÍNH GIỮA NGỰC TẠI (200, 180) */}
              {/* Điểm nhấn quyền quý của Áo Nhật Bình - Nhận diện Cúc Kim Loại, Cúc Ngọc, Cúc Gỗ, Cúc Vải */}
              {renderAuthenticButton(200, 180, 9.5, true)}
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* 4. ÁO GIAO LĨNH CỔ CHÉO CHỮ Y (THỜI LÝ - TRẦN - LÊ)       */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* 4. ÁO GIAO LĨNH CỔ VẠT CHÉO (CHUẨN ẢNH REF ao-giao-linh.jpg) */}
        {/* ======================================================== */}
        {type === 'giao_linh' && (
          <g id="ao-giao-linh-authentic">
            {/* Lớp váy/quần lụa bên trong hé lộ dưới gấu áo và khe xẻ tà */}
            <path d="M 130 380 L 105 480 L 295 480 L 270 380 Z" fill="#801018" opacity="0.3" />
            <path d="M 140 450 L 115 485 L 285 485 L 260 450 Z" fill="#1C1917" opacity="0.4" />

            {/* TAY ÁO BÊN TRÁI (Buông rủ mềm mại) */}
            <g id="giao-linh-sleeve-left">
              {/* Lớp vải áo ngoài tay trái */}
              <path
                d="M 152 98 C 110 108, 60 125, 25 150 C 22 170, 20 205, 32 250 C 65 255, 105 245, 134 212 Z"
                fill={`url(#robeGrad-${type})`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <path d="M 152 98 C 110 108, 60 125, 25 150 C 22 170, 20 205, 32 250 C 65 255, 105 245, 134 212 Z" fill={`url(#brocade-${type})`} />
              <path d="M 152 98 C 110 108, 60 125, 25 150 C 22 170, 20 205, 32 250 C 65 255, 105 245, 134 212 Z" fill="url(#silkSheen)" />

              {/* LỚP LÓT ĐỎ RỰC RỠ BÊN TRONG CỬA TAY TRÁI (Chuẩn ảnh mẫu ref ao-giao-linh.jpg) */}
              <path
                d="M 25 150 C 28 175, 32 215, 32 250 C 22 230, 22 180, 25 150 Z"
                fill="#C5283D"
                stroke="#9E2031"
                strokeWidth="0.8"
                filter="url(#softShadowFilter)"
              />
              {/* Nếp gấp lụa tự nhiên trên tay trái */}
              <path d="M 65 140 C 55 175, 60 215, 75 245" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.25" fill="none" />
              <path d="M 105 130 C 95 165, 100 200, 110 225" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
            </g>

            {/* TAY ÁO BÊN PHẢI (Có lót đỏ rực rỡ ở cửa tay) */}
            <g id="giao-linh-sleeve-right">
              {/* Lớp vải áo ngoài tay phải */}
              <path
                d="M 248 98 C 290 108, 340 125, 375 150 C 378 170, 380 205, 368 250 C 335 255, 295 245, 266 212 Z"
                fill={`url(#robeGrad-${type})`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <path d="M 248 98 C 290 108, 340 125, 375 150 C 378 170, 380 205, 368 250 C 335 255, 295 245, 266 212 Z" fill={`url(#brocade-${type})`} />
              <path d="M 248 98 C 290 108, 340 125, 375 150 C 378 170, 380 205, 368 250 C 335 255, 295 245, 266 212 Z" fill="url(#silkSheen)" />

              {/* LỚP LÓT ĐỎ RỰC RỠ BÊN TRONG CỬA TAY PHẢI (Chuẩn ảnh mẫu ref ao-giao-linh.jpg) */}
              <path
                d="M 375 150 C 372 175, 368 215, 368 250 C 378 230, 378 180, 375 150 Z"
                fill="#C5283D"
                stroke="#9E2031"
                strokeWidth="0.8"
                filter="url(#softShadowFilter)"
              />
              {/* Nếp gấp lụa tự nhiên trên tay phải */}
              <path d="M 335 140 C 345 175, 340 215, 325 245" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.25" fill="none" />
              <path d="M 295 130 C 305 165, 300 200, 290 225" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
            </g>

            {/* THÂN ÁO SUÔNG MỀM DÁNG CHỮ A (Không bị đơ, có nếp rủ lụa) */}
            <path
              d="M 152 98 C 140 105, 134 150, 130 210 C 126 270, 112 375, 78 476 C 145 484, 255 484, 322 476 C 288 375, 274 270, 270 210 C 266 150, 260 105, 248 98 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 152 98 C 140 105, 134 150, 130 210 C 126 270, 112 375, 78 476 C 145 484, 255 484, 322 476 C 288 375, 274 270, 270 210 C 266 150, 260 105, 248 98 Z" fill={`url(#brocade-${type})`} />
            <path d="M 152 98 C 140 105, 134 150, 130 210 C 126 270, 112 375, 78 476 C 145 484, 255 484, 322 476 C 288 375, 274 270, 270 210 C 266 150, 260 105, 248 98 Z" fill="url(#silkSheen)" />

            {/* NẾP RỦ LỤA DỌC THÂN ÁO TỰ NHIÊN */}
            <path d="M 175 140 C 170 230, 160 340, 145 470" stroke="#000000" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <path d="M 178 140 C 173 230, 163 340, 148 470" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
            <path d="M 225 150 C 235 240, 248 350, 255 472" stroke="#000000" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <path d="M 227 150 C 237 240, 250 350, 257 472" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />

            {/* VAT TRONG (Vạt bên phải đi chéo vào nách trái) */}
            <path d="M 238 98 L 152 240 L 152 285 L 238 98 Z" fill="#000000" opacity="0.15" />

            {/* LỚP ÁO LÓT ĐƠN Y CỔ CHỮ V / GIAO LĨNH TRẮNG BÊN TRONG */}
            {hasDonY ? (
              <g id="giao-linh-don-y-collar" filter="url(#softShadowFilter)">
                {/* Vạt áo lót trắng bên phải */}
                <path d="M 172 90 L 198 135 L 208 135 L 180 90 Z" fill="#FAF7F0" stroke="#E5C365" strokeWidth="0.8" />
                {/* Vạt áo lót trắng bên trái vắt đè lên */}
                <path d="M 228 90 L 195 135 L 185 135 L 220 90 Z" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" />
                {/* Đường viền cổ lót trắng cao thanh khiết */}
                <path d="M 176 90 L 198 132 L 224 90" stroke="#FAF7F0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 176 90 L 198 132 L 224 90" stroke="#E5C365" strokeWidth="1" fill="none" />
              </g>
            ) : (
              // Không có Đơn Y: Lộ da thịt tự nhiên ở cổ chữ V
              <path d="M 178 92 L 200 138 L 222 92 Z" fill="#D6A38B" opacity="0.85" />
            )}

            {/* VAT ÁO NGOÀI BÊN TRÁI VẮT CHÉO SANG SƯỜN PHẢI (Tạo thành chữ Y mềm mại) */}
            <path
              d="M 160 98 L 246 250 L 250 475 C 235 476, 200 477, 165 477 L 160 98 Z"
              fill={primaryColor}
              opacity="0.35"
            />

            {/* NẸP CỔ ÁO TO BẢN (Wide Diagonal Collar Band - Chuẩn ảnh mẫu ref ao-giao-linh.jpg) */}
            {/* 1. Nẹp cổ vạt phải (chạy từ vai phải vào ngực) */}
            <path
              d="M 238 98 L 195 175"
              stroke="#FFF1F2"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
              filter="url(#softShadowFilter)"
            />
            <path
              d="M 238 98 L 195 175"
              stroke={primaryColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
            <path
              d="M 238 98 L 195 175"
              stroke="#E5C365"
              strokeWidth="1"
              fill="none"
            />

            {/* 2. Nẹp cổ vạt trái TO BẢN vắt chéo sang sườn phải (Tả nhẫm đè lên hữu nhẫm) */}
            <path
              d="M 162 98 L 246 252"
              stroke="#FFF1F2"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
              filter="url(#softShadowFilter)"
            />
            <path
              d="M 162 98 L 246 252"
              stroke={primaryColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 162 98 L 246 252"
              stroke="#E5C365"
              strokeWidth="1.2"
              fill="none"
            />

            {/* CHUỖI HẠT ĐỎ TRÀNG HẠT CỔ PHONG (Chuẩn ảnh mẫu ref ao-giao-linh.jpg) */}
            <g id="giao-linh-red-beads" filter="url(#softShadowFilter)">
              <path
                d="M 184 94 C 182 120, 192 148, 200 148 C 208 148, 218 120, 216 94"
                stroke="#991B1B"
                strokeWidth="1"
                fill="none"
              />
              {[
                { cx: 184, cy: 96 }, { cx: 184, cy: 104 }, { cx: 185, cy: 112 },
                { cx: 187, cy: 120 }, { cx: 190, cy: 128 }, { cx: 194, cy: 136 },
                { cx: 198, cy: 143 }, { cx: 200, cy: 146 }, { cx: 202, cy: 143 },
                { cx: 206, cy: 136 }, { cx: 210, cy: 128 }, { cx: 213, cy: 120 },
                { cx: 215, cy: 112 }, { cx: 216, cy: 104 }, { cx: 216, cy: 96 }
              ].map((bead, i) => (
                <circle key={i} cx={bead.cx} cy={bead.cy} r="2.2" fill="#DC2626" stroke="#7F1D1D" strokeWidth="0.5" />
              ))}
            </g>

            {/* DẢI LỤA BUỘC THẮT NƠ BÊN SƯỜN PHẢI (Chuẩn ảnh mẫu ref ao-giao-linh.jpg) */}
            {/* Vị trí sườn phải: x = 246, y = 252 */}
            <g id="giao-linh-side-ribbon" filter="url(#softShadowFilter)">
              {/* Nút thắt nơ mềm mại */}
              <ellipse cx="246" cy="252" rx="6" ry="4" fill="#FFF1F2" stroke="#E5C365" strokeWidth="1" />
              <circle cx="246" cy="252" r="3" fill={primaryColor} opacity="0.7" />
              {/* Nút cúc khuy nhỏ nếu có chọn cúc */}
              {renderAuthenticButton(246, 252, 3.8, false)}

              {/* Cánh nơ hướng lên & sang bên */}
              <path d="M 246 250 C 242 242, 238 240, 236 244 C 235 248, 240 252, 246 252 Z" fill="#FFF1F2" stroke="#E5C365" strokeWidth="0.8" />
              <path d="M 246 252 C 252 245, 258 244, 259 248 C 260 252, 252 254, 246 252 Z" fill="#FFF1F2" stroke="#E5C365" strokeWidth="0.8" />
              
              {/* 2 Dải lụa mềm buông rủ dài tha thướt xuống tà áo */}
              <path
                d="M 245 254 C 243 285, 240 330, 241 380 L 246 380 C 246 330, 248 285, 248 254 Z"
                fill="#FFF1F2"
                stroke="#E5C365"
                strokeWidth="0.8"
              />
              <path
                d="M 247 254 C 250 290, 254 340, 252 400 L 257 400 C 259 340, 254 290, 250 254 Z"
                fill="#FFF1F2"
                stroke="#E5C365"
                strokeWidth="0.8"
              />
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* 5. ÁO VIÊN LĨNH CỔ TRÒN (CHUẨN ẢNH REF ao-vien-linh.webp)   */}
        {/* ======================================================== */}
        {type === 'vien_linh' && (
          <g id="ao-vien-linh-authentic">
            {/* Lớp chân váy dài màu đen hé lộ dưới gấu áo (Chuẩn ảnh mẫu ao-vien-linh.webp) */}
            <path
              d="M 125 440 L 78 488 C 145 494, 255 494, 322 488 L 275 440 Z"
              fill="#111116"
              stroke="#000000"
              strokeWidth="1"
            />
            {/* Nếp xếp ly của chân váy đen bên dưới */}
            <path d="M 140 450 L 130 490" stroke="#262626" strokeWidth="1.2" />
            <path d="M 170 455 L 165 492" stroke="#262626" strokeWidth="1.2" />
            <path d="M 200 456 L 200 493" stroke="#262626" strokeWidth="1.2" />
            <path d="M 230 455 L 235 492" stroke="#262626" strokeWidth="1.2" />
            <path d="M 260 450 L 270 490" stroke="#262626" strokeWidth="1.2" />

            {/* TAY ÁO BÊN TRÁI THỤNG RỘNG (Buông dài tha thướt) */}
            <g id="vien-linh-sleeve-left">
              <path
                d="M 154 94 C 110 105, 55 125, 20 152 C 16 185, 18 235, 34 275 C 68 280, 108 268, 134 220 Z"
                fill={`url(#robeGrad-${type})`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <path d="M 154 94 C 110 105, 55 125, 20 152 C 16 185, 18 235, 34 275 C 68 280, 108 268, 134 220 Z" fill={`url(#brocade-${type})`} />
              <path d="M 154 94 C 110 105, 55 125, 20 152 C 16 185, 18 235, 34 275 C 68 280, 108 268, 134 220 Z" fill="url(#silkSheen)" />

              {/* Lớp lót xanh đen bên trong cửa tay áo */}
              <path
                d="M 20 152 C 24 185, 28 235, 34 275 C 22 250, 18 190, 20 152 Z"
                fill="#0B1320"
                stroke="#050B14"
                strokeWidth="0.8"
              />
              {/* Nếp gấp lụa tự nhiên ở tay áo trái */}
              <path d="M 68 150 C 60 190, 68 235, 82 265" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
            </g>

            {/* TAY ÁO BÊN PHẢI THỤNG RỘNG (Buông dài tha thướt) */}
            <g id="vien-linh-sleeve-right">
              <path
                d="M 246 94 C 290 105, 345 125, 380 152 C 384 185, 382 235, 366 275 C 332 280, 292 268, 266 220 Z"
                fill={`url(#robeGrad-${type})`}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <path d="M 246 94 C 290 105, 345 125, 380 152 C 384 185, 382 235, 366 275 C 332 280, 292 268, 266 220 Z" fill={`url(#brocade-${type})`} />
              <path d="M 246 94 C 290 105, 345 125, 380 152 C 384 185, 382 235, 366 275 C 332 280, 292 268, 266 220 Z" fill="url(#silkSheen)" />

              {/* Lớp lót xanh đen bên trong cửa tay áo phải */}
              <path
                d="M 380 152 C 376 185, 372 235, 366 275 C 378 250, 382 190, 380 152 Z"
                fill="#0B1320"
                stroke="#050B14"
                strokeWidth="0.8"
              />
              {/* Nếp gấp lụa tự nhiên ở tay áo phải */}
              <path d="M 332 150 C 340 190, 332 235, 318 265" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
            </g>

            {/* THÂN ÁO VIÊN LĨNH SUÔNG RỘNG DÁNG CHỮ A */}
            <path
              d="M 154 94 C 142 100, 134 145, 130 210 C 126 270, 115 370, 84 468 C 145 476, 255 476, 316 468 C 285 370, 274 270, 270 210 C 266 145, 258 100, 246 94 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 154 94 C 142 100, 134 145, 130 210 C 126 270, 115 370, 84 468 C 145 476, 255 476, 316 468 C 285 370, 274 270, 270 210 C 266 145, 258 100, 246 94 Z" fill={`url(#brocade-${type})`} />
            <path d="M 154 94 C 142 100, 134 145, 130 210 C 126 270, 115 370, 84 468 C 145 476, 255 476, 316 468 C 285 370, 274 270, 270 210 C 266 145, 258 100, 246 94 Z" fill="url(#silkSheen)" />

            {/* NẾP GẤP TRUNG TÂM (Central Box Pleat / Fold buông từ eo xuống) */}
            <path d="M 195 215 L 192 468" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.18" />
            <path d="M 205 215 L 208 468" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.18" />
            <path d="M 196 215 L 194 468" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.15" />
            <path d="M 204 215 L 206 468" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.15" />

            {/* DẢI LỤA TRẮNG THẮT NGANG EO CAO (Chuẩn ảnh mẫu ref ao-vien-linh.webp) */}
            {/* Dải thắt lưng trắng ngang ngực/eo cao: y = 210-218 */}
            <g id="vien-linh-white-ribbon" filter="url(#softShadowFilter)">
              {/* Dải lụa trắng ôm ngang eo */}
              <rect x="142" y="210" width="116" height="10" rx="3" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.8" />
              <line x1="142" y1="215" x2="258" y2="215" stroke="#D1D5DB" strokeWidth="0.5" />

              {/* Nút thắt nơ tinh xảo ở giữa */}
              <circle cx="200" cy="215" r="4.5" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="0.8" />

              {/* 2 DẢI LỤA TRẮNG DÀI RỦ THẲNG XUỐNG GẦN GẤU ÁO (Long White Tails) */}
              {/* Dải trái: x = 188 */}
              <rect x="187" y="215" width="7" height="185" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.6" />
              <circle cx="190.5" cy="402" r="3.5" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
              {/* Tua rua trắng chân dải trái (White Tassel) */}
              <g transform="translate(190.5, 405)">
                <path d="M -3 0 L 3 0 L 4 28 L -4 28 Z" fill="#F8F8FA" stroke="#D1D5DB" strokeWidth="0.5" />
                <line x1="-2" y1="2" x2="-3" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
                <line x1="0" y1="2" x2="0" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
                <line x1="2" y1="2" x2="3" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
              </g>

              {/* Dải phải: x = 205 */}
              <rect x="205" y="215" width="7" height="185" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.6" />
              <circle cx="208.5" cy="402" r="3.5" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
              {/* Tua rua trắng chân dải phải (White Tassel) */}
              <g transform="translate(208.5, 405)">
                <path d="M -3 0 L 3 0 L 4 28 L -4 28 Z" fill="#F8F8FA" stroke="#D1D5DB" strokeWidth="0.5" />
                <line x1="-2" y1="2" x2="-3" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
                <line x1="0" y1="2" x2="0" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
                <line x1="2" y1="2" x2="3" y2="28" stroke="#9CA3AF" strokeWidth="0.5" />
              </g>
            </g>

            {/* ĐƯỜNG VẠT ÁO XẺ LỆCH SANG SƯỜN PHẢI (Kéo dài tha thướt xuống eo & nách phải) */}
            <g id="vien-linh-extended-flap" filter="url(#softShadowFilter)">
              {/* Bóng đổ của nếp vạt đè lên thân trong */}
              <path
                d="M 224 94 C 235 102, 244 116, 246 128 C 251 155, 258 188, 268 220"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Đường vạt áo ngoài màu trắng sáng thanh thoát */}
              <path
                d="M 224 94 C 235 102, 244 116, 246 128 C 251 155, 258 188, 268 220"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeOpacity="0.55"
                strokeLinecap="round"
                fill="none"
              />
              {/* Chỉ viền kim tuyến vàng thêu mép vạt áo */}
              <path
                d="M 224 94 C 235 102, 244 116, 246 128 C 251 155, 258 188, 268 220"
                stroke="#E5C365"
                strokeWidth="0.8"
                strokeDasharray="4 2"
                strokeOpacity="0.75"
                fill="none"
              />
            </g>

            {/* CÚC ÁO VIÊN LĨNH TO RÕ RÀNG (Kích thước chuẩn, đơm quai cài sang 2 bên vạt) */}
            {/* Cúc 1: Ở vai/chân cổ trên đường vạt áo */}
            {renderAuthenticButton(244, 124, 6.5, true)}
            {/* Cúc 2: Dưới thân vạt áo kéo dài tha thướt */}
            {renderAuthenticButton(254, 172, 6.2, true)}

            {/* CỔ ÁO VIÊN LĨNH: Cổ tròn viền nhẹ ôm khít chân cổ */}
            <g id="vien-linh-collar-group" filter="url(#softShadowFilter)">
              {/* Cổ áo lót trắng bên trong (Mandarin/Cross collar Đơn Y nhô lên) */}
              {hasDonY ? (
                <g id="vien-linh-white-inner-collar">
                  {/* Cổ áo lót trắng thanh khiết nhô lên khỏi cổ tròn ngoài */}
                  <path
                    d="M 178 92 C 178 68, 222 68, 222 92 Z"
                    fill="#FFFFFF"
                    stroke="#E5C365"
                    strokeWidth="1"
                  />
                  {/* Vạt chéo lót trắng của Áo Đơn Y bên trong */}
                  <path d="M 184 88 L 200 96 L 216 88" stroke="#E5C365" strokeWidth="0.8" fill="none" />
                </g>
              ) : (
                <ellipse cx="200" cy="92" rx="22" ry="12" fill="#D6A38B" opacity="0.8" />
              )}

              {/* Đường khoét cổ tròn của Áo Ngoài Viên Lĩnh (Chuẩn ảnh mẫu ao-vien-linh.webp) */}
              <ellipse cx="200" cy="95" rx="28" ry="13" fill="none" stroke={primaryColor} strokeWidth="5" />
              <ellipse cx="200" cy="95" rx="28" ry="13" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.5" />
              <ellipse cx="200" cy="95" rx="26" ry="11.5" fill="none" stroke="#E5C365" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* CỔ ÁO ĐỨNG (LẬP LĨNH) CHO ÁO NGŨ THÂN VÀ ÁO TẤC           */}
        {/* ======================================================== */}
        {(type === 'ngu_than' || type === 'ao_tac') && (
          <g id="mandarin-collar-group">
            {/* Áo Đơn Y peeking 2-3mm */}
            {hasDonY ? (
              <path
                d="M 168 88 C 168 83, 232 83, 232 88 L 234 100 L 166 100 Z"
                fill="#FFFFFF"
                stroke="#E5C365"
                strokeWidth="1.3"
                filter="url(#softShadowFilter)"
              />
            ) : (
              <path
                d="M 169 91 C 169 88, 231 88, 231 91 L 232 100 L 168 100 Z"
                fill="#C68A6D"
                opacity="0.75"
              />
            )}

            {/* Cổ Đứng Áo Ngoài */}
            <path
              d="M 166 94 C 166 89, 234 89, 234 94 L 240 116 L 160 116 Z"
              fill={primaryColor}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path
              d="M 166 94 C 166 89, 234 89, 234 94"
              stroke="#E5C365"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 5 CÚC NGŨ THƯỜNG DỌC VẠT HÒ CÀI CHÉO SANG NÁCH PHẢI       */}
        {/* ======================================================== */}
        {(type === 'ngu_than' || type === 'ao_tac') && (
          <g id="buttons-group">
            {[
              { id: 1, cx: 222, cy: 104 },
              { id: 2, cx: 228, cy: 144 },
              { id: 3, cx: 235, cy: 188 },
              { id: 4, cx: 238, cy: 234 },
              { id: 5, cx: 240, cy: 284 }
            ].map(btn => renderAuthenticButton(btn.cx, btn.cy, 5.8, true))}
          </g>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE HOTSPOTS                                     */}
        {/* ======================================================== */}
        {interactive && (
          <g id="interactive-hotspots">
            {/* Hotspot 1: Cổ Áo Đơn Y */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectHotspot && onSelectHotspot('collar')}
            >
              <circle cx="200" cy="90" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
              <circle cx="200" cy="90" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
            </g>

            {/* Hotspot 2: 5 Cúc Ngũ Thường */}
            {type !== 'nhat_binh' && (
              <g
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectHotspot && onSelectHotspot('buttons')}
              >
                <circle cx="235" cy="188" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="235" cy="188" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
              </g>
            )}

            {/* Hotspot 3: Thân Áo (Đường Can Trung Phẫu & Tà Áo) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectHotspot && onSelectHotspot('panels')}
            >
              <circle cx="160" cy="270" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
              <circle cx="160" cy="270" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
            </g>

            {/* Hotspot 4: Nhật Bình Pattern (Thủy Ba Tam Sơn / Phượng Ổ) */}
            {type === 'nhat_binh' && (
              <g
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectHotspot && onSelectHotspot('pattern')}
              >
                <circle cx="200" cy="420" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="200" cy="420" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Floating Status Badges inside visualizer (only when standalone) */}
      {!borderless && (
        <>
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 text-xs max-w-[280px]">
            {/* Garment type badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-stone-300 w-fit">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>
                {type === 'ngu_than' ? 'Áo Ngũ Thân Tay Chẽn' : 
                 type === 'ao_tac' ? 'Áo Tấc (Tay Thụng)' : 
                 type === 'nhat_binh' ? 'Áo Nhật Bình Cung Đình' : 
                 type === 'giao_linh' ? 'Áo Giao Lĩnh Cổ Chéo' : 
                 'Áo Viên Lĩnh Cổ Tròn'}
              </span>
            </div>

            {/* Live Button Status Badge on Preview */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded backdrop-blur-md border text-[11px] font-medium transition-all w-fit ${
                isChineseButton 
                  ? 'bg-rose-950/85 border-rose-500/80 text-rose-200 shadow-md' 
                  : 'bg-black/70 border-white/15 text-stone-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30" style={{ backgroundColor: buttonFill }} />
              <span className="truncate">{buttonConfig.label}</span>
              {isChineseButton ? (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider">
                  Phạm Húy
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px]">
                  Chuẩn
                </span>
              )}
            </div>
          </div>

          {/* TABOOS WARNING BANNER ON VISUALIZER WHEN CHINESE BUTTON IS SELECTED */}
          {isChineseButton && (
            <div className="absolute top-20 left-4 right-4 p-2.5 rounded-xl bg-rose-950/95 border border-rose-500 text-rose-200 text-xs shadow-xl flex items-center gap-2.5 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="leading-tight">
                <strong className="text-rose-100 font-bold block">CẢNH BÁO VI PHẠM QUY CHUẨN!</strong>
                <span className="text-[11px] text-rose-200/90">
                  Ngũ Thân & Nhật Bình triều Nguyễn cấm cúc vải Tàu, chỉ dùng cúc kim loại/gỗ/ngọc!
                </span>
              </div>
            </div>
          )}

          {/* Bottom right Don Y Status Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {hasDonY ? (
              <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-medium backdrop-blur-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã có Đơn Y trắng</span>
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-1 rounded bg-rose-950/90 border border-rose-500/60 text-rose-200 font-medium animate-pulse backdrop-blur-sm flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Thiếu Áo Đơn Y</span>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
