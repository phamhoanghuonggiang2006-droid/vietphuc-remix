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
            {/* Vân Mây Lượn Sóng Nhẹ */}
            <path
              d="M 0 30 C 15 18, 45 42, 60 30 M 30 0 C 42 15, 18 45, 30 60"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.14"
            />
            {/* Đồ Án Đoàn Thọ Tròn (Chữ Thọ Hoàng Cung Dệt Chìm) */}
            <g transform="translate(30, 30)">
              <circle cx="0" cy="0" r="11" fill="none" stroke="#E5C365" strokeWidth="0.9" strokeOpacity="0.35" />
              <circle cx="0" cy="0" r="8.5" fill="none" stroke="#E5C365" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 1.5" />
              <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.35" />
              <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.35" />
              <path d="M -4 -3 L 4 -3 M -4 3 L 4 3" stroke="#FFFFFF" strokeWidth="0.7" strokeOpacity="0.3" />
            </g>
            {/* Điểm Chấm Hoa Mai Kim Hoàn */}
            <circle cx="0" cy="0" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="60" cy="0" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="0" cy="60" r="1.4" fill="#E5C365" fillOpacity="0.35" />
            <circle cx="60" cy="60" r="1.4" fill="#E5C365" fillOpacity="0.35" />
          </pattern>

          {/* Dải Màu Bản Cổ Nhật Bình (Gấm Thêu Cung Đình) */}
          <linearGradient id="nhatBinhCollarRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="22%" stopColor="#047857" />
            <stop offset="48%" stopColor="#D97706" />
            <stop offset="74%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#B91C1C" />
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
          {/* Cổ Ma Nơ Canh */}
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
          {/* Mày, Mũi, Môi */}
          <path d="M 183 38 Q 190 35 195 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 205 38 Q 210 35 217 38" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 200 34 L 202 48 L 198 52 L 201 54" stroke="#8E7B68" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 193 63 Q 200 66 207 63" stroke="#8E7B68" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M 178 48 Q 188 64 200 73 Q 212 64 222 48" stroke="#C5A059" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        </g>

        {/* ======================================================== */}
        {/* 1. ÁO NGŨ THÂN TAY CHẼN (Chuẩn Ảnh Mẫu Khamphahue)        */}
        {/* Vai xuôi liền tay, tay chẽn thon mềm, tà suông xẻ hông   */}
        {/* ======================================================== */}
        {type === 'ngu_than' && (
          <g id="ao-ngu-than-tay-chen">
            {/* Lớp Quần Lụa Trắng Lộ Qua Tà Xẻ Hông (Bên Trong) */}
            <path d="M 96 360 L 90 480 L 128 480 L 120 360 Z" fill="#F8F6F0" opacity="0.9" />
            <path d="M 304 360 L 310 480 L 272 480 L 280 360 Z" fill="#F8F6F0" opacity="0.9" />

            {/* Tay Áo Trái: Cắt liền vai, ôm thon mềm mại qua cùi chỏ về cổ tay */}
            <path
              d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z" fill={`url(#brocade-${type})`} />
            <path d="M 160 100 C 135 108, 105 125, 78 175 C 65 200, 72 245, 92 278 C 98 284, 114 278, 118 268 C 104 235, 108 200, 130 185 Z" fill="url(#silkSheen)" />

            {/* Tay Áo Phải: Cắt liền vai, ôm thon mềm mại */}
            <path
              d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z" fill={`url(#brocade-${type})`} />
            <path d="M 240 100 C 265 108, 295 125, 322 175 C 335 200, 328 245, 308 278 C 302 284, 286 278, 282 268 C 296 235, 292 200, 270 185 Z" fill="url(#silkSheen)" />

            {/* Viền Kim Hoàn Cửa Tay Chẽn (Tự Nhiên) */}
            <path d="M 90 274 C 96 280, 112 276, 116 268" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 310 274 C 304 280, 288 276, 284 268" stroke="#E5C365" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* 2 Bàn Tay Ma Nơ Canh Thon Thả Thoát Ra Tự Nhiên */}
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
        {/* Tay thụng buông rủ sâu lượn sóng, vạt rộng quyền quý     */}
        {/* ======================================================== */}
        {type === 'ao_tac' && (
          <g id="ao-tac-tay-thung">
            {/* Lớp Quần Lụa Trắng Dưới Tà Áo Tấc */}
            <path d="M 85 380 L 80 480 L 125 480 L 115 380 Z" fill="#F8F6F0" opacity="0.9" />
            <path d="M 315 380 L 320 480 L 275 480 L 285 380 Z" fill="#F8F6F0" opacity="0.9" />

            {/* Tay Áo Trái Thụng Buông Rủ Sâu (Dáng Võng Cung Mềm Mại) */}
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

            {/* 2 Bàn Tay Ma Nơ Canh Buông Rủ Dưới Ống Tay Thụng */}
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
        {/* 3. ÁO NHẬT BÌNH (Chuẩn Mẫu edit-1-nb1 Cung Đình Huế)       */}
        {/* Bản cổ U thêu hoa, Phượng Ổ, Thủy Ba Tam Sơn, Dải Rủ     */}
        {/* ======================================================== */}
        {type === 'nhat_binh' && (
          <g id="ao-nhat-binh">
            {/* Lớp Vạt Áo Sau & Vạt Trong Rủ Đậm Chiều Sâu */}
            <path d="M 92 280 C 85 360, 78 440, 70 472 L 105 472 Z" fill="#24151C" opacity="0.55" />
            <path d="M 308 280 C 315 360, 322 440, 330 472 L 295 472 Z" fill="#24151C" opacity="0.55" />

            {/* Tay Áo Trái: Cắt liền vai, dáng tay rộng lượn cong tự nhiên */}
            <path
              d="M 155 106 C 120 115, 80 145, 42 205 C 32 235, 42 270, 72 278 C 96 284, 115 260, 130 220 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 155 106 C 120 115, 80 145, 42 205 C 32 235, 42 270, 72 278 C 96 284, 115 260, 130 220 Z" fill={`url(#brocade-${type})`} />
            <path d="M 155 106 C 120 115, 80 145, 42 205 C 32 235, 42 270, 72 278 C 96 284, 115 260, 130 220 Z" fill="url(#silkSheen)" />

            {/* Tay Áo Phải */}
            <path
              d="M 245 106 C 280 115, 320 145, 358 205 C 368 235, 358 270, 328 278 C 304 284, 285 260, 270 220 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <path d="M 245 106 C 280 115, 320 145, 358 205 C 368 235, 358 270, 328 278 C 304 284, 285 260, 270 220 Z" fill={`url(#brocade-${type})`} />
            <path d="M 245 106 C 280 115, 320 145, 358 205 C 368 235, 358 270, 328 278 C 304 284, 285 260, 270 220 Z" fill="url(#silkSheen)" />

            {/* DẢI NGŨ SẮC CỬA TAY (Chuẩn Cung Đình: Lam, Lục, Hoàng, Xích, Bạch) */}
            <g transform="translate(42, 205) rotate(40)">
              <rect x="0" y="0" width="10" height="74" fill="#1E3A8A" />
              <rect x="10" y="0" width="10" height="74" fill="#047857" />
              <rect x="20" y="0" width="10" height="74" fill="#D97706" />
              <rect x="30" y="0" width="10" height="74" fill="#B91C1C" />
              <rect x="40" y="0" width="10" height="74" fill="#F8F6F0" />
            </g>
            <g transform="translate(318, 252) rotate(-40)">
              <rect x="0" y="0" width="10" height="74" fill="#F8F6F0" />
              <rect x="10" y="0" width="10" height="74" fill="#B91C1C" />
              <rect x="20" y="0" width="10" height="74" fill="#D97706" />
              <rect x="30" y="0" width="10" height="74" fill="#047857" />
              <rect x="40" y="0" width="10" height="74" fill="#1E3A8A" />
            </g>

            {/* 2 Bàn Tay Ma Nơ Canh */}
            <g id="mannequin-hands-nhat-binh">
              <g transform="translate(74, 272) rotate(30)" filter="url(#softShadowFilter)">
                <path d="M -7 0 C -9 12, -13 24, -9 34 C -7 40, -1 43, 3 41 C 7 39, 8 33, 6 24 C 5 15, 6 0, 6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M 5 10 C 10 14, 11 22, 8 26 C 6 28, 4 26, 3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M 1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M -3 24 L -4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g transform="translate(326, 272) rotate(-30)" filter="url(#softShadowFilter)">
                <path d="M 7 0 C 9 12, 13 24, 9 34 C 7 40, 1 43, -3 41 C -7 39, -8 33, -6 24 C -5 15, -6 0, -6 0 Z" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.5" />
                <path d="M -5 10 C -10 14, -11 22, -8 26 C -6 28, -4 26, -3 21" fill="url(#mannequinSkin)" stroke="url(#mannequinGold)" strokeWidth="1.2" />
                <path d="M -1 25 L 0 39" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M 3 24 L 4 37" stroke="#8E7B68" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            </g>

            {/* Thân Áo Nhật Bình Suông Dài Uy Nghi */}
            <path
              d="M 155 106 C 135 110, 130 160, 128 240 C 126 330, 118 410, 98 474 C 145 480, 255 480, 302 474 C 282 410, 274 330, 272 240 C 270 160, 265 110, 245 106 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            <path d="M 155 106 C 135 110, 130 160, 128 240 C 126 330, 118 410, 98 474 C 145 480, 255 480, 302 474 C 282 410, 274 330, 272 240 C 270 160, 265 110, 245 106 Z" fill={`url(#brocade-${type})`} />
            <path d="M 155 106 C 135 110, 130 160, 128 240 C 126 330, 118 410, 98 474 C 145 480, 255 480, 302 474 C 282 410, 274 330, 272 240 C 270 160, 265 110, 245 106 Z" fill="url(#silkSheen)" />

            {/* ĐỒ ÁN PHƯỢNG Ổ HOÀNG GIA (2 Bên Vai / Ngực Áo Nhật Bình) */}
            <g transform="translate(138, 160)" opacity="0.85">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#E5C365" strokeWidth="1.2" strokeDasharray="3 2" />
              {/* Phượng Hoàng Cuộn Tròn */}
              <path d="M -7 -4 C -4 -10, 6 -8, 7 0 C 8 7, 0 10, -5 6 C -9 2, -5 -2, 0 0" fill="none" stroke="#FFF3B0" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="-5" cy="-6" r="1.5" fill="#E5C365" />
            </g>
            <g transform="translate(262, 160)" opacity="0.85">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#E5C365" strokeWidth="1.2" strokeDasharray="3 2" />
              <path d="M 7 -4 C 4 -10, -6 -8, -7 0 C -8 7, 0 10, 5 6 C 9 2, 5 -2, 0 0" fill="none" stroke="#FFF3B0" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="5" cy="-6" r="1.5" fill="#E5C365" />
            </g>

            {/* ĐỒ ÁN THỦY BA TAM SƠN (Sóng Nước Ngũ Sắc & 3 Ngọn Núi Thiêng Ở Chân Vạt) */}
            <g id="thuy-ba-tam-son" transform="translate(100, 385)">
              {/* Sóng Nước Dập Dềnh Lớp Dưới */}
              <path d="M 0 85 C 30 75, 70 95, 100 85 C 130 75, 170 95, 200 85 L 202 89 C 170 99, 130 79, 100 89 C 70 99, 30 79, 0 89 Z" fill="#E5C365" />
              {/* Các Dải Sóng Ngũ Sắc Chéo Cung Đình */}
              <g opacity="0.8">
                <path d="M 30 85 L 75 45 L 85 45 L 40 85 Z" fill="#1E3A8A" />
                <path d="M 45 85 L 88 45 L 98 45 L 55 85 Z" fill="#047857" />
                <path d="M 60 85 L 100 45 L 110 45 L 70 85 Z" fill="#D97706" />
                <path d="M 140 85 L 100 45 L 90 45 L 130 85 Z" fill="#B91C1C" />
                <path d="M 155 85 L 112 45 L 102 45 L 145 85 Z" fill="#F8F6F0" />
                <path d="M 170 85 L 125 45 L 115 45 L 160 85 Z" fill="#1E3A8A" />
              </g>
              {/* Tam Sơn (Ba Đỉnh Núi Thiêng Ở Giữa Sóng) */}
              <polygon points="100,28 112,50 88,50" fill="#E5C365" stroke="#FFF3B0" strokeWidth="1" />
              <polygon points="86,36 94,50 78,50" fill="#D4AF37" stroke="#FFF3B0" strokeWidth="0.8" />
              <polygon points="114,36 122,50 106,50" fill="#D4AF37" stroke="#FFF3B0" strokeWidth="0.8" />
            </g>

            {/* Gấu Áo Lượn Sóng Thuyền Hoàng Gia */}
            <path
              d="M 98 474 C 145 464, 255 464, 302 474"
              stroke="#E5C365"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* BẢN CỔ CHỮ NHẬT NHẬT BÌNH (Chữ U To Bản Đối Khâm Thêu Gấm Cung Đình) */}
            <path
              d="M 154 120 C 154 115, 246 115, 246 120 L 246 288 L 226 288 L 226 148 L 174 148 L 174 288 L 154 288 Z"
              fill="url(#nhatBinhCollarRainbow)"
              stroke="#E5C365"
              strokeWidth="2.2"
            />
            {/* Viền Chỉ Kim Tuyến Bên Trong Bản Cổ */}
            <path
              d="M 174 288 L 174 148 L 226 148 L 226 288"
              stroke="#FFF3B0"
              strokeWidth="1"
              fill="none"
            />

            {/* 10 Hạt Ngọc Trai Trắng Đính Dọc Hai Bên Bản Cổ */}
            <g id="nhat-binh-pearls">
              <circle cx="164" cy="165" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="195" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="225" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="255" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="164" cy="278" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />

              <circle cx="236" cy="165" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="195" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="225" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="255" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
              <circle cx="236" cy="278" r="2.8" fill="#FFFFFF" stroke="#E5C365" strokeWidth="0.8" filter="url(#softShadowFilter)" />
            </g>

            {/* DẢI RỦ TRƯỚC NGỰC (2 Dải Lụa Đỏ & Xanh Buông Thướt Tha Xuống Gấu) */}
            <g id="nhat-binh-ribbons">
              <rect x="186" y="302" width="12" height="162" fill="#B91C1C" rx="1.5" />
              <rect x="186" y="460" width="12" height="4" fill="#E5C365" rx="0.5" />

              <rect x="202" y="302" width="12" height="162" fill="#047857" rx="1.5" />
              <rect x="202" y="460" width="12" height="4" fill="#E5C365" rx="0.5" />

              {/* Cúc Hoa Mai Hoàng Cung Ngay Chân Bản Cổ */}
              {isChineseButton ? (
                <g transform="translate(200, 296)">
                  <circle cx="0" cy="0" r="9" fill="#DC2626" stroke="#991B1B" strokeWidth="1.6" filter="url(#softShadowFilter)" />
                  <line x1="-9" y1="0" x2="9" y2="0" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke="#FFF" strokeWidth="1.5" />
                </g>
              ) : (
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
        {/* CỔ ÁO ĐỨNG (LẬP LĨNH) CHO ÁO NGŨ THÂN VÀ ÁO TẤC           */}
        {/* ======================================================== */}
        {type !== 'nhat_binh' && (
          <g id="mandarin-collar-group">
            {/* Áo Đơn Y (White Inner Collar Peeking 2-3mm Evenly) */}
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

            {/* Cổ Đứng Áo Ngoài Ôm Khít Tròn Mềm Chân Cổ */}
            <path
              d="M 166 94 C 166 89, 234 89, 234 94 L 240 116 L 160 116 Z"
              fill={primaryColor}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />
            {/* Viền Kim Tuyến Bo Tròn Mép Cổ */}
            <path
              d="M 166 94 C 166 89, 234 89, 234 94"
              stroke="#E5C365"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Cổ Đơn Y bên trong Bản Cổ Nhật Bình */}
        {type === 'nhat_binh' && hasDonY && (
          <g id="nhat-binh-inner-collar">
            <rect x="174" y="112" width="52" height="14" fill="#FFFFFF" stroke="#E5C365" strokeWidth="1.2" rx="1" />
            <circle cx="200" cy="119" r="2.2" fill="#E5C365" />
          </g>
        )}

        {/* ======================================================== */}
        {/* 5 CÚC NGŨ THƯỜNG DỌC VẠT HÒ CÀI CHÉO SANG NÁCH PHẢI       */}
        {/* ======================================================== */}
        {type !== 'nhat_binh' && (
          <g id="buttons-group">
            {[
              { id: 1, cx: 222, cy: 104, cordLen: 10 },
              { id: 2, cx: 228, cy: 144, cordLen: 12 },
              { id: 3, cx: 235, cy: 188, cordLen: 12 },
              { id: 4, cx: 238, cy: 234, cordLen: 12 },
              { id: 5, cx: 240, cy: 284, cordLen: 12 }
            ].map(btn => (
              <g key={btn.id} filter="url(#softShadowFilter)">
                {/* Dây Khuy Tết Ngang Tinh Xảo */}
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
                  <g>
                    <circle cx={btn.cx} cy={btn.cy} r="6.2" fill="#DC2626" stroke="#991B1B" strokeWidth="1.4" />
                    <line x1={btn.cx - 5} y1={btn.cy} x2={btn.cx + 5} y2={btn.cy} stroke="#FFF" strokeWidth="1.2" />
                    <line x1={btn.cx} y1={btn.cy - 5} x2={btn.cx} y2={btn.cy + 5} stroke="#FFF" strokeWidth="1.2" />
                  </g>
                ) : (
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
              <span>{type === 'ngu_than' ? 'Áo Ngũ Thân Tay Chẽn' : type === 'ao_tac' ? 'Áo Tấc (Tay Thụng)' : 'Áo Nhật Bình Cung Đình'}</span>
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
