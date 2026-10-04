import React, { useState } from 'react';
import { MenuItem } from '../types';
import { soundController } from '../utils/audio';
import { PRESET_OPTIONS, MEDIEVAL_PALETTE, DEFAULT_MENU_ITEMS } from '../utils/constants';
import { Plus, RotateCcw, Trash2, CheckCircle2, Circle, Sparkles, X, Scroll, Sword } from 'lucide-react';

interface MenuManagerProps {
  items: MenuItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onResetToDefaults: () => void;
  onApplyPreset: (presetItems: MenuItem[]) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetToDefaults,
  onApplyPreset,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🥩');
  const [newColor, setNewColor] = useState(MEDIEVAL_PALETTE[0]);
  const [newDescription, setNewDescription] = useState('');

  const emojiChoices = ['🍲', '🥩', '🐉', '🏰', '🥖', '🍺', '🍗', '🥪', '🍕', '🍢', '🥗', '🍛', '🍣', '☕', '🍷', '🍖'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    soundController.playPop();
    onAddItem({
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
      textColor: '#FFFFFF',
      description: newDescription.trim() || `${newName.trim()} 만찬을 즐겨라!`,
      enabled: true,
    });

    setNewName('');
    setNewDescription('');
    setIsAdding(false);
  };

  const activeCount = items.filter((i) => i.enabled).length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 parchment-panel-dark p-4 rounded-2xl border-2 border-[#854D0E] shadow-lg">
        <div>
          <h3 className="font-jua text-lg text-[#FDE68A] flex items-center gap-1.5">
            <Scroll className="w-4 h-4 text-[#F59E0B]" />
            <span>기사단 보급 대장 (메뉴 관리)</span>
            <span className="text-xs font-sans text-[#FCD34D] font-medium">
              ({activeCount}/{items.length}개 활성화)
            </span>
          </h3>
          <p className="text-xs text-[#D1BFA7] mt-0.5">
            새로운 원정 만찬을 등록하거나 제외할 메뉴를 직접 설정하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundController.playPop();
              setIsAdding(!isAdding);
            }}
            className="px-3.5 py-2 rounded-xl wood-button text-xs font-jua flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>새 만찬 등록</span>
          </button>

          <button
            onClick={() => {
              soundController.playPop();
              onResetToDefaults();
            }}
            className="px-3 py-2 rounded-xl bg-[#2A1D15] hover:bg-[#3D281C] text-[#E7D6C4] text-xs font-medium flex items-center gap-1 transition-colors border border-[#6B4226]"
            title="기본 5종 메뉴로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본 5종 복원</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#D1BFA7] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
          <span>성채 주방 추천 프리셋</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_OPTIONS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundController.playPop();
                onApplyPreset(preset.items);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#261B14] hover:bg-[#38271C] border border-[#92400E] text-[#FDE68A] text-xs font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="parchment-panel p-5 rounded-2xl border-3 border-[#B45309] shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-jua text-base text-[#382414] flex items-center gap-1.5">
              <Sword className="w-4 h-4 text-[#B45309]" />
              <span>새로운 퀘스트 만찬 등록</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg text-[#78350F] hover:text-[#451A03] hover:bg-[#EBD2B0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#451A03] mb-1">
                메뉴 이름 <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="예: 훈제 칠면조, 양고기 스튜"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border-2 border-[#D97706] text-sm text-[#271408] placeholder:text-[#A18265] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#451A03] mb-1">
                한 줄 설명 (선택)
              </label>
              <input
                type="text"
                maxLength={40}
                placeholder="예: 참나무 숯불로 구워낸 든든한 고기!"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border-2 border-[#D97706] text-sm text-[#271408] placeholder:text-[#A18265] focus:outline-none focus:ring-2 focus:ring-[#B45309]"
              />
            </div>
          </div>

          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-medium text-[#451A03] mb-1">
              문장(이모지) 선택 ({newEmoji})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {emojiChoices.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setNewEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                    newEmoji === emoji
                      ? 'bg-[#EAB308] scale-110 border-2 border-[#78350F] shadow-sm'
                      : 'hover:bg-[#EBD2B0]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-xs font-medium text-[#451A03] mb-1">
              문장 색상 선택
            </label>
            <div className="flex items-center gap-2">
              {MEDIEVAL_PALETTE.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setNewColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    newColor === color ? 'border-[#382414] scale-110 shadow-sm' : 'border-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl wood-button font-jua text-sm shadow-sm transition-colors"
            >
              기사단 만찬부에 등록하기 ⚔️
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2.5 rounded-xl bg-[#EBD2B0] hover:bg-[#DFBF97] text-[#451A03] text-sm font-medium"
            >
              닫기
            </button>
          </div>
        </form>
      )}

      {/* Menu Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="parchment-panel p-8 rounded-2xl text-center space-y-3">
            <p className="font-jua text-base text-[#451A03]">등록된 만찬이 없습니다.</p>
            <button
              onClick={() => onResetToDefaults()}
              className="px-4 py-2 rounded-xl wood-button font-jua text-sm"
            >
              기본 5종 만찬 불러오기
            </button>
          </div>
        ) : (
          items.map((item) => {
            const isDefault = DEFAULT_MENU_ITEMS.some((d) => d.name === item.name);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.enabled
                    ? 'parchment-panel-dark border-[#854D0E] shadow-sm'
                    : 'bg-[#18120D] border-[#3D281C] opacity-50'
                }`}
              >
                {/* Left section: Checkbox + preview badge + text */}
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    soundController.playPop();
                    onToggleItem(item.id);
                  }}
                >
                  <div className="text-[#F59E0B] shrink-0 hover:scale-110 transition-transform">
                    {item.enabled ? (
                      <CheckCircle2 className="w-5 h-5 text-[#F59E0B] fill-[#451A03]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#5C3D2E]" />
                    )}
                  </div>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md border border-[#F59E0B]/50"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-jua text-base text-[#FDE68A] truncate">
                        {item.name}
                      </span>
                      {isDefault && (
                        <span className="text-[10px] text-[#FEF3C7] bg-[#78350F] px-1.5 py-0.5 rounded-md font-medium shrink-0 border border-[#B45309]">
                          기본
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#D1BFA7] truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right section: Visible Delete button */}
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundController.playPop();
                      onDeleteItem(item.id);
                    }}
                    className="p-2 rounded-xl text-[#F87171] hover:text-[#EF4444] hover:bg-[#3D1414] transition-colors flex items-center gap-1 border border-transparent hover:border-[#7F1D1D]"
                    title={`"${item.name}" 만찬 삭제`}
                    aria-label={`"${item.name}" 만찬 삭제`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">삭제</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
