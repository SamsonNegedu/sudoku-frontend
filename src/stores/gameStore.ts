import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  SudokuBoard,
  GameMove,
  Difficulty,
  Hint,
} from '../types';
import { SudokuValidator } from '../utils/puzzleValidator';
import { SolutionValidator } from '../utils/solutionValidator';
import { SudokuHintGenerator } from '../utils/hintGenerator';
import { DifficultyConfigManager } from '../config/difficulty';

interface GameStore {
  // State
  currentGame: GameState | null;
  isPlaying: boolean;
  selectedCell: { row: number; col: number } | null;
  inputMode: 'pen' | 'pencil';
  isGeneratingPuzzle: boolean;
  showCompletionAnimation: boolean;
  showMistakesModal: boolean;

  // Actions
  startNewGame: (difficulty: Difficulty) => void;
  restartCurrentGame: () => void;
  forceStopGeneration: () => void;
  hideCompletionAnimation: () => void;
  hideMistakesModal: () => void;
  continueWithUnlimitedMistakes: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  selectCell: (row: number, col: number) => void;
  setCellValue: (row: number, col: number, value: number | null) => void;
  toggleNote: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  undoMove: () => void;
  redoMove: () => void;
  useHint: () => Hint | null;
  validateMove: (row: number, col: number, value: number) => boolean;
  checkGameCompletion: () => boolean;
  resetGame: () => void;
  setInputMode: (mode: 'pen' | 'pencil') => void;

  // Enhanced validation methods
  validateMoveDetailed: (row: number, col: number, value: number) => any;
  getCandidates: (row: number, col: number) => any;
  getBoardValidation: () => any;

  // Solution validation methods
  validateAgainstSolution: (row: number, col: number, value: number) => boolean;
  updateBoardValidation: () => void;
  getMistakeCount: () => number;
  getPuzzleStats: () => any;
  getCompletedNumbers: () => number[];
}

// Helper function to create initial board
const createInitialBoard = (): SudokuBoard => {
  const board: SudokuBoard = [];
  for (let row = 0; row < 9; row++) {
    board[row] = [];
    for (let col = 0; col < 9; col++) {
      board[row][col] = {
        value: null,
        notes: [],
        isFixed: false,
        isSelected: false,
        isHighlighted: false,
        isCorrect: null,
        isIncorrect: false,
        row,
        col,
      };
    }
  }
  return board;
};

import { SudokuPuzzleGenerator } from '../utils/puzzleGenerator';
import { enableUnlimitedHints } from '../config/systemConfig';

// Fallback puzzle generator for when main generation times out
const createFallbackPuzzle = (difficulty: Difficulty) => {
  // Use the solution directly for fallback

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

  return createDifficultyBasedPuzzle(baseSolution, difficulty);
};

