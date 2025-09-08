import { getGameEngine } from '../utils/gameEngine';
import type {
  GameEngine,
  GeneratedPuzzle,
  HintResult,
  ValidationResult,
  SudokuBoard,
  Difficulty,
} from '../engine';

export class GameEngineService {
  private engine: GameEngine | null = null;

  async initialize(): Promise<void> {
    this.engine = await getGameEngine();
  }

  private async ensureInitialized(): Promise<GameEngine> {
    if (!this.engine) {
      await this.initialize();
    }
    return this.engine!;
  }

  async generatePuzzle(difficulty: Difficulty): Promise<GeneratedPuzzle> {
    const engine = await this.ensureInitialized();

    return engine.generatePuzzle(difficulty);
  }

  async validateMove(
    board: SudokuBoard,
    row: number,
    col: number,
    value: number
  ): Promise<ValidationResult> {
    const engine = await this.ensureInitialized();
    return engine.validateMove(board, row, col, value);
  }

  async generateHint(
    board: SudokuBoard,
    difficulty: Difficulty,
    selectedCell?: [number, number],
    solution?: number[][]
  ): Promise<HintResult | null> {
    const engine = await this.ensureInitialized();
    return engine.generateHint({
      board,
      difficulty,
      selectedCell,
      solution,
    });
  }

  async getCandidates(
    board: SudokuBoard,
    row: number,
    col: number
  ): Promise<number[]> {
    const engine = await this.ensureInitialized();
    const numericBoard = engine.convertBoard(board);
    return engine.getCandidates(numericBoard, row, col);
  }

  async isPuzzleComplete(board: SudokuBoard): Promise<boolean> {
    const engine = await this.ensureInitialized();
    const validation = engine.validateBoard(board);
    return validation.isValid && validation.completionPercentage === 100;
  }

  async resetHintTracking(): Promise<void> {
    const engine = await this.ensureInitialized();
    const engineWithHints = engine as unknown as {
      hintGenerator?: { resetEliminationTracking?: () => void };
    };
    engineWithHints.hintGenerator?.resetEliminationTracking?.();
  }

  async getHintTrackingStats(): Promise<{
    suggestedCount: number;
    suggestions: string[];
  } | null> {
    const engine = await this.ensureInitialized();
    const engineWithHints = engine as unknown as {
      hintGenerator?: {
        getTrackingStats?: () => {
          suggestedCount: number;
          suggestions: string[];
        };
      };
    };
    return engineWithHints.hintGenerator?.getTrackingStats?.() || null;
  }

  convertBoardToNumeric(board: SudokuBoard): number[][] {
    return board.map(row => row.map(cell => cell.value || 0));
  }
}

export const gameEngineService = new GameEngineService();
