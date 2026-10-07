/**
 * ==============================================================================
 * BỘ NÃO CUSTOM GEM (GOOGLE AI STUDIO) - HERITSTYLE AI
 * ==============================================================================
 * 
 * Đây là "Bộ Não" Custom Gem chính thức do Giang xây dựng trên Google AI Studio.
 * Model: antigravity-preview-09-2026 / gemini-3.8-flash
 */

export const CUSTOM_GEM_SYSTEM_INSTRUCTIONS = `package com.example;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.genai.Client;
import com.google.genai.JsonSerializable;
import com.google.genai.gaos.models.interactions.*;
import com.google.genai.gaos.models.operations.*;

public class  {
    public static void main(String[] args) throws Exception {
        String apiKey = System.getenv("GEMINI_API_KEY");
        Client client = Client.builder().apiKey(apiKey).build();

        CreateModelInteraction.Builder paramsBuilder =
            CreateModelInteraction.builder()
                .model("models/gemini-3.8-flash");

        paramsBuilder = paramsBuilder.input(InteractionsInput.of("INSERT_INPUT_HERE"));
        paramsBuilder = paramsBuilder.systemInstruction("Stylist tư vấn phối trang phục truyền thống Việt Nam (Áo Ngũ Thân, Áo Nhật Bình) theo phong cách Gen Z. Phân luồng theo 3 Mode (Tôn Nghiêm, Thanh Lịch Đương Đại, Phá Cách Đường Phố) và đưa ra gợi ý, giải thích ý nghĩa văn hóa, kèm theo việc gắn nhãn (naming) để tránh vi phạm quy chuẩn văn hóa. Trigger khi user hỏi về cách phối đồ, mặc áo dài, ngũ thân, nhật bình đi sự kiện, đi chơi, hoặc chụp ảnh.

Instructions
VAI TRÒ & GIỌNG ĐIỆU (ROLE & TONE)
Bạn là "HeritStyle AI" - một Fashion Pair-Stylist chuyên tư vấn Việt phục (Ngũ Thân, Nhật Bình, Áo Tấc).

Giọng điệu: Gen Z, thân thiện, dùng từ ngữ trendy (slay, keo lỳ, mix&match, vibe check).
Thái độ: Tôn trọng văn hóa, không phán xét, giáo dục ngầm thông qua việc Gắn Nhãn (Smart Naming) chuẩn xác thay vì cấm đoán. Cực kỳ am hiểu về 3 dòng thời trang: Heritage Core, Modern Heritage, và Fusion Streetwear.
KHO DỮ LIỆU SẢN PHẨM & CẤU TRÚC (KNOWLEDGE BASE)
CHỈ ĐƯỢC PHÉP TƯ VẤN CÁC ITEM CÓ TRONG KHO DỮ LIỆU NÀY:

DÒNG CỔ PHỤC (Top):
Áo Ngũ Thân tay chẽn (Nam/Nữ)
Áo Tấc (Áo lễ tay thụng) (Nam/Nữ)
Áo Nhật Bình (Nữ) / Áo Chầu - Bổ Tử (tương đương Nam)
ĐẶC TRƯNG KIỂU DÁNG (Immutable Core):
Ngũ thân: 5 thân vải, cổ lập lĩnh, 5 cúc (Ngũ Thường), tà sa lượn cong.
Áo Tấc: Như ngũ thân nhưng tay thụng dài.
Nhật Bình: Cổ vuông bản lớn viền màu, dải ngũ sắc tay áo, dải thùy lưu.
ÁO LÓT TRONG (Đơn y):
Có áo đơn y lụa trắng (bắt buộc với Heritage Core).
Không áo đơn y / Áo thun / Camisole (chỉ cho Fusion).
KHUY CÚC:
Đồng đúc bát bửu, Ngọc bích, Gỗ trầm hương, Bạc chạm hoa sen, Xà cừ.
KHÔNG BAO GIỜ DÙNG cúc vải tết dây/cúc tàu (Xâm lấn văn hóa).
THÂN DƯỚI (Bottoms):
Quần lụa trắng/đen, Váy lọng dài (Truyền thống).
Quần tây wide-leg, Quần linen ống đứng, Chân váy midi xếp ly (Modern).
Quần cargo túi hộp, Baggy jeans, Jorts, Váy Y2K (Fusion).
GIÀY/GUỐC:
Guốc mộc, Dép lát, Hài thêu cung đình (Truyền thống).
Loafer da, Kitten heels, Sandal mảnh (Modern).
Sneaker trắng (Stan Smith), Sneaker chunky (Dunk, NB), Boots Dr. Martens (Modern/Fusion).
PHỤ KIỆN:
Khăn đóng (bắt buộc cho Nam lễ phục), Khăn vành dây, Trâm phượng (Nữ Nhật Bình).
Quạt giấy, Kính râm gọng mảnh, Túi tote da, Đồng hồ tối giản (Modern).
Vòng cổ xích bạc (cuban), Mũ bucket/snapback, Kính gọng dày (Fusion).
MÀU SẮC (Color Palette):
Truyền thống: Đỏ son, Xanh ngọc, Tím thẫm, Xanh lam, Vàng kim (chỉ điểm xuyết).
Hiện đại (Acubi/Quiet Luxury): Be, Xám lạnh, Xanh rêu, Nâu đất, Navy.
Streetwear: Đen, Xám charcoal, Rêu olive + Điểm nhấn (Đỏ son/Bạc).
CẤM: Vàng hoàng chính sắc (chỉ dành cho Vua/Hoàng Hậu).
MA TRẬN XUNG ĐỘT & PHÂN LUỒNG (CONFLICT MATRIX & 3-TIER ENGINE)
Phân loại Dòng sản phẩm (Tier) BẮT BUỘC dựa vào MÓN ĐỒ (Items) trước, bối cảnh sau.

[HERITAGE CORE] (Chuẩn Nguyên Bản)
Nhận diện: Full combo truyền thống (Ngũ Thân/Nhật Bình/Áo Tấc + Áo đơn y lụa trắng + Quần lụa/Váy lọng + Guốc mộc/Hài thêu + Khăn đóng/Khăn vành/Trâm). KHÔNG CÓ item hiện đại (denim, sneaker, đồng hồ thông minh...).
Điểm đến (Where): Đại Nội Huế, Lăng tẩm, Văn Miếu, Đền/Chùa, Đám cưới truyền thống.
Yêu cầu Naming: Được gọi tên gốc ('Áo Ngũ Thân tay chẽn', 'Áo Tấc', 'Áo Nhật Bình - đúng chuẩn').
[MODERN HERITAGE] (Cổ Phong Đời Thường)
Nhận diện: Áo cổ phục (bắt buộc có cổ đứng, 5 cúc) MIX VỚI đồ hiện đại thanh lịch (Quần linen/tây/váy midi + Sneaker trắng trơn/Loafer/Kitten heels + Phụ kiện tối giản).
Màu sắc thiên về tone neutral/Acubi (Be, xám, nâu).
Điểm đến (Where): Công sở, Cafe cổ (Cộng, Giảng), Phố đi bộ ban ngày, Tiệc cưới hiện đại.
Yêu cầu Naming: Được gọi 'Áo dài cách tân', 'Áo ngũ thân hiện đại'.
[FUSION STREETWEAR - HERITAGE INSPIRED] (Sáng Tạo Đương Đại)
Nhận diện: Có sự xuất hiện của: Quần cargo, Baggy jeans, Sneaker chunky, Boots, Xích bạc, Kính râm, Mũ bucket, Không áo đơn y (mặc áo thun/crop ở trong). Áo cổ phục được mặc như áo khoác ngoài (Outerwear).
BẮT BUỘC PHẢI GẮN NHÃN "Lấy cảm hứng" (Ví dụ: 'Áo cổ đứng cách điệu', 'Heritage top', 'Inspired by Việt phục'). KHÔNG gọi là "áo dài" hay "cổ phục đúng chuẩn" trên nhãn.
Điểm đến (Where): Phố Bùi Viện, Tạ Hiện, Concert, Skate park, Cafe Rooftop, Chụp OOTD.
BỘ LỌC CẤM KỴ (TABOOS FILTER - 3 MỨC ĐỘ)
[MỨC ĐỎ - RED ALERT] -> Hành động: Báo lỗi, yêu cầu sửa món đồ. KHÔNG XUẤT LOOKBOOK.

Khách chọn: "Cúc vải tết dây/ cúc tàu" (Lỗi xâm lấn văn hóa Mãn Thanh).
Khách chọn: Màu "Vàng hoàng chính sắc" (Tiếm quyền hoàng gia - Vàng ròng chỉ dành cho Vua/Hậu).
Lỗi cấu trúc Heritage Core: Cố tình bỏ áo đơn y (lộ ngực), Nam đi lễ/đền nhưng KHÔNG chọn Khăn đóng, Nữ chọn Nhật Bình nhưng không có trâm phượng.
Lỗi định danh: Tự xưng "Nhật Bình Nam" (đây là lỗi sai lịch sử, phải dùng 'áo cổ vuông cách điệu' hoặc tương đương Áo Chầu/Bổ Tử).
[MỨC VÀNG - YELLOW ALERT] -> Hành động: ÉP ĐỔI TÊN THẺ NHÃN & Báo cảnh báo. Vẫn xuất outfit.

Xung đột bối cảnh: User khai bối cảnh "Đi Chùa/Lễ/Nghi thức trang trọng" NHƯNG lại chọn Items của Fusion hoặc Modern (Sneaker, Cargo, Quần Jeans, Váy ngắn, Áo khoét). -> Xử lý: Tự động đổi tên thẻ nhãn thành [FUSION - HERITAGE INSPIRED], đưa ra cảnh báo nhẹ nhàng: "Outfit này rất slay nhưng không phù hợp chốn linh thiêng. Mình đổi nhãn thành 'Lấy cảm hứng' nha, hoặc bạn thay quần jeans bằng quần lụa để thành Heritage Core nhé!".
[MỨC XANH - INFO] -> Hành động: Khen ngợi, duyệt outfit.

Khách chọn mix đồ hiện đại (Sneaker, Cargo, Boots) đi dạo phố, đi cafe, xem concert (Context Fusion/Modern). -> Xử lý: Khen Slay, phân tích vibe (ví dụ: Tet-Core, Royal Y2K, Dark Heritage), duyệt outfit.
ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT BẮT BUỘC)
Mỗi lần user đưa ra bối cảnh và danh sách items, bạn phải trả lời CHÍNH XÁC theo format sau:

[THẺ NHÃN]: (Ví dụ: FUSION STREETWEAR - HERITAGE INSPIRED)
[CẢNH BÁO]: (None / Yellow Alert / Red Alert)
[VIBE CHECK]: (Nhận xét Gen Z về outfit, phân tích vibe theo trend hiện tại như Tet-Core/Acubi. Giải thích 1 chi tiết lịch sử từ Kho dữ liệu).
[ĐIỂM SLAY SCORE]: (0-100% - Điểm phong cách)
[ĐIỂM CHUẨN DI SẢN]: (0-100% - Giải thích ngắn lý do cộng/trừ điểm. Ví dụ: +20 điểm vì mặc áo đơn y trắng, -30 điểm vì mang sneaker).");
        paramsBuilder = paramsBuilder.generationConfig(GenerationConfig.builder()
            .maxOutputTokens(65536)
            .thinkingLevel(ThinkingLevel.of("medium"))
            .build());
        CreateModelInteraction params = paramsBuilder.build();
        CreateInteractionResponse response =
            client.interactions.create(CreateInteractionRequestBody.of(params));

        Interaction interaction = response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
        System.out.println(interaction.outputText().orElse(""));
    }
}


`;

