import type { Difficulty } from '../types';

/**
 * Comprehensive Sudoku Puzzle Generation System
 * Implements backtracking algorithms for puzzle generation and solving
 */

export interface GeneratedPuzzle {
  puzzle: number[][];
  solution: number[][];
  difficulty: Difficulty;
  difficultyScore: number;
  techniquesRequired: string[];
  clueCount: number;
}

/**
 * Main puzzle generator class
 */
export class SudokuPuzzleGenerator {
  private static readonly BOARD_SIZE = 9;
  private static readonly BOX_SIZE = 3;

  /**
   * Generate a complete puzzle with specified difficulty
   */
  static generatePuzzle(
    difficulty: Difficulty,
    attempts: number = 0
  ): GeneratedPuzzle {
    // 1. Generate a complete solved board
    const solution = this.generateSolvedBoard();

    // 2. Create puzzle by removing numbers based on difficulty
    const puzzle = this.createPuzzleFromSolution(solution, difficulty);

    // 3. Final validation: ensure unique solution (critical for puzzle quality)
    if (!this.hasUniqueSolution(puzzle)) {
      if (attempts < 5) {
        console.warn(
          `Generated ${difficulty} puzzle lacks unique solution, regenerating... (attempt ${attempts + 1}/5)`
        );
        return this.generatePuzzle(difficulty, attempts + 1); // Retry generation
      } else {
        console.error(
          `Failed to generate valid ${difficulty} puzzle after 5 attempts, using fallback`
        );
        // Return a basic valid puzzle as fallback
        return this.generateBasicPuzzle(difficulty);
      }
    }

    // 4. Calculate difficulty score and techniques
    const difficultyScore = this.calculateDifficultyScore(puzzle);
    const techniquesRequired = this.getRequiredTechniques(puzzle);
    const clueCount = this.countClues(puzzle);

    return {
      puzzle,
      solution,
      difficulty,
      difficultyScore,
      techniquesRequired,
      clueCount,
    };
  }

