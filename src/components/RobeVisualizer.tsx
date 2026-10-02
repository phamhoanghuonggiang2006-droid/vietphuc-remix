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
          fill: '#10B981',
          stroke: '#E5C365',
          label: 'Cúc Ngọc (Ngọc Bích / Cẩm Thạch)',
          isTaboo: false
        };
      case 'btn-wood-agarwood':
        return {
          fill: '#8B5A2B',
          stroke: '#C5A059',
          label: 'Cúc Gỗ (Trầm Hương Khắc Chữ Thọ)',
          isTaboo: false
        };
      case 'btn-chinese-cloth':
        return {
          fill: '#DC2626',
          stroke: '#991B1B',
          label: 'Cúc Vải / Cúc Tàu (Phạm Húy Triều Đình)',
          isTaboo: true
        };
      case 'btn-metal-copper':
      default:
        return {
          fill: '#E5C365',
          stroke: '#785918',
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
        className="w-full h-full max-w-[360px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500"
      >
        <defs>
          {/* PURE SILK FABRIC GRADIENT: Absolutely NO black or muddy tones! Keeps White Ngà pure and colors luminous */}
          <linearGradient id={`robeGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="50%" stopColor={primaryColor} stopOpacity="0.98" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.94" />
          </linearGradient>

          {/* Wavy Damask/Brocade Grid (Vân Gấm Lượn Sóng Hoàng Gia Triều Nguyễn) */}
          <pattern id={`brocade-${type}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 0 20 C 10 10, 30 10, 40 20 C 50 30, 70 30, 80 20" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="0.8" 
              strokeOpacity="0.14" 
            />
            <path 
              d="M 20 0 C 10 10, 10 30, 20 40 C 30 50, 30 70, 20 80" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="0.8" 
              strokeOpacity="0.14" 
            />
            {/* Subtle center gold rosette point */}
            <circle cx="20" cy="20" r="1.2" fill="#E5C365" fillOpacity="0.25" />
            <circle cx="0" cy="0" r="1.2" fill="#E5C365" fillOpacity="0.25" />
          </pattern>

          {/* Silk Sheen Overlay: Pure White Light Highlight ONLY (Zero black stops) */}
          <linearGradient id="silkSheen" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
          </linearGradient>

          {/* Ngũ Sắc Spectrum for Nhật Bình Collar Frame */}
          <linearGradient id="nhatBinhRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />   {/* Xanh lam */}
            <stop offset="25%" stopColor="#10B981" />  {/* Xanh lục */}
            <stop offset="50%" stopColor="#F59E0B" />  {/* Vàng kim */}
            <stop offset="75%" stopColor="#DC2626" />  {/* Đỏ điều */}
            <stop offset="100%" stopColor="#2563EB" /> {/* Xanh lam */}
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

          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.4"/>
          </filter>
        </defs>

        {/* ROYAL EXHIBITION HANGER (Móc Treo Hoàng Gia Tối Giản Cổ Điển) */}
        <g id="royal-hanger">
          {/* Ring hook at top */}
          <circle cx="200" cy="48" r="8" stroke="#424250" strokeWidth="2.2" fill="none" />
          {/* Stem post */}
          <line x1="200" y1="56" x2="200" y2="70" stroke="#424250" strokeWidth="2.2" strokeLinecap="round" />
          {/* Curved dark wooden hanger arch supporting the neckline */}
          <path 
            d="M 148 94 Q 200 80 252 94 L 246 74 Q 200 60 154 74 Z" 
            fill="#22222c" 
            stroke="#3a3a46" 
            strokeWidth="1"
          />
        </g>

        {/* HAUTE COUTURE MANNEQUIN: HEAD & NECK (KHI HIỂN THỊ TRÊN CANVAS HOẶC MODAL) */}
        {borderless && (
          <g id="mannequin-head-neck" filter="url(#shadowFilter)">
            {/* Neck (Cổ ma nơ canh thuôn dài vào cổ áo) */}
            <path
              d="M 184 56 L 184 96 Q 200 99 216 96 L 216 56 Z"
              fill="url(#mannequinSkin)"
              stroke="url(#mannequinGold)"
              strokeWidth="1.6"
            />
            {/* Subtle neck contours */}
            <path d="M 193 64 Q 195 82 194 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" fill="none" />
            <path d="M 207 64 Q 205 82 206 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" fill="none" />

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

            {/* Stylized Nose Bridge */}
            <path
              d="M 200 34 L 202 48 L 198 52 L 201 54"
              stroke="#8E7B68"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Lips line */}
            <path d="M 193 63 Q 200 66 207 63" stroke="#8E7B68" strokeWidth="1.4" strokeLinecap="round" fill="none" />

            {/* Sculpted cheek facet */}
            <path
              d="M 178 48 Q 188 64 200 73 Q 212 64 222 48"
              stroke="#C5A059"
              strokeWidth="0.8"
              strokeOpacity="0.45"
              fill="none"
            />
          </g>
        )}

        {/* 1. NGŨ THÂN TAY CHẼN (DÁNG TỰ NHIÊN, KHÔNG ĐƠ, TAY THON XUÔI THEO VÓC DÁNG) */}
        {type === 'ngu_than' && (
          <g id="robe-ngu-than">
            {/* Main Robe Path: Seamless flowing silhouette with natural sloping shoulders */}
            <path
              d="M 170 110 
                 L 132 126 
                 L 80 240 
                 L 100 292 
                 L 128 235 
                 L 128 480 
                 L 272 480 
                 L 272 235 
                 L 300 292 
                 L 320 240 
                 L 268 126 
                 L 230 110 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Brocade Jacquard Pattern */}
            <path
              d="M 170 110 L 132 126 L 80 240 L 100 292 L 128 235 L 128 480 L 272 480 L 272 235 L 300 292 L 320 240 L 268 126 L 230 110 Z"
              fill={`url(#brocade-${type})`}
            />
            {/* Soft Pure White Silk Sheen (Zero black!) */}
            <path
              d="M 170 110 L 132 126 L 80 240 L 100 292 L 128 235 L 128 480 L 272 480 L 272 235 L 300 292 L 320 240 L 268 126 L 230 110 Z"
              fill="url(#silkSheen)"
              opacity="0.55"
            />

            {/* Folded Cuffs with Gold Trim (Viền Cửa Tay Áo Gấp Nếp Tinh Tế) */}
            <line x1="79" y1="282" x2="101" y2="294" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="321" y1="282" x2="299" y2="294" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" />

            {/* Bottom Hem Gold Trim (Viền Lai Áo) */}
            <line x1="128" y1="480" x2="272" y2="480" stroke="#E5C365" strokeWidth="2" strokeLinecap="round" />

            {/* Đường trung phẫu chính giữa tà áo (Traditional center seam) */}
            <line x1="200" y1="175" x2="200" y2="480" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeDasharray="3 3" />

            {/* Tà vạt con khép kín sang phải (Curved right lapel line) */}
            <path
              d="M 185 110 Q 220 145 226 195 L 232 290"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 2 BÀN TAY MA NƠ CANH THỜI TRANG (Lộ nhẹ ở cửa tay áo chẽn) */}
            {borderless && (
              <g id="mannequin-hands-ngu-than">
                <g transform="translate(86, 290) rotate(24)" filter="url(#shadowFilter)">
                  <path
                    d="M -7 0 C -9 10, -12 22, -9 30 C -7 36, -1 39, 2 37 C 5 35, 7 30, 5 22 C 4 14, 6 0, 6 0 Z"
                    fill="url(#mannequinSkin)"
                    stroke="url(#mannequinGold)"
                    strokeWidth="1.3"
                  />
                  <path d="M 5 10 C 9 13, 10 20, 7 24 C 5 26, 3 24, 2 20" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.1" />
                  <path d="M 0 24 L 0 35" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M -3 23 L -4 33" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                </g>
                <g transform="translate(314, 290) rotate(-24)" filter="url(#shadowFilter)">
                  <path
                    d="M 7 0 C 9 10, 12 22, 9 30 C 7 36, 1 39, -2 37 C -5 35, -7 30, -5 22 C -4 14, -6 0, -6 0 Z"
                    fill="url(#mannequinSkin)"
                    stroke="url(#mannequinGold)"
                    strokeWidth="1.3"
                  />
                  <path d="M -5 10 C -9 13, -10 20, -7 24 C -5 26, -3 24, -2 20" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.1" />
                  <path d="M 0 24 L 0 35" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M 3 23 L 4 33" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* 2. ÁO TẤC (TAY THỤNG) (TAY RỘNG BUÔNG THẢ TỰ NHIÊN, NẾP GẤP TRỌNG LỰC MỀM MẠI) */}
        {type === 'ao_tac' && (
          <g id="robe-ao-tac">
            {/* Main Robe Path: Majestic Wide Ceremonial Flowing Sleeves dropping straight down */}
            <path
              d="M 170 110 
                 L 135 126 
                 L 50 180 
                 L 54 420 
                 L 128 370 
                 L 128 480 
                 L 272 480 
                 L 272 370 
                 L 346 420 
                 L 350 180 
                 L 265 126 
                 L 230 110 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Brocade Jacquard Pattern */}
            <path
              d="M 170 110 L 135 126 L 50 180 L 54 420 L 128 370 L 128 480 L 272 480 L 272 370 L 346 420 L 350 180 L 265 126 L 230 110 Z"
              fill={`url(#brocade-${type})`}
            />
            {/* Soft Pure White Silk Sheen (Zero black!) */}
            <path
              d="M 170 110 L 135 126 L 50 180 L 54 420 L 128 370 L 128 480 L 272 480 L 272 370 L 346 420 L 350 180 L 265 126 L 230 110 Z"
              fill="url(#silkSheen)"
              opacity="0.55"
            />

            {/* Tay Thụng Vertical Drape Crease Lines (Nếp buông rủ thanh nhã như trong ảnh mẫu) */}
            <line x1="92" y1="205" x2="76" y2="405" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="308" y1="205" x2="324" y2="405" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />

            {/* Bottom Hem Gold Trim */}
            <line x1="128" y1="480" x2="272" y2="480" stroke="#E5C365" strokeWidth="2" strokeLinecap="round" />

            {/* Curved overlap fold */}
            <path
              d="M 185 110 Q 225 150 232 205 L 238 310"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 2 BÀN TAY MA NƠ CANH TRONG TAY ÁO THỤNG */}
            {borderless && (
              <g id="mannequin-hands-ao-tac">
                <g transform="translate(90, 370) rotate(15)" filter="url(#shadowFilter)">
                  <path
                    d="M -7 0 C -9 10, -12 20, -9 28 C -7 34, -1 37, 2 35 C 5 33, 7 28, 5 20 C 4 13, 6 0, 6 0 Z"
                    fill="url(#mannequinSkin)"
                    stroke="url(#mannequinGold)"
                    strokeWidth="1.2"
                  />
                  <path d="M 0 20 L 0 30" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                </g>
                <g transform="translate(310, 370) rotate(-15)" filter="url(#shadowFilter)">
                  <path
                    d="M 7 0 C 9 10, 12 20, 9 28 C 7 34, 1 37, -2 35 C -5 33, -7 28, -5 20 C -4 13, -6 0, -6 0 Z"
                    fill="url(#mannequinSkin)"
                    stroke="url(#mannequinGold)"
                    strokeWidth="1.2"
                  />
                  <path d="M 0 20 L 0 30" stroke="#8E7B68" strokeWidth="0.9" strokeLinecap="round" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* 3. ÁO NHẬT BÌNH (CỔ CẦU VỒNG, DẢI KẾT LỘC ĐỎ - XANH RỦ XUỐNG, 5 SỌC CẦU VỒNG CỬA TAY) */}
        {type === 'nhat_binh' && (
          <g id="robe-nhat-binh">
            {/* Dark back under-panels adding regal depth */}
            <polygon points="120,240 120,480 88,480 88,300" fill="#14141c" />
            <polygon points="280,240 280,480 312,480 312,300" fill="#14141c" />

            {/* Main Robe Silhouette */}
            <path
              d="M 170 110 
                 L 132 126 
                 L 34 235 
                 L 52 335 
                 L 116 295 
                 L 116 480 
                 L 284 480 
                 L 284 295 
                 L 348 335 
                 L 366 235 
                 L 268 126 
                 L 230 110 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Brocade Jacquard Pattern */}
            <path
              d="M 170 110 L 132 126 L 34 235 L 52 335 L 116 295 L 116 480 L 284 480 L 284 295 L 348 335 L 366 235 L 268 126 L 230 110 Z"
              fill={`url(#brocade-${type})`}
            />
            {/* Soft Pure White Silk Sheen (Zero black!) */}
            <path
              d="M 170 110 L 132 126 L 34 235 L 52 335 L 116 295 L 116 480 L 284 480 L 284 295 L 348 335 L 366 235 L 268 126 L 230 110 Z"
              fill="url(#silkSheen)"
              opacity="0.55"
            />

            {/* 5 Ngũ Sắc Rainbow Stripes at Left Sleeve Cuff (5 dải màu ngũ hành chuẩn triều Nguyễn) */}
            <g transform="translate(34, 235) rotate(22)">
              <rect x="0" y="0" width="13" height="74" fill="#2563EB" /> {/* Lam */}
              <rect x="13" y="0" width="13" height="74" fill="#10B981" /> {/* Lục */}
              <rect x="26" y="0" width="13" height="74" fill="#F59E0B" /> {/* Vàng */}
              <rect x="39" y="0" width="13" height="74" fill="#EF4444" /> {/* Đỏ */}
              <rect x="52" y="0" width="13" height="74" fill="#FFFFFF" /> {/* Trắng */}
            </g>

            {/* 5 Ngũ Sắc Rainbow Stripes at Right Sleeve Cuff */}
            <g transform="translate(296, 260) rotate(-22)">
              <rect x="0" y="0" width="13" height="74" fill="#FFFFFF" /> {/* Trắng */}
              <rect x="13" y="0" width="13" height="74" fill="#EF4444" /> {/* Đỏ */}
              <rect x="26" y="0" width="13" height="74" fill="#F59E0B" /> {/* Vàng */}
              <rect x="39" y="0" width="13" height="74" fill="#10B981" /> {/* Lục */}
              <rect x="52" y="0" width="13" height="74" fill="#2563EB" /> {/* Lam */}
            </g>

            {/* Scalloped Wave Hem with Gold Trim (Viền thủy ba uốn lượn mềm mại dưới tà) */}
            <path
              d="M 116 480 Q 158 488 200 480 Q 242 488 284 480"
              stroke="#E5C365"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* SIGNATURE KHUNG CỔ NHẬT BÌNH (Rectangular Rainbow Neckband Frame) */}
            <g id="nhat-binh-collar-frame">
              {/* Outer gold-bordered rainbow neckband */}
              <path
                d="M 152 130 L 152 285 L 172 285 L 172 152 L 228 152 L 228 285 L 248 285 L 248 130 Z"
                fill="url(#nhatBinhRainbow)"
                stroke="#E5C365"
                strokeWidth="2"
              />
              {/* Inner gold border */}
              <path
                d="M 172 285 L 172 152 L 228 152 L 228 285"
                stroke="#E5C365"
                strokeWidth="1.5"
                fill="none"
              />

              {/* White Pearl Studs along Left Pillar (Hạt ngọc đính viền cổ áo) */}
              <circle cx="162" cy="162" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="162" cy="194" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="162" cy="226" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="162" cy="258" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />

              {/* White Pearl Studs along Right Pillar */}
              <circle cx="238" cy="162" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="238" cy="194" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="238" cy="226" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
              <circle cx="238" cy="258" r="2.8" fill="#FFFFFF" stroke="#D4CEBE" strokeWidth="0.8" />
            </g>

            {/* DẢI KẾT LỘC HOÀNG GIA (Two Long Flowing Ribbons: Red & Green with Gold Tips) */}
            <g id="nhat-binh-ribbons">
              {/* Central Brooch / Cúc Áo Nhật Bình */}
              <circle cx="200" cy="285" r="9" fill={isChineseButton ? "#DC2626" : buttonFill} stroke="#E5C365" strokeWidth="2" filter="url(#shadowFilter)" />
              <circle cx="200" cy="285" r="3.5" fill="#FFFFFF" />

              {/* Left Ribbon: Crimson Red (Dải lụa đỏ thắm) */}
              <rect x="186" y="294" width="12" height="156" fill="#DC2626" rx="1" />
              <rect x="186" y="445" width="12" height="5" fill="#E5C365" />

              {/* Right Ribbon: Emerald Green (Dải lụa xanh ngọc) */}
              <rect x="202" y="294" width="12" height="156" fill="#10B981" rx="1" />
              <rect x="202" y="445" width="12" height="5" fill="#E5C365" />
            </g>
          </g>
        )}

        {/* CỔ ĐỨNG (MANDARIN COLLAR) & ÁO ĐƠN Y TRẮNG */}
        <g id="collar-group">
          {/* Áo Đơn Y (White Inner Standing Collar) - Must peek 3mm above outer collar */}
          {hasDonY ? (
            <path
              d="M 174 94 Q 200 90 226 94 L 228 108 Q 200 105 172 108 Z"
              fill="#FFFFFF"
              stroke="#D4CEBE"
              strokeWidth="1.2"
              filter="url(#shadowFilter)"
            />
          ) : (
            /* Taboo warning visual: bare skin collar */
            <path
              d="M 174 94 Q 200 90 226 94 L 228 108 Q 200 105 172 108 Z"
              fill="#c68a6d"
              opacity="0.75"
            />
          )}

          {/* Outer High Standing Collar (Cổ đứng áo ngoài) */}
          <path
            d="M 170 104 Q 200 100 230 104 L 232 130 Q 200 126 168 130 Z"
            fill={`url(#robeGrad-${type})`}
            stroke="#E5C365"
            strokeWidth="1.6"
          />
          {/* Brocade pattern on collar */}
          <path
            d="M 170 104 Q 200 100 230 104 L 232 130 Q 200 126 168 130 Z"
            fill={`url(#brocade-${type})`}
          />
          {/* Gold collar rims */}
          <path d="M 170 104 Q 200 100 230 104" stroke="#E5C365" strokeWidth="1.6" fill="none" />
          <path d="M 168 130 Q 200 126 232 130" stroke="#E5C365" strokeWidth="1.6" fill="none" />
        </g>

        {/* 5 CÚC ÁO NGŨ THƯỜNG (Cúc Kim Loại / Cúc Ngọc / Cúc Gỗ) */}
        {type !== 'nhat_binh' && (
          <g id="buttons-group">
            {/* Button 1: Collar center right */}
            <g transform="translate(220, 117)">
              <line x1="-7" y1="0" x2="7" y2="0" stroke={isChineseButton ? "#DC2626" : buttonConfig.stroke} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r={isChineseButton ? "6" : "5.2"} fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.2" filter="url(#shadowFilter)" />
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            </g>

            {/* Button 2: Upper chest opening */}
            <g transform="translate(222, 158)">
              <line x1="-7" y1="0" x2="7" y2="0" stroke={isChineseButton ? "#DC2626" : buttonConfig.stroke} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r={isChineseButton ? "6" : "5.2"} fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.2" filter="url(#shadowFilter)" />
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            </g>

            {/* Button 3: Mid chest */}
            <g transform="translate(226, 202)">
              <line x1="-7" y1="0" x2="7" y2="0" stroke={isChineseButton ? "#DC2626" : buttonConfig.stroke} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r={isChineseButton ? "6" : "5.2"} fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.2" filter="url(#shadowFilter)" />
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            </g>

            {/* Button 4: Upper waist / flank */}
            <g transform="translate(228, 246)">
              <line x1="-7" y1="0" x2="7" y2="0" stroke={isChineseButton ? "#DC2626" : buttonConfig.stroke} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r={isChineseButton ? "6" : "5.2"} fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.2" filter="url(#shadowFilter)" />
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            </g>

            {/* Button 5: Lower flank */}
            <g transform="translate(232, 292)">
              <line x1="-7" y1="0" x2="7" y2="0" stroke={isChineseButton ? "#DC2626" : buttonConfig.stroke} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r={isChineseButton ? "6" : "5.2"} fill={buttonFill} stroke="#FFFFFF" strokeWidth="1.2" filter="url(#shadowFilter)" />
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            </g>
          </g>
        )}

        {/* INTERACTIVE HOTSPOTS (Clickable Markers when interactive=true) */}
        {interactive && (
          <g id="hotspots-interactive">
            {/* Hotspot 1: Cổ Áo Đơn Y */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectHotspot && onSelectHotspot('collar')}
            >
              <circle cx="200" cy="98" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
              <circle cx="200" cy="98" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
            </g>

            {/* Hotspot 2: 5 Cúc Ngũ Thường */}
            {type !== 'nhat_binh' && (
              <g
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectHotspot && onSelectHotspot('buttons')}
              >
                <circle cx="226" cy="180" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="226" cy="180" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
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

            {/* Hotspot 4: Nhật Bình Pattern (Khung Cổ Cầu Vồng / Dải Kết Lộc) */}
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
              <span>{type === 'ngu_than' ? 'Áo Ngũ Thân' : type === 'ao_tac' ? 'Áo Tấc Thụng' : 'Áo Nhật Bình'}</span>
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
