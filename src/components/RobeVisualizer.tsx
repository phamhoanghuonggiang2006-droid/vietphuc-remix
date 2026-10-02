import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RobeVisualizerProps {
  type: 'ngu_than' | 'ao_tac' | 'nhat_binh';
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
    switch (buttonType) {
      case 'btn-jade-green':
        return {
          fill: 'url(#btnJadeGreen)',
          stroke: '#E5C365',
          cordColor: '#10B981',
          label: 'Cúc Ngọc (Ngọc Bích / Cẩm Thạch)',
          isTaboo: false
        };
      case 'btn-wood-agarwood':
        return {
          fill: 'url(#btnWoodAgarwood)',
          stroke: '#C5A059',
          cordColor: '#D4AF37',
          label: 'Cúc Gỗ (Trầm Hương Khắc Chữ Thọ)',
          isTaboo: false
        };
      case 'btn-chinese-cloth':
        return {
          fill: 'url(#btnChineseCloth)',
          stroke: '#991B1B',
          cordColor: '#DC2626',
          label: 'Cúc Vải / Cúc Tàu (Phạm Húy Triều Đình)',
          isTaboo: true
        };
      case 'btn-metal-copper':
      default:
        return {
          fill: 'url(#btnMetalCopper)',
          stroke: '#E5C365',
          cordColor: '#E5C365',
          label: 'Cúc Kim Loại (Đồng Chạm Bát Bửu)',
          isTaboo: false
        };
    }
  };

  const buttonConfig = getButtonConfig();
  const buttonFill = buttonConfig.fill;
  const isChineseButton = buttonConfig.isTaboo;

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
        className="w-full h-full max-w-[360px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition-all duration-500"
      >
        <defs>
          {/* Pure Luminous Robe Gradient (Zero black/dark shadow) */}
          <linearGradient id={`robeGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="60%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.96" />
          </linearGradient>

          {/* Continuous Interlocking S-Wave Damask Brocade Pattern (Vân Gấm Sóng Mây Triều Nguyễn) */}
          <pattern id={`brocade-${type}`} width="56" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 0 20 Q 14 8 28 20 Q 42 32 56 20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            <path
              d="M 0 0 Q 14 12 28 0 Q 42 -12 56 0"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            <path
              d="M 0 40 Q 14 52 28 40 Q 42 28 56 40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            <path
              d="M 28 0 Q 16 10 28 20 Q 40 30 28 40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            <path
              d="M 0 0 Q -12 10 0 20 Q 12 30 0 40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            <path
              d="M 56 0 Q 44 10 56 20 Q 68 30 56 40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeOpacity="0.14"
            />
            {/* Intersecting golden blossom dots */}
            <circle cx="28" cy="20" r="1.3" fill="#D4AF37" fillOpacity="0.25" />
            <circle cx="0" cy="0" r="1.3" fill="#D4AF37" fillOpacity="0.25" />
            <circle cx="56" cy="0" r="1.3" fill="#D4AF37" fillOpacity="0.25" />
            <circle cx="0" cy="40" r="1.3" fill="#D4AF37" fillOpacity="0.25" />
            <circle cx="56" cy="40" r="1.3" fill="#D4AF37" fillOpacity="0.25" />
          </pattern>

          {/* Pure White Luminous Silk Highlight (Zero black tones) */}
          <linearGradient id="silkSheen" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
          </linearGradient>

          {/* Nhật Bình Rainbow Collar Gradient (Bản Cổ Ngũ Sắc) */}
          <linearGradient id="nhatBinhCollarRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="22%" stopColor="#059669" />
            <stop offset="48%" stopColor="#F59E0B" />
            <stop offset="74%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

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

          {/* Gentle Drop Shadow (No muddy black wash) */}
          <filter id="softShadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.22"/>
          </filter>
        </defs>

        {/* TRADITIONAL ATELIER WOODEN HANGER (Treo Áo Cổ Phục Lịch Lãm) */}
        <g id="traditional-wooden-hanger" opacity={borderless ? 0.75 : 0.9}>
          {/* Ring Hook */}
          <circle cx="200" cy="56" r="8.5" fill="none" stroke="#2F2F3B" strokeWidth="2.5" />
          <path d="M 200 64.5 L 200 74" stroke="#2F2F3B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Curved Hanger Bar */}
          <path
            d="M 152 110 Q 200 76 248 110 L 242 115 Q 200 86 158 115 Z"
            fill="#272732"
            stroke="#1D1D26"
            strokeWidth="1"
          />
        </g>

        {/* HAUTE COUTURE MANNEQUIN: HEAD & NECK */}
        <g id="mannequin-head-neck" filter="url(#softShadowFilter)">
          {/* Neck */}
          <path
            d="M 184 56 L 184 96 Q 200 99 216 96 L 216 56 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.6"
          />
          {/* Subtle neck contours */}
          <path d="M 193 64 Q 195 82 194 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none" />
          <path d="M 207 64 Q 205 82 206 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none" />

          {/* Top Cranial Knot / Búi Tóc Cổ Phục */}
          <ellipse cx="200" cy="18" rx="14" ry="9" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.6" />
          <circle cx="200" cy="18" r="3" fill="#FFF3B0" />

          {/* Head & Sculpted Jaw */}
          <path
            d="M 172 42 C 166 16, 234 16, 228 42 C 228 60, 215 74, 200 78 C 185 74, 172 60, 172 42 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.8"
          />

          {/* Eyebrows */}
          <path d="M 183 38 Q 190 35 195 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 205 38 Q 210 35 217 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <path
            d="M 200 34 L 202 48 L 198 52 L 201 54"
            stroke="#8E7B68"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Lips */}
          <path d="M 193 63 Q 200 66 207 63" stroke="#8E7B68" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Sculpted cheek facet */}
          <path
            d="M 178 48 Q 188 64 200 73 Q 212 64 222 48"
            stroke="#C5A059"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            fill="none"
          />
        </g>

        {/* ======================================================== */}
        {/* 1. ÁO NGŨ THÂN TAY CHẼN (Theo Mẫu Reference 3)            */}
        {/* ======================================================== */}
        {type === 'ngu_than' && (
          <g id="ao-ngu-than-tay-chen">
            {/* Tapered Sleeves (Tay Chẽn Thon Gọn Xuống Cổ Tay) */}
            {/* Left Sleeve */}
            <path
              d="M 132 114 L 78 205 L 102 278 L 126 265 L 132 178 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 132 114 L 78 205 L 102 278 L 126 265 L 132 178 Z" fill={`url(#brocade-${type})`} />
            <path d="M 132 114 L 78 205 L 102 278 L 126 265 L 132 178 Z" fill="url(#silkSheen)" />

            {/* Right Sleeve */}
            <path
              d="M 268 114 L 322 205 L 298 278 L 274 265 L 268 178 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 268 114 L 322 205 L 298 278 L 274 265 L 268 178 Z" fill={`url(#brocade-${type})`} />
            <path d="M 268 114 L 322 205 L 298 278 L 274 265 L 268 178 Z" fill="url(#silkSheen)" />

            {/* Golden Cuff Borders (Bo Viền Cửa Tay Áo Chẽn) */}
            <line x1="78" y1="205" x2="102" y2="278" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="322" y1="205" x2="298" y2="278" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M 102 278 L 78 266" stroke="#E5C365" strokeWidth="3" strokeLinecap="round" />
            <path d="M 298 278 L 322 266" stroke="#E5C365" strokeWidth="3" strokeLinecap="round" />

            {/* 2 BÀN TAY MA NƠ CANH (XUẤT PHÁT TỰ NHIÊN TỪ CỬA TAY CHẼN) */}
            <g id="mannequin-hands-ngu-than">
              {/* Bàn tay trái */}
              <g transform="translate(88, 272) rotate(32)" filter="url(#softShadowFilter)">
                <path
                  d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 22 L -7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>

              {/* Bàn tay phải */}
              <g transform="translate(312, 272) rotate(-32)" filter="url(#softShadowFilter)">
                <path
                  d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 22 L 7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Main Robe Body (Thân Áo Ngũ Thân Xuôi Dài) */}
            <path
              d="M 132 110 L 268 110 L 298 475 L 102 475 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 132 110 L 268 110 L 298 475 L 102 475 Z" fill={`url(#brocade-${type})`} />
            <path d="M 132 110 L 268 110 L 298 475 L 102 475 Z" fill="url(#silkSheen)" />

            {/* Đường Viền Vạt Cửa Dưới Gấu Áo */}
            <line x1="102" y1="475" x2="298" y2="475" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" />

            {/* Đường Trung Phẫu Giữa Thân Trước (Signature seam join) */}
            <line
              x1="200"
              y1="168"
              x2="200"
              y2="475"
              stroke="rgba(255,255,255,0.24)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* Đường Vạt Chéo Hữu Khép (Vạt Con Áo Ngũ Thân) */}
            <path
              d="M 194 114 Q 224 145 234 185 L 244 475"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 2. ÁO TẤC / TAY THỤNG (Theo Mẫu Reference 2)              */}
        {/* ======================================================== */}
        {type === 'ao_tac' && (
          <g id="ao-tac-tay-thung">
            {/* Massive Ceremonial Flowing Sleeves (Tay Thụng Rộng Buông Thả) */}
            {/* Left Flowing Sleeve */}
            <path
              d="M 135 110 L 52 165 L 52 385 L 118 335 L 132 295 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 135 110 L 52 165 L 52 385 L 118 335 L 132 295 Z" fill={`url(#brocade-${type})`} />
            <path d="M 135 110 L 52 165 L 52 385 L 118 335 L 132 295 Z" fill="url(#silkSheen)" />

            {/* Right Flowing Sleeve */}
            <path
              d="M 265 110 L 348 165 L 348 385 L 282 335 L 268 295 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 265 110 L 348 165 L 348 385 L 282 335 L 268 295 Z" fill={`url(#brocade-${type})`} />
            <path d="M 265 110 L 348 165 L 348 385 L 282 335 L 268 295 Z" fill="url(#silkSheen)" />

            {/* Subtle Sleeve Flowing Fold Lines (Nếp Tay Thụng Rủ) */}
            <path d="M 92 195 L 75 370" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 308 195 L 325 370" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />

            {/* 2 BÀN TAY MA NƠ CANH DƯỚI CỬA TAY THỤNG */}
            <g id="mannequin-hands-ao-tac">
              <g transform="translate(85, 345) rotate(16)" filter="url(#softShadowFilter)">
                <path
                  d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 22 L -7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(315, 345) rotate(-16)" filter="url(#softShadowFilter)">
                <path
                  d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 22 L 7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Main Robe Body */}
            <path
              d="M 132 110 L 268 110 L 305 475 L 95 475 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 132 110 L 268 110 L 305 475 L 95 475 Z" fill={`url(#brocade-${type})`} />
            <path d="M 132 110 L 268 110 L 305 475 L 95 475 Z" fill="url(#silkSheen)" />

            {/* Gấu Áo Tấc Bo Viền Hoàng Kim */}
            <line x1="95" y1="475" x2="305" y2="475" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" />

            {/* Đường nếp gấp vạt chéo tà áo */}
            <path
              d="M 194 114 Q 224 148 235 190 L 248 475"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* 3. ÁO NHẬT BÌNH (Theo Mẫu Reference 1)                    */}
        {/* ======================================================== */}
        {type === 'nhat_binh' && (
          <g id="ao-nhat-binh">
            {/* Dark Side Undertunic Silhouettes for authentic 3D depth */}
            <path d="M 90 280 L 68 470 L 105 470 Z" fill="#24151C" opacity="0.65" />
            <path d="M 310 280 L 332 470 L 295 470 Z" fill="#24151C" opacity="0.65" />

            {/* Angled Sleeves with Ngũ Sắc Rainbow Stripes */}
            {/* Left Sleeve */}
            <path
              d="M 132 114 L 34 195 L 58 280 L 132 245 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 132 114 L 34 195 L 58 280 L 132 245 Z" fill={`url(#brocade-${type})`} />
            <path d="M 132 114 L 34 195 L 58 280 L 132 245 Z" fill="url(#silkSheen)" />

            {/* Right Sleeve */}
            <path
              d="M 268 114 L 366 195 L 342 280 L 268 245 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 268 114 L 366 195 L 342 280 L 268 245 Z" fill={`url(#brocade-${type})`} />
            <path d="M 268 114 L 366 195 L 342 280 L 268 245 Z" fill="url(#silkSheen)" />

            {/* NGŨ SẮC BANDS ON CUFFS (5 Dải Màu: Lam, Lục, Hoàng, Xích, Bạch) */}
            {/* Left Cuff Ngũ Sắc Bands */}
            <g transform="translate(34, 195) rotate(42)">
              <rect x="0" y="0" width="13" height="72" fill="#2563EB" />
              <rect x="13" y="0" width="13" height="72" fill="#059669" />
              <rect x="26" y="0" width="13" height="72" fill="#F59E0B" />
              <rect x="39" y="0" width="13" height="72" fill="#DC2626" />
              <rect x="52" y="0" width="13" height="72" fill="#F8F6F0" />
            </g>

            {/* Right Cuff Ngũ Sắc Bands */}
            <g transform="translate(312, 245) rotate(-42)">
              <rect x="0" y="0" width="13" height="72" fill="#F8F6F0" />
              <rect x="13" y="0" width="13" height="72" fill="#DC2626" />
              <rect x="26" y="0" width="13" height="72" fill="#F59E0B" />
              <rect x="39" y="0" width="13" height="72" fill="#059669" />
              <rect x="52" y="0" width="13" height="72" fill="#2563EB" />
            </g>

            {/* 2 BÀN TAY MA NƠ CANH DƯỚI DẢI NGŨ SẮC */}
            <g id="mannequin-hands-nhat-binh">
              <g transform="translate(68, 268) rotate(32)" filter="url(#softShadowFilter)">
                <path
                  d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 22 L -7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(332, 268) rotate(-32)" filter="url(#softShadowFilter)">
                <path
                  d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 22 L 7 33" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Main Robe Body */}
            <path
              d="M 132 110 L 268 110 L 298 472 L 102 472 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path d="M 132 110 L 268 110 L 298 472 L 102 472 Z" fill={`url(#brocade-${type})`} />
            <path d="M 132 110 L 268 110 L 298 472 L 102 472 Z" fill="url(#silkSheen)" />

            {/* Signature Scalloped Wave Hem with Gold Trim (Gấu Áo Lượn Sóng Hoàng Gia) */}
            <path
              d="M 102 470 Q 150 460 200 470 Q 250 460 298 470"
              stroke="#E5C365"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* SIGNATURE U-SHAPED RECTANGULAR COLLAR (BẢN CỔ CHỮ NHẬT NGŨ SẮC ĐÍNH HẠT) */}
            <path
              d="M 154 126 L 246 126 L 246 290 L 226 290 L 226 150 L 174 150 L 174 290 L 154 290 Z"
              fill="url(#nhatBinhCollarRainbow)"
              stroke="#E5C365"
              strokeWidth="2"
            />

            {/* Inner Gold Piping on U-Band */}
            <path
              d="M 174 290 L 174 150 L 226 150 L 226 290"
              stroke="#FFF3B0"
              strokeWidth="1"
              fill="none"
            />

            {/* 10 White Pearl Studs along the U-Band (5 Hạt Ngọc Trai Mỗi Bên) */}
            <g id="nhat-binh-pearls">
              {/* Left Column */}
              <circle cx="164" cy="165" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="195" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="225" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="255" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="280" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />

              {/* Right Column */}
              <circle cx="236" cy="165" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="195" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="225" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="255" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="280" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
            </g>

            {/* DẢI RỦ TRƯỚC NGỰC (2 Dải Lụa Đỏ & Xanh Buông Thẳng Xuống Gấu) */}
            <g id="nhat-binh-ribbons">
              {/* Left Ribbon (Dải Đỏ) */}
              <rect x="185" y="302" width="13" height="162" fill="#E11D48" rx="1.5" />
              <rect x="185" y="460" width="13" height="4" fill="#E5C365" rx="0.5" />

              {/* Right Ribbon (Dải Xanh Lục) */}
              <rect x="202" y="302" width="13" height="162" fill="#059669" rx="1.5" />
              <rect x="202" y="460" width="13" height="4" fill="#E5C365" rx="0.5" />

              {/* Rosette Button (Cúc Hoa Mai Giữa Ngực) */}
              {isChineseButton ? (
                // Chinese Cloth Knot (Taboo Violation)
                <g transform="translate(200, 296)">
                  <circle cx="0" cy="0" r="9" fill="#DC2626" stroke="#991B1B" strokeWidth="1.6" filter="url(#softShadowFilter)" />
                  <line x1="-9" y1="0" x2="9" y2="0" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke="#FFF" strokeWidth="1.5" />
                </g>
              ) : (
                // Royal Blossom Rosette Brooch
                <g transform="translate(200, 296)" filter="url(#softShadowFilter)">
                  <circle cx="0" cy="0" r="10" fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="5" fill="#FFFFFF" fillOpacity="0.45" />
                  <line x1="-5" y1="0" x2="5" y2="0" stroke="#FFF" strokeWidth="1.4" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#FFF" strokeWidth="1.4" />
                  <circle cx="0" cy="0" r="2.2" fill="#FFF3B0" />
                </g>
              )}
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* COLLAR (CỔ ĐỨNG CHO ÁO NGŨ THÂN VÀ ÁO TẤC)                 */}
        {/* ======================================================== */}
        {type !== 'nhat_binh' && (
          <g id="mandarin-collar-group">
            {/* Áo Đơn Y (White Inner Standing Collar peeking above) */}
            {hasDonY ? (
              <path
                d="M 166 88 C 166 84, 234 84, 234 88 L 236 100 L 164 100 Z"
                fill="#FFFFFF"
                stroke="#E5C365"
                strokeWidth="1.4"
                filter="url(#softShadowFilter)"
              />
            ) : (
              /* Taboo warning visual: bare skin collar */
              <path
                d="M 167 92 C 167 89, 233 89, 233 92 L 234 100 L 166 100 Z"
                fill="#C68A6D"
                opacity="0.75"
              />
            )}

            {/* Outer Standing Collar (Cổ Đứng Áo Ngoài Viền Vàng) */}
            <path
              d="M 164 96 C 164 92, 236 92, 236 96 L 242 118 L 158 118 Z"
              fill={primaryColor}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            {/* Top gold piping rim */}
            <path
              d="M 164 96 C 164 92, 236 92, 236 96"
              stroke="#E5C365"
              strokeWidth="1.8"
              fill="none"
            />
          </g>
        )}

        {/* Cổ Đơn Y cho Nhật Bình (Peeking at the top cutout) */}
        {type === 'nhat_binh' && (
          <g id="nhat-binh-inner-collar">
            {hasDonY && (
              <g>
                <rect x="174" y="112" width="52" height="14" fill="#FFFFFF" stroke="#E5C365" strokeWidth="1.2" />
                <circle cx="200" cy="119" r="2.2" fill="#E5C365" />
              </g>
            )}
          </g>
        )}

        {/* ======================================================== */}
        {/* 5 CÚC ÁO NGŨ THƯỜNG VỚI DÂY KHUY CÀI (Cho Ngũ Thân & Tấc) */}
        {/* ======================================================== */}
        {type !== 'nhat_binh' && (
          <g id="buttons-group">
            {[
              { id: 1, cx: 222, cy: 106, cordLen: 10 },
              { id: 2, cx: 228, cy: 146, cordLen: 12 },
              { id: 3, cx: 234, cy: 192, cordLen: 12 },
              { id: 4, cx: 236, cy: 238, cordLen: 12 },
              { id: 5, cx: 238, cy: 288, cordLen: 12 }
            ].map(btn => (
              <g key={btn.id} filter="url(#softShadowFilter)">
                {/* Horizontal loop cord (Dây khuy cài tinh xảo) */}
                <line
                  x1={btn.cx - btn.cordLen}
                  y1={btn.cy}
                  x2={btn.cx + btn.cordLen}
                  y2={btn.cy}
                  stroke={buttonConfig.cordColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {isChineseButton ? (
                  // Chinese Cloth Knot (Taboo Violation)
                  <g>
                    <circle cx={btn.cx} cy={btn.cy} r="6.2" fill="#DC2626" stroke="#991B1B" strokeWidth="1.4" />
                    <line x1={btn.cx - 5} y1={btn.cy} x2={btn.cx + 5} y2={btn.cy} stroke="#FFF" strokeWidth="1.2" />
                    <line x1={btn.cx} y1={btn.cy - 5} x2={btn.cx} y2={btn.cy + 5} stroke="#FFF" strokeWidth="1.2" />
                  </g>
                ) : (
                  // Authentic Royal Button (Kim loại / Ngọc / Gỗ)
                  <g>
                    <circle cx={btn.cx} cy={btn.cy} r="5.6" fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" />
                    <circle cx={btn.cx - 1.4} cy={btn.cy - 1.4} r="1.5" fill="#FFFFFF" fillOpacity="0.75" />
                    <circle cx={btn.cx} cy={btn.cy} r="1" fill="#FFF3B0" />
                  </g>
                )}
              </g>
            ))}
          </g>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE HOTSPOTS (Clickable Markers when interactive) */}
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
                <circle cx="234" cy="192" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="234" cy="192" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
              </g>
            )}

            {/* Hotspot 3: Thân Áo (Tứ Thân Phụ Mẫu) */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectHotspot && onSelectHotspot('panels')}
            >
              <circle cx="160" cy="270" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
              <circle cx="160" cy="270" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
            </g>

            {/* Hotspot 4: Nhật Bình Pattern / Dải Rủ */}
            {type === 'nhat_binh' && (
              <g
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectHotspot && onSelectHotspot('pattern')}
              >
                <circle cx="200" cy="330" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="200" cy="330" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
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
              <span>{type === 'ngu_than' ? 'Áo Ngũ Thân Tay Chẽn' : type === 'ao_tac' ? 'Áo Tấc (Tay Thụng)' : 'Áo Nhật Bình Triều Nguyễn'}</span>
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
