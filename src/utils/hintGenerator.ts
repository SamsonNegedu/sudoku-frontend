import type { Hint, SudokuBoard, Difficulty } from '../types';
import { SudokuValidator } from './puzzleValidator';

/**
 * Advanced Sudoku Hint Generation System
 * Provides intelligent hints based on various solving techniques
 */

export interface CellCandidate {
  row: number;
  col: number;
  candidates: number[];
}

export interface HintResult {
  hint: Hint;
  confidence: number; // 0-1, how confident we are this is a good hint
  priority: number; // 1-5, how important this hint is
}

export class SudokuHintGenerator {
  /**
   * Generate the best available hint for the current board state
   */
  static generateHint(
    board: SudokuBoard,
    difficulty: Difficulty = 'intermediate',
    solution?: number[][]
  ): Hint | null {
    const hints = this.getAllAvailableHints(board, difficulty, solution);

    if (hints.length === 0) {
      return {
        type: 'technique',
        message:
          'No obvious hints available. Try examining different areas of the puzzle.',
        technique: 'general_advice',
      };
    }

    // Sort hints by priority and confidence
    hints.sort((a, b) => {
      const scoreDiff = b.priority * b.confidence - a.priority * a.confidence;
      return scoreDiff !== 0 ? scoreDiff : b.priority - a.priority;
    });

    return hints[0].hint;
  }

  /**
   * Get all available hints sorted by effectiveness
   */
  private static getAllAvailableHints(
    board: SudokuBoard,
    difficulty: string,
    solution?: number[][]
  ): HintResult[] {
    const hints: HintResult[] = [];

    // 1. Look for naked singles (cells with only one candidate)
    hints.push(...this.findNakedSingles(board));

    // 2. Look for hidden singles (numbers that can only go in one place)
    hints.push(...this.findHiddenSingles(board));

    // 3. Look for cells with incorrect values (if solution available)
    if (solution) {
      hints.push(...this.findIncorrectValues(board, solution));
    }

    // 4. Look for note elimination opportunities
    hints.push(...this.findNoteEliminationHints(board));

    // 5. For harder difficulties, add advanced techniques
    if (['hard', 'difficult', 'extreme'].includes(difficulty)) {
      hints.push(...this.findAdvancedTechniques(board));
    }

    return hints;
  }

