import type { SudokuBoard, ValidationResult } from '../types';

/**
 * Advanced Sudoku Puzzle Validation System
 * Provides comprehensive move validation and conflict detection
 */

export interface ConflictInfo {
  type: 'row' | 'column' | 'box';
  position: [number, number];
  value: number;
}

export interface ValidationDetails {
  isValid: boolean;
  conflicts: ConflictInfo[];
  isCorrect: boolean;
  suggestions?: string[];
  message: string;
}

/**
 * Main validation class for Sudoku puzzles
 */
export class SudokuValidator {
  private static readonly BOARD_SIZE = 9;
  private static readonly BOX_SIZE = 3;

  /**
   * Comprehensive move validation with detailed feedback
   */
  static validateMove(
    board: SudokuBoard | number[][],
    row: number,
    col: number,
    value: number
  ): ValidationDetails {
    // Input validation
    if (!this.isValidInput(row, col, value)) {
      return {
        isValid: false,
        conflicts: [],
        isCorrect: false,
        message: 'Invalid input parameters',
      };
    }

    const numericBoard = this.convertToNumericBoard(board);
    const conflicts = this.findAllConflicts(numericBoard, row, col, value);
    const isValid = conflicts.length === 0;

    // Generate helpful suggestions if move is invalid
    const suggestions = isValid
      ? undefined
      : this.generateSuggestions(numericBoard, row, col, value);

    return {
      isValid,
      conflicts,
      isCorrect: isValid, // For now, assume valid moves are correct
      suggestions,
      message: this.generateValidationMessage(conflicts, isValid),
    };
  }

