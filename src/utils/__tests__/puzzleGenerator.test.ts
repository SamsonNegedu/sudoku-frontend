import { SudokuPuzzleGenerator } from '../puzzleGenerator';
import { SudokuValidator } from '../puzzleValidator';
import type { Difficulty } from '../../types';

/**
 * Test suite for the puzzle generation system
 * Note: These are basic tests to verify functionality
 */

describe('SudokuPuzzleGenerator', () => {
  const difficulties: Difficulty[] = [
    'easy',
    'medium',
    'hard',
    'difficult',
    'extreme',
  ];

  describe('generatePuzzle', () => {
    it.each(difficulties)('should generate valid %s puzzle', difficulty => {
      const result = SudokuPuzzleGenerator.generatePuzzle(difficulty);

      // Check puzzle structure
      expect(result.puzzle).toHaveLength(9);
      expect(result.solution).toHaveLength(9);
      expect(result.difficulty).toBe(difficulty);

      // Each row should have 9 elements
      result.puzzle.forEach(row => {
        expect(row).toHaveLength(9);
      });

      result.solution.forEach(row => {
        expect(row).toHaveLength(9);
      });

      // Puzzle should be valid
      expect(SudokuValidator.isValidSudokuBoard(result.puzzle)).toBe(true);
      expect(SudokuValidator.isValidSudokuBoard(result.solution)).toBe(true);

      // Solution should be complete
      expect(SudokuValidator.isPuzzleComplete(result.solution)).toBe(true);

      // Puzzle should have appropriate number of clues
      expect(result.clueCount).toBeGreaterThan(0);
      expect(result.clueCount).toBeLessThan(81);

      // Difficulty score should be reasonable
      expect(result.difficultyScore).toBeGreaterThan(0);

      console.log(`Generated ${difficulty} puzzle:`, {
        clues: result.clueCount,
        score: result.difficultyScore,
        techniques: result.techniquesRequired,
      });
    });

    it('should generate different puzzles on subsequent calls', () => {
      const puzzle1 = SudokuPuzzleGenerator.generatePuzzle('medium');
      const puzzle2 = SudokuPuzzleGenerator.generatePuzzle('medium');

      // Puzzles should be different (very high probability)
      const areDifferent = puzzle1.puzzle.some((row, i) =>
        row.some((cell, j) => cell !== puzzle2.puzzle[i][j])
      );

      expect(areDifferent).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should correctly validate moves', () => {
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

      // Valid moves
      expect(SudokuPuzzleGenerator.isValidMove(board, 0, 2, 4)).toBe(true);
      expect(SudokuPuzzleGenerator.isValidMove(board, 1, 1, 7)).toBe(true);

      // Invalid moves
      expect(SudokuPuzzleGenerator.isValidMove(board, 0, 2, 5)).toBe(false); // Row conflict
      expect(SudokuPuzzleGenerator.isValidMove(board, 0, 2, 3)).toBe(false); // Row conflict
      expect(SudokuPuzzleGenerator.isValidMove(board, 0, 2, 9)).toBe(false); // Box conflict
    });
  });

  describe('findConflicts', () => {
    it('should find all conflicts for invalid moves', () => {
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

      // Test row conflict
      const rowConflicts = SudokuPuzzleGenerator.findConflicts(board, 0, 2, 5);
      expect(rowConflicts).toContainEqual([0, 0]); // Conflict with position (0,0)

      // Test valid move (no conflicts)
      const noConflicts = SudokuPuzzleGenerator.findConflicts(board, 0, 2, 4);
      expect(noConflicts).toHaveLength(0);
    });
  });
});
