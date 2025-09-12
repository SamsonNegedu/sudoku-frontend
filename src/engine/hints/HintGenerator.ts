/**
 * Advanced Sudoku Hint Generation System
 * Refactored and improved version of the original hint generation logic
 */

import type {
  IHintGenerator,
  HintRequest,
  HintResult,
  CandidateInfo,
  NumericBoard,
  HintTechnique,
  SudokuBoard,
  IValidator,
} from '../types';
import i18n from '../../i18n';

// Additional types for advanced hint generation
interface CellCandidate {
  row: number;
  col: number;
  candidates: number[];
}

export class HintGenerator implements IHintGenerator {
  private validator: IValidator;

  // Hint tracking to prevent getting stuck on repeated eliminations
  private suggestedEliminations = new Set<string>();
  private boardHash: string = '';

  // Technique weights for prioritization - placement hints should always win over elimination hints
  private readonly techniqueWeights = new Map<HintTechnique, number>([
    ['naked_single', 2.0], // Highest priority - direct placement
    ['hidden_single', 1.9], // Second highest - direct placement
    ['error_detection', 1.8], // High priority - fix errors first
    ['naked_pair', 0.7], // Advanced placement techniques
    ['pointing_pair', 0.6],
    ['box_line_reduction', 0.5],
    ['note_elimination', 0.3], // Lower priority - only elimination
    ['candidate_suggestion', 0.2], // Lowest - just suggestions
    ['x_wing', 0.4],
    ['xy_wing', 0.3],
    ['swordfish', 0.2],
  ]);

  constructor(validator: IValidator) {
    this.validator = validator;
  }

  init(): void {
    // Initialization logic if needed
  }

  /**
   * Public method to reset elimination tracking (call when user makes a move)
   */
  resetEliminationTracking(): void {
    this.suggestedEliminations.clear();
    this.boardHash = '';
  }

  /**
   * Public method to get current tracking stats (for debugging)
   */
  getTrackingStats(): { suggestedCount: number; suggestions: string[] } {
    return {
      suggestedCount: this.suggestedEliminations.size,
      suggestions: Array.from(this.suggestedEliminations),
    };
  }

  destroy(): void {
    // Cleanup logic if needed
    this.suggestedEliminations.clear();
  }

  /**
   * Create a unique hash for the current board state
   */
  private createBoardHash(board: NumericBoard): string {
    return board.map(row => row.join('')).join('');
  }

  /**
   * Create a unique key for an elimination suggestion
   */
  private createEliminationKey(
    row: number,
    col: number,
    values: number[]
  ): string {
    return `${row},${col}:${values.sort().join(',')}`;
  }

  /**
   * Mark an elimination as suggested
   */
  private markEliminationAsSuggested(
    row: number,
    col: number,
    values: number[]
  ): void {
    const key = this.createEliminationKey(row, col, values);
    this.suggestedEliminations.add(key);
  }

  /**
   * Check if a hint has already been suggested (comprehensive check for all hint types)
   */
  private isHintAlreadySuggested(hint: HintResult): boolean {
    // Check for technique-based eliminations (like "other cells" hints)
    if (hint.hint.message.toLowerCase().includes('other cells')) {
      const techniqueKey = `${hint.technique}:${hint.hint.message}`;
      return this.suggestedEliminations.has(techniqueKey);
    }

    // Check for message-based eliminations
    if (hint.hint.targetCells && hint.hint.targetCells.length > 0) {
      const [row, col] = hint.hint.targetCells[0];
      const messageKey = `${row},${col}:${hint.hint.message}`;
      if (this.suggestedEliminations.has(messageKey)) {
        return true;
      }

      // Check for value-based eliminations
      const eliminationValues = this.extractEliminationValues(
        hint.hint.message
      );
      if (eliminationValues.length > 0) {
        const valueKey = this.createEliminationKey(row, col, eliminationValues);
        return this.suggestedEliminations.has(valueKey);
      }
    }

    return false;
  }

  /**
   * Reset tracking when board changes
   */
  private resetTrackingIfBoardChanged(board: NumericBoard): void {
    const currentHash = this.createBoardHash(board);
    if (currentHash !== this.boardHash) {
      this.suggestedEliminations.clear();
      this.boardHash = currentHash;
    }
  }

  /**
   * Extract elimination values from hint message
   * This is a simple regex-based approach to extract numbers
   */
  private extractEliminationValues(message: string): number[] {
    const numberMatches = message.match(/\b[1-9]\b/g);
    if (!numberMatches) return [];

    return numberMatches
      .map(num => parseInt(num, 10))
      .filter((num, index, arr) => arr.indexOf(num) === index) // Remove duplicates
      .sort();
  }

