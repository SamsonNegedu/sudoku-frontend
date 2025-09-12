/**
 * Advanced Sudoku Validation System
 * Refactored and improved version of the original validation logic
 */

import type {
  IValidator,
  ValidationResult,
  BoardValidationResult,
  ConflictInfo,
  CandidateInfo,
  NumericBoard,
  BoardDimensions,
  CellPosition,
} from '../types';

export class Validator implements IValidator {
  private boardDimensions: BoardDimensions;

  constructor(boardDimensions: BoardDimensions) {
    this.boardDimensions = boardDimensions;
  }

  init(): void {
    // Initialization logic if needed
  }

  destroy(): void {
    // Cleanup logic if needed
  }

  /**
   * Comprehensive move validation with detailed feedback
   */
  validateMove(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ValidationResult {
    // Input validation
    if (!this.isValidInput(row, col, value)) {
      return {
        isValid: false,
        conflicts: [],
        suggestions: [],
        message: 'Invalid input parameters',
      };
    }

    const conflicts = this.findConflicts(board, row, col, value);
    const isValid = conflicts.length === 0;

    // Generate helpful suggestions if move is invalid
    const suggestions = isValid
      ? undefined
      : this.generateSuggestions(board, row, col, value, conflicts);

    return {
      isValid,
      conflicts,
      suggestions,
      message: this.generateValidationMessage(conflicts, isValid),
    };
  }

  /**
   * Validate entire board state
   */
  validateBoard(board: NumericBoard): BoardValidationResult {
    const errors: ConflictInfo[] = [];
    let filledCells = 0;
    let incorrectCells = 0;
    const incorrectPositions: CellPosition[] = [];

    // Check each filled cell for conflicts
    for (let row = 0; row < this.boardDimensions.size; row++) {
      for (let col = 0; col < this.boardDimensions.size; col++) {
        const value = board[row][col];
        if (value !== 0) {
          filledCells++;

          // Temporarily remove the cell value to check for conflicts
          board[row][col] = 0;
          const conflicts = this.findConflicts(board, row, col, value);
          board[row][col] = value; // Restore value

          if (conflicts.length > 0) {
            incorrectCells++;
            incorrectPositions.push([row, col]);
            errors.push(...conflicts);
          }
        }
      }
    }

    const totalCells = this.boardDimensions.size * this.boardDimensions.size;
    const completionPercentage = (filledCells / totalCells) * 100;
    const accuracy =
      filledCells > 0
        ? ((filledCells - incorrectCells) / filledCells) * 100
        : 100;

    return {
      isValid: errors.length === 0,
      conflicts: errors,
      suggestions:
        errors.length > 0 ? this.generateBoardSuggestions(errors) : undefined,
      message: this.generateBoardValidationMessage(
        errors,
        completionPercentage
      ),
      completionPercentage,
      accuracy,
      incorrectPositions,
    };
  }

  /**
   * Find all conflicts for a specific move
   */
  findConflicts(
    board: NumericBoard,
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
   * Get possible candidates with detailed analysis
   */
  getCandidates(board: NumericBoard, row: number, col: number): CandidateInfo {
    const candidates: number[] = [];
    const eliminatedBy: { [key: number]: string[] } = {};

    for (let num = 1; num <= 9; num++) {
      const conflicts = this.findConflicts(board, row, col, num);

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
              {
                const boxNum =
                  Math.floor(conflictRow / this.boardDimensions.boxSize) *
                    this.boardDimensions.boxSize +
                  Math.floor(conflictCol / this.boardDimensions.boxSize) +
                  1;
                reasons.push(
                  `appears in box ${boxNum} at row ${conflictRow + 1}, column ${conflictCol + 1}`
                );
              }
              break;
          }
        });
        eliminatedBy[num] = reasons;
      }
    }

    return {
      row,
      col,
      candidates,
    };
  }

  /**
   * Check if the puzzle is completed correctly
   */
  isPuzzleComplete(board: NumericBoard): boolean {
    // Check if all cells are filled
    for (let row = 0; row < this.boardDimensions.size; row++) {
      for (let col = 0; col < this.boardDimensions.size; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }

    // Check if board is valid
    const validation = this.validateBoard(board);
    return validation.isValid;
  }

  /**
   * Check if board follows Sudoku constraints
   */
  isValidSudokuBoard(board: NumericBoard): boolean {
    // Check rows
    for (let row = 0; row < this.boardDimensions.size; row++) {
      if (!this.isValidUnit(board[row])) return false;
    }

    // Check columns
    for (let col = 0; col < this.boardDimensions.size; col++) {
      const column = board.map(row => row[col]);
      if (!this.isValidUnit(column)) return false;
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < this.boardDimensions.boxSize; boxRow++) {
      for (let boxCol = 0; boxCol < this.boardDimensions.boxSize; boxCol++) {
        const box: number[] = [];
        for (
          let r = boxRow * this.boardDimensions.boxSize;
          r < (boxRow + 1) * this.boardDimensions.boxSize;
          r++
        ) {
          for (
            let c = boxCol * this.boardDimensions.boxSize;
            c < (boxCol + 1) * this.boardDimensions.boxSize;
            c++
          ) {
            box.push(board[r][c]);
          }
        }
        if (!this.isValidUnit(box)) return false;
      }
    }

    return true;
  }

  /**
   * Get all valid numbers for a specific cell
   */
  getValidNumbers(board: NumericBoard, row: number, col: number): number[] {
    return this.getCandidates(board, row, col).candidates;
  }

  /**
   * Analyze board for solving hints
   */
  analyzeBoard(board: NumericBoard): CandidateInfo[] {
    const analysis: CandidateInfo[] = [];

    for (let row = 0; row < this.boardDimensions.size; row++) {
      for (let col = 0; col < this.boardDimensions.size; col++) {
        if (board[row][col] === 0) {
          const candidateInfo = this.getCandidates(board, row, col);
          if (candidateInfo.candidates.length > 0) {
            analysis.push(candidateInfo);
          }
        }
      }
    }

    return analysis;
  }

  // ============= Private Methods =============

  /**
   * Find conflicts in the same row
   */
  private findRowConflicts(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    for (let c = 0; c < this.boardDimensions.size; c++) {
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
  private findColumnConflicts(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    for (let r = 0; r < this.boardDimensions.size; r++) {
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
  private findBoxConflicts(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];
    const boxRow =
      Math.floor(row / this.boardDimensions.boxSize) *
      this.boardDimensions.boxSize;
    const boxCol =
      Math.floor(col / this.boardDimensions.boxSize) *
      this.boardDimensions.boxSize;

    for (let r = boxRow; r < boxRow + this.boardDimensions.boxSize; r++) {
      for (let c = boxCol; c < boxCol + this.boardDimensions.boxSize; c++) {
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
  private generateSuggestions(
    board: NumericBoard,
    row: number,
    col: number,
    value: number,
    conflicts: ConflictInfo[]
  ): string[] {
    const suggestions: string[] = [];

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
      const boxNumber =
        Math.floor(row / this.boardDimensions.boxSize) *
          this.boardDimensions.boxSize +
        Math.floor(col / this.boardDimensions.boxSize) +
        1;
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
    } else {
      suggestions.push(
        'No valid numbers available for this cell. Check for errors elsewhere.'
      );
    }

    return suggestions;
  }

  /**
   * Generate suggestions for board-level issues
   */
  private generateBoardSuggestions(errors: ConflictInfo[]): string[] {
    const suggestions: string[] = [];

    // Group errors by type
    const rowErrors = errors.filter(e => e.type === 'row').length;
    const colErrors = errors.filter(e => e.type === 'column').length;
    const boxErrors = errors.filter(e => e.type === 'box').length;

    if (rowErrors > 0) {
      suggestions.push(
        `${rowErrors} row conflict${rowErrors > 1 ? 's' : ''} detected`
      );
    }
    if (colErrors > 0) {
      suggestions.push(
        `${colErrors} column conflict${colErrors > 1 ? 's' : ''} detected`
      );
    }
    if (boxErrors > 0) {
      suggestions.push(
        `${boxErrors} box conflict${boxErrors > 1 ? 's' : ''} detected`
      );
    }

    if (errors.length > 5) {
      suggestions.push('Consider using the restart function to start over');
    } else {
      suggestions.push(
        'Review the highlighted cells and correct the conflicts'
      );
    }

    return suggestions;
  }

  /**
   * Generate validation message based on conflicts
   */
  private generateValidationMessage(
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
   * Generate board validation message
   */
  private generateBoardValidationMessage(
    errors: ConflictInfo[],
    completionPercentage: number
  ): string {
    if (errors.length === 0) {
      if (completionPercentage === 100) {
        return 'Puzzle completed successfully!';
      } else {
        return `Board is valid. ${completionPercentage.toFixed(1)}% complete.`;
      }
    }

    return `${errors.length} conflict${errors.length > 1 ? 's' : ''} found. ${completionPercentage.toFixed(1)}% complete.`;
  }

  /**
   * Validate input parameters
   */
  private isValidInput(row: number, col: number, value: number): boolean {
    return (
      row >= 0 &&
      row < this.boardDimensions.size &&
      col >= 0 &&
      col < this.boardDimensions.size &&
      value >= 1 &&
      value <= 9
    );
  }

  /**
   * Check if a unit (row, column, or box) is valid
   */
  private isValidUnit(unit: number[]): boolean {
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
