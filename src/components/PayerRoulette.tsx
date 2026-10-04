import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PayerMember } from '../types';
import { soundController } from '../utils/audio';
import { DEFAULT_PAYER_MEMBERS, MEDIEVAL_PALETTE } from '../utils/constants';
import { Coins, Plus, Trash2, RotateCcw, Crown } from 'lucide-react';

interface PayerRouletteProps {
  onWinPayer: (name: string) => void;
}

export const PayerRoulette: React.FC<PayerRouletteProps> = ({ onWinPayer }) => {
  const [members, setMembers] = useState<PayerMember[]>(() => {
    try {
      const saved = localStorage.getItem('medieval_roulette_payers');
      return saved ? JSON.parse(saved) : DEFAULT_PAYER_MEMBERS;
    } catch {
      return DEFAULT_PAYER_MEMBERS;
    }
  });

  const [newName, setNewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastPegRef = useRef<number>(-1);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medieval_roulette_payers', JSON.stringify(members));
    } catch {
      // ignore
    }
  }, [members]);

  const activeMembers = members.filter((m) => m.enabled);
  const count = activeMembers.length;

  const drawWheel = useCallback(
    (currentAngle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = 340;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 16;

      ctx.clearRect(0, 0, size, size);

      if (count === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#2A1F18';
        ctx.fill();
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 15px "Cinzel", "Noto Sans KR", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('모험가를 추가해주세요', centerX, centerY);
        return;
      }

      const sliceAngle = (Math.PI * 2) / count;

      // Heavy bronze & gold outer rim
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = '#3F2212';
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Slices
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngle);

      for (let i = 0; i < count; i++) {
        const member = activeMembers[i];
        const start = i * sliceAngle;
        const end = (i + 1) * sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = member.color;
        ctx.fill();

        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.save();
        ctx.rotate(start + sliceAngle / 2);
        ctx.translate(radius * 0.65, 0);
        ctx.rotate(Math.PI / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;

        ctx.font = `bold ${count > 8 ? 12 : 14}px "Jua", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(member.name, 0, 0);

        ctx.restore();
      }

      ctx.restore();

      // Center gold coin hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#78350F';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🪙', centerX, centerY);
    },
    [activeMembers, count]
  );

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const startSpin = () => {
    if (isSpinning || count < 2) return;

    soundController.playPop();
    setIsSpinning(true);
    setSelectedPayer(null);

    const startRotation = rotationRef.current;
    const addedRotation = 6 * Math.PI * 2 + Math.random() * Math.PI * 2;
    const targetRotation = startRotation + addedRotation;

    const duration = 4200;
    const startTime = performance.now();
    const sliceAngle = (Math.PI * 2) / count;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3.8);
      const currentAngle = startRotation + addedRotation * easeOut;

      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      const normalizedAngle = ((1.5 * Math.PI - currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const currentPeg = Math.floor(normalizedAngle / sliceAngle);

      if (currentPeg !== lastPegRef.current) {
        lastPegRef.current = currentPeg;
        soundController.playTick(1.0);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = targetRotation % (Math.PI * 2);
        drawWheel(rotationRef.current);

        const finalNormalized = ((1.5 * Math.PI - targetRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const winningIndex = Math.floor(finalNormalized / sliceAngle) % count;
        const winner = activeMembers[winningIndex];

        soundController.playFanfare();
        setSelectedPayer(winner.name);
        setIsSpinning(false);
        onWinPayer(winner.name);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    soundController.playPop();

    const color = MEDIEVAL_PALETTE[members.length % MEDIEVAL_PALETTE.length];
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        color,
        enabled: true,
      },
    ]);
    setNewName('');
  };

  const handleDelete = (id: string) => {
    soundController.playPop();
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleToggle = (id: string) => {
    soundController.playPop();
    setMembers(
      members.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleReset = () => {
    soundController.playPop();
    setMembers(DEFAULT_PAYER_MEMBERS);
    setSelectedPayer(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Description header */}
      <div className="parchment-panel-dark border-2 border-[#854D0E] rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="font-jua text-base text-[#FDE68A] flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#F59E0B]" />
            <span>주막 만찬 골드(금화) 지불자 선정!</span>
          </h3>
          <p className="text-xs text-[#D1BFA7] mt-0.5">
            기사단원의 이름을 올리고 운명의 룰렛을 돌려 오늘 금화를 지불할 귀족을 정하세요!
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#FEF3C7] bg-[#451A03] hover:bg-[#592205] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 border border-[#B45309]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>초기화</span>
        </button>
      </div>

      {/* Roulette Wheel Area */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] flex items-center justify-center">
          {/* Broadsword Needle at 12 o'clock */}
          <div className="absolute top-1 z-20 pointer-events-none transform -translate-x-1/2 left-1/2">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[22px] border-t-[#E2E8F0] drop-shadow-md"></div>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onClick={startSpin}
          />
        </div>

        {/* Spin button */}
        <button
          onClick={startSpin}
          disabled={isSpinning || count < 2}
          className={`mt-4 px-8 py-3.5 rounded-2xl font-jua text-lg transition-all ${
            isSpinning || count < 2
              ? 'bg-[#2A1D15] text-[#715444] border border-[#4A3225] cursor-not-allowed'
              : 'wood-button hover:gold-glow active:scale-95'
          }`}
        >
          {isSpinning ? '주모가 장부를 뒤적이는 중...' : '🪙 금화 쏠 기사 뽑기!'}
        </button>
      </div>

      {/* Selected Winner Banner */}
      {selectedPayer && (
        <div className="p-4 rounded-2xl parchment-panel text-center animate-in zoom-in-95 duration-200 border-2 border-[#B45309]">
          <p className="text-xs text-[#B45309] font-cinzel font-bold mb-1 flex items-center justify-center gap-1">
            <Crown className="w-4 h-4 text-[#B45309]" />
            <span>오늘의 명예로운 만찬 스폰서</span>
          </p>
          <p className="font-jua text-2xl text-[#382414]">
            🪙 <span className="text-[#991B1B] font-bold">{selectedPayer}</span> 님이 금화를 지불하십니다! 신의 가호가 함께하길! ✨
          </p>
        </div>
      )}

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} className="flex gap-2">
        <input
          type="text"
          maxLength={10}
          placeholder="기사/동아리원 이름 입력 (예: 랜슬롯, 회장님)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#261B14] border-2 border-[#854D0E] text-sm text-[#FDE68A] placeholder:text-[#8C6D58] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl wood-button font-jua text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>등록</span>
        </button>
      </form>

      {/* Members Tag List */}
      <div className="parchment-panel-dark p-4 rounded-2xl border-2 border-[#854D0E] space-y-2">
        <div className="text-xs text-[#D1BFA7] font-medium">
          참전 기사 명단 ({count}/{members.length}명)
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <div
              key={m.id}
              onClick={() => handleToggle(m.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                m.enabled
                  ? 'bg-[#3D2517] text-[#FEF3C7] border-[#B45309] shadow-xs'
                  : 'bg-[#18120D] text-[#6B5344] border-[#3D281C] opacity-50'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span>{m.name}</span>
              {members.length > 2 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.id);
                  }}
                  className="hover:text-rose-400 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
