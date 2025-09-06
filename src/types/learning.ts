import React from 'react';
import type { Difficulty } from './index';

export interface TechniqueExample {
  board: number[][];
  highlightCells?: [number, number][];
  eliminationCells?: [number, number][];
  candidateNotes?: Record<string, number[]>; // "row,col": [candidates]
  explanation: string;
  solution: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface TechniqueGuide {
  id: string;
  name: string;
  level: TechniqueLevel;
  difficulty: Difficulty[];
  description: string;
  detailedDescription: string;
  whenToUse: string;
  steps: string[];
  tips: string[];
  commonMistakes: string[];
  examples: TechniqueExample[];
  relatedTechniques?: string[];
}

export type TechniqueLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface LevelFilter {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Board display types
export interface BoardPosition {
  row: number;
  col: number;
}

export type CellType = 'normal' | 'highlight' | 'elimination';

export interface CellState {
  value: number;
  candidates?: number[];
  type: CellType;
}