  /**
   * Generate a basic fallback puzzle when normal generation fails
   */
  private static generateBasicPuzzle(difficulty: Difficulty): GeneratedPuzzle {
    // Use a simpler, conservative approach for fallback
    const solution = this.generateSolvedBoard();
    const puzzle = solution.map(row => [...row]);

    // Conservative removal counts to ensure solvability
    const conservativeRemovals = {
      easy: 35,
      medium: 45,
      hard: 50,
      difficult: 55,
      extreme: 60,
    };

    const targetRemovals = conservativeRemovals[difficulty] || 45;
    let removed = 0;

    // Simple random removal with frequent uniqueness checks
    while (removed < targetRemovals) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] === 0) continue;

      const originalValue = puzzle[row][col];
      puzzle[row][col] = 0;

      if (!this.hasUniqueSolution(puzzle)) {
        puzzle[row][col] = originalValue;
        continue;
      }

      removed++;
    }

    return {
      puzzle,
      solution,
      difficulty,
      difficultyScore: this.calculateDifficultyScore(puzzle),
      techniquesRequired: this.getRequiredTechniques(puzzle),
      clueCount: this.countClues(puzzle),
    };
  }

  /**
   * Generate a complete valid Sudoku board using backtracking
   */
  private static generateSolvedBoard(): number[][] {
    const board = this.createEmptyBoard();

    // Fill diagonal boxes first for better randomization
    this.fillDiagonalBoxes(board);

    // Fill remaining cells using backtracking
    this.solveBoardBacktrack(board);

    return board;
  }

  /**
   * Create empty 9x9 board
   */
  private static createEmptyBoard(): number[][] {
    return Array(this.BOARD_SIZE)
      .fill(null)
      .map(() => Array(this.BOARD_SIZE).fill(0));
  }

  /**
   * Fill the three diagonal 3x3 boxes
   */
  private static fillDiagonalBoxes(board: number[][]): void {
    for (let box = 0; box < this.BOARD_SIZE; box += this.BOX_SIZE) {
      this.fillBox(board, box, box);
    }
  }

  /**
   * Fill a 3x3 box with random valid numbers
   */
  private static fillBox(board: number[][], row: number, col: number): void {
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        board[row + i][col + j] = numbers[idx++];
      }
    }
  }

  /**
   * Solve board using backtracking algorithm
   */
  private static solveBoardBacktrack(board: number[][]): boolean {
    const emptyCell = this.findEmptyCell(board);
    if (!emptyCell) return true; // Board is complete

    const [row, col] = emptyCell;
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (this.isValidMove(board, row, col, num)) {
        board[row][col] = num;

        if (this.solveBoardBacktrack(board)) {
          return true;
        }

        board[row][col] = 0; // Backtrack
      }
    }

    return false;
  }

  /**
   * Find first empty cell in board
   */
  private static findEmptyCell(board: number[][]): [number, number] | null {
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * Create puzzle by removing numbers from solution with 3x3 block awareness
   */
  private static createPuzzleFromSolution(
    solution: number[][],
    difficulty: Difficulty
  ): number[][] {
    const puzzle = solution.map(row => [...row]);

    // Dynamic difficulty-based constraints with variation
    const constraints = {
      easy: {
        totalClues: [42, 48],
        minCluesPerBlock: 3,
        maxEmptyBlocks: 1,
        pattern: 'balanced',
      },
      medium: {
        totalClues: [32, 38],
        minCluesPerBlock: 2,
        maxEmptyBlocks: 2,
        pattern: 'mixed',
      },
      hard: {
        totalClues: [25, 31],
        minCluesPerBlock: 1,
        maxEmptyBlocks: 3,
        pattern: 'varied',
      },
      difficult: {
        totalClues: [22, 28],
        minCluesPerBlock: 1,
        maxEmptyBlocks: 4,
        pattern: 'sparse',
      },
      extreme: {
        totalClues: [17, 25],
        minCluesPerBlock: 0,
        maxEmptyBlocks: 5,
        pattern: 'minimal',
      },
    };

    const config = constraints[difficulty] || constraints.medium;

    // Random target clues within range for variety
    const [minClues, maxClues] = config.totalClues;
    const targetClues =
      minClues + Math.floor(Math.random() * (maxClues - minClues + 1));
    const targetRemovals = 81 - targetClues;

    // Track clues per 3x3 block (9 blocks total)
    const blockClues = new Array(9).fill(9);

    // Create varied removal patterns for unpredictability
    const createDynamicPattern = (pattern: string) => {
      const allPositions: [number, number][] = [];
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          allPositions.push([row, col]);
        }
      }

      switch (pattern) {
        case 'balanced':
          return this.shuffleArray(allPositions);

        case 'mixed':
          // Rotate through blocks randomly
          const blockIndices = this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
          const mixedPositions: [number, number][] = [];
          blockIndices.forEach(blockIdx => {
            const blockPositions = allPositions.filter(([row, col]) => {
              const cellBlockIdx =
                Math.floor(row / 3) * 3 + Math.floor(col / 3);
              return cellBlockIdx === blockIdx;
            });
            mixedPositions.push(...this.shuffleArray(blockPositions));
          });
          return mixedPositions;

        case 'varied':
          // Create random patterns
          const patterns = ['diagonal', 'corners', 'center', 'edges'];
          const selectedPattern =
            patterns[Math.floor(Math.random() * patterns.length)];

          if (selectedPattern === 'diagonal') {
            const diagonal1 = allPositions.filter(([row, col]) => row === col);
            const diagonal2 = allPositions.filter(
              ([row, col]) => row + col === 8
            );
            const others = allPositions.filter(
              ([row, col]) => row !== col && row + col !== 8
            );
            return [
              ...this.shuffleArray(diagonal1),
              ...this.shuffleArray(diagonal2),
              ...this.shuffleArray(others),
            ];
          }

          return this.shuffleArray(allPositions);

        case 'sparse':
          // Prioritize random blocks for sparsity
          const sparseBlocks = this.shuffleArray([
            0, 1, 2, 3, 4, 5, 6, 7, 8,
          ]).slice(0, 4);
          const sparsePositions: [number, number][] = [];
          const regularPositions: [number, number][] = [];

          allPositions.forEach(([row, col]) => {
            const blockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
            if (sparseBlocks.includes(blockIdx)) {
              sparsePositions.push([row, col]);
            } else {
              regularPositions.push([row, col]);
            }
          });

          return [
            ...this.shuffleArray(sparsePositions),
            ...this.shuffleArray(regularPositions),
          ];

        case 'minimal':
          // Create dramatic variation
          const targetEmpty = Math.floor(Math.random() * 3) + 2; // 2-4 blocks
          const emptyBlocks = this.shuffleArray([
            0, 1, 2, 3, 4, 5, 6, 7, 8,
          ]).slice(0, targetEmpty);
          const emptyPositions: [number, number][] = [];
          const filledPositions: [number, number][] = [];

          allPositions.forEach(([row, col]) => {
            const blockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
            if (emptyBlocks.includes(blockIdx)) {
              emptyPositions.push([row, col]);
            } else {
              filledPositions.push([row, col]);
            }
          });

          return [
            ...this.shuffleArray(emptyPositions),
            ...this.shuffleArray(filledPositions),
          ];

        default:
          return this.shuffleArray(allPositions);
      }
    };

    const positions = createDynamicPattern(config.pattern);

    let removed = 0;
    let attempts = 0;
    const maxAttempts = targetRemovals * 2; // Reduced for performance

    while (removed < targetRemovals && attempts < maxAttempts) {
      attempts++;

      for (const [row, col] of positions) {
        if (removed >= targetRemovals) break;
        if (puzzle[row][col] === 0) continue;

        // Calculate which 3x3 block this cell belongs to
        const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

        // Check block constraints
        if (blockClues[blockIndex] <= config.minCluesPerBlock) {
          continue; // Don't remove if it would violate minimum clues per block
        }

        // Count blocks that would be considered "sparse" (≤2 clues)
        const sparseBlocks = blockClues.filter(count => count <= 2).length;
        if (
          blockClues[blockIndex] === 3 &&
          sparseBlocks >= config.maxEmptyBlocks
        ) {
          continue; // Don't create too many sparse blocks
        }

        const originalValue = puzzle[row][col];
        puzzle[row][col] = 0;

        // Check uniqueness based on difficulty - more frequent for easier puzzles
        const shouldCheckUniqueness = (() => {
          switch (difficulty) {
            case 'easy':
              return removed % 3 === 0; // Check every 3 removals for easy
            case 'medium':
              return removed % 5 === 0; // Check every 5 removals for medium
            case 'hard':
              return removed % 8 === 0; // Check every 8 removals for hard
            case 'difficult':
              return removed % 12 === 0; // Check every 12 removals for difficult
            case 'extreme':
              return removed % 20 === 0 && removed > 40; // Original logic for extreme
            default:
              return removed % 5 === 0;
          }
        })();

        if (shouldCheckUniqueness && !this.hasUniqueSolution(puzzle)) {
          puzzle[row][col] = originalValue;
          continue;
        }

        blockClues[blockIndex]--;
        removed++;
        if (removed >= targetRemovals) break;
      }

      // Relax constraints if we're stuck
      if (removed < targetRemovals * 0.9 && attempts > maxAttempts / 2) {
        config.minCluesPerBlock = Math.max(0, config.minCluesPerBlock - 1);
      }
    }

    // Log block distribution for debugging with variety info
    console.log(
      `${difficulty} puzzle (${config.pattern} pattern) - Block distribution:`,
      blockClues
    );
    console.log(
      `Total clues: ${81 - removed}, Target range: ${config.totalClues[0]}-${config.totalClues[1]}`
    );

    return puzzle;
  }

  /**
   * Check if puzzle has exactly one solution
   */
  private static hasUniqueSolution(puzzle: number[][]): boolean {
    const testBoard = puzzle.map(row => [...row]);
    let solutionCount = 0;

    const countSolutions = (board: number[][]): void => {
      if (solutionCount > 1) return; // Early exit if multiple solutions found

      const emptyCell = this.findEmptyCell(board);
      if (!emptyCell) {
        solutionCount++;
        return;
      }

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
        if (this.isValidMove(board, row, col, num)) {
          board[row][col] = num;
          countSolutions(board);
          board[row][col] = 0;
        }
      }
    };

    countSolutions(testBoard);
    return solutionCount === 1;
  }

  /**
   * Validate if a move is legal according to Sudoku rules
   */
  public static isValidMove(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): boolean {
    // Check row
    for (let c = 0; c < this.BOARD_SIZE; c++) {
      if (c !== col && board[row][c] === value) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < this.BOARD_SIZE; r++) {
      if (r !== row && board[r][col] === value) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let r = boxRow; r < boxRow + this.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + this.BOX_SIZE; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Find all conflicts for a given move
   */
  public static findConflicts(
    board: number[][],
    row: number,
    col: number,
    value: number
  ): [number, number][] {
    const conflicts: [number, number][] = [];

    // Check row conflicts
    for (let c = 0; c < this.BOARD_SIZE; c++) {
      if (c !== col && board[row][c] === value) {
        conflicts.push([row, c]);
      }
    }

    // Check column conflicts
    for (let r = 0; r < this.BOARD_SIZE; r++) {
      if (r !== row && board[r][col] === value) {
        conflicts.push([r, col]);
      }
    }

    // Check 3x3 box conflicts
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let r = boxRow; r < boxRow + this.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + this.BOX_SIZE; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          conflicts.push([r, c]);
        }
      }
    }

    return conflicts;
  }

  /**
   * Calculate difficulty score based on required solving techniques
   */
  private static calculateDifficultyScore(puzzle: number[][]): number {
    let score = 0;
    const board = puzzle.map(row => [...row]);

    // Count empty cells (basic difficulty indicator)
    const emptyCells = this.countEmptyCells(board);
    score += emptyCells * 2;

    // Check for techniques required
    if (this.requiresSingleCandidate(board)) score += 10;
    if (this.requiresHiddenSingles(board)) score += 15;
    if (this.requiresNakedPairs(board)) score += 25;
    if (this.requiresPointingPairs(board)) score += 30;
    if (this.requiresBoxLineReduction(board)) score += 35;

    return score;
  }

  /**
   * Get required solving techniques for puzzle
   */
  private static getRequiredTechniques(puzzle: number[][]): string[] {
    const techniques: string[] = [];
    const board = puzzle.map(row => [...row]);

    if (this.requiresSingleCandidate(board))
      techniques.push('Single Candidate');
    if (this.requiresHiddenSingles(board)) techniques.push('Hidden Singles');
    if (this.requiresNakedPairs(board)) techniques.push('Naked Pairs');
    if (this.requiresPointingPairs(board)) techniques.push('Pointing Pairs');
    if (this.requiresBoxLineReduction(board))
      techniques.push('Box Line Reduction');

    return techniques;
  }

  // Technique detection methods (simplified implementations)
  private static requiresSingleCandidate(board: number[][]): boolean {
    // Check if there are cells with only one possible candidate
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          const candidates = this.getCandidates(board, row, col);
          if (candidates.length === 1) return true;
        }
      }
    }
    return false;
  }

  private static requiresHiddenSingles(board: number[][]): boolean {
    // Simplified: check if any number appears only once in row/col/box candidates
    return this.countEmptyCells(board) > 40;
  }

  private static requiresNakedPairs(board: number[][]): boolean {
    // Simplified: check based on empty cells count
    return this.countEmptyCells(board) > 50;
  }

  private static requiresPointingPairs(board: number[][]): boolean {
    // Simplified: check based on empty cells count
    return this.countEmptyCells(board) > 55;
  }

  private static requiresBoxLineReduction(board: number[][]): boolean {
    // Simplified: check based on empty cells count
    return this.countEmptyCells(board) > 60;
  }

  /**
   * Get possible candidates for a cell
   */
  private static getCandidates(
    board: number[][],
    row: number,
    col: number
  ): number[] {
    const candidates: number[] = [];

    for (let num = 1; num <= 9; num++) {
      if (this.isValidMove(board, row, col, num)) {
        candidates.push(num);
      }
    }

    return candidates;
  }

  /**
   * Count empty cells in board
   */
  private static countEmptyCells(board: number[][]): number {
    let count = 0;
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] === 0) count++;
      }
    }
    return count;
  }

  /**
   * Count filled cells (clues) in board
   */
  private static countClues(board: number[][]): number {
    return this.BOARD_SIZE * this.BOARD_SIZE - this.countEmptyCells(board);
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
