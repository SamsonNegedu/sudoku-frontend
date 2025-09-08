import type {
  IGameEngine,
  GameEngineConfig,
  GeneratedPuzzle,
  ValidationResult,
  BoardValidationResult,
  HintRequest,
  HintResult,
  NumericBoard,
  Difficulty,
  SudokuBoard,
} from '../types';

import { PuzzleGenerator, SudokuGenPuzzleGenerator } from '../puzzle';
import { Validator } from '../validation';
import { HintGenerator } from '../hints';

export const DEFAULT_ENGINE_CONFIG: GameEngineConfig = {
  boardDimensions: {
    size: 9,
    boxSize: 3,
  },
  validation: {
    enableRealTimeValidation: true,
    showConflicts: true,
    allowInvalidMoves: false,
  },
  hints: {
    maxHintsPerGame: 10,
    enableAutoFill: true,
    showTechniques: true,
  },
  puzzle: {
    cacheSize: 10,
    preGeneratePuzzles: false, // Don't auto-generate puzzles on startup
    generateInBackground: false, // Don't generate puzzles in background
  },
  performance: {
    enableProfiling: false,
    logPerformanceMetrics: false,
  },
};

export class GameEngine implements IGameEngine {
  private config: GameEngineConfig;

  private puzzleGenerator: PuzzleGenerator;
  private sudokuGenGenerator: SudokuGenPuzzleGenerator;
  private validator: Validator;
  private hintGenerator: HintGenerator;

  private isInitialized = false;
  private puzzleCache = new Map<string, GeneratedPuzzle[]>();

  constructor(config?: Partial<GameEngineConfig>) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };

    this.puzzleGenerator = new PuzzleGenerator();
    this.sudokuGenGenerator = new SudokuGenPuzzleGenerator();
    this.validator = new Validator(this.config.boardDimensions);
    this.hintGenerator = new HintGenerator(this.validator);
  }

  async init(config?: Partial<GameEngineConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (config) {
      this.config = { ...this.config, ...config };
    }

    await this.puzzleGenerator.init();
    await this.sudokuGenGenerator.init();
    await this.validator.init();
    await this.hintGenerator.init();

    if (this.config.puzzle.preGeneratePuzzles) {
      await this.preGeneratePuzzles();
    }

    this.isInitialized = true;
  }

  async destroy(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    this.puzzleCache.clear();

    await this.puzzleGenerator.destroy?.();
    await this.sudokuGenGenerator.destroy?.();
    await this.validator.destroy?.();
    await this.hintGenerator.destroy?.();

    this.isInitialized = false;
  }

  async generatePuzzle(difficulty: Difficulty): Promise<GeneratedPuzzle> {
    this.ensureInitialized();

    const cached = this.getCachedPuzzle(difficulty);
    if (cached) {
      return cached;
    }

    let puzzle: GeneratedPuzzle;

    try {
      puzzle = await this.sudokuGenGenerator.generateWithFallback(difficulty);
    } catch (sudokuGenError) {
      try {
        puzzle = await this.puzzleGenerator.generateWithFallback(difficulty);
      } catch (backtrackError) {
        console.error(`Both generation methods failed:`, {
          sudokuGenError,
          backtrackError,
        });
        throw new Error(
          `Failed to generate ${difficulty} puzzle: ${backtrackError instanceof Error ? backtrackError.message : 'Unknown error'}`
        );
      }
    }

    this.cachePuzzle(difficulty, puzzle);

    return puzzle;
  }

  validateMove(
    board: SudokuBoard,
    row: number,
    col: number,
    value: number
  ): ValidationResult {
    this.ensureInitialized();

    const numericBoard = this.convertBoard(board);
    const result = this.validator.validateMove(numericBoard, row, col, value);

    return result;
  }

  validateBoard(board: SudokuBoard): BoardValidationResult {
    this.ensureInitialized();

    const numericBoard = this.convertBoard(board);
    const result = this.validator.validateBoard(numericBoard);

    return result;
  }

  async generateHint(request: HintRequest): Promise<HintResult | null> {
    this.ensureInitialized();
    return await this.hintGenerator.generateHint(request);
  }

  convertBoard(board: SudokuBoard): NumericBoard {
    return board.map(row => row.map(cell => cell.value || 0));
  }

  getCandidates(board: NumericBoard, row: number, col: number): number[] {
    this.ensureInitialized();
    return this.validator.getCandidates(board, row, col).candidates;
  }

  getConfig(): GameEngineConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<GameEngineConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Game engine not initialized. Call init() first.');
    }
  }

  private async preGeneratePuzzles(): Promise<void> {
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

    const promises = difficulties.map(async difficulty => {
      try {
        const puzzles = await this.puzzleGenerator.generateMultiple(
          {
            difficulty,
            minClues: this.getClueRange(difficulty).min,
            maxClues: this.getClueRange(difficulty).max,
            uniqueSolution: true,
            allowedTechniques: this.getAllowedTechniques(difficulty),
            maxAttempts: 3,
          },
          3
        );

        this.puzzleCache.set(difficulty, puzzles);
      } catch (error) {
        console.warn(`Failed to pre-generate ${difficulty} puzzles:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  private getCachedPuzzle(difficulty: Difficulty): GeneratedPuzzle | null {
    const cached = this.puzzleCache.get(difficulty);
    if (cached && cached.length > 0) {
      return cached.shift()!; // Remove and return first puzzle
    }
    return null;
  }

  private cachePuzzle(difficulty: Difficulty, puzzle: GeneratedPuzzle): void {
    if (!this.puzzleCache.has(difficulty)) {
      this.puzzleCache.set(difficulty, []);
    }

    const cache = this.puzzleCache.get(difficulty)!;
    if (cache.length < this.config.puzzle.cacheSize) {
      cache.push(puzzle);
    }
  }

  private getClueRange(difficulty: Difficulty): { min: number; max: number } {
    const ranges = {
      beginner: { min: 36, max: 46 },
      intermediate: { min: 32, max: 40 },
      advanced: { min: 28, max: 35 },
      expert: { min: 24, max: 30 },
      master: { min: 20, max: 26 },
      grandmaster: { min: 17, max: 22 },
    };
    return ranges[difficulty];
  }

  private getAllowedTechniques(difficulty: Difficulty): string[] {
    const techniques = {
      beginner: ['naked_single', 'hidden_single'],
      intermediate: ['naked_single', 'hidden_single', 'naked_pair'],
      advanced: [
        'naked_single',
        'hidden_single',
        'naked_pair',
        'pointing_pair',
      ],
      expert: [
        'naked_single',
        'hidden_single',
        'naked_pair',
        'pointing_pair',
        'box_line_reduction',
      ],
      master: [
        'naked_single',
        'hidden_single',
        'naked_pair',
        'pointing_pair',
        'box_line_reduction',
        'x_wing',
      ],
      grandmaster: [
        'naked_single',
        'hidden_single',
        'naked_pair',
        'pointing_pair',
        'box_line_reduction',
        'x_wing',
        'xy_wing',
        'swordfish',
      ],
    };
    return techniques[difficulty];
  }
}
