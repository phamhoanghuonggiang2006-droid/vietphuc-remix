import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import { 
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

export interface CustomImageConfig {
  [itemId: string]: string; // itemId -> dataUrl or remote url
}

interface CustomImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customImages: CustomImageConfig;
  onUpdateImage: (itemId: string, dataUrl: string) => void;
  onResetImage: (itemId: string) => void;
  onResetAll: () => void;
}

interface ItemConfigSpec {
  id: string;
  name: string;
  category: string;
  defaultSrc: string;
  fileLabel: string;
  note: string;
}

const ITEMS_LIST: ItemConfigSpec[] = [
  // 1. Khuy Cúc
  {
    id: 'btn-metal-copper',
    name: 'Cúc Kim Loại (Đồng Chạm)',
    category: 'Hạt Khuy Cúc Áo (Ngũ Thường)',
    defaultSrc: LINK_ANH_CUC_KIM_LOAI,
    fileLabel: '1.png',
    note: 'Chuẩn quy chuẩn Nguyễn, tượng trưng Ngũ Thường'
  },
  {
    id: 'btn-jade-green',
    name: 'Cúc Ngọc (Cẩm Thạch)',
    category: 'Hạt Khuy Cúc Áo (Ngũ Thường)',
    defaultSrc: LINK_ANH_CUC_NGOC,
    fileLabel: '2.png',
    note: 'Sang trọng hoàng tộc, thanh nhã cung đình'
  },
  {
    id: 'btn-wood-agarwood',
    name: 'Cúc Gỗ (Trầm Hương Chữ Thọ)',
    category: 'Hạt Khuy Cúc Áo (Ngũ Thường)',
    defaultSrc: LINK_ANH_CUC_GO,
    fileLabel: '3.png',
    note: 'Tao nhã cổ điển, phong thái văn nhân xứ Huế'
  },
  {
    id: 'btn-chinese-cloth',
    name: 'Cúc Vải / Cúc Tàu (Sườn Xám)',
    category: 'Hạt Khuy Cúc Áo (Ngũ Thường)',
    defaultSrc: LINK_ANH_CUC_VAI,
    fileLabel: '4.png',
    note: 'Món vi phạm quy chuẩn y quan (để kiểm tra Taboos)'
  },

  // 2. Thân Dưới
  {
    id: 'bottom-silk-wide-pants',
    name: 'Quần Ống Sớ Lụa',
    category: 'Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)',
    defaultSrc: LINK_ANH_QUAN_LUA,
    fileLabel: '5.png',
    note: 'Lụa tơ tằm cổ điển buông rủ tha thướt, phom dáng ống sớ'
  },
  {
    id: 'bottom-linen-wide-pants',
    name: 'Quần Linen',
    category: 'Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)',
    defaultSrc: LINK_ANH_QUAN_LINEN,
    fileLabel: '5.png',
    note: 'Linen tự nhiên thoáng mát, chuẩn phom cổ phong'
  },
  {
    id: 'bottom-pleated-midi-skirt',
    name: 'Chân Váy Xếp Ly',
    category: 'Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)',
    defaultSrc: LINK_ANH_VAY_XEP_LY,
    fileLabel: '6.png',
    note: 'Chic Neo-Tradition, xếp ly uyển chuyển thanh lịch'
  },
  {
    id: 'bottom-high-waist-jeans',
    name: 'Quần Jeans Cạp Cao',
    category: 'Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)',
    defaultSrc: LINK_ANH_QUAN_JEANS,
    fileLabel: '7.png',
    note: 'Gen Z Heritage Streetwear đứng phom tôn dáng'
  },

  // 3. Giày / Guốc
  {
    id: 'shoes-wooden-clogs',
    name: 'Guốc Mộc Truyền Thống',
    category: 'Giày / Guốc',
    defaultSrc: LINK_ANH_GUOC_MOC,
    fileLabel: '8.png',
    note: 'Hồn xưa thanh nhã, quai nhung êm ái Cố Đô'
  },
  {
    id: 'shoes-embroidered-slippers',
    name: 'Hài Thêu Cung Đình',
    category: 'Giày / Guốc',
    defaultSrc: LINK_ANH_HAI_THEU,
    fileLabel: '9.png',
    note: 'Cung đình cổ kính, chỉ kim tuyến hoa văn tinh xảo'
  },
  {
    id: 'shoes-white-sneakers',
    name: 'Sneakers Trắng',
    category: 'Giày / Guốc',
    defaultSrc: LINK_ANH_SNEAKERS,
    fileLabel: '10.png',
    note: 'Hiện đại năng động (cảnh báo khi phối với Áo Tấc/Nhật Bình)'
  },
  {
    id: 'shoes-chunky-loafers',
    name: 'Chunky Loafers',
    category: 'Giày / Guốc',
    defaultSrc: LINK_ANH_CHUNKY_LOAFERS,
    fileLabel: '10.png',
    note: 'Modern Sartorial Chic, đế bánh mì thời thượng'
  },

  // 4. Phụ Kiện
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng Chữ Nhân',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_KHAN_DONG,
    fileLabel: '12.png',
    note: 'Khăn xếp tạo vẻ chỉnh tề, đoan trang vương triều'
  },
  {
    id: 'acc-khan-vanh-day',
    name: 'Khăn Vành Dây',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_KHAN_VANH_DAY,
    fileLabel: '12.png',
    note: 'Khăn vành quấn nhiều vòng bằng gấm hoàng cung lộng lẫy'
  },
  {
    id: 'acc-paper-fan',
    name: 'Quạt Giấy Trầm Hương',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_QUAT_GIAY,
    fileLabel: '11.png',
    note: 'Phụ kiện cầm tay phong nhã của tao nhân mặc khách'
  },
  {
    id: 'acc-jade-pendant',
    name: 'Bội Ngọc Bích',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_BOI_NGOC,
    fileLabel: '13.png',
    note: 'Ngọc bội buông tà áo, phát tiếng leng keng phong lưu'
  },
  {
    id: 'acc-kieng-bac',
    name: 'Kiềng Bạc',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_KIENG_BAC,
    fileLabel: '13.png',
    note: 'Kiềng bạc chạm uốn lượn ôm cổ, nét đài các thiếu nữ Việt'
  },
  {
    id: 'acc-smartwatch',
    name: 'Đồng Hồ Thông Minh (Hiện Đại)',
    category: 'Phụ Kiện Đi Kèm (6 món cổ phong & hiện đại)',
    defaultSrc: LINK_ANH_DONG_HO,
    fileLabel: '14.png',
    note: 'Công nghệ hiện đại (cảnh báo khi phối đại lễ phục)'
  }
];

