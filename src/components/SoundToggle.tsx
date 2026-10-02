import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundMute, playDanTranhTabSound } from '../utils/soundEffects';

interface SoundToggleProps {
  variant?: 'floating' | 'navbar' | 'compact';
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ variant = 'floating', className = '' }) => {
  const { isMuted, toggleMute } = useSoundMute();

  const handleToggle = () => {
    const wasMuted = isMuted;
    toggleMute();
    // If we just unmuted, play a delicate Dan Tranh arpeggio to greet the user
    if (wasMuted) {
      setTimeout(() => {
        playDanTranhTabSound();
      }, 50);
    }
  };

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
          !isMuted
            ? 'bg-[#1c1a24] text-[#e5c365] border-[#c5a059]/50 hover:bg-[#252230]'
            : 'bg-[#15151b] text-stone-400 border-stone-800 hover:text-stone-200'
        } ${className}`}
        title={!isMuted ? 'Tắt âm thanh cổ phong (Web Audio API)' : 'Bật âm thanh cổ phong (Web Audio API)'}
      >
        {!isMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#e5c365] animate-pulse" />
            <span className="hidden xl:inline text-[11px]">Âm thanh</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden xl:inline text-[11px]">Tắt âm</span>
          </>
        )}
      </button>
    );
  }

  // Floating variant in the bottom corner of screen
  return (
    <div className={`fixed bottom-6 right-6 z-50 pointer-events-auto ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`group relative p-2.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer ${
          !isMuted
            ? 'bg-[#181822]/90 border-[#c5a059]/60 text-[#e5c365] shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:scale-110 hover:border-[#e5c365]'
            : 'bg-[#121217]/90 border-stone-700/60 text-stone-400 hover:text-stone-200 hover:scale-105'
        }`}
        title={!isMuted ? 'Âm thanh Cổ Phong đang BẬT (Click để tắt)' : 'Âm thanh Cổ Phong đang TẮT (Click để bật)'}
        aria-label="Toggle Sound Effects"
      >
        {!isMuted ? (
          <Volume2 className="w-4 h-4 text-[#e5c365] transition-transform group-hover:scale-110" />
        ) : (
          <VolumeX className="w-4 h-4 text-stone-400 transition-transform group-hover:scale-110" />
        )}

        {/* Ambient Ring Glow when sound is ON */}
        {!isMuted && (
          <span className="absolute -inset-0.5 rounded-full bg-[#c5a059]/20 animate-ping pointer-events-none opacity-40" />
        )}

        {/* Tooltip on hover */}
        <span className="absolute bottom-full right-0 mb-2.5 hidden group-hover:block whitespace-nowrap bg-black/90 backdrop-blur-md text-[11px] font-medium text-stone-200 border border-[#c5a059]/40 px-2.5 py-1 rounded-lg shadow-xl pointer-events-none">
          {!isMuted ? '🎵 Âm thanh Cổ Phong: Đang Bật' : '🔇 Âm thanh Cổ Phong: Đang Tắt (Bấm để bật)'}
        </span>
      </button>
    </div>
  );
};