// Advanced puzzle creation with 3x3 block control
const createDifficultyBasedPuzzle = (
  solution: number[][],
  difficulty: Difficulty
) => {
  const puzzle = solution.map(row => [...row]);

  // 3x3 blocks are handled dynamically in the removal strategy

  // Get difficulty-based constraints from centralized config
  const difficultyConfig = DifficultyConfigManager.getConfig(difficulty);
  const constraints = difficultyConfig.puzzleGeneration;

  // Random target clues within the difficulty range
  const [minClues, maxClues] = constraints.totalClues;
  const targetClues =
    minClues + Math.floor(Math.random() * (maxClues - minClues + 1));
  const targetRemovals = 81 - targetClues;

  // Track clues per block
  const blockClues = new Array(9).fill(9); // Start with 9 clues per block

  // Create varied removal patterns based on distribution strategy
  const createRemovalStrategy = (distribution: string): [number, number][] => {
    const allCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        allCells.push([row, col]);
      }
    }

    switch (distribution) {
      case 'balanced':
        // Evenly distributed removal - shuffle completely
        return shuffleArray(allCells);

      case 'mixed':
        // Favor removing from different blocks in rotation
        const blockOrder = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        const mixedCells: [number, number][] = [];
        blockOrder.forEach(blockIdx => {
          const blockCells = allCells.filter(([row, col]) => {
            const cellBlockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
            return cellBlockIdx === blockIdx;
          });
          mixedCells.push(...shuffleArray(blockCells));
        });
        return mixedCells;

      case 'varied':
        // Create clusters and gaps randomly
        const clusters = Math.floor(Math.random() * 3) + 2; // 2-4 clusters
        const cellsPerCluster = Math.floor(allCells.length / clusters);
        const variedCells = [];

        for (let i = 0; i < clusters; i++) {
          const startIdx = i * cellsPerCluster;
          const endIdx = Math.min(startIdx + cellsPerCluster, allCells.length);
          const clusterCells = allCells.slice(startIdx, endIdx);
          variedCells.push(...shuffleArray(clusterCells));
        }
        return variedCells;

      case 'sparse':
        // Prefer creating sparse blocks - prioritize certain blocks
        const sparsePriority = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        const priorityBlocks = sparsePriority.slice(
          0,
          Math.min(4, sparsePriority.length)
        );

        const priorityCells: [number, number][] = [];
        const normalCells: [number, number][] = [];

        allCells.forEach(([row, col]) => {
          const blockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          if (priorityBlocks.includes(blockIdx)) {
            priorityCells.push([row, col]);
          } else {
            normalCells.push([row, col]);
          }
        });

        return [...shuffleArray(priorityCells), ...shuffleArray(normalCells)];

      case 'minimal':
        // Very sparse - create dramatic variations
        const minimalBlocks = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        const emptyTargets = minimalBlocks.slice(
          0,
          Math.floor(Math.random() * 3) + 2
        );

        const emptyCells: [number, number][] = [];
        const filledCells: [number, number][] = [];

        allCells.forEach(([row, col]) => {
          const blockIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
          if (emptyTargets.includes(blockIdx)) {
            emptyCells.push([row, col]);
          } else {
            filledCells.push([row, col]);
          }
        });

        return [...shuffleArray(emptyCells), ...shuffleArray(filledCells)];

      default:
        return shuffleArray(allCells);
    }
  };

  const removalCandidates = createRemovalStrategy(constraints.pattern);

  let removed = 0;
  let attempts = 0;
  const maxAttempts = targetRemovals * 3; // Prevent infinite loops

  while (removed < targetRemovals && attempts < maxAttempts) {
    attempts++;

    for (const [row, col] of removalCandidates) {
      if (removed >= targetRemovals) break;
      if (puzzle[row][col] === 0) continue; // Already removed

      // Determine which 3x3 block this cell belongs to
      const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      // Check if removing this cell would violate block constraints
      if (blockClues[blockIndex] <= constraints.minCluesPerBlock) {
        continue; // Skip removal to maintain minimum clues per block
      }

      // Count how many blocks would be considered "empty" after this removal
      const wouldBeEmptyBlocks = blockClues.filter(count => count <= 2).length;
      if (
        blockClues[blockIndex] === 3 &&
        wouldBeEmptyBlocks >= constraints.maxEmptyBlocks
      ) {
        continue; // Skip to avoid exceeding empty block limit
      }

      // Remove the number
      puzzle[row][col] = 0;
      blockClues[blockIndex]--;
      removed++;

      if (removed >= targetRemovals) break;
    }

    // If we can't remove enough with constraints, relax them slightly
    if (removed < targetRemovals * 0.8 && attempts > maxAttempts / 2) {
      constraints.minCluesPerBlock = Math.max(
        0,
        constraints.minCluesPerBlock - 1
      );
    }
  }

  // Phase 2: If we still need to remove more, do it more selectively
  if (removed < targetRemovals) {
    const remaining = targetRemovals - removed;
    let extraRemoved = 0;

    for (const [row, col] of removalCandidates) {
      if (extraRemoved >= remaining) break;
      if (puzzle[row][col] === 0) continue;

      puzzle[row][col] = 0;
      extraRemoved++;
    }
  }

  return {
    puzzle,
    solution: solution,
    stats: {
      cluesPlaced: 81 - removed,
      blockDistribution: blockClues,
      difficulty: difficulty,
    },
  };
};

