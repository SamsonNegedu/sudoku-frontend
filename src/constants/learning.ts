import {
  PlayIcon,
  ReaderIcon,
  LightningBoltIcon,
  TargetIcon,
} from '@radix-ui/react-icons';
import { LevelFilter } from '../types/learning';

export const DIFFICULTY_LEVELS: readonly LevelFilter[] = [
  { id: 'all', name: 'All Levels', icon: ReaderIcon },
  { id: 'basic', name: 'Basic', icon: PlayIcon },
  { id: 'intermediate', name: 'Intermediate', icon: LightningBoltIcon },
  { id: 'advanced', name: 'Advanced', icon: TargetIcon },
  { id: 'expert', name: 'Expert', icon: TargetIcon },
] as const;

export const SUDOKU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const GRID_SIZE = 9 as const;
export const BOX_SIZE = 3 as const;
