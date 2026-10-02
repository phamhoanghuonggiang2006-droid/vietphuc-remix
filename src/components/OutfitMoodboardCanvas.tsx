import React, { useState } from 'react';
import { 
  HeritageItem, 
  ColorOption, 
  ModernRemixItem 
} from '../data/heritageData';
import { RobeVisualizer } from './RobeVisualizer';
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
  X
} from 'lucide-react';

export type CanvasViewMode = 'mannequin' | 'editorial' | 'breakdown';

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
}) => {
  const [viewMode, setViewMode] = useState<CanvasViewMode>('mannequin');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  // Check if any taboo is currently active
  const hasActiveTaboo = isChineseButtonSelected || isImperialYellowSelected || isTabooClashSelected || !hasDonY;

  // 2D image URLs
  const bottomCanvasImg = activeBottomItem.canvas2dUrl || activeBottomItem.thumbnailUrl || '';
  const shoesCanvasImg = activeShoesItem.canvas2dUrl || activeShoesItem.thumbnailUrl || '';
  const accessoryCanvasImg = activeAccessoryItem.canvas2dUrl || activeAccessoryItem.thumbnailUrl || '';
  const isKhanDongSelected = activeAccessoryItem.id === 'acc-khan-dong';

  return (
    <div className="bg-[#141419] border border-[#23232c] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
      {/* HEADER: TITLE & VIEW MODE SWITCHER */}
      <div className="p-4 sm:p-5 border-b border-[#22222c] bg-gradient-to-r from-[#171720] to-[#121217] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                CANVAS PREVIEW OUTFIT TỔNG THỂ
              </span>
              {hasActiveTaboo ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  Cần Chỉnh Quy Chuẩn
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Hài Hòa Di Sản
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              Đồng bộ trực quan 10 món phối 2D cùng Y quan Triều Nguyễn
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-[#0d0d12] p-1 rounded-xl border border-[#262635]">
          <button
            type="button"
            onClick={() => setViewMode('mannequin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'mannequin'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>👔 Toàn Thân</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'editorial'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>🎨 Moodboard</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('breakdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'breakdown'
                ? 'bg-[#c5a059] text-[#0d0d12] font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>🎴 Chi Tiết 2D</span>
          </button>
        </div>
      </div>

      {/* CANVAS MAIN BODY */}
      <div className="relative p-4 sm:p-5 bg-gradient-to-b from-[#0e0e13] via-[#121218] to-[#0a0a0f] min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* Subtle imperial texture watermark */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #c5a059 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Ambient color glow corresponding to active color */}
        <div 
          className="absolute w-72 h-72 rounded-full blur-[110px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: selectedColorHex }}
        />

        {/* Top Controls Bar on Canvas */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Active color swatch & garment title */}
          <div className="bg-black/75 backdrop-blur-md border border-[#c5a059]/30 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
            <span 
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 shrink-0" 
              style={{ backgroundColor: selectedColorHex }} 
            />
            <span className="text-xs font-bold text-stone-200 truncate max-w-[140px] sm:max-w-[180px]">
              {activeGarment.name}
            </span>
            <span className="text-[10px] text-[#c5a059] hidden sm:inline">
              • {activeColor.vietnameseName.split('(')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Labels */}
            <button
              type="button"
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                showLabels 
                  ? 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40' 
                  : 'bg-black/60 text-stone-400 border-white/10 hover:text-stone-200'
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
              className="p-1.5 rounded-lg bg-black/60 text-stone-300 border border-white/10 hover:text-white transition-all"
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
          <div className="relative w-full max-w-[420px] py-6 flex flex-col items-center justify-center select-none">
            
            {/* 1. HEAD ZONE: KHĂN ĐÓNG HOẶC SILHOUETTE ĐẦU */}
            <div className="relative z-30 flex flex-col items-center -mb-8 transition-all duration-300">
              {isKhanDongSelected ? (
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setActiveHotspot(activeHotspot === 'head' ? null : 'head')}
                >
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-28 h-18 sm:w-32 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform"
                  />
                  {showLabels && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md border border-[#c5a059]/60 px-2 py-0.5 rounded-full text-[10px] text-[#c5a059] font-bold shadow-lg pointer-events-none">
                      {activeAccessoryItem.name}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-6 -mb-2 flex items-center justify-center opacity-40">
                  <div className="w-8 h-3 rounded-t-full border-t border-x border-[#c5a059]/30" />
                </div>
              )}
            </div>

            {/* 2. UPPER BODY ZONE: ÁO CỔ PHỤC (ROBE VISUALIZER HOẶC ẢNH UPLOAD) - HOÀN TOÀN TRONG SUỐT KHÔNG KHUNG RIÊNG */}
            <div className="relative z-20 w-full max-w-[320px] sm:max-w-[350px] transition-all duration-500">
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
                      className={`absolute top-28 right-4 bg-black/85 backdrop-blur-md border px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-xl text-[10px] ${
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

                  {/* SIDE ACCESORY (QUẠT GIẤY / BỘI NGỌC / ĐỒNG HỒ) */}
                  {!isKhanDongSelected && accessoryCanvasImg && (
                    <div 
                      className={`absolute z-30 transition-all duration-500 cursor-pointer group ${
                        activeAccessoryItem.id === 'acc-paper-fan'
                          ? 'bottom-12 -right-4 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 -rotate-12 hover:rotate-0'
                          : activeAccessoryItem.id === 'acc-boi-ngoc'
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
            <div className="relative z-10 w-full max-w-[280px] -mt-16 sm:-mt-20 flex flex-col items-center transition-all duration-500">
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
            <div className="relative z-20 w-full max-w-[260px] -mt-10 sm:-mt-12 flex flex-col items-center transition-all duration-500">
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
          <div className="relative w-full max-w-[620px] py-4 select-none">
            {/* Editorial Outer Frame */}
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
                  
                  {/* Card 1: Phụ Kiện Đi Kèm (Khăn Đóng / Quạt / Bội Ngọc / Đồng Hồ) */}
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

                  {/* Card 2: Thân Dưới (Quần Linen / Váy / Jeans) */}
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

                  {/* Card 3: Giày / Guốc (Guốc Mộc / Hài Thêu / Sneakers) */}
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

                  {/* Card 4: Khuy Cúc Ngũ Thường */}
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
        {/* MODE 3: CHI TIẾT 2D MINH HỌA (10 ITEMS DETAIL SHOWCASE) */}
        {/* ======================================================== */}
        {viewMode === 'breakdown' && (
          <div className="w-full max-w-[620px] py-4 select-none space-y-3">
            <div className="text-center pb-2">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">
                BỘ 4 SẢN PHẨM 2D ĐANG ĐƯỢC PHỐI
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Chi tiết hình ảnh minh họa 2D sắc nét từng món đồ trong outfit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Item 1: Phụ Kiện Đi Kèm */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={accessoryCanvasImg}
                    alt={activeAccessoryItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Phụ Kiện
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeAccessoryItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeAccessoryItem.description}
                  </p>
                </div>
              </div>

              {/* Item 2: Thân Dưới */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={bottomCanvasImg}
                    alt={activeBottomItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Thân Dưới
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeBottomItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeBottomItem.description}
                  </p>
                </div>
              </div>

              {/* Item 3: Giày / Guốc */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={shoesCanvasImg}
                    alt={activeShoesItem.name}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Giày / Guốc
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeShoesItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeShoesItem.description}
                  </p>
                </div>
              </div>

              {/* Item 4: Khuy Cúc */}
              <div className="bg-[#111117] border border-[#262635] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-black/70 border border-[#c5a059]/30 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={activeButtonItem.thumbnailUrl}
                    alt={activeButtonItem.name}
                    className="w-full h-full object-cover rounded-lg drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Hạt Khuy Cúc
                  </span>
                  <h4 className="text-sm font-bold text-stone-200 truncate">
                    {activeButtonItem.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {activeButtonItem.description}
                  </p>
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
                  className="w-36 h-24 object-contain -mb-6 relative z-30"
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
    </div>
  );
};
