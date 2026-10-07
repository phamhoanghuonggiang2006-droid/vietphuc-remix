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
  colorName: string;
  colorHex: string;
  nguHanh: string;
  buttonName: string;
  isChineseButton: boolean;
  bottomName: string;
  shoesName: string;
  accessories: string[];
  hasDonY: boolean;
  contextTier: 'heritage' | 'modern' | 'fusion';
  contextName: string;
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
  return '';
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
      // Đối với AQ.: Google AI Studio yêu cầu chỉ dùng header 'x-goog-api-key', không dùng URL param
      const url = key.startsWith('AQ') 
        ? endpoint 
        : `${endpoint}?key=${encodeURIComponent(key)}`;

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

  const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
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

import { CUSTOM_GEM_SYSTEM_INSTRUCTIONS } from './customGemBrain';

/**
 * Gửi toàn bộ dữ liệu outfit sang Google AI Studio (Gemini Custom Gem) để đánh giá chuyên sâu
/**
 * Bộ chuyển đổi thông minh: Xử lý cả định dạng JSON lẫn định dạng Thẻ Nhãn đặc trưng
 * [THẺ NHÃN], [CẢNH BÁO], [VIBE CHECK], [ĐIỂM SLAY SCORE], [ĐIỂM CHUẨN DI SẢN] của Custom Gem
 */
function parseCustomGemOutput(rawText: string, model: string): GeminiEvaluationResult {
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

  // 2. Parse theo định dạng [TAG]: VALUE của Custom Gem
  const getTagValue = (tag: string): string => {
    const regex = new RegExp(`\\[${tag}\\]\\s*:\\s*([^\\n\\[]+(?:\\n(?!\\[)[^\\n\\[]+)*)`, 'i');
    const match = rawText.match(regex);
    return match ? match[1].trim() : '';
  };

  const theNhan = getTagValue('THẺ NHÃN') || 'HERITSTYLE AI VERDICT';
  const canhBao = getTagValue('CẢNH BÁO') || 'None';
  const vibeCheck = getTagValue('VIBE CHECK') || rawText.slice(0, 320);
  const rawSlay = getTagValue('ĐIỂM SLAY SCORE');
  const rawHeritage = getTagValue('ĐIỂM CHUẨN DI SẢN');

  const extractScoreNumber = (str: string, fallback: number): number => {
    const m = str.match(/(\d{1,3})\s*%/);
    if (m) return parseInt(m[1], 10);
    const m2 = str.match(/(\d{1,3})/);
    if (m2) return parseInt(m2[1], 10);
    return fallback;
  };

  const slayScore = Math.min(100, Math.max(0, extractScoreNumber(rawSlay, 92)));
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
}

/**
 * Gửi toàn bộ dữ liệu outfit sang Google AI Studio (Gemini Custom Gem) để đánh giá chuyên sâu
 */
export async function evaluateOutfitWithGemini(
  payload: OutfitEvaluationPayload
): Promise<GeminiEvaluationResult> {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error('Chưa cấu hình Google AI Studio API Key.');
  }

  // Toàn bộ quy tắc, giọng điệu Gen Z & kho tri thức của Custom Gem
  const systemPrompt = CUSTOM_GEM_SYSTEM_INSTRUCTIONS;

  const userPrompt = `Tôi đang phối một bộ trang phục Việt Phục Remix với thông tin chi tiết sau:
- Bối cảnh diện đồ: ${payload.contextName} (Tier: ${payload.contextTier})
- Danh sách món đồ (Items):
  * Cổ phục (Top): ${payload.garmentName} (phom dáng: ${payload.garmentType}, sắc phục: ${payload.colorName} ${payload.colorHex}, hành: ${payload.nguHanh})
  * Khuy cúc: ${payload.buttonName} ${payload.isChineseButton ? '[CHÚ Ý: CÚC VẢI TẾT DÂY / CÚC TÀU]' : ''}
  * Áo lót trong (Đơn y): ${payload.hasDonY ? 'Có áo đơn y lụa trắng' : 'Không có áo đơn y (lộ ngực / áo thun)'}
  * Thân dưới (Bottoms): ${payload.bottomName}
  * Giày/Guốc: ${payload.shoesName}
  * Phụ kiện: ${payload.accessories.length > 0 ? payload.accessories.join(', ') : 'Không phụ kiện'}
- Cảnh báo kiểm duyệt:
  * Màu Vàng hoàng chính sắc: ${payload.isImperialYellow ? 'CÓ' : 'KHÔNG'}
  * Nhật Bình đi cùng Khăn Đóng Nam: ${payload.isNhatBinhWithKhanDong ? 'CÓ' : 'KHÔNG'}

Hãy áp dụng Bộ Não HeritStyle AI phân tích và trả về kết quả theo chuẩn format của Gem:
[THẺ NHÃN]: (Ví dụ: FUSION STREETWEAR - HERITAGE INSPIRED hoặc HERITAGE CORE)
[CẢNH BÁO]: (None / Yellow Alert / Red Alert)
[VIBE CHECK]: (Nhận xét Gen Z cực slay, trendy về outfit và phân tích ý nghĩa lịch sử)
[ĐIỂM SLAY SCORE]: (Ví dụ: 95%)
[ĐIỂM CHUẨN DI SẢN]: (Ví dụ: 85% - giải thích ngắn lý do cộng/trừ điểm)`;

  const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  for (const model of modelsToTry) {
    try {
      const response = await fetchGeminiWithFallback(model, key, {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95
        }
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error?.message || `Lỗi máy chủ Google AI Studio (${response.status})`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('Google AI Studio không trả về nội dung đánh giá.');
      }

      return parseCustomGemOutput(rawText, model);
    } catch (err: any) {
      if (model === modelsToTry[modelsToTry.length - 1]) {
        throw err;
      }
      // Thử model tiếp theo trong danh sách
    }
  }

  throw new Error('Không thể kết nối đến Google AI Studio.');
}
