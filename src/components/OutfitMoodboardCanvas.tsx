import React, { useState } from 'react';
import { 
  HeritageItem, 
  ColorOption, 
  ModernRemixItem 
} from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import { 
  Eye, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  Palette, 
  ShieldAlert,
  Info,
  Maximize2,
  X,
  Download,
  Loader2
} from 'lucide-react';

export type CanvasViewMode = 'mannequin' | 'editorial' | 'breakdown';
export type HeritageBackground = 'studio' | 'hue' | 'hoian' | 'thanglong';

interface OutfitMoodboardCanvasProps {
  activeGarment: HeritageItem;
  activeColor: ColorOption;
  selectedColorHex: string;
  activeButtonItem: ModernRemixItem;
  activeBottomItem: ModernRemixItem;
  activeShoesItem: ModernRemixItem;
  activeAccessoryItem: ModernRemixItem;
  hasDonY: boolean;
  uploadedImage: string | null;
  isChineseButtonSelected: boolean;
  isImperialYellowSelected: boolean;
  isTabooClashSelected: boolean;
}

export const OutfitMoodboardCanvas: React.FC<OutfitMoodboardCanvasProps> = ({
  activeGarment,
  activeColor,
  selectedColorHex,
  activeButtonItem,
  activeBottomItem,
  activeShoesItem,
  activeAccessoryItem,
  hasDonY,
  uploadedImage,
  isChineseButtonSelected,
  isImperialYellowSelected,
  isTabooClashSelected,
}) => {
  const [viewMode, setViewMode] = useState<CanvasViewMode>('mannequin');
  const [selectedBg, setSelectedBg] = useState<HeritageBackground>('studio');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [isExportingPoster, setIsExportingPoster] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Check if any taboo is currently active
  const hasActiveTaboo = isChineseButtonSelected || isImperialYellowSelected || isTabooClashSelected || !hasDonY;

  // 2D image URLs
  const bottomCanvasImg = activeBottomItem.canvas2dUrl || activeBottomItem.thumbnailUrl || '';
  const shoesCanvasImg = activeShoesItem.canvas2dUrl || activeShoesItem.thumbnailUrl || '';
  const accessoryCanvasImg = activeAccessoryItem.canvas2dUrl || activeAccessoryItem.thumbnailUrl || '';
  const isKhanDongSelected = activeAccessoryItem.id === 'acc-khan-dong';

  // 4 Heritage Background Presets
  const BACKGROUND_THEMES = [
    {
      id: 'studio' as HeritageBackground,
      name: 'Studio Cung Đình',
      icon: '👑',
      badge: 'Haute Couture'
    },
    {
      id: 'hue' as HeritageBackground,
      name: 'Cố Đô Huế',
      icon: '🏯',
      badge: 'Đại Nội'
    },
    {
      id: 'hoian' as HeritageBackground,
      name: 'Phố Cổ Hội An',
      icon: '🏮',
      badge: 'Đèn Lồng'
    },
    {
      id: 'thanglong' as HeritageBackground,
      name: 'Thăng Long',
      icon: '🏛️',
      badge: 'Đoan Môn'
    },
  ];

  // ==========================================
  // EXPORT POSTER LOOKBOOK (HTML5 CANVAS PNG)
  // ==========================================
  const exportOutfitPoster = async () => {
    setIsExportingPoster(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      const loadImage = (src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });
      };

      // 1. Background fill based on selectedBg
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1600);
      if (selectedBg === 'hue') {
        bgGrad.addColorStop(0, '#1c0f16');
        bgGrad.addColorStop(0.5, '#28131d');
        bgGrad.addColorStop(1, '#0e070c');
      } else if (selectedBg === 'hoian') {
        bgGrad.addColorStop(0, '#1c150c');
        bgGrad.addColorStop(0.5, '#261b0e');
        bgGrad.addColorStop(1, '#0a0d14');
      } else if (selectedBg === 'thanglong') {
        bgGrad.addColorStop(0, '#151012');
        bgGrad.addColorStop(0.5, '#1e1417');
        bgGrad.addColorStop(1, '#090b0e');
      } else {
        bgGrad.addColorStop(0, '#0c0c12');
        bgGrad.addColorStop(0.5, '#14141f');
        bgGrad.addColorStop(1, '#08080c');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1600);

      // Subtle Radial Glow behind outfit
      const radialGlow = ctx.createRadialGradient(600, 650, 50, 600, 650, 550);
      radialGlow.addColorStop(0, `${selectedColorHex}33`);
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, 1200, 1600);

      // 2. Royal Double Border with Gold Inlay
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1120, 1520);

      ctx.strokeStyle = '#E5C365';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(52, 52, 1096, 1496);

      // 4 Corner Traditional Key Motifs (Góc hồi văn)
      const drawCornerKey = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = '#E5C365';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.moveTo(8, 24);
        ctx.lineTo(8, 8);
        ctx.lineTo(24, 8);
        ctx.stroke();
        ctx.restore();
      };
      drawCornerKey(56, 56, 0);
      drawCornerKey(1144, 56, Math.PI / 2);
      drawCornerKey(1144, 1544, Math.PI);
      drawCornerKey(56, 1544, -Math.PI / 2);

      // 3. Header Text
      ctx.textAlign = 'center';
      ctx.font = '600 16px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('H E R I T S T Y L E   A I   •   V I Ệ T   P H Ụ C   R E M I X   2 0 2 6', 600, 110);

      ctx.font = 'bold 44px serif';
      ctx.fillStyle = '#F5F2EB';
      ctx.fillText(activeGarment.name.toUpperCase(), 600, 165);

      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = '#D4AF37';
      const bgName = BACKGROUND_THEMES.find(b => b.id === selectedBg)?.name.toUpperCase() || 'STUDIO CUNG ĐÌNH';
      ctx.fillText(`SẮC ${activeColor.vietnameseName.toUpperCase()} • BỐI CẢNH: ${bgName}`, 600, 205);

      // Decorative line under title
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(350, 225);
      ctx.lineTo(850, 225);
      ctx.stroke();

      // 4. Center Outfit Showcase Box (Lookbook Cards Layout)
      ctx.fillStyle = 'rgba(18, 18, 25, 0.7)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(80, 255, 1040, 840, 20);
      ctx.fill();
      ctx.stroke();

      // Load 2D images
      const [accImg, botImg, shoeImg] = await Promise.all([
        loadImage(accessoryCanvasImg),
        loadImage(bottomCanvasImg),
        loadImage(shoesCanvasImg)
      ]);

      // Left Garment Card inside Showcase
      ctx.fillStyle = 'rgba(197, 160, 89, 0.12)';
      ctx.beginPath();
      ctx.roundRect(110, 280, 500, 790, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = '#E5C365';
      ctx.fillText('Y PHỤC HOÀNG GIA CHÍNH', 360, 325);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#A8A29E';
      ctx.fillText('Quy chế triều Nguyễn (1802 - 1945)', 360, 350);

      // Color circle preview
      ctx.fillStyle = selectedColorHex;
      ctx.beginPath();
      ctx.arc(360, 480, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E5C365';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(activeGarment.name, 360, 610);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#E5C365';
      ctx.fillText(activeColor.vietnameseName, 360, 640);

      ctx.font = '15px sans-serif';
      ctx.fillStyle = hasDonY ? '#34D399' : '#F87171';
      ctx.fillText(hasDonY ? '✓ Cổ Đơn Y trắng thanh nhã' : '✗ Cảnh báo: Thiếu Đơn Y trắng', 360, 680);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = isChineseButtonSelected ? '#F87171' : '#E5C365';
      ctx.fillText(isChineseButtonSelected ? '✗ Vi phạm: Cúc vải Tàu' : `✓ ${activeButtonItem.name.split('(')[0]}`, 360, 715);

      ctx.font = 'italic 14px sans-serif';
      ctx.fillStyle = '#D6D3D1';
      ctx.fillText(`“${activeGarment.dynasty} • ${activeGarment.subName}”`, 360, 770);

      // Right 3 Component Cards
      // 1. Phụ Kiện Card
      ctx.fillStyle = 'rgba(12, 12, 18, 0.8)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.beginPath();
      ctx.roundRect(640, 280, 450, 245, 14);
      ctx.fill();
      ctx.stroke();
      if (accImg) {
        ctx.drawImage(accImg, 660, 310, 120, 120);
      }
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('PHỤ KIỆN ĐI KÈM', 800, 325);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(activeAccessoryItem.name, 800, 355);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#A8A29E';
      ctx.fillText(activeAccessoryItem.styleVibe, 800, 385);
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(activeAccessoryItem.description.slice(0, 45) + '...', 800, 410);

      // 2. Thân Dưới Card
      ctx.fillStyle = 'rgba(12, 12, 18, 0.8)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.beginPath();
      ctx.roundRect(640, 550, 450, 245, 14);
      ctx.fill();
      ctx.stroke();
      if (botImg) {
        ctx.drawImage(botImg, 660, 580, 120, 120);
      }
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('THÂN DƯỚI REMIX', 800, 595);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(activeBottomItem.name, 800, 625);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#A8A29E';
      ctx.fillText(activeBottomItem.styleVibe, 800, 655);
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(activeBottomItem.description.slice(0, 45) + '...', 800, 680);

      // 3. Giày / Guốc Card
      ctx.fillStyle = 'rgba(12, 12, 18, 0.8)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.beginPath();
      ctx.roundRect(640, 820, 450, 245, 14);
      ctx.fill();
      ctx.stroke();
      if (shoeImg) {
        ctx.drawImage(shoeImg, 660, 850, 120, 120);
      }
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('GIÀY / GUỐC PHỐI', 800, 865);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(activeShoesItem.name, 800, 895);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#A8A29E';
      ctx.fillText(activeShoesItem.styleVibe, 800, 925);
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(activeShoesItem.description.slice(0, 45) + '...', 800, 950);

      // 5. Bottom Palette & Specifications Panel
      ctx.fillStyle = 'rgba(14, 14, 20, 0.85)';
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
      ctx.beginPath();
      ctx.roundRect(80, 1120, 1040, 340, 20);
      ctx.fill();
      ctx.stroke();

      // Section 5.1: Color Palette
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('BẢNG SẮC TỘC OUTFIT (COLOR HARMONY)', 120, 1165);

      const swatches = [
        { color: selectedColorHex, label: 'Màu Áo Chính', hex: selectedColorHex },
        { color: '#F4EFE6', label: 'Bạch Lụa Đơn Y', hex: '#F4EFE6' },
        { color: '#E5C365', label: 'Khuy Bát Bửu', hex: '#E5C365' },
        { color: '#1C1917', label: 'Huyền Trầm', hex: '#1C1917' }
      ];

      swatches.forEach((sw, idx) => {
        const swX = 120 + idx * 95;
        const swY = 1220;
        ctx.fillStyle = sw.color;
        ctx.beginPath();
        ctx.arc(swX + 25, swY + 25, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#D6D3D1';
        ctx.fillText(sw.label, swX + 25, swY + 70);
        ctx.fillStyle = '#888';
        ctx.fillText(sw.hex, swX + 25, swY + 86);
      });

      // Taboo status description
      ctx.textAlign = 'left';
      ctx.font = '13px sans-serif';
      ctx.fillStyle = hasActiveTaboo ? '#F87171' : '#34D399';
      ctx.fillText(
        hasActiveTaboo 
          ? '⚠️ Lưu ý: Phát hiện chi tiết chưa tối ưu theo quy chế triều đình.' 
          : '✓ Thẩm định: Bộ phối tuân thủ hài hòa quy chuẩn ngũ thường và thẩm mỹ hiện đại.',
        120, 1400
      );

      // Section 5.2: Royal Vermilion Seal Stamp
      ctx.save();
      ctx.translate(940, 1270);
      ctx.rotate(-0.05);
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 5;
      ctx.strokeRect(-75, -75, 150, 150);

      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(-68, -68, 136, 136);

      ctx.textAlign = 'center';
      ctx.font = 'bold 16px serif';
      ctx.fillStyle = '#DC2626';
      ctx.fillText('DI SẢN', 0, -32);
      ctx.font = 'bold 20px serif';
      ctx.fillText('CHUẨN Y QUAN', 0, 0);
      ctx.font = 'bold 15px serif';
      ctx.fillText('THẨM ĐỊNH', 0, 28);
      ctx.font = '600 13px sans-serif';
      ctx.fillText('2026', 0, 50);
      ctx.restore();

      // Section 5.3: QR / Verification signature line
      ctx.textAlign = 'left';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#78716C';
      ctx.fillText('Dự thi Sáng tạo Di sản • Nền tảng HeritStyle AI', 540, 1340);
      ctx.fillText(`Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}`, 540, 1365);

      // 6. Trigger PNG Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `HeritStyle_Lookbook_${activeGarment.id}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccessMessage('Đã xuất Poster Lookbook thành công!');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error generating poster:', err);
    } finally {
      setIsExportingPoster(false);
    }
  };

  // ==========================================
  // HERITAGE BACKGROUND ARTWORK
  // ==========================================
  const renderHeritageBackgroundArt = () => {
    switch (selectedBg) {
      case 'hue':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2a131b] via-[#1a0c14] to-[#0d070b]" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-[#e07a5f]/25 to-transparent blur-3xl" />
            
            {/* Ngọ Môn Curved Palace Roofline Silhouette */}
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-32 opacity-25">
              <path
                d="M 0 200 L 0 140 Q 60 145 100 120 Q 140 100 160 80 Q 180 110 210 115 L 210 100 Q 230 75 250 50 Q 270 75 290 100 L 290 115 Q 320 110 340 80 Q 360 100 400 120 Q 440 145 500 140 L 500 200 Z"
                fill="#080407"
              />
              <path d="M 160 80 Q 155 70 150 72" stroke="#e5c365" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M 340 80 Q 345 70 350 72" stroke="#e5c365" strokeWidth="2" fill="none" opacity="0.6" />
              <circle cx="250" cy="46" r="4" fill="#e5c365" opacity="0.8" />
            </svg>

            {/* Torches & warm ember sparks */}
            <div className="absolute top-20 left-12 w-2 h-2 rounded-full bg-[#f4a261] blur-sm animate-pulse" />
            <div className="absolute top-36 right-16 w-3 h-3 rounded-full bg-[#e76f51] blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-28 left-20 w-2.5 h-2.5 rounded-full bg-[#e5c365] blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        );

      case 'hoian':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c180e] via-[#14181f] to-[#080d14]" />
            <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-[#ffd166]/15 blur-2xl" />
            
            {/* Glowing Silk Lanterns */}
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-60">
              <g transform="translate(60, 40)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#c5a059" strokeWidth="1" strokeDasharray="2 2" />
                <ellipse cx="0" cy="55" rx="14" ry="20" fill="#ffd166" fillOpacity="0.4" />
                <ellipse cx="0" cy="55" rx="9" ry="15" fill="#f4a261" fillOpacity="0.7" />
                <line x1="0" y1="75" x2="0" y2="95" stroke="#e76f51" strokeWidth="1.5" />
              </g>
              <g transform="translate(340, 60)">
                <line x1="0" y1="0" x2="0" y2="35" stroke="#c5a059" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="0" cy="50" r="16" fill="#e63946" fillOpacity="0.5" />
                <circle cx="0" cy="50" r="10" fill="#ff758f" fillOpacity="0.7" />
                <line x1="0" y1="66" x2="0" y2="85" stroke="#e63946" strokeWidth="1.5" />
              </g>
              <g transform="translate(95, 110)">
                <line x1="0" y1="0" x2="0" y2="25" stroke="#c5a059" strokeWidth="1" strokeDasharray="2 2" />
                <ellipse cx="0" cy="38" rx="11" ry="16" fill="#2a9d8f" fillOpacity="0.4" />
                <line x1="0" y1="54" x2="0" y2="70" stroke="#2a9d8f" strokeWidth="1" />
              </g>
            </svg>

            {/* River water reflection ripples */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a1118]/80 to-transparent border-t border-[#f4a261]/10" />
          </div>
        );

      case 'thanglong':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#181215] via-[#141217] to-[#0a0a0f]" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#c5a059]/10 blur-3xl" />

            {/* Đoan Môn Brick Citadel Silhouette */}
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-28 opacity-25">
              <rect x="0" y="100" width="500" height="100" fill="#08080c" />
              <path d="M 215 200 L 215 145 Q 250 120 285 145 L 285 200 Z" fill="#141217" />
              <path d="M 130 200 L 130 155 Q 160 135 190 155 L 190 200 Z" fill="#141217" />
              <path d="M 310 200 L 310 155 Q 340 135 370 155 L 370 200 Z" fill="#141217" />
              <rect x="180" y="70" width="140" height="30" fill="#08080c" />
              <polygon points="170,70 250,45 330,70" fill="#0c0b10" />
            </svg>

            <svg viewBox="0 0 300 120" className="absolute top-6 left-6 w-36 h-20 opacity-20">
              <path d="M 20 80 Q 50 40 90 70 Q 130 30 180 65 Q 220 50 250 80" stroke="#c5a059" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        );

      case 'studio':
      default:
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c12] via-[#12121a] to-[#08080c]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[520px] bg-gradient-to-b from-[#c5a059]/15 via-[#c5a059]/03 to-transparent blur-2xl" />
            
            {/* Gold dust motes */}
            <div className="absolute top-24 left-1/4 w-1.5 h-1.5 rounded-full bg-[#e5c365] opacity-40 blur-[0.5px]" />
            <div className="absolute top-48 right-1/4 w-1.5 h-1.5 rounded-full bg-[#e5c365] opacity-50 blur-[0.5px]" />
            <div className="absolute top-72 left-1/3 w-1 h-1 rounded-full bg-[#e5c365] opacity-30" />
            <div className="absolute bottom-36 right-1/3 w-1 h-1 rounded-full bg-[#e5c365] opacity-35" />
          </div>
        );
    }
  };

  return (
    <div className="bg-[#141419] border border-[#23232c] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
      {/* HEADER: TITLE & CONTROLS */}
      <div className="p-4 sm:p-5 border-b border-[#22222c] bg-gradient-to-r from-[#171720] to-[#121217] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                CANVAS PREVIEW OUTFIT TỔNG THỂ
              </span>
              {hasActiveTaboo ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  Cần Chỉnh Quy Chuẩn
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Hài Hòa Di Sản
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              Đồng bộ trực quan 10 món phối 2D cùng Y quan Triều Nguyễn
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-[#0d0d12] p-1 rounded-xl border border-[#262635]">
          <button
            type="button"
            onClick={() => setViewMode('mannequin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'mannequin'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>👔 Toàn Thân</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'editorial'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>🎨 Moodboard</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('breakdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'breakdown'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>🎴 Chi Tiết 2D</span>
          </button>
        </div>
      </div>

      {/* HERITAGE BACKGROUND SELECTOR & ACTIONS SUB-BAR */}
      <div className="px-4 py-2.5 bg-[#0e0e13] border-b border-[#1f1f28] flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">
            Bối Cảnh:
          </span>
          {BACKGROUND_THEMES.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setSelectedBg(bg.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
                selectedBg === bg.id
                  ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#e5c365] font-bold shadow-sm'
                  : 'bg-[#14141c] border-white/5 text-stone-400 hover:text-stone-200 hover:border-white/10'
              }`}
            >
              <span>{bg.icon}</span>
              <span>{bg.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Export Lookbook Poster Button */}
          <button
            type="button"
            onClick={exportOutfitPoster}
            disabled={isExportingPoster}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0d0d12] font-bold text-[11px] shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Tải ảnh Poster Lookbook Hoàng Gia để nộp bài hoặc lưu trữ"
          >
            {isExportingPoster ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExportingPoster ? 'Đang xuất...' : 'Tải Poster Hoàng Gia'}</span>
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {exportSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {/* CANVAS MAIN BODY */}
      <div className="relative p-4 sm:p-5 min-h-[540px] flex items-center justify-center overflow-hidden transition-all duration-700">
        
        {/* Active Heritage Atmospheric Background Layer */}
        {renderHeritageBackgroundArt()}

        {/* Ambient color glow corresponding to active color */}
        <div 
          className="absolute w-80 h-80 rounded-full blur-[120px] opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: selectedColorHex }}
        />

        {/* Top Controls Bar on Canvas */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Active color swatch & garment title */}
          <div className="bg-black/75 backdrop-blur-md border border-[#c5a059]/30 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
            <span 
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0" 
              style={{ backgroundColor: selectedColorHex }} 
            />
            <span className="text-xs font-bold text-stone-200 truncate max-w-[140px] sm:max-w-[180px]">
              {activeGarment.name}
            </span>
            <span className="text-[10px] text-[#c5a059] hidden sm:inline">
              • {activeColor.vietnameseName.split('(')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Labels */}
            <button
              type="button"
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                showLabels 
                  ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40' 
                  : 'bg-black/60 text-stone-400 border-white/10 hover:text-stone-200'
              }`}
              title="Bật/Tắt nhãn thông tin trên Canvas"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{showLabels ? 'Ẩn nhãn' : 'Hiện nhãn'}</span>
            </button>

            {/* Zoom modal trigger */}
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(true)}
              className="p-1.5 rounded-lg bg-black/60 text-stone-300 border border-white/10 hover:text-white transition-all"
              title="Phóng to Canvas"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODE 1: MANNEQUIN TOÀN THÂN (HEAD-TO-TOE OUTFIT CANVAS) */}
        {/* ======================================================== */}
        {viewMode === 'mannequin' && (
          <div className="relative w-full max-w-[420px] py-6 flex flex-col items-center justify-center select-none">
            
            {/* GHOST MANNEQUIN / HAUTE COUTURE CROQUIS SILHOUETTE */}
            <svg 
              viewBox="0 0 400 580" 
              className="absolute inset-0 w-full h-full max-w-[420px] mx-auto pointer-events-none select-none z-0 transition-opacity duration-500"
              style={{ opacity: 0.8 }}
            >
              <defs>
                <linearGradient id="mannequinStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E5C365" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#C5A059" stopOpacity="0.25" />
                  <stop offset="90%" stopColor="#A67C28" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#E5C365" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="mannequinBodyFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E1E28" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#14141C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0B0B0F" stopOpacity="0.4" />
                </linearGradient>
                <radialGradient id="standGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
                  <stop offset="70%" stopColor="#C5A059" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Head & Face Contour */}
              <ellipse cx="200" cy="52" rx="20" ry="26" fill="url(#mannequinBodyFill)" stroke="url(#mannequinStroke)" strokeWidth="1" strokeDasharray="3 2" />
              
              {/* Slender Couture Neck */}
              <path d="M 192 76 L 192 98 M 208 76 L 208 98" stroke="url(#mannequinStroke)" strokeWidth="1" />

              {/* Shoulders Contours aligning with Robe */}
              <path d="M 125 118 Q 160 98 200 98 Q 240 98 275 118" stroke="url(#mannequinStroke)" strokeWidth="1.2" fill="none" />

              {/* Torso & Hip Guides */}
              <path d="M 150 140 Q 165 240 160 330" stroke="url(#mannequinStroke)" strokeWidth="0.8" strokeDasharray="2 3" fill="none" />
              <path d="M 250 140 Q 235 240 240 330" stroke="url(#mannequinStroke)" strokeWidth="0.8" strokeDasharray="2 3" fill="none" />

              {/* Slender Leg Lines guiding into Shoes */}
              <line x1="178" y1="360" x2="178" y2="520" stroke="url(#mannequinStroke)" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="222" y1="360" x2="222" y2="520" stroke="url(#mannequinStroke)" strokeWidth="1" strokeDasharray="4 3" />

              {/* Royal Exhibition Pedestal Base (Bệ Trưng Bày Haute Couture) */}
              <ellipse cx="200" cy="548" rx="100" ry="16" fill="url(#standGlow)" />
              <ellipse cx="200" cy="548" rx="85" ry="12" fill="#0C0C12" stroke="url(#mannequinStroke)" strokeWidth="1.2" />
              <ellipse cx="200" cy="546" rx="80" ry="10" fill="none" stroke="#E5C365" strokeWidth="0.6" strokeOpacity="0.4" />
            </svg>

            {/* 1. HEAD ZONE: KHĂN ĐÓNG HOẶC SILHOUETTE ĐẦU */}
            <div className="relative z-30 flex flex-col items-center -mb-8 transition-all duration-300">
              {isKhanDongSelected ? (
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setActiveHotspot(activeHotspot === 'head' ? null : 'head')}
                >
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-28 h-18 sm:w-32 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform"
                  />
                  {showLabels && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2 py-0.5 rounded-full text-[10px] text-[#c5a059] font-bold shadow-lg pointer-events-none">
                      {activeAccessoryItem.name}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-6 -mb-2 flex items-center justify-center opacity-40">
                  <div className="w-8 h-3 rounded-t-full border-t border-x border-[#c5a059]/30" />
                </div>
              )}
            </div>

            {/* 2. UPPER BODY ZONE: ÁO CỔ PHỤC (ROBE VISUALIZER HOẶC ẢNH UPLOAD) */}
            <div className="relative z-20 w-full max-w-[320px] sm:max-w-[350px] transition-all duration-500">
              {uploadedImage ? (
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={uploadedImage}
                    alt="Ảnh người dùng"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-[10px] text-[#c5a059] font-semibold">Ảnh trang phục đã tải</span>
                    <span className="text-xs font-bold text-white">{activeGarment.name}</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center">
                  <RobeVisualizer
                    type={activeGarment.svgType}
                    primaryColor={selectedColorHex}
                    hasDonY={hasDonY}
                    buttonType={activeButtonItem.id}
                    interactive={false}
                    borderless={true}
                  />

                  {/* Button Detail Badge Floating on Upper Robe */}
                  {showLabels && (
                    <div 
                      className={`absolute top-28 right-4 bg-black/85 backdrop-blur-md border px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-xl text-[10px] ${
                        isChineseButtonSelected 
                          ? 'border-rose-500/80 text-rose-300' 
                          : 'border-[#c5a059]/50 text-stone-200'
                      }`}
                      title={activeButtonItem.description}
                    >
                      <img
                        src={activeButtonItem.thumbnailUrl}
                        alt={activeButtonItem.name}
                        className="w-4 h-4 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <span className="font-semibold truncate max-w-[95px]">
                        {activeButtonItem.name.split('(')[0]}
                      </span>
                    </div>
                  )}

                  {/* SIDE ACCESSORY (QUẠT GIẤY / BỘI NGỌC / ĐỒNG HỒ) */}
                  {!isKhanDongSelected && accessoryCanvasImg && (
                    <div 
                      className={`absolute z-30 transition-all duration-500 cursor-pointer group ${
                        activeAccessoryItem.id === 'acc-paper-fan'
                          ? 'bottom-12 -right-4 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 -rotate-12 hover:rotate-0'
                          : activeAccessoryItem.id === 'acc-boi-ngoc'
                          ? 'bottom-8 -left-3 sm:-left-6 w-20 h-28 sm:w-24 sm:h-32 hover:scale-105'
                          : 'bottom-16 -left-3 sm:-left-5 w-20 h-20 sm:w-24 sm:h-24 hover:scale-105'
                      }`}
                      onClick={() => setActiveHotspot(activeHotspot === 'acc' ? null : 'acc')}
                      title={activeAccessoryItem.name}
                    >
                      <img
                        src={accessoryCanvasImg}
                        alt={activeAccessoryItem.name}
                        className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                      />
                      {showLabels && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2 py-0.5 rounded-full text-[9px] text-[#c5a059] font-bold shadow-lg pointer-events-none">
                          {activeAccessoryItem.name.split('(')[0]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. BOTTOM ZONE: THÂN DƯỚI (QUẦN LINEN / CHÂN VÁY / JEANS) */}
            <div className="relative z-10 w-full max-w-[280px] -mt-16 sm:-mt-20 flex flex-col items-center transition-all duration-500">
              {bottomCanvasImg ? (
                <div 
                  className="relative group cursor-pointer w-full flex justify-center"
                  onClick={() => setActiveHotspot(activeHotspot === 'bottom' ? null : 'bottom')}
                >
                  <img
                    src={bottomCanvasImg}
                    alt={activeBottomItem.name}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:scale-[1.02] transition-transform"
                  />
                  {showLabels && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2.5 py-0.5 rounded-full text-[10px] text-stone-200 font-bold shadow-lg pointer-events-none flex items-center gap-1">
                      <span className="text-[#c5a059]">Thân dưới:</span>
                      <span>{activeBottomItem.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-48 h-20 border border-dashed border-[#c5a059]/20 rounded-xl flex items-center justify-center text-xs text-stone-500">
                  Chưa có ảnh thân dưới
                </div>
              )}
            </div>

            {/* 4. FOOTWEAR ZONE: GIÀY / GUỐC (GUỐC MỘC / HÀI THÊU / SNEAKERS) */}
            <div className="relative z-20 w-full max-w-[260px] -mt-10 sm:-mt-12 flex flex-col items-center transition-all duration-500">
              {/* Ground contact shadow ellipse */}
              <div className="absolute bottom-2 w-48 h-5 bg-black/70 blur-md rounded-full pointer-events-none" />

              {shoesCanvasImg ? (
                <div 
                  className="relative group cursor-pointer w-full flex justify-center"
                  onClick={() => setActiveHotspot(activeHotspot === 'shoes' ? null : 'shoes')}
                >
                  <img
                    src={shoesCanvasImg}
                    alt={activeShoesItem.name}
                    className="w-40 h-28 sm:w-48 sm:h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform"
                  />
                  {showLabels && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2.5 py-0.5 rounded-full text-[10px] text-stone-200 font-bold shadow-lg pointer-events-none flex items-center gap-1">
                      <span className="text-[#c5a059]">Giày:</span>
                      <span>{activeShoesItem.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-36 h-12 border border-dashed border-[#c5a059]/20 rounded-xl flex items-center justify-center text-xs text-stone-500">
                  Chưa có ảnh giày
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: MOODBOARD NGHỆ THUẬT (EDITORIAL FLATLAY SPREAD) */}
        {/* ======================================================== */}
        {viewMode === 'editorial' && (
          <div className="relative w-full max-w-[620px] py-4 select-none">
            <div className="relative bg-[#111117] border border-[#2b2b3a] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5">
              
              {/* Top Editorial Header */}
              <div className="flex items-center justify-between border-b border-[#252533] pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold">
                    HERITSTYLE LOOKBOOK • HAUTE COUTURE
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#f5f2eb]">
                    Bộ Phối {activeGarment.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Niên đại gốc</span>
                  <span className="text-xs font-semibold text-[#c5a059]">Triều Nguyễn</span>
                </div>
              </div>

              {/* Editorial Grid: Hero Robe + 3 Surrounding 2D Item Cards */}
              <div className="grid grid-cols-12 gap-3.5">
                
                {/* Hero Robe: 7 cols */}
                <div className="col-span-12 sm:col-span-7 bg-[#0c0c10] border border-[#262635] rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{ backgroundColor: selectedColorHex }}
                  />
                  <div className="relative z-10 w-full">
                    {uploadedImage ? (
                      <img 
                        src={uploadedImage} 
                        alt="Ảnh y phục" 
                        className="w-full aspect-[4/5] object-cover rounded-lg"
                      />
                    ) : (
                      <RobeVisualizer
                        type={activeGarment.svgType}
                        primaryColor={selectedColorHex}
                        hasDonY={hasDonY}
                        buttonType={activeButtonItem.id}
                        interactive={false}
                        borderless={true}
                      />
                    )}
                  </div>
                  <div className="relative z-10 w-full mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium truncate">{activeGarment.name}</span>
                    <span className="text-[11px] text-[#c5a059]">{activeColor.vietnameseName.split('(')[0]}</span>
                  </div>
                </div>

                {/* 3 Item Stack: 5 cols */}
                <div className="col-span-12 sm:col-span-5 flex flex-col gap-3">
                  
                  {/* Card 1: Phụ Kiện Đi Kèm */}
                  <div className="bg-[#0e0e14] border border-[#242433] rounded-xl p-2.5 flex items-center gap-2.5 hover:border-[#c5a059]/40 transition-all">
                    <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {accessoryCanvasImg ? (
                        <img 
                          src={accessoryCanvasImg} 
                          alt={activeAccessoryItem.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-stone-500">2D</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a059] font-bold block">
                        Phụ Kiện
                      </span>
                      <span className="text-xs font-bold text-stone-200 block truncate">
                        {activeAccessoryItem.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {activeAccessoryItem.styleVibe}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Thân Dưới */}
                  <div className="bg-[#0e0e14] border border-[#242433] rounded-xl p-2.5 flex items-center gap-2.5 hover:border-[#c5a059]/40 transition-all">
                    <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {bottomCanvasImg ? (
                        <img 
                          src={bottomCanvasImg} 
                          alt={activeBottomItem.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-stone-500">2D</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a059] font-bold block">
                        Thân Dưới
                      </span>
                      <span className="text-xs font-bold text-stone-200 block truncate">
                        {activeBottomItem.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {activeBottomItem.styleVibe}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Giày / Guốc */}
                  <div className="bg-[#0e0e14] border border-[#242433] rounded-xl p-2.5 flex items-center gap-2.5 hover:border-[#c5a059]/40 transition-all">
                    <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {shoesCanvasImg ? (
                        <img 
                          src={shoesCanvasImg} 
                          alt={activeShoesItem.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-stone-500">2D</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a059] font-bold block">
                        Giày / Guốc
                      </span>
                      <span className="text-xs font-bold text-stone-200 block truncate">
                        {activeShoesItem.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        {activeShoesItem.styleVibe}
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Khuy Cúc */}
                  <div className={`rounded-xl p-2.5 flex items-center gap-2.5 border transition-all ${
                    isChineseButtonSelected 
                      ? 'bg-rose-950/20 border-rose-500/50' 
                      : 'bg-[#0e0e14] border-[#242433] hover:border-[#c5a059]/40'
                  }`}>
                    <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img 
                        src={activeButtonItem.thumbnailUrl} 
                        alt={activeButtonItem.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a059] font-bold block">
                        Hạt Khuy Cúc
                      </span>
                      <span className="text-xs font-bold text-stone-200 block truncate">
                        {activeButtonItem.name.split('(')[0]}
                      </span>
                      <span className={`text-[10px] block truncate ${isChineseButtonSelected ? 'text-rose-400 font-semibold' : 'text-stone-400'}`}>
                        {isChineseButtonSelected ? '⚠️ Cấm cúc tàu' : activeButtonItem.styleVibe}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Editorial Palette Bar */}
              <div className="pt-3 border-t border-[#252533] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span className="text-stone-400 text-[11px]">Bảng Sắc Tộc Phối:</span>
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow" 
                      style={{ backgroundColor: selectedColorHex }} 
                      title="Màu áo chính"
                    />
                    <span 
                      className="w-5 h-5 rounded-full bg-[#f4efe6] border border-white/20 shadow" 
                      title="Bạch lụa cổ Đơn Y"
                    />
                    <span 
                      className="w-5 h-5 rounded-full bg-[#c5a059] border border-white/20 shadow" 
                      title="Vàng đồng khuy bát bửu"
                    />
                    <span 
                      className="w-5 h-5 rounded-full bg-[#1c1917] border border-white/20 shadow" 
                      title="Huyền trầm thân dưới"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-stone-400">
                  Chuẩn hóa theo quy chế Y quan thời Nguyễn
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 3: CHI TIẾT 2D MINH HỌA (10 ITEMS DETAIL SHOWCASE) */}
        {/* ======================================================== */}
        {viewMode === 'breakdown' && (
          <div className="w-full max-w-[620px] py-4 select-none space-y-3">
            <div className="text-center pb-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                BỘ 4 SẢN PHẨM 2D ĐANG ĐƯỢC PHỐI
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Chi tiết hình ảnh minh họa 2D sắc nét từng món đồ trong outfit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Item 1: Phụ Kiện Đi Kèm */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Phụ Kiện
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeAccessoryItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeAccessoryItem.description}
                  </p>
                </div>
              </div>

              {/* Item 2: Thân Dưới */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={bottomCanvasImg}
                    alt={activeBottomItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Thân Dưới
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeBottomItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeBottomItem.description}
                  </p>
                </div>
              </div>

              {/* Item 3: Giày / Guốc */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={shoesCanvasImg}
                    alt={activeShoesItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Giày / Guốc
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeShoesItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeShoesItem.description}
                  </p>
                </div>
              </div>

              {/* Item 4: Khuy Cúc */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={activeButtonItem.thumbnailUrl}
                    alt={activeButtonItem.name}
                    className="w-full h-full object-cover rounded-lg drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Hạt Khuy Cúc
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeButtonItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeButtonItem.description}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* FOOTER BAR: QUICK SPECS & TABOO STATUS BANNER */}
      <div className="p-3.5 sm:p-4 bg-[#101015] border-t border-[#20202a] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-stone-400">
          <div>
            <span className="text-stone-500">Áo: </span>
            <span className="text-[#f5f2eb] font-semibold">{activeGarment.name}</span>
          </div>
          <div>
            <span className="text-stone-500">Đơn Y: </span>
            <span className={hasDonY ? 'text-emerald-400 font-medium' : 'text-rose-400 font-bold'}>
              {hasDonY ? 'Đã mặc' : 'Chưa mặc (Lộ ngực)'}
            </span>
          </div>
          <div>
            <span className="text-stone-500">Khuy: </span>
            <span className={isChineseButtonSelected ? 'text-rose-400 font-bold' : 'text-stone-300'}>
              {activeButtonItem.name.split('(')[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveTaboo ? (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Phát hiện chi tiết phạm quy chế di sản!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Outfit chuẩn phong vị cổ kính & thanh lịch</span>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#141419] border border-[#c5a059]/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-stone-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-[#c5a059] mb-4">
              Xem Lớn: {activeGarment.name} (Phối 2D Toàn Diện)
            </h3>
            
            <div className="w-full max-w-[380px] py-4 flex flex-col items-center">
              {/* Head */}
              {isKhanDongSelected && (
                <img
                  src={accessoryCanvasImg}
                  alt={activeAccessoryItem.name}
                  className="w-36 h-24 object-contain -mb-6 relative z-30"
                />
              )}
              {/* Robe */}
              <div className="w-full relative z-20">
                <RobeVisualizer
                  type={activeGarment.svgType}
                  primaryColor={selectedColorHex}
                  hasDonY={hasDonY}
                  buttonType={activeButtonItem.id}
                  interactive={false}
                  borderless={true}
                />
              </div>
              {/* Bottom */}
              {bottomCanvasImg && (
                <img
                  src={bottomCanvasImg}
                  alt={activeBottomItem.name}
                  className="w-56 h-56 object-contain -mt-16 relative z-10"
                />
              )}
              {/* Shoes */}
              {shoesCanvasImg && (
                <img
                  src={shoesCanvasImg}
                  alt={activeShoesItem.name}
                  className="w-44 h-28 object-contain -mt-10 relative z-20"
                />
              )}
            </div>

            <p className="text-xs text-stone-400 mt-2 text-center">
              Outfit kết hợp giữa Áo Cổ Phục Triều Nguyễn và các món phụ kiện / thân dưới hiện đại 2D.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
