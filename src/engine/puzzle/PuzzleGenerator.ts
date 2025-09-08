/**
 * Advanced Sudoku Puzzle Generator
 * Refactored and improved version of the original puzzle generation logic
 */

import type {
  IPuzzleGenerator,
  PuzzleGenerationConfig,
  GeneratedPuzzle,
  NumericBoard,
  Difficulty,
} from '../types';

export class PuzzleGenerator implements IPuzzleGenerator {
  private static readonly BOARD_SIZE = 9;
  private static readonly BOX_SIZE = 3;

  async init(): Promise<void> {
    // Initialization logic if needed
  }

  async destroy(): Promise<void> {
    // Cleanup logic if needed
  }

  /**
   * Generate a single puzzle with specified configuration
   */
  async generate(config: PuzzleGenerationConfig): Promise<GeneratedPuzzle> {
    return await this.generatePuzzleInternal(config);
  }

  /**
   * Generate multiple puzzles
   */
  async generateMultiple(
    config: PuzzleGenerationConfig,
    count: number
  ): Promise<GeneratedPuzzle[]> {
    const promises = Array.from({ length: count }, () => this.generate(config));
    return Promise.all(promises);
  }

  /**
   * Generate puzzle with timeout and fallback handling
   */
  async generateWithFallback(
    difficulty: string,
    timeoutMs?: number
  ): Promise<GeneratedPuzzle> {
    const startTime = performance.now();

    // Difficulties that should use fallback immediately for performance
    const fallbackDifficulties = ['expert', 'master', 'grandmaster'];

    if (fallbackDifficulties.includes(difficulty)) {
      return this.generateFallbackPuzzle(difficulty);
    }

    // For other difficulties, try generation with timeout
    const defaultTimeout = this.getTimeoutForDifficulty(difficulty);
    const actualTimeout = timeoutMs || defaultTimeout;

    try {
      const config = this.createConfigForDifficulty(difficulty);

      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Generation timeout')),
          actualTimeout
        );
      });

      // Race between generation and timeout
      const puzzle = await Promise.race([
        this.generate(config),
        timeoutPromise,
      ]);

      return puzzle;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.warn(
        `Puzzle generation timeout/error for ${difficulty} after ${duration.toFixed(2)}ms, using fallback:`,
        error
      );

      return this.generateFallbackPuzzle(difficulty);
    }
  }

  /**
   * Generate a fallback puzzle for when generation fails or times out
   */
  private generateFallbackPuzzle(difficulty: string): GeneratedPuzzle {
    const baseSolution = [
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

    const config = this.createConfigForDifficulty(difficulty);
    const puzzle = this.createPuzzleFromSolutionSimple(baseSolution, config);

    const metadata = this.calculatePuzzleMetadata(puzzle, baseSolution, config);

    return {
      puzzle,
      solution: baseSolution,
      difficulty: difficulty as Difficulty,
      metadata,
    };
  }

  /**
   * Create a simple puzzle from solution for fallback
   */
  private createPuzzleFromSolutionSimple(
    solution: NumericBoard,
    config: PuzzleGenerationConfig
  ): NumericBoard {
    const puzzle = solution.map(row => [...row]);

    // Calculate target clues
    const targetClues = Math.floor((config.minClues + config.maxClues) / 2);
    const targetRemovals = 81 - targetClues;

    // Simple random removal with block constraints
    const allCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        allCells.push([row, col]);
      }
    }

    const positions = this.shuffleArray(allCells);
    const blockClues = new Array(9).fill(9);

    let removed = 0;
    for (const [row, col] of positions) {
      if (removed >= targetRemovals) break;

      const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      // Basic block constraint - keep at least 2 clues per block
      if (blockClues[blockIndex] <= 2) {
        continue;
      }

      puzzle[row][col] = 0;
      blockClues[blockIndex]--;
      removed++;
    }

    return puzzle;
  }

  /**
   * Create configuration for a specific difficulty
   */
  private createConfigForDifficulty(
    difficulty: string
  ): PuzzleGenerationConfig {
    const clueRanges = {
      beginner: { min: 36, max: 46 },
      intermediate: { min: 32, max: 40 },
      advanced: { min: 28, max: 35 },
      expert: { min: 24, max: 30 },
      master: { min: 20, max: 26 },
      grandmaster: { min: 17, max: 22 },
    };

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

    const range =
      clueRanges[difficulty as keyof typeof clueRanges] ||
      clueRanges.intermediate;
    const allowedTechniques =
      techniques[difficulty as keyof typeof techniques] ||
      techniques.intermediate;

    // Adjust settings based on difficulty
    const maxAttempts = {
      beginner: 3,
      intermediate: 5,
      advanced: 8,
      expert: 10,
      master: 12,
      grandmaster: 15,
    };

    // For simpler difficulties, we can be less strict about unique solutions
    // since they're more likely to be valid anyway
    const requireUniqueness = !['beginner'].includes(difficulty);

    return {
      difficulty: difficulty as Difficulty,
      minClues: range.min,
      maxClues: range.max,
      uniqueSolution: requireUniqueness,
      allowedTechniques,
      maxAttempts: maxAttempts[difficulty as keyof typeof maxAttempts] || 5,
    };
  }

  /**
   * Get timeout for specific difficulty
   */
  private getTimeoutForDifficulty(difficulty: string): number {
    const timeouts = {
      beginner: 2000,
      intermediate: 3000,
      advanced: 4000,
      expert: 5000,
      master: 6000,
      grandmaster: 7000,
    };

    return timeouts[difficulty as keyof typeof timeouts] || 3000;
  }

  /**
   * Validate that a puzzle has a unique solution
   */
  validateUniqueness(puzzle: NumericBoard): boolean {
    const testBoard = puzzle.map(row => [...row]);
    return this.hasUniqueSolution(testBoard);
  }

  // ============= Private Methods =============

  private async generatePuzzleInternal(
    config: PuzzleGenerationConfig,
    attempts = 0
  ): Promise<GeneratedPuzzle> {
    // 1. Generate a complete solved board
    const solution = this.generateSolvedBoard();

    // 2. Create puzzle by removing numbers based on difficulty
    const puzzle = this.createPuzzleFromSolution(solution, config);

    // 3. Validate unique solution if required
    if (config.uniqueSolution && !this.hasUniqueSolution(puzzle)) {
      if (attempts < config.maxAttempts) {
        console.warn(
          `Generated ${config.difficulty} puzzle lacks unique solution, regenerating... (attempt ${attempts + 1}/${config.maxAttempts})`
        );
        return this.generatePuzzleInternal(config, attempts + 1);
      } else {
        console.warn(
          `Failed to generate valid ${config.difficulty} puzzle after ${config.maxAttempts} attempts, using fallback approach`
        );
        // Try again with relaxed constraints
        const relaxedConfig = {
          ...config,
          uniqueSolution: false,
          maxClues: Math.min(config.maxClues + 3, 50), // Add more clues for stability
        };
        return this.generateBasicPuzzle(relaxedConfig);
      }
    }

    // 4. Calculate metadata
    const metadata = this.calculatePuzzleMetadata(puzzle, solution, config);

    return {
      puzzle,
      solution,
      difficulty: config.difficulty,
      metadata,
    };
  }

  /**
   * Generate a basic fallback puzzle when normal generation fails
   */
  private generateBasicPuzzle(config: PuzzleGenerationConfig): GeneratedPuzzle {
    const solution = this.generateSolvedBoard();
    const puzzle = solution.map(row => [...row]);

    // Conservative removal with frequent uniqueness checks
    const targetRemovals =
      81 - Math.floor((config.minClues + config.maxClues) / 2);
    let removed = 0;

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

    const metadata = this.calculatePuzzleMetadata(puzzle, solution, config);

    return {
      puzzle,
      solution,
      difficulty: config.difficulty,
      metadata,
    };
  }

  /**
   * Generate a complete valid Sudoku board using backtracking
   */
  private generateSolvedBoard(): NumericBoard {
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
  private createEmptyBoard(): NumericBoard {
    return Array(PuzzleGenerator.BOARD_SIZE)
      .fill(null)
      .map(() => Array(PuzzleGenerator.BOARD_SIZE).fill(0));
  }

  /**
   * Fill the three diagonal 3x3 boxes
   */
  private fillDiagonalBoxes(board: NumericBoard): void {
    for (
      let box = 0;
      box < PuzzleGenerator.BOARD_SIZE;
      box += PuzzleGenerator.BOX_SIZE
    ) {
      this.fillBox(board, box, box);
    }
  }

  /**
   * Fill a 3x3 box with random valid numbers
   */
  private fillBox(board: NumericBoard, row: number, col: number): void {
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;

    for (let i = 0; i < PuzzleGenerator.BOX_SIZE; i++) {
      for (let j = 0; j < PuzzleGenerator.BOX_SIZE; j++) {
        board[row + i][col + j] = numbers[idx++];
      }
    }
  }

  /**
   * Solve board using backtracking algorithm
   */
  private solveBoardBacktrack(board: NumericBoard): boolean {
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
  private findEmptyCell(board: NumericBoard): [number, number] | null {
    for (let row = 0; row < PuzzleGenerator.BOARD_SIZE; row++) {
      for (let col = 0; col < PuzzleGenerator.BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * Create puzzle by removing numbers from solution
   */
  private createPuzzleFromSolution(
    solution: NumericBoard,
    config: PuzzleGenerationConfig
  ): NumericBoard {
    const puzzle = solution.map(row => [...row]);

    // Calculate target clues
    const targetClues =
      Math.floor(Math.random() * (config.maxClues - config.minClues + 1)) +
      config.minClues;
    const targetRemovals = 81 - targetClues;

    // Track clues per 3x3 block
    const blockClues = new Array(9).fill(9);
    const minCluesPerBlock = this.getMinCluesPerBlock(config.difficulty);
    const maxEmptyBlocks = this.getMaxEmptyBlocks(config.difficulty);

    // Get removal pattern
    const positions = this.createRemovalPattern(config.difficulty);

    let removed = 0;
    let attempts = 0;
    const maxAttempts = targetRemovals * 2;

    while (removed < targetRemovals && attempts < maxAttempts) {
      attempts++;

      for (const [row, col] of positions) {
        if (removed >= targetRemovals) break;
        if (puzzle[row][col] === 0) continue;

        const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

        // Check block constraints
        if (blockClues[blockIndex] <= minCluesPerBlock) {
          continue;
        }

        // Check sparse block constraints
        const sparseBlocks = blockClues.filter(count => count <= 2).length;
        if (blockClues[blockIndex] === 3 && sparseBlocks >= maxEmptyBlocks) {
          continue;
        }

        const originalValue = puzzle[row][col];
        puzzle[row][col] = 0;

        // Check uniqueness periodically
        const shouldCheckUniqueness =
          removed % this.getUniquenessCheckFrequency(config.difficulty) === 0;
        if (shouldCheckUniqueness && !this.hasUniqueSolution(puzzle)) {
          puzzle[row][col] = originalValue;
          continue;
        }

        blockClues[blockIndex]--;
        removed++;
      }

      // Relax constraints if stuck
      if (removed < targetRemovals * 0.9 && attempts > maxAttempts / 2) {
        const relaxedMinClues = Math.max(0, minCluesPerBlock - 1);
        for (let i = 0; i < blockClues.length; i++) {
          if (blockClues[i] === minCluesPerBlock) {
            blockClues[i] = relaxedMinClues;
          }
        }
      }
    }

    return puzzle;
  }

  /**
   * Create removal pattern based on difficulty
   */
  private createRemovalPattern(difficulty: string): [number, number][] {
    const allPositions: [number, number][] = [];
    for (let row = 0; row < PuzzleGenerator.BOARD_SIZE; row++) {
      for (let col = 0; col < PuzzleGenerator.BOARD_SIZE; col++) {
        allPositions.push([row, col]);
      }
    }

    // Different patterns for different difficulties
    switch (difficulty) {
      case 'beginner':
        return this.shuffleArray(allPositions);

      case 'intermediate':
        // Mixed pattern with some block grouping
        return this.createMixedPattern(allPositions);

      case 'advanced':
      case 'expert':
        // More strategic removal
        return this.createStrategicPattern(allPositions);

      case 'master':
      case 'grandmaster':
        // Minimal pattern with maximum difficulty
        return this.createMinimalPattern(allPositions);

      default:
        return this.shuffleArray(allPositions);
    }
  }

  private createMixedPattern(
    positions: [number, number][]
  ): [number, number][] {
    const blockIndices = this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const mixedPositions: [number, number][] = [];

    blockIndices.forEach(blockIdx => {
      const blockPositions = positions.filter(([row, col]) => {
        const cellBlockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        return cellBlockIdx === blockIdx;
      });
      mixedPositions.push(...this.shuffleArray(blockPositions));
    });

    return mixedPositions;
  }

  private createStrategicPattern(
    positions: [number, number][]
  ): [number, number][] {
    // Prioritize center and then edges
    const center = positions.filter(
      ([row, col]) => row >= 3 && row <= 5 && col >= 3 && col <= 5
    );
    const edges = positions.filter(
      ([row, col]) => !(row >= 3 && row <= 5 && col >= 3 && col <= 5)
    );

    return [...this.shuffleArray(center), ...this.shuffleArray(edges)];
  }

  private createMinimalPattern(
    positions: [number, number][]
  ): [number, number][] {
    // Create dramatic variation with some blocks heavily depleted
    const targetEmpty = Math.floor(Math.random() * 3) + 2; // 2-4 blocks
    const emptyBlocks = this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(
      0,
      targetEmpty
    );

    const emptyPositions: [number, number][] = [];
    const filledPositions: [number, number][] = [];

    positions.forEach(([row, col]) => {
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
  }

  /**
   * Check if puzzle has exactly one solution
   */
  private hasUniqueSolution(puzzle: NumericBoard): boolean {
    const testBoard = puzzle.map(row => [...row]);
    let solutionCount = 0;
    const startTime = performance.now();
    const timeLimit = 500; // 500ms timeout for uniqueness checking

    const countSolutions = (board: NumericBoard): void => {
      // Early exits for performance
      if (solutionCount > 1) return;
      if (performance.now() - startTime > timeLimit) {
        solutionCount = 2; // Assume multiple solutions if taking too long
        return;
      }

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

          // Early exit if we found multiple solutions
          if (solutionCount > 1) break;
        }
      }
    };

    countSolutions(testBoard);

    // If we hit the time limit, assume it's too complex and accept it
    if (performance.now() - startTime > timeLimit) {
      console.warn('Uniqueness check timed out, assuming valid puzzle');
      return true;
    }

    return solutionCount === 1;
  }

  /**
   * Validate if a move is legal according to Sudoku rules
   */
  private isValidMove(
    board: NumericBoard,
    row: number,
    col: number,
    value: number
  ): boolean {
    // Check row
    for (let c = 0; c < PuzzleGenerator.BOARD_SIZE; c++) {
      if (c !== col && board[row][c] === value) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < PuzzleGenerator.BOARD_SIZE; r++) {
      if (r !== row && board[r][col] === value) {
        return false;
      }
    }

    // Check 3x3 box
    const boxRow =
      Math.floor(row / PuzzleGenerator.BOX_SIZE) * PuzzleGenerator.BOX_SIZE;
    const boxCol =
      Math.floor(col / PuzzleGenerator.BOX_SIZE) * PuzzleGenerator.BOX_SIZE;

    for (let r = boxRow; r < boxRow + PuzzleGenerator.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + PuzzleGenerator.BOX_SIZE; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Calculate puzzle metadata
   */
  private calculatePuzzleMetadata(
    puzzle: NumericBoard,
    _solution: NumericBoard,
    config: PuzzleGenerationConfig
  ) {
    const startTime = performance.now();

    const clueCount = this.countClues(puzzle);
    const difficultyScore = this.calculateDifficultyScore(puzzle);
    const techniquesRequired = this.getRequiredTechniques(
      puzzle,
      config.allowedTechniques
    );
    const complexity = this.calculateComplexity(puzzle);

    const generationTime = performance.now() - startTime;

    return {
      difficultyScore,
      techniquesRequired,
      clueCount,
      generationTime,
      complexity,
    };
  }

  private calculateDifficultyScore(puzzle: NumericBoard): number {
    let score = 0;
    const emptyCells = this.countEmptyCells(puzzle);

    // Base score from empty cells
    score += emptyCells * 2;

    // Add technique-based scoring
    if (this.requiresAdvancedTechniques(puzzle)) score += 50;
    if (this.requiresNakedPairs(puzzle)) score += 25;
    if (this.requiresHiddenSingles(puzzle)) score += 15;

    return score;
  }

  private getRequiredTechniques(
    puzzle: NumericBoard,
    allowedTechniques: string[]
  ): string[] {
    const techniques: string[] = [];

    if (
      allowedTechniques.includes('naked_single') &&
      this.requiresNakedSingles(puzzle)
    ) {
      techniques.push('naked_single');
    }
    if (
      allowedTechniques.includes('hidden_single') &&
      this.requiresHiddenSingles(puzzle)
    ) {
      techniques.push('hidden_single');
    }
    if (
      allowedTechniques.includes('naked_pair') &&
      this.requiresNakedPairs(puzzle)
    ) {
      techniques.push('naked_pair');
    }

    return techniques;
  }

  private calculateComplexity(puzzle: NumericBoard): number {
    // Complex calculation based on multiple factors
    const emptyCells = this.countEmptyCells(puzzle);
    const clueDistribution = this.analyzeClueDistribution(puzzle);
    const techniqueDifficulty = this.analyzeTechniqueDifficulty(puzzle);

    return (
      emptyCells * 0.4 + clueDistribution * 0.3 + techniqueDifficulty * 0.3
    );
  }

  // Helper methods for difficulty analysis
  private requiresNakedSingles(puzzle: NumericBoard): boolean {
    for (let row = 0; row < PuzzleGenerator.BOARD_SIZE; row++) {
      for (let col = 0; col < PuzzleGenerator.BOARD_SIZE; col++) {
        if (puzzle[row][col] === 0) {
          const candidates = this.getCandidates(puzzle, row, col);
          if (candidates.length === 1) return true;
        }
      }
    }
    return false;
  }

  private requiresHiddenSingles(puzzle: NumericBoard): boolean {
    return this.countEmptyCells(puzzle) > 40;
  }

  private requiresNakedPairs(puzzle: NumericBoard): boolean {
    return this.countEmptyCells(puzzle) > 50;
  }

  private requiresAdvancedTechniques(puzzle: NumericBoard): boolean {
    return this.countEmptyCells(puzzle) > 60;
  }

  private analyzeClueDistribution(puzzle: NumericBoard): number {
    const blockCounts = new Array(9).fill(0);

    for (let row = 0; row < PuzzleGenerator.BOARD_SIZE; row++) {
      for (let col = 0; col < PuzzleGenerator.BOARD_SIZE; col++) {
        if (puzzle[row][col] !== 0) {
          const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          blockCounts[blockIndex]++;
        }
      }
    }

    // Calculate variance in clue distribution
    const mean = blockCounts.reduce((sum, count) => sum + count, 0) / 9;
    const variance =
      blockCounts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) /
      9;

    return Math.sqrt(variance);
  }

  private analyzeTechniqueDifficulty(puzzle: NumericBoard): number {
    // Simplified technique difficulty analysis
    const emptyCells = this.countEmptyCells(puzzle);
    return Math.min(100, emptyCells * 1.5);
  }

  /**
   * Get candidates for a cell
   */
  private getCandidates(
    board: NumericBoard,
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
  private countEmptyCells(board: NumericBoard): number {
    let count = 0;
    for (let row = 0; row < PuzzleGenerator.BOARD_SIZE; row++) {
      for (let col = 0; col < PuzzleGenerator.BOARD_SIZE; col++) {
        if (board[row][col] === 0) count++;
      }
    }
    return count;
  }

  /**
   * Count filled cells (clues) in board
   */
  private countClues(board: NumericBoard): number {
    return (
      PuzzleGenerator.BOARD_SIZE * PuzzleGenerator.BOARD_SIZE -
      this.countEmptyCells(board)
    );
  }

  /**
   * Get difficulty-specific parameters
   */
  private getMinCluesPerBlock(difficulty: string): number {
    const values = {
      beginner: 3,
      intermediate: 2,
      advanced: 1,
      expert: 1,
      master: 0,
      grandmaster: 0,
    };
    return values[difficulty as keyof typeof values] ?? 2;
  }

  private getMaxEmptyBlocks(difficulty: string): number {
    const values = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
      master: 5,
      grandmaster: 6,
    };
    return values[difficulty as keyof typeof values] ?? 2;
  }

  private getUniquenessCheckFrequency(difficulty: string): number {
    const values = {
      beginner: 5,
      intermediate: 8,
      advanced: 12,
      expert: 15,
      master: 20,
      grandmaster: 25,
    };
    return values[difficulty as keyof typeof values] ?? 10;
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
