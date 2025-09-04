// Analytics and Move Recording Types
import type { GameMove, Difficulty } from './index';

export interface TechniqueUsage {
  technique: string;
  timesUsed: number;
  timesSuccessful: number;
  averageTimeToApply: number; // milliseconds
  lastUsed: Date;
  difficultyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  successRate: number; // percentage
  improvementTrend: number; // positive = getting better
}

export interface TechniqueInsight {
  type: 'strength' | 'weakness' | 'improvement' | 'suggestion';
  technique: string;
  message: string;
  actionable: string; // What the player should do
  priority: number; // 1-5, higher = more important
}

export interface OverallStats {
  totalGames: number;
  completedGames: number;
  averageAccuracy: number;
  averageTimePerGame: number;
  favoriteOpeningMoves: Array<{
    cell: { row: number; col: number };
    frequency: number;
  }>;
  strongTechniques: string[];
  weakTechniques: string[];
  improvementTrend: number; // Positive = improving, negative = declining
  techniqueUsage: Record<string, TechniqueUsage>;
}

export interface DetailedGameMove extends GameMove {
  // Enhanced move tracking
  moveNumber: number; // Sequential move number in the game
  timeFromStart: number; // Milliseconds from game start
  timeFromLastMove: number; // Milliseconds from previous move
  isCorrect: boolean | null; // Whether the move was correct
  technique?: string; // Solving technique used (if detectable)
  hesitationTime: number; // Time spent on this cell before making move
  undoChainLength: number; // How many undos followed this move

  // Context
  emptyCellsRemaining: number;
  difficultyAtMove: number; // Estimated difficulty at this point
  mistakesSoFar: number;
  hintsSoFar: number;
}

export interface GameAnalytics {
  // Basic game info
  gameId: string;
  userId: string; // Local UUID for this browser/device
  startTime: Date;
  endTime?: Date;
  duration?: number; // Total time in milliseconds
  difficulty: Difficulty;
  completed: boolean;

  // Enhanced moves tracking
  moves: DetailedGameMove[];

  // Performance metrics
  accuracy: number; // Percentage of correct first attempts
  averageTimePerMove: number;
  totalHesitationTime: number;
  undoFrequency: number; // Undos per move ratio

  // Solving patterns
  openingMoves: DetailedGameMove[]; // First 10 moves
  bottlenecks: Array<{
    cell: { row: number; col: number };
    timeSpent: number;
    attempts: number;
  }>;

  // Technique usage
  techniquesUsed: Array<{
    technique: string;
    moveNumber: number;
    timeToApply: number;
    successful: boolean;
    wasHintBased: boolean;
    context: {
      emptyCellsRemaining: number;
      previousTechnique?: string;
      difficultyAtPoint: number;
    };
  }>;
  hintUsagePattern: Array<{
    moveNumber: number;
    timeWhenUsed: number;
    type: string;
    techniqueRevealed?: string;
    wasAppliedSuccessfully?: boolean;
  }>;

  // Error patterns
  errorCells: Array<{
    cell: { row: number; col: number };
    incorrectValues: number[];
    timeToCorrect: number;
  }>;

  // Completion stats
  finalStats: {
    totalMoves: number;
    correctFirstTries: number;
    totalUndos: number;
    totalHints: number;
    finalAccuracy: number;
  };
}

export interface UserAnalytics {
  userId: string;
  createdAt: Date;
  lastUpdated: Date;

  // Game history
  gamesPlayed: GameAnalytics[];

  // Aggregate stats
  overallStats: {
    totalGames: number;
    completedGames: number;
    averageAccuracy: number;
    averageTimePerGame: number;
    favoriteOpeningMoves: Array<{
      cell: { row: number; col: number };
      frequency: number;
    }>;
    strongTechniques: string[];
    weakTechniques: string[];
    improvementTrend: number; // Positive = improving, negative = declining
  };

  // Difficulty progression
  difficultyProgress: Record<
    Difficulty,
    {
      gamesPlayed: number;
      gamesCompleted: number;
      averageTime: number;
      bestTime: number;
      accuracy: number;
      lastPlayed: Date;
    }
  >;

  // Behavioral patterns
  playingPatterns: {
    preferredInputMode: 'pen' | 'pencil';
    noteUsageFrequency: number; // 0-1 ratio
    hintUsageStrategy: 'conservative' | 'moderate' | 'liberal';
    errorRecoveryStyle: 'quick' | 'methodical' | 'struggle';
    solvingStyle: 'systematic' | 'intuitive' | 'mixed';
  };
}

export interface AnalyticsInsight {
  type: 'strength' | 'weakness' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  data?: any;
  actionable?: boolean;
  priority: 'low' | 'medium' | 'high';
}