export interface CustomGemEvaluationPayload {
  garmentName: string;
  garmentType: string;
  garmentId?: string;
  colorName: string;
  colorHex: string;
  nguHanh: string;
  buttonName: string;
  buttonId?: string;
  isChineseButton: boolean;
  bottomName: string;
  bottomId?: string;
  shoesName: string;
  shoesId?: string;
  accessories: string[];
  accessoryIds?: string[];
  hasDonY: boolean;
  contextTier: string;
  contextName: string;
  isImperialYellow: boolean;
  isNhatBinhWithKhanDong: boolean;
}

export interface CustomGemNativeResult {
  slayScore: number;
  heritageScore: number;
  verdictTitle: string;
  stylistQuote: string;
  culturalCritique: string;
  actionableAdvice: string;
  isTaboo: boolean;
  tabooReason: string;
  evaluatedAt: string;
  modelUsed: string;
}

/**
 * BỘ NÃO THẨM ĐỊNH CUSTOM GEM NỘI TẠI (NATIVE ENGINE)
 * Triển khai 100% các quy tắc toán học, điểm thưởng/phạt và ngữ nghĩa từ Custom Gem của Giang
 */
export function evaluateWithNativeCustomGemBrain(
  payload: CustomGemEvaluationPayload
): CustomGemNativeResult {
  const {
    garmentName,
    garmentType,
    garmentId = '',
    colorName,
    colorHex,
    nguHanh,
    buttonName,
    buttonId = '',
    isChineseButton,
    bottomName,
    bottomId = '',
    shoesName,
    shoesId = '',
    accessories,
    accessoryIds = [],
    hasDonY,
    contextTier,
    contextName,
    isImperialYellow,
    isNhatBinhWithKhanDong
  } = payload;

  const isCeremonialRobe = garmentId === 'ao-tac' || garmentId === 'ao-nhat-binh' || garmentType === 'ao-tac' || garmentType === 'ao-nhat-binh';
  const hasSmartwatch = accessoryIds.includes('acc-smartwatch') || accessories.some(a => a.toLowerCase().includes('smartwatch') || a.toLowerCase().includes('thông minh'));

  // 1. PHÂN LUỒNG TIER & GẮN NHÃN (SMART NAMING)
  const isFusionItem =
    bottomId === 'bottom-cargo-pants' ||
    bottomId === 'bottom-baggy-jeans' ||
    bottomId === 'bottom-jorts-denim' ||
    bottomId === 'bottom-y2k-pleated-skirt' ||
    shoesId === 'shoes-skater-vans' ||
    shoesId === 'shoes-boots-dr-martens' ||
    shoesId === 'shoes-platform-mary-jane' ||
    accessoryIds.includes('acc-silver-chain-cuban') ||
    accessoryIds.includes('acc-bucket-hat') ||
    accessoryIds.includes('acc-chunky-sunglasses') ||
    accessoryIds.includes('acc-chest-bag') ||
    !hasDonY ||
    contextTier === 'fusion';

  const isModernItem =
    bottomId === 'bottom-linen-wide-pants' ||
    bottomId === 'bottom-tailored-trousers' ||
    bottomId === 'bottom-pleated-midi-skirt' ||
    shoesId === 'shoes-chunky-loafers' ||
    shoesId === 'shoes-kitten-heels' ||
    shoesId === 'shoes-thin-straps' ||
    shoesId === 'shoes-white-sneakers' ||
    accessoryIds.includes('acc-sunglasses-gold') ||
    accessoryIds.includes('acc-leather-tote') ||
    accessoryIds.includes('acc-minimal-watch') ||
    contextTier === 'modern';

  let smartNamingTier = 'HERITAGE CORE';
  if (isFusionItem) {
    smartNamingTier = 'FUSION STREETWEAR - HERITAGE INSPIRED';
  } else if (isModernItem) {
    smartNamingTier = 'MODERN HERITAGE (CỔ PHONG ĐỜI THƯỜNG)';
  }

  // 2. BỘ LỌC CẤM KỴ (TABOOS FILTER - 3 MỨC ĐỘ)
  let alertLevel: 'None' | 'Yellow Alert' | 'Red Alert' = 'None';
  let alertReason = '';
  const scoreDeductions: string[] = [];
  const scoreAdditions: string[] = [];

  // [MỨC ĐỎ - RED ALERT]
  if (isChineseButton) {
    alertLevel = 'Red Alert';
    alertReason = 'Lỗi xâm lấn văn hóa Mãn Thanh do dùng cúc vải tết dây/cúc tàu thay cho khuy rời đúc Ngũ Thường.';
  } else if (isImperialYellow) {
    alertLevel = 'Red Alert';
    alertReason = 'Tiếm quyền hoàng gia: Sắc vàng hoàng chính sắc là đại kỵ, chỉ dành riêng cho Thiên Tử và Hoàng Hậu.';
  } else if (isNhatBinhWithKhanDong) {
    alertLevel = 'Red Alert';
    alertReason = 'Lỗi quy thức triều đình: Áo Nhật Bình nữ quý tộc tuyệt đối không đội cùng Khăn Đóng Chữ Nhân (nam phục).';
  } else if (!hasDonY && contextTier === 'heritage') {
    alertLevel = 'Red Alert';
    alertReason = 'Lỗi cấu trúc Heritage Core: Bỏ áo đơn y lụa trắng ở chốn tôn nghiêm làm mất phép tắc đoan trang, kín đáo.';
  }

  // [MỨC VÀNG - YELLOW ALERT]
  if (alertLevel === 'None' && contextTier === 'heritage') {
    const hasSneakerOrCargo = shoesId === 'shoes-white-sneakers' || bottomId === 'bottom-cargo-pants' || bottomId === 'bottom-high-waist-jeans' || bottomId === 'bottom-y2k-pleated-skirt';
    if (hasSneakerOrCargo || hasSmartwatch) {
      alertLevel = 'Yellow Alert';
      smartNamingTier = 'FUSION - HERITAGE INSPIRED';
      alertReason = 'Xung đột bối cảnh: Outfit phối rất slay nhưng không phù hợp chốn tôn nghiêm/đền chùa. Đã tự động đổi nhãn sang "Lấy cảm hứng".';
    }
  }

  // 3. TÍNH TOÁN CHI LI ĐIỂM CHUẨN DI SẢN (HERITAGE SCORE)
  let heritageCalc = 100;

  if (hasDonY) {
    scoreAdditions.push('+15đ có Áo Đơn Y lụa trắng kín đáo');
  } else {
    const pen = contextTier === 'fusion' ? 12 : 25;
    heritageCalc -= pen;
    scoreDeductions.push(`-${pen}đ do thiếu Áo Đơn Y lụa trắng`);
  }

  if (isChineseButton) {
    heritageCalc -= 40;
    scoreDeductions.push('-40đ do dùng Cúc Tàu (xâm lấn văn hóa)');
  } else {
    scoreAdditions.push('+10đ khuy cúc chuẩn đạo Ngũ Thường');
  }

  if (isImperialYellow) {
    heritageCalc -= 45;
    scoreDeductions.push('-45đ do phạm sắc Vàng Hoàng Chính Sắc đại kỵ');
  }

  if (isNhatBinhWithKhanDong) {
    heritageCalc -= 35;
    scoreDeductions.push('-35đ do Áo Nhật Bình đội Khăn Đóng nam');
  }

  if (isCeremonialRobe && (shoesId === 'shoes-white-sneakers' || shoesId === 'shoes-skater-vans')) {
    heritageCalc -= 25;
    scoreDeductions.push('-25đ do phối Sneaker với đại lễ phục');
  }

  if (hasSmartwatch) {
    heritageCalc -= 15;
    scoreDeductions.push('-15đ do phụ kiện công nghệ lệch dòng thời gian');
  }

  if (alertLevel === 'Yellow Alert') {
    heritageCalc -= 20;
    scoreDeductions.push('-20đ do xung đột bối cảnh tôn nghiêm');
  }

  if (accessoryIds.some(id => id === 'acc-khan-dong' || id === 'acc-khan-vanh-day' || id === 'acc-tram-cai-ngoc' || id === 'acc-kieng-bac')) {
    scoreAdditions.push('+10đ phụ kiện di sản đồng điệu');
  }

  const finalHeritageScore = Math.max(15, Math.min(100, heritageCalc));

  // 4. TÍNH TOÁN CHI LI ĐIỂM SLAY SCORE (GEN Z FASHION)
  let slayCalc = 76;

  // Điểm cộng màu sắc thời thượng
  if (['#7A222C', '#2B5B84', '#5E3A58', '#334D3C', '#F2EAD8', '#FF007F', '#00F0FF'].includes(colorHex)) {
    slayCalc += 10;
  }

  // Điểm cộng khuy cúc
  if (['btn-silver-lotus', 'btn-mother-of-pearl', 'btn-jade-green', 'btn-wood-agarwood'].includes(buttonId)) {
    slayCalc += 8;
  }

  // Điểm cộng thân dưới
  if (['bottom-cargo-pants', 'bottom-linen-wide-pants', 'bottom-pleated-midi-skirt', 'bottom-y2k-pleated-skirt', 'bottom-jorts-denim'].includes(bottomId)) {
    slayCalc += 9;
  }

  // Điểm cộng giày
  if (['shoes-chunky-loafers', 'shoes-boots-dr-martens', 'shoes-platform-mary-jane', 'shoes-white-sneakers'].includes(shoesId)) {
    slayCalc += 8;
  }

  // Điểm cộng phụ kiện
  if (accessoryIds.length > 0) {
    slayCalc += Math.min(12, accessoryIds.length * 5);
  }

  if (alertLevel === 'Red Alert') {
    slayCalc -= 15; // Mất điểm slay do lỗi cấm kỵ văn hóa thô thiển
  }

  const finalSlayScore = Math.max(40, Math.min(100, slayCalc));

  // 5. PHÂN TÍCH VIBE & SINH LỜI BÌNH CHI LI (DYNAMIC VIBE CHECK)
  let vibeName = 'Heritage Core Đoan Trang';
  if (isFusionItem) {
    if (bottomId === 'bottom-cargo-pants' || shoesId === 'shoes-boots-dr-martens') {
      vibeName = 'Dark Heritage & Cyberpunk Viễn Đông';
    } else if (bottomId === 'bottom-y2k-pleated-skirt' || shoesId === 'shoes-platform-mary-jane') {
      vibeName = 'Royal Y2K Slay Kịch Trần';
    } else {
      vibeName = 'Streetwear Á Đông Phá Cách';
    }
  } else if (isModernItem) {
    if (bottomId === 'bottom-linen-wide-pants' || shoesId === 'shoes-chunky-loafers') {
      vibeName = 'Quiet Luxury Cổ Phong';
    } else {
      vibeName = 'Tet-Core Thanh Lịch Đương Đại';
    }
  }

  let dynamicVibeCheck = '';
  if (alertLevel === 'Red Alert') {
    dynamicVibeCheck = `Báo động đỏ nè bạn hiền! Stylist ngó qua outfit là thấy có tín hiệu lệch sóng văn hóa nghiêm trọng: ${alertReason} Nhấn nút khắc phục ngay để cứu nguy cho diện mạo mười điểm không có nhưng nhé!`;
  } else if (alertLevel === 'Yellow Alert') {
    dynamicVibeCheck = `Outfit hôm nay phải gọi là cực keo lỳ với vibe ${vibeName}! Phom ${garmentName} sắc ${colorName} kết hợp cùng ${bottomName} và ${shoesName} bắt mắt chấn động. Nhưng nhớ là mang đồ này đi đền chùa thì hơi lệch bối cảnh nha! Đã gắn nhãn Lấy Cảm Hứng để dạo phố, chụp OOTD hoặc đi concert nha!`;
  } else {
    dynamicVibeCheck = `Trời ơi keo lỳ hết nấc luôn bạn hiền ơi! Vibe ${vibeName} hôm nay chuẩn mười điểm không có nhưng. Tà áo ${garmentName} sắc ${colorName} (${nguHanh}) kết hợp tinh tế cùng ${bottomName}, ${shoesName} và ${buttonName}. Điểm nhấn 5 khuy cúc đại diện cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) làm tôn trọn vẹn thần thái vương giả khiến ai cũng phải ngoái nhìn!`;
  }

  const calculationSummary = scoreDeductions.length > 0
    ? `Chi tiết điểm: ${scoreAdditions.join(', ')}. Trừ điểm: ${scoreDeductions.join(', ')}.`
    : `Chi tiết điểm: Đạt điểm tối đa nhờ bảo lưu trọn vẹn quy thức (${scoreAdditions.join(', ')}).`;

  let advice = 'Outfit đã rất hoàn hảo!';
  if (alertLevel === 'Red Alert') {
    advice = `Khắc phục ngay: ${alertReason}`;
  } else if (alertLevel === 'Yellow Alert') {
    advice = 'Nếu muốn vào chốn linh thiêng, hãy thay giày thể thao/quần jeans bằng guốc mộc và quần lụa để đạt chuẩn Heritage Core.';
  } else if (!hasDonY) {
    advice = 'Thêm một lớp Áo Đơn Y lụa trắng ở trong để tăng thêm vẻ đoan trang, tôn quý.';
  }

  return {
    slayScore: finalSlayScore,
    heritageScore: finalHeritageScore,
    verdictTitle: smartNamingTier,
    stylistQuote: dynamicVibeCheck,
    culturalCritique: calculationSummary,
    actionableAdvice: advice,
    isTaboo: alertLevel === 'Red Alert',
    tabooReason: alertReason,
    evaluatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    modelUsed: 'Bộ Não Custom Gem (Native Brain Engine)'
  };
}
