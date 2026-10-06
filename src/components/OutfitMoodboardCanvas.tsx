import React, { useState, useEffect } from 'react';
import { 
  HeritageItem, 
  ColorOption, 
  ModernRemixItem 
} from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import {
  playBellTingSound,
  playCourtBrassSound,
  playHueFluteSound,
  playHoiAnPianoFaSound,
  playThangLongUkuleleSound,
  playCameraShutterSound,
  playCoffeeChimeSound,
  playMuseumEchoSound,
  playAutumnBreezeSound
} from '../utils/soundEffects';
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
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSoundMute } from '../utils/soundEffects';

export type CanvasViewMode = 'mannequin' | 'editorial' | 'breakdown';
export type HeritageBackground = 'studio' | 'hue' | 'hoian' | 'thanglong';
export type ModernBackground = 'studio' | 'cafe' | 'museum' | 'street';
export type CanvasBackgroundId = HeritageBackground | ModernBackground;

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
  isLayeringActive?: boolean;
  layeringStep?: number;
  currentTier?: 'heritage' | 'modern' | 'fusion';
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
  isLayeringActive = false,
  layeringStep = 0,
  currentTier = 'heritage',
}) => {
  const [viewMode, setViewMode] = useState<CanvasViewMode>('mannequin');
  const [selectedBg, setSelectedBg] = useState<CanvasBackgroundId>('studio');
  const [bgBlurPercent, setBgBlurPercent] = useState<number>(50);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [isExportingPoster, setIsExportingPoster] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const { isMuted, toggleMute } = useSoundMute();

  // Reset to default studio background whenever the user switches between heritage and modern tiers
  useEffect(() => {
    setSelectedBg('studio');
  }, [currentTier]);

  // Check if any taboo is currently active
  const hasActiveTaboo = isChineseButtonSelected || isImperialYellowSelected || isTabooClashSelected || !hasDonY;

  // 2D image URLs
  const bottomCanvasImg = activeBottomItem.canvas2dUrl || activeBottomItem.thumbnailUrl || '';
  const shoesCanvasImg = activeShoesItem.canvas2dUrl || activeShoesItem.thumbnailUrl || '';
  const accessoryCanvasImg = activeAccessoryItem.canvas2dUrl || activeAccessoryItem.thumbnailUrl || '';
  const isKhanDongSelected = activeAccessoryItem.id === 'acc-khan-dong' || activeAccessoryItem.id === 'acc-khan-vanh-day';

  // Dynamic transition key for micro-interactions (Fade-in + Scale up 1.02x on outfit changes)
  const previewTransitionKey = `${activeGarment.id}_${selectedColorHex}_${activeAccessoryItem.id}_${activeButtonItem.id}_${activeBottomItem.id}_${activeShoesItem.id}_${hasDonY}_${uploadedImage ? 'upload' : 'robe'}`;

  // 4 Heritage Background Presets (Màn 1: Chốn Tôn Nghiêm)
  const HERITAGE_BACKGROUND_THEMES = [
    {
      id: 'studio' as CanvasBackgroundId,
      name: 'Studio Cung Đình',
      icon: '👑',
      badge: 'Haute Couture'
    },
    {
      id: 'hue' as CanvasBackgroundId,
      name: 'Cố Đô Huế',
      icon: '🏯',
      badge: 'Đại Nội'
    },
    {
      id: 'hoian' as CanvasBackgroundId,
      name: 'Phố Cổ Hội An',
      icon: '🏮',
      badge: 'Đèn Lồng'
    },
    {
      id: 'thanglong' as CanvasBackgroundId,
      name: 'Thành Thăng Long',
      icon: '🏛️',
      badge: 'Đoan Môn'
    },
  ];

  // 4 Modern Editorial Background Presets (Màn 2: Thanh Lịch Đời Thường)
  const MODERN_BACKGROUND_THEMES = [
    {
      id: 'studio' as CanvasBackgroundId,
      name: 'Studio Tạp Chí',
      icon: '📸',
      badge: 'Editorial Pattern'
    },
    {
      id: 'cafe' as CanvasBackgroundId,
      name: 'Cà Phê Mộc',
      icon: '☕',
      badge: 'Phê La Cozy'
    },
    {
      id: 'museum' as CanvasBackgroundId,
      name: 'Bảo Tàng Nghệ Thuật',
      icon: '🏛️',
      badge: 'Cửa Chạm Gỗ'
    },
    {
      id: 'street' as CanvasBackgroundId,
      name: 'Góc Phố Tràng Tiền',
      icon: '🍂',
      badge: 'Mùa Thu Hà Nội'
    },
  ];

  // 4 Fusion Streetwear Background Presets (Màn 3: Phố Thị Phá Cách)
  const FUSION_BACKGROUND_THEMES = [
    {
      id: 'studio' as CanvasBackgroundId,
      name: 'Tường Bê Tông Xước',
      icon: '🧱',
      badge: 'Brutalist Concrete'
    },
    {
      id: 'cafe' as CanvasBackgroundId,
      name: 'Màn Hình LED Glitch',
      icon: '⚡',
      badge: 'Cyberpunk Billboard'
    },
    {
      id: 'museum' as CanvasBackgroundId,
      name: 'Skatepark 30/4',
      icon: '🛹',
      badge: 'Tet-Core Underground'
    },
    {
      id: 'street' as CanvasBackgroundId,
      name: 'Phố Đêm Bùi Viện',
      icon: '🌆',
      badge: 'Neon Nightlife'
    },
  ];

  const activeBackgroundThemes = currentTier === 'modern'
    ? MODERN_BACKGROUND_THEMES
    : currentTier === 'fusion'
    ? FUSION_BACKGROUND_THEMES
    : HERITAGE_BACKGROUND_THEMES;

  // Map of 4 Heritage Background Images from /backgrounds/ (Giảm tối 20% để bối cảnh hiện diện rõ nét, nguy nga)
  const HERITAGE_BACKGROUND_IMAGES: Record<HeritageBackground, { src: string; alt: string; tint: string; glow: string }> = {
    studio: {
      src: '/backgrounds/studio-cung-dinh.png',
      alt: 'Studio Cung Đình',
      tint: 'from-[#0e0e14]/50 via-black/20 to-[#08080c]/60',
      glow: 'rgba(212, 175, 55, 0.16)'
    },
    hue: {
      src: '/backgrounds/co-do-hue.png',
      alt: 'Cố Đô Huế - Đại Nội',
      tint: 'from-[#220d18]/55 via-black/20 to-[#0d070b]/65',
      glow: 'rgba(224, 122, 95, 0.18)'
    },
    hoian: {
      src: '/backgrounds/pho-co-hoi-an.png',
      alt: 'Phố Cổ Hội An',
      tint: 'from-[#22160a]/50 via-black/18 to-[#080d14]/62',
      glow: 'rgba(255, 209, 102, 0.20)'
    },
    thanglong: {
      src: '/backgrounds/hoang-thanh-thang-long.png',
      alt: 'Hoàng Thành Thăng Long - Đoan Môn',
      tint: 'from-[#141610]/55 via-black/20 to-[#090b0e]/65',
      glow: 'rgba(197, 160, 89, 0.18)'
    },
  };

  // Map of 4 Modern Background Images from /backgrounds/ (Blur nhẹ, ánh sáng dịu để giữ spotlight cho ma nơ canh)
  const MODERN_BACKGROUND_IMAGES: Record<ModernBackground, {
    src: string;
    alt: string;
    tint: string;
    blurAmount: string;
    opacity: number;
    badge: string;
  }> = {
    studio: {
      src: '/backgrounds/studio-tap-chi.png',
      alt: 'Studio Tạp Chí - Họa Tiết Vân Mây Tơ Lụa',
      tint: 'from-[#FAF8F5]/85 via-[#F5EFEB]/65 to-[#EAE0D8]/85',
      blurAmount: '2.5px',
      opacity: 0.38,
      badge: 'Editorial Pattern'
    },
    cafe: {
      src: '/backgrounds/ca-phe-moc.jpg',
      alt: 'Cà Phê Mộc - Không Gian Cà Phê Mộc Mạc & Cây Xanh',
      tint: 'from-[#FAF7F2]/82 via-[#F4EFE6]/58 to-[#E5DCD0]/85',
      blurAmount: '2.5px',
      opacity: 0.52,
      badge: 'Coffee Vibes'
    },
    museum: {
      src: '/backgrounds/bao-tang-nghe-thuat.jpg',
      alt: 'Bảo Tàng Nghệ Thuật - Cánh Cửa Chạm Khắc Gỗ Cung Đình',
      tint: 'from-[#FDFBF7]/84 via-[#F6F0E8]/62 to-[#E8DDD0]/86',
      blurAmount: '2.5px',
      opacity: 0.50,
      badge: 'Art Exhibition'
    },
    street: {
      src: '/backgrounds/goc-pho-trang-tien.jpg',
      alt: 'Góc Phố Tràng Tiền - Biệt Thự Cổ & Hàng Cây Lá Đỏ',
      tint: 'from-[#FAF9F5]/80 via-[#F3EFE7]/54 to-[#E0DED4]/84',
      blurAmount: '2.5px',
      opacity: 0.54,
      badge: 'Street Style'
    },
  };

  // Map of 4 Fusion Streetwear Background Images (Màn 3: Phố Thị Phá Cách)
  const FUSION_BACKGROUND_IMAGES: Record<string, {
    src: string;
    alt: string;
    tint: string;
    glow: string;
    badge: string;
  }> = {
    studio: {
      src: '/backgrounds/tuong-be-tong-xuoc.jpg',
      alt: 'Tường Bê Tông Xước - Brutalist Urban Wall',
      tint: 'from-black/60 via-transparent to-black/80',
      glow: 'rgba(0, 240, 255, 0.25)',
      badge: 'Brutalist Concrete'
    },
    cafe: {
      src: '/backgrounds/led-glitch-billboard.jpg',
      alt: 'Màn Hình LED Glitch - Cyberpunk Billboard',
      tint: 'from-[#080812]/50 via-transparent to-black/75',
      glow: 'rgba(255, 0, 127, 0.35)',
      badge: 'LED Glitch Screen'
    },
    museum: {
      src: '/backgrounds/tuong-be-tong-xuoc.jpg',
      alt: 'Skatepark 30/4 Underground',
      tint: 'from-[#0a1215]/60 via-transparent to-[#04080a]/80',
      glow: 'rgba(57, 255, 20, 0.25)',
      badge: 'Skate Underground'
    },
    street: {
      src: '/backgrounds/led-glitch-billboard.jpg',
      alt: 'Phố Đêm Bùi Viện Cyberpunk',
      tint: 'from-[#120514]/55 via-transparent to-[#060208]/80',
      glow: 'rgba(255, 0, 127, 0.35)',
      badge: 'Cyber Nightlife'
    },
  };

  // Keep BACKGROUND_THEMES alias for backward compatibility
  const BACKGROUND_THEMES = HERITAGE_BACKGROUND_THEMES;
  const BACKGROUND_IMAGES = HERITAGE_BACKGROUND_IMAGES;

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

      // 1. Draw real background photo if available, with dreamy soft overlay
      const activeBgSrc = currentTier === 'modern'
        ? (MODERN_BACKGROUND_IMAGES[(selectedBg in MODERN_BACKGROUND_IMAGES ? selectedBg : 'studio') as ModernBackground]?.src || '/backgrounds/studio-tap-chi.png')
        : currentTier === 'fusion'
        ? (FUSION_BACKGROUND_IMAGES[(selectedBg in FUSION_BACKGROUND_IMAGES ? selectedBg : 'studio')]?.src || '/backgrounds/tuong-be-tong-xuoc.jpg')
        : (HERITAGE_BACKGROUND_IMAGES[(selectedBg in HERITAGE_BACKGROUND_IMAGES ? selectedBg : 'studio') as HeritageBackground]?.src || '/backgrounds/studio-cung-dinh.png');

      const bgImg = await loadImage(activeBgSrc);
      if (bgImg) {
        ctx.save();
        const hRatio = canvas.width / bgImg.width;
        const vRatio = canvas.height / bgImg.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - bgImg.width * ratio) / 2;
        const centerShift_y = (canvas.height - bgImg.height * ratio) / 2;
        ctx.drawImage(
          bgImg,
          0,
          0,
          bgImg.width,
          bgImg.height,
          centerShift_x,
          centerShift_y,
          bgImg.width * ratio,
          bgImg.height * ratio
        );

        // Atmospheric overlay to keep outfit in clear spotlight
        if (currentTier === 'modern') {
          ctx.fillStyle = 'rgba(12, 12, 18, 0.28)';
        } else if (currentTier === 'fusion') {
          ctx.fillStyle = 'rgba(8, 8, 12, 0.42)';
        } else {
          ctx.fillStyle = 'rgba(10, 10, 15, 0.52)';
        }
        ctx.fillRect(0, 0, 1200, 1600);
        ctx.restore();
      } else {
        // Fallback gradient
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
      }

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
      ctx.fillStyle = currentTier === 'modern' ? '#6E8F6B' : '#C5A059';
      ctx.fillText(
        currentTier === 'modern'
          ? 'H E R I T S T Y L E   A I   •   T H A N H   L Ị C H   Đ Ờ I   T H Ư Ờ N G   2 0 2 6'
          : 'H E R I T S T Y L E   A I   •   V I Ệ T   P H Ụ C   R E M I X   2 0 2 6',
        600,
        110
      );

      ctx.font = 'bold 44px serif';
      ctx.fillStyle = currentTier === 'modern' ? '#292524' : '#F5F2EB';
      ctx.fillText(activeGarment.name.toUpperCase(), 600, 165);

      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = currentTier === 'modern' ? '#8BA888' : '#D4AF37';
      const bgName = activeBackgroundThemes.find(b => b.id === selectedBg)?.name.toUpperCase() 
        || (currentTier === 'modern' ? 'STUDIO TẠP CHÍ' : 'STUDIO CUNG ĐÌNH');
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

      // Helper to draw image contained without distortion
      const drawContainedImage = (
        targetCtx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        x: number,
        y: number,
        w: number,
        h: number
      ) => {
        if (!img || !img.width || !img.height) return;
        const imgRatio = img.width / img.height;
        const targetRatio = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = x;
        let drawY = y;
        if (imgRatio > targetRatio) {
          drawW = w;
          drawH = w / imgRatio;
          drawY = y + (h - drawH) / 2;
        } else {
          drawH = h;
          drawW = h * imgRatio;
          drawX = x + (w - drawW) / 2;
        }
        targetCtx.drawImage(img, drawX, drawY, drawW, drawH);
      };

      // Load Robe Image (from uploadedImage or serialized RobeVisualizer SVG)
      const loadRobeImage = async (): Promise<HTMLImageElement | null> => {
        if (uploadedImage) {
          return await loadImage(uploadedImage);
        }
        const svgEl = (document.querySelector('#export-robe-container svg') as SVGSVGElement | null)
          || (document.getElementById('robe-visualizer-svg') as SVGSVGElement | null)
          || (document.querySelector('svg[id^="robe-visualizer"]') as SVGSVGElement | null);

        if (svgEl) {
          try {
            const cloned = svgEl.cloneNode(true) as SVGSVGElement;
            cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            cloned.setAttribute('width', '800');
            cloned.setAttribute('height', '1000');
            const xml = new XMLSerializer().serializeToString(cloned);
            const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const img = await loadImage(url);
            URL.revokeObjectURL(url);
            return img;
          } catch (err) {
            console.warn('Could not serialize Robe SVG:', err);
          }
        }
        return null;
      };

      // Load all images in parallel
      const [robeImg, accImg, botImg, shoeImg] = await Promise.all([
        loadRobeImage(),
        loadImage(accessoryCanvasImg),
        loadImage(bottomCanvasImg),
        loadImage(shoesCanvasImg)
      ]);

      // Left Garment Card inside Showcase (Haute Couture Centerpiece)
      const leftCardX = 110;
      const leftCardY = 280;
      const leftCardW = 500;
      const leftCardH = 790;

      // Card Background with dark glass + gold border
      ctx.fillStyle = 'rgba(16, 14, 22, 0.9)';
      ctx.beginPath();
      ctx.roundRect(leftCardX, leftCardY, leftCardW, leftCardH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top Header inside card
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px serif';
      ctx.fillStyle = '#E5C365';
      ctx.fillText('Y PHỤC HOÀNG GIA CHÍNH', leftCardX + leftCardW / 2, leftCardY + 45);

      ctx.font = '600 12px sans-serif';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('DI SẢN TRIỀU NGUYỄN • ĐẠI LỄ PHỤC CUNG ĐÌNH', leftCardX + leftCardW / 2, leftCardY + 68);

      // Robe Display Zone with Ambient Aura Glow
      const robeZoneX = leftCardX + 30;
      const robeZoneY = leftCardY + 95;
      const robeZoneW = leftCardW - 60; // 440
      const robeZoneH = 490;

      // Soft circular aura behind robe
      const aura = ctx.createRadialGradient(
        leftCardX + leftCardW / 2, 
        robeZoneY + robeZoneH / 2, 
        40, 
        leftCardX + leftCardW / 2, 
        robeZoneY + robeZoneH / 2, 
        230
      );
      aura.addColorStop(0, `${selectedColorHex}28`);
      aura.addColorStop(0.5, 'rgba(197, 160, 89, 0.08)');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(leftCardX + leftCardW / 2, robeZoneY + robeZoneH / 2, 230, 0, Math.PI * 2);
      ctx.fill();

      // Draw the Robe Image!
      if (robeImg) {
        drawContainedImage(ctx, robeImg, robeZoneX, robeZoneY, robeZoneW, robeZoneH);

        // If Khăn Đóng is selected, crown the mannequin head in the poster
        if (isKhanDongSelected && accImg) {
          const turbanW = 165;
          const turbanH = 105;
          const turbanX = leftCardX + leftCardW / 2 - turbanW / 2;
          const turbanY = robeZoneY - 4;
          drawContainedImage(ctx, accImg, turbanX, turbanY, turbanW, turbanH);
        }
      } else {
        // Fallback: draw stylish color preview pill if image unavailable
        ctx.fillStyle = selectedColorHex;
        ctx.beginPath();
        ctx.arc(leftCardX + leftCardW / 2, robeZoneY + robeZoneH / 2, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#E5C365';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Elegant Robe Details under the visualizer
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(activeGarment.name, leftCardX + leftCardW / 2, leftCardY + 630);

      ctx.font = '500 15px sans-serif';
      ctx.fillStyle = '#E5C365';
      ctx.fillText(`Sắc ${activeColor.vietnameseName.split('(')[0]} • Lụa Tơ Tằm Cung Đình`, leftCardX + leftCardW / 2, leftCardY + 660);

      // Two Luxury Status Pill Badges
      const badgeY = leftCardY + 685;
      const badgeH = 32;

      // Badge 1: Đơn Y Status
      const b1W = 190;
      const b1X = leftCardX + leftCardW / 2 - b1W - 8;
      ctx.fillStyle = hasDonY ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)';
      ctx.beginPath();
      ctx.roundRect(b1X, badgeY, b1W, badgeH, 16);
      ctx.fill();
      ctx.strokeStyle = hasDonY ? 'rgba(52, 211, 153, 0.5)' : 'rgba(248, 113, 113, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 12px sans-serif';
      ctx.fillStyle = hasDonY ? '#34D399' : '#F87171';
      ctx.fillText(hasDonY ? '✓ Cổ Đơn Y Trắng' : '⚠️ Thiếu Đơn Y Trắng', b1X + b1W / 2, badgeY + 20);

      // Badge 2: Cúc áo Status
      const b2W = 190;
      const b2X = leftCardX + leftCardW / 2 + 8;
      ctx.fillStyle = isChineseButtonSelected ? 'rgba(248, 113, 113, 0.15)' : 'rgba(229, 195, 101, 0.15)';
      ctx.beginPath();
      ctx.roundRect(b2X, badgeY, b2W, badgeH, 16);
      ctx.fill();
      ctx.strokeStyle = isChineseButtonSelected ? 'rgba(248, 113, 113, 0.5)' : 'rgba(229, 195, 101, 0.5)';
      ctx.stroke();

      ctx.font = '600 12px sans-serif';
      ctx.fillStyle = isChineseButtonSelected ? '#F87171' : '#E5C365';
      ctx.fillText(isChineseButtonSelected ? '✗ Cúc Vải Tàu' : `✓ ${activeButtonItem.name.split('(')[0]}`, b2X + b2W / 2, badgeY + 20);

      // Subtle fine divider
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftCardX + 100, leftCardY + 740);
      ctx.lineTo(leftCardX + leftCardW - 100, leftCardY + 740);
      ctx.stroke();

      // Clean concise heritage note
      ctx.font = 'italic 13px serif';
      ctx.fillStyle = '#D6D3D1';
      ctx.fillText(`“${activeGarment.dynasty} • ${activeGarment.subName.slice(0, 46)}”`, leftCardX + leftCardW / 2, leftCardY + 765);

      // Right 3 Component Cards (Editorial Lookbook Style)
      const rightCardX = 640;
      const rightCardW = 450;
      const rightCardH = 250;
      const cardGap = 20;

      const rightItems = [
        {
          badge: '01 • PHỤ KIỆN ĐI KÈM',
          name: activeAccessoryItem.name,
          vibe: activeAccessoryItem.styleVibe,
          note: activeAccessoryItem.isCulturallyRespectful ? '✓ Tôn vinh vẻ tôn nghiêm cung đình' : '⚠️ Chi tiết phối phá cách hiện đại',
          noteColor: activeAccessoryItem.isCulturallyRespectful ? '#34D399' : '#FBBF24',
          sub: 'Chế tác thủ công tinh xảo',
          img: accImg
        },
        {
          badge: '02 • THÂN DƯỚI REMIX',
          name: activeBottomItem.name,
          vibe: activeBottomItem.styleVibe,
          note: '✓ Phom dáng buông rủ, tôn vinh vạt áo',
          noteColor: '#34D399',
          sub: 'Chất vải tự nhiên nhẹ mát, thoáng khí',
          img: botImg
        },
        {
          badge: '03 • GIÀY / GUỐC PHỐI',
          name: activeShoesItem.name,
          vibe: activeShoesItem.styleVibe,
          note: activeShoesItem.id === 'shoes-sneakers' ? '⚠️ Điểm nhấn đương đại phá cách' : '✓ Hồn xưa mộc mạc, thanh nhã',
          noteColor: activeShoesItem.id === 'shoes-sneakers' ? '#FBBF24' : '#34D399',
          sub: 'Thủ công truyền thống Việt Nam',
          img: shoeImg
        }
      ];

      rightItems.forEach((item, index) => {
        const cardY = 280 + index * (rightCardH + cardGap);

        // Card Container
        ctx.fillStyle = 'rgba(16, 14, 22, 0.85)';
        ctx.beginPath();
        ctx.roundRect(rightCardX, cardY, rightCardW, rightCardH, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2D Image Box
        const imgBoxX = rightCardX + 18;
        const imgBoxY = cardY + 22;
        const imgBoxW = 140;
        const imgBoxH = 206;

        ctx.fillStyle = 'rgba(8, 8, 12, 0.9)';
        ctx.beginPath();
        ctx.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (item.img) {
          drawContainedImage(ctx, item.img, imgBoxX + 10, imgBoxY + 10, imgBoxW - 20, imgBoxH - 20);
        }

        // Text Content
        const textX = rightCardX + 175;

        // Category Tag
        ctx.textAlign = 'left';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#E5C365';
        ctx.fillText(item.badge, textX, cardY + 48);

        // Item Name
        ctx.font = 'bold 20px serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name, textX, cardY + 80);

        // Vibe
        ctx.font = '500 14px sans-serif';
        ctx.fillStyle = '#C5A059';
        ctx.fillText(item.vibe, textX, cardY + 112);

        // Thin Separator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(textX, cardY + 130);
        ctx.lineTo(rightCardX + rightCardW - 20, cardY + 130);
        ctx.stroke();

        // Verification / Heritage Note
        ctx.font = '500 13px sans-serif';
        ctx.fillStyle = item.noteColor;
        ctx.fillText(item.note, textX, cardY + 160);

        // Sub description
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#8E7B68';
        ctx.fillText(item.sub, textX, cardY + 192);
      });

      // 5. Bottom Palette & Specifications Panel (Certificate Style)
      const btmX = 80;
      const btmY = 1115;
      const btmW = 1040;
      const btmH = 345;

      ctx.fillStyle = 'rgba(14, 12, 18, 0.9)';
      ctx.beginPath();
      ctx.roundRect(btmX, btmY, btmW, btmH, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left Column: Color Palette & Appraisal
      ctx.textAlign = 'left';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#E5C365';
      ctx.fillText('BẢNG SẮC TỘC OUTFIT (COLOR HARMONY)', btmX + 40, btmY + 45);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#A8A29E';
      ctx.fillText('Hệ quy chuẩn sắc phục & ngũ hành cung đình Triều Nguyễn', btmX + 40, btmY + 68);

      const swatches = [
        { color: selectedColorHex, label: 'Màu Áo Chính', hex: selectedColorHex },
        { color: '#F4EFE6', label: 'Bạch Lụa Đơn Y', hex: '#F4EFE6' },
        { color: '#E5C365', label: 'Khuy Bát Bửu', hex: '#E5C365' },
        { color: '#1C1917', label: 'Huyền Trầm', hex: '#1C1917' }
      ];

      swatches.forEach((sw, idx) => {
        const swX = btmX + 40 + idx * 115;
        const swY = btmY + 95;

        // Swatch circle
        ctx.fillStyle = sw.color;
        ctx.beginPath();
        ctx.arc(swX + 24, swY + 24, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(sw.label, swX + 24, swY + 68);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#C5A059';
        ctx.fillText(sw.hex, swX + 24, swY + 85);
      });

      // Appraisal Status Banner
      ctx.textAlign = 'left';
      ctx.font = '500 14px sans-serif';
      ctx.fillStyle = hasActiveTaboo ? '#F87171' : '#34D399';
      ctx.fillText(
        hasActiveTaboo 
          ? '⚠️ Thẩm định: Phát hiện chi tiết phá cách cần điều chỉnh theo quy chế triều đình.' 
          : '✓ Thẩm định: Bộ phối đạt chuẩn quy chế Y quan Triều Nguyễn & thẩm mỹ đương đại.',
        btmX + 40, btmY + 235
      );

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#78716C';
      ctx.fillText('Dự thi Sáng tạo Di sản • Nền tảng HeritStyle AI', btmX + 40, btmY + 275);
      ctx.fillText(`Xuất bản: ${new Date().toLocaleDateString('vi-VN')} • Bản sắc Cố Đô trường tồn`, btmX + 40, btmY + 298);

      // Right Column: Royal Vermilion Seal Stamp
      ctx.save();
      ctx.translate(btmX + btmW - 145, btmY + 165);
      ctx.rotate(-0.04);

      // Outer Red Box
      ctx.strokeStyle = '#991B1B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-75, -75, 150, 150, 8);
      ctx.stroke();

      // Inner Red Box
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-68, -68, 136, 136, 6);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 16px serif';
      ctx.fillStyle = '#DC2626';
      ctx.fillText('DI SẢN', 0, -30);
      ctx.font = 'bold 20px serif';
      ctx.fillText('CHUẨN Y QUAN', 0, 3);
      ctx.font = 'bold 15px serif';
      ctx.fillText('THẨM ĐỊNH', 0, 32);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('2026', 0, 52);
      ctx.restore();

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
    if (currentTier === 'fusion') {
      const fusionBgKey = (selectedBg in FUSION_BACKGROUND_IMAGES ? selectedBg : 'studio');
      const currentFusionBg = FUSION_BACKGROUND_IMAGES[fusionBgKey] || FUSION_BACKGROUND_IMAGES.studio;
      const fusionBlurPx = (bgBlurPercent / 100) * 8;

      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700 select-none">
          {/* Base Pitch Black Foundation */}
          <div className="absolute inset-0 bg-[#060609]" />

          {/* Real Photo Background (Tường Bê Tông Xước hoặc Màn Hình LED Glitch) */}
          <img
            key={`fusion_${fusionBgKey}`}
            src={currentFusionBg.src}
            alt={currentFusionBg.alt}
            className="absolute inset-0 w-full h-full object-cover object-center scale-110 pointer-events-none transition-all duration-500 brightness-105 contrast-125"
            style={{
              filter: `blur(${fusionBlurPx}px)`,
              opacity: 0.90,
            }}
          />

          {/* Cyberpunk Scanlines Texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)',
            }}
          />

          {/* Streetwear Hard Flash Spotlight + Neon Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.18) 0%, rgba(255,0,127,0.06) 40%, rgba(0,240,255,0.08) 70%, rgba(0,0,0,0.85) 100%)'
            }}
          />

          {/* Shadow under feet */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-4 bg-black/90 blur-xs pointer-events-none" />
        </div>
      );
    }

    if (currentTier === 'modern') {
      const modernBgKey = (selectedBg in MODERN_BACKGROUND_IMAGES ? selectedBg : 'studio') as ModernBackground;
      const currentModernBg = MODERN_BACKGROUND_IMAGES[modernBgKey] || MODERN_BACKGROUND_IMAGES.studio;
      // 50% blur tương ứng 5px gaussian blur (có thể tinh chỉnh nhanh qua bgBlurPercent)
      const blurPx = (bgBlurPercent / 100) * 10;

      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700 select-none">
          {/* Base Neutral Foundation */}
          <div className="absolute inset-0 bg-[#0e0e13]" />

          {/* Real Photo Background - Màu sắc đậm đà, sống động, độ mờ 50% (~5px) chuẩn không bị nhạt */}
          <img
            key={`modern_${modernBgKey}`}
            src={currentModernBg.src}
            alt={currentModernBg.alt}
            className="absolute inset-0 w-full h-full object-cover object-center scale-110 pointer-events-none transition-all duration-500 brightness-95 contrast-105"
            style={{
              filter: `blur(${blurPx}px)`,
              opacity: 0.94,
            }}
          />

          {/* Soft Center Spotlight + Dark Edge Vignette: Giữ ma nơ canh nổi bật sắc nét mà màu sắc bối cảnh vẫn đậm đà, không bị mờ nhạt */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.36) 100%)'
            }}
          />

          {/* Soft Contact Shadow under mannequin's feet */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-5 rounded-[50%] bg-stone-950/40 blur-sm pointer-events-none" />
        </div>
      );
    }

    const heritageBgKey = (selectedBg in HERITAGE_BACKGROUND_IMAGES ? selectedBg : 'studio') as HeritageBackground;
    const currentBg = HERITAGE_BACKGROUND_IMAGES[heritageBgKey] || HERITAGE_BACKGROUND_IMAGES.studio;
    const heritageBlurPx = (bgBlurPercent / 100) * 10;

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700 select-none">
        {/* Real Heritage Photo - Bớt tối 20%, hiện diện rõ nét và tráng lệ hơn */}
        <img
          key={heritageBgKey}
          src={currentBg.src}
          alt={currentBg.alt}
          className="absolute inset-0 w-full h-full object-cover object-center scale-110 transition-all duration-500 opacity-80 brightness-105 contrast-105 pointer-events-none"
          style={{
            filter: `blur(${heritageBlurPx}px)`,
          }}
        />

        {/* Ambient Color Tone Overlay based on heritage location */}
        <div className={`absolute inset-0 bg-gradient-to-b ${currentBg.tint} transition-all duration-700`} />

        {/* Center Spotlight: Bớt tối 20% (từ 0.88 xuống 0.68) để bối cảnh hiện diện rõ ràng */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.12) 0%, rgba(14,14,20,0.12) 42%, rgba(10,10,15,0.68) 92%)'
          }}
        />

        {/* Atmospheric Floating Light Particles for Dreamy "Mờ mờ ảo ảo" Effect */}
        {heritageBgKey === 'hue' && (
          <>
            <div className="absolute top-20 left-12 w-2 h-2 rounded-full bg-[#f4a261] blur-sm animate-pulse" />
            <div className="absolute top-36 right-16 w-3 h-3 rounded-full bg-[#e76f51] blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-28 left-20 w-2.5 h-2.5 rounded-full bg-[#e5c365] blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
          </>
        )}
        {heritageBgKey === 'hoian' && (
          <>
            <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-[#ffd166] blur-sm animate-pulse" />
            <div className="absolute top-24 right-14 w-2.5 h-2.5 rounded-full bg-[#e63946] blur-sm animate-pulse" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-24 right-20 w-2 h-2 rounded-full bg-[#f4a261] blur-sm animate-pulse" style={{ animationDelay: '1.6s' }} />
          </>
        )}
        {heritageBgKey === 'thanglong' && (
          <>
            <div className="absolute top-16 left-16 w-2.5 h-2.5 rounded-full bg-[#e5c365] blur-sm animate-pulse" />
            <div className="absolute top-28 right-24 w-2 h-2 rounded-full bg-[#a3b18a] blur-sm animate-pulse" style={{ animationDelay: '1.2s' }} />
          </>
        )}
        {heritageBgKey === 'studio' && (
          <>
            <div className="absolute top-20 left-1/4 w-1.5 h-1.5 rounded-full bg-[#e5c365] opacity-60 blur-[0.5px] animate-pulse" />
            <div className="absolute top-44 right-1/4 w-2 h-2 rounded-full bg-[#e5c365] opacity-70 blur-[0.5px] animate-pulse" style={{ animationDelay: '0.7s' }} />
            <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 rounded-full bg-[#e5c365] opacity-50 animate-pulse" style={{ animationDelay: '1.4s' }} />
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`overflow-hidden flex flex-col transition-all ${
      currentTier === 'modern'
        ? 'rounded-2xl bg-white/85 border border-stone-200/90 shadow-xl backdrop-blur-xl text-stone-800'
        : currentTier === 'fusion'
        ? 'font-streetwear rounded-none bg-[#08080C] border-2 border-[#00F0FF] shadow-[6px_6px_0px_#FF007F] text-white'
        : 'rounded-2xl bg-[#141419] border border-[#23232c] shadow-2xl text-[#f5f2eb]'
    }`}>
      {/* HEADER: TITLE & CONTROLS */}
      <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
        currentTier === 'modern'
          ? 'border-stone-200/80 bg-white/70'
          : currentTier === 'fusion'
          ? 'border-b-2 border-white/20 bg-[#0d0d14]'
          : 'border-[#22222c] bg-gradient-to-r from-[#171720] to-[#121217]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 flex items-center justify-center ${
            currentTier === 'modern'
              ? 'rounded-lg bg-[#8BA888]/15 border border-[#8BA888]/30 text-[#436240]'
              : currentTier === 'fusion'
              ? 'rounded-none bg-[#FF007F]/20 border-2 border-[#FF007F] text-[#FF007F]'
              : 'rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059]'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase tracking-wider font-bold ${
                currentTier === 'modern'
                  ? 'text-[#3E5C3B]'
                  : currentTier === 'fusion'
                  ? 'font-black italic text-white tracking-widest'
                  : 'text-[#c5a059]'
              }`}>
                {currentTier === 'modern'
                  ? 'STUDIO CANVAS · NATURAL LIGHTING'
                  : currentTier === 'fusion'
                  ? 'CANVAS PREVIEW · HARD FLASH STREETWEAR'
                  : 'CANVAS PREVIEW OUTFIT TỔNG THỂ'}
              </span>
              {currentTier === 'fusion' ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F] font-black uppercase">
                  FUSION SUB-CULTURE
                </span>
              ) : hasActiveTaboo ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 border border-amber-500/30 font-medium">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  Gợi Ý Tinh Chỉnh
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Thanh Lịch Hài Hòa
                </span>
              )}
            </div>
            <p className={`text-[11px] ${
              currentTier === 'modern'
                ? 'text-stone-500'
                : currentTier === 'fusion'
                ? 'text-stone-300 font-sans'
                : 'text-stone-400'
            }`}>
              {currentTier === 'modern' 
                ? 'Ánh sáng tự nhiên mềm mại, hiển thị trực quan bản phối Acubi & Quiet Luxury'
                : currentTier === 'fusion'
                ? 'Đánh sáng gắt Local Brand trên nền Tường Bê Tông Xước & Màn hình LED Glitch'
                : 'Đồng bộ trực quan 10 món phối 2D cùng Y quan Triều Nguyễn'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className={`flex items-center p-1 rounded-xl border ${
          currentTier === 'modern'
            ? 'bg-stone-100/90 border-stone-200/90'
            : 'bg-[#0d0d12] border-[#262635]'
        }`}>
          <button
            type="button"
            onClick={() => {
              setViewMode('mannequin');
              playBellTingSound();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'mannequin'
                ? (currentTier === 'modern' ? 'bg-[#8BA888] text-white font-bold shadow-sm' : 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md')
                : (currentTier === 'modern' ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            <span>👔 Toàn Thân</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('editorial');
              playBellTingSound();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'editorial'
                ? (currentTier === 'modern' ? 'bg-[#8BA888] text-white font-bold shadow-sm' : 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md')
                : (currentTier === 'modern' ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            <span>🎨 Moodboard</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('breakdown');
              playBellTingSound();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'breakdown'
                ? (currentTier === 'modern' ? 'bg-[#8BA888] text-white font-bold shadow-sm' : 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md')
                : (currentTier === 'modern' ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-stone-200')
            }`}
          >
            <span>📐 Tách Lớp</span>
          </button>
        </div>
      </div>

      {/* HERITAGE BACKGROUND SELECTOR & ACTIONS SUB-BAR */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 text-xs ${
        currentTier === 'modern'
          ? 'bg-stone-50/80 border-stone-200/70 text-stone-700'
          : 'bg-[#0e0e13] border-[#1f1f28] text-stone-300'
      }`}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">
            Bối Cảnh:
          </span>
          {activeBackgroundThemes.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => {
                setSelectedBg(bg.id);
                if (currentTier === 'modern') {
                  if (bg.id === 'studio') {
                    playCameraShutterSound();
                  } else if (bg.id === 'cafe') {
                    playCoffeeChimeSound();
                  } else if (bg.id === 'museum') {
                    playMuseumEchoSound();
                  } else if (bg.id === 'street') {
                    playAutumnBreezeSound();
                  }
                } else {
                  if (bg.id === 'studio') {
                    playCourtBrassSound();
                  } else if (bg.id === 'hue') {
                    playHueFluteSound();
                  } else if (bg.id === 'hoian') {
                    playHoiAnPianoFaSound();
                  } else if (bg.id === 'thanglong') {
                    playThangLongUkuleleSound();
                  }
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                selectedBg === bg.id
                  ? (currentTier === 'modern' 
                      ? 'bg-[#8BA888]/20 border-[#8BA888] text-[#2C4A28] font-bold shadow-sm' 
                      : 'bg-[#c5a059]/20 border-[#c5a059] text-[#e5c365] font-bold shadow-sm')
                  : (currentTier === 'modern' 
                      ? 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs' 
                      : 'bg-[#14141c] border-white/5 text-stone-400 hover:text-stone-200 hover:border-white/10')
              }`}
            >
              <span>{bg.icon}</span>
              <span>{bg.name}</span>
            </button>
          ))}

          {/* Quick blur level selector (Hiển thị cho cả Màn 1 & Màn 2 theo yêu cầu) */}
          <div className={`flex items-center gap-1.5 ml-2 pl-2 border-l ${
            currentTier === 'modern' ? 'border-stone-200/80' : 'border-white/10'
          }`}>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Độ Mờ:
            </span>
            <div className={`flex items-center gap-1 rounded-lg p-0.5 border shadow-2xs ${
              currentTier === 'modern'
                ? 'bg-white/80 border-stone-200'
                : 'bg-[#14141c] border-white/10'
            }`}>
              {[
                { label: '30%', value: 30 },
                { label: '50% (Chuẩn)', value: 50 },
                { label: '70%', value: 70 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setBgBlurPercent(item.value)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                    bgBlurPercent === item.value
                      ? (currentTier === 'modern'
                          ? 'bg-[#8BA888]/20 border border-[#8BA888]/60 text-[#2C4A28] font-bold shadow-2xs'
                          : 'bg-[#c5a059]/20 border border-[#c5a059]/60 text-[#e5c365] font-bold shadow-2xs')
                      : (currentTier === 'modern'
                          ? 'text-stone-500 hover:text-stone-900 border border-transparent'
                          : 'text-stone-400 hover:text-stone-200 border border-transparent')
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Lookbook Poster Button */}
          <button
            type="button"
            onClick={exportOutfitPoster}
            disabled={isExportingPoster}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${
              currentTier === 'modern'
                ? 'bg-gradient-to-r from-[#8BA888] to-[#6E8F6B] text-white shadow-sm'
                : 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0d0d12]'
            }`}
            title={currentTier === 'modern' ? 'Tải trang bìa Tạp Chí Lookbook' : 'Tải Poster Lookbook Hoàng Gia'}
          >
            {isExportingPoster ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExportingPoster ? 'Đang xuất...' : currentTier === 'modern' ? 'Tải Tạp Chí Lookbook' : 'Tải Poster Hoàng Gia'}</span>
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
          <div className={`backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 shadow-sm ${
            currentTier === 'modern'
              ? 'bg-white/90 border border-stone-200 text-stone-800'
              : 'bg-black/75 border border-[#c5a059]/30 text-stone-200 shadow-lg'
          }`}>
            <span 
              className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 shrink-0" 
              style={{ backgroundColor: selectedColorHex }} 
            />
            <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
              {activeGarment.name}
            </span>
            <span className={`text-[10px] hidden sm:inline ${
              currentTier === 'modern' ? 'text-[#3E5C3B] font-semibold' : 'text-[#c5a059]'
            }`}>
              • {activeColor.vietnameseName.split('(')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle: Bật tiếng để full Vibe */}
            <button
              type="button"
              onClick={toggleMute}
              className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                isMuted
                  ? 'bg-black/70 text-stone-300 border-white/15 hover:border-[#D4AF37]/50 hover:text-[#f5e6c8]'
                  : 'bg-[#D4AF37]/25 text-[#f5e6c8] border-[#D4AF37]/70 shadow-[0_0_12px_rgba(212,175,55,0.4)] font-medium animate-pulse'
              }`}
              title={isMuted ? 'Nhấn để bật âm thanh cổ phong khi phối đồ' : 'Nhấn để tắt âm thanh'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[11px] font-medium hidden sm:inline">Bật tiếng để full Vibe 🎵</span>
                  <span className="text-[11px] font-medium sm:hidden">Mute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#e5c365]" />
                  <span className="text-[11px] font-bold text-[#e5c365] hidden sm:inline">Âm thanh: Đang Bật 🎶</span>
                  <span className="text-[11px] font-bold text-[#e5c365] sm:hidden">Bật 🎶</span>
                </>
              )}
            </button>

            {/* Toggle Labels */}
            <button
              type="button"
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 cursor-pointer ${
                showLabels 
                  ? (currentTier === 'modern' ? 'bg-[#8BA888]/20 text-[#2C4A28] border-[#8BA888]/50 font-medium' : 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40')
                  : (currentTier === 'modern' ? 'bg-white/80 text-stone-600 border-stone-200 hover:text-stone-900 shadow-2xs' : 'bg-black/60 text-stone-400 border-white/10 hover:text-stone-200')
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
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                currentTier === 'modern'
                  ? 'bg-white/80 text-stone-600 border-stone-200 hover:text-stone-900 shadow-2xs'
                  : 'bg-black/60 text-stone-300 border-white/10 hover:text-white'
              }`}
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
          <div 
            key={previewTransitionKey} 
            className="relative w-full max-w-[420px] py-6 flex flex-col items-center justify-center select-none animate-preview-robe"
          >
            {/* GATEKEEPER RUBBER STAMP: "FUSION - LẤY CẢM HỨNG" (MÀN 3) */}
            {currentTier === 'fusion' && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-40 pointer-events-none animate-stamp-slam select-none">
                <div className="border-[3px] border-double border-[#FF007F] px-3.5 py-1.5 sm:px-4 sm:py-2 bg-black/90 backdrop-blur-xs text-[#FF007F] font-black tracking-widest uppercase -rotate-6 shadow-[0_0_20px_rgba(255,0,127,0.7)] flex flex-col items-center justify-center">
                  <span className="text-[7.5px] sm:text-[8.5px] tracking-widest border-b border-[#FF007F]/60 pb-0.5 mb-0.5 w-full text-center">
                    HERITSTYLE · GATEKEEPER
                  </span>
                  <span className="text-xs sm:text-sm font-black italic tracking-wider drop-shadow-[0_0_8px_#FF007F]">
                    FUSION - LẤY CẢM HỨNG
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-[#00F0FF] tracking-tighter mt-0.5">
                    ★ SUB-CULTURE VERIFIED ★
                  </span>
                </div>
              </div>
            )}
            
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

            {/* LAYER STATUS FLOATING BADGE (DÀNH CHO AUTO-FILL LAYERING) */}
            {isLayeringActive && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-[#2c1a10] via-[#1c1008] to-[#140b06] border border-[#e5c365] text-[#faedd0] px-4 py-1.5 rounded-full text-xs font-serif font-bold shadow-[0_0_25px_rgba(229,195,101,0.5)] flex items-center gap-2 animate-pulse whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-[#e5c365]" />
                <span>
                  {layeringStep === 1 && 'Bước 1/3: Diện Quần lụa & Áo lót Đơn Y trắng...'}
                  {layeringStep === 2 && 'Bước 2/3: Khoác Áo ngoài Cổ Phục trang nghiêm...'}
                  {(layeringStep === 3 || layeringStep === 0) && 'Bước 3/3: Điểm xuyết Khăn đóng, Guốc mộc & Phụ kiện hoàn tất!'}
                </span>
              </div>
            )}

            {/* 1. HEAD ZONE: KHĂN ĐÓNG (ĐỘI LÊN ĐẦU MA NƠ CANH) */}
            {isKhanDongSelected && (
              <div className={`relative z-30 flex flex-col items-center -mb-4 sm:-mb-5 transition-all duration-500 ${
                isLayeringActive && layeringStep < 3 ? 'opacity-0 scale-90 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
              }`}>
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setActiveHotspot(activeHotspot === 'head' ? null : 'head')}
                >
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-36 h-24 sm:w-42 sm:h-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform"
                  />
                  {showLabels && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2 py-0.5 rounded-full text-[10px] text-[#c5a059] font-bold shadow-lg pointer-events-none">
                      {activeAccessoryItem.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. UPPER BODY ZONE: ÁO CỔ PHỤC (ROBE VISUALIZER HOẶC ẢNH UPLOAD) */}
            <div className={`relative z-20 w-full max-w-[320px] sm:max-w-[350px] transition-all duration-700 ${
              isLayeringActive && layeringStep < 2 ? 'opacity-0 scale-90 translate-y-6' : 'opacity-100 scale-100 translate-y-0'
            }`}>
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
                      className={`absolute top-28 ${
                        (activeGarment.svgType === 'ao_tac' || activeGarment.svgType === 'ngu_than')
                          ? 'left-4'
                          : 'right-4'
                      } bg-black/85 backdrop-blur-md border px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-xl text-[10px] ${
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
                          : activeAccessoryItem.id === 'acc-kieng-bac'
                          ? 'top-20 left-1/2 -translate-x-1/2 w-28 h-28 hover:scale-105'
                          : activeAccessoryItem.id === 'acc-jade-pendant' || activeAccessoryItem.id === 'acc-boi-ngoc'
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
            <div className={`relative z-10 w-full max-w-[280px] -mt-16 sm:-mt-20 flex flex-col items-center transition-all duration-500 ${
              isLayeringActive && layeringStep === 1 ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(229,195,101,0.6)]' : ''
            }`}>
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
            <div className={`relative z-20 w-full max-w-[260px] -mt-10 sm:-mt-12 flex flex-col items-center transition-all duration-500 ${
              isLayeringActive && layeringStep < 3 ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
            }`}>
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
          <div 
            key={previewTransitionKey} 
            className="relative w-full max-w-[620px] py-4 select-none animate-preview-robe"
          >
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
        {/* MODE 3: CHI TIẾT 2D MINH HỌA (5 SẢN PHẨM CHI TIẾT OUTFIT) */}
        {/* ======================================================== */}
        {viewMode === 'breakdown' && (
          <div 
            key={previewTransitionKey} 
            className="relative z-10 w-full max-w-[680px] py-4 select-none space-y-4 animate-preview-robe"
          >
            <div className="text-center pb-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold bg-[#c5a059]/15 px-3 py-1 rounded-full border border-[#c5a059]/30">
                TRA CỨU CHI TIẾT 5 MÓN ĐỒ OUTFIT
              </span>
              <p className="text-xs text-stone-300 mt-2">
                Hình ảnh 2D sắc nét & thông tin xuất xứ di sản của từng thành phần phục trang
              </p>
            </div>

            <div className="space-y-3.5">
              
              {/* Item 1: Áo Cổ Phục Chính */}
              <div className="bg-[#161622]/95 backdrop-blur-xl border border-[#c5a059]/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-[#c5a059] transition-all">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-black/80 border border-[#c5a059]/50 p-1 shrink-0 flex items-center justify-center relative overflow-hidden">
                  {uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt={activeGarment.name} 
                      className="w-full h-full object-cover rounded-lg"
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
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] text-[#e5c365] font-bold uppercase tracking-wider bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                      Y Phục Chính
                    </span>
                    <span className="text-[11px] text-[#c5a059] font-medium">
                      {activeGarment.dynasty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeGarment.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed mt-1">
                    {activeGarment.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                    <span className={hasDonY ? 'text-emerald-400 font-medium' : 'text-rose-400 font-bold'}>
                      {hasDonY ? '✓ Cổ Đơn Y trắng lịch thiệp' : '⚠️ Cảnh báo: Thiếu lớp Đơn Y trắng'}
                    </span>
                    <span className="text-stone-400 hidden sm:inline">•</span>
                    <span className="text-stone-300">
                      Phom dáng: {activeGarment.formFeatures.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 2: Phụ Kiện Đi Kèm */}
              <div className="bg-[#161622]/95 backdrop-blur-xl border border-[#c5a059]/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-[#c5a059] transition-all">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/80 border border-[#c5a059]/50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] text-[#e5c365] font-bold uppercase tracking-wider bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                      Phụ Kiện
                    </span>
                    <span className="text-[11px] text-[#c5a059] font-medium">
                      {activeAccessoryItem.styleVibe}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeAccessoryItem.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed mt-1">
                    {activeAccessoryItem.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className={activeAccessoryItem.isCulturallyRespectful ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {activeAccessoryItem.isCulturallyRespectful ? '✓ Phụ kiện tôn vinh bản sắc truyền thống' : '⚠️ Chi tiết hiện đại (Phối tiết chế)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 3: Thân Dưới */}
              <div className="bg-[#161622]/95 backdrop-blur-xl border border-[#c5a059]/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-[#c5a059] transition-all">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/80 border border-[#c5a059]/50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={bottomCanvasImg}
                    alt={activeBottomItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] text-[#e5c365] font-bold uppercase tracking-wider bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                      Thân Dưới Remix
                    </span>
                    <span className="text-[11px] text-[#c5a059] font-medium">
                      {activeBottomItem.styleVibe}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeBottomItem.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed mt-1">
                    {activeBottomItem.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="text-emerald-400 font-medium">
                      ✓ Phom dáng bay bổng, tôn vinh dáng áo dài ngũ thân
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 4: Giày / Guốc */}
              <div className="bg-[#161622]/95 backdrop-blur-xl border border-[#c5a059]/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-[#c5a059] transition-all">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/80 border border-[#c5a059]/50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={shoesCanvasImg}
                    alt={activeShoesItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] text-[#e5c365] font-bold uppercase tracking-wider bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                      Giày / Guốc Phối
                    </span>
                    <span className="text-[11px] text-[#c5a059] font-medium">
                      {activeShoesItem.styleVibe}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeShoesItem.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed mt-1">
                    {activeShoesItem.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className={activeShoesItem.id === 'shoes-sneakers' ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      {activeShoesItem.id === 'shoes-sneakers' ? '⚠️ Phá cách đường phố hiện đại' : '✓ Chuẩn phong vị cổ kính thanh tao'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 5: Khuy Cúc */}
              <div className={`backdrop-blur-xl border rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all ${
                isChineseButtonSelected 
                  ? 'bg-rose-950/40 border-rose-500/80' 
                  : 'bg-[#161622]/95 border-[#c5a059]/40 hover:border-[#c5a059]'
              }`}>
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/80 border border-[#c5a059]/50 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={activeButtonItem.thumbnailUrl}
                    alt={activeButtonItem.name}
                    className="w-full h-full object-cover rounded-lg drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[10px] text-[#e5c365] font-bold uppercase tracking-wider bg-[#c5a059]/20 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                      Hạt Khuy Cúc
                    </span>
                    <span className="text-[11px] text-[#c5a059] font-medium">
                      Ngũ Thường: Nhân - Lễ - Nghĩa - Trí - Tín
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeButtonItem.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed mt-1">
                    {activeButtonItem.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start gap-2 text-xs">
                    {isChineseButtonSelected ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>CẢNH BÁO VI PHẠM: Cúc vải Tàu phạm húy triều đình!</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">
                        ✓ Đúng chuẩn quy chế Y quan thời Nguyễn
                      </span>
                    )}
                  </div>
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
                  className="w-44 h-30 object-contain -mb-4 relative z-30"
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

      {/* Dedicated Offscreen Robe Visualizer for Poster Export */}
      <div 
        id="export-robe-container" 
        className="sr-only fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0 select-none" 
        aria-hidden="true"
      >
        <RobeVisualizer
          type={activeGarment.svgType}
          primaryColor={selectedColorHex}
          hasDonY={hasDonY}
          buttonType={activeButtonItem.id}
          interactive={false}
          borderless={true}
        />
      </div>
    </div>
  );
};
