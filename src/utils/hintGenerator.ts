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

    // 5. Look for basic elimination patterns
    hints.push(...this.findNakedPairs(board));
    hints.push(...this.findPointingPairs(board));

    // 6. For harder difficulties, add advanced techniques
    if (['advanced', 'expert', 'master', 'grandmaster'].includes(difficulty)) {
      hints.push(...this.findXWingTechnique(board));
      hints.push(...this.findXYWingTechnique(board));
      hints.push(...this.findSwordfishTechnique(board));
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

  /**
   * Get all possible candidates for empty cells
   */
  private static getAllCandidates(board: SudokuBoard): CellCandidate[] {
    const candidates: CellCandidate[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!board[row][col].value) {
          const cellCandidates = this.getCandidatesForCell(board, row, col);
          if (cellCandidates.length > 0) {
            candidates.push({
              row,
              col,
              candidates: cellCandidates,
            });
          }
        }
      }
    }

    return candidates;
  }

  /**
   * Get possible candidates for a specific cell
   */
  private static getCandidatesForCell(
    board: SudokuBoard,
    row: number,
    col: number
  ): number[] {
    const candidates: number[] = [];

    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(board, row, col, num)) {
        candidates.push(num);
      }
    }

    return candidates;
  }

  /**
   * Check if a number can be placed in a specific cell
   */
  private static isValidPlacement(
    board: SudokuBoard,
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c].value === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col].value === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c].value === num) return false;
      }
    }

    return true;
  }

  /**
   * Find Naked Pairs - Two cells in the same unit with identical two candidates
   */
  private static findNakedPairs(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const candidates = this.getAllCandidates(board);

    // Check rows, columns, and boxes for naked pairs
    for (let unit = 0; unit < 9; unit++) {
      // Check row
      const rowCells = candidates.filter(
        (c: CellCandidate) => c.row === unit && c.candidates.length === 2
      );
      hints.push(...this.findPairsInUnit(rowCells, 'row', unit));

      // Check column
      const colCells = candidates.filter(
        (c: CellCandidate) => c.col === unit && c.candidates.length === 2
      );
      hints.push(...this.findPairsInUnit(colCells, 'column', unit));

      // Check box
      const boxRow = Math.floor(unit / 3) * 3;
      const boxCol = (unit % 3) * 3;
      const boxCells = candidates.filter(
        (c: CellCandidate) =>
          Math.floor(c.row / 3) === Math.floor(boxRow / 3) &&
          Math.floor(c.col / 3) === Math.floor(boxCol / 3) &&
          c.candidates.length === 2
      );
      hints.push(...this.findPairsInUnit(boxCells, 'box', unit));
    }

    return hints;
  }

  /**
   * Find X-Wing technique - Same candidate in 2 rows/columns forming rectangle
   */
  private static findXWingTechnique(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const candidates = this.getAllCandidates(board);

    for (let num = 1; num <= 9; num++) {
      // Check for X-Wing in rows
      hints.push(...this.findXWingInRows(candidates, num));
      // Check for X-Wing in columns
      hints.push(...this.findXWingInColumns(candidates, num));
    }

    return hints;
  }

  /**
   * Find XY-Wing technique - Three cells forming Y shape with specific candidate pattern
   */
  private static findXYWingTechnique(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const candidates = this.getAllCandidates(board);

    // Find cells with exactly 2 candidates (potential pivots and pincers)
    const biValueCells = candidates.filter(
      (c: CellCandidate) => c.candidates.length === 2
    );

    for (const pivot of biValueCells) {
      hints.push(...this.findXYWingFromPivot(pivot, biValueCells));
    }

    return hints;
  }

  /**
   * Find Swordfish technique - Extension of X-Wing to 3x3 pattern
   */
  private static findSwordfishTechnique(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const candidates = this.getAllCandidates(board);

    for (let num = 1; num <= 9; num++) {
      hints.push(...this.findSwordfishPattern(candidates, num));
    }

    return hints;
  }

  /**
   * Find Pointing Pairs - Candidates that can eliminate from other units
   */
  private static findPointingPairs(board: SudokuBoard): HintResult[] {
    const hints: HintResult[] = [];
    const candidates = this.getAllCandidates(board);

    for (let num = 1; num <= 9; num++) {
      hints.push(...this.findPointingPairsForNumber(candidates, num));
    }

    return hints;
  }

  // Helper methods for advanced techniques

  private static findPairsInUnit(
    cells: CellCandidate[],
    unitType: string,
    unitIndex: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    for (let i = 0; i < cells.length - 1; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const cell1 = cells[i];
        const cell2 = cells[j];

        if (this.arraysEqual(cell1.candidates, cell2.candidates)) {
          hints.push({
            hint: {
              type: 'technique',
              message: `Naked pair found in ${unitType} ${unitIndex + 1}: cells can only be ${cell1.candidates.join(' or ')}. This eliminates these numbers from other cells in the same ${unitType}.`,
              technique: 'naked_pair',
              targetCells: [
                [cell1.row, cell1.col],
                [cell2.row, cell2.col],
              ],
            },
            confidence: 4,
            priority: 3,
          });
        }
      }
    }

    return hints;
  }

  private static findXWingInRows(
    candidates: CellCandidate[],
    num: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Find rows where number appears in exactly 2 columns
    const rowsWithTwoCandidates: { row: number; cols: number[] }[] = [];

    for (let row = 0; row < 9; row++) {
      const cols = candidates
        .filter(c => c.row === row && c.candidates.includes(num))
        .map(c => c.col);

      if (cols.length === 2) {
        rowsWithTwoCandidates.push({ row, cols });
      }
    }

    // Look for pairs of rows with same column pattern
    for (let i = 0; i < rowsWithTwoCandidates.length - 1; i++) {
      for (let j = i + 1; j < rowsWithTwoCandidates.length; j++) {
        const row1 = rowsWithTwoCandidates[i];
        const row2 = rowsWithTwoCandidates[j];

        if (this.arraysEqual(row1.cols, row2.cols)) {
          hints.push({
            hint: {
              type: 'technique',
              message: `X-Wing pattern found for ${num}: forms rectangle in rows ${row1.row + 1} and ${row2.row + 1}, columns ${row1.cols[0] + 1} and ${row1.cols[1] + 1}. This eliminates ${num} from other cells in these columns.`,
              technique: 'x_wing',
              targetCells: [
                [row1.row, row1.cols[0]],
                [row1.row, row1.cols[1]],
                [row2.row, row2.cols[0]],
                [row2.row, row2.cols[1]],
              ],
            },
            confidence: 5,
            priority: 4,
          });
        }
      }
    }

    return hints;
  }

  private static findXWingInColumns(
    candidates: CellCandidate[],
    num: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Similar logic for columns
    const colsWithTwoCandidates: { col: number; rows: number[] }[] = [];

    for (let col = 0; col < 9; col++) {
      const rows = candidates
        .filter(c => c.col === col && c.candidates.includes(num))
        .map(c => c.row);

      if (rows.length === 2) {
        colsWithTwoCandidates.push({ col, rows });
      }
    }

    for (let i = 0; i < colsWithTwoCandidates.length - 1; i++) {
      for (let j = i + 1; j < colsWithTwoCandidates.length; j++) {
        const col1 = colsWithTwoCandidates[i];
        const col2 = colsWithTwoCandidates[j];

        if (this.arraysEqual(col1.rows, col2.rows)) {
          hints.push({
            hint: {
              type: 'technique',
              message: `X-Wing pattern found for ${num}: forms rectangle in columns ${col1.col + 1} and ${col2.col + 1}, rows ${col1.rows[0] + 1} and ${col1.rows[1] + 1}. This eliminates ${num} from other cells in these rows.`,
              technique: 'x_wing',
              targetCells: [
                [col1.rows[0], col1.col],
                [col1.rows[1], col1.col],
                [col2.rows[0], col2.col],
                [col2.rows[1], col2.col],
              ],
            },
            confidence: 5,
            priority: 4,
          });
        }
      }
    }

    return hints;
  }

  private static findXYWingFromPivot(
    pivot: CellCandidate,
    biValueCells: CellCandidate[]
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Find potential pincers that share one candidate with pivot
    const pincers = biValueCells.filter(
      cell =>
        cell !== pivot &&
        this.sharesSameUnit(pivot, cell) &&
        this.hasExactlyOneSharedCandidate(pivot.candidates, cell.candidates)
    );

    if (pincers.length >= 2) {
      for (let i = 0; i < pincers.length - 1; i++) {
        for (let j = i + 1; j < pincers.length; j++) {
          const pincer1 = pincers[i];
          const pincer2 = pincers[j];

          // Check if pincers form valid XY-Wing pattern
          if (this.isValidXYWing(pivot, pincer1, pincer2)) {
            const eliminationCandidate = this.getXYWingEliminationCandidate(
              pivot,
              pincer1,
              pincer2
            );

            hints.push({
              hint: {
                type: 'technique',
                message: `XY-Wing pattern found: pivot at (${pivot.row + 1},${pivot.col + 1}) with pincers at (${pincer1.row + 1},${pincer1.col + 1}) and (${pincer2.row + 1},${pincer2.col + 1}). This eliminates ${eliminationCandidate} from cells that see both pincers.`,
                technique: 'xy_wing',
                targetCells: [
                  [pivot.row, pivot.col],
                  [pincer1.row, pincer1.col],
                  [pincer2.row, pincer2.col],
                ],
              },
              confidence: 5,
              priority: 4,
            });
          }
        }
      }
    }

    return hints;
  }

  private static findSwordfishPattern(
    candidates: CellCandidate[],
    num: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Find rows where number appears in 2-3 positions
    const candidateRows: { row: number; cols: number[] }[] = [];

    for (let row = 0; row < 9; row++) {
      const cols = candidates
        .filter(c => c.row === row && c.candidates.includes(num))
        .map(c => c.col);

      if (cols.length >= 2 && cols.length <= 3) {
        candidateRows.push({ row, cols });
      }
    }

    // Look for 3 rows that form swordfish pattern
    if (candidateRows.length >= 3) {
      for (let i = 0; i < candidateRows.length - 2; i++) {
        for (let j = i + 1; j < candidateRows.length - 1; j++) {
          for (let k = j + 1; k < candidateRows.length; k++) {
            const pattern = this.checkSwordfishPattern([
              candidateRows[i],
              candidateRows[j],
              candidateRows[k],
            ]);

            if (pattern.isValid) {
              hints.push({
                hint: {
                  type: 'technique',
                  message: `Swordfish pattern found for ${num} in rows ${candidateRows[i].row + 1}, ${candidateRows[j].row + 1}, ${candidateRows[k].row + 1}. This eliminates ${num} from other cells in columns ${pattern.columns.join(', ')}.`,
                  technique: 'swordfish',
                  targetCells: pattern.targetCells,
                },
                confidence: 5,
                priority: 5,
              });
            }
          }
        }
      }
    }

    return hints;
  }

  private static findPointingPairsForNumber(
    candidates: CellCandidate[],
    num: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Check each 3x3 box
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxCandidates = candidates.filter(
          c =>
            Math.floor(c.row / 3) === boxRow &&
            Math.floor(c.col / 3) === boxCol &&
            c.candidates.includes(num)
        );

        // Check if all candidates for this number in the box are in same row
        const rows = [...new Set(boxCandidates.map(c => c.row))];
        if (rows.length === 1 && boxCandidates.length >= 2) {
          hints.push({
            hint: {
              type: 'technique',
              message: `Pointing pair found: ${num} in box ${boxRow * 3 + boxCol + 1} can only be in row ${rows[0] + 1}. This eliminates ${num} from other cells in this row outside the box.`,
              technique: 'pointing_pair',
              targetCells: boxCandidates.map(c => [c.row, c.col]),
            },
            confidence: 4,
            priority: 3,
          });
        }

        // Check if all candidates for this number in the box are in same column
        const cols = [...new Set(boxCandidates.map(c => c.col))];
        if (cols.length === 1 && boxCandidates.length >= 2) {
          hints.push({
            hint: {
              type: 'technique',
              message: `Pointing pair found: ${num} in box ${boxRow * 3 + boxCol + 1} can only be in column ${cols[0] + 1}. This eliminates ${num} from other cells in this column outside the box.`,
              technique: 'pointing_pair',
              targetCells: boxCandidates.map(c => [c.row, c.col]),
            },
            confidence: 4,
            priority: 3,
          });
        }
      }
    }

    return hints;
  }

  // Utility helper methods
  private static arraysEqual(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  private static sharesSameUnit(
    cell1: CellCandidate,
    cell2: CellCandidate
  ): boolean {
    return (
      cell1.row === cell2.row ||
      cell1.col === cell2.col ||
      (Math.floor(cell1.row / 3) === Math.floor(cell2.row / 3) &&
        Math.floor(cell1.col / 3) === Math.floor(cell2.col / 3))
    );
  }

  private static hasExactlyOneSharedCandidate(
    candidates1: number[],
    candidates2: number[]
  ): boolean {
    const shared = candidates1.filter(c => candidates2.includes(c));
    return shared.length === 1;
  }

  private static isValidXYWing(
    pivot: CellCandidate,
    pincer1: CellCandidate,
    pincer2: CellCandidate
  ): boolean {
    // XY-Wing requires specific candidate pattern
    const sharedWithPincer1 = pivot.candidates.filter(c =>
      pincer1.candidates.includes(c)
    );
    const sharedWithPincer2 = pivot.candidates.filter(c =>
      pincer2.candidates.includes(c)
    );

    return (
      sharedWithPincer1.length === 1 &&
      sharedWithPincer2.length === 1 &&
      sharedWithPincer1[0] !== sharedWithPincer2[0]
    );
  }

  private static getXYWingEliminationCandidate(
    pivot: CellCandidate,
    pincer1: CellCandidate,
    pincer2: CellCandidate
  ): number {
    const notSharedWithPivot1 = pincer1.candidates.filter(
      c => !pivot.candidates.includes(c)
    );
    const notSharedWithPivot2 = pincer2.candidates.filter(
      c => !pivot.candidates.includes(c)
    );

    return notSharedWithPivot1.find(c => notSharedWithPivot2.includes(c)) || 0;
  }

  private static checkSwordfishPattern(
    rows: { row: number; cols: number[] }[]
  ): { isValid: boolean; columns: number[]; targetCells: [number, number][] } {
    // Combine all columns from the 3 rows
    const allCols = [...new Set(rows.flatMap(r => r.cols))].sort();

    // Valid swordfish must have exactly 3 columns
    if (allCols.length === 3) {
      // Each column must appear in at least 2 of the 3 rows
      const isValid = allCols.every(
        col => rows.filter(r => r.cols.includes(col)).length >= 2
      );

      if (isValid) {
        const targetCells: [number, number][] = [];
        rows.forEach(r => {
          r.cols.forEach(col => {
            targetCells.push([r.row, col]);
          });
        });

        return { isValid: true, columns: allCols, targetCells };
      }
    }

    return { isValid: false, columns: [], targetCells: [] };
  }
}