// Utility function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Difficulties that require immediate fallback to avoid performance issues
const FALLBACK_DIFFICULTIES: Difficulty[] = ['expert', 'master', 'grandmaster'];

// Helper function to create a puzzle using the new generation system
const createPuzzle = (
  difficulty: Difficulty
): { puzzle: number[][]; solution: number[][] } => {
  try {
    // For extreme, difficult, and nightmare, use fallback more aggressively
    if (FALLBACK_DIFFICULTIES.includes(difficulty)) {
      console.log(`🎯 Using optimized fallback for ${difficulty} difficulty`);
      const fallbackPuzzle = createFallbackPuzzle(difficulty);
      return {
        puzzle: fallbackPuzzle.puzzle,
        solution: fallbackPuzzle.solution,
      };
    }

    // For easier difficulties, try generation with timeout
    const timeoutMs =
      DifficultyConfigManager.getPuzzleGenerationTimeout(difficulty);
    const startTime = Date.now();
    let generatedPuzzle;

    try {
      generatedPuzzle = SudokuPuzzleGenerator.generatePuzzle(difficulty);

      // Check if generation took too long
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Generation timeout after ${timeoutMs}ms`);
      }
    } catch (timeoutError) {
      console.warn(
        `Puzzle generation timeout for ${difficulty}, using fallback`
      );
      generatedPuzzle = createFallbackPuzzle(difficulty);
    }

    return {
      puzzle: generatedPuzzle.puzzle,
      solution: generatedPuzzle.solution,
    };
  } catch (error) {
    console.warn('Failed to generate puzzle, falling back to sample:', error);

    // Fallback to sample puzzle if generation fails
    const samplePuzzle = [
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

    const sampleSolution = [
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
      puzzle: samplePuzzle,
      solution: sampleSolution,
    };
  }
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentGame: null,
      isPlaying: false,
      selectedCell: null,
      inputMode: 'pen',
      isGeneratingPuzzle: false,
      showCompletionAnimation: false,
      showMistakesModal: false,

      // Actions
      startNewGame: (difficulty: Difficulty) => {
        // Set loading state immediately
        set({ isGeneratingPuzzle: true });

        // Use setTimeout to allow UI to update before heavy computation
        setTimeout(() => {
          try {
            console.log(`Starting ${difficulty} puzzle generation...`);
            const startTime = Date.now();

            // Set a hard timeout for extreme puzzles
            let timeoutReached = false;
            const timeoutMs =
              DifficultyConfigManager.getPuzzleGenerationTimeout(difficulty);

            const timeoutId = setTimeout(() => {
              timeoutReached = true;
              console.warn(
                `⏰ Generation timeout after ${timeoutMs}ms, using fallback`
              );
            }, timeoutMs);

            const { puzzle, solution } = createPuzzle(difficulty);

            clearTimeout(timeoutId);

            if (timeoutReached) {
              console.log('⚠️ Using fallback puzzle due to timeout');
            } else {
              const generationTime = Date.now() - startTime;
              console.log(
                `✅ Generated ${difficulty} puzzle in ${generationTime}ms`
              );
            }
            const board = createInitialBoard();

            // Populate the board with the generated puzzle
            for (let row = 0; row < 9; row++) {
              for (let col = 0; col < 9; col++) {
                if (puzzle[row][col] !== 0) {
                  board[row][col] = {
                    ...board[row][col],
                    value: puzzle[row][col],
                    isFixed: true,
                  };
                }
              }
            }

            const newGame: GameState = {
              id: `game_${Date.now()}`,
              board,
              solution,
              difficulty,
              startTime: new Date(),
              currentTime: new Date(),
              isPaused: false,
              isCompleted: false,
              hintsUsed: 0,
              maxHints:
                DifficultyConfigManager.getConfig(difficulty).gameSettings
                  .maxHints,
              attempts: 0,
              maxAttempts: 5,
              moves: [],
              pauseStartTime: undefined,
              totalPausedTime: 0,
              pausedElapsedTime: undefined,
              mistakes: 0,
              maxMistakes: 3, // Allow 3 mistakes before game over
              mistakeLimitDisabled: false,
            };

            set({
              currentGame: newGame,
              isPlaying: true,
              selectedCell: null,
              isGeneratingPuzzle: false,
            });
          } catch (error) {
            console.error('Failed to generate puzzle:', error);
            set({ isGeneratingPuzzle: false });
          }
        }, 200); // Longer delay to ensure UI updates and spinner shows
      },

      restartCurrentGame: () => {
        const state = get();
        if (!state.currentGame) return;

        // Create a fresh board from the original solution
        const board = createInitialBoard();

        // Populate the board with the fixed cells only (from the original puzzle)
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const originalCell = state.currentGame.board[row][col];
            if (originalCell.isFixed) {
              board[row][col] = {
                ...board[row][col],
                value: originalCell.value,
                isFixed: true,
              };
            }
          }
        }

        // Reset the game state while keeping the same puzzle/solution
        const restartedGame: GameState = {
          ...state.currentGame,
          board,
          startTime: new Date(),
          currentTime: new Date(),
          isPaused: false,
          isCompleted: false,
          hintsUsed: 0,
          moves: [],
          pauseStartTime: undefined,
          totalPausedTime: 0,
          pausedElapsedTime: undefined,
          mistakes: 0,
          mistakeLimitDisabled: false, // Reset mistake limit
        };

        set({
          currentGame: restartedGame,
          isPlaying: true,
          selectedCell: null,
          showMistakesModal: false,
        });
      },

      forceStopGeneration: () => {
        console.log('🛑 Force stopping puzzle generation');
        set({ isGeneratingPuzzle: false });
      },

      hideCompletionAnimation: () => {
        set({ showCompletionAnimation: false });
      },

      hideMistakesModal: () => {
        set({ showMistakesModal: false });
      },

      continueWithUnlimitedMistakes: () => {
        const state = get();
        if (!state.currentGame) return;

        // Disable mistake limit instead of setting arbitrary high number
        const updatedGame: GameState = {
          ...state.currentGame,
          mistakeLimitDisabled: true,
        };

        set({
          currentGame: updatedGame,
          showMistakesModal: false,
        });
      },

      pauseGame: () => {
        const state = get();
        if (!state.currentGame) return; // Don't do anything if no game is active

        try {
          // Calculate current elapsed time to freeze it
          const now = Date.now();
          const startTime =
            state.currentGame.startTime instanceof Date
              ? state.currentGame.startTime
              : new Date(state.currentGame.startTime);
          const startTimeMs = startTime.getTime();
          const currentElapsed = Math.max(
            0,
            Math.floor(
              (now - startTimeMs - state.currentGame.totalPausedTime) / 1000
            )
          );

          set(state => ({
            isPlaying: false,
            currentGame: {
              ...state.currentGame!,
              isPaused: true,
              pauseStartTime: new Date(),
              pausedElapsedTime: currentElapsed,
            },
          }));
        } catch (error) {
          console.error('Error in pauseGame:', error);
          // Fallback: simple pause without elapsed time calculation
          set(state => ({
            isPlaying: false,
            currentGame: {
              ...state.currentGame!,
              isPaused: true,
              pauseStartTime: new Date(),
            },
          }));
        }
      },

      resumeGame: () => {
        const state = get();
        if (!state.currentGame || !state.currentGame.isPaused) return;

        // SIMPLE APPROACH: Set new start time based on paused elapsed time
        const pausedElapsed = state.currentGame.pausedElapsedTime || 0;
        const newStartTime = new Date(Date.now() - pausedElapsed * 1000);

        set(state => ({
          isPlaying: true,
          currentGame: {
            ...state.currentGame!,
            isPaused: false,
            startTime: newStartTime,
            totalPausedTime: 0, // Reset since we're using new start time
            pauseStartTime: undefined,
            pausedElapsedTime: undefined,
          },
        }));
      },

      selectCell: (row: number, col: number) => {
        set({ selectedCell: { row, col } });
      },

      setCellValue: (row: number, col: number, value: number | null) => {
        const state = get();
        if (!state.currentGame) return;

        const board = state.currentGame.board;
        const cell = board[row][col];

        if (cell.isFixed) return;

        const previousValue = cell.value;
        const previousNotes = [...cell.notes];

        // Check if the new value is correct (only for non-null values)
        let isCorrect: boolean | null = null;
        let isIncorrect = false;
        let mistakeCount = state.currentGame.mistakes;

        if (value !== null) {
          isCorrect = SolutionValidator.isInputCorrect(
            state.currentGame.solution,
            row,
            col,
            value
          );
          isIncorrect = !isCorrect;

          // Increment mistake counter if this is a new incorrect value
          if (!isCorrect && previousValue !== value) {
            mistakeCount++;
          }
        }

        // Create new move
        const move: GameMove = {
          row,
          col,
          value,
          isNote: false,
          timestamp: new Date(),
          previousValue,
          previousNotes,
        };

        // Create updated board with proper deep copy and auto-remove notes
        const updatedBoard = board.map((boardRow, r) =>
          boardRow.map((boardCell, c) => {
            if (r === row && c === col) {
              return {
                ...boardCell,
                value,
                notes: [],
                isCorrect,
                isIncorrect,
              };
            }

            // Auto-remove notes when placing a number
            if (value !== null && boardCell.notes.includes(value)) {
              // Check if this cell is in same row, column, or 3x3 block
              const isSameRow = r === row;
              const isSameCol = c === col;
              const isSameBlock =
                Math.floor(r / 3) === Math.floor(row / 3) &&
                Math.floor(c / 3) === Math.floor(col / 3);

              if (isSameRow || isSameCol || isSameBlock) {
                // Remove the placed number from notes
                return {
                  ...boardCell,
                  notes: boardCell.notes.filter(note => note !== value),
                };
              }
            }

            return boardCell;
          })
        );

        // Update game state
        const updatedGame: GameState = {
          ...state.currentGame,
          board: updatedBoard,
          moves: [...state.currentGame.moves, move],
          currentTime: new Date(),
          mistakes: mistakeCount,
        };

        // Check if game is completed using the UPDATED board
        let completionTriggered = false;
        let mistakesModalTriggered = false;

        if (value !== null) {
          // Check completion with the updated board, not the old state!
          const isCompleted = SudokuValidator.isPuzzleComplete(updatedBoard);
          if (isCompleted) {
            updatedGame.isCompleted = true;
            updatedGame.currentTime = new Date(); // Set completion time
            completionTriggered = true;
          }
        }

        // Check if maximum mistakes reached (but not if game is completed or limit disabled)
        if (
          mistakeCount >= updatedGame.maxMistakes &&
          !updatedGame.isCompleted &&
          !updatedGame.mistakeLimitDisabled
        ) {
          mistakesModalTriggered = true;
        }

        set({
          currentGame: updatedGame,
          isPlaying: !updatedGame.isCompleted,
          showCompletionAnimation: completionTriggered,
          showMistakesModal: mistakesModalTriggered,
        });
      },

      toggleNote: (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) return;

        const board = state.currentGame.board;
        const cell = board[row][col];

        if (cell.isFixed) return;

        const previousValue = cell.value;
        const previousNotes = [...cell.notes];

        // Create new move
        const move: GameMove = {
          row,
          col,
          value: null,
          isNote: true,
          timestamp: new Date(),
          previousValue,
          previousNotes,
        };

        // Toggle note
        const newNotes = cell.notes.includes(value)
          ? cell.notes.filter(n => n !== value)
          : [...cell.notes, value];

        // Create updated board with proper deep copy
        const updatedBoard = board.map((boardRow, r) =>
          boardRow.map((boardCell, c) => {
            if (r === row && c === col) {
              return {
                ...boardCell,
                notes: newNotes,
                value: null,
              };
            }
            return boardCell;
          })
        );

        // Update game state
        const updatedGame: GameState = {
          ...state.currentGame,
          board: updatedBoard,
          moves: [...state.currentGame.moves, move],
          currentTime: new Date(),
        };

        set({ currentGame: updatedGame });
      },

      clearCell: (row: number, col: number) => {
        const state = get();
        if (!state.currentGame) return;

        const board = state.currentGame.board;
        const cell = board[row][col];

        if (cell.isFixed) return;

        const previousValue = cell.value;
        const previousNotes = [...cell.notes];

        // Create new move
        const move: GameMove = {
          row,
          col,
          value: null,
          isNote: false,
          timestamp: new Date(),
          previousValue,
          previousNotes,
        };

        // Create updated board with proper deep copy
        const updatedBoard = board.map((boardRow, r) =>
          boardRow.map((boardCell, c) => {
            if (r === row && c === col) {
              return {
                ...boardCell,
                value: null,
                notes: [],
                isCorrect: null,
                isIncorrect: false,
              };
            }
            return boardCell;
          })
        );

        // Update game state
        const updatedGame: GameState = {
          ...state.currentGame,
          board: updatedBoard,
          moves: [...state.currentGame.moves, move],
          currentTime: new Date(),
        };

        set({ currentGame: updatedGame });
      },

      undoMove: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.moves.length === 0) return;

        const moves = [...state.currentGame.moves];
        const lastMove = moves.pop()!;
        const board = state.currentGame.board;

        // Create updated board with proper deep copy
        const updatedBoard = board.map((boardRow, r) =>
          boardRow.map((boardCell, c) => {
            if (r === lastMove.row && c === lastMove.col) {
              return {
                ...boardCell,
                value: lastMove.previousValue,
                notes: lastMove.previousNotes,
                isCorrect: null,
                isIncorrect: false,
              };
            }
            return boardCell;
          })
        );

        const updatedGame: GameState = {
          ...state.currentGame,
          board: updatedBoard,
          moves,
          currentTime: new Date(),
        };

        set({ currentGame: updatedGame });
      },

      redoMove: () => {
        // TODO: Implement redo functionality
        // This would require storing a redo stack
      },

      useHint: () => {
        const state = get();

        if (
          !state.currentGame ||
          (!enableUnlimitedHints() &&
            state.currentGame.hintsUsed >= state.currentGame.maxHints)
        ) {
          return null;
        }

        // Generate intelligent hint based on current board state
        let hint: Hint | null;

        // If a cell is selected, provide contextual hint
        if (state.selectedCell) {
          hint = SudokuHintGenerator.generateContextualHint(
            state.currentGame.board,
            state.selectedCell.row,
            state.selectedCell.col,
            state.currentGame.solution
          );
        } else {
          // Generate general hint for the whole board
          hint = SudokuHintGenerator.generateHint(
            state.currentGame.board,
            state.currentGame.difficulty,
            state.currentGame.solution
          );
        }

        // Fallback if no hint could be generated
        if (!hint) {
          hint = {
            type: 'technique',
            message:
              'Try looking for numbers that can only go in one place, or cells that can only contain one number.',
            technique: 'general_strategy',
          };
        }

        // Handle auto-fill hints
        if (hint.autoFill && hint.targetCells && hint.suggestedValue) {
          const [row, col] = hint.targetCells[0];

          // Auto-fill the cell
          const { setCellValue } = get();
          setCellValue(row, col, hint.suggestedValue);

          // Count as a hint used
          const currentState = get();
          if (currentState.currentGame) {
            const updatedGame: GameState = {
              ...currentState.currentGame,
              hintsUsed: currentState.currentGame.hintsUsed + 1,
            };
            set({ currentGame: updatedGame });
          }
        } else {
          // Only increment hint counter for helpful hints (not confirmations or errors)
          const shouldCountHint =
            hint.technique !== 'confirmation' &&
            hint.technique !== 'cell_selection';

          // Update hints used only if this was a useful hint
          if (shouldCountHint) {
            const updatedGame: GameState = {
              ...state.currentGame,
              hintsUsed: state.currentGame.hintsUsed + 1,
            };
            set({ currentGame: updatedGame });
          }
        }

        return hint;
      },

      validateMove: (row: number, col: number, value: number): boolean => {
        const state = get();
        if (!state.currentGame) return false;

        // Use the enhanced validation system
        const validation = SudokuValidator.validateMove(
          state.currentGame.board,
          row,
          col,
          value
        );
        return validation.isValid;
      },

      // Enhanced validation with detailed feedback
      validateMoveDetailed: (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) {
          return {
            isValid: false,
            conflicts: [],
            isCorrect: false,
            message: 'No active game',
          };
        }

        return SudokuValidator.validateMove(
          state.currentGame.board,
          row,
          col,
          value
        );
      },

      // Get possible candidates for a cell
      getCandidates: (row: number, col: number) => {
        const state = get();
        if (!state.currentGame) return { candidates: [], eliminatedBy: {} };

        const board = state.currentGame.board.map(row =>
          row.map(cell => cell.value || 0)
        );

        return SudokuValidator.getCandidates(board, row, col);
      },

      checkGameCompletion: (): boolean => {
        const state = get();
        if (!state.currentGame) {
          return false;
        }

        // Use the enhanced validation system to check completion
        const isComplete = SudokuValidator.isPuzzleComplete(
          state.currentGame.board
        );

        if (isComplete && !state.currentGame.isCompleted) {
          // Update game state to completed
          const updatedGame: GameState = {
            ...state.currentGame,
            isCompleted: true,
            currentTime: new Date(),
          };

          set({ currentGame: updatedGame, isPlaying: false });
        }

        return isComplete;
      },

      // Get board validation status
      getBoardValidation: () => {
        const state = get();
        if (!state.currentGame) {
          return { isValid: false, errors: [], completionPercentage: 0 };
        }

        return SudokuValidator.validateBoard(state.currentGame.board);
      },

      // Solution validation methods
      validateAgainstSolution: (
        row: number,
        col: number,
        value: number
      ): boolean => {
        const state = get();
        if (!state.currentGame) return false;

        return SolutionValidator.isInputCorrect(
          state.currentGame.solution,
          row,
          col,
          value
        );
      },

      updateBoardValidation: () => {
        const state = get();
        if (!state.currentGame) return;

        const updatedBoard = SolutionValidator.updateBoardValidationStatus(
          state.currentGame.board,
          state.currentGame.solution
        );

        const updatedGame: GameState = {
          ...state.currentGame,
          board: updatedBoard,
        };

        set({ currentGame: updatedGame });
      },

      getMistakeCount: (): number => {
        const state = get();
        return state.currentGame?.mistakes || 0;
      },

      getPuzzleStats: () => {
        const state = get();
        if (!state.currentGame) {
          return {
            progress: 0,
            accuracy: 100,
            mistakes: 0,
            remaining: 81,
          };
        }

        return SolutionValidator.getPuzzleStats(
          state.currentGame.board,
          state.currentGame.solution
        );
      },

      resetGame: () => {
        set({
          currentGame: null,
          isPlaying: false,
          selectedCell: null,
        });
      },

      setInputMode: (mode: 'pen' | 'pencil') => {
        set({ inputMode: mode });
      },

      getCompletedNumbers: () => {
        const state = get();
        if (!state.currentGame) return [];

        // Count occurrences of each number (1-9) on the board
        const numberCounts = new Array(10).fill(0); // Index 0 unused, 1-9 for numbers

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = state.currentGame.board[row][col];
            if (cell.value && cell.value >= 1 && cell.value <= 9) {
              numberCounts[cell.value]++;
            }
          }
        }

        // Return numbers that appear exactly 9 times (completed)
        const completedNumbers: number[] = [];
        for (let i = 1; i <= 9; i++) {
          if (numberCounts[i] === 9) {
            completedNumbers.push(i);
          }
        }

        return completedNumbers;
      },
    }),
    {
      name: 'sudoku-game-storage',
      partialize: state => ({
        currentGame: state.currentGame,
        inputMode: state.inputMode,
      }),
    }
  )
);
