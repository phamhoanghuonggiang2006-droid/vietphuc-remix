import React, { useState, useRef, useEffect } from 'react';
import { 
  HERITAGE_GARMENTS, 
  TRADITIONAL_COLORS, 
  REMIX_ITEMS, 
  CULTURAL_TABOOS,
  HeritageItem,
  ColorOption,
  ModernRemixItem,
  TabooRule,
  LINK_ANH_CUC_KIM_LOAI,
  LINK_ANH_CUC_NGOC,
  LINK_ANH_CUC_GO,
  LINK_ANH_CUC_VAI,
  LINK_ANH_QUAN_LUA,
  LINK_ANH_QUAN_LINEN,
  LINK_ANH_VAY_XEP_LY,
  LINK_ANH_QUAN_JEANS,
  LINK_ANH_GUOC_MOC,
  LINK_ANH_HAI_THEU,
  LINK_ANH_SNEAKERS,
  LINK_ANH_CHUNKY_LOAFERS,
  LINK_ANH_QUAT_GIAY,
  LINK_ANH_KHAN_DONG,
  LINK_ANH_KHAN_VANH_DAY,
  LINK_ANH_BOI_NGOC,
  LINK_ANH_KIENG_BAC,
  LINK_ANH_DONG_HO
} from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
import { OutfitMoodboardCanvas } from './OutfitMoodboardCanvas';
import { CustomImageManagerModal } from './CustomImageManagerModal';
import {
  playDanTranhTabSound,
  playButtonClinkSound,
  playFanFlutterSound,
  playGarmentSelectSound,
  playFabricRustleSound,
  playWoodClogSound,
  playColorPickSound,
  playTabooDenialSound
} from '../utils/soundEffects';
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
  Layers, 
  Eye, 
  Flame,
  Zap,
  ShieldAlert,
  Image as ImageIcon 
} from 'lucide-react';

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
}

export interface DualMetricEvaluation {
  slayScore: number;
  heritageScore: number;
  scenario: 'taboo' | 'anachronism' | 'heritage' | 'modern_polite';
  badgeTitle: string;
  stylistQuote: string;
  subAdvice: string;
  nguThuongAnalysis: string;
  nguHanhAnalysis: string;
  isTaboo: boolean;
  isAnachronism: boolean;
  canAutoFix: boolean;
}

