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
          label: 'Cúc Ngọc (Ngọc Bích / Cẩm Thạch)',
          isTaboo: false
        };
      case 'btn-wood-agarwood':
        return {
          fill: 'url(#btnWoodAgarwood)',
          stroke: '#C5A059',
          label: 'Cúc Gỗ (Trầm Hương Khắc Chữ Thọ)',
          isTaboo: false
        };
      case 'btn-chinese-cloth':
        return {
          fill: 'url(#btnChineseCloth)',
          stroke: '#991B1B',
          label: 'Cúc Vải / Cúc Tàu (Phạm Húy Triều Đình)',
          isTaboo: true
        };
      case 'btn-metal-copper':
      default:
        return {
          fill: 'url(#btnMetalCopper)',
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
        viewBox="0 0 400 500"
        className="w-full h-full max-w-[360px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`robeGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="35%" stopColor={primaryColor} stopOpacity="0.96" />
            <stop offset="70%" stopColor={primaryColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#08080c" stopOpacity="0.92" />
          </linearGradient>

          {/* Brocade Jacquard Pattern (Vân Gấm Hoàng Gia Triều Nguyễn) */}
          <pattern id={`brocade-${type}`} width="48" height="48" patternUnits="userSpaceOnUse">
            {/* Subtle damask cloud scroll & lotus motif */}
            <path d="M 12 12 Q 24 4 36 12 Q 44 24 36 36 Q 24 44 12 36 Q 4 24 12 12 Z" fill="none" stroke="#FFF" strokeWidth="0.6" strokeOpacity="0.14" />
            <path d="M 24 16 Q 30 20 24 24 Q 18 20 24 16 Z" fill="#FFF" fillOpacity="0.1" />
            <path d="M 0 24 Q 6 18 12 24 Q 6 30 0 24 Z" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.16" />
            <path d="M 36 24 Q 42 18 48 24 Q 42 30 36 24 Z" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.16" />
            <circle cx="24" cy="24" r="2" fill="#D4AF37" fillOpacity="0.25" />
          </pattern>

          {/* Silk Sheen Overlay */}
          <linearGradient id="silkSheen" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
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
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
          </filter>
        </defs>

        {/* HAUTE COUTURE MANNEQUIN: HEAD & NECK (RÕ SHAPE ĐẦU VÀ CỔ) */}
        <g id="mannequin-head-neck" filter="url(#shadowFilter)">
          {/* Neck (Cổ ma nơ canh thuôn dài vào cổ áo) */}
          <path
            d="M 184 56 L 184 96 Q 200 99 216 96 L 216 56 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.6"
          />
          {/* Subtle neck contours (Đường gân cơ cổ thon dài) */}
          <path d="M 193 64 Q 195 82 194 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" fill="none" />
          <path d="M 207 64 Q 205 82 206 92" stroke="#8E7B68" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" fill="none" />

          {/* Top Cranial Knot / Búi Tóc Cổ Phục */}
          <ellipse cx="200" cy="18" rx="14" ry="9" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.6" />
          <circle cx="200" cy="18" r="3" fill="#FFF3B0" />

          {/* Head & Sculpted Jaw (Đầu & khung cằm ma nơ canh thời trang) */}
          <path
            d="M 172 42 C 166 16, 234 16, 228 42 C 228 60, 215 74, 200 78 C 185 74, 172 60, 172 42 Z"
            fill="url(#mannequinSkin)"
            stroke="url(#mannequinGold)"
            strokeWidth="1.8"
          />

          {/* Haute Couture Stylized Eyebrows (Cặp chân mày lá liễu thanh thoát) */}
          <path d="M 183 38 Q 190 35 195 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 205 38 Q 210 35 217 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Stylized Nose Bridge (Sống mũi cao thanh tú) */}
          <path
            d="M 200 34 L 202 48 L 198 52 L 201 54"
            stroke="#8E7B68"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Lips line (Đường viền môi thanh lịch) */}
          <path d="M 193 63 Q 200 66 207 63" stroke="#8E7B68" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Sculpted cheek facet (Nét vát gò má Haute Couture) */}
          <path
            d="M 178 48 Q 188 64 200 73 Q 212 64 222 48"
            stroke="#C5A059"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            fill="none"
          />
        </g>

        {/* 1. NGŨ THÂN TAY CHẼN */}
        {type === 'ngu_than' && (
          <g>
            {/* Sleeves (Tay Chẽn ôm gọn) */}
            <path
              d="M 120 120 L 40 240 L 70 255 L 135 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Brocade pattern on left sleeve */}
            <path d="M 120 120 L 40 240 L 70 255 L 135 175 Z" fill={`url(#brocade-${type})`} />
            <path d="M 120 120 L 40 240 L 70 255 L 135 175 Z" fill="url(#silkSheen)" opacity="0.5" />

            <path
              d="M 280 120 L 360 240 L 330 255 L 265 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Brocade pattern on right sleeve */}
            <path d="M 280 120 L 360 240 L 330 255 L 265 175 Z" fill={`url(#brocade-${type})`} />
            <path d="M 280 120 L 360 240 L 330 255 L 265 175 Z" fill="url(#silkSheen)" opacity="0.5" />

            {/* Fitted cuff detail */}
            <path d="M 40 240 L 70 255" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M 360 240 L 330 255" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />

            {/* 2 BÀN TAY MA NƠ CANH CAO CẤP (RÕ SHAPE 2 BÀN TAY VỚI CÁC NGÓN TAY THON THẢ) */}
            <g id="mannequin-hands-ngu-than">
              {/* Bàn tay trái */}
              <g transform="translate(52, 246) rotate(32)" filter="url(#shadowFilter)">
                <path
                  d="M -8 0 C -10 12, -14 26, -10 36 C -8 42, -2 46, 2 44 C 6 42, 8 36, 6 26 C 5 16, 7 0, 7 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                {/* Ngón cái tách nhẹ */}
                <path
                  d="M 6 12 C 11 16, 12 24, 9 28 C 7 30, 5 28, 4 23"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.3"
                />
                {/* Đường kẽ 4 ngón tay thon dài */}
                <path d="M 1 28 L 0 42" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 27 L -4 40" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 25 L -8 36" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>

              {/* Bàn tay phải */}
              <g transform="translate(348, 246) rotate(-32)" filter="url(#shadowFilter)">
                <path
                  d="M 8 0 C 10 12, 14 26, 10 36 C 8 42, 2 46, -2 44 C -6 42, -8 36, -6 26 C -5 16, -7 0, -7 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                {/* Ngón cái tách nhẹ */}
                <path
                  d="M -6 12 C -11 16, -12 24, -9 28 C -7 30, -5 28, -4 23"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.3"
                />
                {/* Đường kẽ 4 ngón tay thon dài */}
                <path d="M -1 28 L 0 42" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 27 L 4 40" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 25 L 8 36" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Back panels shadow */}
            <path
              d="M 130 115 L 270 115 L 305 450 L 95 450 Z"
              fill="#0a0a0e"
              opacity="0.5"
            />

            {/* Main 5 Panels Body (Thân áo ngũ thân & vạt kép) */}
            <path
              d="M 135 110 L 265 110 L 295 440 L 105 440 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            {/* Brocade & Silk Sheen on Main Body */}
            <path d="M 135 110 L 265 110 L 295 440 L 105 440 Z" fill={`url(#brocade-${type})`} />
            <path d="M 135 110 L 265 110 L 295 440 L 105 440 Z" fill="url(#silkSheen)" opacity="0.6" />

            {/* Tà áo vạt con bên phải khép chéo */}
            <path
              d="M 185 110 Q 220 140 230 180 L 240 440"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Subtle highlight fold line */}
            <path
              d="M 184 110 Q 219 140 229 180 L 239 440"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              fill="none"
            />

            {/* Đường trung phẫu chính giữa tà áo */}
            <line x1="200" y1="180" x2="200" y2="440" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {/* 2. ÁO TẤC (TAY THỤNG) */}
        {type === 'ao_tac' && (
          <g>
            {/* Massive Ceremonial Flowing Sleeves (Tay Thụng buông rộng 35-40cm) */}
            <path
              d="M 125 115 L 15 175 L 15 350 L 115 310 L 135 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 125 115 L 15 175 L 15 350 L 115 310 L 135 175 Z" fill={`url(#brocade-${type})`} />
            <path d="M 125 115 L 15 175 L 15 350 L 115 310 L 135 175 Z" fill="url(#silkSheen)" opacity="0.6" />

            <path
              d="M 275 115 L 385 175 L 385 350 L 285 310 L 265 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 275 115 L 385 175 L 385 350 L 285 310 L 265 175 Z" fill={`url(#brocade-${type})`} />
            <path d="M 275 115 L 385 175 L 385 350 L 285 310 L 265 175 Z" fill="url(#silkSheen)" opacity="0.6" />

            {/* Sleeve folds / nếp gấp lụa */}
            <path d="M 25 210 Q 65 240 120 230" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
            <path d="M 375 210 Q 335 240 280 230" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>

            {/* 2 BÀN TAY MA NƠ CANH (ÁO TẤC TAY THỤNG BUÔNG THẢ THANH TAO) */}
            <g id="mannequin-hands-ao-tac">
              <g transform="translate(68, 325) rotate(15)" filter="url(#shadowFilter)">
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
              <g transform="translate(332, 325) rotate(-15)" filter="url(#shadowFilter)">
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

            {/* Body */}
            <path
              d="M 130 110 L 270 110 L 305 450 L 95 450 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 130 110 L 270 110 L 305 450 L 95 450 Z" fill={`url(#brocade-${type})`} />
            <path d="M 130 110 L 270 110 L 305 450 L 95 450 Z" fill="url(#silkSheen)" opacity="0.6" />

            {/* Overlap fold */}
            <path
              d="M 185 110 Q 225 150 235 200 L 250 450"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        )}

        {/* 3. ÁO NHẬT BÌNH */}
        {type === 'nhat_binh' && (
          <g>
            {/* Sleeves with Ngũ Sắc rainbow stripe at cuffs */}
            <path
              d="M 125 115 L 30 160 L 30 260 L 130 210 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 125 115 L 30 160 L 30 260 L 130 210 Z" fill={`url(#brocade-${type})`} />
            <path d="M 125 115 L 30 160 L 30 260 L 130 210 Z" fill="url(#silkSheen)" opacity="0.6" />

            <path
              d="M 275 115 L 370 160 L 370 260 L 270 210 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 275 115 L 370 160 L 370 260 L 270 210 Z" fill={`url(#brocade-${type})`} />
            <path d="M 275 115 L 370 160 L 370 260 L 270 210 Z" fill="url(#silkSheen)" opacity="0.6" />

            {/* Ngũ Sắc Bands on Left Sleeve */}
            <g transform="translate(30, 220)">
              <rect x="0" y="0" width="10" height="40" fill="#E5C365" />
              <rect x="10" y="0" width="10" height="40" fill="#2B5B84" />
              <rect x="20" y="0" width="10" height="40" fill="#F4EFE6" />
              <rect x="30" y="0" width="10" height="40" fill="#7A222C" />
            </g>
            {/* Ngũ Sắc Bands on Right Sleeve */}
            <g transform="translate(330, 220)">
              <rect x="0" y="0" width="10" height="40" fill="#7A222C" />
              <rect x="10" y="0" width="10" height="40" fill="#F4EFE6" />
              <rect x="20" y="0" width="10" height="40" fill="#2B5B84" />
              <rect x="30" y="0" width="10" height="40" fill="#E5C365" />
            </g>

            {/* 2 BÀN TAY MA NƠ CANH (ÁO NHẬT BÌNH DƯỚI DẢI NGŨ SẮC) */}
            <g id="mannequin-hands-nhat-binh">
              <g transform="translate(52, 252) rotate(32)" filter="url(#shadowFilter)">
                <path
                  d="M -8 0 C -10 12, -14 26, -10 36 C -8 42, -2 46, 2 44 C 6 42, 8 36, 6 26 C 5 16, 7 0, 7 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M 6 12 C 11 16, 12 24, 9 28 C 7 30, 5 28, 4 23" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.3" />
                <path d="M 1 28 L 0 42" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 27 L -4 40" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -6 25 L -8 36" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(348, 252) rotate(-32)" filter="url(#shadowFilter)">
                <path
                  d="M 8 0 C 10 12, 14 26, 10 36 C 8 42, 2 46, -2 44 C -6 42, -8 36, -6 26 C -5 16, -7 0, -7 0 Z"
                  fill="url(#mannequinSkin)"
                  stroke="url(#mannequinGold)"
                  strokeWidth="1.5"
                />
                <path d="M -6 12 C -11 16, -12 24, -9 28 C -7 30, -5 28, -4 23" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.3" />
                <path d="M -1 28 L 0 42" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 27 L 4 40" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 6 25 L 8 36" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Main Body */}
            <path
              d="M 130 110 L 270 110 L 300 445 L 100 445 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            <path d="M 130 110 L 270 110 L 300 445 L 100 445 Z" fill={`url(#brocade-${type})`} />
            <path d="M 130 110 L 270 110 L 300 445 L 100 445 Z" fill="url(#silkSheen)" opacity="0.6" />

            {/* Signature Nhật Bình Y-Shaped Rectangular Neckband (Vạt Cổ Chữ Y) */}
            <path
              d="M 155 110 L 175 180 L 175 445 L 225 445 L 225 180 L 245 110 Z"
              fill="#181822"
              stroke="url(#goldTrim)"
              strokeWidth="2"
            />
            {/* Gold trim embroidery on collar */}
            <line x1="180" y1="185" x2="180" y2="445" stroke="#C5A059" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="220" y1="185" x2="220" y2="445" stroke="#C5A059" strokeWidth="1" strokeDasharray="4 2" />

            {/* Phượng Ổ (Circular Phoenix Roundel) Embroidered on chest */}
            <g transform="translate(200, 240)">
              <circle cx="0" cy="0" r="22" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="17" fill="#7A222C" opacity="0.6" />
              {/* Stylized Phoenix Silhouette */}
              <path
                d="M -7 -4 Q 0 -14 7 -4 Q 12 3 5 11 Q 0 14 -7 8 Q -12 2 -7 -4 Z"
                fill="#E5C365"
              />
              <path d="M 0 -8 L 0 -13 M -3 -10 L 0 -13 L 3 -10" stroke="#FFF3B0" strokeWidth="1" />
            </g>

            {/* Thủy Ba Tam Sơn (Wave & 3 Mountains Pattern at Hem) */}
            <g transform="translate(100, 415)">
              <rect x="0" y="0" width="200" height="30" fill="#0d1b2a" opacity="0.9" />
              {/* Waves */}
              <path
                d="M 0 20 Q 25 5 50 20 Q 75 5 100 20 Q 125 5 150 20 Q 175 5 200 20 L 200 30 L 0 30 Z"
                fill="#2B5B84"
              />
              {/* Tam Sơn (3 peaks) in middle */}
              <polygon points="100,2 108,18 92,18" fill="#E5C365" />
              <polygon points="85,8 92,18 78,18" fill="#C5A059" />
              <polygon points="115,8 122,18 108,18" fill="#C5A059" />
            </g>
          </g>
        )}

        {/* CỔ ĐỨNG (Mandarin Collar) */}
        <g id="collar-group">
          {/* Áo Đơn Y (White Inner Standing Collar) - Must peek 3mm above outer collar */}
          {hasDonY ? (
            <path
              d="M 160 88 C 160 84, 240 84, 240 88 L 242 108 L 158 108 Z"
              fill="#F8F6F0"
              stroke="#D4CEBE"
              strokeWidth="1.5"
              filter="url(#shadowFilter)"
            />
          ) : (
            /* Taboo warning visual: bare skin collar */
            <path
              d="M 165 92 C 165 89, 235 89, 235 92 L 235 108 L 165 108 Z"
              fill="#c68a6d"
              opacity="0.7"
            />
          )}

          {/* Outer High Standing Collar (Cổ đứng áo ngoài) */}
          <path
            d="M 162 94 C 162 91, 238 91, 238 94 L 243 118 L 157 118 Z"
            fill={primaryColor}
            stroke="#1d1d24"
            strokeWidth="1.5"
          />
          {/* Subtle gold collar rim */}
          <path
            d="M 162 94 C 162 91, 238 91, 238 94"
            stroke="#E5C365"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* 5 CÚC ÁO NGŨ THƯỜNG (Cúc Kim Loại / Cúc Ngọc vs Cúc Vải) */}
        {type !== 'nhat_binh' && (
          <g id="buttons-group">
            {/* Button 1: Collar center right */}
            <circle cx="218" cy="98" r={isChineseButton ? "6" : "5.5"} fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" filter="url(#shadowFilter)" />
            {!isChineseButton && <circle cx="216.5" cy="96.5" r="1.5" fill="#FFF" fillOpacity="0.75" />}
            {isChineseButton && <line x1="212" y1="98" x2="224" y2="98" stroke="#FFF" strokeWidth="1" />}

            {/* Button 2: Upper chest opening */}
            <circle cx="224" cy="116" r={isChineseButton ? "6" : "5.5"} fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" filter="url(#shadowFilter)" />
            {!isChineseButton && <circle cx="222.5" cy="114.5" r="1.5" fill="#FFF" fillOpacity="0.75" />}
            {isChineseButton && <line x1="218" y1="116" x2="230" y2="116" stroke="#FFF" strokeWidth="1" />}

            {/* Button 3: Under right armpit (Nách phải) */}
            <circle cx="236" cy="148" r={isChineseButton ? "6" : "5.5"} fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" filter="url(#shadowFilter)" />
            {!isChineseButton && <circle cx="234.5" cy="146.5" r="1.5" fill="#FFF" fillOpacity="0.75" />}
            {isChineseButton && <line x1="230" y1="148" x2="242" y2="148" stroke="#FFF" strokeWidth="1" />}

            {/* Button 4: Upper waist (Sườn trên) */}
            <circle cx="238" cy="186" r={isChineseButton ? "6" : "5.5"} fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" filter="url(#shadowFilter)" />
            {!isChineseButton && <circle cx="236.5" cy="184.5" r="1.5" fill="#FFF" fillOpacity="0.75" />}
            {isChineseButton && <line x1="232" y1="186" x2="244" y2="186" stroke="#FFF" strokeWidth="1" />}

            {/* Button 5: Lower flank (Sườn dưới) */}
            <circle cx="242" cy="226" r={isChineseButton ? "6" : "5.5"} fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" filter="url(#shadowFilter)" />
            {!isChineseButton && <circle cx="240.5" cy="224.5" r="1.5" fill="#FFF" fillOpacity="0.75" />}
            {isChineseButton && <line x1="236" y1="226" x2="248" y2="226" stroke="#FFF" strokeWidth="1" />}
          </g>
        )}

        {/* Nhật Bình Button (Middle chest closure) */}
        {type === 'nhat_binh' && (
          <g id="nhat-binh-closure">
            {isChineseButton ? (
              // Chinese cloth knot on Nhật Bình (Taboo violation)
              <g transform="translate(200, 185)">
                <circle cx="0" cy="0" r="7" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFF" strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFF" strokeWidth="1.5" />
                <circle cx="0" cy="22" r="6" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                <line x1="-6" y1="22" x2="6" y2="22" stroke="#FFF" strokeWidth="1.2" />
              </g>
            ) : (
              <g transform="translate(200, 185)">
                {/* Royal Brooch / Jade Loop Closure */}
                <circle cx="0" cy="0" r="8" fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.8" filter="url(#shadowFilter)" />
                <circle cx="0" cy="0" r="3" fill="#FFF" opacity="0.6" />
                <line x1="0" y1="8" x2="0" y2="22" stroke={buttonConfig.stroke} strokeWidth="1.8" />
                <circle cx="0" cy="22" r="5" fill={buttonFill} stroke={buttonConfig.stroke} strokeWidth="1.2" />
              </g>
            )}
          </g>
        )}

        {/* INTERACTIVE HOTSPOTS (Clickable Markers when interactive=true) */}
        {interactive && (
          <g>
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
                <circle cx="230" cy="165" r="14" fill="#d4af37" fillOpacity="0.25" className="animate-pulse" />
                <circle cx="230" cy="165" r="6" fill="#d4af37" stroke="#111" strokeWidth="1.5" />
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

            {/* Hotspot 4: Nhật Bình Pattern (Phượng Ổ / Thủy Ba) */}
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
