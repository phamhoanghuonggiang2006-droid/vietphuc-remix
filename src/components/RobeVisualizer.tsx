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
        viewBox="0 0 400 500"
        className="w-full h-full max-w-[360px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`robeGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="60%" stopColor={primaryColor} stopOpacity="0.88" />
            <stop offset="100%" stopColor="#08080c" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5C365" />
            <stop offset="50%" stopColor="#FFF3B0" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>

          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.6"/>
          </filter>
        </defs>

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
            <path
              d="M 280 120 L 360 240 L 330 255 L 265 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#2e2e38"
              strokeWidth="1.2"
            />
            {/* Fitted cuff detail */}
            <path d="M 40 240 L 70 255" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <path d="M 360 240 L 330 255" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />

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

            {/* Tà áo vạt con bên phải khép chéo */}
            <path
              d="M 185 110 Q 220 140 230 180 L 240 440"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2"
              fill="none"
            />

            {/* Đường trung phẫu chính giữa tà áo */}
            <line x1="200" y1="180" x2="200" y2="440" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
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
            <path
              d="M 275 115 L 385 175 L 385 350 L 285 310 L 265 175 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
            {/* Sleeve folds / nếp gấp lụa */}
            <path d="M 25 210 Q 65 240 120 230" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
            <path d="M 375 210 Q 335 240 280 230" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>

            {/* Body */}
            <path
              d="M 130 110 L 270 110 L 305 450 L 95 450 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
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
            <path
              d="M 275 115 L 370 160 L 370 260 L 270 210 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />
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

            {/* Main Body */}
            <path
              d="M 130 110 L 270 110 L 300 445 L 100 445 Z"
              fill={`url(#robeGrad-${type})`}
              stroke="#3a3a46"
              strokeWidth="1.5"
            />

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
            <circle cx="218" cy="98" r={isChineseButton ? "6" : "5"} fill={buttonFill} stroke="#111" strokeWidth="1" />
            {isChineseButton && <line x1="212" y1="98" x2="224" y2="98" stroke="#FFF" strokeWidth="1" />}

            {/* Button 2: Upper chest opening */}
            <circle cx="224" cy="116" r={isChineseButton ? "6" : "5"} fill={buttonFill} stroke="#111" strokeWidth="1" />
            {isChineseButton && <line x1="218" y1="116" x2="230" y2="116" stroke="#FFF" strokeWidth="1" />}

            {/* Button 3: Under right armpit (Nách phải) */}
            <circle cx="236" cy="148" r={isChineseButton ? "6" : "5"} fill={buttonFill} stroke="#111" strokeWidth="1" />
            {isChineseButton && <line x1="230" y1="148" x2="242" y2="148" stroke="#FFF" strokeWidth="1" />}

            {/* Button 4: Upper waist (Sườn trên) */}
            <circle cx="238" cy="186" r={isChineseButton ? "6" : "5"} fill={buttonFill} stroke="#111" strokeWidth="1" />
            {isChineseButton && <line x1="232" y1="186" x2="244" y2="186" stroke="#FFF" strokeWidth="1" />}

            {/* Button 5: Lower flank (Sườn dưới) */}
            <circle cx="242" cy="226" r={isChineseButton ? "6" : "5"} fill={buttonFill} stroke="#111" strokeWidth="1" />
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
