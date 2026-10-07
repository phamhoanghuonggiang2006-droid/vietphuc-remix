import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ExternalLink, 
  Sparkles, 
  Trash2,
  Cpu,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  getGeminiApiKey, 
  saveGeminiApiKey, 
  removeGeminiApiKey, 
  testGeminiConnection,
  extractGeminiApiKey
} from '../services/geminiService';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (hasKey: boolean) => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [currentSavedKey, setCurrentSavedKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = getGeminiApiKey();
      setCurrentSavedKey(existing);
      setApiKey(existing);
      setStatus({ type: 'idle', message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isJavaSnippet = apiKey.includes('import ') || apiKey.includes('class ') || apiKey.includes('public ') || apiKey.includes('void ') || apiKey.includes('System.getenv') || apiKey.includes('java');
  const hasAIKeyInText = apiKey.includes('AIzaSy') || apiKey.includes('AQ');

  const handleTestAndSave = async () => {
    const rawInput = apiKey.trim();
    if (!rawInput) {
      setStatus({ type: 'error', message: 'Vui lòng dán mã API Key trước khi kích hoạt.' });
      return;
    }

    if (isJavaSnippet && !hasAIKeyInText) {
      setStatus({
        type: 'error',
        message: 'Bạn đang dán đoạn mã Java mẫu từ nút "Get code" trên Google AI Studio. Ở đây chỉ cần dán mã khóa API (bắt đầu bằng AQ... hoặc AIzaSy...). Hãy bấm vào link bên dưới để đến trang "Get API key" và copy nhé!'
      });
      return;
    }

    const cleanKey = extractGeminiApiKey(rawInput);
    if (cleanKey !== rawInput) {
      setApiKey(cleanKey);
    }

    setIsTesting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const result = await testGeminiConnection(cleanKey);
      if (result.success) {
        saveGeminiApiKey(cleanKey);
        setCurrentSavedKey(cleanKey);
        setApiKey(cleanKey);
        const modelName = result.model === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : (result.model || 'Gemini 3.8 Flash');
        setStatus({ 
          type: 'success', 
          message: `Kết nối thành công! Đã kích hoạt Bộ Não Google AI Studio (${modelName}).` 
        });
        if (onKeyUpdated) onKeyUpdated(true);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'Có lỗi xảy ra khi kiểm tra kết nối tới Google AI Studio.' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRemoveKey = () => {
    removeGeminiApiKey();
    setApiKey('');
    setCurrentSavedKey('');
    setStatus({ type: 'idle', message: 'Đã xóa khóa API khỏi trình duyệt.' });
    if (onKeyUpdated) onKeyUpdated(false);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '********';
    return key.substring(0, 6) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c1618] via-[#141214] to-[#0d0b0d] border border-[#f5e6c8]/40 ring-1 ring-[#e5c365]/50 shadow-[0_0_35px_rgba(229,195,101,0.25)] text-[#f5f2eb] overflow-hidden"
      >
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e5c365] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e5c365]/5 via-transparent to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5c365] to-[#8a6825] text-stone-950 flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#faedd0]">
                  Bộ Não Google AI Studio
                </h3>
                {currentSavedKey && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ĐÃ KẾT NỐI
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Thẩm định trang phục & văn hóa thời gian thực bằng Gemini
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-sm">
          {/* Quick Guide */}
          <div className="p-3.5 rounded-xl bg-[#231b1f] border border-[#D4AF37]/25 text-xs space-y-2">
            <div className="font-semibold text-[#e5c365] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Cách lấy đúng mã API Key trên Google AI Studio:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-300 pl-1 leading-relaxed">
              <li>
                Bấm vào link này để mở trang quản lý khóa:{' '}
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e5c365] font-bold underline hover:text-[#faedd0] inline-flex items-center gap-0.5"
                >
                  aistudio.google.com/apikey <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>
                Bấm nút <strong>"Create API key"</strong> (hoặc nhìn vào danh sách khóa đã có).
              </li>
              <li>
                Bấm nút <strong>Copy</strong> ở cạnh dòng mã bắt đầu bằng <code className="text-[#e5c365] bg-black/60 px-1.5 py-0.5 rounded font-mono">AQ...</code> hoặc <code className="text-[#e5c365] bg-black/60 px-1.5 py-0.5 rounded font-mono">AIzaSy...</code> và dán vào ô bên dưới.
              </li>
            </ol>
            <div className="pt-1.5 mt-1 border-t border-[#D4AF37]/15 text-[11px] text-amber-300 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Lưu ý:</strong> Không bấm vào nút <em>"Get code"</em> (đó là mã lập trình Java). Hãy bấm vào mục <strong>"Get API key"</strong> (hình chiếc chìa khóa 🔑) nhé!
              </span>
            </div>
          </div>

          {/* Key Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
              <span>Mã Khóa API (Bắt đầu bằng AQ... hoặc AIzaSy...):</span>
              {currentSavedKey && (
                <span className="text-[11px] text-stone-400 font-mono">
                  Hiện tại: {maskKey(currentSavedKey)}
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Key className="w-4 h-4 text-[#e5c365]" />
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (status.type === 'error') {
                    setStatus({ type: 'idle', message: '' });
                  }
                }}
                placeholder="Dán mã khóa AQ... hoặc AIzaSy... vào đây"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0e0c0e] border border-[#D4AF37]/40 text-stone-100 placeholder-stone-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#e5c365] focus:ring-1 focus:ring-[#e5c365] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title={showKey ? 'Ẩn mã khóa' : 'Hiện mã khóa'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-stone-400" />}
              </button>
            </div>

            {/* Inline helper if Java code detected */}
            {isJavaSnippet && !hasAIKeyInText && (
              <p className="text-[11px] text-amber-400 font-medium pt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>Phát hiện code Java mẫu. Ở đây chỉ cần dán mã khóa AQ... hoặc AIzaSy... từ mục "Get API key" thôi nhé!</span>
              </p>
            )}
            {isJavaSnippet && hasAIKeyInText && (
              <p className="text-[11px] text-emerald-400 font-medium pt-1 flex items-center gap-1">
                <span>💡</span>
                <span>Đã phát hiện mã khóa trong đoạn code, hệ thống sẽ tự động lọc lấy mã chuẩn cho bạn.</span>
              </p>
            )}
          </div>

          {/* Status Alert */}
          {status.type === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] text-stone-400 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
            <ShieldCheck className="w-4 h-4 text-[#e5c365] shrink-0" />
            <span>
              Mã khóa được lưu trữ an toàn trong trình duyệt (Local Storage) của bạn, không bao giờ gửi qua máy chủ thứ ba.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3 bg-black/20">
          <div>
            {currentSavedKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa khóa</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestAndSave}
              className="px-5 py-2 rounded-xl text-xs font-serif font-bold text-stone-950 bg-gradient-to-r from-[#faedd0] via-[#e5c365] to-[#c5a059] hover:brightness-110 shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lưu & Kích Hoạt Bộ Não AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