  /**
   * Find cells that have only one possible candidate (Naked Singles)
   */
  private static findNakedSingles(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (cell.value === null || cell.value === 0) {
          const candidateInfo = SudokuValidator.getCandidates(
            this.convertBoardToNumbers(board),
            row,
            col
          );

          if (candidateInfo.candidates.length === 1) {
            hints.push({
              hint: {
                type: 'cell',
                message: `Auto-filled ${candidateInfo.candidates[0]} at row ${row + 1}, column ${col + 1}. This was the only valid number for this position.`,
                targetCells: [[row, col]],
                suggestedValue: candidateInfo.candidates[0],
                technique: 'naked_single',
                autoFill: true,
              },
              confidence: 0.95,
              priority: 5,
            });
          }
        }
      }
    }

    return hints;
  }

  /**
   * Find numbers that can only go in one place in a unit (Hidden Singles)
   */
  private static findHiddenSingles(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const numberBoard = this.convertBoardToNumbers(board);

    // Check rows
    for (let row = 0; row < 9; row++) {
      hints.push(
        ...this.findHiddenSinglesInUnit(board, numberBoard, 'row', row)
      );
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      hints.push(
        ...this.findHiddenSinglesInUnit(board, numberBoard, 'column', col)
      );
    }

    // Check 3x3 boxes
    for (let box = 0; box < 9; box++) {
      hints.push(
        ...this.findHiddenSinglesInUnit(board, numberBoard, 'box', box)
      );
    }

    return hints;
  }

  /**
   * Find hidden singles within a specific unit (row, column, or box)
   */
  private static findHiddenSinglesInUnit(
    board: SudokuBoard,
    numberBoard: number[][],
    unitType: 'row' | 'column' | 'box',
    unitIndex: number
  ): HintResult[] {
    const hints: HintResult[] = [];
    const emptyCells = this.getEmptyCellsInUnit(board, unitType, unitIndex);

    for (let num = 1; num <= 9; num++) {
      const possibleCells = emptyCells.filter(([row, col]) => {
        const candidateInfo = SudokuValidator.getCandidates(
          numberBoard,
          row,
          col
        );
        return candidateInfo.candidates.includes(num);
      });

      if (possibleCells.length === 1) {
        const [row, col] = possibleCells[0];
        const unitName =
          unitType === 'box'
            ? `3×3 box ${Math.floor(unitIndex / 3) + 1}-${(unitIndex % 3) + 1}`
            : `${unitType} ${unitIndex + 1}`;

        hints.push({
          hint: {
            type: 'cell',
            message: `Auto-filled ${num} at row ${row + 1}, column ${col + 1}. In ${unitName}, this was the only place for ${num}.`,
            targetCells: [[row, col]],
            suggestedValue: num,
            technique: 'hidden_single',
            autoFill: true,
          },
          confidence: 0.9,
          priority: 4,
        });
      }
    }

    return hints;
  }

  /**
   * Find cells with incorrect values (compared to solution)
   */
  private static findIncorrectValues(
    board: SudokuBoard,
    solution: number[][]
  ): HintResult[] {
    const hints: HintResult[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (cell.value && cell.value !== 0 && !cell.isFixed) {
          if (cell.value !== solution[row][col]) {
            hints.push({
              hint: {
                type: 'cell',
                message: `The value ${cell.value} in row ${row + 1}, column ${col + 1} is incorrect. Try clearing this cell and looking for the right number.`,
                targetCells: [[row, col]],
                technique: 'error_detection',
              },
              confidence: 1.0,
              priority: 5,
            });
          }
        }
      }
    }

    return hints;
  }

  /**
   * Find opportunities for note elimination
   */
  private static findNoteEliminationHints(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const numberBoard = this.convertBoardToNumbers(board);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (
          (cell.value === null || cell.value === 0) &&
          cell.notes.length > 0
        ) {
          const candidateInfo = SudokuValidator.getCandidates(
            numberBoard,
            row,
            col
          );
          const invalidNotes = cell.notes.filter(
            note => !candidateInfo.candidates.includes(note)
          );

          if (invalidNotes.length > 0) {
            hints.push({
              hint: {
                type: 'note',
                message: `In row ${row + 1}, column ${col + 1}, you can eliminate the note${invalidNotes.length > 1 ? 's' : ''} ${invalidNotes.join(', ')} because ${invalidNotes.length > 1 ? 'they conflict' : 'it conflicts'} with other numbers in the same row, column, or box.`,
                targetCells: [[row, col]],
                technique: 'note_elimination',
              },
              confidence: 0.8,
              priority: 3,
            });
          }
        }
      }
    }

    return hints;
  }

  /**
   * Find advanced solving techniques for harder puzzles
   */
  private static findAdvancedTechniques(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];

    // Look for pointing pairs/triples
    hints.push(...this.findPointingPairs(board));

    // Look for box/line reduction
    hints.push(...this.findBoxLineReduction(board));

    return hints;
  }

  /**
   * Find pointing pairs/triples technique
   */
  private static findPointingPairs(_board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    // TODO: Implementation for pointing pairs would go here
    // This is a more advanced technique for harder puzzles
    return hints;
  }

  /**
   * Find box/line reduction opportunities
   */
  private static findBoxLineReduction(_board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    // TODO: Implementation for box/line reduction would go here
    return hints;
  }

  /**
   * Helper: Convert SudokuBoard to number[][] format
   */
  private static convertBoardToNumbers(board: SudokuBoard): number[][] {
    return board.map(row => row.map(cell => cell.value || 0));
  }

  /**
   * Helper: Get empty cells in a specific unit
   */
  private static getEmptyCellsInUnit(
    board: SudokuBoard,
    unitType: 'row' | 'column' | 'box',
    unitIndex: number
  ): [number, number][] {
    const emptyCells: [number, number][] = [];

    if (unitType === 'row') {
      for (let col = 0; col < 9; col++) {
        if (!board[unitIndex][col].value) {
          emptyCells.push([unitIndex, col]);
        }
      }
    } else if (unitType === 'column') {
      for (let row = 0; row < 9; row++) {
        if (!board[row][unitIndex].value) {
          emptyCells.push([row, unitIndex]);
        }
      }
    } else if (unitType === 'box') {
      const startRow = Math.floor(unitIndex / 3) * 3;
      const startCol = (unitIndex % 3) * 3;

      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          if (!board[r][c].value) {
            emptyCells.push([r, c]);
          }
        }
      }
    }

    return emptyCells;
  }

  /**
   * Generate a context-aware hint based on selected cell
   */
  static generateContextualHint(
    board: SudokuBoard,
    selectedRow: number,
    selectedCol: number,
    solution?: number[][]
  ): Hint | null {
    const cell = board[selectedRow][selectedCol];

    // If cell is fixed, can't give hints
    if (cell.isFixed) {
      return {
        type: 'technique',
        message:
          'This is a given number and cannot be changed. Try selecting an empty cell.',
        technique: 'cell_selection',
      };
    }

    // If cell has incorrect value
    if (
      solution &&
      cell.value &&
      cell.value !== solution[selectedRow][selectedCol]
    ) {
      return {
        type: 'cell',
        message: `This cell contains an incorrect value. The correct answer is ${solution[selectedRow][selectedCol]}.`,
        targetCells: [[selectedRow, selectedCol]],
        suggestedValue: solution[selectedRow][selectedCol],
        technique: 'direct_hint',
      };
    }

    // If cell is empty, check for candidates
    if (!cell.value || cell.value === 0) {
      const numberBoard = this.convertBoardToNumbers(board);
      const candidateInfo = SudokuValidator.getCandidates(
        numberBoard,
        selectedRow,
        selectedCol
      );

      if (candidateInfo.candidates.length === 0) {
        return {
          type: 'technique',
          message:
            'This cell has no valid candidates. There might be an error elsewhere in the puzzle.',
          technique: 'error_detection',
        };
      }

      if (candidateInfo.candidates.length === 1) {
        return {
          type: 'cell',
          message: `Auto-filled ${candidateInfo.candidates[0]} in selected cell. This was the only valid number.`,
          targetCells: [[selectedRow, selectedCol]],
          suggestedValue: candidateInfo.candidates[0],
          technique: 'naked_single',
          autoFill: true,
        };
      }

      return {
        type: 'note',
        message: `This cell can be ${candidateInfo.candidates.join(', ')}. Try adding these as notes to help you solve the puzzle.`,
        targetCells: [[selectedRow, selectedCol]],
        technique: 'candidate_suggestion',
      };
    }

    // If cell already has a value, check if it's correct
    if (solution) {
      if (cell.value === solution[selectedRow][selectedCol]) {
        return {
          type: 'technique',
          message: 'This cell is already correctly filled. Good job!',
          technique: 'confirmation',
        };
      }
    }

    return {
      type: 'technique',
      message:
        'Try looking at the candidates for this cell and see if any can be eliminated.',
      technique: 'general_advice',
    };
  }
}
