// Game difficulty levels
export type Difficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master'
  | 'grandmaster';

// Cell state and properties
export interface SudokuCell {
  value: number | null;
  notes: number[];
  isFixed: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isCorrect: boolean | null;
  isIncorrect: boolean; // Track if cell has incorrect value
  row: number;
  col: number;
}

// Board representation (9x9 grid)
export type SudokuBoard = SudokuCell[][];

// Game state
export interface GameState {
  id: string;
  board: SudokuBoard;
  solution: number[][]; // Add solution for validation
  difficulty: Difficulty;
  startTime: Date;
  currentTime: Date;
  isPaused: boolean;
  isCompleted: boolean;
  hintsUsed: number;
  maxHints: number;
  attempts: number;
  maxAttempts: number;
  moves: GameMove[];
  pauseStartTime?: Date;
  totalPausedTime: number;
  pausedElapsedTime?: number;
  mistakes: number; // Track number of mistakes made
  maxMistakes: number; // Maximum allowed mistakes
}

// Game move
export interface GameMove {
  row: number;
  col: number;
  value: number | null;
  isNote: boolean;
  timestamp: Date;
  previousValue: number | null;
  previousNotes: number[];
}

// Puzzle data
export interface Puzzle {
  id: string;
  board: number[][];
  solution: number[][];
  difficulty: Difficulty;
  difficultyScore: number;
  techniquesRequired: string[];
  createdAt: Date;
}

// Game settings
export interface GameSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  maxHints: number;
  maxAttempts: number;
  autoSave: boolean;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

// Hint types
export type HintType = 'cell' | 'technique' | 'note';

export interface Hint {
  type: HintType;
  message: string;
  technique?: string;
  targetCells?: [number, number][];
  suggestedValue?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  conflicts: [number, number][];
  isCorrect: boolean;
  message: string;
}

// Game statistics
export interface GameStats {
  totalGames: number;
  completedGames: number;
  averageTime: number;
  bestTime: number;
  hintsUsed: number;
  attemptsMade: number;
  difficultyBreakdown: Record<Difficulty, number>;
}
