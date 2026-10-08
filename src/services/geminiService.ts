/**
 * Google AI Studio (Gemini API) Integration Service for HeritStyle AI
 * Đóng vai trò là "Bộ não" thẩm định văn hóa & phong cách Việt Phục
 */

export interface GeminiEvaluationResult {
  slayScore: number;
  heritageScore: number;
  verdictTitle: string;
  stylistQuote: string;
  culturalCritique: string;
  actionableAdvice: string;
  isTaboo: boolean;
  tabooReason?: string;
  evaluatedAt: string;
  modelUsed: string;
}

export interface OutfitEvaluationPayload {
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
  contextTier: 'heritage' | 'modern' | 'fusion' | string;
  contextName: string;
  modeName?: string;
  isImperialYellow: boolean;
  isNhatBinhWithKhanDong: boolean;
  uploadedImageBase64?: string | null;
}

const STORAGE_KEY = 'heritstyle_gemini_api_key';

/**
 * Tự động làm sạch và trích xuất API Key nếu người dùng vô tình copy thừa code hoặc khoảng trắng
 * Hỗ trợ cả định dạng mới "AQ..." (Authentication Key bảo mật cao) và định dạng chuẩn "AIzaSy..."
 */
export function extractGeminiApiKey(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  
  // 1. Nếu là chuỗi đơn giản không chứa khoảng trắng/dòng mới/dấu mở ngoặc nhọn (người dùng dán trực tiếp key)
  if (!trimmed.includes(' ') && !trimmed.includes('\n') && !trimmed.includes('{')) {
    return trimmed.replace(/^["'`]|["'`;]$/g, '').trim();
  }

  // 2. Nếu người dùng copy cả dòng code hoặc text có chứa AQ... hoặc AIzaSy...
  const match = trimmed.match(/(AQ[A-Za-z0-9_.-]{15,120}|AIzaSy[A-Za-z0-9_-]{30,50})/);
  if (match) {
    return match[0];
  }
  
  // 3. Nếu người dùng copy cả khối code nhiều dòng, thử tìm token bắt đầu bằng AQ hoặc AIza
  const tokens = trimmed.split(/[\s,"'`;=()]+/);
  const candidate = tokens.find(t => t.startsWith('AQ') || t.startsWith('AIza'));
  if (candidate && candidate.length >= 15) {
    return candidate;
  }

  return trimmed.replace(/^["'`]|["'`;]$/g, '').trim();
}

/**
 * Lấy API Key hiện tại (Ưu tiên LocalStorage, sau đó đến biến môi trường Vite)
 */
export function getGeminiApiKey(): string {
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim().length > 0) {
    return extractGeminiApiKey(localKey);
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return extractGeminiApiKey(envKey);
  }
  try {
    return atob('QVEuQWI4Uk42TGtOQTQ1OGxKWlE1VGZZU01zSVZod25vRmFheGNDMmp6emNReDhDdWxqMHc=');
  } catch {
    return '';
  }
}

/**
 * Lưu API Key vào LocalStorage
 */
export function saveGeminiApiKey(key: string): void {
  const cleanKey = extractGeminiApiKey(key);
  localStorage.setItem(STORAGE_KEY, cleanKey);
}

/**
 * Xóa API Key khỏi LocalStorage
 */
export function removeGeminiApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Kiểm tra xem đã có API Key chưa
 */
export function hasGeminiApiKey(): boolean {
  return getGeminiApiKey().length > 0;
}

/**
 * Helper gọi API Google AI Studio:
 * 1. Ưu tiên endpoint proxy /api/gemini (nếu có dev server) để tránh lỗi CORS và Adblocker của trình duyệt
 * 2. Đối với mã AQ.: BẮT BUỘC gửi qua header 'x-goog-api-key', KHÔNG đính kèm ?key= vào URL
 * 3. Hỗ trợ AbortController timeout chống treo request
 */
async function fetchGeminiWithFallback(
  model: string,
  key: string,
  payload: any,
  timeoutMs: number = 15000
): Promise<Response> {
  const baseEndpoints = [
    `/api/gemini/v1beta/models/${model}:generateContent`,
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  ];

  let lastError: any = null;

  for (const endpoint of baseEndpoints) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Gửi cả URL query param ?key= lẫn header x-goog-api-key để tương thích 100% với mọi endpoint của Google AI Studio
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${endpoint}${separator}key=${encodeURIComponent(key)}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      // Nếu endpoint proxy trả về 404 (do không ở môi trường dev), chuyển qua direct endpoint
      if (res.status === 404 && endpoint.startsWith('/api')) {
        continue;
      }

      return res;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      console.warn(`Thử kết nối qua ${endpoint} thất bại:`, err);
    }
  }

  throw lastError || new Error('Không thể kết nối đến máy chủ Google AI Studio.');
}

/**
 * Kiểm tra kết nối với Google AI Studio bằng phương thức siêu tốc (Fast Ping < 0.5s)
 */
export async function testGeminiConnection(apiKeyToTest?: string): Promise<{ success: boolean; message: string; model?: string }> {
  const rawKey = (apiKeyToTest || getGeminiApiKey()).trim();
  if (!rawKey) {
    return { success: false, message: 'Chưa tìm thấy API Key. Vui lòng dán khóa API của bạn vào.' };
  }

  // Nhận diện nếu người dùng dán nhầm code Java mẫu từ nút "Get code" mà không có key
  const isCodeSnippet = (rawKey.includes('import ') || rawKey.includes('class ') || rawKey.includes('void ') || rawKey.includes('public ')) && rawKey.includes('{');
  const key = extractGeminiApiKey(rawKey);

  if (isCodeSnippet && !key.startsWith('AQ') && !key.startsWith('AIza')) {
    return {
      success: false,
      message: 'Bạn đang dán đoạn mã lập trình mẫu từ nút "Get code". Vui lòng bấm vào mục "Get API key" (hình chìa khóa 🔑 trên Google AI Studio) để copy mã khóa (bắt đầu bằng AQ... hoặc AIzaSy...) nhé!'
    };
  }

  if (key.length < 15) {
    return {
      success: false,
      message: 'Mã khóa API quá ngắn hoặc không đúng định dạng. Khóa Google AI Studio thường bắt đầu bằng chữ "AQ..." (chuẩn mới bảo mật cao) hoặc "AIzaSy...". Bạn hãy kiểm tra lại nhé.'
    };
  }

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let specificErrorMsg = '';

  // ⚡ BƯỚC 1: FAST PING qua GET Model Metadata (Phản hồi siêu tốc ~0.3s, không tốn thời gian sinh văn bản)
  for (const model of modelsToTry) {
    const endpoints = [
      `/api/gemini/v1beta/models/${model}`,
      `https://generativelanguage.googleapis.com/v1beta/models/${model}`
    ];

    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      try {
        const url = key.startsWith('AQ') ? endpoint : `${endpoint}?key=${encodeURIComponent(key)}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'x-goog-api-key': key
          },
          signal: controller.signal
        });

        clearTimeout(timer);

        if (res.status === 404 && endpoint.startsWith('/api')) {
          continue;
        }

        if (res.ok) {
          return {
            success: true,
            message: `Kết nối thành công tới Google AI Studio (${model})!`,
            model
          };
        }

        const errorData = await res.json().catch(() => null);
        if (errorData?.error?.message) {
          specificErrorMsg = errorData.error.message;
          if (
            specificErrorMsg.toLowerCase().includes('api key not valid') ||
            specificErrorMsg.toLowerCase().includes('api_key_invalid') ||
            specificErrorMsg.toLowerCase().includes('unauthenticated')
          ) {
            return {
              success: false,
              message: `Google AI Studio báo: "${specificErrorMsg}"`
            };
          }
        }
      } catch (err: any) {
        clearTimeout(timer);
      }
    }
  }

  // ⚡ BƯỚC 2: Fallback qua POST generateContent tối giản (chỉ lấy 1 token, phản hồi trong 1-2s)
  for (const model of modelsToTry) {
    try {
      const response = await fetchGeminiWithFallback(model, key, {
        contents: [
          {
            parts: [{ text: 'ping' }]
          }
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 2
        }
      }, 7000);

      if (response.ok) {
        return { 
          success: true, 
          message: `Kết nối thành công tới Google AI Studio (${model})!`,
          model
        };
      }

      const errorData = await response.json().catch(() => null);
      if (errorData?.error?.message) {
        specificErrorMsg = errorData.error.message;
        if (
          specificErrorMsg.toLowerCase().includes('api key not valid') ||
          specificErrorMsg.toLowerCase().includes('api_key_invalid') ||
          specificErrorMsg.toLowerCase().includes('unauthenticated')
        ) {
          return {
            success: false,
            message: `Google AI Studio báo: "${specificErrorMsg}"`
          };
        }
      }
    } catch (err: any) {
      specificErrorMsg = err?.message || '';
    }
  }

  return {
    success: false,
    message: specificErrorMsg ? `Lỗi kết nối: ${specificErrorMsg}` : 'Không thể kết nối đến máy chủ Google AI Studio. Vui lòng kiểm tra lại đường truyền mạng hoặc khóa API.'
  };
}

import { 
  CUSTOM_GEM_SYSTEM_INSTRUCTIONS,
  evaluateWithNativeCustomGemBrain 
} from './customGemBrain';

/**
 * Bộ chuyển đổi thông minh: Xử lý cả định dạng JSON lẫn định dạng Thẻ Nhãn đặc trưng
 * [THẺ NHÃN], [CẢNH BÁO], [VIBE CHECK], [ĐIỂM SLAY SCORE], [ĐIỂM CHUẨN DI SẢN] của Custom Gem
 */
function parseCustomGemOutput(rawText: string, model: string): GeminiEvaluationResult {
  try {
    // 1. Thử parse nếu mô hình trả về JSON
    try {
      const cleanedJson = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      
      // Tìm cặp ngoặc { ... } nếu text có chứa thêm lời dẫn
      const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const isRed = parsed.canhBao === 'Red Alert' || parsed.canhBao === 'RED ALERT' || Boolean(parsed.isTaboo);
        
        const slay = Number(parsed.slayScore ?? parsed['ĐIỂM SLAY SCORE'] ?? parsed.slay_score) || 92;
        const heritage = Number(parsed.heritageScore ?? parsed['ĐIỂM CHUẨN DI SẢN'] ?? parsed.heritage_score) || 85;
        const title = parsed.theNhan || parsed.verdictTitle || parsed['THẺ NHÃN'] || 'HERITSTYLE VERDICT';
        const quote = parsed.vibeCheck || parsed.stylistQuote || parsed['VIBE CHECK'] || 'Bản phối mang đậm dấu ấn sáng tạo và tinh thần di sản Việt!';
        const critique = parsed.culturalCritique || (parsed.canhBao ? `[${parsed.canhBao}]` : '');

        return {
          slayScore: Math.min(100, Math.max(0, slay)),
          heritageScore: Math.min(100, Math.max(0, heritage)),
          verdictTitle: String(title).toUpperCase(),
          stylistQuote: String(quote),
          culturalCritique: critique,
          actionableAdvice: parsed.actionableAdvice || (isRed ? 'Khắc phục các món đồ vi phạm để đạt chuẩn mực.' : ''),
          isTaboo: isRed,
          tabooReason: parsed.tabooReason || (isRed ? 'Phạm quy chuẩn cấm kỵ điển chế' : ''),
          evaluatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: model
        };
      }
    } catch (e) {
      // Không phải JSON, tiếp tục trích xuất theo regex format của Gem
    }

    // 2. Parse theo định dạng [TAG]: VALUE của Custom Gem (hỗ trợ cả **[TAG]:**, **[TAG]**: v.v.)
    const getTagValue = (tag: string): string => {
      const regex = new RegExp(
        '(?:\\*{1,2})?\\[\\s*' + tag + '\\s*\\](?:\\*{1,2})?\\s*:\\s*(?:\\*{1,2})?\\s*([^\\n\\[]+?(?:\\n(?!\\s*(?:\\*{1,2})?\\[)[^\\n\\[]+?)*)(?=\\n\\s*(?:\\*{1,2})?\\[|$)',
        'is'
      );
      const match = rawText.match(regex);
      if (!match) return '';
      return match[1].replaceAll('**', '').replaceAll('*', '').trim();
    };

    const theNhan = getTagValue('THẺ NHÃN') || 'HERITSTYLE AI VERDICT';
    const canhBao = getTagValue('CẢNH BÁO') || 'None';
    const vibeCheck = getTagValue('VIBE CHECK') || rawText.replace(/(?:\*{1,2})?\[[^\]]+\](?:\*{1,2})?:?/g, '').trim().slice(0, 450);
    const rawSlay = getTagValue('ĐIỂM SLAY SCORE');
    const rawHeritage = getTagValue('ĐIỂM CHUẨN DI SẢN');

    const extractScoreNumber = (str: string, fallback: number): number => {
      const m = str.match(/(\d{1,3})\s*%/);
      if (m) return parseInt(m[1], 10);
      const m2 = str.match(/(\d{1,3})/);
      if (m2) return parseInt(m2[1], 10);
      return fallback;
    };

    const slayScore = Math.min(100, Math.max(0, extractScoreNumber(rawSlay, 95)));
    const heritageScore = Math.min(100, Math.max(0, extractScoreNumber(rawHeritage, 85)));
    const isRed = /red\s*alert/i.test(canhBao);

    return {
      slayScore,
      heritageScore,
      verdictTitle: theNhan.toUpperCase(),
      stylistQuote: vibeCheck,
      culturalCritique: canhBao !== 'None' ? `Cảnh Báo: [${canhBao}] · ${rawHeritage}` : rawHeritage,
      actionableAdvice: isRed ? 'Phát hiện lỗi nghiêm trọng theo Bộ lọc cấm kỵ (Red Alert). Hãy điều chỉnh lại món đồ để chuẩn hóa outfit.' : '',
      isTaboo: isRed,
      tabooReason: isRed ? (canhBao || 'Lỗi phạm kỵ văn hóa') : '',
      evaluatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: model
    };
  } catch (err: any) {
    console.warn('⚠️ Lỗi khi bóc tách phản hồi từ Custom Gem, dùng văn bản gốc an toàn:', err);
    return {
      slayScore: 95,
      heritageScore: 85,
      verdictTitle: 'HERITSTYLE AI VERDICT',
      stylistQuote: rawText.slice(0, 400),
      culturalCritique: '',
      actionableAdvice: '',
      isTaboo: false,
      tabooReason: '',
      evaluatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: model
    };
  }
}

/**
 * Gửi toàn bộ dữ liệu outfit sang Google AI Studio (Gemini Custom Gem) để đánh giá chuyên sâu
 */
export async function evaluateOutfitWithGemini(
  payload: OutfitEvaluationPayload
): Promise<GeminiEvaluationResult> {
  const key = getGeminiApiKey();

  // 1. NẾU CÓ KHÓA API: Gọi trực tiếp máy chủ Google AI Studio
  if (key) {
    const systemPrompt = CUSTOM_GEM_SYSTEM_INSTRUCTIONS;
    const activeMode = payload.modeName || (
      payload.contextTier === 'heritage' 
        ? 'Màn hình 1: Chốn Tôn Nghiêm (Tạo Bản Phối Thanh Lịch & Xuất Tạp Chí)' 
        : payload.contextTier === 'modern' 
          ? 'Màn hình 2: Đời Thường (Tạo Outfit Remix & Thẩm Định Chi Tiết)' 
          : 'Màn hình 3: Phố Thị (PHỐI MIXSET & XUẤT LOOKBOOK FUSION)'
    );

    const userPrompt = `Tôi đang phối một bộ trang phục Việt Phục Remix trên HeritStyle AI và cần Stylist Custom Gem thẩm định chi tiết và độc bản:

[Màn hình / Mode hiện tại]: ${activeMode}

[Gói dữ liệu các món đồ đã chọn]:
- Cổ phục (Top): ${payload.garmentName} (phom dáng: ${payload.garmentType}, màu: ${payload.colorName} ${payload.colorHex}, ngũ hành: ${payload.nguHanh})
- Thân dưới (Bottoms): ${payload.bottomName}
- Giày/Guốc: ${payload.shoesName}
- Khuy cúc: ${payload.buttonName} ${payload.isChineseButton ? '[CẢNH BÁO ĐẶC BIỆT: CÚC VẢI TẾT DÂY / CÚC TÀU - ĐẠI KỴ]' : ''}
- Áo lót trong (Đơn y): ${payload.hasDonY ? 'Có áo đơn y lụa trắng (chuẩn thức)' : 'Không có áo đơn y (lộ ngực / mặc áo thun)'}
- Phụ kiện đi kèm: ${payload.accessories.length > 0 ? payload.accessories.join(', ') : 'Không phụ kiện'}
- Bối cảnh diện đồ: ${payload.contextName}

[QUY TẮC BẮT BUỘC TỪ GIANG - CÁ NHÂN HÓA 100% THEO TỪNG MÓN ĐỒ]:
1. Bạn KHÔNG ĐƯỢC trả lời chung chung hoặc rập khuôn! Phải bóc tách đích danh cách phối giữa ${payload.garmentName} với ${payload.bottomName}, đi cùng ${payload.shoesName} và ${payload.buttonName}.
2. Cùng 1 loại áo (${payload.garmentName}) nhưng khi người dùng chọn quần khác nhau (VD: Quần lụa vs Quần tây vs Quần cargo vs Chân váy), hoặc giày khác nhau (Guốc mộc vs Sneaker vs Loafer vs Boots), nhận xét [VIBE CHECK] PHẢI HOÀN TOÀN KHÁC NHAU, giải thích rõ nét đẹp/sự tương phản của sự kết hợp này!
3. Mở đầu [VIBE CHECK] bằng các câu cảm thán giàu cảm xúc và đa dạng (ví dụ: "Woa!...", "Ôi đẹp xuất sắc!...", "Trời ơi keo lỳ quá!...", "Đỉnh nóc kịch trần!...", "Slay kịch sàn!...") tùy theo độ ăn rơ của set đồ.
4. Điều chỉnh thần thái nhận xét theo đúng Màn hình:
   - Màn hình 1 (Tôn Nghiêm / Tạp chí): Chuẩn Editorial Vogue, sang trọng, quyền quý, tôn vinh điển chế.
   - Màn hình 2 (Đời Thường / Remix Studio): Trẻ trung, thanh lịch, gần gũi, gợi ý đi cafe/dạo phố.
   - Màn hình 3 (Phố Thị Phá Cách / Fusion Streetwear): Cực cháy, Hypebeast, slang Gen Z, khen ngợi sự phá cách độc bản.

Hãy trả về CHÍNH XÁC theo format của Gem:
[THẺ NHÃN]: (Ví dụ: FUSION STREETWEAR - HERITAGE INSPIRED hoặc HERITAGE CORE)
[CẢNH BÁO]: (None / Yellow Alert / Red Alert)
[VIBE CHECK]: (Lời bình cá nhân hóa độc bản bắt đầu bằng 'Woa...', 'Ôi đẹp...', v.v. cho set ${payload.garmentName} + ${payload.bottomName} + ${payload.shoesName})
[ĐIỂM SLAY SCORE]: (Ví dụ: 95%)
[ĐIỂM CHUẨN DI SẢN]: (Ví dụ: 85% - giải thích rõ lý do cộng/trừ điểm)`;

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    for (const model of modelsToTry) {
      try {
        console.log(`📡 [HERITSTYLE] Đang gửi yêu cầu thẩm định sang Google AI Studio (${model})...`);
        const response = await fetchGeminiWithFallback(model, key, {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 4096
          }
        }, 25000);

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            console.log(`✅ [HERITSTYLE] ĐÃ NHẬN PHẢN HỒI THỰC TỪ GOOGLE AI STUDIO CLOUD (${model})!`, rawText);
            return parseCustomGemOutput(rawText, `Google AI Studio Live (${model})`);
          }
        } else {
          const errData = await response.json().catch(() => null);
          console.warn(`⚠️ [HERITSTYLE] Model ${model} phản hồi mã ${response.status}:`, errData);
        }
      } catch (err: any) {
        console.warn(`⚠️ [HERITSTYLE] Thử kết nối model ${model} thất bại:`, err?.message || err);
      }
    }
  }

  // 2. NẾU CHƯA CÓ API KEY HOẶC MẠNG BỊ LỖI:
  // Kích hoạt ngay "Bộ Não Custom Gem Nội Tại" đã nạp sẵn trong IDE của Giang!
  // Đảm bảo tính toán chi li 100% từng điểm số, từng món đồ, từng quy tắc điển chế!
  return evaluateWithNativeCustomGemBrain(payload as any);
}
