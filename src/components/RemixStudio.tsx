import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  HERITAGE_GARMENTS, 
  TRADITIONAL_COLORS, 
  REMIX_ITEMS, 
  CULTURAL_TABOOS,
  HeritageItem,
  ColorOption,
  ModernRemixItem,
  TabooRule,
  getAvailableColors,
  getAccessorySlot,
  getAccessorySlotLabel
} from '../data/heritageData';
import { OutfitMoodboardCanvas } from './OutfitMoodboardCanvas';
import { CustomImageManagerModal } from './CustomImageManagerModal';
import { NguLamYQuanPresets, HeritagePreset } from './NguLamYQuanPresets';
import { ThanhLichBentoLookbook, BentoLookbookPreset } from './ThanhLichBentoLookbook';
import { TheDjDeckPresets, DjDeckPreset } from './TheDjDeckPresets';
import { checkItemTierCompliance } from '../data/data';
import {
  playDanTranhTabSound,
  playButtonClinkSound,
  playFanFlutterSound,
  playGarmentSelectSound,
  playFabricRustleSound,
  playWoodClogSound,
  playColorPickSound,
  playTabooDenialSound,
  playCourtBrassSound,
  playDjScratchSound,
  play808BassDropSound,
  playNeonStampSound
} from '../utils/soundEffects';
import { DEFAULT_PRODUCT_IMAGES, DEFAULT_2D_CANVAS_IMAGES } from '../data/defaultCustomImages';
import { 
  loadCustomImages, 
  saveCustomImages, 
  resetCustomImages,
  compressImageFile, 
  getStoredLockStatus, 
  setStoredLockStatus
} from '../utils/customImageStorage';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  RotateCcw, 
  Share2, 
  Wand2, 
  Palette, 
  Scan, 
  Check, 
  ShieldAlert, 
  Filter, 
  EyeOff, 
  X, 
  Info, 
  BookOpen, 
  ArrowLeft, 
  Scroll, 
  Crown, 
  Zap, 
  Lock, 
  Unlock, 
  FolderOpen,
  MapPin,
  Loader2,
  Cpu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { HeritageHotspotDrawer } from './HeritageHotspotDrawer';
import { 
  hasGeminiApiKey, 
  evaluateOutfitWithGemini, 
  GeminiEvaluationResult,
  OutfitEvaluationPayload
} from '../services/geminiService';
import { evaluateWithNativeCustomGemBrain } from '../services/customGemBrain';

interface ExtractedColorChip {
  name: string;
  hex: string;
  percentage: number;
  role: string;
}

interface AiRemixSuggestion {
  title: string;
  garmentId: string;
  garmentName: string;
  colorHex: string;
  colorName: string;
  bottomId: string;
  bottomName: string;
  shoesId: string;
  shoesName: string;
  accessoryId: string;
  accessoryName: string;
  buttonId: string;
  buttonName: string;
  rationale: string;
  stylistQuote: string;
}

interface RemixResult {
  garment: HeritageItem;
  color: ColorOption;
  selectedItems: Record<string, ModernRemixItem>;
  styleVibe: string;
  matchScore: number;
  scoreBreakdown: {
    yQuanStandard: number;
    genZFashion: number;
    eleganceVibe: number;
  };
  taboosTriggered: TabooRule[];
  stylistFeedback: string;
  paletteItems: { name: string; hex: string; role: string }[];
  geminiVerdict?: GeminiEvaluationResult | null;
}

export interface DualMetricEvaluation {
  slayScore: number;
  heritageScore: number;
  scenario: 'taboo' | 'anachronism' | 'heritage' | 'modern_polite' | 'fusion';
  badgeTitle: string;
  stylistQuote: string;
  subAdvice: string;
  nguThuongAnalysis: string;
  nguHanhAnalysis: string;
  isTaboo: boolean;
  isAnachronism: boolean;
  canAutoFix: boolean;
}

export const UPLOADABLE_PRODUCT_IDS = new Set<string>([
  'btn-silver-lotus',
  'btn-mother-of-pearl',
  'bottom-silk-wide-pants',
  'shoes-chunky-loafers',
  'acc-khan-dong',
  'acc-kieng-bac'
]);

export interface ButtonHeritageInfo {
  title: string;
  nguThuong: string;
  moral: string;
  genzQuote: string;
  isTaboo: boolean;
}

export interface ColorHeritageInfo {
  title: string;
  nguHanh: string;
  giaiTang: string;
  meaning: string;
  genzQuote: string;
  isImperialRestricted: boolean;
}

export const getButtonHeritageInfo = (buttonId: string): ButtonHeritageInfo => {
  const bId = (buttonId || '').toLowerCase();
  if (bId.includes('silver') || bId.includes('bac') || bId.includes('sen')) {
    return {
      title: 'Cúc Bạc Chạm Hoa Sen',
      nguThuong: 'Chữ Liêm & Trí (Thanh tao thoát tục)',
      moral: 'Đúc bạc trắng sáng chạm hoa sen thanh khiết, tượng trưng cốt cách liêm khiết, minh triết của bậc hiền sĩ.',
      genzQuote: 'Cúc bạc hoa sen chạm khắc thanh tao xỉu ngang, aura tiên khí thoát tục chuẩn "bạch nguyệt quang" vạn người mê!',
      isTaboo: false
    };
  }
  if (bId.includes('pearl') || bId.includes('xa_cu') || bId.includes('xa-cu') || bId.includes('oc')) {
    return {
      title: 'Cúc Xà Cừ Khảm Ốc Ánh Kim',
      nguThuong: 'Chữ Mỹ & Lễ (Mỹ nghệ Cung đình)',
      moral: 'Vỏ ốc xà cừ óng ánh ngũ sắc khảm kim chỉ, đỉnh cao mỹ nghệ cung đình, tượng trưng lễ nghi tôn nghiêm và sự hoàn mỹ.',
      genzQuote: 'Cúc xà cừ khảm ốc ngũ sắc lấp lánh như dải ngân hà, bắt sáng cực nghệ, đúng chuẩn visual slay chấn động vương triều!',
      isTaboo: false
    };
  }
  if (bId.includes('jade') || bId.includes('ngoc')) {
    return {
      title: 'Cúc Ngọc Bích Cẩm Thạch',
      nguThuong: 'Chữ Nhân & Đức (Ôn nhuận như ngọc)',
      moral: 'Ngọc phỉ thúy vương giả, tượng trưng đức tính nhân hậu, bao dung, cốt cách vương tôn cao quý.',
      genzQuote: 'Cúc ngọc cẩm thạch vương giả flex nhẹ nhưng sát thương cực cao, vừa quyền quý vừa toát thần thái "rich kid" chốn cung đình!',
      isTaboo: false
    };
  }
  if (bId.includes('wood') || bId.includes('go') || bId.includes('tram')) {
    return {
      title: 'Cúc Gỗ Trầm Hương Khắc Chữ Thọ',
      nguThuong: 'Chữ Tín & Lễ (Văn nhân trường thọ)',
      moral: 'Trầm hương tụ khí đất trời, khắc chữ Thọ cát tường, tượng trưng chữ Tín bền chặt và phong thái an nhiên.',
      genzQuote: 'Cúc gỗ trầm chữ Thọ ngát hương an nhiên, phong thái danh sĩ thi thư chuẩn "học bá cổ phong" mười điểm không có nhưng!',
      isTaboo: false
    };
  }
  if (bId.includes('chinese') || bId.includes('cloth') || bId.includes('vai') || bId.includes('tau')) {
    return {
      title: 'Cúc Vải Tết Dây / Cúc Tàu',
      nguThuong: 'Phạm Húy Quy Chuẩn Y Quan Nước Nam',
      moral: 'Y quan nước Nam chuẩn mực luôn đơm khuy rời (kim loại/gỗ/ngọc). Cúc vải bện sườn xám là dị bản lai căng.',
      genzQuote: 'Ớ mây zing gút chóp nhưng cúc vải Tàu này triều đình lắc đầu nguầy nguậy nha! Y quan nước Nam chỉ chuộng khuy đúc, thay nút ngay kẻo bị lính tuần tra hỏi thăm nè!',
      isTaboo: true
    };
  }
  return {
    title: 'Cúc Đồng Đúc Bát Bửu',
    nguThuong: 'Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín)',
    moral: 'Đồng cổ đúc tròn đĩnh đạc chạm Bát Bửu, hội tụ đủ 5 đức tính nền tảng của bậc chính nhân quân tử.',
    genzQuote: 'Nút đồng đúc Bát Bửu sáng choang uy tín, chuẩn vibe "quân tử bất phàm", nết na không chỗ chê!',
    isTaboo: false
  };
};

export const getColorHeritageInfo = (color: ColorOption): ColorHeritageInfo => {
  const hex = (color.hex || '').toUpperCase();
  if (hex === '#2B5B84') {
    return {
      title: 'Xanh Thanh Thiên',
      nguHanh: 'Hành Thủy (Thủy sinh Mộc)',
      giaiTang: 'Văn nhân sĩ phu & Bậc trí giả',
      meaning: 'Trời xanh quang đãng, tượng trưng tâm hồn phóng khoáng, quang minh lỗi lạc.',
      genzQuote: 'Tone Thanh Thiên dịu mát làm dịu cả mùa hè, chuẩn vibe "nam thần/nữ thần học phủ" thanh lịch thư thái!',
      isImperialRestricted: false
    };
  }
  if (hex === '#5E3A58') {
    return {
      title: 'Tím Chính Sắc',
      nguHanh: 'Hỏa giao Thổ',
      giaiTang: 'Quý tộc hoàng tộc & Mệnh phụ Cung đình Huế',
      meaning: 'Sắc tím thâm nghiêm đài các, tượng trưng đức hạnh kín đáo, đoan trang và quyền quý.',
      genzQuote: 'Tím Chính Sắc thâm trầm hoàng gia, diện vào là aura quyền lực toát ra ngùn ngụt, sang chảnh không đối thủ!',
      isImperialRestricted: false
    };
  }
  if (hex === '#7A222C') {
    return {
      title: 'Đỏ Bã Trầu',
      nguHanh: 'Hành Hỏa (Hỏa nhiệt thành)',
      giaiTang: 'Hỷ sự vương tộc, Lễ phục hôn lễ',
      meaning: 'Đượm vị trầu cau sắt son, tượng trưng hỷ khí, lòng trung trinh và phúc lộc song toàn.',
      genzQuote: 'Đỏ Bã Trầu trầm ấm nồng nàn, vừa tôn da vừa hack tuổi, diện đi tiệc hay đón Tết thì spotlight thuộc về bạn chắc luôn!',
      isImperialRestricted: false
    };
  }
  if (hex === '#334D3C') {
    return {
      title: 'Xanh Rêu Trầm',
      nguHanh: 'Hành Mộc (Mộc trường cửu)',
      giaiTang: 'Bậc cao sĩ ẩn dật & Danh gia vọng tộc',
      meaning: 'Rêu phong thành quách cổ, tượng trưng sự điềm đạm, khiêm nhường và thâm sâu bền bỉ.',
      genzQuote: 'Xanh Rêu Trầm vibe "old money" cổ phong, điềm đạm mà cuốn hút lạ kỳ, nhìn một lần là nhớ cả đời!',
      isImperialRestricted: false
    };
  }
  if (hex === '#4A3525') {
    return {
      title: 'Nâu Sồng',
      nguHanh: 'Hành Thổ (Thổ dưỡng vạn vật)',
      giaiTang: 'Bách tính nhân dân & Thiền phái Trúc Lâm',
      meaning: 'Đất mẹ mộc mạc, tượng trưng đức cần cù chất phác, tâm hồn an yên tự tại.',
      genzQuote: 'Nâu Sồng mộc mạc đậm chất Zen thiền tịnh, phối đồ cực kỳ có gu, phong thái "quiet luxury" đỉnh nóc kịch trần!',
      isImperialRestricted: false
    };
  }
  if (hex === '#F2EAD8') {
    return {
      title: 'Trắng Ngà Lụa Hà Đông',
      nguHanh: 'Hành Kim (Kim thanh khiết)',
      giaiTang: 'Kinh kỳ thượng lưu & Áo lót Đơn Y cốt cách',
      meaning: 'Tơ tằm tơ ngà Vạn Phúc thanh nhã, tượng trưng cốt cách trong sạch, đoan chính không tì vết.',
      genzQuote: 'Trắng Ngà lụa Hà Đông mềm mướt như mây, sáng bừng khung hình, nhẹ nhàng chuẩn "bạch nguyệt quang" xứ kinh kỳ!',
      isImperialRestricted: false
    };
  }
  if (hex === '#F5B014' || color.isImperialRestricted) {
    return {
      title: 'Vàng Minh Hoàng',
      nguHanh: 'Hành Thổ Hoàng Cực (Trung ương Mậu Kỷ Thổ)',
      giaiTang: 'Thiên Tử Triều Nguyễn (Cấm Kỵ Tuyệt Đối Dành Cho Thứ Dân)',
      meaning: 'Sắc vàng tối thượng của Hoàng đế. Thứ dân mặc sẽ phạm tội khi quân!',
      genzQuote: 'Ố dề rồi bạn ơi! Vàng Minh Hoàng chói lòa này thời xưa chỉ Hoàng Đế mới dám mặc thôi, thứ dân diện vào là bay màu đấy nha!',
      isImperialRestricted: true
    };
  }
  return {
    title: color.vietnameseName || color.name,
    nguHanh: color.element || 'Hòa hợp Ngũ Hành',
    giaiTang: 'Thanh lịch truyền thống',
    meaning: color.meaning || 'Sắc phục cổ truyền tao nhã',
    genzQuote: 'Màu sắc kết hợp rất có gu, tôn vinh nét đẹp văn hóa Việt!',
    isImperialRestricted: !!color.isImperialRestricted
  };
};

export const computeRealtimeDualMetrics = (
  garment: HeritageItem,
  color: ColorOption,
  layerId: string,
  buttonId: string,
  bottomId: string,
  shoesId: string,
  accessoryId: string | string[],
  contextId: string = 'heritage'
): DualMetricEvaluation => {
  const accIds = Array.isArray(accessoryId) ? accessoryId : (accessoryId ? [accessoryId] : []);
  const buttonItem = REMIX_ITEMS.find(i => i.id === buttonId);
  const bottomItem = REMIX_ITEMS.find(i => i.id === bottomId);
  const shoesItem = REMIX_ITEMS.find(i => i.id === shoesId);
  const accItems = REMIX_ITEMS.filter(i => accIds.includes(i.id));

  const nativeBrain = evaluateWithNativeCustomGemBrain({
    garmentName: garment.name,
    garmentType: garment.svgType,
    garmentId: garment.id,
    colorName: color.name,
    colorHex: color.hex,
    nguHanh: color.element || 'Thổ',
    buttonName: buttonItem?.name || 'Khuy Cúc',
    buttonId: buttonId,
    isChineseButton: buttonId === 'btn-chinese-cloth',
    bottomName: bottomItem?.name || 'Thân dưới',
    bottomId: bottomId,
    shoesName: shoesItem?.name || 'Giày dép',
    shoesId: shoesId,
    accessories: accItems.map(a => a.name),
    accessoryIds: accIds,
    hasDonY: layerId !== 'layer-no-don-y',
    contextTier: contextId,
    contextName: contextId === 'heritage' ? 'Chốn Tôn Nghiêm (Lễ Gia Tiên)' : contextId === 'modern' ? 'Thanh Lịch Đời Thường (Công sở, Dạo phố)' : 'Phố Thị Phá Cách (Concert, Streetwear)',
    isImperialYellow: Boolean(color.isImperialRestricted),
    isNhatBinhWithKhanDong: garment.id === 'ao-nhat-binh' && accIds.includes('acc-khan-dong')
  });

  const buttonInfo = getButtonHeritageInfo(buttonId);
  const colorInfo = getColorHeritageInfo(color);
  const nguThuongAnalysis = `${buttonInfo.title} [${buttonInfo.nguThuong}]: ${buttonInfo.moral}`;
  const nguHanhAnalysis = `${colorInfo.title} [${colorInfo.nguHanh} - ${colorInfo.giaiTang}]: ${colorInfo.meaning}`;

  const isAnachronism = (garment.id === 'ao-tac' || garment.id === 'ao-nhat-binh') && (shoesId === 'shoes-white-sneakers' || accIds.includes('acc-smartwatch'));

  let scenario: DualMetricEvaluation['scenario'] = 'heritage';
  if (nativeBrain.isTaboo) {
    scenario = 'taboo';
  } else if (isAnachronism) {
    scenario = 'anachronism';
  } else if (contextId === 'fusion') {
    scenario = 'fusion';
  } else if (contextId === 'modern') {
    scenario = 'modern_polite';
  } else {
    scenario = nativeBrain.heritageScore >= 90 ? 'heritage' : 'modern_polite';
  }

  return {
    slayScore: nativeBrain.slayScore,
    heritageScore: nativeBrain.heritageScore,
    scenario,
    badgeTitle: nativeBrain.verdictTitle,
    stylistQuote: nativeBrain.stylistQuote,
    subAdvice: `${nativeBrain.culturalCritique} ✦ Gợi ý: ${nativeBrain.actionableAdvice}`,
    nguThuongAnalysis,
    nguHanhAnalysis,
    isTaboo: nativeBrain.isTaboo,
    isAnachronism,
    canAutoFix: nativeBrain.isTaboo || isAnachronism || layerId === 'layer-no-don-y'
  };
};

export interface RemixStudioProps {
  initialContext?: string;
  onChangeContext?: () => void;
  onContextSwitch?: (tierId: string) => void;
  onToggleWorkspace?: () => void;
  onOpenGeminiModal?: () => void;
  onFindRentalForOutfit?: (outfit: {
    tier: 'heritage' | 'modern' | 'fusion';
    garmentId: string;
    garmentName: string;
    hasSneakers?: boolean;
    styleTitle?: string;
  }) => void;
}

export type WardrobeTab = 'garment' | 'color' | 'button' | 'bottom' | 'shoes' | 'accessory' | 'layer';

