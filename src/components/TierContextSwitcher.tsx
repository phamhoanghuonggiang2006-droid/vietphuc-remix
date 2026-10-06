import React from 'react';
import { Crown, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { playDanTranhTabSound, playCourtBrassSound, playBellTingSound, play808BassDropSound } from '../utils/soundEffects';

export interface TierContextSwitcherProps {
  currentTier: 'heritage' | 'modern' | 'fusion';
  onTierChange: (tier: 'heritage' | 'modern' | 'fusion') => void;
  onOpenOnboarding?: () => void;
}

export const TierContextSwitcher: React.FC<TierContextSwitcherProps> = ({
  currentTier,
  onTierChange,
  onOpenOnboarding
}) => {
  const TIERS = [
    {
      id: 'heritage' as const,
      icon: '⛩️',
      name: 'Chốn Tôn Nghiêm',
      subName: 'Ngự Lãm Y Quan (Heritage Core)',
      badge: 'Chuẩn Di Sản 100%',
      desc: 'Bảo tồn nghiêm cẩn y quan triều Nguyễn: Ngũ Thân, Áo Tấc, Nhật Bình, Áo Chầu.',
      activeBorder: 'border-[#D4AF37]',
      activeBg: 'bg-gradient-to-r from-[#2c1a12] via-[#1a0f0a] to-[#120a06]',
      glowColor: 'rgba(212, 175, 55, 0.4)'
    },
    {
      id: 'modern' as const,
      icon: '🍃',
      name: 'Thanh Lịch Đời Thường',
      subName: 'Modern Heritage · Quiet Luxury',
      badge: 'Cách Tân 30%',
      desc: 'Ứng dụng phom dáng cổ phong: Linen, quần âu wide-leg, chân váy suông, sneaker trắng.',
      activeBorder: 'border-emerald-500',
      activeBg: 'bg-gradient-to-r from-[#0d2218] via-[#091710] to-[#060e0a]',
      glowColor: 'rgba(16, 185, 129, 0.35)'
    },
    {
      id: 'fusion' as const,
      icon: '⚡',
      name: 'Phố Thị Phá Cách',
      subName: 'Fusion Streetwear · The DJ Deck',
      badge: 'FUSION LẤY CẢM HỨNG',
      desc: 'Giao thoa cá tính: Tet-Core Skater, Royal Y2K, Dark Heritage, Cargo, Sneaker Dunk, xích Cuban.',
      activeBorder: 'border-[#00f3ff]',
      activeBg: 'bg-gradient-to-r from-[#0d161a] via-[#090e12] to-[#0a0a0a]',
      glowColor: 'rgba(0, 243, 255, 0.35)'
    }
  ];

  return (
    <div className="bg-[#121218] border border-white/10 rounded-3xl p-3 sm:p-4 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#e5c365]" />
            <span>3 Màn Hình / 3 Bối Cảnh Y Quan</span>
          </span>
          <span className="text-[10px] text-stone-400">· Nhấn để chuyển màn hình tức thì</span>
        </div>

        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="text-[11px] text-stone-400 hover:text-[#e5c365] transition-colors flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>Trở lại Onboarding giới thiệu</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3 Tier Segmented Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TIERS.map((tier) => {
          const isActive = currentTier === tier.id;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                if (tier.id === 'heritage') playCourtBrassSound();
                else if (tier.id === 'fusion') play808BassDropSound();
                else playDanTranhTabSound();
                onTierChange(tier.id);
              }}
              style={isActive ? { boxShadow: `0 0 24px ${tier.glowColor}` } : {}}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 relative cursor-pointer flex items-start gap-3.5 group ${
                isActive
                  ? `${tier.activeBorder} ${tier.activeBg} ring-1 ring-white/20`
                  : 'bg-[#161620] border-white/5 hover:border-white/20 hover:bg-[#1c1c28]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border transition-transform duration-300 group-hover:scale-105 ${
                isActive 
                  ? 'bg-white/10 border-white/30 shadow-inner' 
                  : 'bg-white/5 border-white/10 text-stone-400'
              }`}>
                {tier.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-sm font-bold truncate transition-colors ${
                    isActive ? 'text-[#f5f2eb]' : 'text-stone-300 group-hover:text-white'
                  }`}>
                    {tier.name}
                  </h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${
                    isActive
                      ? tier.id === 'fusion'
                        ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff]/40'
                        : tier.id === 'modern'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/15 text-[#e5c365] border-white/30'
                      : 'bg-white/5 text-stone-400 border-white/10'
                  }`}>
                    {tier.badge}
                  </span>
                </div>

                <div className={`text-[11px] font-medium mt-0.5 truncate ${
                  isActive
                    ? tier.id === 'fusion'
                      ? 'text-[#00f3ff]'
                      : tier.id === 'modern'
                      ? 'text-emerald-400'
                      : 'text-[#D4AF37]'
                    : 'text-[#D4AF37]'
                }`}>
                  {tier.subName}
                </div>

                <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              {isActive && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-ping ${
                  tier.id === 'fusion' ? 'bg-[#00f3ff]' : tier.id === 'modern' ? 'bg-emerald-400' : 'bg-[#e5c365]'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
