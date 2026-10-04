import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, SpinRecord, ActiveTab } from './types';
import { DEFAULT_MENU_ITEMS, MEDIEVAL_PALETTE } from './utils/constants';
import { soundController } from './utils/audio';
import { launchPastelConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { RouletteCanvas } from './components/RouletteCanvas';
import { WinnerModal } from './components/WinnerModal';
import { MenuManager } from './components/MenuManager';
import { PayerRoulette } from './components/PayerRoulette';
import { SpinHistoryList } from './components/SpinHistoryList';
import { Sparkles, Utensils, Shuffle, Plus, X, RotateCcw, Shield, Flame } from 'lucide-react';

const MEDIEVAL_EMOJIS = ['🍲', '🥩', '🐉', '🏰', '🥖', '🍖', '🍺', '🍕', '🍗', '🥪', '🍢', '🥗', '🍛', '☕'];

export default function App() {
  const [items, setItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('medieval_roulette_items');
      return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS;
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<MenuItem | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundController.getMuted());
  const [history, setHistory] = useState<SpinRecord[]>(() => {
    try {
      const saved = localStorage.getItem('medieval_roulette_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Direct quick-add state on main roulette view
  const [quickName, setQuickName] = useState('');
  const [quickEmojiIndex, setQuickEmojiIndex] = useState(0);

  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medieval_roulette_items', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medieval_roulette_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Handle Confetti resize
  useEffect(() => {
    const handleResize = () => {
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.width = window.innerWidth;
        confettiCanvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleMute = () => {
    const newState = soundController.toggleMute();
    setIsMuted(newState);
  };

  const handleSpinStart = () => {
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinEnd = (wonItem: MenuItem) => {
    setIsSpinning(false);
    setWinner(wonItem);

    if (confettiCanvasRef.current) {
      launchPastelConfetti(confettiCanvasRef.current);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: SpinRecord = {
      id: Date.now().toString(),
      name: wonItem.name,
      emoji: wonItem.emoji,
      category: '만찬 결정',
      time: timeStr,
      mode: 'menu',
    };

    setHistory((prev) => [newRecord, ...prev.slice(0, 29)]);
  };

  const handleWinPayer = (payerName: string) => {
    if (confettiCanvasRef.current) {
      launchPastelConfetti(confettiCanvasRef.current);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: SpinRecord = {
      id: Date.now().toString(),
      name: payerName,
      emoji: '🪙',
      category: '금화 지불',
      time: timeStr,
      mode: 'payer',
    };

    setHistory((prev) => [newRecord, ...prev.slice(0, 29)]);
  };

  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    const item: MenuItem = {
      ...newItem,
      id: `custom_${Date.now()}`,
    };
    setItems((prev) => [...prev, item]);
  };

  const handleDirectQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickName.trim();
    if (!trimmed) return;

    soundController.playPop();
    const selectedEmoji = MEDIEVAL_EMOJIS[quickEmojiIndex];
    const color = MEDIEVAL_PALETTE[items.length % MEDIEVAL_PALETTE.length];

    handleAddItem({
      name: trimmed,
      emoji: selectedEmoji,
      color,
      textColor: '#FFFFFF',
      description: `${trimmed} 만찬을 즐겨라!`,
      enabled: true,
    });

    setQuickName('');
    setQuickEmojiIndex((prev) => (prev + 1) % MEDIEVAL_EMOJIS.length);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetToDefaults = () => {
    soundController.playPop();
    setItems(DEFAULT_MENU_ITEMS);
  };

  const handleApplyPreset = (presetItems: MenuItem[]) => {
    setItems(presetItems);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleQuickPick = () => {
    const active = items.filter((i) => i.enabled);
    if (active.length === 0) return;
    soundController.playFanfare();
    const picked = active[Math.floor(Math.random() * active.length)];
    handleSpinEnd(picked);
  };

  const activeCount = items.filter((i) => i.enabled).length;

  return (
    <div className="min-h-screen bg-[#140E0A] text-[#F3E5D0] flex flex-col relative overflow-x-hidden">
      {/* Medieval Castle Stone Wall Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-40">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#B45309]/30 blur-3xl animate-flicker" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-[#991B1B]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#D97706]/20 blur-3xl" />
      </div>

      {/* Gold Coin / Spark Confetti Layer */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12 flex flex-col items-center">
        {/* Medieval Hero Card with Medieval Art Image */}
        <section className="text-center max-w-xl mx-auto mb-6 flex flex-col items-center">
          {/* Guild Emblem Lockup featuring the user's Medieval.jpg art */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.4)] bg-[#2A1D15] flex items-center justify-center">
              <img
                src="/medieval.jpg"
                alt="중세 기사단 전설"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to SVG heraldic shield if image cannot render
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Torch flame icon */}
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#78350F] border border-[#F59E0B] flex items-center justify-center text-[#F59E0B]">
              <Flame className="w-4 h-4 animate-flicker text-[#F59E0B]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#2A1D15] text-[#FDE68A] text-xs font-cinzel font-bold tracking-widest uppercase mb-2 border border-[#854D0E] shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>오늘의 원정 만찬 퀘스트</span>
          </div>

          <h1 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#FEF3C7] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            중세 기사단 점심 만찬 룰렛
          </h1>
          <p className="text-xs sm:text-sm text-[#D1BFA7] mt-1.5 max-w-md mx-auto">
            국밥(온포탕), 돈까스(황금 커틀릿), 마라탕(용의 숨결), 학식(기사단식), 편의점(비상식량) 중 오늘의 운명적인 한 끼를 정하십시오!
          </p>
        </section>

        {/* Tab 1: Main Roulette Wheel */}
        {activeTab === 'roulette' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
            {/* The Medieval Wheel Shield Container */}
            <div className="relative p-5 sm:p-7 rounded-3xl parchment-panel-dark border-3 border-[#854D0E] shadow-[0_16px_45px_rgba(0,0,0,0.8)]">
              <RouletteCanvas
                items={items}
                isSpinning={isSpinning}
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd}
              />
            </div>

            {/* Direct Quick-Add Input Form Right on Main Screen */}
            <div className="w-full max-w-md mt-6">
              <form
                onSubmit={handleDirectQuickAdd}
                className="flex items-center gap-2 p-2 bg-[#221811] rounded-2xl border-2 border-[#854D0E] shadow-lg"
              >
                {/* Emoji toggle button */}
                <button
                  type="button"
                  onClick={() => {
                    soundController.playPop();
                    setQuickEmojiIndex((prev) => (prev + 1) % MEDIEVAL_EMOJIS.length);
                  }}
                  className="w-10 h-10 rounded-xl bg-[#362114] hover:bg-[#4D2E1C] text-xl flex items-center justify-center shrink-0 border border-[#B45309] transition-transform active:scale-90"
                  title="클릭하여 문장(이모지) 변경"
                >
                  {MEDIEVAL_EMOJIS[quickEmojiIndex]}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  maxLength={10}
                  placeholder="새 만찬 직접 입력... (예: 칠면조 구이, 쌀국수)"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="flex-1 bg-transparent px-2 text-sm text-[#FEF3C7] placeholder:text-[#8C6D58] focus:outline-none font-medium"
                />

                {/* Add button */}
                <button
                  type="submit"
                  disabled={!quickName.trim() || isSpinning}
                  className="px-4 py-2 rounded-xl wood-button font-jua text-sm flex items-center gap-1 shadow-sm transition-all disabled:opacity-40 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>추가</span>
                </button>
              </form>
            </div>

            {/* Menu Items List with Immediate Delete (X) & Toggle */}
            <div className="w-full max-w-lg mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#D1BFA7] px-1 font-medium">
                <span>
                  출전 만찬 ({activeCount}/{items.length}개)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickPick}
                    disabled={isSpinning || activeCount === 0}
                    className="text-[#F59E0B] hover:text-[#FCD34D] font-medium flex items-center gap-1 transition-colors disabled:opacity-40"
                    title="신의 계시로 즉시 1개 선택"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>신의 계시 (즉시 선택)</span>
                  </button>

                  <button
                    onClick={handleResetToDefaults}
                    className="text-[#A89078] hover:text-[#FEF3C7] font-medium flex items-center gap-1 transition-colors"
                    title="기본 5종 메뉴로 되돌리기"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>기본 5종 복원</span>
                  </button>
                </div>
              </div>

              {/* Direct Chips with 'X' Delete buttons */}
              {items.length === 0 ? (
                <div className="p-5 rounded-2xl parchment-panel-dark border-2 border-dashed border-[#854D0E] text-center">
                  <p className="text-xs text-[#D1BFA7] mb-2">모든 만찬이 삭제되었습니다.</p>
                  <button
                    onClick={handleResetToDefaults}
                    className="px-3.5 py-1.5 rounded-xl wood-button font-jua text-xs"
                  >
                    기본 5종 만찬 다시 불러오기
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-xl text-xs font-medium transition-all duration-150 border ${
                        item.enabled
                          ? 'bg-[#291B13] border-[#B45309] text-[#FEF3C7] shadow-sm'
                          : 'bg-[#18110C] border-[#38271C] text-[#6E5545] opacity-50'
                      }`}
                    >
                      {/* Clickable body for toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSpinning) {
                            soundController.playPop();
                            handleToggleItem(item.id);
                          }
                        }}
                        className="flex items-center gap-1.5 py-0.5 text-left"
                        title={item.enabled ? '클릭하여 룰렛에서 제외' : '클릭하여 룰렛에 포함'}
                      >
                        <span className="text-sm">{item.emoji}</span>
                        <span className="font-jua text-sm text-[#FDE68A]">{item.name}</span>
                      </button>

                      {/* Direct Delete button on chip */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSpinning) {
                            soundController.playPop();
                            handleDeleteItem(item.id);
                          }
                        }}
                        disabled={isSpinning}
                        className="p-1 rounded-lg text-[#8C6D58] hover:text-[#EF4444] hover:bg-[#3D1818] transition-colors ml-0.5"
                        title={`"${item.name}" 삭제`}
                        aria-label={`"${item.name}" 삭제`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Menu Manager */}
        {activeTab === 'manage' && (
          <div className="w-full animate-in fade-in duration-200">
            <MenuManager
              items={items}
              onToggleItem={handleToggleItem}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onResetToDefaults={handleResetToDefaults}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        )}

        {/* Tab 3: Payer / Coffee Bet Roulette */}
        {activeTab === 'payer' && (
          <div className="w-full animate-in fade-in duration-200">
            <PayerRoulette onWinPayer={handleWinPayer} />
          </div>
        )}

        {/* Tab 4: History */}
        {activeTab === 'history' && (
          <div className="w-full animate-in fade-in duration-200">
            <SpinHistoryList
              history={history}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Winner Celebration Modal */}
      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onSpinAgain={() => {
          setWinner(null);
          setTimeout(() => {
            const spinBtn = document.querySelector('button[disabled="false"]');
            if (spinBtn) (spinBtn as HTMLButtonElement).click();
          }, 200);
        }}
      />

      {/* Medieval Tavern Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#8C6D58] border-t border-[#854D0E]/40 mt-auto">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <Utensils className="w-3.5 h-3.5 text-[#B45309]" />
          <span>기사단 만찬 원정대 프로젝트 · 전사들이여 맛있는 만찬을 즐겨라!</span>
        </p>
      </footer>
    </div>
  );
}
