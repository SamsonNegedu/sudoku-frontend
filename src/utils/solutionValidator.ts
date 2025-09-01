import type { SudokuBoard } from '../types';

/**
 * Solution Validation System
 * Validates user inputs against the correct solution
 */

export interface CellValidationResult {
  isCorrect: boolean;
  correctValue: number;
  userValue: number | null;
}

export interface BoardValidationResult {
  totalCells: number;
  filledCells: number;
  correctCells: number;
  incorrectCells: number;
  incorrectPositions: [number, number][];
  completionPercentage: number;
  accuracyPercentage: number;
}

/**
 * Main solution validator class
 */
export class SolutionValidator {
  /**
   * Validate a single cell against the solution
   */
  static validateCell(
    board: SudokuBoard,
    solution: number[][],
    row: number,
    col: number
  ): CellValidationResult {
    const userValue = board[row][col].value;
    const correctValue = solution[row][col];

    return {
      isCorrect: userValue === correctValue,
      correctValue,
      userValue,
    };
  }

  /**
   * Validate entire board against solution
   */
  static validateBoard(
    board: SudokuBoard,
    solution: number[][]
  ): BoardValidationResult {
    let filledCells = 0;
    let correctCells = 0;
    let incorrectCells = 0;
    const incorrectPositions: [number, number][] = [];
    const totalCells = 81;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (cell.value !== null) {
          filledCells++;

          if (cell.value === solution[row][col]) {
            correctCells++;
          } else {
            incorrectCells++;
            incorrectPositions.push([row, col]);
          }
        }
      }
    }

    const completionPercentage = (filledCells / totalCells) * 100;
    const accuracyPercentage =
      filledCells > 0 ? (correctCells / filledCells) * 100 : 100;

    return {
      totalCells,
      filledCells,
      correctCells,
      incorrectCells,
      incorrectPositions,
      completionPercentage,
      accuracyPercentage,
    };
  }

  /**
   * Check if a specific input would be correct
   */
  static isInputCorrect(
    solution: number[][],
    row: number,
    col: number,
    value: number
  ): boolean {
    // Defensive programming - check if solution exists and has proper structure
    if (
      !solution ||
      !Array.isArray(solution) ||
      !solution[row] ||
      !Array.isArray(solution[row]) ||
      solution[row][col] === undefined
    ) {
      return false;
    }

    return solution[row][col] === value;
  }

  /**
   * Get the correct value for a cell
   */
  static getCorrectValue(
    solution: number[][],
    row: number,
    col: number
  ): number {
    return solution[row][col];
  }

  /**
   * Find all incorrect cells in the board
   */
  static findIncorrectCells(
    board: SudokuBoard,
    solution: number[][]
  ): [number, number][] {
    const incorrectCells: [number, number][] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (cell.value !== null && cell.value !== solution[row][col]) {
          incorrectCells.push([row, col]);
        }
      }
    }

    return incorrectCells;
  }

  /**
   * Update board cells with correct/incorrect status
   */
  static updateBoardValidationStatus(
    board: SudokuBoard,
    solution: number[][]
  ): SudokuBoard {
    const updatedBoard = board.map(row => [...row]);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = updatedBoard[row][col];

        if (cell.value !== null && !cell.isFixed) {
          const isCorrect = cell.value === solution[row][col];
          cell.isCorrect = isCorrect;
          cell.isIncorrect = !isCorrect;
        } else {
          cell.isCorrect = null;
          cell.isIncorrect = false;
        }
      }
    }

    return updatedBoard;
  }

  /**
   * Check if the puzzle is completely and correctly solved
   */
  static isPuzzleSolved(board: SudokuBoard, solution: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        // Check if cell is empty or incorrect
        if (cell.value === null || cell.value !== solution[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get puzzle completion statistics
   */
  static getPuzzleStats(
    board: SudokuBoard,
    solution: number[][]
  ): {
    progress: number;
    accuracy: number;
    mistakes: number;
    remaining: number;
  } {
    const validation = this.validateBoard(board, solution);

    return {
      progress: validation.completionPercentage,
      accuracy: validation.accuracyPercentage,
      mistakes: validation.incorrectCells,
      remaining: validation.totalCells - validation.filledCells,
    };
  }
}