  /**
   * Validate entire board state
   */
  static validateBoard(board: SudokuBoard | number[][]): {
    isValid: boolean;
    errors: ConflictInfo[];
    completionPercentage: number;
  } {
    const numericBoard = this.convertToNumericBoard(board);
    const errors: ConflictInfo[] = [];
    let filledCells = 0;

    // Check each filled cell for conflicts
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const value = numericBoard[row][col];
        if (value !== 0) {
          filledCells++;

          // Temporarily remove the cell value to check for conflicts
          numericBoard[row][col] = 0;
          const conflicts = this.findAllConflicts(
            numericBoard,
            row,
            col,
            value
          );
          numericBoard[row][col] = value; // Restore value

          errors.push(...conflicts);
        }
      }
    }

    const completionPercentage =
      (filledCells / (this.BOARD_SIZE * this.BOARD_SIZE)) * 100;

    return {
      isValid: errors.length === 0,
      errors,
      completionPercentage,
    };
  }

  /**
   * Check if the puzzle is completed correctly
   */
  static isPuzzleComplete(board: SudokuBoard | number[][]): boolean {
    // Check if we're dealing with SudokuBoard format (with cell objects)
    const isSudokuBoard =
      Array.isArray(board) &&
      board.length > 0 &&
      board[0].length > 0 &&
      typeof board[0][0] === 'object';

    if (isSudokuBoard) {
      const sudokuBoard = board as SudokuBoard;
      // For SudokuBoard format, check if all cells are filled with correct values
      let emptyCells = 0;
      let incorrectCells = 0;

      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          const cell = sudokuBoard[row][col];
          if (!cell.value) {
            emptyCells++;
          } else if (cell.isIncorrect) {
            incorrectCells++;
          }
        }
      }

      // Puzzle is complete only if no empty cells AND no incorrect cells
      if (emptyCells > 0 || incorrectCells > 0) {
        return false;
      }

      // All cells filled and correct, now validate the complete board
      const numericBoard = this.convertToNumericBoard(board);
      const validation = this.validateBoard(numericBoard);
      return validation.isValid;
    } else {
      // Original logic for numeric board format
      const numericBoard = this.convertToNumericBoard(board);

      // Check if all cells are filled
      let emptyCells = 0;
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          if (numericBoard[row][col] === 0) {
            emptyCells++;
          }
        }
      }

      if (emptyCells > 0) {
        return false;
      }

      // Check if board is valid
      const validation = this.validateBoard(board);
      return validation.isValid;
    }
  }

  /**
   * Find all conflicts for a specific move
   */
  private static findAllConflicts(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    // Find row conflicts
    conflicts.push(...this.findRowConflicts(board, row, col, value));

    // Find column conflicts
    conflicts.push(...this.findColumnConflicts(board, row, col, value));

    // Find box conflicts
    conflicts.push(...this.findBoxConflicts(board, row, col, value));

    return conflicts;
  }

  /**
   * Find conflicts in the same row
   */
  private static findRowConflicts(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    for (let c = 0; c < this.BOARD_SIZE; c++) {
      if (c !== col && board[row][c] === value) {
        conflicts.push({
          type: 'row',
          position: [row, c],
          value,
        });
      }
    }

    return conflicts;
  }

  /**
   * Find conflicts in the same column
   */
  private static findColumnConflicts(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    for (let r = 0; r < this.BOARD_SIZE; r++) {
      if (r !== row && board[r][col] === value) {
        conflicts.push({
          type: 'column',
          position: [r, col],
          value,
        });
      }
    }

    return conflicts;
  }

  /**
   * Find conflicts in the same 3x3 box
   */
  private static findBoxConflicts(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let r = boxRow; r < boxRow + this.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + this.BOX_SIZE; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          conflicts.push({
            type: 'box',
            position: [r, c],
            value,
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Generate helpful suggestions for invalid moves
   */
  private static generateSuggestions(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): string[] {
    const suggestions: string[] = [];
    const conflicts = this.findAllConflicts(board, row, col, value);

    // Analyze conflict types and provide specific guidance
    const rowConflicts = conflicts.filter(c => c.type === 'row');
    const colConflicts = conflicts.filter(c => c.type === 'column');
    const boxConflicts = conflicts.filter(c => c.type === 'box');

    if (rowConflicts.length > 0) {
      suggestions.push(`The number ${value} already appears in row ${row + 1}`);
    }

    if (colConflicts.length > 0) {
      suggestions.push(
        `The number ${value} already appears in column ${col + 1}`
      );
    }

    if (boxConflicts.length > 0) {
      const boxNumber = Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1;
      suggestions.push(
        `The number ${value} already appears in box ${boxNumber}`
      );
    }

    // Suggest valid alternatives
    const validNumbers = this.getValidNumbers(board, row, col);
    if (validNumbers.length > 0) {
      suggestions.push(
        `Try one of these numbers instead: ${validNumbers.join(', ')}`
      );
    }

    return suggestions;
  }

  /**
   * Get all valid numbers for a specific cell
   */
  static getValidNumbers(
    board: number[][],
    row: number,
    col: number
  ): number[] {
    const validNumbers: number[] = [];

    for (let num = 1; num <= 9; num++) {
      const conflicts = this.findAllConflicts(board, row, col, num);
      if (conflicts.length === 0) {
        validNumbers.push(num);
      }
    }

    return validNumbers;
  }

  /**
   * Get possible candidates with detailed analysis
   */
  static getCandidates(
    board: number[][],
    row: number,
    col: number
  ): {
    candidates: number[];
    eliminatedBy: { [key: number]: string[] };
  } {
    const candidates: number[] = [];
    const eliminatedBy: { [key: number]: string[] } = {};

    for (let num = 1; num <= 9; num++) {
      const conflicts = this.findAllConflicts(board, row, col, num);

      if (conflicts.length === 0) {
        candidates.push(num);
      } else {
        const reasons: string[] = [];
        conflicts.forEach(conflict => {
          const [conflictRow, conflictCol] = conflict.position;
          switch (conflict.type) {
            case 'row':
              reasons.push(
                `appears in row ${conflictRow + 1}, column ${conflictCol + 1}`
              );
              break;
            case 'column':
              reasons.push(
                `appears in row ${conflictRow + 1}, column ${conflictCol + 1}`
              );
              break;
            case 'box':
              const boxNum =
                Math.floor(conflictRow / 3) * 3 +
                Math.floor(conflictCol / 3) +
                1;
              reasons.push(
                `appears in box ${boxNum} at row ${conflictRow + 1}, column ${conflictCol + 1}`
              );
              break;
          }
        });
        eliminatedBy[num] = reasons;
      }
    }

    return { candidates, eliminatedBy };
  }

  /**
   * Generate validation message based on conflicts
   */
  private static generateValidationMessage(
    conflicts: ConflictInfo[],
    isValid: boolean
  ): string {
    if (isValid) {
      return 'Valid move!';
    }

    if (conflicts.length === 1) {
      const conflict = conflicts[0];
      const [row, col] = conflict.position;
      return `Conflicts with ${conflict.type} at position (${row + 1}, ${col + 1})`;
    }

    return `Multiple conflicts found in ${Array.from(new Set(conflicts.map(c => c.type))).join(', ')}`;
  }

  /**
   * Validate input parameters
   */
  private static isValidInput(
    row: number,
    col: number,
    value: number
  ): boolean {
    return (
      row >= 0 &&
      row < this.BOARD_SIZE &&
      col >= 0 &&
      col < this.BOARD_SIZE &&
      value >= 1 &&
      value <= 9
    );
  }

  /**
   * Convert SudokuBoard to numeric array for easier processing
   */
  private static convertToNumericBoard(
    board: SudokuBoard | number[][]
  ): number[][] {
    if (Array.isArray(board) && typeof board[0][0] === 'number') {
      return board as number[][];
    }

    // Convert from SudokuBoard format
    const sudokuBoard = board as SudokuBoard;
    return sudokuBoard.map(row => row.map(cell => cell.value || 0));
  }

  /**
   * Check if board follows Sudoku constraints
   */
  static isValidSudokuBoard(board: number[][]): boolean {
    // Check rows
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      if (!this.isValidUnit(board[row])) return false;
    }

    // Check columns
    for (let col = 0; col < this.BOARD_SIZE; col++) {
      const column = board.map(row => row[col]);
      if (!this.isValidUnit(column)) return false;
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const box: number[] = [];
        for (let r = boxRow * 3; r < (boxRow + 1) * 3; r++) {
          for (let c = boxCol * 3; c < (boxCol + 1) * 3; c++) {
            box.push(board[r][c]);
          }
        }
        if (!this.isValidUnit(box)) return false;
      }
    }

    return true;
  }

  /**
   * Check if a unit (row, column, or box) is valid
   */
  private static isValidUnit(unit: number[]): boolean {
    const seen = new Set<number>();

    for (const num of unit) {
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }

    return true;
  }
}
