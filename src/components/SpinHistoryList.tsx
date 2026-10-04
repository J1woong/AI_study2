import React from 'react';
import { SpinRecord } from '../types';
import { soundController } from '../utils/audio';
import { Scroll, Trash2, ShieldAlert } from 'lucide-react';

interface SpinHistoryListProps {
  history: SpinRecord[];
  onClearHistory: () => void;
}

export const SpinHistoryList: React.FC<SpinHistoryListProps> = ({
  history,
  onClearHistory,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between parchment-panel-dark p-4 rounded-2xl border-2 border-[#854D0E] shadow-lg">
        <div className="flex items-center gap-2">
          <Scroll className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="font-jua text-base text-[#FDE68A]">
            원정대 만찬 연대기 (당첨 기록)
          </h3>
          <span className="text-xs text-[#A89078]">({history.length}회 기록)</span>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              soundController.playPop();
              onClearHistory();
            }}
            className="text-xs text-[#A89078] hover:text-[#EF4444] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#381616]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>기록 소각</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="parchment-panel-dark rounded-2xl p-8 border-2 border-dashed border-[#854D0E]/60 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-[#A89078] mx-auto opacity-70" />
          <p className="font-jua text-base text-[#D1BFA7]">
            아직 기록된 만찬이 없습니다!
          </p>
          <p className="text-xs text-[#8C6D58]">
            운명의 룰렛을 돌려 오늘의 첫 원정 식사를 결정하십시오.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3.5 rounded-2xl parchment-panel-dark border border-[#854D0E] shadow-md hover:border-[#F59E0B] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3D2517] flex items-center justify-center text-2xl border border-[#B45309]">
                  {record.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-jua text-base text-[#FDE68A]">
                      {record.name}
                    </span>
                    <span className="text-[10px] text-[#FEF3C7] bg-[#78350F] px-2 py-0.5 rounded-md font-medium border border-[#B45309]">
                      {record.category}
                    </span>
                  </div>
                  <span className="text-xs text-[#8C6D58]">{record.time}</span>
                </div>
              </div>

              <span className="text-xs text-[#D1BFA7] font-medium">
                {record.mode === 'menu' ? '⚔️ 만찬 결정' : '🪙 금화 지불'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