export const RemixStudio: React.FC<RemixStudioProps> = ({
  initialContext = 'heritage',
  onChangeContext,
  onContextSwitch,
  onToggleWorkspace,
  onOpenGeminiModal,
  onFindRentalForOutfit
}) => {
  const [currentTier, setCurrentTier] = useState<'heritage' | 'modern' | 'fusion'>(
    (initialContext as 'heritage' | 'modern' | 'fusion') || 'heritage'
  );
  const [activeHeritagePresetId, setActiveHeritagePresetId] = useState<string | null>('preset-nghi-thuc-gia-tien');
  const [activeBentoPresetId, setActiveBentoPresetId] = useState<string | null>('bento-chic-minimalist');
  const [activeDjPresetId, setActiveDjPresetId] = useState<string | null>('track-tet-core-skater');
  
  // Tab wardrobe đang chọn
  const [activeWardrobeTab, setActiveWardrobeTab] = useState<WardrobeTab>('garment');

  // Popover info tooltip
  const [activeTooltipItemId, setActiveTooltipItemId] = useState<string | null>(null);

  // Modal Hồ Sơ Y Phục Lookbook Toàn Màn Hình
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState<boolean>(false);

  // Drawer Triết lý 5 thân & Y quan
  const [isHotspotDrawerOpen, setIsHotspotDrawerOpen] = useState<boolean>(false);

  // Thu gọn / Mở rộng phần đánh giá chi tiết dưới Canvas (Yêu cầu 3 của Giang - Mặc định thu gọn)
  const [isEvaluationDetailsOpen, setIsEvaluationDetailsOpen] = useState<boolean>(false);

  // Điều hướng cuộn thanh danh mục Tủ Đồ bằng mũi tên vàng neon (Yêu cầu 2 của Giang)
  const wardrobeTabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState<boolean>(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState<boolean>(true);

  const handleScrollWardrobeTabs = (direction: 'left' | 'right') => {
    if (wardrobeTabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      wardrobeTabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkWardrobeTabsScroll = () => {
    if (wardrobeTabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = wardrobeTabsScrollRef.current;
      setCanScrollTabsLeft(scrollLeft > 12);
      setCanScrollTabsRight(scrollLeft < scrollWidth - clientWidth - 12);
    }
  };

  useEffect(() => {
    checkWardrobeTabsScroll();
    window.addEventListener('resize', checkWardrobeTabsScroll);
    return () => window.removeEventListener('resize', checkWardrobeTabsScroll);
  }, []);

  // Gamified Buff: +10% Slay Boost khi đã vượt qua Khảo Thí Hoàng Triều
  const [hasSlayBoost, setHasSlayBoost] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('heritstyle_slay_boost') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setHasSlayBoost(typeof window !== 'undefined' && localStorage.getItem('heritstyle_slay_boost') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Micro-interactions: Auto-fill Layering xếp lớp tuần tự (~1.2s tổng)
  const [isLayeringActive, setIsLayeringActive] = useState<boolean>(false);
  const [layeringStep, setLayeringStep] = useState<number>(0);

  // Bộ lọc Tủ đồ Tàng Hình: Mặc định false (Làm mờ 85% kèm nhãn cảnh báo đỏ)
  const [hideUnfitItems, setHideUnfitItems] = useState<boolean>(false);

  // Modal giải thích ranh giới văn hóa khi bấm vào món đồ bị làm mờ
  const [unfitModalItem, setUnfitModalItem] = useState<{
    name: string;
    notice: string;
    tier: string;
    itemId: string;
  } | null>(null);

  // Selection States
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('ao-tac');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#5E3A58');
  const [selectedStyleVibe, setSelectedStyleVibe] = useState<string>('Lễ Nghi Tôn Nghiêm Gia Tộc');
  
  // Custom uploaded image & Multimodal AI state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedColorChip[] | null>(null);
  const [aiOutfitSuggestion, setAiOutfitSuggestion] = useState<AiRemixSuggestion | null>(null);

  // Layer & Accessories States
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-don-y-white');
  const [selectedButtonId, setSelectedButtonId] = useState<string>('btn-metal-copper');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('bottom-silk-wide-pants');
  const [selectedShoesId, setSelectedShoesId] = useState<string>('shoes-wooden-clogs');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(['acc-khan-dong']);
  const selectedAccessoryId = selectedAccessoryIds[0] || 'acc-khan-dong';

  // Generator State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [remixResult, setRemixResult] = useState<RemixResult | null>(null);
  const [copiedLookbook, setCopiedLookbook] = useState<boolean>(false);

  useEffect(() => {
    if (initialContext) {
      setCurrentTier(initialContext as 'heritage' | 'modern' | 'fusion');
    }
  }, [initialContext]);

  // Xử lý chọn Preset Ngự Lãm Y Quan với Auto-fill Layering (Rút gọn chỉ 1 âm thanh khánh đồng hoàng cung trang nghiêm)
  const handleSelectHeritagePreset = (preset: HeritagePreset) => {
    setActiveHeritagePresetId(preset.id);
    setIsLayeringActive(true);
    setLayeringStep(1);

    setSelectedBottomId(preset.outfit.bottomId);
    setSelectedLayerId(preset.outfit.layerId);

    setTimeout(() => {
      setLayeringStep(2);
      setSelectedGarmentId(preset.outfit.garmentId);
      setSelectedColorHex(preset.outfit.colorHex);
      setSelectedButtonId(preset.outfit.buttonId);
      setSelectedStyleVibe(preset.outfit.styleVibe);
    }, 320);

    setTimeout(() => {
      setLayeringStep(3);
      setSelectedShoesId(preset.outfit.shoesId);
      setSelectedAccessoryIds([preset.outfit.accessoryId]);
    }, 640);

    setTimeout(() => {
      setIsLayeringActive(false);
      setLayeringStep(0);
    }, 980);
  };

  // Xử lý chọn Preset Bento Lookbook Thanh Lịch với Auto-fill Layering (Rút gọn chỉ 1 âm thanh xoạt lật trang tạp chí)
  const handleSelectBentoPreset = (preset: BentoLookbookPreset) => {
    setActiveBentoPresetId(preset.id);
    setIsLayeringActive(true);
    setLayeringStep(1);

    setSelectedBottomId(preset.outfit.bottomId);
    setSelectedLayerId(preset.outfit.layerId);

    setTimeout(() => {
      setLayeringStep(2);
      setSelectedGarmentId(preset.outfit.garmentId);
      setSelectedColorHex(preset.outfit.colorHex);
      setSelectedButtonId(preset.outfit.buttonId);
      setSelectedStyleVibe(preset.outfit.styleVibe);
    }, 300);

    setTimeout(() => {
      setLayeringStep(3);
      setSelectedShoesId(preset.outfit.shoesId);
      setSelectedAccessoryIds([preset.outfit.accessoryId]);
    }, 600);

    setTimeout(() => {
      setIsLayeringActive(false);
      setLayeringStep(0);
    }, 920);
  };

  // Xử lý chọn Preset Trạm Trộn Mixset (The DJ Deck) với Layering trực quan (rút gọn chỉ 1 âm thanh duy nhất ở component)
  const handleSelectDjPreset = (preset: DjDeckPreset) => {
    setActiveDjPresetId(preset.id);
    setIsLayeringActive(true);
    setLayeringStep(1);

    setSelectedBottomId(preset.outfit.bottomId);
    setSelectedLayerId(preset.outfit.layerId);

    setTimeout(() => {
      setLayeringStep(2);
      setSelectedGarmentId(preset.outfit.garmentId);
      setSelectedColorHex(preset.outfit.colorHex);
      setSelectedButtonId(preset.outfit.buttonId);
      setSelectedStyleVibe(preset.outfit.styleVibe);
    }, 280);

    setTimeout(() => {
      setLayeringStep(3);
      setSelectedShoesId(preset.outfit.shoesId);
      setSelectedAccessoryIds([preset.outfit.accessoryId]);
    }, 560);

    setTimeout(() => {
      setIsLayeringActive(false);
      setLayeringStep(0);
    }, 880);
  };

  // Available options
  const activeGarment = HERITAGE_GARMENTS.find(g => g.id === selectedGarmentId) || HERITAGE_GARMENTS[0];
  
  // Lọc sắc phục theo bối cảnh: Màn 1 & Màn 2 loại bỏ "Xanh Cyber Blue" và "Xanh Acid Green"
  const availableColors = useMemo(() => {
    return getAvailableColors(currentTier);
  }, [currentTier]);

  const activeColor = availableColors.find(c => c.hex === selectedColorHex) || availableColors[0];
  
  const layerOptions = REMIX_ITEMS.filter(i => i.category === 'layer');
  const buttonOptions = REMIX_ITEMS.filter(i => i.category === 'button');
  const bottomOptions = REMIX_ITEMS.filter(i => i.category === 'bottom');
  const shoesOptions = REMIX_ITEMS.filter(i => i.category === 'shoes');
  const accessoryOptions = REMIX_ITEMS.filter(i => i.category === 'accessory');

  const activeButtonItem = buttonOptions.find(b => b.id === selectedButtonId) || buttonOptions[0];
  const activeBottomItem = bottomOptions.find(b => b.id === selectedBottomId) || bottomOptions[0];
  const activeShoesItem = shoesOptions.find(s => s.id === selectedShoesId) || shoesOptions[0];
  
  // Danh sách các phụ kiện đang được chọn cùng lúc
  const activeAccessoryItems = useMemo(() => {
    return selectedAccessoryIds
      .map(id => accessoryOptions.find(a => a.id === id))
      .filter((a): a is ModernRemixItem => Boolean(a));
  }, [selectedAccessoryIds, accessoryOptions]);

  const activeAccessoryItem = activeAccessoryItems[0] || accessoryOptions[0];

  useEffect(() => {
    if (initialContext === 'heritage') {
      setSelectedGarmentId('ao-tac');
      setSelectedColorHex('#2B5B84');
      setSelectedStyleVibe('Dạ Hội Cung Đình Luxury');
      setSelectedBottomId('bottom-silk-wide-pants');
      setSelectedShoesId('shoes-wooden-clogs');
      setSelectedButtonId('btn-metal-copper');
      setSelectedAccessoryIds(['acc-khan-dong']);
    } else if (initialContext === 'modern') {
      setSelectedGarmentId('ngu-than-tay-chen');
      setSelectedColorHex('#F2EAD8');
      setSelectedStyleVibe('Chic Minimalist Quiet Luxury');
      setSelectedBottomId('bottom-tailored-wide-leg');
      setSelectedShoesId('shoes-chunky-loafers');
      setSelectedButtonId('btn-mother-of-pearl');
      setSelectedAccessoryIds(['acc-sunglasses-gold', 'acc-kieng-bac']);
      setSelectedLayerId('layer-don-y-white');
    } else if (initialContext === 'fusion') {
      setSelectedGarmentId('ao-giao-linh');
      setSelectedColorHex('#5E3A58');
      setSelectedStyleVibe('Streetwear Á Đông Phá Cách');
      setSelectedBottomId('bottom-high-waist-jeans');
      setSelectedShoesId('shoes-chunky-loafers');
      setSelectedButtonId('btn-mother-of-pearl');
      setSelectedAccessoryIds(['acc-bucket-hat', 'acc-silver-chain-cuban']);
    }
  }, [initialContext]);

  // Tự động kiểm tra màu khi chuyển tier
  useEffect(() => {
    if (currentTier === 'heritage' || currentTier === 'modern') {
      if (selectedColorHex === '#00F0FF' || selectedColorHex === '#39FF14') {
        setSelectedColorHex(currentTier === 'heritage' ? '#2B5B84' : '#334D3C');
      }
    }
  }, [currentTier]);

  const rawDualMetrics = computeRealtimeDualMetrics(
    activeGarment,
    activeColor,
    selectedLayerId,
    selectedButtonId,
    selectedBottomId,
    selectedShoesId,
    selectedAccessoryIds,
    currentTier
  );

  const dualMetrics = useMemo(() => {
    if (!hasSlayBoost) return rawDualMetrics;
    return {
      ...rawDualMetrics,
      slayScore: Math.min(100, rawDualMetrics.slayScore + 10),
      heritageScore: Math.min(100, rawDualMetrics.heritageScore + 10)
    };
  }, [rawDualMetrics, hasSlayBoost]);

  const isChineseButtonSelected = selectedButtonId === 'btn-chinese-cloth';
  const isImperialYellowSelected = !!activeColor.isImperialRestricted;
  const isTabooClashSelected = selectedAccessoryIds.includes('acc-smartwatch') || (!activeShoesItem.isCulturallyRespectful) || (selectedGarmentId === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong'));

  const [geminiResult, setGeminiResult] = useState<GeminiEvaluationResult | null>(null);
  const [isEvaluatingGemini, setIsEvaluatingGemini] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  useEffect(() => {
    if (geminiResult) {
      setGeminiResult(null);
    }
    setGeminiError(null);
  }, [selectedGarmentId, selectedColorHex, selectedButtonId, selectedBottomId, selectedShoesId, selectedAccessoryIds, selectedLayerId, currentTier]);

  const effectiveMetrics = useMemo(() => {
    if (geminiResult) {
      return {
        ...dualMetrics,
        slayScore: geminiResult.slayScore,
        heritageScore: geminiResult.heritageScore,
        badgeTitle: geminiResult.verdictTitle,
        stylistQuote: geminiResult.stylistQuote,
        subAdvice: `${geminiResult.culturalCritique} ✦ Gợi ý: ${geminiResult.actionableAdvice}`,
        isTaboo: geminiResult.isTaboo || dualMetrics.isTaboo
      };
    }
    return dualMetrics;
  }, [dualMetrics, geminiResult]);

  const handleTriggerGeminiEvaluation = async () => {
    if (!hasGeminiApiKey()) {
      if (onOpenGeminiModal) {
        onOpenGeminiModal();
      }
      return;
    }

    setIsEvaluatingGemini(true);
    setGeminiError(null);
    playGarmentSelectSound();

    try {
      const payload = {
        garmentName: activeGarment.name,
        garmentType: activeGarment.svgType,
        colorName: activeColor.name,
        colorHex: activeColor.hex,
        nguHanh: activeColor.element || 'Thổ',
        buttonName: activeButtonItem.name,
        isChineseButton: isChineseButtonSelected,
        bottomName: activeBottomItem.name,
        shoesName: activeShoesItem.name,
        accessories: activeAccessoryItems.map(a => a.name),
        hasDonY: selectedLayerId !== 'layer-no-don-y',
        contextTier: currentTier,
        contextName: currentTier === 'heritage' ? 'Chốn Tôn Nghiêm (Lễ Gia Tiên)' : currentTier === 'modern' ? 'Thanh Lịch Đời Thường (Công sở, Dạo phố)' : 'Phố Thị Phá Cách (Concert, Streetwear)',
        modeName: currentTier === 'heritage' 
          ? 'Mode 1 - Chốn Tôn Nghiêm (Tạp chí/Biểu tượng)' 
          : currentTier === 'modern' 
            ? 'Mode 2 - Đời Thường (Cân bằng)' 
            : 'Mode 3 - Phố Thị (Phá Cách)',
        isImperialYellow: isImperialYellowSelected,
        isNhatBinhWithKhanDong: selectedGarmentId === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')
      };

      const result = await evaluateOutfitWithGemini(payload);
      setGeminiResult(result);
      playCourtBrassSound();
    } catch (err: any) {
      setGeminiError(err.message || 'Không thể kết nối đến Google AI Studio.');
    } finally {
      setIsEvaluatingGemini(false);
    }
  };

  const [customItemImages, setCustomItemImages] = useState<{ [itemId: string]: string }>(() => {
    return { ...DEFAULT_PRODUCT_IMAGES };
  });

  // Tải đồng bộ ảnh từ IndexedDB đảm bảo không bao giờ bị mất hoặc reset
  useEffect(() => {
    loadCustomImages().then((imgs) => {
      setCustomItemImages(imgs);
    });
  }, []);

  const [isCustomImageModalOpen, setIsCustomImageModalOpen] = useState<boolean>(false);
  const [isUploadLocked, setIsUploadLocked] = useState<boolean>(() => {
    return getStoredLockStatus();
  });

  const toggleUploadLock = () => {
    const next = !isUploadLocked;
    setIsUploadLocked(next);
    setStoredLockStatus(next);
    if (next) {
      playCourtBrassSound();
    } else {
      playDanTranhTabSound();
    }
  };

  const itemFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadItemId, setActiveUploadItemId] = useState<string | null>(null);

  const triggerItemImageUpload = (itemId: string) => {
    if (isUploadLocked) return;
    setActiveUploadItemId(itemId);
    if (itemFileInputRef.current) {
      itemFileInputRef.current.value = '';
      itemFileInputRef.current.click();
    }
  };

  const handleItemImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadItemId) {
      try {
        const compressedUrl = await compressImageFile(file, 800, 800, 0.82);
        const updated = {
          ...customItemImages,
          [activeUploadItemId]: compressedUrl
        };
        setCustomItemImages(updated);
        await saveCustomImages(updated);
        playFabricRustleSound();
      } catch (err) {
        console.warn('Fallback saving without canvas compression:', err);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          const updated = {
            ...customItemImages,
            [activeUploadItemId]: dataUrl
          };
          setCustomItemImages(updated);
          await saveCustomImages(updated);
          playFabricRustleSound();
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleResetItemImage = async (itemId: string) => {
    const updated = { ...customItemImages };
    if (DEFAULT_PRODUCT_IMAGES[itemId]) {
      updated[itemId] = DEFAULT_PRODUCT_IMAGES[itemId];
    } else {
      delete updated[itemId];
    }
    setCustomItemImages(updated);
    await saveCustomImages(updated);
    playButtonClinkSound();
  };

  const getItemImageUrl = (itemId: string, defaultThumbnail?: string): string => {
    return customItemImages[itemId] || DEFAULT_PRODUCT_IMAGES[itemId] || defaultThumbnail || '';
  };

  const getItemCanvas2dUrl = (itemId: string, defaultCanvas?: string): string => {
    return DEFAULT_2D_CANVAS_IMAGES[itemId] || defaultCanvas || customItemImages[itemId] || DEFAULT_PRODUCT_IMAGES[itemId] || '';
  };

  const SAMPLE_AI_PALETTES: { [key: number]: ExtractedColorChip[] } = {
    0: [
      { name: 'Xanh Thanh Thiên Đậm', hex: '#2B5B84', percentage: 48, role: 'Sắc Phục Chính' },
      { name: 'Bạch Lụa Tuyết', hex: '#F4EFE6', percentage: 24, role: 'Viền Cổ Đơn Y' },
      { name: 'Đồng Cổ Bát Bửu', hex: '#C5A059', percentage: 16, role: 'Khuy Kim Loại' },
      { name: 'Huyền Trầm Indigo', hex: '#1C1917', percentage: 12, role: 'Thân Dưới Linen' },
    ],
    1: [
      { name: 'Đỏ Bã Trầu Huế', hex: '#7A222C', percentage: 52, role: 'Sắc Phục Chính' },
      { name: 'Ngọc Bích Cung Đình', hex: '#1D5C42', percentage: 22, role: 'Điểm Nhấn Ngọc' },
      { name: 'Bạch Tuyết Cổ Đứng', hex: '#F4EFE6', percentage: 16, role: 'Lớp Áo Đơn Y' },
      { name: 'Hoàng Kim Nhũ Vàng', hex: '#D4AF37', percentage: 10, role: 'Chỉ Thêu Hài' },
    ],
    2: [
      { name: 'Tím Hoa Cà Cố Đô', hex: '#5E3A58', percentage: 45, role: 'Sắc Phục Chính' },
      { name: 'Bạch Ngà Đơn Y', hex: '#F4EFE6', percentage: 25, role: 'Cổ Đơn Y' },
      { name: 'Nâu Gỗ Trầm', hex: '#3E2A1E', percentage: 18, role: 'Guốc Mộc Quai Nhung' },
      { name: 'Vàng Đồng Cổ', hex: '#C5A059', percentage: 12, role: 'Cúc 5 Khuy' },
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageResult = event.target?.result as string;
        setUploadedImage(imageResult);
        setIsAnalyzingImage(true);
        setAnalysisProgress(0);

        const startTime = Date.now();
        const duration = 1500;

        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
          setAnalysisProgress(currentProgress);

          if (elapsed >= duration) {
            clearInterval(progressInterval);
            setIsAnalyzingImage(false);

            const randomPaletteIndex = Math.floor(Math.random() * 3);
            const palette = SAMPLE_AI_PALETTES[randomPaletteIndex] || SAMPLE_AI_PALETTES[0];
            setExtractedPalette(palette);

            const dominantColor = palette[0];
            setSelectedColorHex(dominantColor.hex);

            let suggestedGarment = 'ngu-than-tay-chen';
            let suggestedGarmentName = 'Áo Ngũ Thân Tay Chẽn';
            let suggestedBottom = 'bottom-linen-wide-pants';
            let suggestedBottomName = 'Quần Ống Rộng Linen';
            let suggestedShoes = 'shoes-wooden-clogs';
            let suggestedShoesName = 'Guốc Mộc Truyền Thống';

            if (dominantColor.hex === '#7A222C') {
              suggestedGarment = 'ao-nhat-binh';
              suggestedGarmentName = 'Áo Nhật Bình Cung Đình';
              suggestedBottom = 'bottom-pleated-midi-skirt';
              suggestedBottomName = 'Chân Váy Xếp Ly Hiện Đại';
              suggestedShoes = 'shoes-embroidered-slippers';
              suggestedShoesName = 'Hài Thêu Hoa Văn';
            } else if (dominantColor.hex === '#5E3A58') {
              suggestedGarment = 'ao-tac';
              suggestedGarmentName = 'Áo Tấc (Áo Tay Thụng)';
              suggestedBottom = 'bottom-linen-wide-pants';
              suggestedBottomName = 'Quần Ống Rộng Linen';
            }

            const suggestion: AiRemixSuggestion = {
              title: `Bản Phối Di Sản Theo Tone Màu ${dominantColor.name}`,
              garmentId: suggestedGarment,
              garmentName: suggestedGarmentName,
              colorHex: dominantColor.hex,
              colorName: dominantColor.name,
              bottomId: suggestedBottom,
              bottomName: suggestedBottomName,
              shoesId: suggestedShoes,
              shoesName: suggestedShoesName,
              accessoryId: 'acc-paper-fan',
              accessoryName: 'Quạt Giấy Trầm Hương',
              buttonId: 'btn-metal-copper',
              buttonName: 'Cúc Kim Loại (Đồng Chạm Bát Bửu)',
              rationale: `AI Vision nhận diện phom dáng và sắc độ ${dominantColor.name} rất ăn ý với chất liệu lụa mộc, tôn vinh nét đoan trang của y quan triều Nguyễn mà vẫn cực kỳ thanh lịch khi dạo phố đương đại.`,
              stylistQuote: `“Trời ơi người đẹp ơi! AI vừa quét xong là Stylist đổ đứ đừ trước bảng màu này liền! Phối ngay ${suggestedGarmentName} màu ${dominantColor.name} cùng ${suggestedBottomName} và ${suggestedShoesName} là điểm mười không có nhưng!”`
            };

            setAiOutfitSuggestion(suggestion);
            setSelectedGarmentId(suggestedGarment);
            setSelectedBottomId(suggestedBottom);
            setSelectedShoesId(suggestedShoes);
            setSelectedAccessoryIds(['acc-paper-fan']);
            setSelectedLayerId('layer-don-y-white');
            setSelectedButtonId('btn-metal-copper');
          }
        }, 50);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (aiOutfitSuggestion) {
      setSelectedGarmentId(aiOutfitSuggestion.garmentId);
      setSelectedColorHex(aiOutfitSuggestion.colorHex);
      setSelectedBottomId(aiOutfitSuggestion.bottomId);
      setSelectedShoesId(aiOutfitSuggestion.shoesId);
      setSelectedAccessoryIds([aiOutfitSuggestion.accessoryId]);
      setSelectedButtonId(aiOutfitSuggestion.buttonId);
      setSelectedLayerId('layer-don-y-white');
      playGarmentSelectSound();
    }
  };

  const handleAutoFixTaboos = () => {
    setSelectedLayerId('layer-don-y-white');
    if (selectedButtonId === 'btn-chinese-cloth') {
      setSelectedButtonId('btn-metal-copper');
    }
    if (activeColor.isImperialRestricted) {
      setSelectedColorHex('#2B5B84');
    }
    if (selectedShoesId === 'shoes-white-sneakers' && (activeGarment.id === 'ao-tac' || activeGarment.id === 'ao-nhat-binh' || activeGarment.id === 'ao-vien-linh')) {
      setSelectedShoesId('shoes-wooden-clogs');
    }
    if (selectedAccessoryIds.includes('acc-smartwatch')) {
      setSelectedAccessoryIds(prev => prev.map(id => id === 'acc-smartwatch' ? 'acc-paper-fan' : id));
    }
    if (selectedGarmentId === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')) {
      setSelectedAccessoryIds(prev => prev.map(id => id === 'acc-khan-dong' ? 'acc-khan-vanh-day' : id));
    }
    playDanTranhTabSound();
    
    setTimeout(() => {
      generateRemixOutfit(
        activeGarment, 
        availableColors.find(c => c.hex === '#2B5B84') || availableColors[0],
        'layer-don-y-white',
        'btn-metal-copper',
        selectedBottomId,
        'shoes-wooden-clogs',
        'acc-paper-fan',
        selectedStyleVibe
      );
    }, 150);
  };

  const generateRemixOutfit = async (
    garment = activeGarment,
    color = activeColor,
    layerId = selectedLayerId,
    buttonId = selectedButtonId,
    bottomId = selectedBottomId,
    shoesId = selectedShoesId,
    accessoryId = selectedAccessoryId,
    styleVibe = selectedStyleVibe
  ) => {
    setIsGenerating(true);

    const layerItem = REMIX_ITEMS.find(i => i.id === layerId)!;
    const buttonItem = REMIX_ITEMS.find(i => i.id === buttonId)!;
    const bottomItem = REMIX_ITEMS.find(i => i.id === bottomId)!;
    const shoesItem = REMIX_ITEMS.find(i => i.id === shoesId)!;
    const accessoryItem = REMIX_ITEMS.find(i => i.id === accessoryId)!;

    const triggered: TabooRule[] = [];

    if (buttonItem.tabooTrigger === 'NO_CHINESE_BUTTON') {
      const rule = CULTURAL_TABOOS.find(r => r.ruleCode === 'NO_CHINESE_BUTTON');
      if (rule) triggered.push(rule);
    }

    if (layerItem.tabooTrigger === 'MUST_HAVE_DON_Y') {
      const rule = CULTURAL_TABOOS.find(r => r.ruleCode === 'MUST_HAVE_DON_Y');
      if (rule) triggered.push(rule);
    }

    if (color.isImperialRestricted) {
      const rule = CULTURAL_TABOOS.find(r => r.ruleCode === 'NO_IMPERIAL_YELLOW');
      if (rule) triggered.push(rule);
    }

    if (garment.id === 'ao-tac' || garment.id === 'ao-nhat-binh') {
      if (shoesItem.id === 'shoes-white-sneakers' || accessoryItem.tabooTrigger === 'NO_CLASH_MODERN_SHOES') {
        const rule = CULTURAL_TABOOS.find(r => r.ruleCode === 'NO_CLASH_MODERN_SHOES');
        if (rule && !triggered.some(t => t.id === rule.id)) triggered.push(rule);
      }
    }

    let totalScore = 98;
    triggered.forEach(t => {
      totalScore -= t.penaltyScore;
    });

    if (totalScore < 30) totalScore = 30;
    if (totalScore > 99) totalScore = 99;

    const yQuanScore = triggered.length === 0 ? 98 : Math.max(25, 95 - triggered.reduce((acc, t) => acc + t.penaltyScore, 0));
    const genZScore = bottomItem.id === 'bottom-linen-wide-pants' || bottomItem.id === 'bottom-pleated-midi-skirt' ? 96 : 92;
    const eleganceScore = triggered.length === 0 ? 96 : 58;

    let feedback = '';
    if (triggered.length > 0) {
      if (currentTier === 'modern') {
        feedback = buttonItem.id === 'btn-chinese-cloth'
          ? `Nhắc nhở nhẹ nhàng từ Stylist: Cúc Tàu không nằm trong từ điển thanh lịch của y quan nhà Nguyễn đâu nha! Hãy đổi sang Cúc Xà Cừ hoặc Cúc Gỗ Trầm để giữ trọn vẹn nét tinh tế, nhã nhặn chuẩn Quiet Luxury!`
          : `Nhắc nhở nhẹ nhàng: Bản phối có cấu kiện chưa chuẩn chỉnh y quan. Nhấn nút khắc phục để hoàn thiện bản phối chuẩn mực nhé!`;
      } else {
        const quotes = triggered.map(t => t.genZQuote).join(' ');
        feedback = `Báo động đỏ nè bạn hiền ơi! Stylist ngó qua outfit là thấy có tín hiệu "lệch sóng di sản" liền. ${quotes} Nhấn ngay nút "Khắc Phục Chuẩn Triều Nguyễn" ở trên để Stylist cứu nguy cho diện mạo mười điểm không có nhưng nhé!`;
      }
    } else {
      if (currentTier === 'modern') {
        feedback = `Set đồ phối rất tinh tế, gọn gàng, chuẩn phong cách Quiet Luxury. Điểm thanh lịch: 8.8/10. Phù hợp diện đi làm, ghé Phê La hay ăn tối tại Pizza 4P's. Phom dáng ${garment.name} sắc ${color.name} kết hợp cùng ${bottomItem.name}, ${shoesItem.name} và ${buttonItem.name} mang lại thần thái vừa tri thức vừa sang trọng!`;
      } else {
        feedback = `Trời ơi xuất sắc luôn người đẹp ơi! Gu phối đồ của bạn hiền hôm nay phải gọi là "drip đỉnh nóc, slay kịch trần"! Lớp áo ${garment.name} tông ${color.name} quyền quý, có cổ Đơn Y trắng viền tinh khôi làm bừng sáng thần thái. Kết hợp cùng ${bottomItem.name}, ${shoesItem.name} và ${accessoryItem.name} vừa chuẩn quy chuẩn y quan Nguyễn Triều lại vừa ngập tràn hơi thở đương đại! Ra phố diện bộ này là chuẩn phong thái vương giả khiến ai cũng phải ngoái nhìn!`;
      }
    }

    const palette = [
      { name: color.name, hex: color.hex, role: 'Sắc Phục Chính' },
      { name: 'Bạch Tuyết Đơn Y', hex: '#F4EFE6', role: 'Viền Cổ Áo Lót' },
      { name: 'Hoàng Kim Cúc Khuy', hex: buttonId === 'btn-jade-green' ? '#10B981' : buttonId === 'btn-wood-agarwood' ? '#8B5A2B' : '#D4AF37', role: 'Phụ Kiện Cúc Áo' },
      { name: 'Trầm Mặc Đen Khói', hex: '#1C1917', role: 'Phom Quần / Phụ Kiện' }
    ];

    // 🌟 KÍCH HOẠT BỘ NÃO CUSTOM GEM (HỖ TRỢ CẢ NATIVE ENGINE LẪN GOOGLE AI STUDIO)
    setIsEvaluatingGemini(true);
    let geminiVerdict: GeminiEvaluationResult | null = null;
    try {
      const payload: OutfitEvaluationPayload = {
        garmentName: garment.name,
        garmentType: garment.svgType,
        garmentId: garment.id,
        colorName: color.name,
        colorHex: color.hex,
        nguHanh: color.element || 'Thổ',
        buttonName: buttonItem.name,
        buttonId: buttonItem.id,
        isChineseButton: buttonItem.id === 'btn-chinese-cloth',
        bottomName: bottomItem.name,
        bottomId: bottomItem.id,
        shoesName: shoesItem.name,
        shoesId: shoesItem.id,
        accessories: activeAccessoryItems.length > 0 ? activeAccessoryItems.map(a => a.name) : [accessoryItem.name],
        accessoryIds: activeAccessoryItems.length > 0 ? activeAccessoryItems.map(a => a.id) : [accessoryItem.id],
        hasDonY: layerItem.id !== 'layer-no-don-y',
        contextTier: currentTier,
        contextName: currentTier === 'heritage' ? 'Chốn Tôn Nghiêm (Lễ Gia Tiên)' : currentTier === 'modern' ? 'Thanh Lịch Đời Thường (Công sở, Dạo phố)' : 'Phố Thị Phá Cách (Concert, Streetwear)',
        modeName: currentTier === 'heritage' 
          ? 'Mode 1 - Chốn Tôn Nghiêm (Tạp chí/Biểu tượng)' 
          : currentTier === 'modern' 
            ? 'Mode 2 - Đời Thường (Cân bằng)' 
            : 'Mode 3 - Phố Thị (Phá Cách)',
        isImperialYellow: Boolean(color.isImperialRestricted),
        isNhatBinhWithKhanDong: garment.id === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')
      };
      geminiVerdict = await evaluateOutfitWithGemini(payload);
      setGeminiResult(geminiVerdict);
    } catch (err: any) {
      console.warn('Custom Gem evaluation error, running native engine:', err);
      geminiVerdict = evaluateWithNativeCustomGemBrain({
        garmentName: garment.name,
        garmentType: garment.svgType,
        garmentId: garment.id,
        colorName: color.name,
        colorHex: color.hex,
        nguHanh: color.element || 'Thổ',
        buttonName: buttonItem.name,
        buttonId: buttonItem.id,
        isChineseButton: buttonItem.id === 'btn-chinese-cloth',
        bottomName: bottomItem.name,
        bottomId: bottomItem.id,
        shoesName: shoesItem.name,
        shoesId: shoesItem.id,
        accessories: activeAccessoryItems.length > 0 ? activeAccessoryItems.map(a => a.name) : [accessoryItem.name],
        accessoryIds: activeAccessoryItems.length > 0 ? activeAccessoryItems.map(a => a.id) : [accessoryItem.id],
        hasDonY: layerItem.id !== 'layer-no-don-y',
        contextTier: currentTier,
        contextName: currentTier === 'heritage' ? 'Chốn Tôn Nghiêm (Lễ Gia Tiên)' : currentTier === 'modern' ? 'Thanh Lịch Đời Thường (Công sở, Dạo phố)' : 'Phố Thị Phá Cách (Concert, Streetwear)',
        isImperialYellow: Boolean(color.isImperialRestricted),
        isNhatBinhWithKhanDong: garment.id === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')
      });
      setGeminiResult(geminiVerdict);
    } finally {
      setIsEvaluatingGemini(false);
    }

    const finalMatchScore = geminiVerdict ? geminiVerdict.heritageScore : totalScore;
    const finalFeedback = geminiVerdict ? geminiVerdict.stylistQuote : feedback;

    setRemixResult({
      garment,
      color,
      selectedItems: {
        layer: layerItem,
        button: buttonItem,
        bottom: bottomItem,
        shoes: shoesItem,
        accessory: accessoryItem
      },
      styleVibe: geminiVerdict?.verdictTitle || styleVibe,
      matchScore: finalMatchScore,
      scoreBreakdown: {
        yQuanStandard: geminiVerdict ? geminiVerdict.heritageScore : yQuanScore,
        genZFashion: geminiVerdict ? geminiVerdict.slayScore : genZScore,
        eleganceVibe: geminiVerdict ? geminiVerdict.slayScore : eleganceScore
      },
      taboosTriggered: triggered,
      stylistFeedback: finalFeedback,
      paletteItems: palette,
      geminiVerdict
    });
    setIsGenerating(false);
    setIsLookbookModalOpen(true);
    playCourtBrassSound();
  };

  const handleShareLookbook = () => {
    setCopiedLookbook(true);
    setTimeout(() => setCopiedLookbook(false), 2500);
  };

  const WARDROBE_TABS: { id: WardrobeTab; label: string; icon: string; count?: number }[] = [
    { id: 'garment', label: 'Áo Ngoài', icon: '👘', count: HERITAGE_GARMENTS.length },
    { id: 'color', label: 'Sắc Phục', icon: '🎨', count: availableColors.length },
    { id: 'button', label: 'Khuy Cúc', icon: '🔘', count: buttonOptions.length },
    { id: 'bottom', label: 'Thân Dưới', icon: '👖', count: bottomOptions.length },
    { id: 'shoes', label: 'Giày / Guốc', icon: '👞', count: shoesOptions.length },
    { id: 'accessory', label: 'Phụ Kiện', icon: '🪭', count: accessoryOptions.length },
    { id: 'layer', label: 'Đơn Y', icon: '🥼', count: layerOptions.length }
  ];

  return (
    <div className={`space-y-6 ${currentTier === 'fusion' ? 'font-streetwear' : ''}`}>
      {/* ======================================================== */}
      {/* 1. TOP BAR TINH GỌN: ĐỔI BỐI CẢNH + RESET MẪU */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121217] border border-[#23232c] rounded-2xl px-4 py-3 shadow-md">
        <div className="flex items-center gap-2.5">
          {onChangeContext && (
            <button
              onClick={() => {
                playDanTranhTabSound();
                onChangeContext();
              }}
              className="px-4 py-2 text-[13.5px] rounded-xl bg-black/85 text-[#FFF9A6] border-2 border-[#FFEE00] animate-neon-glow-yellow hover:brightness-110 active:scale-95 font-bold flex items-center gap-2 transition-all cursor-pointer group shadow-lg"
              title="Quay lại chọn bối cảnh khác (Chốn Tôn Nghiêm / Thanh Lịch Đời Thường / Phố Thị Phá Cách)"
            >
              <ArrowLeft className="w-4 h-4 text-[#FFEE00] group-hover:-translate-x-1 transition-transform animate-pulse" />
              <span className="tracking-wide uppercase font-bold text-xs sm:text-[13px] text-[#FFEE00]">Đổi Bối Cảnh</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-serif font-bold text-[#e5c365] tracking-wide">
              {currentTier === 'heritage' ? '⛩️ Chốn Tôn Nghiêm (Heritage Core)' :
               currentTier === 'modern' ? '🌿 Thanh Lịch Đời Thường (Quiet Luxury)' :
               '⚡ Đô Thị Phá Cách (Urban Streetwear)'}
            </span>
            <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
              · Điển lễ & Tôn ti
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              setSelectedGarmentId('ao-tac');
              setSelectedColorHex('#2B5B84');
              setSelectedStyleVibe('Dạ Hội Cung Đình Luxury');
              setSelectedLayerId('layer-don-y-white');
              setSelectedButtonId('btn-metal-copper');
              setSelectedBottomId('bottom-silk-wide-pants');
              setSelectedShoesId('shoes-wooden-clogs');
              setSelectedAccessoryIds(['acc-khan-dong']);
              setExtractedPalette(null);
              setAiOutfitSuggestion(null);
              playDanTranhTabSound();
            }}
            className="px-3 py-1.5 text-xs text-stone-300 hover:text-[#e5c365] border border-white/10 hover:border-[#c5a059]/40 rounded-xl transition-colors flex items-center gap-1.5 bg-[#171720] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mẫu chuẩn</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN BỐ CỤC 2 CỘT (40% CHỌN ĐỒ / 60% THỊ GIÁC & ĐIỂM SỐ) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ======================================================== */}
        {/* CỘT TRÁI (40% - lg:col-span-5): ĐIỀU HƯỚNG & CHỌN ĐỒ (CUỘN ĐỘC LẬP) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
          
          {/* A. PRESET GỢI Ý BỐI CẢNH */}
          {currentTier === 'heritage' && (
            <NguLamYQuanPresets
              activePresetId={activeHeritagePresetId}
              onSelectPreset={handleSelectHeritagePreset}
            />
          )}

          {currentTier === 'modern' && (
            <ThanhLichBentoLookbook
              activePresetId={activeBentoPresetId}
              onSelectPreset={handleSelectBentoPreset}
            />
          )}

          {currentTier === 'fusion' && (
            <div className="pt-3">
              <TheDjDeckPresets
                activePresetId={activeDjPresetId || undefined}
                onSelectPreset={handleSelectDjPreset}
              />
            </div>
          )}

          {/* B. KHU VỰC TỦ ĐỒ DẠNG TABS */}
          <div className={`p-4 sm:p-5 space-y-4 transition-all ${
            currentTier === 'modern'
              ? 'rounded-2xl bg-white/85 border border-stone-200/90 shadow-sm backdrop-blur-xl text-stone-800'
              : currentTier === 'fusion'
              ? 'font-streetwear rounded-2xl bg-[#121212]/95 border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.06)] text-white'
              : 'rounded-2xl bg-[#141419] border border-[#23232c] shadow-xl text-[#f5f2eb]'
          }`}>
            
            {/* Header tủ đồ & nút gạt Tàng hình 85% */}
            <div className={`flex items-center justify-between border-b pb-3 ${
              currentTier === 'modern'
                ? 'border-stone-200/80'
                : currentTier === 'fusion'
                ? 'border-b border-white/10'
                : 'border-white/5'
            }`}>
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-1.5 ${
                  currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'
                }`}>
                  <span className={currentTier === 'fusion' ? 'font-black not-italic font-bold uppercase tracking-wider' : ''}>
                    {currentTier === 'modern' ? 'Tủ Đồ Thanh Lịch' : currentTier === 'fusion' ? 'TỦ ĐỒ PHÁ CÁCH' : 'Tủ Đồ Ngự Lãm'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 border ${
                    currentTier === 'modern'
                      ? 'rounded-full bg-[#8BA888]/15 text-[#355232] border-[#8BA888]/30 font-sans font-medium'
                      : currentTier === 'fusion'
                      ? 'rounded-md bg-[#00f3ff]/15 text-[#00f3ff] border border-[#00f3ff]/40 font-mono font-bold'
                      : 'rounded-full bg-[#c5a059]/15 text-[#e5c365] border-[#c5a059]/30 font-serif'
                  }`}>
                    {currentTier === 'modern' ? 'Acubi / Quiet Luxury' : currentTier === 'fusion' ? 'FUSION STREETWEAR' : 'Triều Nguyễn'}
                  </span>
                </h3>
              </div>

              {/* Toggle Ẩn / Hiện mờ 85% */}
              <button
                type="button"
                onClick={() => {
                  setHideUnfitItems(!hideUnfitItems);
                  if (currentTier === 'fusion') playDjScratchSound();
                  else playDanTranhTabSound();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                  currentTier === 'fusion'
                    ? hideUnfitItems
                      ? 'rounded-lg bg-[#00f3ff] text-black font-black border border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.35)]'
                      : 'rounded-lg bg-black/70 text-stone-300 border border-white/15 hover:border-[#00f3ff]/50'
                    : hideUnfitItems
                    ? (currentTier === 'modern' ? 'rounded-lg bg-[#8BA888] text-white font-bold shadow-sm' : 'rounded-lg bg-[#c5a059] text-stone-950 font-bold shadow-md')
                    : (currentTier === 'modern' ? 'rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200' : 'rounded-lg bg-stone-800/80 text-stone-300 hover:text-stone-100 border border-white/10 hover:border-[#c5a059]/40')
                }`}
                title={hideUnfitItems ? 'Nhấn để xem cả đồ lệch chuẩn (mờ 85%)' : 'Nhấn để ẩn hoàn toàn đồ lệch chuẩn'}
              >
                {hideUnfitItems ? (
                  <>
                    <EyeOff className={`w-3 h-3 ${currentTier === 'modern' ? 'text-white' : currentTier === 'fusion' ? 'text-black' : 'text-stone-950'}`} />
                    <span>Ẩn lệch chuẩn</span>
                  </>
                ) : (
                  <>
                    <Filter className={`w-3 h-3 ${currentTier === 'modern' ? 'text-[#8BA888]' : currentTier === 'fusion' ? 'text-[#00f3ff]' : 'text-[#c5a059]'}`} />
                    <span>Hiện mờ 85%</span>
                  </>
                )}
              </button>
            </div>

            {/* THANH TABS NGANG ĐIỀU HƯỚNG CÁC DANH MỤC (TĂNG 30% KÍCH THƯỚC + MŨI TÊN VÀNG GLOWING NHẤP NHÁY) */}
            <div className="relative group/tabs my-1">
              {/* Nút mũi tên lùi trái khi đã cuộn sang phải */}
              {canScrollTabsLeft && (
                <button
                  type="button"
                  onClick={() => handleScrollWardrobeTabs('left')}
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/95 border-2 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(255,238,0,0.85)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer animate-pulse"
                  title="Cuộn sang trái"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}

              <div
                ref={wardrobeTabsScrollRef}
                onScroll={checkWardrobeTabsScroll}
                className={`flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 ${
                  currentTier === 'modern'
                    ? 'border-b-2 border-stone-200/80 pb-3'
                    : currentTier === 'fusion'
                    ? 'border-b-2 border-white/10 pb-3'
                    : 'border-b-2 border-white/10 pb-3'
                }`}
              >
                {WARDROBE_TABS.map((tab) => {
                  const isActive = activeWardrobeTab === tab.id;
                  if (currentTier === 'fusion') {
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveWardrobeTab(tab.id);
                          playDjScratchSound();
                        }}
                        className={`px-4.5 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-[14.5px] font-black not-italic font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 rounded-xl ${
                          isActive
                            ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-2 border-[#00f3ff] shadow-[0_0_16px_rgba(0,243,255,0.35)]'
                            : 'bg-black/40 text-stone-300 border border-white/15 hover:border-white/35 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  }
                  if (currentTier === 'modern') {
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveWardrobeTab(tab.id);
                          playDanTranhTabSound();
                        }}
                        className={`px-4.5 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-[14.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 rounded-xl border-2 ${
                          isActive
                            ? 'bg-[#8BA888]/15 border-[#5C715E] text-[#1E3A1A] font-bold shadow-xs'
                            : 'bg-stone-100/70 border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveWardrobeTab(tab.id);
                        playDanTranhTabSound();
                      }}
                      className={`px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-xl text-sm sm:text-[14.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                        isActive
                          ? 'bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-bold shadow-md shadow-[#c5a059]/25 border-[#ffe89e]'
                          : 'bg-[#0f0f13] text-stone-300 hover:text-white hover:bg-[#1b1b24] border-white/10'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* MŨI TÊN TẠO BỞI GLOWING YELLOW LIGHT LINE NHẤP NHÁY LIÊN TỤC */}
              {canScrollTabsRight && (
                <button
                  type="button"
                  onClick={() => handleScrollWardrobeTabs('right')}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/95 border-2 border-[#FFEE00] animate-neon-glow-yellow hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,238,0,0.95)]"
                  title="Bấm để cuộn xem thêm danh mục tủ đồ"
                >
                  <span className="text-[11px] font-bold text-[#FFF9A6] hidden sm:inline tracking-wider uppercase font-mono">Xem thêm</span>
                  <svg className="w-4.5 h-4.5 text-[#FFEE00] drop-shadow-[0_0_10px_#FFEE00] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              )}
            </div>

            {/* ======================================================== */}
            {/* NỘI DUNG TỪNG TAB: THẺ GỌN GÀNG + TOOLTIP [i] HOVER */}
            {/* ======================================================== */}

            {/* TAB 1: ÁO NGOÀI */}
            {activeWardrobeTab === 'garment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HERITAGE_GARMENTS.map((item) => {
                    const isSelected = selectedGarmentId === item.id;
                    const isTooltipOpen = activeTooltipItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedGarmentId(item.id);
                          setSelectedColorHex(item.defaultColor);
                          // Nếu chọn Áo Nhật Bình mà đang đội Khăn Đóng Chữ Nhân, tự động chuyển sang Khăn Vành Dây chuẩn cung đình!
                          if (item.id === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')) {
                            setSelectedAccessoryIds(prev => prev.map(id => id === 'acc-khan-dong' ? 'acc-khan-vanh-day' : id));
                          }
                          playGarmentSelectSound();
                        }}
                        className={`p-3 border text-left transition-all relative cursor-pointer group flex flex-col justify-between ${
                          currentTier === 'fusion'
                            ? isSelected
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.05] hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] text-stone-200'
                            : isSelected
                            ? currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] shadow-sm ring-2 ring-[#8BA888] text-stone-900'
                              : 'rounded-xl bg-[#1b1b26] border-[#c5a059] shadow-sm ring-1 ring-[#c5a059]'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 hover:border-stone-400 text-stone-800'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] hover:border-[#383848]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-[10px] ${
                            currentTier === 'fusion'
                              ? 'font-mono font-bold text-[#00f3ff]'
                              : currentTier === 'modern'
                              ? 'font-medium font-serif text-[#5C7E5A]'
                              : 'font-medium font-serif text-[#c5a059]'
                          }`}>
                            {item.dynasty}
                          </span>
                          <div className="flex items-center gap-1">
                            {isSelected && (
                              <span className={`w-2 h-2 ${
                                currentTier === 'fusion'
                                  ? 'rounded-full bg-white ring-1 ring-white/70 shadow-[0_0_6px_rgba(255,255,255,0.75)]'
                                  : currentTier === 'modern'
                                  ? 'rounded-full bg-[#8BA888]'
                                  : 'rounded-full bg-[#c5a059]'
                              }`} />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : item.id);
                              }}
                              className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center transition-colors ${
                                currentTier === 'fusion'
                                  ? 'bg-white/10 hover:bg-[#FF007F] hover:text-white text-stone-300'
                                  : currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem ý nghĩa văn hóa"
                            >
                              i
                            </button>
                          </div>
                        </div>

                        <div className={`mt-2 text-xs line-clamp-1 ${
                          currentTier === 'fusion'
                            ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                            : currentTier === 'modern'
                            ? 'font-bold text-stone-900'
                            : 'font-bold text-[#f5f2eb]'
                        }`}>
                          {item.name}
                        </div>
                        <div className={`text-[11px] line-clamp-1 mt-0.5 ${
                          currentTier === 'fusion' ? 'text-stone-300 font-mono' : currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          {item.subName}
                        </div>

                        {/* Ảnh Đại Diện Sản Phẩm */}
                        {(() => {
                          const garmentImg = getItemImageUrl(item.id, (item as any).thumbnailUrl);
                          return garmentImg ? (
                            <div className="mt-2 w-full h-24 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center relative group/img">
                              <img 
                                src={garmentImg} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform group-hover/img:scale-105" 
                              />
                              {customItemImages[item.id] && (
                                <span className="absolute top-1 left-1 bg-emerald-500 text-stone-950 text-[8.5px] font-black px-1.5 py-0.5 rounded shadow">
                                  ĐÃ TẢI
                                </span>
                              )}
                            </div>
                          ) : null;
                        })()}

                        {/* Nút Tải ảnh trực tiếp khi CHƯA KHÓA */}
                        {!isUploadLocked && (
                          <div 
                            className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#c5a059]/20 hover:bg-[#c5a059] text-[#e5c365] hover:text-stone-950 border border-[#c5a059]/40 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="text-[9.5px] text-stone-400 hover:text-rose-400 underline cursor-pointer"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1.5 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {item.name}</span>
                              <button 
                                onClick={() => setActiveTooltipItemId(null)}
                                className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}
                              >
                                ✕
                              </button>
                            </div>
                            <p className={`leading-relaxed font-serif text-[10.5px] ${
                              currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'
                            }`}>
                              {(item as any).culturalSignificance || item.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* SCAN ẢNH AI DROPZONE */}
                <div className={`pt-3 border-t space-y-2 ${currentTier === 'modern' ? 'border-stone-200' : 'border-white/5'}`}>
                  <div className={`flex items-center justify-between text-xs ${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-400'}`}>
                    <span className={`flex items-center gap-1 font-medium ${currentTier === 'modern' ? 'text-stone-800' : 'text-stone-300'}`}>
                      <Scan className={`w-3.5 h-3.5 ${currentTier === 'modern' ? 'text-[#8BA888]' : 'text-[#c5a059]'}`} />
                      <span>Quét ảnh cá nhân (AI Multimodal):</span>
                    </span>
                    {uploadedImage && (
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setExtractedPalette(null);
                          setAiOutfitSuggestion(null);
                        }}
                        className="text-rose-500 hover:underline cursor-pointer text-[11px]"
                      >
                        Xóa
                      </button>
                    )}
                  </div>

                  <label className={`border border-dashed rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer group transition-colors ${
                    currentTier === 'modern'
                      ? 'border-stone-300 hover:border-[#8BA888] bg-stone-50'
                      : 'border-[#2f2f3d] hover:border-[#c5a059]/70 bg-[#0c0c10]'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${
                      currentTier === 'modern' ? 'text-[#8BA888]' : 'text-[#c5a059]'
                    }`} />
                    <span className={`text-[11px] ${
                      currentTier === 'modern' ? 'text-stone-600 group-hover:text-stone-900' : 'text-stone-300 group-hover:text-white'
                    }`}>
                      {uploadedImage ? 'Đã tải ảnh lên (Bấm đổi ảnh)' : 'Tải ảnh để AI trích xuất bảng màu & phom dáng'}
                    </span>
                  </label>

                  {isAnalyzingImage && (
                    <div className={`p-3 rounded-xl border space-y-2 animate-fadeIn ${
                      currentTier === 'modern' ? 'bg-sky-50 border-sky-200' : 'bg-[#0d1624] border-[#3b82f6]/40'
                    }`}>
                      <div className={`flex items-center justify-between text-xs font-semibold ${
                        currentTier === 'modern' ? 'text-sky-800' : 'text-[#38bdf8]'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          <Wand2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI đang phân tích bảng màu...</span>
                        </span>
                        <span className="font-mono">{analysisProgress}%</span>
                      </div>
                      <div className={`w-full h-1 rounded-full overflow-hidden ${
                        currentTier === 'modern' ? 'bg-sky-200' : 'bg-[#172554]'
                      }`}>
                        <div 
                          className="h-full bg-[#38bdf8] transition-all duration-75"
                          style={{ width: `${analysisProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!isAnalyzingImage && aiOutfitSuggestion && (
                    <div className={`p-3 rounded-xl border space-y-2 text-xs ${
                      currentTier === 'modern' ? 'bg-stone-50 border-stone-200' : 'bg-[#181824] border-[#c5a059]/40'
                    }`}>
                      <div className={`flex items-center justify-between font-bold ${
                        currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gợi ý từ AI Vision</span>
                        </span>
                        <button
                          onClick={handleApplyAiSuggestion}
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            currentTier === 'modern' ? 'bg-[#8BA888] text-white' : 'bg-[#c5a059] text-stone-950'
                          }`}
                        >
                          Áp dụng
                        </button>
                      </div>
                      <p className={`text-[11px] italic ${
                        currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'
                      }`}>
                        {aiOutfitSuggestion.stylistQuote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SẮC PHỤC */}
            {activeWardrobeTab === 'color' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableColors.map((col) => {
                    const isSelected = selectedColorHex === col.hex;
                    const isTooltipOpen = activeTooltipItemId === `color-${col.hex}`;
                    const colorInfo = getColorHeritageInfo(col);

                    return (
                      <div
                        key={col.hex}
                        onClick={() => {
                          setSelectedColorHex(col.hex);
                          if (col.isImperialRestricted) {
                            playTabooDenialSound();
                          } else {
                            playColorPickSound();
                          }
                        }}
                        className={`p-2.5 border text-left flex items-start gap-2.5 transition-all relative cursor-pointer ${
                          isSelected
                            ? col.isImperialRestricted
                              ? 'bg-rose-950/60 border-rose-500 shadow-md ring-1 ring-rose-500'
                              : currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] shadow-sm ring-2 ring-[#8BA888] text-stone-900'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] shadow-sm ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.05] hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] text-stone-200'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 hover:border-stone-400 text-stone-800'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] hover:border-[#383848]'
                        }`}
                      >
                        <span 
                          className={`w-5 h-5 shrink-0 border border-black/20 mt-0.5 ${
                            currentTier === 'fusion' ? 'rounded-lg border-white/20' : 'rounded-lg shadow-xs'
                          }`} 
                          style={{ backgroundColor: col.hex }} 
                        />
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs truncate flex items-center justify-between ${
                            currentTier === 'fusion'
                              ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                              : currentTier === 'modern'
                              ? 'font-semibold text-stone-900'
                              : 'font-semibold text-stone-200'
                          }`}>
                            <span className="truncate">{col.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : `color-${col.hex}`);
                              }}
                              className={`w-3.5 h-3.5 rounded-full text-[9px] font-mono flex items-center justify-center shrink-0 ml-1 ${
                                currentTier === 'fusion'
                                  ? 'bg-white/10 hover:bg-[#FF007F] hover:text-white text-stone-300'
                                  : currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem ngũ hành & giai tầng"
                            >
                              i
                            </button>
                          </div>
                          <div className={`text-[10px] font-medium mt-0.5 truncate ${
                            currentTier === 'fusion' ? 'text-[#00F0FF] font-mono' : currentTier === 'modern' ? 'text-[#5C7E5A]' : 'text-[#c5a059]'
                          }`}>
                            {col.element || 'Ngũ Hành'}
                          </div>
                          {col.isImperialRestricted && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1 rounded font-bold block mt-1">
                              ⚠️ Cấm kỵ hoàng quyền
                            </span>
                          )}
                        </div>

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {colorInfo.title} ({colorInfo.nguHanh})</span>
                              <button onClick={() => setActiveTooltipItemId(null)} className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}>✕</button>
                            </div>
                            <div className={`text-[10px] font-semibold ${currentTier === 'modern' ? 'text-[#5C7E5A]' : 'text-[#c5a059]'}`}>
                              Giai tầng: {colorInfo.giaiTang}
                            </div>
                            <p className={`font-serif text-[10.5px] leading-relaxed ${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'}`}>
                              {colorInfo.meaning}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {activeColor.isImperialRestricted && (
                  <div className="p-3 bg-rose-950/40 border border-rose-600/40 rounded-xl flex items-start gap-2 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <strong className="font-semibold text-rose-200">Cảnh báo Taboos Engine:</strong> Sắc Vàng Minh Hoàng là đặc quyền hoàng đế triều Nguyễn. Thứ dân mặc sẽ vi phạm quy chế y quan!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: KHUY CÚC */}
            {activeWardrobeTab === 'button' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {buttonOptions.map(item => {
                    const compliance = checkItemTierCompliance(item.id, currentTier);
                    const isCompliant = compliance.isCompliant;
                    if (hideUnfitItems && !isCompliant) return null;

                    const isSelected = selectedButtonId === item.id;
                    const isTaboo = item.id === 'btn-chinese-cloth' || !isCompliant;
                    const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);
                    const isTooltipOpen = activeTooltipItemId === item.id;
                    const buttonInfo = getButtonHeritageInfo(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isCompliant) {
                            playTabooDenialSound();
                            setUnfitModalItem({
                              name: item.name,
                              notice: compliance.notice || 'Cúc vải bện sườn xám là dị bản lai căng. Y quan nước Nam triều Nguyễn chỉ dùng khuy đúc rời kim loại, ngọc hoặc gỗ.',
                              tier: currentTier,
                              itemId: item.id
                            });
                          } else {
                            setSelectedButtonId(item.id);
                            playButtonClinkSound();
                          }
                        }}
                        className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          !isCompliant
                            ? 'opacity-25 grayscale-[0.6] hover:opacity-50 border-dashed border-rose-500/60 bg-[#160c0e]'
                            : isSelected
                            ? isTaboo
                              ? currentTier === 'modern'
                                ? 'bg-[#FFF8F4] border-[#D97746] text-[#8C3413] shadow-sm ring-1 ring-[#D97746]'
                                : 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500'
                              : currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] text-stone-900 ring-2 ring-[#8BA888] shadow-sm'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.05] hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] text-stone-200'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] text-stone-300 hover:border-[#383847]'
                        }`}
                      >
                        {!isCompliant && (
                          <div className="absolute -top-2 right-1.5 bg-rose-950/95 border border-rose-500/60 text-rose-300 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 z-10">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                            <span>Lệch chuẩn</span>
                          </div>
                        )}

                        <div className="w-full">
                          <div className={`aspect-square w-full overflow-hidden relative border mb-2 ${
                            currentTier === 'fusion'
                              ? 'rounded-lg border border-white/10 bg-black/60'
                              : currentTier === 'modern'
                              ? 'rounded-lg border-stone-200 bg-stone-100'
                              : 'rounded-lg border-white/10 bg-black/40'
                          }`}>
                            <img 
                              src={imgSrc} 
                              alt={item.name} 
                              onError={(e) => {
                                if (item.id === 'btn-metal-copper') e.currentTarget.src = '/1.png';
                                if (item.id === 'btn-jade-green') e.currentTarget.src = '/2.png';
                                if (item.id === 'btn-wood-agarwood') e.currentTarget.src = '/3.png';
                                if (item.id === 'btn-silver-lotus') e.currentTarget.src = '/1.png';
                                if (item.id === 'btn-mother-of-pearl') e.currentTarget.src = '/2.png';
                                if (item.id === 'btn-chinese-cloth') e.currentTarget.src = '/4.png';
                              }}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                currentTier === 'fusion' ? 'contrast-125 brightness-110 saturate-125 drop-shadow-[0_4px_10px_rgba(0,243,255,0.2)]' : ''
                              }`} 
                            />
                            {isSelected && (
                              <div className={`absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center font-bold text-[10px] shadow ${
                                currentTier === 'fusion'
                                  ? 'rounded-full bg-white text-black font-black font-mono shadow-[0_0_8px_rgba(255,255,255,0.75)]'
                                  : currentTier === 'modern'
                                  ? 'rounded-full bg-[#8BA888] text-white'
                                  : 'rounded-full bg-[#c5a059] text-stone-950'
                              }`}>
                                ✓
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`text-xs truncate flex-1 pr-1 ${
                              currentTier === 'fusion'
                                ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                                : currentTier === 'modern'
                                ? 'font-semibold text-stone-900'
                                : 'font-semibold text-[#f5f2eb]'
                            }`}>
                              {item.name}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : item.id);
                              }}
                              className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center shrink-0 ${
                                currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem ý nghĩa Ngũ Thường"
                            >
                              i
                            </button>
                          </div>
                        </div>

                        {!isUploadLocked && (
                          <div className={`mt-2 pt-1.5 border-t flex items-center justify-between ${
                            currentTier === 'modern' ? 'border-stone-200' : 'border-white/10'
                          }`} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                                currentTier === 'modern'
                                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border-[#c5a059]/40'
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="text-rose-500 hover:text-rose-700 text-[10px]"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {buttonInfo.title}</span>
                              <button onClick={() => setActiveTooltipItemId(null)} className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}>✕</button>
                            </div>
                            <div className={`text-[10px] font-semibold ${currentTier === 'modern' ? 'text-[#5C7E5A]' : 'text-[#c5a059]'}`}>{buttonInfo.nguThuong}</div>
                            <p className={`font-serif text-[10.5px] leading-relaxed ${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'}`}>{buttonInfo.moral}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isChineseButtonSelected && (
                  <div className={`p-3.5 rounded-xl space-y-2 animate-fadeIn text-xs border ${
                    currentTier === 'modern'
                      ? 'bg-[#FFF8F4] border-[#D97746] text-[#8C3413]'
                      : 'bg-[#261014] border-rose-500 text-rose-200'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold ${
                      currentTier === 'modern' ? 'text-[#C2511F]' : 'text-rose-100'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 shrink-0 ${currentTier === 'modern' ? 'text-[#D97746]' : 'text-rose-400'}`} />
                      <span>{currentTier === 'modern' ? 'NHẮC NHỞ: CÚC TÀU LAI CĂNG' : 'CẢNH BÁO: CÚC VẢI BỆN DÂY KIỂU TÀU'}</span>
                    </div>
                    <p className={`leading-relaxed text-[11px] ${
                      currentTier === 'modern' ? 'text-[#7C361A]' : 'text-rose-200/90'
                    }`}>
                      {currentTier === 'modern'
                        ? 'Cúc Tàu không nằm trong từ điển thanh lịch của y quan nhà Nguyễn đâu nha! Hãy chọn khuy rời đúc kim loại, xà cừ hoặc gỗ để giữ trọn nét tinh tế Quiet Luxury.'
                        : 'Quy chuẩn Y quan Triều Nguyễn quy định cúc áo Ngũ Thân luôn là khuy rời đúc bằng kim loại, gỗ hoặc ngọc. Tuyệt đối không dùng cúc vải bện sườn xám!'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedButtonId(currentTier === 'modern' ? 'btn-mother-of-pearl' : 'btn-metal-copper');
                        playButtonClinkSound();
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer ${
                        currentTier === 'modern'
                          ? 'bg-[#8BA888] text-white hover:bg-[#789675]'
                          : 'bg-[#c5a059] text-stone-950'
                      }`}
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>{currentTier === 'modern' ? 'Đổi sang Cúc Xà Cừ Nhã Nhặn' : 'Đổi sang Cúc Kim Loại Chuẩn Mực'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: THÂN DƯỚI */}
            {activeWardrobeTab === 'bottom' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {bottomOptions.map(item => {
                    const compliance = checkItemTierCompliance(item.id, currentTier);
                    const isCompliant = compliance.isCompliant;
                    if (hideUnfitItems && !isCompliant) return null;

                    const isSelected = selectedBottomId === item.id;
                    const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);
                    const isTooltipOpen = activeTooltipItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isCompliant) {
                            playTabooDenialSound();
                            setUnfitModalItem({
                              name: item.name,
                              notice: compliance.notice || 'Chốn tôn nghiêm yêu cầu quần lụa rộng buông rủ kín đáo, không sử dụng quần jeans hoặc váy ngắn.',
                              tier: currentTier,
                              itemId: item.id
                            });
                          } else {
                            setSelectedBottomId(item.id);
                            playFabricRustleSound();
                          }
                        }}
                        className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          !isCompliant
                            ? currentTier === 'modern'
                              ? 'opacity-35 grayscale-[0.6] hover:opacity-60 border-dashed border-rose-300 bg-rose-50/50'
                              : 'opacity-25 grayscale-[0.6] hover:opacity-50 border-dashed border-rose-500/60 bg-[#160c0e]'
                            : isSelected
                            ? currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] text-stone-900 ring-2 ring-[#8BA888] shadow-sm'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.05] hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] text-stone-200'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] text-stone-300 hover:border-[#383847]'
                        }`}
                      >
                        {!isCompliant && (
                          <div className={`absolute -top-2 right-1.5 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 z-10 ${
                            currentTier === 'modern'
                              ? 'bg-rose-100 border border-rose-300 text-rose-700'
                              : 'bg-rose-950/95 border border-rose-500/60 text-rose-300'
                          }`}>
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                            <span>Lệch chuẩn</span>
                          </div>
                        )}

                        <div className="w-full">
                          <div className={`aspect-square w-full overflow-hidden relative mb-2 ${
                            currentTier === 'fusion'
                              ? 'rounded-lg border border-white/10 bg-black/60'
                              : currentTier === 'modern'
                              ? 'rounded-lg border border-stone-200 bg-stone-100'
                              : 'rounded-lg border border-white/10 bg-black/40'
                          }`}>
                            <img 
                              src={imgSrc} 
                              alt={item.name} 
                              onError={(e) => {
                                if (item.id === 'bottom-silk-wide-pants' || item.id === 'bottom-linen-wide-pants') e.currentTarget.src = '/5.png';
                                if (item.id === 'bottom-pleated-midi-skirt') e.currentTarget.src = '/6.png';
                                if (item.id === 'bottom-high-waist-jeans') e.currentTarget.src = '/7.png';
                              }}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                currentTier === 'fusion' ? 'contrast-125 brightness-110 saturate-125 drop-shadow-[0_4px_10px_rgba(0,243,255,0.2)]' : ''
                              }`} 
                            />
                            {isSelected && (
                              <div className={`absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center font-bold text-[10px] shadow ${
                                currentTier === 'fusion'
                                  ? 'rounded-full bg-white text-black font-black font-mono shadow-[0_0_8px_rgba(255,255,255,0.75)]'
                                  : currentTier === 'modern'
                                  ? 'rounded-full bg-[#8BA888] text-white'
                                  : 'rounded-full bg-[#c5a059] text-stone-950'
                              }`}>
                                ✓
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`text-xs truncate flex-1 pr-1 ${
                              currentTier === 'fusion'
                                ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                                : currentTier === 'modern'
                                ? 'font-semibold text-stone-900'
                                : 'font-semibold text-[#f5f2eb]'
                            }`}>
                              {item.name}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : item.id);
                              }}
                              className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center shrink-0 ${
                                currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem chi tiết"
                            >
                              i
                            </button>
                          </div>
                        </div>

                        {!isUploadLocked && (
                          <div className={`mt-2 pt-1.5 border-t flex items-center justify-between ${
                            currentTier === 'modern' ? 'border-stone-200' : 'border-white/10'
                          }`} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                                currentTier === 'modern'
                                  ? 'bg-[#8BA888]/15 hover:bg-[#8BA888]/25 text-[#304E2E] border-[#8BA888]/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border-[#c5a059]/40'
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="text-rose-500 hover:text-rose-700 text-[10px]"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {item.name}</span>
                              <button onClick={() => setActiveTooltipItemId(null)} className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}>✕</button>
                            </div>
                            <p className={`${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'} font-serif text-[10.5px] leading-relaxed`}>{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: GIÀY / GUỐC */}
            {activeWardrobeTab === 'shoes' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {shoesOptions.map(item => {
                    const compliance = checkItemTierCompliance(item.id, currentTier);
                    const isCompliant = compliance.isCompliant;
                    if (hideUnfitItems && !isCompliant) return null;

                    const isSelected = selectedShoesId === item.id;
                    const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);
                    const isTooltipOpen = activeTooltipItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isCompliant) {
                            playTabooDenialSound();
                            setUnfitModalItem({
                              name: item.name,
                              notice: compliance.notice || 'Chốn tôn nghiêm yêu cầu guốc mộc truyền thống hoặc hài thêu tề chỉnh, không đi giày thể thao hầm hố hay chunky loafers.',
                              tier: currentTier,
                              itemId: item.id
                            });
                          } else {
                            setSelectedShoesId(item.id);
                            playWoodClogSound();
                          }
                        }}
                        className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          !isCompliant
                            ? currentTier === 'modern'
                              ? 'opacity-35 grayscale-[0.6] hover:opacity-60 border-dashed border-rose-300 bg-rose-50/50'
                              : currentTier === 'fusion'
                              ? 'opacity-30 grayscale-[0.7] hover:opacity-50 border border-dashed border-[#FF007F]/40 bg-[#160c0e]/60 rounded-xl'
                              : 'opacity-25 grayscale-[0.6] hover:opacity-50 border-dashed border-rose-500/60 bg-[#160c0e]'
                            : isSelected
                            ? currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] text-stone-900 ring-2 ring-[#8BA888] shadow-sm'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.04] text-white'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] text-stone-300 hover:border-[#383847]'
                        }`}
                      >
                        {!isCompliant && (
                          <div className={`absolute -top-2 right-1.5 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 z-10 ${
                            currentTier === 'modern'
                              ? 'bg-rose-100 border border-rose-300 text-rose-700'
                              : 'bg-rose-950/95 border border-rose-500/60 text-rose-300'
                          }`}>
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                            <span>Lệch chuẩn</span>
                          </div>
                        )}

                        <div className="w-full">
                          <div className={`aspect-square w-full overflow-hidden relative mb-2 ${
                            currentTier === 'fusion'
                              ? 'rounded-lg border border-white/10 bg-black/60'
                              : currentTier === 'modern'
                              ? 'rounded-lg border border-stone-200 bg-stone-100'
                              : 'rounded-lg border border-white/10 bg-black/40'
                          }`}>
                            <img 
                              src={imgSrc} 
                              alt={item.name} 
                              onError={(e) => {
                                if (item.id === 'shoes-wooden-clogs') e.currentTarget.src = '/8.png';
                                if (item.id === 'shoes-embroidered-slippers') e.currentTarget.src = '/9.png';
                                if (item.id === 'shoes-white-sneakers' || item.id === 'shoes-chunky-loafers') e.currentTarget.src = '/10.png';
                              }}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                currentTier === 'fusion' ? 'contrast-125 brightness-110 saturate-125 drop-shadow-[0_4px_10px_rgba(0,243,255,0.25)]' : ''
                              }`} 
                            />
                            {isSelected && (
                              <div className={`absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center font-bold text-[10px] shadow ${
                                currentTier === 'fusion'
                                  ? 'rounded-full bg-white text-black font-black font-mono shadow-[0_0_8px_rgba(255,255,255,0.75)]'
                                  : currentTier === 'modern'
                                  ? 'rounded-full bg-[#8BA888] text-white'
                                  : 'rounded-full bg-[#c5a059] text-stone-950'
                              }`}>
                                ✓
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`text-xs truncate flex-1 pr-1 ${
                              currentTier === 'fusion'
                                ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                                : currentTier === 'modern'
                                ? 'font-semibold text-stone-900'
                                : 'font-semibold text-[#f5f2eb]'
                            }`}>
                              {item.name}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : item.id);
                              }}
                              className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center shrink-0 ${
                                currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem chi tiết"
                            >
                              i
                            </button>
                          </div>
                        </div>

                        {!isUploadLocked && (
                          <div className={`mt-2 pt-1.5 border-t flex items-center justify-between ${
                            currentTier === 'modern' ? 'border-stone-200' : 'border-white/10'
                          }`} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                                currentTier === 'modern'
                                  ? 'bg-[#8BA888]/15 hover:bg-[#8BA888]/25 text-[#304E2E] border-[#8BA888]/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border-[#c5a059]/40'
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="text-rose-500 hover:text-rose-700 text-[10px]"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {item.name}</span>
                              <button onClick={() => setActiveTooltipItemId(null)} className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}>✕</button>
                            </div>
                            <p className={`${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'} font-serif text-[10.5px] leading-relaxed`}>{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: PHỤ KIỆN */}
            {activeWardrobeTab === 'accessory' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {accessoryOptions.map(item => {
                    const compliance = checkItemTierCompliance(item.id, currentTier, selectedGarmentId);
                    const isCompliant = compliance.isCompliant;
                    if (hideUnfitItems && !isCompliant) return null;

                    const isSelected = selectedAccessoryIds.includes(item.id);
                    const slot = getAccessorySlot(item.id);
                    const slotLabel = getAccessorySlotLabel(slot);
                    const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);
                    const isTooltipOpen = activeTooltipItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isCompliant) {
                            playTabooDenialSound();
                            setUnfitModalItem({
                              name: item.name,
                              notice: compliance.notice || 'Chốn tôn nghiêm yêu cầu khăn đóng, quạt giấy hoặc trang sức cổ phong nhã nhặn, không đeo đồng hồ thông minh hay phụ kiện kim loại phá cách.',
                              tier: currentTier,
                              itemId: item.id
                            });
                            return;
                          }

                          playFanFlutterSound();

                          // Cho phép chọn nhiều phụ kiện trên cả 3 màn hình (thay thế phụ kiện cùng slot, toggle tắt nếu bấm lại)
                          const isAlreadySelected = selectedAccessoryIds.includes(item.id);
                          if (isAlreadySelected) {
                            const nextIds = selectedAccessoryIds.filter(id => id !== item.id);
                            setSelectedAccessoryIds(nextIds);
                          } else {
                            const otherSlotIds = selectedAccessoryIds.filter(id => getAccessorySlot(id) !== slot);
                            const nextIds = [...otherSlotIds, item.id];
                            setSelectedAccessoryIds(nextIds);
                          }
                        }}
                        className={`p-2.5 border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          !isCompliant
                            ? currentTier === 'modern'
                              ? 'opacity-35 grayscale-[0.6] hover:opacity-60 border-dashed border-rose-300 bg-rose-50/50'
                              : currentTier === 'fusion'
                              ? 'opacity-30 grayscale-[0.7] hover:opacity-50 border border-dashed border-[#FF007F]/40 bg-[#160c0e]/60 rounded-xl'
                              : 'opacity-25 grayscale-[0.6] hover:opacity-50 border-dashed border-rose-500/60 bg-[#160c0e]'
                            : isSelected
                            ? currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] text-stone-900 ring-2 ring-[#8BA888] shadow-sm'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.04] text-white'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222d] text-stone-300 hover:border-[#383847]'
                        }`}
                      >
                        {!isCompliant && (
                          <div className={`absolute -top-2 right-1.5 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 z-10 ${
                            currentTier === 'modern'
                              ? 'bg-rose-100 border border-rose-300 text-rose-700'
                              : 'bg-rose-950/95 border border-rose-500/60 text-rose-300'
                          }`}>
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                            <span>Lệch chuẩn</span>
                          </div>
                        )}

                        <div className="w-full">
                          <div className={`aspect-square w-full overflow-hidden relative mb-2 ${
                            currentTier === 'fusion'
                              ? 'rounded-lg border border-white/10 bg-black/60'
                              : currentTier === 'modern'
                              ? 'rounded-lg border border-stone-200 bg-stone-100'
                              : 'rounded-lg border border-white/10 bg-black/40'
                          }`}>
                            <img 
                              src={imgSrc} 
                              alt={item.name} 
                              onError={(e) => {
                                if (item.id === 'acc-paper-fan') e.currentTarget.src = '/11.png';
                                if (item.id === 'acc-khan-dong' || item.id === 'acc-khan-vanh-day') e.currentTarget.src = '/12.png';
                                if (item.id === 'acc-jade-pendant' || item.id === 'acc-kieng-bac') e.currentTarget.src = '/13.png';
                                if (item.id === 'acc-smartwatch') e.currentTarget.src = '/14.png';
                              }}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                currentTier === 'fusion' ? 'contrast-125 brightness-110 saturate-125 drop-shadow-[0_4px_10px_rgba(0,243,255,0.25)]' : ''
                              }`} 
                            />
                            {isSelected && (
                              <div className={`absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center font-bold text-[10px] shadow ${
                                currentTier === 'fusion'
                                  ? 'rounded-full bg-white text-black font-black font-mono shadow-[0_0_8px_rgba(255,255,255,0.75)]'
                                  : currentTier === 'modern'
                                  ? 'rounded-full bg-[#8BA888] text-white'
                                  : 'rounded-full bg-[#c5a059] text-stone-950'
                              }`}>
                                ✓
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`text-xs truncate flex-1 pr-1 ${
                              currentTier === 'fusion'
                                ? 'font-black not-italic font-bold uppercase tracking-wider text-white'
                                : currentTier === 'modern'
                                ? 'font-semibold text-stone-900'
                                : 'font-semibold text-[#f5f2eb]'
                            }`}>
                              {item.name}
                            </div>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-stone-400 font-mono shrink-0 mr-1">
                              {slotLabel}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipItemId(isTooltipOpen ? null : item.id);
                              }}
                              className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center shrink-0 ${
                                currentTier === 'modern'
                                  ? 'bg-stone-200/80 hover:bg-[#8BA888] hover:text-white text-stone-600'
                                  : 'bg-white/10 hover:bg-[#c5a059] hover:text-stone-950 text-stone-400'
                              }`}
                              title="Xem chi tiết"
                            >
                              i
                            </button>
                          </div>
                        </div>

                        {!isUploadLocked && (
                          <div className={`mt-2 pt-1.5 border-t flex items-center justify-between ${
                            currentTier === 'modern' ? 'border-stone-200' : 'border-white/10'
                          }`} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                                currentTier === 'modern'
                                  ? 'bg-[#8BA888]/15 hover:bg-[#8BA888]/25 text-[#304E2E] border-[#8BA888]/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border-[#c5a059]/40'
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="text-rose-500 hover:text-rose-700 text-[10px]"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}

                        {isTooltipOpen && (
                          <div 
                            className={`absolute z-30 bottom-full left-0 right-0 mb-2 p-3 rounded-xl shadow-2xl text-[11px] space-y-1 animate-fadeIn ${
                              currentTier === 'modern'
                                ? 'bg-white border border-stone-200 text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                                : 'bg-[#1c1822] border border-[#c5a059]/60 text-stone-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className={`flex items-center justify-between font-bold ${
                              currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                            }`}>
                              <span>✦ {item.name}</span>
                              <button onClick={() => setActiveTooltipItemId(null)} className={currentTier === 'modern' ? 'text-stone-400 hover:text-stone-700' : 'text-stone-400 hover:text-white'}>✕</button>
                            </div>
                            <p className={`${currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'} font-serif text-[10.5px] leading-relaxed`}>{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 7: LỚP ÁO LÓT ĐƠN Y */}
            {activeWardrobeTab === 'layer' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {layerOptions.map(item => {
                    const compliance = checkItemTierCompliance(item.id, currentTier);
                    const isCompliant = compliance.isCompliant;
                    if (hideUnfitItems && !isCompliant) return null;
                    const isSelected = selectedLayerId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (!isCompliant) {
                            playTabooDenialSound();
                            setUnfitModalItem({
                              name: item.name,
                              notice: compliance.notice || 'Chốn tôn nghiêm yêu cầu mặc áo lót Đơn y trắng cổ đứng để đảm bảo sự đoan chính, thanh tịnh.',
                              tier: currentTier,
                              itemId: item.id
                            });
                          } else {
                            setSelectedLayerId(item.id);
                            if (!item.isCulturallyRespectful) {
                              playTabooDenialSound();
                            } else {
                              playFabricRustleSound();
                            }
                          }
                        }}
                        className={`p-4 border text-left text-xs transition-all cursor-pointer flex flex-col justify-between relative ${
                          !isCompliant
                            ? currentTier === 'modern'
                              ? 'opacity-35 grayscale-[0.6] hover:opacity-60 border-dashed border-rose-300 bg-rose-50/50'
                              : currentTier === 'fusion'
                              ? 'opacity-30 grayscale-[0.7] hover:opacity-50 border border-dashed border-[#FF007F]/40 bg-[#160c0e]/60 rounded-xl'
                              : 'opacity-25 grayscale-[0.6] hover:opacity-50 border-dashed border-rose-500/60 bg-[#160c0e]'
                            : isSelected
                            ? currentTier === 'fusion'
                              ? 'rounded-xl bg-[#141418] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.58),inset_0_0_8px_rgba(255,255,255,0.12)] ring-1 ring-white/40 text-white'
                              : currentTier === 'modern'
                              ? 'rounded-xl bg-white border-[#8BA888] text-stone-900 ring-2 ring-[#8BA888] shadow-sm'
                              : 'rounded-xl bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                            : currentTier === 'fusion'
                            ? 'rounded-xl bg-white/[0.02] border border-transparent hover:border-white/40 hover:bg-white/[0.04] text-white'
                            : currentTier === 'modern'
                            ? 'rounded-xl bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
                            : 'rounded-xl bg-[#0f0f14] border-[#22222a] text-stone-300 hover:border-[#383847]'
                        }`}
                      >
                        {!isCompliant && (
                          <div className={`absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1 z-10 ${
                            currentTier === 'modern'
                              ? 'bg-rose-100 border border-rose-300 text-rose-700'
                              : 'bg-rose-950/95 border border-rose-500/60 text-rose-300'
                          }`}>
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>⚠️ Lệch chuẩn trang phục</span>
                          </div>
                        )}
                        <div>
                          <div className={`flex items-center justify-between text-xs sm:text-sm ${
                            currentTier === 'fusion' ? 'font-black not-italic font-bold uppercase tracking-wider text-white' : currentTier === 'modern' ? 'font-bold text-stone-900' : 'font-bold text-[#f5f2eb]'
                          }`}>
                            <span>{item.name}</span>
                            {isCompliant ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${currentTier === 'fusion' ? 'text-[#39FF14]' : currentTier === 'modern' ? 'text-[#8BA888]' : 'text-emerald-400'}`} />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p className={`text-xs mt-2 leading-relaxed ${
                            currentTier === 'fusion' ? 'text-stone-300 font-mono text-[11px]' : currentTier === 'modern' ? 'text-stone-600 font-serif' : 'text-stone-400 font-serif'
                          }`}>
                            {item.description}
                          </p>
                        </div>

                        <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                          currentTier === 'fusion' ? 'border-white/15' : currentTier === 'modern' ? 'border-stone-200' : 'border-white/5'
                        }`}>
                          <span className={isCompliant ? (currentTier === 'fusion' ? 'text-[#39FF14] font-black font-mono' : currentTier === 'modern' ? 'text-[#304E2E] font-semibold' : 'text-emerald-400 font-medium') : 'text-rose-500 font-semibold'}>
                            {isCompliant ? (currentTier === 'fusion' ? '✓ PHÁ CÁCH THEO GU' : currentTier === 'modern' ? '✓ Chuẩn chỉn chu thanh lịch' : '✓ Chuẩn cốt cách cổ nhân') : '⚠️ Lệch chuẩn (Nhấn xem giải thích)'}
                          </span>
                          <span className={`${currentTier === 'fusion' ? 'text-[#00F0FF] font-mono' : currentTier === 'modern' ? 'text-stone-500' : 'text-stone-500'} italic text-[10px]`}>
                            {currentTier === 'fusion' ? 'Subculture Vibe' : 'Cổ đứng cao hơn 2mm'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ======================================================== */}
        {/* CỘT PHẢI (60% - lg:col-span-7): THỊ GIÁC CANVAS & BẢNG ĐIỂM AI (CỐ ĐỊNH TẦM MẮT) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1 custom-scrollbar">
          
          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Button: Triết lý 5 thân */}
              <button
                type="button"
                onClick={() => setIsHotspotDrawerOpen(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  currentTier === 'modern'
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                    : currentTier === 'fusion'
                    ? 'bg-[#181822] hover:bg-[#20202e] text-[#00f3ff] border-white/10'
                    : 'bg-[#181822] hover:bg-[#222230] text-[#e5c365] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                }`}
                title="Khám phá cấu tạo 5 thân, cúc Ngũ Thường và ý nghĩa văn hóa trực tiếp trong Studio"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>ℹ️ Triết Lý 5 Thân & Y Quan</span>
              </button>

              {/* Button: Tìm tiệm thuê outfit này */}
              {onFindRentalForOutfit && (
                <button
                  type="button"
                  onClick={() => onFindRentalForOutfit({
                    tier: currentTier,
                    garmentId: selectedGarmentId,
                    garmentName: activeGarment.name,
                    hasSneakers: selectedShoesId === 'shoes-white-sneakers' || selectedShoesId === 'shoes-platform-mary-jane',
                    styleTitle: selectedStyleVibe
                  })}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-[#0d0d10] hover:brightness-110 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Chuyển sang Bản Đồ và tự động lọc tiệm phù hợp với bộ đồ này"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Tìm Tiệm Thuê 📍</span>
                </button>
              )}
            </div>

            {/* Slay Boost status badge */}
            {hasSlayBoost && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-[#faedd0] border border-amber-500/40 shadow-xs animate-pulse">
                <span>👑</span>
                <span>+10% Trạng Nguyên Buff Kích Hoạt</span>
              </div>
            )}
          </div>

          {/* 1. KHUNG CANVAS MOODBOARD 2D (BÚP BÊ XẾP LỚP TUẦN TỰ) */}
          <OutfitMoodboardCanvas
            activeGarment={activeGarment}
            activeColor={activeColor}
            selectedColorHex={selectedColorHex}
            activeButtonItem={{
              ...activeButtonItem,
              thumbnailUrl: getItemImageUrl(activeButtonItem.id, activeButtonItem.thumbnailUrl),
              canvas2dUrl: getItemCanvas2dUrl(activeButtonItem.id, activeButtonItem.canvas2dUrl || activeButtonItem.thumbnailUrl)
            }}
            activeBottomItem={{
              ...activeBottomItem,
              thumbnailUrl: getItemImageUrl(activeBottomItem.id, activeBottomItem.thumbnailUrl),
              canvas2dUrl: getItemCanvas2dUrl(activeBottomItem.id, activeBottomItem.canvas2dUrl || activeBottomItem.thumbnailUrl)
            }}
            activeShoesItem={{
              ...activeShoesItem,
              thumbnailUrl: getItemImageUrl(activeShoesItem.id, activeShoesItem.thumbnailUrl),
              canvas2dUrl: getItemCanvas2dUrl(activeShoesItem.id, activeShoesItem.canvas2dUrl || activeShoesItem.thumbnailUrl)
            }}
            activeAccessoryItem={{
              ...activeAccessoryItem,
              thumbnailUrl: getItemImageUrl(activeAccessoryItem.id, activeAccessoryItem.thumbnailUrl),
              canvas2dUrl: getItemCanvas2dUrl(activeAccessoryItem.id, activeAccessoryItem.canvas2dUrl || activeAccessoryItem.thumbnailUrl)
            }}
            activeAccessoryItems={activeAccessoryItems.map(item => ({
              ...item,
              thumbnailUrl: getItemImageUrl(item.id, item.thumbnailUrl),
              canvas2dUrl: getItemCanvas2dUrl(item.id, item.canvas2dUrl || item.thumbnailUrl)
            }))}
            hasDonY={selectedLayerId === 'layer-don-y-white'}
            uploadedImage={uploadedImage}
            isChineseButtonSelected={isChineseButtonSelected}
            isImperialYellowSelected={isImperialYellowSelected}
            isTabooClashSelected={isTabooClashSelected}
            isNhatBinhWithKhanDongSelected={selectedGarmentId === 'ao-nhat-binh' && selectedAccessoryIds.includes('acc-khan-dong')}
            isLayeringActive={isLayeringActive}
            layeringStep={layeringStep}
            currentTier={currentTier}
          />

          {/* ======================================================== */}
          {/* 2. BẢNG ĐÁNH GIÁ "SLAY & CHUẨN CỔ PHONG" - NẰM NGAY DƯỚI CANVAS */}
          {/* ======================================================== */}
          <div className={`p-4 sm:p-5 border transition-all duration-500 relative overflow-hidden backdrop-blur-xl ${
            currentTier === 'fusion'
              ? 'font-streetwear rounded-none bg-[#121212]/95 border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.06)] text-white cyber-grid-pattern'
              : currentTier === 'modern'
              ? 'rounded-2xl bg-white/85 border-stone-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.06)] text-stone-800'
              : effectiveMetrics.scenario === 'taboo'
              ? 'rounded-2xl bg-gradient-to-br from-[#2a0e14]/95 via-[#19080c]/95 to-[#120508]/95 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] animate-pulse'
              : effectiveMetrics.scenario === 'anachronism'
              ? 'rounded-2xl bg-gradient-to-br from-[#2a1b0a]/95 via-[#1a1106]/95 to-[#120c04]/95 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
              : effectiveMetrics.scenario === 'heritage'
              ? 'rounded-2xl bg-gradient-to-br from-[#12231b]/95 via-[#0e171f]/95 to-[#1c170e]/95 border-[#e5c365] shadow-[0_0_35px_rgba(229,195,101,0.25)]'
              : 'rounded-2xl bg-gradient-to-br from-[#1e1028]/95 via-[#130d1d]/95 to-[#0e0c16]/95 border-purple-500/70 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
          }`}>
            {currentTier === 'fusion' && (
              <div className="absolute top-2 right-3 font-mono text-[9px] text-[#00f3ff] tracking-widest flex items-center gap-1.5 opacity-90 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-ping" />
                <span>CIRCUIT-03 // AI VIBE CHECK</span>
              </div>
            )}

            <div className="relative z-10 space-y-4">
              
              {/* GATEKEEPER ALERT: MÀN HÌNH 3 - TEM CẢNH BÁO FUSION GATEKEEPER TINH TẾ */}
              {currentTier === 'fusion' && (
                <div className="relative p-2.5 sm:p-3 bg-white/[0.02] border border-white/10 shadow-[0_0_20px_rgba(255,0,127,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div 
                      className="px-2.5 py-1 border border-dashed border-[#FF007F] text-[#FF007F] font-black italic text-xs tracking-widest uppercase bg-black/80 shadow-[0_0_10px_rgba(255,0,127,0.3)] animate-stamp-slam shrink-0"
                      style={{ transform: 'rotate(-6deg)' }}
                    >
                      ★ FUSION · LẤY CẢM HỨNG ★
                    </div>
                    <div className="text-xs">
                      <div className="text-[10px] font-mono font-bold text-[#00f3ff] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-ping" />
                        <span>AI GATEKEEPER BADGE · DIỆN ĐƯỜNG PHỐ CÓ Ý THỨC</span>
                      </div>
                      <div className="text-[11px] text-stone-300 font-medium mt-0.5">
                        Đóng mộc xác nhận: Phong cách phá cách lấy cảm hứng từ cổ phục Việt
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono px-2 py-0.5 bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/40 uppercase font-bold shrink-0 self-end sm:self-auto">
                    🚫 CẤM CỬA Ở ĐỀN CHÙA
                  </div>
                </div>
              )}

              {/* GATEKEEPER ALERT: VIỀN CAM ĐẤT (TERRACOTTA) KHI CHỌN CÚC TÀU TRONG MÀN 2 */}
              {currentTier === 'modern' && isChineseButtonSelected && (
                <div className="p-3.5 rounded-xl border border-[#D97746] bg-[#FFF8F4] text-[#8C3413] shadow-sm flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-lg shrink-0">🪴</span>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C2511F] uppercase tracking-wide text-[11px] flex items-center gap-1">
                        <span>Nhắc Nhở Nhã Nhặn (Quiet Reminder)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedButtonId('btn-mother-of-pearl');
                          playButtonClinkSound();
                        }}
                        className="text-[11px] font-bold text-[#C2511F] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Đổi sang Cúc Xà Cừ ➜
                      </button>
                    </div>
                    <p className="mt-1 leading-relaxed text-[#7C361A] font-serif">
                      "Cúc Tàu không nằm trong từ điển thanh lịch của y quan nhà Nguyễn đâu nha! Hãy chọn khuy rời đúc xà cừ, gỗ trầm hoặc kim loại để giữ trọn nét tinh tế Quiet Luxury."
                    </p>
                  </div>
                </div>
              )}

              {/* BADGE TIÊU ĐỀ & NÚT KHẮC PHỤC 1 CHẠM */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 ${
                currentTier === 'fusion'
                  ? 'border-b border-white/10'
                  : currentTier === 'modern'
                  ? 'border-b border-stone-200/80'
                  : 'border-b border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                    currentTier === 'fusion'
                      ? 'rounded-none bg-[#00f3ff] text-black font-black uppercase text-xs shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                      : currentTier === 'modern'
                      ? isChineseButtonSelected
                        ? 'rounded-full bg-[#D97746]/15 text-[#9C3810] border border-[#D97746]/30'
                        : 'rounded-full bg-[#8BA888]/20 text-[#304E2E] border border-[#8BA888]/40'
                      : effectiveMetrics.scenario === 'taboo'
                      ? 'rounded-full bg-rose-600 text-white animate-bounce'
                      : effectiveMetrics.scenario === 'anachronism'
                      ? 'rounded-full bg-amber-500 text-stone-950 font-black'
                      : effectiveMetrics.scenario === 'heritage'
                      ? 'rounded-full bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-black'
                      : 'rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  }`}>
                    {currentTier === 'fusion' ? (
                      <Zap className="w-3.5 h-3.5 text-black" />
                    ) : currentTier === 'modern' ? (
                      isChineseButtonSelected ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D97746]" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#5C7E5A]" />
                      )
                    ) : (
                      <>
                        {effectiveMetrics.scenario === 'taboo' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {effectiveMetrics.scenario === 'anachronism' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {effectiveMetrics.scenario === 'heritage' && <Sparkles className="w-3.5 h-3.5" />}
                        {effectiveMetrics.scenario === 'modern_polite' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </>
                    )}
                    <span>{effectiveMetrics.badgeTitle}</span>
                  </span>
                  <span className={`text-[10px] font-mono hidden sm:inline ${
                    currentTier === 'fusion' ? 'text-[#00f3ff] font-bold' : currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                  }`}>
                    · {currentTier === 'fusion' ? 'Sub-Bass Circuit Check' : currentTier === 'modern' ? 'Editorial Evaluation' : 'Realtime AI Evaluation'}
                  </span>
                </div>

                {effectiveMetrics.canAutoFix && (
                  <button
                    type="button"
                    onClick={handleAutoFixTaboos}
                    className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow transition-all self-start sm:self-auto ${
                      currentTier === 'modern'
                        ? 'bg-[#8BA888] hover:bg-[#789675] text-white'
                        : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0d0d10]'
                    }`}
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Khắc Phục Chuẩn Mực (1 Chạm)</span>
                  </button>
                )}
              </div>



              {/* Alert nếu lỗi kết nối */}
              {geminiError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                  <span>⚠️ {geminiError}</span>
                  {onOpenGeminiModal && (
                    <button
                      type="button"
                      onClick={onOpenGeminiModal}
                      className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-bold text-[11px] underline cursor-pointer shrink-0"
                    >
                      Cài Đặt API Key
                    </button>
                  )}
                </div>
              )}

              {/* HAI THANH ĐIỂM SỐ TIẾN TRÌNH (SLAY & DI SẢN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. SLAY SCORE */}
                <div className={`p-3 space-y-1.5 transition-all ${
                  currentTier === 'fusion'
                    ? 'rounded-none bg-white/[0.02] border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.04)]'
                    : currentTier === 'modern'
                    ? 'rounded-xl bg-stone-50/90 border-stone-200/80 border'
                    : 'rounded-xl bg-black/40 border-white/10 border'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs uppercase tracking-wider font-bold flex items-center gap-1 ${
                        currentTier === 'fusion' ? 'text-[#00f3ff] font-black italic' : currentTier === 'modern' ? 'text-[#4A6448]' : 'text-pink-400'
                      }`}>
                        <span>{currentTier === 'fusion' ? '⚡ SLAY SCORE (BÙNG NỔ)' : currentTier === 'modern' ? '💅 Slay & Chic' : '💅 Slay Score'}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-semibold ${
                          currentTier === 'fusion'
                            ? 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/40 font-black rounded-none'
                            : currentTier === 'modern'
                            ? 'rounded bg-[#8BA888]/20 text-[#304E2E]'
                            : 'rounded bg-pink-500/20 text-pink-300'
                        }`}>
                          {currentTier === 'fusion' ? 'MAX 100%' : currentTier === 'modern' ? 'Acubi' : 'Gen Z'}
                        </span>
                      </span>
                      <div className={`text-[10px] ${
                        currentTier === 'fusion' ? 'text-stone-400 font-mono' : currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>
                        {currentTier === 'fusion' ? 'Càng phá cách điểm càng vọt lên' : currentTier === 'modern' ? 'Độ thanh lịch & hài hòa' : 'Độ bắt mắt & phối sắc'}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl sm:text-3xl font-black font-mono ${
                        currentTier === 'fusion'
                          ? effectiveMetrics.slayScore >= 95
                            ? 'text-[#FF007F] drop-shadow-[0_0_12px_rgba(255,0,127,0.7)] animate-pulse'
                            : 'text-[#00f3ff]'
                          : currentTier === 'modern'
                          ? 'text-[#3E5B3C]'
                          : 'text-pink-400'
                      }`}>
                        {effectiveMetrics.slayScore}%
                      </span>
                      {currentTier === 'fusion' && <span className="text-sm">🔥</span>}
                    </div>
                  </div>
                  <div className={`w-full overflow-hidden p-0.5 border ${
                    currentTier === 'fusion'
                      ? 'h-2 rounded-none bg-black/80 border border-white/10'
                      : currentTier === 'modern'
                      ? 'h-2 rounded-full bg-stone-200/80 border-stone-200'
                      : 'h-2 rounded-full bg-black/60 border-white/10'
                  }`}>
                    <div
                      className={`h-full transition-all duration-700 ${
                        currentTier === 'fusion'
                          ? effectiveMetrics.slayScore >= 95
                            ? 'rounded-none bg-gradient-to-r from-[#00f3ff] via-[#39ff14] to-[#FF007F] shadow-[0_0_15px_#FF007F] animate-pulse'
                            : 'rounded-none bg-gradient-to-r from-[#00f3ff] to-[#39ff14] shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                          : currentTier === 'modern'
                          ? 'rounded-full bg-gradient-to-r from-[#8BA888] to-[#CBD5E1]'
                          : 'rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                      }`}
                      style={{ width: `${effectiveMetrics.slayScore}%` }}
                    />
                  </div>
                  {currentTier === 'fusion' && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-0.5">
                      <span>TRẦM LẮNG 0%</span>
                      <span className="text-[#39ff14] font-bold">NEON SPARK OVERDRIVE ⚡</span>
                      <span>BÙNG NỔ 100%</span>
                    </div>
                  )}
                </div>

                {/* 2. ĐỘ CHUẨN DI SẢN / TINH THẦN FUSION */}
                <div className={`p-3 space-y-1.5 transition-all ${
                  currentTier === 'fusion'
                    ? 'rounded-none bg-white/[0.02] border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.04)]'
                    : currentTier === 'modern'
                    ? 'rounded-xl bg-stone-50/90 border-stone-200/80 border'
                    : 'rounded-xl bg-black/40 border-white/10 border'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs uppercase tracking-wider font-bold flex items-center gap-1 ${
                        currentTier === 'fusion' ? 'text-[#39ff14] font-black italic' : currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#e5c365]'
                      }`}>
                        <span>{currentTier === 'fusion' ? '⚡ TINH THẦN FUSION' : currentTier === 'modern' ? '🌿 Tinh Thần Di Sản' : '👑 Chuẩn Di Sản'}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-semibold ${
                          currentTier === 'fusion'
                            ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/40 font-black rounded-none'
                            : currentTier === 'modern'
                            ? 'rounded bg-[#8BA888]/20 text-[#304E2E]'
                            : 'rounded bg-[#c5a059]/20 text-[#e5c365]'
                        }`}>
                          {currentTier === 'fusion' ? 'Streetwear' : currentTier === 'modern' ? 'Acubi' : 'Triều Nguyễn'}
                        </span>
                      </span>
                      <div className={`text-[10px] ${
                        currentTier === 'fusion' ? 'text-stone-400 font-mono' : currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>
                        {currentTier === 'fusion' ? 'Ý thức nguồn cội & bối cảnh diện' : 'Đơn Y, khuy cúc, phụ kiện'}
                      </div>
                    </div>
                    <span className={`text-2xl font-black font-mono ${
                      currentTier === 'fusion'
                        ? 'text-[#39ff14]'
                        : currentTier === 'modern'
                        ? 'text-[#3E5B3C]'
                        : effectiveMetrics.heritageScore >= 90 ? 'text-[#e5c365]' :
                          effectiveMetrics.heritageScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {effectiveMetrics.heritageScore}%
                    </span>
                  </div>
                  <div className={`w-full overflow-hidden p-0.5 border ${
                    currentTier === 'fusion'
                      ? 'h-2 rounded-none bg-black/80 border border-white/10'
                      : currentTier === 'modern'
                      ? 'h-2 rounded-full bg-stone-200/80 border-stone-200'
                      : 'h-2 rounded-full bg-black/60 border-white/10'
                  }`}>
                    <div
                      className={`h-full transition-all duration-700 ${
                        currentTier === 'fusion'
                          ? 'rounded-none bg-gradient-to-r from-[#00f3ff] to-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                          : currentTier === 'modern'
                          ? 'rounded-full bg-gradient-to-r from-[#8BA888] to-[#587355]'
                          : effectiveMetrics.heritageScore >= 90
                          ? 'rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_10px_rgba(229,195,101,0.5)]'
                          : effectiveMetrics.heritageScore >= 70
                          ? 'rounded-full bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'rounded-full bg-gradient-to-r from-rose-600 to-red-500'
                      }`}
                      style={{ width: `${effectiveMetrics.heritageScore}%` }}
                    />
                  </div>
                  {currentTier === 'fusion' && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-0.5">
                      <span>LẤY CẢM HỨNG TỪ NGUỒN CỘI</span>
                      <span className="text-[#00f3ff]">DẠO PHỐ / CONCERT</span>
                    </div>
                  )}
                </div>

              </div>

              {/* NÚT THU GỌN / XEM CHI TIẾT THẨM ĐỊNH (GIÚP KHÔNG BỊ DÀY CHỮ - YÊU CẦU 3 CỦA GIANG) */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsEvaluationDetailsOpen(!isEvaluationDetailsOpen)}
                  className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                    currentTier === 'fusion'
                      ? 'rounded-none bg-black/75 hover:bg-[#00f3ff]/10 border-white/20 text-[#00f3ff] hover:border-[#00f3ff] font-mono'
                      : currentTier === 'modern'
                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-[#2C4A28] hover:border-[#8BA888]'
                      : 'bg-[#18141f] hover:bg-[#231b2e] border-[#c5a059]/30 text-[#faedd0] hover:border-[#c5a059]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${
                      currentTier === 'fusion' ? 'text-[#00f3ff]' : currentTier === 'modern' ? 'text-[#8BA888]' : 'text-[#e5c365]'
                    }`} />
                    <span className="font-bold text-xs sm:text-sm">
                      {isEvaluationDetailsOpen
                        ? 'Thu Gọn Lời Bình & Điển Chế Di Sản'
                        : 'Xem Chi Tiết Lời Bình AI Stylist & Điển Chế Di Sản'}
                    </span>
                    {!isEvaluationDetailsOpen && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold hidden sm:inline ${
                        currentTier === 'fusion'
                          ? 'bg-[#00f3ff]/15 text-[#00f3ff] border border-[#00f3ff]/30'
                          : currentTier === 'modern'
                          ? 'bg-[#8BA888]/20 text-[#304E2E]'
                          : 'bg-[#c5a059]/20 text-[#e5c365]'
                      }`}>
                        Nhấn để mở
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[11px] opacity-75 font-sans">
                      {isEvaluationDetailsOpen ? 'Thu gọn' : 'Xem chi tiết'}
                    </span>
                    {isEvaluationDetailsOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>

              {/* KHỐI NỘI DUNG CHI TIẾT (ẨN MẶC ĐỊNH, CHỈ HIỆN KHI USER NHẤN XEM ĐỂ KHÔNG BỊ DÀY CHỮ) */}
              {isEvaluationDetailsOpen && (
                <div className="space-y-3 animate-fadeIn">
                  {/* LỜI BÌNH AI STYLIST */}
                  <div className={`p-3.5 sm:p-4 border flex items-start gap-3.5 ${
                    geminiResult
                      ? 'rounded-xl bg-gradient-to-r from-[#241910] via-[#1a1215] to-[#121c18] border-[#e5c365]/50 shadow-[0_0_20px_rgba(229,195,101,0.18)] text-white'
                      : currentTier === 'fusion'
                      ? 'rounded-none bg-white/[0.02] border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.04)] text-white'
                      : currentTier === 'modern'
                      ? 'rounded-xl bg-stone-50/90 border-stone-200/80 text-stone-800'
                      : 'rounded-xl bg-black/55 border-white/10 text-stone-100'
                  }`}>
                    <div className={`w-10 h-10 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border ${
                      geminiResult
                        ? 'rounded-xl bg-gradient-to-br from-[#faedd0] via-[#e5c365] to-[#c5a059] text-stone-950 border-[#f5e6c8] shadow-md'
                        : currentTier === 'fusion'
                        ? 'rounded-none bg-[#00f3ff] text-black border border-white/20 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                        : currentTier === 'modern'
                        ? 'rounded-xl bg-[#8BA888] text-white border-white/40'
                        : 'rounded-xl bg-gradient-to-br from-[#c5a059] to-rose-500 text-stone-950 border-white/20'
                    }`}>
                      {geminiResult ? '🧠 ✦' : currentTier === 'fusion' ? 'DJ ⚡' : 'AI 💅'}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-black uppercase tracking-wider ${
                            geminiResult
                              ? 'text-[#faedd0] font-serif font-bold text-xs'
                              : currentTier === 'fusion' ? 'text-[#00f3ff] italic' : currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                          }`}>
                            {geminiResult 
                              ? '✦ HỘI ĐỒNG GIÁM TUYỂN DI SẢN · HERITSTYLE VERDICT'
                              : currentTier === 'fusion' ? 'AI DJ STYLIST // VIBE CHECK VERDICT' : currentTier === 'modern' ? 'AI Stylist Thanh Lịch (Editorial Lookbook)' : 'AI Stylist Cổ Phục Viễn Đông'}
                          </span>
                          {geminiResult ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Live Custom Gem
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-sans font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              Engine Nội Tại
                            </span>
                          )}
                        </div>

                        {/* NÚT KÍCH HOẠT THẨM ĐỊNH CUSTOM GEM TRỰC TIẾP */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTriggerGeminiEvaluation();
                          }}
                          disabled={isEvaluatingGemini}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50 border ${
                            currentTier === 'fusion'
                              ? 'bg-[#00f3ff]/15 hover:bg-[#00f3ff]/30 text-[#00f3ff] border-[#00f3ff]/40'
                              : currentTier === 'modern'
                              ? 'bg-[#8BA888]/20 hover:bg-[#8BA888]/35 text-[#3E5B3C] border-[#8BA888]/50'
                              : 'bg-[#e5c365]/20 hover:bg-[#e5c365]/35 text-[#faedd0] border-[#e5c365]/40 hover:border-[#e5c365]'
                          }`}
                          title="Gửi dữ liệu trực tiếp sang Google AI Studio để Stylist Custom Gem thẩm định độc bản"
                        >
                          {isEvaluatingGemini ? (
                            <>
                              <Sparkles className="w-3 h-3 animate-spin text-[#e5c365]" />
                              <span>Đang thẩm định...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-[#e5c365]" />
                              <span>{geminiResult ? 'Làm mới nhận xét AI 🧠' : 'Thẩm định Custom Gem 🧠'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {geminiError && (
                        <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-200 flex items-center justify-between gap-2">
                          <span>⚠️ {geminiError} (Đang dùng Engine nội tại)</span>
                          <button
                            type="button"
                            onClick={handleTriggerGeminiEvaluation}
                            className="underline font-bold text-red-300 hover:text-white"
                          >
                            Thử lại
                          </button>
                        </div>
                      )}

                      <p className={`leading-relaxed text-sm ${
                        geminiResult
                          ? 'font-medium font-serif text-[#faedd0] italic'
                          : currentTier === 'fusion' ? 'font-medium italic text-white' : currentTier === 'modern' ? 'font-semibold italic font-serif text-stone-800' : 'font-semibold italic font-serif text-stone-100'
                      }`}>
                        {effectiveMetrics.stylistQuote}
                      </p>
                      <p className={`text-[11px] leading-relaxed ${
                        geminiResult
                          ? 'text-[#faedd0]/80 font-sans'
                          : currentTier === 'fusion' ? 'text-stone-300 font-mono' : currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300/90'
                      }`}>
                        {effectiveMetrics.subAdvice}
                      </p>
                    </div>
                  </div>

                  {/* CHI TIẾT NGŨ THƯỜNG & NGŨ HÀNH GIAI TẦNG */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className={`p-2.5 border flex items-start gap-2 ${
                      currentTier === 'fusion'
                        ? 'rounded-none bg-white/[0.015] border border-white/10 opacity-70 hover:opacity-100 transition-opacity text-stone-300'
                        : currentTier === 'modern'
                        ? 'rounded-xl bg-stone-50/80 border-stone-200/80'
                        : 'rounded-xl bg-white/[0.03] border-[#c5a059]/20'
                    }`}>
                      <span className="text-sm shrink-0">🔘</span>
                      <div className="min-w-0">
                        <span className={`font-bold block uppercase text-[9px] tracking-wider ${
                          currentTier === 'fusion' ? 'text-[#00f3ff] font-mono' : currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#e5c365]'
                        }`}>
                          Đạo Ngũ Thường (Khuy Cúc)
                        </span>
                        <span className={`leading-snug block mt-0.5 text-[10px] ${
                          currentTier === 'fusion' ? 'text-stone-400 font-mono' : currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'
                        }`}>
                          {effectiveMetrics.nguThuongAnalysis}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2.5 border flex items-start gap-2 ${
                      currentTier === 'fusion'
                        ? 'rounded-none bg-white/[0.015] border border-white/10 opacity-70 hover:opacity-100 transition-opacity text-stone-300'
                        : currentTier === 'modern'
                        ? 'rounded-xl bg-stone-50/80 border-stone-200/80'
                        : 'rounded-xl bg-white/[0.03] border-[#c5a059]/20'
                    }`}>
                      <span className="text-sm shrink-0">🎨</span>
                      <div className="min-w-0">
                        <span className={`font-bold block uppercase text-[9px] tracking-wider ${
                          currentTier === 'fusion' ? 'text-[#39ff14] font-mono' : currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#e5c365]'
                        }`}>
                          Ngũ Hành & Giai Tầng (Sắc Phục)
                        </span>
                        <span className={`leading-snug block mt-0.5 text-[10px] ${
                          currentTier === 'fusion' ? 'text-stone-400 font-mono' : currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'
                        }`}>
                          {effectiveMetrics.nguHanhAnalysis}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NÚT TẠO OUTFIT REMIX / XUẤT TẠP CHÍ LOOKBOOK */}
              <button
                onClick={() => {
                  if (currentTier === 'fusion') {
                    playDjScratchSound();
                    play808BassDropSound();
                  } else {
                    playDanTranhTabSound();
                  }
                  generateRemixOutfit();
                }}
                disabled={isGenerating || isEvaluatingGemini}
                className={`w-full py-4 px-4 font-black tracking-wide transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:scale-[0.99] border ${
                  currentTier === 'fusion'
                    ? 'rounded-none bg-[#00f3ff] hover:bg-[#39ff14] text-black not-italic font-bold uppercase text-sm sm:text-base tracking-wider shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:shadow-[0_0_30px_rgba(57,255,20,0.45)] border border-transparent'
                    : currentTier === 'modern'
                    ? 'rounded-xl font-serif text-sm sm:text-base bg-gradient-to-r from-[#8BA888] via-[#759472] to-[#8BA888] hover:brightness-105 text-white shadow-[0_8px_25px_rgba(139,168,136,0.35)] border-white/40'
                    : 'rounded-xl font-serif text-sm sm:text-base bg-gradient-to-r from-[#c5a059] via-[#e5c365] to-[#c5a059] hover:brightness-110 text-stone-950 shadow-[0_8px_25px_rgba(212,175,55,0.35)] border-[#fff5db]/50'
                }`}
              >
                {isGenerating || isEvaluatingGemini ? (
                  <>
                    <Wand2 className={`w-5 h-5 animate-spin ${currentTier === 'fusion' ? 'text-black' : currentTier === 'modern' ? 'text-white' : 'text-stone-950'}`} />
                    <span>{isEvaluatingGemini ? 'Đang Thẩm Định Cùng Stylist Custom Gem...' : currentTier === 'fusion' ? 'Đang Xử Lý Mixset Fusion Lookbook...' : currentTier === 'heritage' ? 'Đang Biên Tập Ấn Phẩm Tạp Chí Cung Đình...' : 'Đang Khâm Định Y Quan & Thẩm Duyệt Chi Tiết...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className={`w-5 h-5 ${currentTier === 'fusion' ? 'text-black' : currentTier === 'modern' ? 'text-white' : 'text-stone-950'}`} />
                    <span>{currentTier === 'fusion' ? 'PHỐI MIXSET & XUẤT LOOKBOOK FUSION ⚡' : currentTier === 'heritage' ? 'Tạo Bản Phối Thanh Lịch & Xuất Tạp Chí' : 'Tạo Outfit Remix & Thẩm Định Chi Tiết'}</span>
                  </>
                )}
              </button>

              {/* Secondary action: Tìm tiệm thuê outfit này trực tiếp */}
              {onFindRentalForOutfit && (
                <button
                  type="button"
                  onClick={() => onFindRentalForOutfit({
                    tier: currentTier,
                    garmentId: selectedGarmentId,
                    garmentName: activeGarment.name,
                    hasSneakers: selectedShoesId === 'shoes-white-sneakers' || selectedShoesId === 'shoes-platform-mary-jane',
                    styleTitle: selectedStyleVibe
                  })}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    currentTier === 'modern'
                      ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                      : currentTier === 'fusion'
                      ? 'bg-[#181824] hover:bg-[#222232] text-stone-100 border-white/10'
                      : 'bg-[#181822] hover:bg-[#232332] text-[#e5c365] border-[#c5a059]/30 hover:border-[#c5a059]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>📍 Tìm Tiệm Thuê & May Đo Cho Outfit Này</span>
                </button>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Hidden file input for manual item image upload */}
      <input
        type="file"
        ref={itemFileInputRef}
        onChange={handleItemImageUploadChange}
        accept="image/*"
        className="hidden"
      />

      {/* Full Modal for Custom Image Management */}
      <CustomImageManagerModal
        isOpen={isCustomImageModalOpen}
        onClose={() => setIsCustomImageModalOpen(false)}
        customImages={customItemImages}
        onUpdateImage={async (itemId, dataUrl) => {
          const updated = { ...customItemImages, [itemId]: dataUrl };
          setCustomItemImages(updated);
          await saveCustomImages(updated);
        }}
        onResetImage={handleResetItemImage}
        onResetAll={async () => {
          const fresh = await resetCustomImages();
          setCustomItemImages(fresh);
        }}
        isLocked={isUploadLocked}
        onToggleLock={toggleUploadLock}
      />

      {/* ======================================================== */}
      {/* 3. POP-UP TOÀN MÀN HÌNH: "HỒ SƠ Y PHỤC / TẠP CHÍ LOOKBOOK" (REWARDING) */}
      {/* ======================================================== */}
      {isLookbookModalOpen && remixResult && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-xl flex min-h-full items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLookbookModalOpen(false);
          }}
        >
          <div className={`${
            currentTier === 'fusion'
              ? 'font-streetwear bg-[#0c0c10] border border-white/10 shadow-[0_0_50px_rgba(0,243,255,0.12)] rounded-none max-w-4xl w-full px-5 py-4 sm:px-7 sm:py-5 text-white cyber-grid-pattern'
              : currentTier === 'modern'
              ? 'bg-[#FAF8F5] border border-stone-300 ring-1 ring-stone-200/80 rounded-3xl max-w-4xl w-full px-5 py-4 sm:px-7 sm:py-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] text-stone-900'
              : 'bg-[#141017] border-2 border-[#D4AF37] ring-1 ring-[#e5c365]/40 rounded-3xl max-w-4xl w-full px-5 py-4 sm:px-7 sm:py-5 shadow-[0_0_70px_rgba(212,175,55,0.4)] text-[#f5f2eb]'
          } relative overflow-hidden text-left my-auto max-h-[88vh] flex flex-col min-h-0`}>
            
            {/* Texture nền chìm */}
            <div 
              className={`absolute inset-0 pointer-events-none ${
                currentTier === 'fusion' ? 'opacity-20 mix-blend-screen' : currentTier === 'modern' ? 'opacity-35 mix-blend-multiply' : 'opacity-25 mix-blend-overlay'
              }`}
              style={{
                backgroundImage: currentTier === 'fusion'
                  ? `linear-gradient(to right, rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,0,127,0.1) 1px, transparent 1px)`
                  : currentTier === 'modern'
                  ? `radial-gradient(#8BA888 0.6px, transparent 0.6px), radial-gradient(#d6d3cb 0.6px, #FAF8F5 0.6px)`
                  : `radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#C5A059 0.75px, #120f14 0.75px)`,
                backgroundSize: currentTier === 'fusion' ? '30px 30px' : '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Nút Đóng Modal ở góc trên */}
            <button
              onClick={() => setIsLookbookModalOpen(false)}
              className={`absolute top-4 right-4 p-2 transition-colors cursor-pointer z-30 ${
                currentTier === 'fusion'
                  ? 'rounded-none bg-black border border-white/20 hover:border-[#00F0FF] text-white hover:text-[#00F0FF]'
                  : currentTier === 'modern'
                  ? 'rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 hover:text-stone-900'
                  : 'rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white'
              }`}
              title="Đóng hồ sơ"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal (Pinned Top) */}
            <div className={`relative z-10 text-center pb-3 shrink-0 pr-8 sm:pr-0 ${
              currentTier === 'fusion'
                ? 'border-b border-white/10'
                : currentTier === 'modern' ? 'border-b border-stone-200' : 'border-b border-[#D4AF37]/30'
            }`}>
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-semibold tracking-widest uppercase mb-1 ${
                currentTier === 'fusion'
                  ? 'rounded-none bg-[#00f3ff] text-black font-black font-mono'
                  : currentTier === 'modern'
                  ? 'rounded-full bg-stone-100 border border-stone-300 text-stone-700'
                  : 'rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#f5e6c8]'
              }`}>
                {currentTier === 'fusion' ? (
                  <Zap className="w-3.5 h-3.5 text-black" />
                ) : currentTier === 'modern' ? (
                  <Sparkles className="w-3.5 h-3.5 text-[#8BA888]" />
                ) : (
                  <Crown className="w-3.5 h-3.5 text-[#e5c365]" />
                )}
                <span>
                  {currentTier === 'fusion'
                    ? '✦ FUSION STREETWEAR · THE DJ DECK LOOKBOOK ✦'
                    : currentTier === 'modern'
                    ? '✦ HERITSTYLE EDITORIAL · THANH LỊCH ĐỜI THƯỜNG ✦'
                    : '✦ CHIẾU DỤ KHÂM ĐỊNH Y QUAN TRIỀU NGUYỄN ✦'}
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl ${
                currentTier === 'fusion'
                  ? 'font-black italic uppercase tracking-wider text-white'
                  : currentTier === 'modern'
                  ? 'font-serif font-black text-stone-900 tracking-tight'
                  : 'font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#faedd0] via-[#e5c365] to-[#c5a059] drop-shadow'
              }`}>
                {currentTier === 'fusion' ? 'Ấn Phẩm Phố Thị Phá Cách & Mixset Lookbook' : currentTier === 'modern' ? 'Ấn Phẩm Lookbook & Bản Phối Thanh Lịch' : 'Hồ Sơ Y Phục & Lookbook Di Sản'}
              </h2>
              <p className={`text-xs mt-0.5 ${
                currentTier === 'fusion' ? 'text-stone-400 font-mono' : currentTier === 'modern' ? 'font-serif italic text-stone-600' : 'font-serif italic text-stone-300/90'
              }`}>
                {currentTier === 'fusion'
                  ? `Mixset ${remixResult.styleVibe} · Giao thoa Cổ phục & Văn hóa Đường phố`
                  : currentTier === 'modern'
                  ? `Phong cách ${remixResult.styleVibe} · Tinh thần Quiet Luxury & Cốt cách Cổ truyền`
                  : `Đã thẩm duyệt quy chế y quan · Phong thái ${remixResult.styleVibe}`}
              </p>
            </div>

            {/* Scrollable Content Body */}
            <div className="relative z-10 overflow-y-auto min-h-0 space-y-6 flex-1 pr-1 sm:pr-2.5 py-3">

              {/* MÀN HÌNH 3: RUBBER STAMP BẢN PHỐI FUSION TRONG MODAL */}
              {currentTier === 'fusion' && (
                <div className="p-3 bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="px-2.5 py-1 border border-dashed border-[#FF007F] text-[#FF007F] font-black italic text-xs tracking-widest uppercase bg-black/80 shadow-[0_0_10px_rgba(255,0,127,0.3)] animate-stamp-slam shrink-0"
                      style={{ transform: 'rotate(-6deg)' }}
                    >
                      ★ FUSION · LẤY CẢM HỨNG ★
                    </div>
                    <div className="text-[11px] font-mono text-[#00f3ff]">
                      ĐƯỜNG PHỐ · DẠO PHỐ ĐÊM · CONCERT QUẨY SÁNG ĐÊM
                    </div>
                  </div>
                  <div className="text-[9px] font-mono px-2 py-0.5 bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/40 font-bold">
                    🚫 CẤM CỬA Ở ĐỀN CHÙA
                  </div>
                </div>
              )}

              {/* TABOOS WARNING BANNER NẾU CÓ VI PHẠM */}
              {remixResult.taboosTriggered.length > 0 && (
                <div className={`p-4 rounded-2xl space-y-3 ${
                  currentTier === 'modern'
                    ? 'bg-[#FFF8F4] border border-[#D97746]/80 text-[#8C3413]'
                    : 'bg-[#231215] border border-rose-500/50'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        currentTier === 'modern'
                          ? 'bg-[#D97746]/15 text-[#D97746] border border-[#D97746]/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${
                          currentTier === 'modern' ? 'text-[#8C3413]' : 'text-rose-200'
                        }`}>
                          {currentTier === 'modern' ? 'Nhắc Nhở Tinh Chỉnh' : 'Cảnh Báo Lệch Chuẩn Y Quan'} ({remixResult.taboosTriggered.length} điểm lưu ý)
                        </h4>
                        <p className={`text-xs ${
                          currentTier === 'modern' ? 'text-[#A84A22]' : 'text-rose-300/80'
                        }`}>
                          {currentTier === 'modern'
                            ? (remixResult.taboosTriggered.some(t => t.ruleCode === 'NO_CHINESE_BUTTON')
                                ? 'Cúc Tàu không nằm trong từ điển thanh lịch của y quan nhà Nguyễn đâu nha!'
                                : 'Trang phục cần tinh chỉnh nhẹ để đạt trọn vẹn điểm thanh lịch.')
                            : 'Trang phục chưa chuẩn quy thức cung đình, cần khắc phục.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleAutoFixTaboos();
                        setIsLookbookModalOpen(false);
                      }}
                      className={`px-3.5 py-1.5 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                        currentTier === 'modern'
                          ? 'bg-[#8BA888] hover:bg-[#789675] text-white shadow-sm'
                          : 'bg-[#c5a059] hover:bg-[#d8b566] text-[#0d0d10]'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{currentTier === 'modern' ? 'Tinh Chỉnh Tự Động (1 Chạm)' : 'Sửa Lỗi Tự Động (1 Chạm)'}</span>
                    </button>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 ${
                    currentTier === 'modern' ? 'border-t border-[#D97746]/20' : 'border-t border-rose-500/20'
                  }`}>
                    {remixResult.taboosTriggered.map(taboo => (
                      <div key={taboo.id} className={`p-2.5 rounded-xl space-y-1 text-xs ${
                        currentTier === 'modern'
                          ? 'bg-white/70 border border-[#D97746]/30'
                          : 'bg-black/40 border border-rose-500/30'
                      }`}>
                        <div className={`flex items-center justify-between font-bold ${
                          currentTier === 'modern' ? 'text-[#8C3413]' : 'text-rose-200'
                        }`}>
                          <span>{taboo.title}</span>
                          <span className={currentTier === 'modern' ? 'text-[#C2511F]' : 'text-rose-400'}>-{taboo.penaltyScore}đ</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          currentTier === 'modern' ? 'text-[#7C361A]' : 'text-stone-300'
                        }`}>{taboo.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GRID TỔNG QUAN: SCORE CIRCLE + BẢNG MÀU + LỜI BÌNH STYLIST */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Score Gauge & Metrics (4 Cols) */}
                <div className={`md:col-span-5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 border ${
                  currentTier === 'modern'
                    ? 'bg-white border-stone-200/90 shadow-xs'
                    : 'bg-black/40 border-white/10'
                }`}>
                  <div>
                    <div className={`text-xs uppercase tracking-wider font-semibold ${
                      currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      {currentTier === 'modern' ? 'Điểm Đánh Giá Thanh Lịch' : 'Tổng Điểm Thẩm Định'}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className={`w-20 h-20 rounded-2xl font-black font-mono text-3xl flex items-center justify-center shadow-lg border ${
                        currentTier === 'modern'
                          ? 'bg-gradient-to-br from-[#8BA888] to-[#587355] text-white border-white/40'
                          : 'bg-gradient-to-br from-[#c5a059] to-[#e5c365] text-stone-950 border-white/20'
                      }`}>
                        {remixResult.matchScore}
                      </div>
                      <div>
                        <div className={`font-serif font-bold text-base ${
                          currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                        }`}>
                          {remixResult.matchScore >= 85
                            ? (currentTier === 'modern' ? 'Xuất Sắc Thanh Lịch (Editorial)' : 'Xuất Sắc Chuẩn Cổ Phong')
                            : remixResult.matchScore >= 70 ? 'Khá Ổn Cần Tinh Chỉnh' : 'Lệch Chuẩn Điển Lễ'}
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          {remixResult.taboosTriggered.length === 0 ? '✓ Chuẩn 100% Triều Nguyễn' : '⚠️ Có điểm cần lưu ý'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className={`flex justify-between mb-1 text-[11px] ${
                        currentTier === 'modern' ? 'text-stone-700' : 'text-stone-300'
                      }`}>
                        <span>{currentTier === 'modern' ? 'Tinh Thần Di Sản Y Quan' : 'Chuẩn Quy Chế Triều Nguyễn'}</span>
                        <span className={`font-bold ${currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#c5a059]'}`}>
                          {remixResult.scoreBreakdown.yQuanStandard}%
                        </span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                        currentTier === 'modern' ? 'bg-stone-200' : 'bg-[#22222e]'
                      }`}>
                        <div 
                          className={`h-full rounded-full ${currentTier === 'modern' ? 'bg-[#8BA888]' : 'bg-[#c5a059]'}`} 
                          style={{ width: `${remixResult.scoreBreakdown.yQuanStandard}%` }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className={`flex justify-between mb-1 text-[11px] ${
                        currentTier === 'modern' ? 'text-stone-700' : 'text-stone-300'
                      }`}>
                        <span>{currentTier === 'modern' ? 'Độ Thời Thượng & Chic' : 'Độ Slay & Phong Cách Gen Z'}</span>
                        <span className={`font-bold ${currentTier === 'modern' ? 'text-[#4A6448]' : 'text-pink-400'}`}>
                          {remixResult.scoreBreakdown.genZFashion}%
                        </span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                        currentTier === 'modern' ? 'bg-stone-200' : 'bg-[#22222e]'
                      }`}>
                        <div 
                          className={`h-full rounded-full ${currentTier === 'modern' ? 'bg-[#6E8F6C]' : 'bg-pink-500'}`} 
                          style={{ width: `${remixResult.scoreBreakdown.genZFashion}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bảng Màu Phối Hợp */}
                  <div className={`pt-2 ${currentTier === 'modern' ? 'border-t border-stone-200' : 'border-t border-white/10'}`}>
                    <span className={`text-[10px] uppercase font-semibold block mb-1.5 ${
                      currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      Bảng Màu Phối Sắc:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {remixResult.paletteItems.map(p => (
                        <div key={p.name} className={`p-1 rounded-lg border flex items-center gap-1.5 ${
                          currentTier === 'modern' ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-white/5 border-white/5 text-stone-200'
                        }`}>
                          <span className="w-3 h-3 rounded shrink-0 border border-black/10" style={{ backgroundColor: p.hex }} />
                          <div className="min-w-0">
                            <div className="text-[10px] truncate">{p.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stylist Feedback (7 Cols) */}
                <div className={`md:col-span-7 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 border ${
                  currentTier === 'modern'
                    ? 'bg-white border-stone-200/90 shadow-xs'
                    : 'bg-black/40 border-white/10'
                }`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center ${
                          currentTier === 'modern' ? 'bg-[#8BA888] text-white' : 'bg-[#c5a059] text-stone-950'
                        }`}>
                          AI
                        </div>
                        <span className={`font-bold text-xs ${
                          currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                        }`}>
                          {currentTier === 'modern' ? 'Lời Bình Ban Biên Tập Thời Trang' : 'Lời Bình Stylist Cổ Phục Viễn Đông'}
                        </span>
                      </div>
                      {remixResult.geminiVerdict?.modelUsed && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border shadow-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>☁️ {remixResult.geminiVerdict.modelUsed}</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-xs sm:text-sm leading-relaxed font-serif p-3.5 rounded-xl border italic ${
                      currentTier === 'modern'
                        ? 'bg-stone-50 border-stone-200 text-stone-800'
                        : 'bg-white/[0.02] border-white/5 text-stone-200'
                    }`}>
                      “{remixResult.stylistFeedback}”
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    currentTier === 'modern'
                      ? 'bg-[#F4F6F2] border-[#8BA888]/30 text-stone-800'
                      : 'bg-[#1c1822] border-[#c5a059]/30 text-[#faedd0]'
                  }`}>
                    <div className={`font-bold flex items-center justify-between gap-1.5 ${
                      currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#e5c365]'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Scroll className="w-3.5 h-3.5" />
                        <span>{remixResult.geminiVerdict?.verdictTitle ? `[THẺ NHÃN]: ${remixResult.geminiVerdict.verdictTitle}` : (currentTier === 'modern' ? 'Cốt Cách Thanh Lịch Đời Thường:' : 'Cốt Cách Y Quan Đại Nam:')}</span>
                      </div>
                      {remixResult.geminiVerdict?.isTaboo && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          RED ALERT
                        </span>
                      )}
                    </div>
                    {remixResult.geminiVerdict?.culturalCritique ? (
                      <p className={`text-[11px] leading-relaxed font-sans ${
                        currentTier === 'modern' ? 'text-stone-700' : 'text-stone-200'
                      }`}>
                        {remixResult.geminiVerdict.culturalCritique}
                      </p>
                    ) : (
                      <p className={`text-[11px] font-serif leading-relaxed ${
                        currentTier === 'modern' ? 'text-stone-600' : 'text-stone-300'
                      }`}>
                        {currentTier === 'modern'
                          ? 'Giữ trọn cổ Đơn y đoan chính, khuy rời đúc tinh xảo đại diện Ngũ Thường, phom dáng nhẹ nhàng phối sắc Earth-tone tối giản chuẩn phong cách Quiet Luxury.'
                          : 'Lớp trong đoan chính với áo lót Đơn y trắng cổ cao, khuy cúc rời đúc đĩnh đạc tượng trưng Ngũ Thường, sắc phục hòa hợp ngũ hành tôn ti trật tự.'}
                      </p>
                    )}
                    {remixResult.geminiVerdict?.actionableAdvice && (
                      <div className={`text-[10.5px] pt-1.5 border-t ${
                        currentTier === 'modern' ? 'border-stone-200 text-[#3E5B3C]' : 'border-white/10 text-[#e5c365]'
                      }`}>
                        ✦ Gợi ý: {remixResult.geminiVerdict.actionableAdvice}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* CHI TIẾT 6 CẤU KIỆN Y QUAN */}
              <div className="space-y-2.5">
                <div className={`text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  currentTier === 'modern' ? 'text-[#3E5B3C]' : 'text-[#D4AF37]'
                }`}>
                  <Sparkles className={`w-3.5 h-3.5 ${currentTier === 'modern' ? 'text-[#8BA888]' : 'text-[#e5c365]'}`} />
                  <span>Danh Mục Cấu Kiện Diện Mạo Chi Tiết:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Item 1: Áo Cổ Phục */}
                  <div className={`p-2.5 rounded-xl border space-y-1 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <span className={`text-[9.5px] uppercase font-bold ${
                      currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#c5a059]'
                    }`}>1. Áo Cổ Phục Chính</span>
                    <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                      {remixResult.garment.name}
                    </div>
                    <p className={`text-[10.5px] line-clamp-1 ${
                      currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                    }`}>{remixResult.garment.subName}</p>
                  </div>

                  {/* Item 2: Đơn Y */}
                  <div className={`p-2.5 rounded-xl border space-y-1 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <span className={`text-[9.5px] uppercase font-bold ${
                      currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                    }`}>2. Áo Lót Đơn Y</span>
                    <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                      {remixResult.selectedItems.layer.name}
                    </div>
                    <p className="text-[10.5px] text-emerald-600 font-medium line-clamp-1">✓ Cổ cao hơn 2mm</p>
                  </div>

                  {/* Item 3: Khuy Cúc */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.button.id, remixResult.selectedItems.button.thumbnailUrl)}
                      alt={remixResult.selectedItems.button.name}
                      className="w-9 h-9 rounded-lg object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className={`text-[9.5px] uppercase font-bold block ${
                        currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>3. Khuy Cúc</span>
                      <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                        {remixResult.selectedItems.button.name}
                      </div>
                    </div>
                  </div>

                  {/* Item 4: Thân Dưới */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.bottom.id, remixResult.selectedItems.bottom.thumbnailUrl)}
                      alt={remixResult.selectedItems.bottom.name}
                      className="w-9 h-9 rounded-lg object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className={`text-[9.5px] uppercase font-bold block ${
                        currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>4. Thân Dưới</span>
                      <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                        {remixResult.selectedItems.bottom.name}
                      </div>
                    </div>
                  </div>

                  {/* Item 5: Giày */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.shoes.id, remixResult.selectedItems.shoes.thumbnailUrl)}
                      alt={remixResult.selectedItems.shoes.name}
                      className="w-9 h-9 rounded-lg object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className={`text-[9.5px] uppercase font-bold block ${
                        currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>5. Giày / Guốc</span>
                      <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                        {remixResult.selectedItems.shoes.name}
                      </div>
                    </div>
                  </div>

                  {/* Item 6: Phụ Kiện */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    currentTier === 'modern' ? 'bg-white border-stone-200 shadow-xs' : 'bg-black/40 border-white/10'
                  }`}>
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.accessory.id, remixResult.selectedItems.accessory.thumbnailUrl)}
                      alt={remixResult.selectedItems.accessory.name}
                      className="w-9 h-9 rounded-lg object-cover border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className={`text-[9.5px] uppercase font-bold block ${
                        currentTier === 'modern' ? 'text-stone-500' : 'text-stone-400'
                      }`}>6. Phụ Kiện</span>
                      <div className={`font-bold truncate ${currentTier === 'modern' ? 'text-stone-900' : 'text-[#f5f2eb]'}`}>
                        {remixResult.selectedItems.accessory.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS CỦA MODAL (Pinned Bottom) */}
            <div className="relative z-10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 border-t border-white/10">
              <button
                type="button"
                onClick={handleShareLookbook}
                className={`w-full sm:w-auto px-5 py-2.5 text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  currentTier === 'fusion'
                    ? 'rounded-none bg-black/60 hover:bg-black/90 text-white border-white/10 hover:border-[#00f3ff] font-mono'
                    : currentTier === 'modern'
                    ? 'rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    : 'rounded-xl bg-[#1f1b24] hover:bg-[#2a2432] text-stone-200 border-[#c5a059]/40'
                }`}
              >
                <Share2 className={`w-3.5 h-3.5 ${currentTier === 'fusion' ? 'text-[#00f3ff]' : currentTier === 'modern' ? 'text-[#4A6448]' : 'text-[#e5c365]'}`} />
                <span>{copiedLookbook ? '✓ Đã sao chép link lookbook!' : (currentTier === 'fusion' ? 'Chia Sẻ Mixset Lookbook' : currentTier === 'modern' ? 'Chia sẻ Bìa Tạp Chí' : 'Chia sẻ Lookbook Y Quan')}</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                {onFindRentalForOutfit && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLookbookModalOpen(false);
                      onFindRentalForOutfit({
                        tier: currentTier,
                        garmentId: selectedGarmentId,
                        garmentName: activeGarment.name,
                        hasSneakers: selectedShoesId === 'shoes-white-sneakers' || selectedShoesId === 'shoes-platform-mary-jane',
                        styleTitle: selectedStyleVibe
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-[#0d0d10] hover:brightness-110 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Tìm Tiệm Thuê Outfit Này 📍</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsLookbookModalOpen(false)}
                  className={`w-full sm:w-auto px-6 py-2.5 font-bold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer ${
                    currentTier === 'fusion'
                      ? 'rounded-none bg-[#00f3ff] hover:bg-[#39ff14] text-black font-black uppercase not-italic font-bold shadow-[0_0_20px_rgba(0,243,255,0.35)]'
                      : currentTier === 'modern'
                      ? 'rounded-xl bg-gradient-to-r from-[#8BA888] to-[#6E8F6C] text-white'
                      : 'rounded-xl bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950'
                  }`}
                >
                  {currentTier === 'fusion' ? 'XÁC NHẬN MIXSET · TRỞ LẠI STUDIO ⚡' : currentTier === 'modern' ? 'Đã Khảo Duyệt · Trở Lại Studio' : 'Đã Khảo Xét · Trở Lại Studio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL GIÁO DỤC VĂN HÓA & GIẢI THÍCH KHI BẤM ĐỒ LỆCH CHUẨN */}
      {/* ======================================================== */}
      {unfitModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141217] border-2 border-[#D4AF37]/60 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.25)] relative overflow-hidden text-left">
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#C5A059 0.75px, #141217 0.75px)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}
            />

            <button
              onClick={() => setUnfitModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Ranh Giới Văn Hóa · Chốn Tôn Nghiêm</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#faedd0]">
                {unfitModalItem.name}
              </h3>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs font-semibold">
                <span>⚠️ Lệch chuẩn trang phục trong không gian Heritage Core</span>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Giải Thích Quy Chế Điển Lễ:</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif">
                  {unfitModalItem.notice}
                </p>
              </div>

              <p className="mt-3 text-[11px] text-stone-400 italic leading-relaxed">
                ✦ Ghi chú: Chốn Tôn Nghiêm ưu tiên 100% sự thanh tịnh, tôn kính và mực thước y quan. Món đồ này đã bị khóa chọn để bảo toàn cấu trúc di sản. Bạn có thể tự do sáng tạo món đồ này ở bối cảnh <strong>"Thanh Lịch Đời Thường"</strong> hoặc <strong>"Đô Thị Phá Cách"</strong>.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setUnfitModalItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-bold text-xs hover:brightness-110 shadow transition-all cursor-pointer"
                >
                  Đã hiểu quy chuẩn y quan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SLIDE-OVER DRAWER: TRIẾT LÝ 5 THÂN & Y QUAN HOÀNG TRIỀU */}
      {/* ======================================================== */}
      <HeritageHotspotDrawer
        isOpen={isHotspotDrawerOpen}
        onClose={() => setIsHotspotDrawerOpen(false)}
        currentGarmentId={selectedGarmentId}
        currentTier={currentTier}
      />

    </div>
  );
};