  /**
   * Generate the best available hint for the current board state
   */
  generateHint(request: HintRequest): HintResult | null {
    try {
      // Reset tracking if board has changed
      const board = this.convertSudokuBoardToNumeric(request.board);
      this.resetTrackingIfBoardChanged(board);

      const allHints = this.generateAllHints(request);

      // Filter out hints that have already been suggested
      const hints = allHints.filter(hint => {
        const isElimination =
          hint.hint.type === 'note' ||
          hint.technique === 'note_elimination' ||
          hint.hint.message.toLowerCase().includes('eliminate');

        if (isElimination && this.isHintAlreadySuggested(hint)) {
          return false; // Skip this hint
        }
        return true; // Keep this hint
      });

      if (hints.length === 0) {
        this.suggestedEliminations.clear();
        return this.createFallbackHint();
      }

      // Sort hints by technique weight, priority, and confidence
      hints.sort((a, b) => {
        const weightA =
          this.techniqueWeights.get(a.technique as HintTechnique) || 0.1;
        const weightB =
          this.techniqueWeights.get(b.technique as HintTechnique) || 0.1;
        const scoreA = weightA * a.priority * a.confidence;
        const scoreB = weightB * b.priority * b.confidence;

        // If it's a placement hint vs elimination hint, strongly prefer placement
        const isPlacementA = a.hint.type === 'value' || a.hint.autoFill;
        const isPlacementB = b.hint.type === 'value' || b.hint.autoFill;

        if (isPlacementA && !isPlacementB) {
          return -1; // A is placement, B is not - A wins
        }
        if (isPlacementB && !isPlacementA) {
          return 1; // B is placement, A is not - B wins
        }

        return scoreB - scoreA;
      });

      const bestHint = hints[0];

      // Mark elimination hints as suggested to prevent repetition
      if (
        bestHint.hint.type === 'note' ||
        bestHint.technique === 'note_elimination' ||
        bestHint.hint.message.toLowerCase().includes('eliminate')
      ) {
        // For hints that mention eliminating from "other cells", we need a different approach
        if (bestHint.hint.message.toLowerCase().includes('other cells')) {
          // Create a unique key based on the technique and the specific elimination described
          const techniqueKey = `${bestHint.technique}:${bestHint.hint.message}`;
          this.suggestedEliminations.add(techniqueKey);
        } else if (
          bestHint.hint.targetCells &&
          bestHint.hint.targetCells.length > 0
        ) {
          const [row, col] = bestHint.hint.targetCells[0];
          // Extract elimination values from the hint message
          const eliminationValues = this.extractEliminationValues(
            bestHint.hint.message
          );

          if (eliminationValues.length > 0) {
            this.markEliminationAsSuggested(row, col, eliminationValues);
          } else {
            // Fallback: mark the entire hint message as suggested for this cell
            const messageKey = `${row},${col}:${bestHint.hint.message}`;
            this.suggestedEliminations.add(messageKey);
          }
        }
      }

      return bestHint;
    } catch {
      return null;
    }
  }

  /**
   * Generate all available hints sorted by effectiveness
   */
  generateAllHints(request: HintRequest): HintResult[] {
    const board = this.convertSudokuBoardToNumeric(request.board);
    const allHints: HintResult[] = [];

    // If a specific cell is selected, try contextual hints first
    if (request.selectedCell) {
      const contextualHints = this.generateContextualHints(request, board);
      allHints.push(...contextualHints);
    }

    // Generate technique-based hints
    const techniqueHints = this.generateTechniqueHints(request, board);
    allHints.push(...techniqueHints);

    // Remove duplicates and sort by effectiveness
    const uniqueHints = this.removeDuplicateHints(allHints);
    return this.prioritizeHints(uniqueHints, request.difficulty);
  }

  /**
   * Analyze board for candidate information
   */
  analyzeBoard(board: SudokuBoard): CandidateInfo[] {
    const numericBoard = this.convertSudokuBoardToNumeric(board);
    const candidates: CandidateInfo[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (numericBoard[row][col] === 0) {
          const candidateInfo = this.validator.getCandidates(
            numericBoard,
            row,
            col
          );
          if (candidateInfo.candidates.length > 0) {
            candidates.push(candidateInfo);
          }
        }
      }
    }

