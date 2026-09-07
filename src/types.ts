export type NavPage = 'home' | 'station-1-2' | 'station-3-4' | 'station-5-6' | 'games' | 'kiem-tra-model';

export type GradeFilter = 'all' | 'k6' | 'k7' | 'k8';

export interface StationInfo {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  yccd: string;
  week: string;
  description: string;
  grades: ('k6' | 'k7' | 'k8')[];
  icon: string;
  isSpecial?: boolean;
  navTarget: NavPage;
  subStationId?: string;
}

export interface GameInfo {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  target: string;
  icon: string;
}

export interface Flashcard {
  indexTag: string;
  time: string;
  overline: string;
  title: string;
  body: string;
  analogy: string;
  analogyDetail: string;
  type: 'matrix' | 'compare' | 'prob' | 'bias' | 'pattern' | 'human';
}

export interface Visitor {
  id: number;
  type: 'friend' | 'friend_hat' | 'friend_masked' | 'friend_glasses' | 'stranger';
  name: string;
  emoji: string;
  matchProb: number;
}

export interface GameLogEntry {
  id: string;
  emoji: string;
  name: string;
  prob: number;
  decision: 'opened' | 'locked';
  statusType: 'valid' | 'danger' | 'inconvenient' | 'safe';
  text: string;
  badgeText: string;
  badgeColor: string;
}
