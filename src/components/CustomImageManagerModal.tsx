import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle,
  HelpCircle,
  Copy,
  Lock,
  Unlock,
  Search,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { 
  HERITAGE_GARMENTS,
  REMIX_ITEMS,
  LINK_ANH_CUC_KIM_LOAI,
  LINK_ANH_CUC_NGOC,
  LINK_ANH_CUC_GO,
  LINK_ANH_CUC_BAC_HOA_SEN,
  LINK_ANH_CUC_XA_CU,
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

export interface ItemConfigSpec {
  id: string;
  name: string;
  categoryKey: 'garment' | 'button' | 'layer' | 'bottom' | 'shoes' | 'accessory';
  categoryLabel: string;
  categoryIcon: string;
  defaultSrc: string;
  fileLabel: string;
  note: string;
}

// 1. Áo Ngoài (Garments)
const GARMENT_ITEMS_CONFIG: ItemConfigSpec[] = HERITAGE_GARMENTS.map((g) => ({
  id: g.id,
  name: g.name,
  categoryKey: 'garment',
  categoryLabel: 'Áo Ngoài',
  categoryIcon: '👘',
  defaultSrc: (g as any).thumbnailUrl || '/canvas/mannequin-base.png',
  fileLabel: `${g.id}.png`,
  note: `${g.dynasty} · ${g.subName}`
}));

// Tên hiển thị danh mục
const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  button: { label: 'Khuy Cúc Áo', icon: '🔘' },
  layer: { label: 'Áo Lót Đơn Y', icon: '🥼' },
  bottom: { label: 'Thân Dưới', icon: '👖' },
  shoes: { label: 'Giày / Guốc', icon: '👞' },
  accessory: { label: 'Phụ Kiện', icon: '🪭' }
};

// 2. Toàn bộ các sản phẩm khác từ REMIX_ITEMS
const REMIX_ITEMS_CONFIG: ItemConfigSpec[] = REMIX_ITEMS.map((item) => {
  const meta = CATEGORY_META[item.category] || { label: item.category, icon: '📦' };
  return {
    id: item.id,
    name: item.name,
    categoryKey: item.category as any,
    categoryLabel: meta.label,
    categoryIcon: meta.icon,
    defaultSrc: item.thumbnailUrl || '',
    fileLabel: `${item.id}.png`,
    note: item.styleVibe || item.description
  };
});

// Toàn bộ danh mục sản phẩm (Đầy đủ 100% không thiếu sản phẩm nào)
export const ALL_PRODUCTS_LIST: ItemConfigSpec[] = [
  ...GARMENT_ITEMS_CONFIG,
  ...REMIX_ITEMS_CONFIG
];

interface CustomImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customImages: CustomImageConfig;
  onUpdateImage: (itemId: string, dataUrl: string) => void;
  onResetImage: (itemId: string) => void;
  onResetAll: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

