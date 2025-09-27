import { Option } from '../../../core/core.model';
import { Player } from '../player/player.model';

export class GameResult {
  id?: string;
  title?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  playTime?: string;
  turn?: number;
  dice2?: number;
  dice3?: number;
  dice4?: number;
  dice5?: number;
  dice6?: number;
  dice7?: number;
  dice8?: number;
  dice9?: number;
  dice10?: number;
  dice11?: number;
  dice12?: number;
  recentDice1?: number;
  recentDice2?: number;
  recentDice3?: number;
  recentDice4?: number;
  recentDice5?: number;
  recentDice6?: number;
}

export class PersonalResult {
  id?: string;
  game?: string;
  player?: Player;
  win?: boolean;
  order?: number;
  color?: string;
  dice2?: number;
  dice3?: number;
  dice4?: number;
  dice5?: number;
  dice6?: number;
  dice7?: number;
  dice8?: number;
  dice9?: number;
  dice10?: number;
  dice11?: number;
  dice12?: number;
  land?: number;
  city?: number;
  card?: number;
  point?: number;
  longestRoad?: boolean;
  largestArmy?: boolean;
  halfPoint?: number;
  yellowFriend?: boolean;
  greenFriend?: boolean;
  readFriend?: boolean;
  blueFriend?: boolean;
}

export const Titles: Option[] = [
  { key: 'catan', viewValue: 'カタン' },
  { key: 'space', viewValue: '宇宙カタン' },
  { key: 'sea', viewValue: '海カタン' },
  { key: 'knight', viewValue: '騎士カタン' },
];

export enum GameTitles {
  CATAN = 'カタン',
  SPACE = '宇宙カタン',
  SEA = '海カタン',
  KNIGHT = '騎士カタン',
}

export const Colors: Option[] = [
  { key: 'red', viewValue: '赤' },
  { key: 'white', viewValue: '白' },
  { key: 'blue', viewValue: '青' },
  { key: 'yellow', viewValue: '黄' },
  { key: 'green', viewValue: '緑' },
  { key: 'brown', viewValue: '茶' },
];

export enum CatanColors {
  RED = '#c70000',
  WHITE = '#aaaaaa',
  BLUE = '#000080',
  YELLOW = '#ffad32',
  GREEN = '#006666',
  BROWN = '#330022',
}
