import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MenuItem } from '../types';
import { soundController } from '../utils/audio';

interface RouletteCanvasProps {
  items: MenuItem[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: MenuItem) => void;
}

export const RouletteCanvas: React.FC<RouletteCanvasProps> = ({
  items,
  isSpinning,
  onSpinStart,
  onSpinEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastPegRef = useRef<number>(-1);

  // Pointer deflection angle (degrees) for physical bounce effect
  const [pointerDeflection, setPointerDeflection] = useState<number>(0);
  const pointerDeflectionRef = useRef<number>(0);

  const activeItems = items.filter((it) => it.enabled);
  const count = activeItems.length;

  // Draw the medieval wheel of destiny
  const drawWheel = useCallback(
    (currentAngle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = 390;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 20;

      ctx.clearRect(0, 0, size, size);

      if (count === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#2A1F18';
        ctx.fill();
        ctx.strokeStyle = '#854D0E';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 16px "Cinzel", "Noto Sans KR", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('등록된 퀘스트 메뉴가 없습니다', centerX, centerY);
        return;
      }

      const sliceAngle = (Math.PI * 2) / count;

      // 1. Dark forged cast shadow behind the shield wheel
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
      ctx.fillStyle = '#170E08';
      ctx.fill();
      ctx.restore();

      // 2. Heavy forged oak & bronze outer rim
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
      ctx.fillStyle = '#3F2212';
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner golden border ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer forged iron rivets/studs around the rim
      const numStuds = Math.max(16, count * 4);
      for (let i = 0; i < numStuds; i++) {
        const studAngle = (i * Math.PI * 2) / numStuds;
        const studX = centerX + Math.cos(studAngle) * (radius + 6);
        const studY = centerY + Math.sin(studAngle) * (radius + 6);

        ctx.beginPath();
        ctx.arc(studX, studY, 3, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#FDE68A' : '#D97706';
        ctx.fill();
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Slices (Medieval Heraldic Sectors)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngle);

      for (let i = 0; i < count; i++) {
        const item = activeItems[i];
        const start = i * sliceAngle;
        const end = (i + 1) * sliceAngle;

        // Heraldic sector
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        // Gilded engraving hairline between sectors
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Peg dot on the outer perimeter
        const pegX = Math.cos(start) * (radius - 6);
        const pegY = Math.sin(start) * (radius - 6);
        ctx.beginPath();
        ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FEF08A';
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Content (Emoji + Name)
        ctx.save();
        ctx.rotate(start + sliceAngle / 2);

        const textDistance = radius * 0.62;
        ctx.translate(textDistance, 0);
        ctx.rotate(Math.PI / 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Emoji
        ctx.font = count > 8 ? '20px "Apple Color Emoji", "Segoe UI Emoji", sans-serif' : '26px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
        ctx.fillText(item.emoji, 0, -14);

        // Name with medieval drop-shadow for supreme legibility
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;

        const fontSize = count > 8 ? 12 : count > 5 ? 14 : 16;
        ctx.font = `bold ${fontSize}px "Jua", "Noto Sans KR", serif`;

        const displayName = item.name.length > 5 ? item.name.slice(0, 5) + '..' : item.name;
        ctx.fillText(displayName, 0, 14);

        ctx.restore();
      }

      ctx.restore();

      // 4. Center Shield Boss / Royal Seal Hub
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      // Outer bronze boss
      ctx.beginPath();
      ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
      ctx.fillStyle = '#451A03';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Inner gold coin boss
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#92400E';
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center cross swords or crown
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚔️', centerX, centerY);

      ctx.restore();
    },
    [activeItems, count]
  );

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  // Pointer deflection damping
  useEffect(() => {
    let animId: number;
    const updatePointer = () => {
      if (Math.abs(pointerDeflectionRef.current) > 0.1) {
        pointerDeflectionRef.current *= 0.82;
        setPointerDeflection(pointerDeflectionRef.current);
      } else if (pointerDeflectionRef.current !== 0) {
        pointerDeflectionRef.current = 0;
        setPointerDeflection(0);
      }
      animId = requestAnimationFrame(updatePointer);
    };
    animId = requestAnimationFrame(updatePointer);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Spin execution
  const startSpin = useCallback(() => {
    if (isSpinning || count < 2) return;

    soundController.playPop();
    onSpinStart();

    const startRotation = rotationRef.current;
    const minRotations = 6;
    const extraRotations = Math.floor(Math.random() * 3);
    const randomOffset = Math.random() * Math.PI * 2;
    const totalAddedRotation = (minRotations + extraRotations) * Math.PI * 2 + randomOffset;
    const targetRotation = startRotation + totalAddedRotation;

    const duration = 4600;
    const startTime = performance.now();
    const sliceAngle = (Math.PI * 2) / count;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3.8);
      const currentAngle = startRotation + totalAddedRotation * easeOut;

      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      const normalizedAngle = ((1.5 * Math.PI - currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const currentPeg = Math.floor(normalizedAngle / sliceAngle);

      if (currentPeg !== lastPegRef.current) {
        lastPegRef.current = currentPeg;
        const speed = 1 - progress;
        soundController.playTick(0.8 + speed * 0.8);
        pointerDeflectionRef.current = -15 * Math.max(0.3, speed);
        setPointerDeflection(pointerDeflectionRef.current);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = targetRotation % (Math.PI * 2);
        drawWheel(rotationRef.current);

        const finalNormalized = ((1.5 * Math.PI - targetRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const winningIndex = Math.floor(finalNormalized / sliceAngle) % count;
        const winner = activeItems[winningIndex];

        soundController.playFanfare();
        onSpinEnd(winner);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, count, onSpinStart, activeItems, drawWheel, onSpinEnd]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Top Medieval Pointer Indicator: Broadsword Needle */}
      <div className="relative w-[340px] sm:w-[390px] h-[340px] sm:h-[390px] flex items-center justify-center">
        {/* Needle Pin at Top (12 o'clock) */}
        <div
          className="absolute top-1 z-20 pointer-events-none transition-transform"
          style={{
            transformOrigin: '50% 15%',
            transform: `translateX(-50%) rotate(${pointerDeflection}deg)`,
            left: '50%',
          }}
        >
          {/* Knight's Silver Broadsword Tip Pointer */}
          <div className="relative flex flex-col items-center">
            {/* Sword Pommel (Ruby Gem) */}
            <div className="w-5 h-5 rounded-full bg-[#B91C1C] border-2 border-[#F59E0B] shadow-lg z-10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FEF08A]"></div>
            </div>
            {/* Sword Blade Needle */}
            <div
              className="w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[26px] border-t-[#E2E8F0] -mt-1 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
            ></div>
          </div>
        </div>

        {/* Canvas Wheel */}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer transition-transform active:scale-[0.99]"
          onClick={() => {
            if (!isSpinning && count >= 2) {
              startSpin();
            }
          }}
          title={isSpinning ? '운명의 룰렛이 회전하는 중...' : '클릭하여 룰렛 회전!'}
        />
      </div>

      {/* Primary Action Button: Heavy Medieval Forged Button */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          onClick={startSpin}
          disabled={isSpinning || count < 2}
          className={`group relative px-9 py-4 rounded-2xl font-cinzel font-bold text-xl tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center gap-3 ${
            isSpinning
              ? 'bg-[#3E2718] text-[#8C6D58] border-2 border-[#5C3D2E] cursor-not-allowed'
              : count < 2
              ? 'bg-[#2A1D15] text-[#715444] border-2 border-[#4A3225] cursor-not-allowed'
              : 'wood-button hover:gold-glow'
          }`}
        >
          <span className="text-2xl transition-transform group-hover:rotate-45">
            {isSpinning ? '⚔️' : '🛡️'}
          </span>
          <span className="font-jua text-xl">
            {isSpinning ? '운명의 만찬 선정 중...' : '⚔️ 운명의 룰렛 돌리기!'}
          </span>
        </button>

        {count < 2 && (
          <p className="text-xs text-[#F59E0B] font-medium">
            최소 2개 이상의 퀘스트 메뉴를 활성화해주세요!
          </p>
        )}
      </div>
    </div>
  );
};
