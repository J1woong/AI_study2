export interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  textColor?: string;
  description: string;
  enabled: boolean;
}

export interface PayerMember {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

export interface SpinRecord {
  id: string;
  name: string;
  emoji: string;
  category: string;
  time: string;
  mode: 'menu' | 'payer';
}

export type ActiveTab = 'roulette' | 'manage' | 'payer' | 'history';