// Danh sách các sản phẩm mới có tính năng tải ảnh thủ công theo yêu cầu
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
  // Mặc định Cúc Đồng Đúc Bát Bửu
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
  accessoryId: string,
  contextId: string = 'heritage'
): DualMetricEvaluation => {
  const hasDonY = layerId === 'layer-don-y-white';
  const isChineseButton = buttonId === 'btn-chinese-cloth';
  const isImperialYellow = !!color.isImperialRestricted;
  
  // Áo lễ gồm Áo Tấc, Nhật Bình, Viên Lĩnh
  const isCeremonialRobe = garment.id === 'ao-tac' || garment.id === 'ao-nhat-binh' || garment.id === 'ao-vien-linh';
  
  // Cấm kỵ triều đình: Cúc vải Tàu hoặc Vàng Minh Hoàng
  const isTabooAlert = isChineseButton || isImperialYellow;
  
  // Lỗi lạc quẻ (Anachronism): Phối áo lễ với Sneakers hoặc Đồng hồ thông minh
  const isAnachronism = (isCeremonialRobe && (shoesId === 'shoes-white-sneakers' || accessoryId === 'acc-smartwatch')) ||
                        (!isCeremonialRobe && accessoryId === 'acc-smartwatch');

  // Lấy chi tiết Ngũ Thường và Ngũ Hành
  const buttonInfo = getButtonHeritageInfo(buttonId);
  const colorInfo = getColorHeritageInfo(color);

  const nguThuongAnalysis = `${buttonInfo.title} [${buttonInfo.nguThuong}]: ${buttonInfo.moral}`;
  const nguHanhAnalysis = `${colorInfo.title} [${colorInfo.nguHanh} - ${colorInfo.giaiTang}]: ${colorInfo.meaning}`;

  // 1. TÍNH ĐỘ CHUẨN DI SẢN (HERITAGE SCORE %)
  let heritage = 100;
  if (!hasDonY) heritage -= 25;
  if (isChineseButton) heritage -= 35;
  if (isImperialYellow) heritage -= 40;
  if (isCeremonialRobe && shoesId === 'shoes-white-sneakers') heritage -= 20;
  if (accessoryId === 'acc-smartwatch') heritage -= 15;
  if (isCeremonialRobe && shoesId === 'shoes-chunky-loafers') heritage -= 8;
  if (isCeremonialRobe && bottomId === 'bottom-high-waist-jeans') heritage -= 10;
  if (!isCeremonialRobe && bottomId === 'bottom-high-waist-jeans') heritage -= 3;

  // Hiệu chỉnh theo bối cảnh tỏa sáng đã chọn
  if (contextId === 'heritage') {
    // Chốn Tôn Nghiêm (Đền chùa, Di tích, Lễ nghi): khắt khe hơn với trang phục phá cách
    if (shoesId === 'shoes-white-sneakers' || bottomId === 'bottom-high-waist-jeans' || accessoryId === 'acc-smartwatch') {
      heritage = Math.max(15, heritage - 10);
    }
  }

  heritage = Math.max(15, Math.min(100, heritage));

  // 2. TÍNH SLAY SCORE (%)
  let slay = 78;
  // Tone màu hài hòa
  if (color.hex === '#2B5B84' || color.hex === '#7A222C' || color.hex === '#334D3C' || color.hex === '#5E3A58') {
    slay += 10;
  } else if (color.hex === '#F2EAD8' || color.hex === '#4A3525') {
    slay += 8;
  }
  // Cúc áo thẩm mỹ & triết lý
  if (buttonId === 'btn-silver-lotus' || buttonId === 'btn-mother-of-pearl') {
    slay += 10;
  } else if (buttonId === 'btn-jade-green' || buttonId === 'btn-metal-copper' || buttonId === 'btn-wood-agarwood') {
    slay += 7;
  }
  // Thân dưới cá tính & duyên dáng
  if (bottomId === 'bottom-pleated-midi-skirt' || bottomId === 'bottom-silk-wide-pants' || bottomId === 'bottom-linen-wide-pants') {
    slay += 8;
  } else if (bottomId === 'bottom-high-waist-jeans') {
    slay += (contextId === 'fusion' ? 10 : 7);
  }
  // Giày & phụ kiện
  if (shoesId === 'shoes-wooden-clogs' || shoesId === 'shoes-embroidered-slippers') {
    slay += (contextId === 'heritage' ? 9 : 6);
  } else if (shoesId === 'shoes-chunky-loafers') {
    slay += (contextId === 'fusion' ? 10 : 8);
  }
  if (accessoryId === 'acc-khan-dong' || accessoryId === 'acc-khan-vanh-day' || accessoryId === 'acc-kieng-bac') {
    slay += 6;
  } else if (accessoryId === 'acc-paper-fan' || accessoryId === 'acc-jade-pendant') {
    slay += 5;
  }

  // Nếu vi phạm cấm kỵ thì bị trừ Slay nhẹ
  if (isTabooAlert) slay -= 16;
  if (isAnachronism) slay -= 8;
  slay = Math.max(45, Math.min(99, slay));

  // 3. PHÂN ĐỊNH 4 KỊCH BẢN VÀ LỜI BÌNH AI STYLIST GEN Z (THEO BỐI CẢNH TỎA SÁNG)
  // KỊCH BẢN 1: CẢNH BÁO CẤM KỴ (TABOO ALERT)
  if (isTabooAlert) {
    const quote = isChineseButton 
      ? (contextId === 'heritage'
          ? `“Cảnh báo Chốn Tôn Nghiêm: Đi đền chùa, lễ nghi mà dùng cúc vải Tàu là phạm húy nghiêm trọng! Đổi sang Cúc Bạc Hoa Sen hoặc Cúc Đồng Đúc Bát Bửu cho chuẩn mực nhé!”`
          : `“Cảnh báo hú hồn: ${buttonInfo.genzQuote} Cụ Nguồn gật đầu khen cá tính nhưng Triều Đình hơi rén nhé! Đổi sang Cúc Bạc Hoa Sen hoặc Cúc Đồng Đúc Bát Bửu cho chuẩn gu nào!”`)
      : `“Ủa alo bạn hiền! Sắc ${colorInfo.title} (${colorInfo.nguHanh}) là đại cấm kỵ hoàng triều: ${colorInfo.genzQuote} Đổi ngay sang Xanh Thanh Thiên hay Tím Chính Sắc cho vừa slay vừa an toàn nào!”`;

    const advice = isChineseButton 
      ? `Quy chuẩn Y quan nước Nam luôn là khuy rời đúc kim loại/gỗ/ngọc (đại diện Ngũ Thường Nhân-Nghĩa-Lễ-Trí-Tín), tuyệt đối cấm cúc vải bện kiểu Tàu lai căng!` 
      : `Sắc Vàng Minh Hoàng là đặc quyền tối thượng của bậc Thiên Tử Triều Nguyễn. Thứ dân mặc sẽ vi phạm quy chế y quan triều đình!`;

    return {
      slayScore: slay,
      heritageScore: heritage,
      scenario: 'taboo',
      badgeTitle: 'Cảnh Báo Cấm Kỵ (Taboo Alert)',
      stylistQuote: quote,
      subAdvice: advice,
      nguThuongAnalysis,
      nguHanhAnalysis,
      isTaboo: true,
      isAnachronism: false,
      canAutoFix: true
    };
  }

  // KỊCH BẢN 2: LỖI LẠC QUẺ (ANACHRONISM)
  if (isAnachronism) {
    const anachQuote = contextId === 'heritage'
      ? `“Ủa alo bạn hiền! Chốn Tôn Nghiêm đền chùa lễ hội cần sự tề chỉnh tuyệt đối, áo lễ ${garment.name} mà đi cùng Sneakers hay Smartwatch trông hơi cấn cấn đó! Đổi sang Guốc Mộc hoặc Hài Thêu để vừa thanh tịnh vừa trọn vẹn điểm chuẩn mực nhé!”`
      : `“Ủa alo bạn hiền! Áo lễ ${garment.name} phối cùng ${buttonInfo.title} và sắc ${colorInfo.title} (${colorInfo.nguHanh}) đang rất đỉnh chóp, mà 'cưỡi' đôi Sneakers quẹt Smartwatch trông hơi cấn cấn đó nha! Đổi sang Guốc Mộc hoặc Hài Thêu Cung Đình để vừa chuẩn di sản vừa slay hết nấc nào!”`;

    return {
      slayScore: slay,
      heritageScore: heritage,
      scenario: 'anachronism',
      badgeTitle: 'Lỗi Lạc Quẻ (Anachronism)',
      stylistQuote: anachQuote,
      subAdvice: `${garment.name} là lễ phục trang trọng, sự kết hợp với giày thể thao hoặc đồng hồ thông minh tạo ra sự cọc cạch thị giác đối với y quan truyền thống.`,
      nguThuongAnalysis,
      nguHanhAnalysis,
      isTaboo: false,
      isAnachronism: true,
      canAutoFix: true
    };
  }

  // KỊCH BẢN 3: CHUẨN CỔ PHONG (MATCH > 90%)
  if (heritage >= 90) {
    const heritageQuote = contextId === 'heritage'
      ? `“Tuyệt phẩm Chốn Tôn Nghiêm! Bộ này diện đến đền chùa hay lễ hội truyền thống là chuẩn mực 10/10, đoan trang thanh tịnh, tôn vinh đạo Ngũ Thường (${buttonInfo.nguThuong}) và sắc ${colorInfo.title} vương giả!”`
      : contextId === 'fusion'
      ? `“Outfit Phố Thị Phá Cách đỉnh nóc kịch trần! Vừa chuẩn di sản Ngũ Thường vừa đậm chất Slay đương đại, diện đi Concert hay Cafe check-in là visual chiếm trọn spotlight!”`
      : `“Úi chà! Bộ này diện đi dạo phố hay du xuân là hết nước chấm, vừa chuẩn Ngũ Thường vừa đậm chất Slay! Sắc ${colorInfo.title} (${colorInfo.nguHanh}) quyện cùng ${buttonInfo.title} (${buttonInfo.nguThuong}) - ${buttonInfo.genzQuote}”`;

    return {
      slayScore: slay,
      heritageScore: heritage,
      scenario: 'heritage',
      badgeTitle: 'Chuẩn Cổ Phong (Match > 90%)',
      stylistQuote: heritageQuote,
      subAdvice: `Bản phối đạt tỷ lệ vàng cổ phong: Phù hợp ${colorInfo.giaiTang}, tôn vinh đạo Ngũ Thường và cốt cách đoan chính của cổ nhân.`,
      nguThuongAnalysis,
      nguHanhAnalysis,
      isTaboo: false,
      isAnachronism: false,
      canAutoFix: false
    };
  }

  // KỊCH BẢN 4: CÁCH TÂN LỊCH SỰ (MATCH 70-89%)
  const modernQuote = contextId === 'fusion'
    ? `“Bản phối Phố Thị Phá Cách cực chiến! Sắc ${colorInfo.title} hòa nhịp cùng ${buttonInfo.title} tạo nên tuyên ngôn thời trang Á Đông hiện đại không thể trộn lẫn!”`
    : contextId === 'modern'
    ? `“Vibe Thanh Lịch Đời Thường chuẩn Quiet Luxury! Sắc ${colorInfo.title} nhẹ nhàng cùng ${buttonInfo.title}, diện đi làm hay dạo phố Tết đều toát lên cốt cách tri thức, nho nhã!”`
    : !hasDonY 
      ? `“Gu phối đồ bén ngót với sắc ${colorInfo.title} và ${buttonInfo.title}! Cách tân rất có duyên, nhưng nhớ mặc đủ Áo Đơn Y lót trong để 10/10 không có nhưng nhé!”`
      : `“Bản phối giao thoa cổ kim cực slay! Sắc ${colorInfo.title} (${colorInfo.nguHanh}) đi cùng ${buttonInfo.title} (${buttonInfo.nguThuong}) tạo nên phong thái ${colorInfo.giaiTang} phóng khoáng và cuốn hút!”`;

  return {
    slayScore: slay,
    heritageScore: heritage,
    scenario: 'modern_polite',
    badgeTitle: 'Cách Tân Lịch Sự (Match 70-89%)',
    stylistQuote: modernQuote,
    subAdvice: !hasDonY 
      ? 'Nhắc nhở: Lớp Áo Đơn Y trắng cổ đứng cao hơn áo ngoài 2mm là biểu tượng cốt cách sạch sẽ, đoan chính của cổ nhân.' 
      : `Sự kết hợp tinh tế giữa quy chuẩn Ngũ Thường (${buttonInfo.nguThuong}) và bảng màu Ngũ Hành tương sinh, phù hợp bối cảnh tỏa sáng mà bạn lựa chọn.`,
    nguThuongAnalysis,
    nguHanhAnalysis,
    isTaboo: false,
    isAnachronism: false,
    canAutoFix: !hasDonY
  };
};

export interface RemixStudioProps {
  initialContext?: string;
  onChangeContext?: () => void;
  onToggleWorkspace?: () => void;
}

