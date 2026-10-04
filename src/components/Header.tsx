import React from 'react';
import { ActiveTab } from '../types';
import { soundController } from '../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b-2 border-[#854D0E] bg-[#1E1610]/90 backdrop-blur-md rounded-2xl mt-2 mb-6 shadow-xl">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('roulette');
        }}
        className="font-cinzel font-bold text-xl sm:text-2xl text-[#F59E0B] hover:text-[#FCD34D] transition-colors whitespace-nowrap tracking-wider flex items-center gap-2"
      >
        <span className="text-xl">⚔️</span>
        <span className="font-jua text-xl sm:text-2xl">기사단 점심 퀘스트</span>
      </a>

      {/* Zone 2: Navigation tabs */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => {
            soundController.playPop();
            onSelectTab('roulette');
          }}
          className={`px-3 py-1.5 rounded-xl font-jua text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'roulette'
              ? 'wood-button shadow-md'
              : 'text-[#D1BFA7] hover:text-[#FEF3C7] hover:bg-[#2F2117]'
          }`}
        >
          룰렛 회전
        </button>

        <button
          onClick={() => {
            soundController.playPop();
            onSelectTab('manage');
          }}
          className={`px-3 py-1.5 rounded-xl font-jua text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'manage'
              ? 'wood-button shadow-md'
              : 'text-[#D1BFA7] hover:text-[#FEF3C7] hover:bg-[#2F2117]'
          }`}
        >
          보급 대장
        </button>

        <button
          onClick={() => {
            soundController.playPop();
            onSelectTab('payer');
          }}
          className={`px-3 py-1.5 rounded-xl font-jua text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'payer'
              ? 'wood-button shadow-md'
              : 'text-[#D1BFA7] hover:text-[#FEF3C7] hover:bg-[#2F2117]'
          }`}
        >
          골드 내기
        </button>

        <button
          onClick={() => {
            soundController.playPop();
            onSelectTab('history');
          }}
          className={`px-3 py-1.5 rounded-xl font-jua text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeTab === 'history'
              ? 'wood-button shadow-md'
              : 'text-[#D1BFA7] hover:text-[#FEF3C7] hover:bg-[#2F2117]'
          }`}
        >
          연대기
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions (Audio Mute Toggle) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-[#2A1D15] border border-[#854D0E] text-[#D1BFA7] hover:text-[#F59E0B] hover:bg-[#3D281C] transition-colors shadow-sm"
          title={isMuted ? '음향 켜기' : '음향 끄기'}
          aria-label={isMuted ? '음향 켜기' : '음향 끄기'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#8C6D58]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#F59E0B]" />
          )}
        </button>
      </div>
    </header>
  );
};
