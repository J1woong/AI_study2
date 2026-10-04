import React, { useState } from 'react';
import { MenuItem } from '../types';
import { soundController } from '../utils/audio';
import { Check, Copy, RotateCcw, X, Shield, Scroll } from 'lucide-react';

interface WinnerModalProps {
  winner: MenuItem | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onSpinAgain,
}) => {
  const [copied, setCopied] = useState(false);

  if (!winner) return null;

  const handleCopy = () => {
    soundController.playPop();
    const shareText = `📜 [중세 기사단 만찬 포고령] ⚔️\n오늘 성채 길드의 점심 원정 메뉴는 "${winner.emoji} ${winner.name}"(으)로 칙령이 내려졌습니다!\n모든 기사와 모험가는 만찬장으로 집결하라! 🏰`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md parchment-panel rounded-3xl p-6 sm:p-8 text-center transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundController.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#451A03] text-[#FDE68A] hover:bg-[#78350F] transition-colors flex items-center justify-center border border-[#B45309]"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heraldic Badge / Wax Seal */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#881337] text-[#FEF08A] text-xs font-cinzel font-bold tracking-widest uppercase mb-3 shadow-md border border-[#F59E0B]">
          <Shield className="w-3.5 h-3.5 text-[#FCD34D]" />
          <span>기사단 만찬 포고령</span>
        </div>

        {/* Heraldic Shield Avatar */}
        <div className="relative my-3 flex items-center justify-center">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl shadow-2xl border-4 border-[#F59E0B] transition-transform hover:scale-105"
            style={{ backgroundColor: winner.color }}
          >
            <span className="drop-shadow-md">{winner.emoji}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-jua text-3xl sm:text-4xl text-[#3F2212] mt-2 mb-2 tracking-tight">
          {winner.name} 낙점!
        </h2>

        {/* Scroll proclamation quote */}
        <div className="text-sm text-[#451A03] leading-relaxed max-w-sm mx-auto bg-[#FBF0D9] p-3.5 rounded-2xl border-2 border-[#D97706]/50 mb-6 shadow-inner flex items-start gap-2.5">
          <Scroll className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
          <p className="text-left font-medium">
            {winner.description || '오늘의 퀘스트를 완수한 기사들에게 주어지는 최고의 만찬!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#592B14] hover:bg-[#78350F] text-[#FEF3C7] font-jua text-sm transition-all duration-150 flex items-center justify-center gap-2 border border-[#B45309] shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#86EFAC]" />
                <span className="text-[#86EFAC] font-semibold">포고령 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#FDE68A]" />
                <span>포고령 공유하기</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundController.playPop();
              onSpinAgain();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl wood-button font-jua text-base shadow-md transition-all duration-150 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>운명 다시 시험하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
