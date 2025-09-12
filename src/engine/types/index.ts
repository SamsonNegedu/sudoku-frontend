/**
 * Core Game Engine Types
 * Defines the fundamental types and interfaces for the Sudoku game engine
 */

import type { Difficulty, SudokuBoard, Hint } from '../../types';

// ============= Core Board Types =============

export type NumericBoard = number[][];
export type CellPosition = [number, number];

export interface BoardDimensions {
  readonly size: 9;
  readonly boxSize: 3;
}

// ============= Validation Types =============

export interface ConflictInfo {
  type: 'row' | 'column' | 'box';
  position: CellPosition;
  value: number;
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: ConflictInfo[];
  suggestions?: string[];
  message: string;
}

export interface BoardValidationResult extends ValidationResult {
  completionPercentage: number;
  accuracy: number;
  incorrectPositions: CellPosition[];
}

// ============= Puzzle Generation Types =============

export interface PuzzleGenerationConfig {
  difficulty: Difficulty;
  minClues: number;
  maxClues: number;
  uniqueSolution: boolean;
  allowedTechniques: string[];
  maxAttempts: number;
}

export interface GeneratedPuzzle {
  puzzle: NumericBoard;
  solution: NumericBoard;
  difficulty: Difficulty;
  metadata: PuzzleMetadata;
}

export interface PuzzleMetadata {
  difficultyScore: number;
  techniquesRequired: string[];
  clueCount: number;
  generationTime: number;
  complexity: number;
}

// ============= Hint System Types =============

export interface CandidateInfo {
  row: number;
  col: number;
  candidates: number[];
}

export interface HintRequest {
  board: SudokuBoard;
  difficulty: Difficulty;
  selectedCell?: CellPosition;
  solution?: NumericBoard;
  maxComplexity?: number;
}

export interface HintResult {
  hint: Hint;
  confidence: number; // 0-1
  priority: number; // 1-5
  technique: string;
  complexity: number;
}

export type HintTechnique =
  | 'naked_single'
  | 'hidden_single'
  | 'naked_pair'
  | 'pointing_pair'
  | 'box_line_reduction'
  | 'x_wing'
  | 'xy_wing'
  | 'swordfish'
  | 'error_detection'
  | 'note_elimination'
  | 'candidate_suggestion';

// ============= Solver Types =============
export interface SolverStep {
  type: 'placement' | 'elimination';
  technique: string;
  description?: string;
  reason?: string;
  row?: number;
  col?: number;
  cellsAffected?: CellPosition[];
  value?: number;
  values?: number[];
  eliminatedCandidates?: { position: CellPosition; values: number[] }[];
}

// ============= Game Engine Config =============
export interface GameEngineConfig {
  boardDimensions: BoardDimensions;
  validation: {
    enableRealTimeValidation: boolean;
    showConflicts: boolean;
    allowInvalidMoves: boolean;
  };
  hints: {
    maxHintsPerGame: number;
    enableAutoFill: boolean;
    showTechniques: boolean;
  };
  puzzle: {
    cacheSize: number;
    preGeneratePuzzles: boolean;
    generateInBackground: boolean;
  };
  performance: {
    enableProfiling: boolean;
    logPerformanceMetrics: boolean;
  };
}

// ============= Engine Events =============

export interface GameEngineEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface PuzzleGenerationEvent extends GameEngineEvent {
  type:
    | 'puzzle_generation_start'
    | 'puzzle_generation_complete'
    | 'puzzle_generation_error';
  data: {
    difficulty?: Difficulty;
    duration?: number;
    error?: string;
    puzzle?: GeneratedPuzzle;
  };
}

export interface ValidationEvent extends GameEngineEvent {
  type: 'validation_performed' | 'conflict_detected' | 'puzzle_solved';
  data: {
    position?: CellPosition;
    value?: number;
    conflicts?: ConflictInfo[];
    isValid?: boolean;
  };
}

export interface HintEvent extends GameEngineEvent {
  type: 'hint_requested' | 'hint_generated' | 'hint_applied';
  data: {
    hintType?: string;
    technique?: string;
    autoFilled?: boolean;
    position?: CellPosition;
  };
}

// ============= Engine Interface =============

export interface IGameEngine {
  // Core operations
  init(config?: Partial<GameEngineConfig>): Promise<void>;
  destroy(): Promise<void>;

  // Puzzle operations
  generatePuzzle(difficulty: Difficulty): Promise<GeneratedPuzzle>;
  validateMove(
    board: SudokuBoard,
    row: number,
    col: number,
    value: number
  ): ValidationResult;
  validateBoard(board: SudokuBoard): BoardValidationResult;

  // Hint operations
  generateHint(request: HintRequest): HintResult | null;

  // Utility operations
  convertBoard(board: SudokuBoard): NumericBoard;
  getCandidates(board: NumericBoard, row: number, col: number): number[];
}

// ============= Module Interfaces =============

export interface IPuzzleGenerator {
  generate(config: PuzzleGenerationConfig): Promise<GeneratedPuzzle>;
  generateMultiple(
    config: PuzzleGenerationConfig,
    count: number
  ): Promise<GeneratedPuzzle[]>;
  validateUniqueness(puzzle: NumericBoard): boolean;
}

export interface IValidator {
  validateMove(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ValidationResult;
  validateBoard(board: NumericBoard): BoardValidationResult;
  findConflicts(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ConflictInfo[];
  getCandidates(board: NumericBoard, row: number, col: number): CandidateInfo;
}

export interface IHintGenerator {
  generateHint(request: HintRequest): HintResult | null;
  generateAllHints(request: HintRequest): HintResult[];
  analyzeBoard(board: SudokuBoard): CandidateInfo[];
}

// ============= Utility Types =============

export interface CellCandidate {
  row: number;
  col: number;
  candidates: number[];
}

export type EventCallback = (event: GameEngineEvent) => void;
export type EventEmitter = {
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback: EventCallback) => void;
  emit: (event: GameEngineEvent) => void;
};

// Export commonly used types for convenience
export type { Difficulty, SudokuBoard, Hint } from '../../types';