export const RemixStudio: React.FC<RemixStudioProps> = ({
  initialContext = 'heritage',
  onChangeContext,
  onToggleWorkspace
}) => {
  // Selection States
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('ngu-than-tay-chen');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#2B5B84');
  const [selectedStyleVibe, setSelectedStyleVibe] = useState<string>('Indochine Sartorial Dandy');
  
  // Custom uploaded image & Multimodal AI state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedColorChip[] | null>(null);
  const [aiOutfitSuggestion, setAiOutfitSuggestion] = useState<AiRemixSuggestion | null>(null);

  // Layer & Accessories States
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-don-y-white');
  const [selectedButtonId, setSelectedButtonId] = useState<string>('btn-metal-copper');
  const [selectedBottomId, setSelectedBottomId] = useState<string>('bottom-linen-wide-pants');
  const [selectedShoesId, setSelectedShoesId] = useState<string>('shoes-wooden-clogs');
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('acc-paper-fan');

  // Generator & Animation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [remixResult, setRemixResult] = useState<RemixResult | null>(null);
  const [copiedLookbook, setCopiedLookbook] = useState<boolean>(false);

  // Available options
  const activeGarment = HERITAGE_GARMENTS.find(g => g.id === selectedGarmentId) || HERITAGE_GARMENTS[0];
  const activeColor = TRADITIONAL_COLORS.find(c => c.hex === selectedColorHex) || TRADITIONAL_COLORS[0];
  
  const layerOptions = REMIX_ITEMS.filter(i => i.category === 'layer');
  const buttonOptions = REMIX_ITEMS.filter(i => i.category === 'button');
  const bottomOptions = REMIX_ITEMS.filter(i => i.category === 'bottom');
  const shoesOptions = REMIX_ITEMS.filter(i => i.category === 'shoes');
  const accessoryOptions = REMIX_ITEMS.filter(i => i.category === 'accessory');

  // Currently active selected items
  const activeButtonItem = buttonOptions.find(b => b.id === selectedButtonId) || buttonOptions[0];
  const activeBottomItem = bottomOptions.find(b => b.id === selectedBottomId) || bottomOptions[0];
  const activeShoesItem = shoesOptions.find(s => s.id === selectedShoesId) || shoesOptions[0];
  const activeAccessoryItem = accessoryOptions.find(a => a.id === selectedAccessoryId) || accessoryOptions[0];

  // Tự động tinh chỉnh trang phục ban đầu theo Bối Cảnh Onboarding
  useEffect(() => {
    if (initialContext === 'heritage') {
      setSelectedGarmentId('ao-tac');
      setSelectedColorHex('#2B5B84'); // Xanh Thanh Thiên
      setSelectedStyleVibe('Dạ Hội Cung Đình Luxury');
      setSelectedBottomId('bottom-silk-wide-pants'); // Quần Ống Sớ Lụa
      setSelectedShoesId('shoes-wooden-clogs'); // Guốc Mộc
      setSelectedButtonId('btn-metal-copper'); // Cúc Đồng Đúc Bát Bửu
      setSelectedAccessoryId('acc-khan-dong'); // Khăn Đóng Chữ Nhân
    } else if (initialContext === 'modern') {
      setSelectedGarmentId('ngu-than-tay-chen');
      setSelectedColorHex('#334D3C'); // Xanh Rêu Trầm
      setSelectedStyleVibe('Chic Heritage Minimalist');
      setSelectedBottomId('bottom-linen-wide-pants'); // Quần Linen
      setSelectedShoesId('shoes-wooden-clogs'); // Guốc Mộc
      setSelectedButtonId('btn-wood-agarwood'); // Cúc Gỗ Trầm Hương
      setSelectedAccessoryId('acc-paper-fan'); // Quạt Giấy Trầm Hương
    } else if (initialContext === 'fusion') {
      setSelectedGarmentId('ao-giao-linh');
      setSelectedColorHex('#5E3A58'); // Tím Chính Sắc
      setSelectedStyleVibe('Streetwear Á Đông Phá Cách');
      setSelectedBottomId('bottom-high-waist-jeans'); // Quần Jeans Cạp Cao
      setSelectedShoesId('shoes-chunky-loafers'); // Chunky Loafers
      setSelectedButtonId('btn-mother-of-pearl'); // Cúc Xà Cừ Khảm Ốc
      setSelectedAccessoryId('acc-kieng-bac'); // Kiềng Bạc
    }
  }, [initialContext]);

  // Real-time Dual-Metric Evaluation: Slay Score & Độ Chuẩn Di Sản
  const dualMetrics = computeRealtimeDualMetrics(
    activeGarment,
    activeColor,
    selectedLayerId,
    selectedButtonId,
    selectedBottomId,
    selectedShoesId,
    selectedAccessoryId,
    initialContext
  );

  // User custom uploaded product images (lưu bộ nhớ trình duyệt localStorage)
  const [customItemImages, setCustomItemImages] = useState<{ [itemId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_custom_item_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCustomImageModalOpen, setIsCustomImageModalOpen] = useState<boolean>(false);
  const itemFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadItemId, setActiveUploadItemId] = useState<string | null>(null);

  const triggerItemImageUpload = (itemId: string) => {
    setActiveUploadItemId(itemId);
    if (itemFileInputRef.current) {
      itemFileInputRef.current.value = '';
      itemFileInputRef.current.click();
    }
  };

  const handleItemImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadItemId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated = {
          ...customItemImages,
          [activeUploadItemId]: dataUrl
        };
        setCustomItemImages(updated);
        try {
          localStorage.setItem('vietphuc_custom_item_images', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not save custom image to localStorage', err);
        }
        playFabricRustleSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetItemImage = (itemId: string) => {
    const updated = { ...customItemImages };
    delete updated[itemId];
    setCustomItemImages(updated);
    try {
      localStorage.setItem('vietphuc_custom_item_images', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save custom image to localStorage', err);
    }
    playButtonClinkSound();
  };

  // Helper to get image URL for any item (hỗ trợ ảnh tải lên thủ công hoặc ảnh mặc định)
  const getItemImageUrl = (itemId: string, defaultThumbnail?: string): string => {
    return customItemImages[itemId] || defaultThumbnail || '';
  };

  // Sample curated palettes for image analysis simulation
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

  // MULTIMODAL AI IMAGE ANALYSIS SIMULATION (1.5 seconds)
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

            // Automatically apply suggested outfit
            setSelectedGarmentId(suggestedGarment);
            setSelectedBottomId(suggestedBottom);
            setSelectedShoesId(suggestedShoes);
            setSelectedAccessoryId('acc-paper-fan');
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
      setSelectedAccessoryId(aiOutfitSuggestion.accessoryId);
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
    if (selectedAccessoryId === 'acc-smartwatch') {
      setSelectedAccessoryId('acc-paper-fan');
    }
    playDanTranhTabSound();
    
    setTimeout(() => {
      generateRemixOutfit(
        activeGarment, 
        TRADITIONAL_COLORS.find(c => c.hex === '#2B5B84') || TRADITIONAL_COLORS[0],
        'layer-don-y-white',
        'btn-metal-copper',
        selectedBottomId,
        'shoes-wooden-clogs',
        'acc-paper-fan',
        selectedStyleVibe
      );
    }, 150);
  };

  const generateRemixOutfit = (
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
      const quotes = triggered.map(t => t.genZQuote).join(' ');
      feedback = `Báo động đỏ nè bạn hiền ơi! Stylist ngó qua outfit là thấy có tín hiệu "lệch sóng di sản" liền. ${quotes} Nhấn ngay nút "Khắc Phục Chuẩn Triều Nguyễn" ở trên để Stylist cứu nguy cho diện mạo mười điểm không có nhưng nhé!`;
    } else {
      feedback = `Trời ơi xuất sắc luôn người đẹp ơi! Gu phối đồ của bạn hiền hôm nay phải gọi là "drip đỉnh nóc, slay kịch trần"! Lớp áo ${garment.name} tông ${color.name} quyền quý, có cổ Đơn Y trắng viền tinh khôi làm bừng sáng thần thái. Kết hợp cùng ${bottomItem.name}, ${shoesItem.name} và ${accessoryItem.name} vừa chuẩn quy chuẩn y quan Nguyễn Triều lại vừa ngập tràn hơi thở đương đại! Ra phố diện bộ này là chuẩn phong thái vương giả khiến ai cũng phải ngoái nhìn!`;
    }

    const palette = [
      { name: color.name, hex: color.hex, role: 'Sắc Phục Chính' },
      { name: 'Bạch Tuyết Đơn Y', hex: '#F4EFE6', role: 'Viền Cổ Áo Lót' },
      { name: 'Hoàng Kim Cúc Khuy', hex: buttonId === 'btn-jade-green' ? '#10B981' : buttonId === 'btn-wood-agarwood' ? '#8B5A2B' : '#D4AF37', role: 'Phụ Kiện Cúc Áo' },
      { name: 'Trầm Mặc Đen Khói', hex: '#1C1917', role: 'Phom Quần / Phụ Kiện' }
    ];

    setTimeout(() => {
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
        styleVibe,
        matchScore: totalScore,
        scoreBreakdown: {
          yQuanStandard: yQuanScore,
          genZFashion: genZScore,
          eleganceVibe: eleganceScore
        },
        taboosTriggered: triggered,
        stylistFeedback: feedback,
        paletteItems: palette
      });
      setIsGenerating(false);

      const resultElem = document.getElementById('remix-result-section');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  const handleShareLookbook = () => {
    setCopiedLookbook(true);
    setTimeout(() => setCopiedLookbook(false), 2500);
  };

  const isChineseButtonSelected = selectedButtonId === 'btn-chinese-cloth';
  const isImperialYellowSelected = !!activeColor.isImperialRestricted;
  const isTabooClashSelected = activeAccessoryItem.id === 'acc-smartwatch' || (!activeShoesItem.isCulturallyRespectful);

  return (
    <div className="space-y-12">
      {/* Acubi / Quiet Luxury Context Banner */}
      <div className="bg-[#14141c] border border-[#D4AF37]/35 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#D4AF37]/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            {initialContext === 'heritage' ? '⛩️' : initialContext === 'modern' ? '🍃' : '⚡'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Bối Cảnh Đã Chọn
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4AF37]/15 text-[#e5c365] border border-[#D4AF37]/30 uppercase">
                {initialContext === 'heritage' ? 'Trang trọng & Chuẩn mực' : initialContext === 'modern' ? 'Tinh tế & Hiện đại' : 'Cá tính & Nổi loạn'}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-[#f5f2eb] mt-1">
              {initialContext === 'heritage' ? 'Chốn Tôn Nghiêm' : initialContext === 'modern' ? 'Thanh Lịch Đời Thường' : 'Phố Thị Phá Cách'}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
              {initialContext === 'heritage' 
                ? 'Đền chùa, di tích lịch sử, Lễ nghi truyền thống — AI Stylist ưu tiên quy chuẩn trang nghiêm và y quan chuẩn mực triều đình.'
                : initialContext === 'modern'
                ? 'Công sở, Dạo phố nhẹ nhàng, Tết gia đình — AI Stylist tối ưu phom dáng gọn gàng, thanh lịch và thoải mái.'
                : 'Concert, Cafe check-in, Dạo phố đêm — AI Stylist khuyến khích bản phối streetwear phá cách, nổi bật và độc bản!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 relative z-10 flex-wrap">
          {onToggleWorkspace && (
            <button
              type="button"
              onClick={onToggleWorkspace}
              className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#f5f2eb] border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Chuyển sang Giao diện chính Acubi 4:6"
            >
              <span>🎨 Giao diện Acubi 4:6</span>
            </button>
          )}
          {onChangeContext && (
            <button
              type="button"
              onClick={onChangeContext}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#e5c365] hover:text-[#0e0e12] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>✦</span>
              <span>Đổi Bối Cảnh</span>
            </button>
          )}
        </div>
      </div>

      {/* Editorial Header */}
      <div className="relative border-b border-[#24242d] pb-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-[#c5a059] font-medium tracking-wide mb-1 flex items-center gap-2">
              <span>Stylist Cổ Phục Viễn Đông · HeritStyle AI</span>
              <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#e5c365] text-[10px] font-semibold border border-[#c5a059]/30">
                Quy Chuẩn Triều Nguyễn
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f2eb]">
              Phối Trang Phục Cổ Phong & Hiện Đại
            </h1>
            <p className="mt-2 text-stone-300 text-sm max-w-2xl leading-relaxed">
              Khám phá phom dáng Áo Ngũ Thân, Áo Tấc, Nhật Bình hòa quyện cùng thời trang đương đại. 
              Hệ thống tự động thẩm định theo quy chế y quan triều Nguyễn và bộ lọc Taboos Engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedGarmentId('ngu-than-tay-chen');
                setSelectedColorHex('#2B5B84');
                setSelectedStyleVibe('Indochine Sartorial Dandy');
                setSelectedLayerId('layer-don-y-white');
                setSelectedButtonId('btn-metal-copper');
                setSelectedBottomId('bottom-linen-wide-pants');
                setSelectedShoesId('shoes-wooden-clogs');
                setSelectedAccessoryId('acc-paper-fan');
                setExtractedPalette(null);
                setAiOutfitSuggestion(null);
              }}
              className="px-3.5 py-1.5 text-xs text-stone-300 hover:text-[#d4af37] border border-[#2a2a35] hover:border-[#d4af37]/40 rounded-lg transition-colors flex items-center gap-1.5 bg-[#141418] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gợi ý mẫu chuẩn</span>
            </button>

            <button
              onClick={() => setIsCustomImageModalOpen(true)}
              className="px-3.5 py-1.5 text-xs text-[#f5f2eb] hover:text-[#e5c365] border border-[#c5a059]/40 hover:border-[#c5a059] rounded-lg transition-all flex items-center gap-1.5 bg-[#181822] hover:bg-[#20202c] cursor-pointer shadow-sm"
              title="Quản lý toàn bộ ảnh tải lên thủ công"
            >
              <Upload className="w-3.5 h-3.5 text-[#e5c365]" />
              <span>Kho ảnh thủ công</span>
              {Object.keys(customItemImages).length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c5a059] text-stone-950 text-[10px] font-bold flex items-center justify-center">
                  {Object.keys(customItemImages).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BẢNG ĐÁNH GIÁ "SLAY & CHUẨN CỔ PHONG" - REALTIME EVALUATION */}
      {/* ======================================================== */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden backdrop-blur-xl ${
        dualMetrics.scenario === 'taboo'
          ? 'bg-gradient-to-br from-[#2a0e14]/95 via-[#19080c]/95 to-[#120508]/95 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] animate-pulse'
          : dualMetrics.scenario === 'anachronism'
          ? 'bg-gradient-to-br from-[#2a1b0a]/95 via-[#1a1106]/95 to-[#120c04]/95 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
          : dualMetrics.scenario === 'heritage'
          ? 'bg-gradient-to-br from-[#12231b]/95 via-[#0e171f]/95 to-[#1c170e]/95 border-[#e5c365] shadow-[0_0_35px_rgba(229,195,101,0.25)]'
          : 'bg-gradient-to-br from-[#1e1028]/95 via-[#130d1d]/95 to-[#0e0c16]/95 border-purple-500/70 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
      }`}>
        {/* Glow ambient background highlight */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 ${
          dualMetrics.scenario === 'taboo' ? 'bg-rose-500' :
          dualMetrics.scenario === 'anachronism' ? 'bg-amber-500' :
          dualMetrics.scenario === 'heritage' ? 'bg-[#e5c365]' :
          'bg-purple-500'
        }`} />

        <div className="relative z-10 space-y-5">
          {/* TOP BAR: BADGE & LIVE STATUS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                dualMetrics.scenario === 'taboo'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : dualMetrics.scenario === 'anachronism'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : dualMetrics.scenario === 'heritage'
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-black'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              }`}>
                {dualMetrics.scenario === 'taboo' && <AlertTriangle className="w-3.5 h-3.5" />}
                {dualMetrics.scenario === 'anachronism' && <AlertTriangle className="w-3.5 h-3.5" />}
                {dualMetrics.scenario === 'heritage' && <Sparkles className="w-3.5 h-3.5" />}
                {dualMetrics.scenario === 'modern_polite' && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{dualMetrics.badgeTitle}</span>
              </span>
              <span className="text-[11px] text-stone-300 hidden md:inline">
                ⚡ Tự động thẩm định kép theo thời gian thực
              </span>
            </div>

            {dualMetrics.canAutoFix && (
              <button
                type="button"
                onClick={handleAutoFixTaboos}
                className="px-3.5 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d8b566] text-[#0d0d10] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all self-start sm:self-auto active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Khắc Phục Chuẩn Triều Nguyễn (1 Chạm)</span>
              </button>
            )}
          </div>

          {/* DUAL METRICS PROGRESS BARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* 1. SLAY SCORE */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5">
                    <span>💅 Slay Score</span>
                    <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[10px] font-semibold border border-pink-500/30">
                      Gen Z Vibe
                    </span>
                  </span>
                  <div className="text-[11px] text-stone-300 mt-0.5">
                    Tỷ lệ phối màu hài hòa & độ cá tính Gen Z
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-pink-400 font-mono tracking-tight">
                    {dualMetrics.slayScore}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 transition-all duration-700 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                  style={{ width: `${dualMetrics.slayScore}%` }}
                />
              </div>
            </div>

            {/* 2. ĐỘ CHUẨN DI SẢN */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#e5c365] font-bold flex items-center gap-1.5">
                    <span>👑 Độ Chuẩn Di Sản</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#c5a059]/20 text-[#e5c365] text-[10px] font-semibold border border-[#c5a059]/30">
                      Y Quan Triều Nguyễn
                    </span>
                  </span>
                  <div className="text-[11px] text-stone-300 mt-0.5">
                    Tuân thủ quy chế (Áo Đơn Y, khuy cúc, phụ kiện)
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                    dualMetrics.heritageScore >= 90 ? 'text-[#e5c365]' :
                    dualMetrics.heritageScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {dualMetrics.heritageScore}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    dualMetrics.heritageScore >= 90
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 shadow-[0_0_12px_rgba(229,195,101,0.5)]'
                      : dualMetrics.heritageScore >= 70
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  }`}
                  style={{ width: `${dualMetrics.heritageScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* AI STYLIST GEN Z SPEECH BUBBLE */}
          <div className="p-4 sm:p-4.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#c5a059] to-rose-500 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-lg border border-white/20">
              AI 💅
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#e5c365]">AI Stylist Cổ Phục Viễn Đông</span>
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">• Thẩm định văn phong Gen Z & Triết lý Di sản</span>
              </div>
              <p className="text-sm sm:text-base font-semibold italic text-stone-100 leading-relaxed">
                {dualMetrics.stylistQuote}
              </p>
              <p className="text-xs text-stone-300/90 leading-relaxed pt-0.5">
                {dualMetrics.subAdvice}
              </p>

              {/* CHI TIẾT THẨM ĐỊNH NGŨ THƯỜNG & NGŨ HÀNH GIAI TẦNG */}
              <div className="pt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-[#c5a059]/25 flex items-start gap-2 shadow-sm">
                  <span className="text-base shrink-0 leading-none mt-0.5">🔘</span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#e5c365] block uppercase text-[10px] tracking-wider">
                      Đạo Ngũ Thường (Khuy Cúc)
                    </span>
                    <span className="text-stone-200 leading-snug block mt-0.5 font-medium">
                      {dualMetrics.nguThuongAnalysis}
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-[#c5a059]/25 flex items-start gap-2 shadow-sm">
                  <span className="text-base shrink-0 leading-none mt-0.5">🎨</span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#e5c365] block uppercase text-[10px] tracking-wider">
                      Ngũ Hành & Giai Tầng (Sắc Phục)
                    </span>
                    <span className="text-stone-200 leading-snug block mt-0.5 font-medium">
                      {dualMetrics.nguHanhAnalysis}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & Selections (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Garment Selection or Photo Upload with Multimodal AI */}
          <div className="bg-[#141418] border border-[#23232c] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
              <h3 className="text-base font-bold text-[#f5f2eb]">
                1. Chọn Dòng Cổ Phục
              </h3>
              <span className="text-xs text-stone-400">Quy chuẩn Y quan</span>
            </div>

            {/* 5 Garment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {HERITAGE_GARMENTS.map((item) => {
                const isSelected = selectedGarmentId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedGarmentId(item.id);
                      setSelectedColorHex(item.defaultColor);
                      playGarmentSelectSound();
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#1b1b22] border-[#c5a059] shadow-sm'
                        : 'bg-[#101014] border-[#22222a] hover:border-[#383845]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#c5a059]" />
                    )}
                    <div className="font-bold text-sm text-[#f5f2eb]">{item.name}</div>
                    <div className="text-xs text-[#c5a059] mt-0.5">{item.dynasty}</div>
                    <p className="text-xs text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                      {item.subName}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* PHOTO UPLOAD WITH MULTIMODAL AI ANALYSIS SIMULATION */}
            <div className="pt-3 border-t border-[#1f1f28] space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-medium text-stone-300">
                  <Scan className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Hoặc tải ảnh trang phục của bạn (AI Multimodal Analysis):</span>
                </span>
                {uploadedImage && (
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setExtractedPalette(null);
                      setAiOutfitSuggestion(null);
                    }}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>

              {/* Upload Dropzone */}
              <label className="border border-dashed border-[#2f2f3d] hover:border-[#c5a059]/70 bg-[#0f0f14] rounded-xl p-3.5 flex items-center justify-center gap-3 cursor-pointer group transition-colors relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-stone-300 group-hover:text-white font-medium">
                  {uploadedImage ? 'Đã tải ảnh lên (Bấm để chọn ảnh khác)' : 'Tải ảnh trang phục cá nhân để AI quét phom dáng & tone màu'}
                </span>
              </label>

              {/* SIMULATED AI MULTIMODAL SCANNING OVERLAY (1.5 SECONDS) */}
              {isAnalyzingImage && (
                <div className="p-4 rounded-xl bg-[#0d1624] border border-[#3b82f6]/40 space-y-3 animate-fadeIn relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent animate-pulse" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-[#38bdf8] font-semibold">
                      <Wand2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
                      <span>AI đang quét phom dáng & tone màu...</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#38bdf8]">{analysisProgress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-[#172554] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-[#38bdf8] transition-all duration-75"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>[Multimodal Vision Model] Đang trích xuất RGB & so khớp quy chuẩn...</span>
                    <span className="text-cyan-300 font-mono">1.5s Simulation</span>
                  </div>
                </div>
              )}

              {/* EXTRACTED COLOR PALETTE & AI OUTFIT SUGGESTION CARD */}
              {!isAnalyzingImage && extractedPalette && (
                <div className="p-4 rounded-xl bg-[#111119] border border-[#c5a059]/40 space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#e5c365]">
                      <Palette className="w-4 h-4" />
                      <span>Thẻ Màu Nhận Diện Từ Ảnh (Extracted Palette)</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ Đã quét thành công
                    </span>
                  </div>

                  {/* Color Chips Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {extractedPalette.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedColorHex(chip.hex);
                          playColorPickSound();
                        }}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          selectedColorHex === chip.hex
                            ? 'bg-[#1b1b26] border-[#c5a059] shadow-sm'
                            : 'bg-[#0d0d12] border-[#22222d] hover:border-[#383848]'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded shrink-0 border border-white/20" 
                          style={{ backgroundColor: chip.hex }} 
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-stone-200 truncate">{chip.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{chip.hex} ({chip.percentage}%)</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* AI Outfit Suggestion Box */}
                  {aiOutfitSuggestion && (
                    <div className="p-3.5 rounded-lg bg-[#181824] border border-[#303046] space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f5f2eb] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span>{aiOutfitSuggestion.title}</span>
                        </span>
                        <button
                          onClick={handleApplyAiSuggestion}
                          className="px-2.5 py-1 rounded bg-[#c5a059] hover:bg-[#d8b566] text-[#0d0d10] font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Áp dụng gợi ý</span>
                        </button>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {aiOutfitSuggestion.rationale}
                      </p>

                      <div className="text-xs text-[#faedd0] italic bg-black/30 p-2.5 rounded border-l-2 border-[#c5a059] leading-relaxed">
                        {aiOutfitSuggestion.stylistQuote}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* STEP 2: Royal Color Selection */}
          <div className="bg-[#141418] border border-[#23232c] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
              <h3 className="text-base font-bold text-[#f5f2eb]">
                2. Sắc Phục Truyền Thống
              </h3>
              <span className="text-xs text-stone-400">Màu sắc triều Nguyễn</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {TRADITIONAL_COLORS.map((col) => {
                const isSelected = selectedColorHex === col.hex;
                return (
                  <button
                    key={col.hex}
                    onClick={() => {
                      setSelectedColorHex(col.hex);
                      if (col.isImperialRestricted) {
                        playTabooDenialSound();
                      } else {
                        playColorPickSound();
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all relative cursor-pointer group ${
                      isSelected
                        ? col.isImperialRestricted
                          ? 'bg-rose-950/60 border-rose-500 shadow-md ring-1 ring-rose-500'
                          : 'bg-[#1b1b22] border-[#c5a059] shadow-sm ring-1 ring-[#c5a059]'
                        : 'bg-[#101014] border-[#22222a] hover:border-[#333342]'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-lg shrink-0 border border-white/20 mt-0.5 shadow-sm" 
                      style={{ backgroundColor: col.hex }} 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-stone-200 truncate flex items-center gap-1">
                        <span>{col.name}</span>
                        {col.isImperialRestricted && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded border border-rose-500/40 font-bold" title="Cấm kỵ Hoàng quyền">Cấm kỵ</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#c5a059] font-medium mt-0.5 truncate">
                        {col.element || 'Ngũ Hành'}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">{col.hex}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Notice about Imperial Yellow */}
            {activeColor.isImperialRestricted && (
              <div className="p-3 bg-rose-950/40 border border-rose-600/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <strong className="font-semibold text-rose-200">Cảnh báo Taboos Engine:</strong> Sắc Vàng Minh Hoàng là đặc quyền hoàng đế triều Nguyễn. Thứ dân mặc sẽ vi phạm quy chế y quan!
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Curated Heritage & Modern Remix Items with Image Thumbnails */}
          <div className="bg-[#141418] border border-[#23232c] rounded-xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#202028] pb-3">
              <h3 className="text-base font-bold text-[#f5f2eb]">
                3. Tùy Chọn Chi Tiết & Phối Đồ
              </h3>
              <span className="text-xs text-[#c5a059] font-medium">14 món chuẩn quy chuẩn cố định</span>
            </div>

            {/* A. LỚP ÁO LÓT TRONG: YÊU CẦU 1 - LOẠI BỎ HOÀN TOÀN HÌNH ẢNH MINH HỌA, CHỈ GIỮ LẠI THẺ CHỮ & VĂN HÓA */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                <span>Lớp Áo Lót Trong (Đơn Y):</span>
                <span className="text-xs text-[#c5a059] font-medium">*Bắt buộc theo quy chuẩn</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layerOptions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedLayerId(item.id);
                      if (!item.isCulturallyRespectful) {
                        playTabooDenialSound();
                      } else {
                        playFabricRustleSound();
                      }
                    }}
                    className={`p-4 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                      selectedLayerId === item.id
                        ? 'bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                        : 'bg-[#101014] border-[#22222a] text-stone-300 hover:border-[#383847]'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center justify-between text-xs sm:text-sm">
                        <span>{item.name}</span>
                        {item.isCulturallyRespectful ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className={item.isCulturallyRespectful ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                        {item.isCulturallyRespectful ? '✓ Chuẩn cốt cách cổ nhân' : '⚠️ Lệch chuẩn trang phục'}
                      </span>
                      <span className="text-stone-500 italic text-[10px]">Ghi chú y quan</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* B. HẠT KHUY CÚC ÁO (1.png, 2.png, 3.png, 4.png) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-200">
                  Hạt Khuy Cúc Áo (Ngũ Thường):
                </label>
                <span className="text-xs text-rose-400 font-semibold">*Cấm cúc vải Tàu</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buttonOptions.map(item => {
                  const isSelected = selectedButtonId === item.id;
                  const isTaboo = item.id === 'btn-chinese-cloth';
                  const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedButtonId(item.id);
                        if (item.id === 'btn-chinese-cloth') {
                          playTabooDenialSound();
                        } else {
                          playButtonClinkSound();
                        }
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? isTaboo
                            ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500'
                            : 'bg-[#1b1b24] border-[#c5a059] text-[#f5f2eb] ring-1 ring-[#c5a059]'
                          : 'bg-[#101014] border-[#22222a] text-stone-300 hover:border-[#383847]'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Fixed Image Thumbnail */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative border border-white/10 bg-black/40">
                          {customItemImages[item.id] && (
                            <div className="absolute top-1 left-1 bg-[#c5a059] text-stone-950 text-[8px] font-bold px-1 py-0.2 rounded shadow z-10 flex items-center gap-0.5">
                              ★ Ảnh riêng
                            </div>
                          )}
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
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-semibold flex items-center justify-between">
                            <span className="truncate pr-1 text-xs">{item.name}</span>
                            {item.isCulturallyRespectful ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                            )}
                          </div>
                          <div className={`text-[11px] mt-0.5 font-medium ${isTaboo ? 'text-rose-400' : 'text-[#c5a059]'}`}>
                            {item.styleVibe}
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Nút Tải ảnh lên cho sản phẩm mới */}
                      {UPLOADABLE_PRODUCT_IDS.has(item.id) && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => triggerItemImageUpload(item.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-sm ${
                              customItemImages[item.id]
                                ? 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40'
                                : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border border-[#c5a059]/40 hover:border-[#c5a059]'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>{customItemImages[item.id] ? 'Đổi ảnh đã tải' : 'Tải ảnh lên'}</span>
                          </button>
                          {customItemImages[item.id] && (
                            <button
                              type="button"
                              onClick={() => handleResetItemImage(item.id)}
                              className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px] font-medium"
                              title="Khôi phục ảnh mặc định"
                            >
                              Gỡ
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* TABOOS WARNING BANNER ON BUTTON SELECTION */}
              {isChineseButtonSelected && (
                <div className="p-4 rounded-xl bg-[#261014] border-2 border-rose-500 text-rose-200 space-y-2.5 animate-fadeIn shadow-xl">
                  <div className="flex items-center gap-2 font-bold text-rose-100 text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                    <span>CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH: CÚC VẢI / CÚC TÀU</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    Quy chuẩn Y quan thời Nguyễn từ thời chúa Nguyễn Phúc Khoát và vua Minh Mạng quy định nút áo Ngũ Thân luôn là khuy tròn rời gắn vào khuyết, làm bằng kim loại (đồng, bạc, vàng chạm) hoặc gỗ quý, ngọc thạch. <strong>Tuyệt đối không dùng cúc bện vải (cúc bàn đinh kiểu Mãn Thanh/Sườn xám)</strong> vì đây là lai căng, sai lệch văn hóa y quan Việt!
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedButtonId('btn-metal-copper');
                        playButtonClinkSound();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d8b566] text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Đổi Sang Cúc Kim Loại Chuẩn Triều Nguyễn</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* C. THÂN DƯỚI PHỐI CÙNG (Quần Ống Sớ Lụa, Quần Linen, Chân Váy Xếp Ly, Quần Jeans Cạp Cao) */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                <span>Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại):</span>
                <span className="text-[11px] text-[#c5a059]">4 lựa chọn phom dáng</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bottomOptions.map(item => {
                  const isSelected = selectedBottomId === item.id;
                  const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedBottomId(item.id);
                        playFabricRustleSound();
                      }}
                      className={`rounded-xl border overflow-hidden text-left transition-all cursor-pointer flex flex-col relative group ${
                        isSelected
                          ? 'bg-[#1b1b24] border-[#c5a059] shadow-md ring-1 ring-[#c5a059]'
                          : 'bg-[#101014] border-[#22222a] hover:border-[#383848]'
                      }`}
                    >
                      {/* Fixed Thumbnail Image */}
                      <div className="h-28 w-full relative overflow-hidden bg-black/40">
                        {customItemImages[item.id] && (
                          <div className="absolute top-2 left-2 bg-[#c5a059] text-stone-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Ảnh riêng</span>
                          </div>
                        )}
                        <img 
                          src={imgSrc} 
                          alt={item.name} 
                          onError={(e) => {
                            if (item.id === 'bottom-linen-wide-pants' || item.id === 'bottom-silk-wide-pants') e.currentTarget.src = '/5.png';
                            if (item.id === 'bottom-pleated-midi-skirt') e.currentTarget.src = '/6.png';
                            if (item.id === 'bottom-high-waist-jeans') e.currentTarget.src = '/7.png';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center font-bold text-xs shadow">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#f5f2eb] line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[#c5a059] mt-0.5">{item.styleVibe}</div>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed pt-1">
                            {item.description}
                          </p>
                        </div>
                        {UPLOADABLE_PRODUCT_IDS.has(item.id) && (
                          <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm ${
                                customItemImages[item.id]
                                  ? 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border border-[#c5a059]/40 hover:border-[#c5a059]'
                              }`}
                            >
                              <Upload className="w-3 h-3" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh đã tải' : 'Tải ảnh lên'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="px-2 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px]"
                                title="Khôi phục ảnh mặc định"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* D. GIÀY / GUỐC (Guốc Mộc Truyền Thống, Hài Thêu Cung Đình, Sneakers Trắng, Chunky Loafers) */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                <span>Giày / Guốc:</span>
                <span className="text-[11px] text-[#c5a059]">4 lựa chọn hài hòa</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shoesOptions.map(item => {
                  const isSelected = selectedShoesId === item.id;
                  const isSneakerClash = item.id === 'shoes-white-sneakers' && (activeGarment.id === 'ao-tac' || activeGarment.id === 'ao-nhat-binh' || activeGarment.id === 'ao-vien-linh');
                  const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedShoesId(item.id);
                        playWoodClogSound();
                      }}
                      className={`rounded-xl border overflow-hidden text-left transition-all cursor-pointer flex flex-col relative group ${
                        isSelected
                          ? isSneakerClash
                            ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-[#1b1b24] border-[#c5a059] shadow-md ring-1 ring-[#c5a059]'
                          : 'bg-[#101014] border-[#22222a] hover:border-[#383848]'
                      }`}
                    >
                      {/* Fixed Thumbnail Image */}
                      <div className="h-28 w-full relative overflow-hidden bg-black/40">
                        {customItemImages[item.id] && (
                          <div className="absolute top-2 left-2 bg-[#c5a059] text-stone-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Ảnh riêng</span>
                          </div>
                        )}
                        <img 
                          src={imgSrc} 
                          alt={item.name} 
                          onError={(e) => {
                            if (item.id === 'shoes-wooden-clogs') e.currentTarget.src = '/8.png';
                            if (item.id === 'shoes-embroidered-slippers') e.currentTarget.src = '/9.png';
                            if (item.id === 'shoes-white-sneakers' || item.id === 'shoes-chunky-loafers') e.currentTarget.src = '/10.png';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center font-bold text-xs shadow">
                            ✓
                          </div>
                        )}
                        {isSneakerClash && (
                          <div className="absolute bottom-2 left-2 right-2 bg-amber-950/90 text-amber-200 border border-amber-500/50 text-[10px] px-1.5 py-0.5 rounded font-semibold text-center">
                            ⚠️ Cân nhắc lễ phục
                          </div>
                        )}
                      </div>

                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#f5f2eb] line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[#c5a059] mt-0.5">{item.styleVibe}</div>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed pt-1">
                            {item.description}
                          </p>
                        </div>
                        {UPLOADABLE_PRODUCT_IDS.has(item.id) && (
                          <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm ${
                                customItemImages[item.id]
                                  ? 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border border-[#c5a059]/40 hover:border-[#c5a059]'
                              }`}
                            >
                              <Upload className="w-3 h-3" />
                              <span>{customItemImages[item.id] ? 'Đổi ảnh đã tải' : 'Tải ảnh lên'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="px-2 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px]"
                                title="Khôi phục ảnh mặc định"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* E. PHỤ KIỆN ĐI KÈM (Khăn Đóng Chữ Nhân, Khăn Vành Dây, Quạt Giấy Trầm Hương, Bội Ngọc Bích, Kiềng Bạc, Đồng Hồ Thông Minh (Hiện Đại)) */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                <span>Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại):</span>
                <span className="text-[11px] text-[#c5a059]">Điểm xuyết cốt cách</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {accessoryOptions.map(item => {
                  const isSelected = selectedAccessoryId === item.id;
                  const isSmartwatch = item.id === 'acc-smartwatch';
                  const imgSrc = getItemImageUrl(item.id, item.thumbnailUrl);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedAccessoryId(item.id);
                        playFanFlutterSound();
                      }}
                      className={`rounded-xl border overflow-hidden text-left transition-all cursor-pointer flex flex-col relative group ${
                        isSelected
                          ? isSmartwatch
                            ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                            : 'bg-[#1b1b24] border-[#c5a059] shadow-md ring-1 ring-[#c5a059]'
                          : 'bg-[#101014] border-[#22222a] hover:border-[#383848]'
                      }`}
                    >
                      {/* Fixed Thumbnail Image */}
                      <div className="h-24 w-full relative overflow-hidden bg-black/40">
                        {customItemImages[item.id] && (
                          <div className="absolute top-1.5 left-1.5 bg-[#c5a059] text-stone-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Ảnh riêng</span>
                          </div>
                        )}
                        <img 
                          src={imgSrc} 
                          alt={item.name} 
                          onError={(e) => {
                            if (item.id === 'acc-paper-fan') e.currentTarget.src = '/11.png';
                            if (item.id === 'acc-khan-dong' || item.id === 'acc-khan-vanh-day') e.currentTarget.src = '/12.png';
                            if (item.id === 'acc-jade-pendant' || item.id === 'acc-kieng-bac') e.currentTarget.src = '/13.png';
                            if (item.id === 'acc-smartwatch') e.currentTarget.src = '/14.png';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center font-bold text-xs shadow z-10">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#f5f2eb] line-clamp-1">{item.name}</div>
                          <div className={`text-[10px] mt-0.5 ${isSmartwatch ? 'text-rose-400' : 'text-[#c5a059]'}`}>
                            {item.styleVibe}
                          </div>
                          <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed pt-1">
                            {item.description}
                          </p>
                        </div>
                        {UPLOADABLE_PRODUCT_IDS.has(item.id) && (
                          <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => triggerItemImageUpload(item.id)}
                              className={`flex-1 inline-flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-semibold transition-all shadow-sm ${
                                customItemImages[item.id]
                                  ? 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-[#c5a059]/20 hover:bg-[#c5a059]/35 text-[#e5c365] border border-[#c5a059]/40 hover:border-[#c5a059]'
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{customItemImages[item.id] ? 'Đổi ảnh' : 'Tải ảnh lên'}</span>
                            </button>
                            {customItemImages[item.id] && (
                              <button
                                type="button"
                                onClick={() => handleResetItemImage(item.id)}
                                className="px-1.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[9px] shrink-0"
                                title="Khôi phục ảnh mặc định"
                              >
                                Gỡ
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* F. Style Vibe Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-stone-200">Phong Cách Remix Đương Đại:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Indochine Sartorial Dandy',
                  'Chic Heritage Minimalist',
                  'Cyberpunk Cổ Phong',
                  'Dạ Hội Cung Đình Luxury',
                  'Streetwear Á Đông Phá Cách'
                ].map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => setSelectedStyleVibe(vibe)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedStyleVibe === vibe
                        ? 'bg-[#c5a059] text-[#0d0d10] font-bold'
                        : 'bg-[#16161d] text-stone-300 hover:bg-[#20202a] border border-[#2a2a35]'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* MAIN CTA BUTTON: TẠO OUTFIT REMIX */}
          <div className="pt-2">
            <button
              onClick={() => {
                playDanTranhTabSound();
                generateRemixOutfit();
              }}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-xl bg-[#c5a059] hover:bg-[#d4b065] text-[#0f0f14] font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-5 h-5 animate-spin" />
                  <span>Đang tổng hợp outfit & kiểm tra Taboos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Tạo Outfit Remix & Thẩm Định Di Sản</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: YÊU CẦU NÂNG CẤP - KHUNG CANVAS PREVIEW OUTFIT TỔNG THỂ */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <OutfitMoodboardCanvas
            activeGarment={activeGarment}
            activeColor={activeColor}
            selectedColorHex={selectedColorHex}
            activeButtonItem={{
              ...activeButtonItem,
              thumbnailUrl: getItemImageUrl(activeButtonItem.id, activeButtonItem.thumbnailUrl),
              canvas2dUrl: getItemImageUrl(activeButtonItem.id, activeButtonItem.canvas2dUrl || activeButtonItem.thumbnailUrl)
            }}
            activeBottomItem={{
              ...activeBottomItem,
              thumbnailUrl: getItemImageUrl(activeBottomItem.id, activeBottomItem.thumbnailUrl),
              canvas2dUrl: getItemImageUrl(activeBottomItem.id, activeBottomItem.canvas2dUrl || activeBottomItem.thumbnailUrl)
            }}
            activeShoesItem={{
              ...activeShoesItem,
              thumbnailUrl: getItemImageUrl(activeShoesItem.id, activeShoesItem.thumbnailUrl),
              canvas2dUrl: getItemImageUrl(activeShoesItem.id, activeShoesItem.canvas2dUrl || activeShoesItem.thumbnailUrl)
            }}
            activeAccessoryItem={{
              ...activeAccessoryItem,
              thumbnailUrl: getItemImageUrl(activeAccessoryItem.id, activeAccessoryItem.thumbnailUrl),
              canvas2dUrl: getItemImageUrl(activeAccessoryItem.id, activeAccessoryItem.canvas2dUrl || activeAccessoryItem.thumbnailUrl)
            }}
            hasDonY={selectedLayerId === 'layer-don-y-white'}
            uploadedImage={uploadedImage}
            isChineseButtonSelected={isChineseButtonSelected}
            isImperialYellowSelected={isImperialYellowSelected}
            isTabooClashSelected={isTabooClashSelected}
          />

          {/* Quick Spec Card */}
          <div className="bg-[#141419] border border-[#23232c] rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#22222c] pb-2.5 mb-2">
              <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Thông Số Kỹ Thuật Y Quan
              </span>
              <span className="text-[10px] text-stone-400">Thời Nguyễn (TK 18-20)</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Dòng áo:</span>
              <span className="text-[#f5f2eb] font-medium">{activeGarment.name}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Sắc phục:</span>
              <span className="text-stone-200 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: selectedColorHex }} />
                {activeColor.vietnameseName}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Quy chuẩn Đơn Y:</span>
              <span className={selectedLayerId === 'layer-don-y-white' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                {selectedLayerId === 'layer-don-y-white' ? '✓ Đã có áo lót trắng' : '⚠️ Thiếu Đơn Y (Taboo)'}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Cúc áo 5 khuy:</span>
              <span className={isChineseButtonSelected ? 'text-rose-400 font-bold flex items-center gap-1' : 'text-stone-200 font-medium'}>
                {isChineseButtonSelected && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                {activeButtonItem.name}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Thân dưới phối:</span>
              <span className="text-stone-200 font-medium">{activeBottomItem.name}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Giày / Guốc:</span>
              <span className="text-stone-200 font-medium">{activeShoesItem.name}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Phụ kiện kèm:</span>
              <span className="text-stone-200 font-medium">{activeAccessoryItem.name}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RESULT SECTION: APPEARS AFTER CLICKING "TẠO OUTFIT REMIX" */}
      {/* ======================================================== */}
      {remixResult && (
        <div id="remix-result-section" className="pt-8 border-t border-[#2a2a35] space-y-8 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#c5a059] font-medium tracking-wide">
                Đề xuất từ Stylist Cổ Phục Viễn Đông
              </span>
              <h2 className="text-2xl font-bold text-[#f5f2eb] mt-1">
                Bản Phối Y Phục Hoàng Triều Remix
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShareLookbook}
                className="px-4 py-2 bg-[#1b1b22] hover:bg-[#252530] text-stone-200 text-xs font-medium rounded-xl border border-[#2c2c3a] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{copiedLookbook ? 'Đã sao chép link lookbook!' : 'Chia sẻ Lookbook'}</span>
              </button>
            </div>
          </div>

          {/* TABOOS WARNING BANNER (IF VIOLATIONS EXIST) */}
          {remixResult.taboosTriggered.length > 0 && (
            <div className="p-5 rounded-xl bg-[#231215] border border-rose-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-rose-200">
                      Cảnh báo Taboos Y quan ({remixResult.taboosTriggered.length} điểm vi phạm)
                    </h4>
                    <p className="text-xs text-rose-300/80">
                      Phối đồ chưa đúng quy chế cung đình, có nguy cơ làm lệch nét đẹp di sản.
                    </p>
                  </div>
                </div>

                {/* 1-Click Remedy Button */}
                <button
                  onClick={handleAutoFixTaboos}
                  className="px-4 py-2 bg-[#c5a059] hover:bg-[#d8b566] text-[#0d0d10] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Sửa Lỗi Tự Động Chuẩn Triều Nguyễn</span>
                </button>
              </div>

              {/* List of Taboos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-rose-500/20">
                {remixResult.taboosTriggered.map(taboo => (
                  <div key={taboo.id} className="p-3.5 rounded-lg bg-black/40 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-200">
                      <span>{taboo.title}</span>
                      <span className="text-rose-400">-{taboo.penaltyScore}đ</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {taboo.explanation}
                    </p>
                    <div className="text-xs text-[#e5c365] italic bg-black/30 p-2 rounded border-l-2 border-[#e5c365]">
                      {taboo.genZQuote}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAIN RESULTS GRID: Score Meter + Palette + Stylist Review + Lookbook Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1. MATCH SCORE & METRICS (4 Cols) */}
            <div className="lg:col-span-4 bg-[#141418] border border-[#23232c] rounded-xl p-5 space-y-5">
              <div>
                <span className="text-xs text-stone-400 font-medium">
                  Đánh giá tổng quan
                </span>
                <h3 className="text-base font-bold text-[#f5f2eb] mt-0.5">
                  HeritStyle Match Score
                </h3>
              </div>

              {/* Circular Score Gauge */}
              <div className="flex flex-col items-center justify-center p-5 bg-[#0f0f14] rounded-xl border border-[#242430]">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#22222d"
                      strokeWidth="7"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={remixResult.matchScore >= 85 ? '#c5a059' : remixResult.matchScore >= 70 ? '#10B981' : '#e11d48'}
                      strokeWidth="7"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - remixResult.matchScore / 100)}`}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#f5f2eb]">
                      {remixResult.matchScore}
                    </span>
                    <span className="text-xs text-[#c5a059] font-semibold mt-0.5">
                      {remixResult.matchScore >= 85 ? 'Xuất Sắc' : remixResult.matchScore >= 70 ? 'Khá Ổn' : 'Cần Chỉnh'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs text-stone-300">
                    {remixResult.taboosTriggered.length === 0
                      ? '✓ Chuẩn 100% quy chuẩn Y quan Triều Nguyễn'
                      : `⚠️ Bị trừ điểm do dính ${remixResult.taboosTriggered.length} lỗi Taboos`}
                  </span>
                </div>
              </div>

              {/* 3 Metric Bars */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Chuẩn Quy Chế Triều Nguyễn</span>
                    <span className="text-[#c5a059] font-bold">{remixResult.scoreBreakdown.yQuanStandard}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#22222e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#c5a059] rounded-full transition-all duration-700" 
                      style={{ width: `${remixResult.scoreBreakdown.yQuanStandard}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Độ Slay & Phong Cách Gen Z</span>
                    <span className="text-emerald-400 font-bold">{remixResult.scoreBreakdown.genZFashion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#22222e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                      style={{ width: `${remixResult.scoreBreakdown.genZFashion}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Khí Chất Đoan Trang & Sang Trọng</span>
                    <span className="text-indigo-400 font-bold">{remixResult.scoreBreakdown.eleganceVibe}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#22222e] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
                      style={{ width: `${remixResult.scoreBreakdown.eleganceVibe}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Color Palette Card */}
              <div className="pt-3 border-t border-[#23232c] space-y-2">
                <span className="text-xs text-stone-400 font-medium">
                  Bảng màu phối hợp:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {remixResult.paletteItems.map(p => (
                    <div key={p.name} className="p-2 rounded-lg bg-[#0e0e13] border border-[#22222a] flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-white/20 shrink-0" style={{ backgroundColor: p.hex }} />
                      <div className="min-w-0">
                        <div className="text-xs text-stone-200 truncate font-medium">{p.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{p.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 2. STYLIST FEEDBACK & ITEMS BREAKDOWN (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Persona Stylist Speech Box */}
              <div className="bg-[#141418] border border-[#262634] rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#c5a059] text-[#0d0d10] font-bold text-xs flex items-center justify-center">
                    SV
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#f5f2eb]">
                      Stylist Cổ Phục Viễn Đông
                    </h4>
                    <span className="text-xs text-[#c5a059]">Chuyên gia Y quan Nguyễn & Fashion Gen Z</span>
                  </div>
                </div>

                <div className="text-sm text-stone-200 leading-relaxed bg-[#0e0e13] p-4 rounded-lg border border-[#20202a]">
                  {remixResult.stylistFeedback}
                </div>
              </div>

              {/* Outfit Breakdown Cards with thumbnails */}
              <div className="bg-[#141418] border border-[#23232c] rounded-xl p-5 space-y-3.5">
                <h4 className="text-xs font-semibold text-stone-400">
                  Chi tiết danh mục trang phục & phụ kiện:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Item 1: Áo Cổ Phục Chính */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] space-y-1">
                    <span className="text-[11px] text-[#c5a059] font-medium">Áo Cổ Phục Chính</span>
                    <div className="text-sm font-bold text-[#f5f2eb]">{remixResult.garment.name}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Chất liệu gấm tơ tằm dệt thủ công, phom dáng {remixResult.garment.dynasty}.
                    </p>
                  </div>

                  {/* Item 2: Áo Đơn Y */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] space-y-1">
                    <span className="text-[11px] text-stone-400 font-medium">Lớp Áo Lót Cốt Cách</span>
                    <div className="text-sm font-bold text-[#f5f2eb]">{remixResult.selectedItems.layer.name}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {remixResult.selectedItems.layer.description}
                    </p>
                  </div>

                  {/* Item 3: Cúc Áo */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] flex items-center gap-3">
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.button.id, remixResult.selectedItems.button.thumbnailUrl)}
                      alt={remixResult.selectedItems.button.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-400 font-medium">Khuy Cúc Ngũ Thường</span>
                      <div className="text-sm font-bold text-[#f5f2eb] truncate">{remixResult.selectedItems.button.name}</div>
                      <p className="text-xs text-stone-300 leading-relaxed truncate">
                        {remixResult.selectedItems.button.description}
                      </p>
                    </div>
                  </div>

                  {/* Item 4: Thân Dưới */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] flex items-center gap-3">
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.bottom.id, remixResult.selectedItems.bottom.thumbnailUrl)}
                      alt={remixResult.selectedItems.bottom.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-400 font-medium">Thân Dưới Remix</span>
                      <div className="text-sm font-bold text-[#f5f2eb] truncate">{remixResult.selectedItems.bottom.name}</div>
                      <p className="text-xs text-stone-300 leading-relaxed truncate">
                        {remixResult.selectedItems.bottom.description}
                      </p>
                    </div>
                  </div>

                  {/* Item 5: Giày */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] flex items-center gap-3">
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.shoes.id, remixResult.selectedItems.shoes.thumbnailUrl)}
                      alt={remixResult.selectedItems.shoes.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-400 font-medium">Giày / Guốc</span>
                      <div className="text-sm font-bold text-[#f5f2eb] truncate">{remixResult.selectedItems.shoes.name}</div>
                      <p className="text-xs text-stone-300 leading-relaxed truncate">
                        {remixResult.selectedItems.shoes.description}
                      </p>
                    </div>
                  </div>

                  {/* Item 6: Phụ Kiện */}
                  <div className="p-3.5 rounded-lg bg-[#0e0e13] border border-[#202028] flex items-center gap-3">
                    <img 
                      src={getItemImageUrl(remixResult.selectedItems.accessory.id, remixResult.selectedItems.accessory.thumbnailUrl)}
                      alt={remixResult.selectedItems.accessory.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-400 font-medium">Phụ Kiện Đi Kèm</span>
                      <div className="text-sm font-bold text-[#f5f2eb] truncate">{remixResult.selectedItems.accessory.name}</div>
                      <p className="text-xs text-stone-300 leading-relaxed truncate">
                        {remixResult.selectedItems.accessory.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

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
        onUpdateImage={(itemId, dataUrl) => {
          const updated = { ...customItemImages, [itemId]: dataUrl };
          setCustomItemImages(updated);
          try {
            localStorage.setItem('vietphuc_custom_item_images', JSON.stringify(updated));
          } catch (err) {
            console.warn('Could not save to localStorage', err);
          }
        }}
        onResetImage={handleResetItemImage}
        onResetAll={() => {
          setCustomItemImages({});
          try {
            localStorage.removeItem('vietphuc_custom_item_images');
          } catch (err) {
            console.warn('Could not clear localStorage', err);
          }
        }}
      />

    </div>
  );
};