    return candidates;
  }

  // ============= Private Methods =============

  /**
   * Generate contextual hints for selected cell
   */
  private generateContextualHints(
    request: HintRequest,
    board: NumericBoard
  ): HintResult[] {
    const hints: HintResult[] = [];
    const [row, col] = request.selectedCell!;
    const cell = request.board[row][col];

    // If cell is fixed, provide guidance
    if (cell.isFixed) {
      hints.push({
        hint: {
          type: 'technique',
          message:
            'This is a given number and cannot be changed. Try selecting an empty cell.',
          technique: 'cell_selection',
        },
        confidence: 1.0,
        priority: 3,
        technique: 'cell_selection',
        complexity: 1,
      });
      return hints;
    }

    // If cell has incorrect value and solution is available
    if (
      request.solution &&
      cell.value &&
      cell.value !== request.solution[row][col]
    ) {
      hints.push({
        hint: {
          type: 'cell',
          message: i18n.t('hints.messages.incorrectValue', {
            correctValue: request.solution[row][col],
          }),
          targetCells: [[row, col]],
          suggestedValue: request.solution[row][col],
          technique: 'direct_hint',
        },
        confidence: 1.0,
        priority: 5,
        technique: 'error_detection',
        complexity: 1,
      });
      return hints;
    }

    // If cell is empty, analyze candidates
    if (!cell.value || cell.value === 0) {
      const candidateInfo = this.validator.getCandidates(board, row, col);

      if (candidateInfo.candidates.length === 0) {
        hints.push({
          hint: {
            type: 'technique',
            message:
              'This cell has no valid candidates. There might be an error elsewhere in the puzzle.',
            technique: 'error_detection',
          },
          confidence: 0.9,
          priority: 4,
          technique: 'error_detection',
          complexity: 2,
        });
      } else if (candidateInfo.candidates.length === 1) {
        hints.push({
          hint: {
            type: 'cell',
            message: i18n.t('hints.messages.autoFilled', {
              value: candidateInfo.candidates[0],
            }),
            targetCells: [[row, col]],
            suggestedValue: candidateInfo.candidates[0],
            technique: 'naked_single',
            autoFill: true,
          },
          confidence: 0.95,
          priority: 5,
          technique: 'naked_single',
          complexity: 1,
        });
      } else {
        hints.push({
          hint: {
            type: 'note',
            message: i18n.t('hints.messages.candidateSuggestion', {
              candidates: candidateInfo.candidates.join(', '),
            }),
            targetCells: [[row, col]],
            technique: 'candidate_suggestion',
          },
          confidence: 0.7,
          priority: 2,
          technique: 'candidate_suggestion',
          complexity: 1,
        });
      }
    }

    return hints;
  }

  /**
   * Generate technique-based hints
   */
  private generateTechniqueHints(
    request: HintRequest,
    board: NumericBoard
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Basic techniques (always check these)
    hints.push(...this.findNakedSingles(board));
    hints.push(...this.findHiddenSingles(board));

    // Error detection (if solution available)
    if (request.solution) {
      hints.push(...this.findIncorrectValues(request.board, request.solution));
    }

    // Note elimination
    hints.push(...this.findNoteEliminationHints(request.board, board));

    // Advanced techniques based on difficulty and complexity
    const maxComplexity = this.getMaxComplexityForDifficulty(
      request.difficulty
    );

    if (maxComplexity >= 2) {
      hints.push(...this.findNakedPairs(board));
      hints.push(...this.findPointingPairs(board));
    }

    if (maxComplexity >= 3) {
      hints.push(...this.findBoxLineReduction(board));
      hints.push(...this.findXWingTechnique(board));
    }

    if (maxComplexity >= 4) {
      hints.push(...this.findXYWingTechnique(board));
      hints.push(...this.findSwordfishTechnique(board));
    }

    return hints;
  }

  /**
   * Find cells that have only one possible candidate (Naked Singles)
   */
  private findNakedSingles(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const candidateInfo = this.validator.getCandidates(board, row, col);

          if (candidateInfo.candidates.length === 1) {
            const value = candidateInfo.candidates[0];
            hints.push({
              hint: {
                type: 'cell',
                message: i18n.t('hints.messages.placeValue', {
                  value: value,
                  row: row + 1,
                  col: col + 1,
                }),
                targetCells: [[row, col]],
                suggestedValue: value,
                technique: 'naked_single',
                autoFill: true,
                detailedExplanation: i18n.t(
                  'hints.detailedExplanations.naked_single',
                  {
                    techniqueName: i18n.t('hints.techniqueNames.naked_single'),
                  }
                ),
              },
              confidence: 0.95,
              priority: 5,
              technique: 'naked_single',
              complexity: 1,
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
  private findHiddenSingles(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];

    // Check rows
    for (let row = 0; row < 9; row++) {
      hints.push(...this.findHiddenSinglesInRow(board, row));
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      hints.push(...this.findHiddenSinglesInColumn(board, col));
    }

    // Check 3x3 boxes
    for (let box = 0; box < 9; box++) {
      hints.push(...this.findHiddenSinglesInBox(board, box));
    }

    return hints;
  }

  /**
   * Find hidden singles in a specific row
   */
  private findHiddenSinglesInRow(
    board: NumericBoard,
    row: number
  ): HintResult[] {
    const hints: HintResult[] = [];
    const emptyCells = this.getEmptyCellsInRow(board, row);

    for (let num = 1; num <= 9; num++) {
      const possibleCells = emptyCells.filter(([r, c]) => {
        const candidateInfo = this.validator.getCandidates(board, r, c);
        return candidateInfo.candidates.includes(num);
      });

      if (possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        hints.push({
          hint: {
            type: 'value',
            message: i18n.t('hints.messages.placeValue', {
              value: num,
              row: r + 1,
              col: c + 1,
            }),
            targetCells: [[r, c]],
            suggestedValue: num,
            technique: 'hidden_single',
            autoFill: true,
            detailedExplanation: i18n.t(
              'hints.detailedExplanations.hidden_single_row',
              {
                techniqueName: i18n.t('hints.techniqueNames.hidden_single'),
                number: num,
                row: row + 1,
              }
            ),
          },
          confidence: 0.9,
          priority: 4,
          technique: 'hidden_single',
          complexity: 2,
        });
      }
    }

    return hints;
  }

  /**
   * Find hidden singles in a specific column
   */
  private findHiddenSinglesInColumn(
    board: NumericBoard,
    col: number
  ): HintResult[] {
    const hints: HintResult[] = [];
    const emptyCells = this.getEmptyCellsInColumn(board, col);

    for (let num = 1; num <= 9; num++) {
      const possibleCells = emptyCells.filter(([r, c]) => {
        const candidateInfo = this.validator.getCandidates(board, r, c);
        return candidateInfo.candidates.includes(num);
      });

      if (possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        hints.push({
          hint: {
            type: 'value',
            message: i18n.t('hints.messages.placeValue', {
              value: num,
              row: r + 1,
              col: c + 1,
            }),
            targetCells: [[r, c]],
            suggestedValue: num,
            technique: 'hidden_single',
            autoFill: true,
            detailedExplanation: i18n.t(
              'hints.detailedExplanations.hidden_single_col',
              {
                techniqueName: i18n.t('hints.techniqueNames.hidden_single'),
                number: num,
                col: col + 1,
              }
            ),
          },
          confidence: 0.9,
          priority: 4,
          technique: 'hidden_single',
          complexity: 2,
        });
      }
    }

    return hints;
  }

  /**
   * Find hidden singles in a specific 3x3 box
   */
  private findHiddenSinglesInBox(
    board: NumericBoard,
    boxIndex: number
  ): HintResult[] {
    const hints: HintResult[] = [];
    const emptyCells = this.getEmptyCellsInBox(board, boxIndex);

    for (let num = 1; num <= 9; num++) {
      const possibleCells = emptyCells.filter(([r, c]) => {
        const candidateInfo = this.validator.getCandidates(board, r, c);
        return candidateInfo.candidates.includes(num);
      });

      if (possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        const boxName = `3×3 box ${Math.floor(boxIndex / 3) + 1}-${(boxIndex % 3) + 1}`;
        hints.push({
          hint: {
            type: 'value',
            message: i18n.t('hints.messages.placeValue', {
              value: num,
              row: r + 1,
              col: c + 1,
            }),
            targetCells: [[r, c]],
            suggestedValue: num,
            technique: 'hidden_single',
            autoFill: true,
            detailedExplanation: i18n.t(
              'hints.detailedExplanations.hidden_single_box',
              {
                techniqueName: i18n.t('hints.techniqueNames.hidden_single'),
                number: num,
                boxName: boxName,
              }
            ),
          },
          confidence: 0.9,
          priority: 4,
          technique: 'hidden_single',
          complexity: 2,
        });
      }
    }

    return hints;
  }

  /**
   * Find cells with incorrect values (compared to solution)
   */
  private findIncorrectValues(
    board: SudokuBoard,
    solution: NumericBoard
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
                message: i18n.t('hints.messages.incorrectCellValue', {
                  value: cell.value,
                  row: row + 1,
                  col: col + 1,
                }),
                targetCells: [[row, col]],
                technique: 'error_detection',
              },
              confidence: 1.0,
              priority: 5,
              technique: 'error_detection',
              complexity: 1,
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
  private findNoteEliminationHints(
    board: SudokuBoard,
    numericBoard: NumericBoard
  ): HintResult[] {
    const hints: HintResult[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if ((!cell.value || cell.value === 0) && cell.notes.length > 0) {
          const candidateInfo = this.validator.getCandidates(
            numericBoard,
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
                message: i18n.t('hints.messages.eliminateNotes', {
                  row: row + 1,
                  col: col + 1,
                  plural: invalidNotes.length > 1 ? 's' : '',
                  notes: invalidNotes.join(', '),
                  reason:
                    invalidNotes.length > 1
                      ? i18n.t('hints.messages.noteConflictPlural')
                      : i18n.t('hints.messages.noteConflictSingle'),
                }),
                targetCells: [[row, col]],
                technique: 'note_elimination',
              },
              confidence: 0.8,
              priority: 3,
              technique: 'note_elimination',
              complexity: 2,
            });
          }
        }
      }
    }

    return hints;
  }

  private findNakedPairs(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

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

  private findPointingPairs(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

    for (let num = 1; num <= 9; num++) {
      hints.push(...this.findPointingPairsForNumber(candidates, num));
    }

    return hints;
  }

  private findBoxLineReduction(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

    for (let num = 1; num <= 9; num++) {
      hints.push(...this.findBoxLineReductionForNumber(candidates, num));
    }

    return hints;
  }

  private findXWingTechnique(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

    for (let num = 1; num <= 9; num++) {
      // Check for X-Wing in rows
      hints.push(...this.findXWingInRows(candidates, num));
      // Check for X-Wing in columns
      hints.push(...this.findXWingInColumns(candidates, num));
    }

    return hints;
  }

  private findXYWingTechnique(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

    // Find cells with exactly 2 candidates (potential pivots and pincers)
    const biValueCells = candidates.filter(
      (c: CellCandidate) => c.candidates.length === 2
    );

    for (const pivot of biValueCells) {
      hints.push(...this.findXYWingFromPivot(pivot, biValueCells));
    }

    return hints;
  }

  private findSwordfishTechnique(board: NumericBoard): HintResult[] {
    const hints: HintResult[] = [];
    const sudokuBoard = this.convertNumericToSudokuBoard(board);
    const candidates = this.getAllCandidates(sudokuBoard);

    for (let num = 1; num <= 9; num++) {
      hints.push(...this.findSwordfishPattern(candidates, num));
    }

    return hints;
  }

  // ============= Helper Methods =============

  /**
   * Convert SudokuBoard to NumericBoard
   */
  private convertSudokuBoardToNumeric(board: SudokuBoard): NumericBoard {
    return board.map(row => row.map(cell => cell.value || 0));
  }

  /**
   * Get all possible candidates for empty cells
   */
  private getAllCandidates(board: SudokuBoard): CellCandidate[] {
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
   * Get candidates for a specific cell
   */
  private getCandidatesForCell(
    board: SudokuBoard,
    row: number,
    col: number
  ): number[] {
    if (board[row][col].value) return [];

    const candidates: number[] = [];

    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(board, row, col, num)) {
        candidates.push(num);
      }
    }

    return candidates;
  }

  /**
   * Check if a number can be placed at a position
   */
  private isValidPlacement(
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
   * Convert NumericBoard back to SudokuBoard (helper for advanced techniques)
   */
  private convertNumericToSudokuBoard(board: NumericBoard): SudokuBoard {
    return board.map((row, r) =>
      row.map((value, c) => ({
        value: value || null,
        notes: [],
        isFixed: false,
        isSelected: false,
        isHighlighted: false,
        isCorrect: null,
        isIncorrect: false,
        row: r,
        col: c,
      }))
    );
  }

  /**
   * Find pairs in a unit (row, column, or box)
   */
  private findPairsInUnit(
    cells: CellCandidate[],
    unitType: string,
    unitIndex: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    for (let i = 0; i < cells.length - 1; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const cell1 = cells[i];
        const cell2 = cells[j];

        // Check if they have the same candidates (naked pair)
        if (
          cell1.candidates.length === 2 &&
          cell2.candidates.length === 2 &&
          cell1.candidates[0] === cell2.candidates[0] &&
          cell1.candidates[1] === cell2.candidates[1]
        ) {
          const [num1, num2] = cell1.candidates;
          hints.push({
            hint: {
              type: 'technique',
              message: i18n.t('hints.messages.eliminateFromUnit', {
                numbers: `${num1} and ${num2}`,
                unitType: unitType,
                unitIndex: unitIndex + 1,
              }),
              technique: 'naked_pair',
              targetCells: [
                [cell1.row, cell1.col],
                [cell2.row, cell2.col],
              ],
              detailedExplanation: i18n.t(
                'hints.detailedExplanations.naked_pair',
                {
                  techniqueName: i18n.t('hints.techniqueNames.naked_pair'),
                  num1: num1,
                  num2: num2,
                  unitType: unitType,
                }
              ),
            },
            confidence: 0.9,
            priority: 3,
            technique: 'naked_pair',
            complexity: 2,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Find pointing pairs for a specific number
   */
  private findPointingPairsForNumber(
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
              message: i18n.t('hints.messages.eliminateFromRow', {
                number: num,
                row: rows[0] + 1,
              }),
              technique: 'pointing_pair',
              targetCells: boxCandidates.map(c => [c.row, c.col]),
              detailedExplanation: i18n.t(
                'hints.detailedExplanations.pointing_pair_row',
                {
                  techniqueName: i18n.t('hints.techniqueNames.pointing_pair'),
                  number: num,
                }
              ),
            },
            confidence: 0.8,
            priority: 3,
            technique: 'pointing_pair',
            complexity: 2,
          });
        }

        // Check if all candidates for this number in the box are in same column
        const cols = [...new Set(boxCandidates.map(c => c.col))];
        if (cols.length === 1 && boxCandidates.length >= 2) {
          hints.push({
            hint: {
              type: 'technique',
              message: i18n.t('hints.messages.eliminateFromColumn', {
                number: num,
                col: cols[0] + 1,
              }),
              technique: 'pointing_pair',
              targetCells: boxCandidates.map(c => [c.row, c.col]),
              detailedExplanation: i18n.t(
                'hints.detailedExplanations.pointing_pair_col',
                {
                  techniqueName: i18n.t('hints.techniqueNames.pointing_pair'),
                  number: num,
                }
              ),
            },
            confidence: 0.8,
            priority: 3,
            technique: 'pointing_pair',
            complexity: 2,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Find X-Wing patterns in rows
   */
  private findXWingInRows(
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
              message: i18n.t('hints.messages.xWingRows', {
                number: num,
                row1: row1.row + 1,
                row2: row2.row + 1,
                col1: row1.cols[0] + 1,
                col2: row1.cols[1] + 1,
              }),
              technique: 'x_wing',
              targetCells: [
                [row1.row, row1.cols[0]],
                [row1.row, row1.cols[1]],
                [row2.row, row2.cols[0]],
                [row2.row, row2.cols[1]],
              ],
              detailedExplanation: i18n.t('hints.detailedExplanations.x_wing', {
                techniqueName: i18n.t('hints.techniqueNames.x_wing'),
              }),
            },
            confidence: 0.9,
            priority: 4,
            technique: 'x_wing',
            complexity: 3,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Find X-Wing patterns in columns
   */
  private findXWingInColumns(
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
              message: i18n.t('hints.messages.xWingCols', {
                number: num,
                col1: col1.col + 1,
                col2: col2.col + 1,
                row1: col1.rows[0] + 1,
                row2: col1.rows[1] + 1,
              }),
              technique: 'x_wing',
              targetCells: [
                [col1.rows[0], col1.col],
                [col1.rows[1], col1.col],
                [col2.rows[0], col2.col],
                [col2.rows[1], col2.col],
              ],
              detailedExplanation: i18n.t('hints.detailedExplanations.x_wing', {
                techniqueName: i18n.t('hints.techniqueNames.x_wing'),
              }),
            },
            confidence: 0.9,
            priority: 4,
            technique: 'x_wing',
            complexity: 3,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Check if two arrays are equal
   */
  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
  }

  /**
   * Find XY-Wing pattern from a pivot cell
   */
  private findXYWingFromPivot(
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
                message: i18n.t('hints.messages.xyWingPattern', {
                  pivotRow: pivot.row + 1,
                  pivotCol: pivot.col + 1,
                  pincer1Row: pincer1.row + 1,
                  pincer1Col: pincer1.col + 1,
                  pincer2Row: pincer2.row + 1,
                  pincer2Col: pincer2.col + 1,
                  candidate: eliminationCandidate,
                }),
                technique: 'xy_wing',
                targetCells: [
                  [pivot.row, pivot.col],
                  [pincer1.row, pincer1.col],
                  [pincer2.row, pincer2.col],
                ],
                detailedExplanation: i18n.t(
                  'hints.detailedExplanations.xy_wing',
                  {
                    techniqueName: i18n.t('hints.techniqueNames.xy_wing'),
                  }
                ),
              },
              confidence: 0.9,
              priority: 4,
              technique: 'xy_wing',
              complexity: 4,
            });
          }
        }
      }
    }

    return hints;
  }

  /**
   * Find Swordfish pattern for a specific number
   */
  private findSwordfishPattern(
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
                  message: i18n.t('hints.messages.swordfishPattern', {
                    number: num,
                    rows: `${candidateRows[i].row + 1}, ${candidateRows[j].row + 1}, ${candidateRows[k].row + 1}`,
                    columns: pattern.columns.join(', '),
                  }),
                  technique: 'swordfish',
                  targetCells: pattern.targetCells,
                  detailedExplanation: i18n.t(
                    'hints.detailedExplanations.swordfish',
                    {
                      techniqueName: i18n.t('hints.techniqueNames.swordfish'),
                    }
                  ),
                },
                confidence: 0.95,
                priority: 5,
                technique: 'swordfish',
                complexity: 4,
              });
            }
          }
        }
      }
    }

    return hints;
  }

  /**
   * Find Box Line Reduction for a specific number
   */
  private findBoxLineReductionForNumber(
    candidates: CellCandidate[],
    num: number
  ): HintResult[] {
    const hints: HintResult[] = [];

    // Check each row to see if a number in that row is confined to one box
    for (let row = 0; row < 9; row++) {
      const rowCandidates = candidates.filter(
        c => c.row === row && c.candidates.includes(num)
      );

      if (rowCandidates.length >= 2) {
        // Check if all candidates in this row are in the same box
        const boxes = [
          ...new Set(
            rowCandidates.map(
              c => Math.floor(c.row / 3) * 3 + Math.floor(c.col / 3)
            )
          ),
        ];

        if (boxes.length === 1) {
          const box = boxes[0];

          hints.push({
            hint: {
              type: 'technique',
              message: i18n.t('hints.messages.boxLineReductionRow', {
                number: num,
                row: row + 1,
                box: box + 1,
              }),
              technique: 'box_line_reduction',
              targetCells: rowCandidates.map(c => [c.row, c.col]),
              detailedExplanation: i18n.t(
                'hints.detailedExplanations.box_line_reduction',
                {
                  techniqueName: i18n.t(
                    'hints.techniqueNames.box_line_reduction'
                  ),
                }
              ),
            },
            confidence: 0.85,
            priority: 3,
            technique: 'box_line_reduction',
            complexity: 2,
          });
        }
      }
    }

    // Check each column to see if a number in that column is confined to one box
    for (let col = 0; col < 9; col++) {
      const colCandidates = candidates.filter(
        c => c.col === col && c.candidates.includes(num)
      );

      if (colCandidates.length >= 2) {
        // Check if all candidates in this column are in the same box
        const boxes = [
          ...new Set(
            colCandidates.map(
              c => Math.floor(c.row / 3) * 3 + Math.floor(c.col / 3)
            )
          ),
        ];

        if (boxes.length === 1) {
          const box = boxes[0];

          hints.push({
            hint: {
              type: 'technique',
              message: i18n.t('hints.messages.boxLineReductionCol', {
                number: num,
                col: col + 1,
                box: box + 1,
              }),
              technique: 'box_line_reduction',
              targetCells: colCandidates.map(c => [c.row, c.col]),
              detailedExplanation: i18n.t(
                'hints.detailedExplanations.box_line_reduction',
                {
                  techniqueName: i18n.t(
                    'hints.techniqueNames.box_line_reduction'
                  ),
                }
              ),
            },
            confidence: 0.85,
            priority: 3,
            technique: 'box_line_reduction',
            complexity: 2,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Check if two cells share the same unit (row, column, or box)
   */
  private sharesSameUnit(cell1: CellCandidate, cell2: CellCandidate): boolean {
    return (
      cell1.row === cell2.row ||
      cell1.col === cell2.col ||
      (Math.floor(cell1.row / 3) === Math.floor(cell2.row / 3) &&
        Math.floor(cell1.col / 3) === Math.floor(cell2.col / 3))
    );
  }

  /**
   * Check if two candidate arrays have exactly one shared candidate
   */
  private hasExactlyOneSharedCandidate(
    candidates1: number[],
    candidates2: number[]
  ): boolean {
    const shared = candidates1.filter(c => candidates2.includes(c));
    return shared.length === 1;
  }

  /**
   * Check if XY-Wing pattern is valid
   */
  private isValidXYWing(
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
      sharedWithPincer1[0] !== sharedWithPincer2[0] &&
      !this.sharesSameUnit(pincer1, pincer2)
    );
  }

  /**
   * Get the elimination candidate for XY-Wing
   */
  private getXYWingEliminationCandidate(
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

  /**
   * Check if three rows form a valid Swordfish pattern
   */
  private checkSwordfishPattern(rows: { row: number; cols: number[] }[]): {
    isValid: boolean;
    columns: number[];
    targetCells: [number, number][];
  } {
    if (rows.length !== 3) {
      return { isValid: false, columns: [], targetCells: [] };
    }

    // Get all unique columns used
    const allCols = new Set<number>();
    rows.forEach(r => r.cols.forEach(c => allCols.add(c)));
    const columns = Array.from(allCols).sort();

    // Swordfish requires exactly 3 columns
    if (columns.length !== 3) {
      return { isValid: false, columns: [], targetCells: [] };
    }

    // Each row must use 2-3 of these columns, and each column must be used by 2-3 rows
    const columnUsage = new Map<number, number>();
    rows.forEach(r => {
      r.cols.forEach(c => {
        columnUsage.set(c, (columnUsage.get(c) || 0) + 1);
      });
    });

    const isValid = columns.every(col => {
      const usage = columnUsage.get(col) || 0;
      return usage >= 2 && usage <= 3;
    });

    const targetCells: [number, number][] = [];
    if (isValid) {
      rows.forEach(r => {
        r.cols.forEach(c => {
          targetCells.push([r.row, c]);
        });
      });
    }

    return { isValid, columns, targetCells };
  }

  /**
   * Get empty cells in a specific row
   */
  private getEmptyCellsInRow(
    board: NumericBoard,
    row: number
  ): [number, number][] {
    const emptyCells: [number, number][] = [];
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
    return emptyCells;
  }

  /**
   * Get empty cells in a specific column
   */
  private getEmptyCellsInColumn(
    board: NumericBoard,
    col: number
  ): [number, number][] {
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
    return emptyCells;
  }

  /**
   * Get empty cells in a specific 3x3 box
   */
  private getEmptyCellsInBox(
    board: NumericBoard,
    boxIndex: number
  ): [number, number][] {
    const emptyCells: [number, number][] = [];
    const startRow = Math.floor(boxIndex / 3) * 3;
    const startCol = (boxIndex % 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }
    return emptyCells;
  }

  /**
   * Remove duplicate hints
   */
  private removeDuplicateHints(hints: HintResult[]): HintResult[] {
    const seen = new Set<string>();
    return hints.filter(hint => {
      const key = this.createHintKey(hint);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Create a unique key for a hint
   */
  private createHintKey(hint: HintResult): string {
    const cells =
      hint.hint.targetCells?.map(c => `${c[0]}-${c[1]}`).join(',') || '';
    return `${hint.technique}-${cells}-${hint.hint.suggestedValue || ''}`;
  }

  /**
   * Prioritize hints based on effectiveness and difficulty
   */
  private prioritizeHints(
    hints: HintResult[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _difficulty: string
  ): HintResult[] {
    return hints.sort((a, b) => {
      // Apply technique weights
      const weightA =
        this.techniqueWeights.get(a.technique as HintTechnique) || 0.5;
      const weightB =
        this.techniqueWeights.get(b.technique as HintTechnique) || 0.5;

      const scoreA = a.priority * a.confidence * weightA;
      const scoreB = b.priority * b.confidence * weightB;

      return scoreB - scoreA;
    });
  }

  /**
   * Get maximum complexity for difficulty level
   */
  private getMaxComplexityForDifficulty(difficulty: string): number {
    const complexityMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
      master: 5,
      grandmaster: 5,
    };
    return complexityMap[difficulty as keyof typeof complexityMap] || 2;
  }

  /**
   * Create fallback hint when no specific hints are available
   */
  private createFallbackHint(): HintResult {
    return {
      hint: {
        type: 'technique',
        message:
          'No obvious hints available. Try examining different areas of the puzzle and look for cells with few possible numbers.',
        technique: 'general_advice',
      },
      confidence: 0.5,
      priority: 1,
      technique: 'candidate_suggestion',
      complexity: 1,
    };
  }
}
