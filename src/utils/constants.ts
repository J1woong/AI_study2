import { MenuItem, PayerMember } from '../types';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'gukbap',
    name: '국밥',
    emoji: '🍲',
    color: '#D97706', // Rich tavern amber
    textColor: '#FEF3C7',
    description: '모험으로 지친 기사의 피로를 싹 풀어주는 주막 특제 온포탕! 깍두기 국물을 얹어 든든하게 한 그릇 비워냅니다.',
    enabled: true,
  },
  {
    id: 'donkatsu',
    name: '돈까스',
    emoji: '🥩',
    color: '#CA8A04', // Golden knight cutlet
    textColor: '#FEF08A',
    description: '바삭하게 튀겨낸 황금 돼지 커틀릿! 달콤한 특제 소스와 샐러드를 곁들인 기사단 최고의 인기 연회식!',
    enabled: true,
  },
  {
    id: 'malatang',
    name: '마라탕',
    emoji: '🐉',
    color: '#B91C1C', // Dragon fire crimson
    textColor: '#FEE2E2',
    description: '화룡의 숨결처럼 얼큰하고 알싸한 마라 전골! 옥수수면과 푸주를 듬뿍 넣어 지친 전사의 투기를 깨웁니다!',
    enabled: true,
  },
  {
    id: 'hakshik',
    name: '학식',
    emoji: '🏰',
    color: '#047857', // Knight academy green
    textColor: '#D1FAE5',
    description: '가성비 최강이자 성채 길드홀에서 3분 컷! 주머니 사정이 가벼운 견습 기사들의 든든한 영양 보급소!',
    enabled: true,
  },
  {
    id: 'pyeonui',
    name: '편의점',
    emoji: '🥖',
    color: '#6D28D9', // Magic potion purple
    textColor: '#EDE9FE',
    description: '던전 탐험 중 가장 빠르고 간편한 보급! 삼각 주먹밥 + 마법 컵라면 + 활력 물약의 환상적인 꿀조합!',
    enabled: true,
  },
];

export const PRESET_OPTIONS: { label: string; items: MenuItem[] }[] = [
  {
    label: '기본 5종 (국밥/돈까스/마라탕/학식/편의점)',
    items: DEFAULT_MENU_ITEMS,
  },
  {
    label: '기사단 만찬 풀코스 (7종)',
    items: [
      ...DEFAULT_MENU_ITEMS,
      {
        id: 'chinese',
        name: '짜장/짬뽕',
        emoji: '🥢',
        color: '#B45309',
        textColor: '#FEF3C7',
        description: '동방 상단의 비전 춘장 소스와 불꽃 향 가득한 해물 면 요리!',
        enabled: true,
      },
      {
        id: 'fastfood',
        name: '버거/샌드위치',
        emoji: '🍔',
        color: '#4338CA',
        textColor: '#E0E7FF',
        description: '두툼한 고기 패티와 신선한 채소를 구운 빵 사이에 듬뿍 끼운 원정대 간식!',
        enabled: true,
      },
    ],
  },
  {
    label: '모험가 간편 보급 (가성비)',
    items: [
      DEFAULT_MENU_ITEMS[3], // 학식
      DEFAULT_MENU_ITEMS[4], // 편의점
      {
        id: 'bunsik',
        name: '분식/떡볶이',
        emoji: '🍢',
        color: '#BE123C',
        textColor: '#FFE4E6',
        description: '매콤달콤 붉은 마법 소스에 쫀득한 떡과 바삭한 튀김의 조화!',
        enabled: true,
      },
      {
        id: 'salad',
        name: '샐러드/샌드위치',
        emoji: '🥗',
        color: '#065F46',
        textColor: '#D1FAE5',
        description: '엘프 숲에서 공수한 신선한 채소로 만든 가볍고 건강한 식사!',
        enabled: true,
      },
    ],
  },
];

export const DEFAULT_PAYER_MEMBERS: PayerMember[] = [
  { id: '1', name: '성주 (Leader)', color: '#B91C1C', enabled: true },
  { id: '2', name: '기사단장 (Knight)', color: '#CA8A04', enabled: true },
  { id: '3', name: '궁정 마법사 (Mage)', color: '#6D28D9', enabled: true },
  { id: '4', name: '길드 회계사 (Treasurer)', color: '#047857', enabled: true },
  { id: '5', name: '견습 기사 (Squire)', color: '#1D4ED8', enabled: true },
  { id: '6', name: '음유시인 (Bard)', color: '#D97706', enabled: true },
];

export const MEDIEVAL_PALETTE = [
  '#B91C1C', // Royal Crimson
  '#CA8A04', // Gilded Gold
  '#047857', // Forest Emerald
  '#1D4ED8', // Knight Sapphire
  '#6D28D9', // Arcane Purple
  '#D97706', // Tavern Amber
  '#78350F', // Oak Brown
  '#BE123C', // Dragon Ruby
  '#0E7490', // Ocean Cyan
];

export const PASTEL_PALETTE = MEDIEVAL_PALETTE;
