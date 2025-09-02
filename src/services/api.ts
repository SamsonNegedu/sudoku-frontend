import type { Puzzle, Difficulty, ValidationResult, Hint } from '../types';

// Abstract interface for storage operations
export interface IStorageService {
  getPuzzle(difficulty: Difficulty): Promise<Puzzle>;
  getPuzzleById(id: string): Promise<Puzzle>;
  validateMove(
    puzzleId: string,
    row: number,
    col: number,
    value: number,
    currentBoard: number[][]
  ): Promise<ValidationResult>;
  getHint(
    puzzleId: string,
    currentBoard: number[][],
    hintType: string
  ): Promise<Hint>;
}

// Local storage implementation (for offline functionality)
export class LocalStorageService implements IStorageService {
  async getPuzzle(difficulty: Difficulty): Promise<Puzzle> {
    // TODO: Implement local puzzle generation
    // For now, return a sample puzzle
    return this.generateSamplePuzzle(difficulty);
  }

  async getPuzzleById(id: string): Promise<Puzzle> {
    // TODO: Implement local puzzle retrieval by ID
    // For now, generate a new puzzle with the same difficulty
    console.log(`Retrieving puzzle with ID: ${id}`);
    return this.getPuzzle('beginner'); // Default fallback
  }

  async validateMove(
    puzzleId: string,
    row: number,
    col: number,
    value: number,
    currentBoard: number[][]
  ): Promise<ValidationResult> {
    // TODO: Implement local move validation
    console.log(
      `Validating move: ${value} at (${row}, ${col}) for puzzle ${puzzleId}`
    );

    // Basic validation - check if the move conflicts with existing values
    const conflicts: [number, number][] = [];

    // Check row conflicts
    for (let c = 0; c < 9; c++) {
      if (c !== col && currentBoard[row][c] === value) {
        conflicts.push([row, c]);
      }
    }

    // Check column conflicts
    for (let r = 0; r < 9; r++) {
      if (r !== row && currentBoard[r][col] === value) {
        conflicts.push([r, col]);
      }
    }

    // Check 3x3 box conflicts
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && currentBoard[r][c] === value) {
          conflicts.push([r, c]);
        }
      }
    }

    return {
      valid: conflicts.length === 0,
      conflicts,
      isCorrect: conflicts.length === 0,
      message:
        conflicts.length === 0
          ? 'Move is valid'
          : 'Move conflicts with existing values',
    };
  }

  async getHint(
    puzzleId: string,
    currentBoard: number[][],
    hintType: string
  ): Promise<Hint> {
    // TODO: Implement local hint generation
    console.log(`Getting ${hintType} hint for puzzle ${puzzleId}`);

    // Basic hint generation based on hint type
    switch (hintType) {
      case 'cell':
        return {
          type: 'cell',
          message: 'Look for single candidates in the highlighted row',
          suggestedValue: 7,
        };
      case 'technique':
        return {
          type: 'technique',
          message: 'Look for single candidates in the highlighted row',
          technique: 'single_candidate',
        };
      case 'note':
        return {
          type: 'note',
          message: 'Consider eliminating notes that conflict with other cells',
        };
      default:
        return {
          type: 'technique',
          message: 'Look for single candidates in the highlighted row',
          technique: 'single_candidate',
        };
    }
  }

  private generateSamplePuzzle(difficulty: Difficulty): Puzzle {
    // Sample puzzle - in production, this would come from a local database
    const board = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];

    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    return {
      id: `puzzle_${Date.now()}`,
      board,
      solution,
      difficulty,
      difficultyScore: this.getDifficultyScore(difficulty),
      techniquesRequired: this.getTechniquesForDifficulty(difficulty),
      createdAt: new Date(),
    };
  }

  private getDifficultyScore(difficulty: Difficulty): number {
    const scores = {
      easy: 25,
      medium: 45,
      hard: 65,
      difficult: 85,
      extreme: 100,
    };
    return scores[difficulty];
  }

  private getTechniquesForDifficulty(difficulty: Difficulty): string[] {
    const techniques = {
      easy: ['single_candidate', 'single_position'],
      medium: ['single_candidate', 'single_position', 'candidate_lines'],
      hard: [
        'single_candidate',
        'single_position',
        'candidate_lines',
        'hidden_pairs',
      ],
      difficult: [
        'single_candidate',
        'single_position',
        'candidate_lines',
        'hidden_pairs',
        'x_wing',
      ],
      extreme: [
        'single_candidate',
        'single_position',
        'candidate_lines',
        'hidden_pairs',
        'x_wing',
        'xy_wing',
      ],
    };
    return techniques[difficulty];
  }
}

// Remote API implementation (for future backend integration)
export class RemoteStorageService implements IStorageService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPuzzle(difficulty: Difficulty): Promise<Puzzle> {
    const response = await fetch(`${this.baseUrl}/puzzles/${difficulty}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
    }
    return response.json();
  }

  async getPuzzleById(id: string): Promise<Puzzle> {
    const response = await fetch(`${this.baseUrl}/puzzles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
    }
    return response.json();
  }

  async validateMove(
    puzzleId: string,
    row: number,
    col: number,
    value: number,
    currentBoard: number[][]
  ): Promise<ValidationResult> {
    const response = await fetch(`${this.baseUrl}/game/validate-move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puzzle_id: puzzleId,
        row,
        col,
        value,
        current_board: currentBoard,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to validate move: ${response.statusText}`);
    }
    return response.json();
  }

  async getHint(
    puzzleId: string,
    currentBoard: number[][],
    hintType: string
  ): Promise<Hint> {
    const response = await fetch(`${this.baseUrl}/puzzles/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puzzle_id: puzzleId,
        current_board: currentBoard,
        hint_type: hintType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get hint: ${response.statusText}`);
    }
    return response.json();
  }
}

// Factory for creating storage service based on configuration
export class StorageServiceFactory {
  private static instance: IStorageService;

  static getStorageService(): IStorageService {
    if (!this.instance) {
      const useBackend = import.meta.env.VITE_ENABLE_BACKEND === 'true';
      const apiUrl = import.meta.env.VITE_API_URL;

      if (useBackend && apiUrl) {
        this.instance = new RemoteStorageService(apiUrl);
      } else {
        this.instance = new LocalStorageService();
      }
    }
    return this.instance;
  }

  static switchToBackend(apiUrl: string): void {
    this.instance = new RemoteStorageService(apiUrl);
  }

  static switchToLocal(): void {
    this.instance = new LocalStorageService();
  }
}

// Export the default storage service
export const storageService = StorageServiceFactory.getStorageService();
