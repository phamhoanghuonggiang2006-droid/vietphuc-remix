import React from 'react';
import { CULTURAL_TABOOS } from '../data/heritageData';
import { AlertTriangle, ShieldCheck, X, Check, Flame } from 'lucide-react';

interface TaboosGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaboosGuideModal: React.FC<TaboosGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#14141a] border border-[#2e2e3e] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#252535] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#c5a059] font-medium">
                Bộ Lọc Cốt Lõi (Taboos Engine)
              </span>
              <h3 className="text-lg font-bold text-[#f5f2eb]">
                4 Quy Chuẩn Cấm Kỵ Y Quan Triều Nguyễn
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1f1f2a] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs text-stone-300 leading-relaxed">
          Được thiết lập bởi <strong>Stylist Cổ Phục Viễn Đông</strong> dựa trên nghiên cứu Khâm Định Đại Nam Hội Điển Sự Lệ và quy chuẩn trang phục cung đình. Bộ lọc tự động thẩm định và cảnh báo để giới trẻ tự tin mặc đẹp mà không sợ biến tướng hay phạm húy!
        </p>

        {/* 4 Rules List */}
        <div className="space-y-3.5">
          {CULTURAL_TABOOS.map((taboo, idx) => (
            <div key={taboo.id} className="p-4 rounded-xl bg-[#0f0f15] border border-[#252535] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e5c365] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#e5c365]/10 text-[#e5c365] text-xs flex items-center justify-center border border-[#e5c365]/30">
                    {idx + 1}
                  </span>
                  {taboo.title}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold text-rose-400 bg-rose-950/50 border border-rose-500/20">
                  Phạt {taboo.penaltyScore}đ
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed pl-6">
                {taboo.explanation}
              </p>

              <div className="pl-6 pt-1 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Giải pháp chuẩn mực: {taboo.remedyAction}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c5a059] text-[#0d0d10] font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
          >
            Đã Hiểu Quy Chuẩn
          </button>
        </div>

      </div>
    </div>
  );
};