export const CustomImageManagerModal: React.FC<CustomImageManagerModalProps> = ({
  isOpen,
  onClose,
  customImages,
  onUpdateImage,
  onResetImage,
  onResetAll
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');

  const batchFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'Tất Cả 14 Món' },
    { key: 'Hạt Khuy Cúc Áo (Ngũ Thường)', label: '1. Khuy Cúc (1-4)' },
    { key: 'Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)', label: '2. Thân Dưới (5-7)' },
    { key: 'Giày / Guốc', label: '3. Giày / Guốc (8-10)' },
    { key: 'Phụ Kiện Đi Kèm (Chọn 1 trong 4 món)', label: '4. Phụ Kiện (11-14)' }
  ];

  const filteredItems = activeCategoryTab === 'all'
    ? ITEMS_LIST
    : ITEMS_LIST.filter(item => item.category === activeCategoryTab);

  const customCount = Object.keys(customImages).length;

  const handleFileUpload = (itemId: string, file: File) => {
    if (!file) return;
    
    // Đọc ảnh thành Base64 và lưu trực tiếp vào state / localStorage của trình duyệt
    // KHÔNG HỀ GỬI QUA KHUNG CHAT -> KHÔNG BAO GIỜ BỊ LỖI TOKEN!
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUpdateImage(itemId, result);
        showToast(`Đã cập nhật ảnh mới cho ${ITEMS_LIST.find(i => i.id === itemId)?.name}!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBatchUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    let updatedCount = 0;
    Array.from(files).forEach(file => {
      // Tìm xem tên file có trùng với 1.png, 2.png,... không
      const fileName = file.name.toLowerCase();
      const matchedItem = ITEMS_LIST.find(item => 
        fileName === item.fileLabel.toLowerCase() ||
        fileName.startsWith(item.fileLabel.replace('.png', ''))
      );

      if (matchedItem) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            onUpdateImage(matchedItem.id, result);
          }
        };
        reader.readAsDataURL(file);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      showToast(`Đã tự động nhận diện và cập nhật ${updatedCount} ảnh khớp tên file (1.png - 14.png)!`);
    } else {
      showToast(`Mẹo: Hãy đặt tên file là 1.png, 2.png, ... 14.png để tự động khớp từng món!`);
    }
  };

  const handleSaveUrl = (itemId: string) => {
    if (inputUrl.trim()) {
      onUpdateImage(itemId, inputUrl.trim());
      showToast('Đã lưu đường link ảnh mới!');
      setEditingUrlId(null);
      setInputUrl('');
    }
  };

  const handleCopyUrlList = () => {
    const list = ITEMS_LIST.map((item, idx) => {
      const src = customImages[item.id] || item.defaultSrc;
      const isBase64 = src.startsWith('data:');
      const displayUrl = isBase64 ? `[File ảnh nội bộ máy tính - ${item.fileLabel}]` : src;
      return `${idx + 1}. ${item.fileLabel} (${item.name}): ${displayUrl}`;
    });
    navigator.clipboard.writeText(list.join('\n'));
    showToast('Đã sao chép danh sách ảnh! Giang có thể dán vào khung chat.');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-[#121218] border border-[#c5a059]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#262635] flex items-center justify-between bg-gradient-to-r from-[#171722] to-[#121218]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                <ImageIcon className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-royal font-bold text-[#faedd0]">
                  Kho Quản Lý Ảnh Phối Đồ Cá Nhân (PNG)
                </h2>
                <p className="text-xs text-stone-400">
                  Thay thế 14 ảnh PNG mặc định bằng ảnh của Giang trực tiếp trên máy mà không sợ tràn token!
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Explanation Banner */}
        <div className="px-4 sm:px-6 py-3 bg-[#191924] border-b border-[#28283a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              💡 <strong>Tại sao không bị lỗi token?</strong> Khi chọn ảnh tại đây, ảnh được nạp thẳng vào trình duyệt của Giang (lưu trong máy), hoàn toàn không qua prompt chat nên không tốn 1 token nào!
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {customCount > 0 && (
              <span className="text-[11px] font-semibold text-[#c5a059] bg-[#c5a059]/15 px-2.5 py-1 rounded-md border border-[#c5a059]/30">
                Đã đổi {customCount}/14 ảnh
              </span>
            )}
            {customCount > 0 && (
              <button
                onClick={onResetAll}
                className="text-[11px] text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 px-2.5 py-1 rounded-md border border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục gốc</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification Toast */}
        {successToast && (
          <div className="mx-6 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Tabs & Batch Upload Action */}
        <div className="p-4 sm:px-6 border-b border-[#222230] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategoryTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryTab === tab.key
                    ? 'bg-[#c5a059] text-stone-950 font-bold shadow-sm'
                    : 'bg-[#181822] text-stone-400 hover:text-stone-200 hover:bg-[#20202e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyUrlList}
              className="px-3 py-1.5 rounded-lg bg-[#20202d] hover:bg-[#2a2a3c] text-[#e5c365] text-xs font-semibold border border-[#c5a059]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Sao chép danh sách URL để dán vào khung chat"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>📋 Sao Chép Link Gửi Chat</span>
            </button>

            <input
              type="file"
              ref={batchFileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleBatchUpload(e.target.files)}
            />
            <button
              onClick={() => batchFileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#20202d] hover:bg-[#2a2a3c] text-stone-200 text-xs font-semibold border border-[#38384f] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Chọn nhiều file 1.png, 2.png, ... cùng lúc để tự động gán"
            >
              <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Tải Nhiều Ảnh (1.png - 14.png)</span>
            </button>
          </div>
        </div>

        {/* Content List: 14 items */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map(item => {
              const currentSrc = customImages[item.id] || item.defaultSrc;
              const isCustomized = Boolean(customImages[item.id]);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex gap-3.5 items-center transition-all ${
                    isCustomized
                      ? 'bg-[#181824] border-[#c5a059]/60 ring-1 ring-[#c5a059]/30'
                      : 'bg-[#111117] border-[#22222d] hover:border-[#333342]'
                  }`}
                >
                  {/* Image Preview Box */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10 flex items-center justify-center group">
                    <img
                      src={currentSrc}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = item.defaultSrc;
                      }}
                    />
                    {isCustomized && (
                      <span className="absolute top-1 left-1 bg-emerald-500 text-stone-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Đã đổi
                      </span>
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[#e5c365] font-mono text-[9px] px-1 rounded">
                      {item.fileLabel}
                    </span>
                  </div>

                  {/* Info & Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#faedd0] truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#c5a059] font-mono">
                          Mục: {item.category.split('(')[0]}
                        </div>
                      </div>

                      {isCustomized && (
                        <button
                          onClick={() => {
                            onResetImage(item.id);
                            showToast(`Đã khôi phục ảnh mặc định cho ${item.name}`);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-300 rounded hover:bg-white/5 transition-colors cursor-pointer"
                          title="Khôi phục ảnh gốc"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-stone-400 line-clamp-1">
                      {item.note}
                    </p>

                    {/* Action buttons */}
                    <div className="pt-1 flex items-center gap-2">
                      <label className="px-2.5 py-1 rounded-lg bg-[#c5a059] hover:bg-[#d8b566] text-stone-950 font-bold text-[11px] cursor-pointer flex items-center gap-1 transition-all shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>{isCustomized ? 'Đổi ảnh khác' : 'Chọn ảnh PNG'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(item.id, file);
                          }}
                        />
                      </label>

                      <button
                        onClick={() => {
                          if (editingUrlId === item.id) {
                            setEditingUrlId(null);
                          } else {
                            setEditingUrlId(item.id);
                            setInputUrl('');
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-[#1f1f2b] hover:bg-[#2b2b3b] text-stone-300 text-[10px] border border-[#343448] transition-colors cursor-pointer"
                      >
                        {editingUrlId === item.id ? 'Đóng URL' : 'Nhập URL'}
                      </button>
                    </div>

                    {/* Quick URL Input drawer if user clicked "Nhập URL" */}
                    {editingUrlId === item.id && (
                      <div className="pt-2 flex items-center gap-1.5 animate-fadeIn">
                        <input
                          type="url"
                          placeholder="https://.../anh.png"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          className="flex-1 bg-[#0a0a0f] border border-[#3b3b50] rounded px-2 py-1 text-[11px] text-stone-200 focus:outline-none focus:border-[#c5a059]"
                        />
                        <button
                          onClick={() => handleSaveUrl(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-[#262635] bg-[#101016] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-stone-400 text-center sm:text-left text-[11px]">
            Ảnh tải lên được lưu tự động trong trình duyệt của bạn và xuất hiện ngay lập tức trong Studio Phối Đồ.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d8b566] text-stone-950 font-bold transition-all shadow-md cursor-pointer"
          >
            Hoàn Tất & Xem Kết Quả
          </button>
        </div>
      </div>
    </div>
  );
};