export const CustomImageManagerModal: React.FC<CustomImageManagerModalProps> = ({
  isOpen,
  onClose,
  customImages,
  onUpdateImage,
  onResetImage,
  onResetAll,
  isLocked,
  onToggleLock
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');

  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => [
    { key: 'all', label: 'Tất Cả', icon: '✨', count: ALL_PRODUCTS_LIST.length },
    { key: 'garment', label: 'Áo Ngoài', icon: '👘', count: GARMENT_ITEMS_CONFIG.length },
    { key: 'button', label: 'Khuy Cúc', icon: '🔘', count: REMIX_ITEMS.filter(i => i.category === 'button').length },
    { key: 'layer', label: 'Áo Đơn Y', icon: '🥼', count: REMIX_ITEMS.filter(i => i.category === 'layer').length },
    { key: 'bottom', label: 'Thân Dưới', icon: '👖', count: REMIX_ITEMS.filter(i => i.category === 'bottom').length },
    { key: 'shoes', label: 'Giày / Guốc', icon: '👞', count: REMIX_ITEMS.filter(i => i.category === 'shoes').length },
    { key: 'accessory', label: 'Phụ Kiện', icon: '🪭', count: REMIX_ITEMS.filter(i => i.category === 'accessory').length }
  ], []);

  const filteredItems = useMemo(() => {
    return ALL_PRODUCTS_LIST.filter(item => {
      const matchCat = activeCategoryTab === 'all' || item.categoryKey === activeCategoryTab;
      const matchSearch = searchQuery.trim() === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategoryTab, searchQuery]);

  const customCount = Object.keys(customImages).length;

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleFileUpload = (itemId: string, file: File) => {
    if (isLocked) {
      showToast('⚠️ Kho ảnh đang bị KHÓA. Hãy bấm "Mở Khóa" ở góc trên trước khi tải ảnh!');
      return;
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUpdateImage(itemId, result);
        showToast(`Đã cập nhật ảnh mới cho ${ALL_PRODUCTS_LIST.find(i => i.id === itemId)?.name}! Tự động đồng bộ sang Màn hình 1, 2 và 3.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBatchUpload = (files: FileList | null) => {
    if (isLocked) {
      showToast('⚠️ Kho ảnh đang bị KHÓA. Hãy bấm "Mở Khóa" ở góc trên trước khi tải ảnh!');
      return;
    }
    if (!files || files.length === 0) return;

    let updatedCount = 0;
    Array.from(files).forEach(file => {
      const fileName = file.name.toLowerCase();
      const matchedItem = ALL_PRODUCTS_LIST.find(item => 
        fileName === item.fileLabel.toLowerCase() ||
        fileName.startsWith(item.id.toLowerCase())
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
      showToast(`Đã tự động nhận diện và cập nhật ${updatedCount} ảnh! Đồng bộ sang Màn hình 1, 2 và 3.`);
    } else {
      showToast(`Không tìm thấy file khớp với tên mã sản phẩm. Giang có thể bấm tải trực tiếp trên từng món bên dưới!`);
    }
  };

  const handleSaveUrl = (itemId: string) => {
    if (isLocked) {
      showToast('⚠️ Kho ảnh đang bị KHÓA. Hãy mở khóa trước khi chỉnh sửa!');
      return;
    }
    if (inputUrl.trim()) {
      onUpdateImage(itemId, inputUrl.trim());
      showToast('Đã lưu đường link ảnh mới! Tự động đồng bộ hóa.');
      setEditingUrlId(null);
      setInputUrl('');
    }
  };

  const handleCopyUrlList = () => {
    const list = ALL_PRODUCTS_LIST.map((item, idx) => {
      const src = customImages[item.id] || item.defaultSrc;
      const isBase64 = src.startsWith('data:');
      const displayUrl = isBase64 ? `[File ảnh nội bộ đã tải - ${item.fileLabel}]` : src;
      return `${idx + 1}. [${item.categoryLabel}] ${item.name} (${item.id}): ${displayUrl}`;
    });
    navigator.clipboard.writeText(list.join('\n'));
    showToast('Đã sao chép danh sách ảnh! Giang có thể dán vào ghi chú hoặc gửi chat.');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl max-h-[92vh] bg-[#121218] border border-[#c5a059]/40 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262635] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#181824] via-[#14141e] to-[#121218]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-inner">
              <ImageIcon className="w-5 h-5 text-[#e5c365]" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-royal font-bold text-[#faedd0]">
                  Quản Lý Ảnh Sản Phẩm Thủ Công
                </h2>
                {isLocked ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    ĐÃ KHÓA & TỰ ĐỒNG BỘ 3 MÀN HÌNH
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-xs">
                    <Unlock className="w-3 h-3 text-amber-400" />
                    ĐANG MỞ KHÓA CHỈNH SỬA
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Tải ảnh đại diện cho các sản phẩm trong Product Categories ({customCount}/{ALL_PRODUCTS_LIST.length} món đã có ảnh riêng)
              </p>
            </div>
          </div>

          {/* Right Header Controls: Lock / Unlock & Close */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Nút KHÓA LẠI / MỞ KHÓA theo đúng yêu cầu */}
            <button
              type="button"
              onClick={onToggleLock}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isLocked
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 hover:brightness-110 font-bold shadow-md'
              }`}
              title={isLocked ? "Bấm để mở khóa chỉnh sửa" : "Bấm để khóa lại sau khi hoàn thành upload"}
            >
              {isLocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mở Khóa Chỉnh Sửa</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Khóa Lại & Đồng Bộ</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng bảng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sync & Lock Notification Banner */}
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          isLocked 
            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200' 
            : 'bg-amber-950/30 border-amber-500/20 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {isLocked 
                ? 'Đã khóa ảnh an toàn. Mọi ảnh sản phẩm đang được tự động đồng bộ hóa trên Màn hình 1, 2 và 3.'
                : 'Đang ở chế độ tải ảnh. Hãy chọn file ảnh từ máy tính cho từng món. Khi hoàn tất, nhấn "Khóa Lại & Đồng Bộ".'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-400 hidden md:inline">
            Local Database Synced
          </span>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#e5c365] text-stone-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Toolbar: Category Tabs + Search + Batch Tools */}
        <div className="p-3 sm:px-5 border-b border-[#222230] flex flex-wrap items-center justify-between gap-3 bg-[#151520]/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {categories.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategoryTab(tab.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  activeCategoryTab === tab.key
                    ? 'bg-[#c5a059] text-stone-950 font-bold shadow-xs'
                    : 'bg-[#1a1a26] text-stone-300 hover:text-white hover:bg-[#232332]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="pl-8 pr-3 py-1 text-xs bg-[#121218] border border-white/10 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#c5a059] w-36 sm:w-44"
              />
            </div>

            <button
              onClick={handleCopyUrlList}
              className="px-2.5 py-1 rounded-lg bg-[#20202d] hover:bg-[#2a2a3c] text-[#e5c365] text-xs font-semibold border border-[#c5a059]/40 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              title="Sao chép danh sách để theo dõi"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">Sao Chép DS</span>
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
              disabled={isLocked}
              onClick={() => batchFileInputRef.current?.click()}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 shadow-xs ${
                isLocked 
                  ? 'bg-stone-800/50 text-stone-500 border-white/5 cursor-not-allowed'
                  : 'bg-[#20202d] hover:bg-[#2a2a3c] text-stone-200 border-[#38384f] cursor-pointer'
              }`}
              title={isLocked ? "Mở khóa để tải nhiều ảnh" : "Chọn nhiều file ảnh cùng lúc"}
            >
              <Upload className="w-3 h-3 text-[#c5a059]" />
              <span className="hidden sm:inline">Tải Nhiều Ảnh</span>
            </button>
          </div>
        </div>

        {/* Content List: Grid of All Products */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 max-h-[60vh] scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-stone-500 opacity-60" />
              <p className="text-sm font-semibold">Không tìm thấy sản phẩm nào</p>
              <p className="text-xs text-stone-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map(item => {
                const currentSrc = customImages[item.id] || item.defaultSrc;
                const isCustomized = Boolean(customImages[item.id]);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border flex gap-3 items-center transition-all ${
                      isCustomized
                        ? 'bg-[#181824] border-[#c5a059]/60 ring-1 ring-[#c5a059]/30 shadow-md'
                        : 'bg-[#111117] border-[#22222d] hover:border-[#333342]'
                    }`}
                  >
                    {/* Image Preview Box */}
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10 flex items-center justify-center group">
                      {currentSrc ? (
                        <img
                          src={currentSrc}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = item.defaultSrc;
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{item.categoryIcon}</span>
                      )}

                      {isCustomized ? (
                        <span className="absolute top-1 left-1 bg-emerald-500 text-stone-950 text-[8.5px] font-black px-1.5 py-0.5 rounded shadow">
                          ĐÃ TẢI
                        </span>
                      ) : (
                        <span className="absolute top-1 left-1 bg-stone-700/80 text-stone-300 text-[8.5px] font-medium px-1 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>

                    {/* Info & Controls */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#faedd0] truncate" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#c5a059] font-medium flex items-center gap-1">
                            <span>{item.categoryIcon}</span>
                            <span>{item.categoryLabel}</span>
                          </div>
                        </div>

                        {isCustomized && !isLocked && (
                          <button
                            onClick={() => {
                              onResetImage(item.id);
                              showToast(`Đã khôi phục ảnh mặc định cho ${item.name}`);
                            }}
                            className="p-1 text-stone-400 hover:text-rose-300 rounded hover:bg-white/5 transition-colors cursor-pointer"
                            title="Khôi phục ảnh gốc"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-stone-400 line-clamp-1" title={item.note}>
                        {item.note}
                      </p>

                      {/* Action buttons */}
                      <div className="pt-0.5 flex items-center gap-1.5">
                        {isLocked ? (
                          <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                            <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            Đã khóa cố định
                          </span>
                        ) : (
                          <>
                            <label className="px-2.5 py-1 rounded-lg bg-[#c5a059] hover:bg-[#d8b566] text-stone-950 font-bold text-[10.5px] cursor-pointer flex items-center gap-1 transition-all shadow-xs active:scale-95">
                              <Upload className="w-3 h-3" />
                              <span>{isCustomized ? 'Đổi ảnh' : 'Tải ảnh'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(item.id, file);
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingUrlId(editingUrlId === item.id ? null : item.id);
                                setInputUrl(customImages[item.id] || '');
                              }}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-[10.5px] border border-white/10 cursor-pointer"
                            >
                              Link
                            </button>
                          </>
                        )}
                      </div>

                      {/* URL input drawer */}
                      {editingUrlId === item.id && !isLocked && (
                        <div className="pt-1.5 flex items-center gap-1">
                          <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Dán link ảnh https://..."
                            className="flex-1 text-[10.5px] px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white focus:outline-none focus:border-[#c5a059]"
                          />
                          <button
                            onClick={() => handleSaveUrl(item.id)}
                            className="px-2 py-0.5 bg-[#c5a059] text-stone-950 rounded text-[10.5px] font-bold"
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
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 border-t border-[#222230] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#14141d] text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {customCount > 0 
                ? `Đã lưu ${customCount} ảnh tùy chỉnh vào bộ nhớ cục bộ (localStorage). Tự động đồng bộ hóa trên Màn 1, 2 và 3.` 
                : 'Chưa có ảnh tải lên nào. Giang có thể bấm Tải Ảnh để gán ảnh đại diện cho từng món.'}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {customCount > 0 && !isLocked && (
              <button
                onClick={() => {
                  if (window.confirm('Giang có chắc muốn khôi phục toàn bộ ảnh về mặc định ban đầu không?')) {
                    onResetAll();
                    showToast('Đã xóa toàn bộ ảnh cá nhân, khôi phục gốc thành công!');
                  }
                }}
                className="text-stone-400 hover:text-rose-400 text-[11px] underline cursor-pointer mr-2"
              >
                Xóa tất cả ảnh đã tải
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
