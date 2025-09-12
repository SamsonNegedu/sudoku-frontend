import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  SudokuBoard,
  GameMove,
  Difficulty,
  Hint,
} from '../types';

// Use the new game engine instead of old utils
import { gameEngineService } from '../services/gameEngineService';
import { DifficultyConfigManager } from '../config/difficulty';
import { enableUnlimitedHints } from '../config/systemConfig';

interface GameStore {
  // State
  currentGame: GameState | null;
  isPlaying: boolean;
  selectedCell: { row: number; col: number } | null;
  inputMode: 'pen' | 'pencil';
  isGeneratingPuzzle: boolean;
  showCompletionAnimation: boolean;
  showMistakesModal: boolean;
  isHydrated: boolean; // Track if persisted state has been loaded
  hintHighlights: {
    cells: [number, number][];
    rows: number[];
    columns: number[];
    boxes: number[];
  };
  hintFilledCells: [number, number][];

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
  clearCell: (row: number, col: number) => Promise<void>;
  undoMove: () => void;
  redoMove: () => void;
  getHint: () => Promise<Hint | null>;
  clearHintHighlights: () => void;
  validateMove: (row: number, col: number, value: number) => boolean;
  checkGameCompletion: () => boolean;
  resetGame: () => void;
  setInputMode: (mode: 'pen' | 'pencil') => void;

  // Enhanced validation methods
  validateMoveDetailed: (
    row: number,
    col: number,
    value: number
  ) => Promise<unknown>;
  getCandidates: (row: number, col: number) => Promise<number[]>;
  getBoardValidation: () => Promise<unknown>;

  // Solution validation methods
  validateAgainstSolution: (row: number, col: number, value: number) => boolean;
  updateBoardValidation: () => void;
  getMistakeCount: () => number;
  getPuzzleStats: () => {
    totalCells: number;
    filledCells: number;
    correctCells: number;
    completionPercentage: number;
    accuracy: number;
  } | null;
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
      isHydrated: false,
      hintHighlights: {
        cells: [],
        rows: [],
        columns: [],
        boxes: [],
      },
      hintFilledCells: [],

      // Actions
      startNewGame: (difficulty: Difficulty) => {
        // Set loading state immediately
        set({ isGeneratingPuzzle: true });

        // Use setTimeout to allow UI to update before heavy computation
        setTimeout(async () => {
          try {
            const generatedPuzzle =
              await gameEngineService.generatePuzzle(difficulty);

            const board = createInitialBoard();

            // Populate the board with the generated puzzle
            for (let row = 0; row < 9; row++) {
              for (let col = 0; col < 9; col++) {
                if (generatedPuzzle.puzzle[row][col] !== 0) {
                  board[row][col] = {
                    ...board[row][col],
                    value: generatedPuzzle.puzzle[row][col],
                    isFixed: true,
                  };
                }
              }
            }

            const difficultyConfig =
              DifficultyConfigManager.getConfig(difficulty);

            const newGame: GameState = {
              id: `game_${Date.now()}`,
              board,
              solution: generatedPuzzle.solution,
              difficulty,
              startTime: new Date(),
              currentTime: new Date(),
              isPaused: false,
              isCompleted: false,
              hintsUsed: 0,
              maxHints: difficultyConfig.gameSettings.maxHints,
              attempts: 0,
              maxAttempts: difficultyConfig.gameSettings.maxAttempts,
              moves: [],
              totalPausedTime: 0,
              mistakes: 0,
              maxMistakes: 3, // Default to 3 for now, can be made configurable later
              mistakeLimitDisabled: false,
            };

            set({
              currentGame: newGame,
              isPlaying: true,
              selectedCell: null,
              isGeneratingPuzzle: false,
              showCompletionAnimation: false,
              showMistakesModal: false,
            });
          } catch (error) {
            console.error('Failed to start new game:', error);
            set({ isGeneratingPuzzle: false });
          }
        }, 10);
      },

      restartCurrentGame: () => {
        const state = get();
        if (!state.currentGame) return;

        const board = createInitialBoard();

        // Restore fixed cells from the original puzzle
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

        const restartedGame: GameState = {
          ...state.currentGame,
          board,
          startTime: new Date(),
          currentTime: new Date(),
          isPaused: false,
          isCompleted: false,
          hintsUsed: 0,
          attempts: 0,
          moves: [],
          totalPausedTime: 0,
          mistakes: 0,
          mistakeLimitDisabled: false,
        };

        set({
          currentGame: restartedGame,
          isPlaying: true,
          selectedCell: null,
          showCompletionAnimation: false,
          showMistakesModal: false,
        });
      },

      forceStopGeneration: () => {
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

        set({
          currentGame: {
            ...state.currentGame,
            mistakeLimitDisabled: true,
          },
          showMistakesModal: false,
        });
      },

      pauseGame: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.isPaused) return;

        const now = new Date();
        set({
          currentGame: {
            ...state.currentGame,
            isPaused: true,
            pauseStartTime: now,
            currentTime: now,
          },
          isPlaying: false,
        });
      },

      resumeGame: () => {
        const state = get();
        if (!state.currentGame || !state.currentGame.isPaused) return;

        const now = new Date();
        const pauseStart = state.currentGame.pauseStartTime;
        const pauseDuration = pauseStart
          ? now.getTime() - new Date(pauseStart).getTime()
          : 0;

        set({
          currentGame: {
            ...state.currentGame,
            isPaused: false,
            pauseStartTime: undefined,
            totalPausedTime:
              (state.currentGame.totalPausedTime || 0) + pauseDuration,
            currentTime: now,
          },
          isPlaying: true,
        });
      },

      selectCell: (row: number, col: number) => {
        const state = get();
        if (!state.currentGame) return;

        // Clear previous selection
        const newBoard = state.currentGame.board.map(r =>
          r.map(cell => ({ ...cell, isSelected: false }))
        );

        // Set new selection
        newBoard[row][col].isSelected = true;

        set({
          selectedCell: { row, col },
          currentGame: {
            ...state.currentGame,
            board: newBoard,
          },
        });
      },

      setCellValue: async (row: number, col: number, value: number | null) => {
        const state = get();
        if (!state.currentGame) return;

        const cell = state.currentGame.board[row][col];
        if (cell.isFixed) return;

        // Reset hint tracking when user makes a move
        await gameEngineService.resetHintTracking();

        // Validate move using the game engine
        let isCorrect = true;

        if (value !== null) {
          // Validate move using the game engine (async validation available if needed)
          await gameEngineService.validateMove(
            state.currentGame.board,
            row,
            col,
            value
          );
          // Check correctness against solution
          isCorrect = value === state.currentGame.solution[row][col];
        }

        const newBoard = [...state.currentGame.board];
        const previousValue = cell.value;
        const previousNotes = [...cell.notes];

        // Update cell
        newBoard[row][col] = {
          ...cell,
          value,
          notes: value !== null ? [] : cell.notes, // Clear notes when setting value
          isCorrect: value !== null ? isCorrect : null,
          isIncorrect: value !== null ? !isCorrect : false,
        };

        // If a value was placed (not cleared), remove that number from notes in same row, column, and box
        if (value !== null) {
          // Helper function to get box index
          const getBoxIndex = (r: number, c: number) =>
            Math.floor(r / 3) * 3 + Math.floor(c / 3);
          const boxIndex = getBoxIndex(row, col);

          // Remove notes from same row, column, and box
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              // Skip the cell we just updated
              if (r === row && c === col) continue;

              const currentCell = newBoard[r][c];
              const currentBoxIndex = getBoxIndex(r, c);

              // Check if this cell is in the same row, column, or box
              const isSameRow = r === row;
              const isSameCol = c === col;
              const isSameBox = currentBoxIndex === boxIndex;

              if (
                (isSameRow || isSameCol || isSameBox) &&
                currentCell.notes.includes(value)
              ) {
                // Remove the note from this cell
                newBoard[r][c] = {
                  ...currentCell,
                  notes: currentCell.notes.filter(note => note !== value),
                };
              }
            }
          }
        }

        // Create move record
        const move: GameMove = {
          row,
          col,
          value,
          isNote: false,
          timestamp: new Date(),
          previousValue,
          previousNotes,
        };

        // Handle mistakes
        let newMistakes = state.currentGame.mistakes;
        let showMistakesModal = false;

        if (value !== null && !isCorrect) {
          newMistakes++;
          if (
            !state.currentGame.mistakeLimitDisabled &&
            newMistakes >= state.currentGame.maxMistakes
          ) {
            showMistakesModal = true;
          }
        }

        // Check completion
        const isCompleted = await gameEngineService.isPuzzleComplete(newBoard);

        const updatedGame = {
          ...state.currentGame,
          board: newBoard,
          currentTime: new Date(),
          moves: [...state.currentGame.moves, move],
          mistakes: newMistakes,
          isCompleted,
          attempts: state.currentGame.attempts + 1,
        };

        set({
          currentGame: updatedGame,
          showCompletionAnimation: isCompleted,
          showMistakesModal,
        });
      },

      toggleNote: (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) return;

        const cell = state.currentGame.board[row][col];
        if (cell.isFixed || cell.value !== null) return;

        const newBoard = [...state.currentGame.board];
        const currentNotes = [...cell.notes];

        if (currentNotes.includes(value)) {
          // Remove note
          newBoard[row][col] = {
            ...cell,
            notes: currentNotes.filter(note => note !== value),
          };
        } else {
          // Add note
          newBoard[row][col] = {
            ...cell,
            notes: [...currentNotes, value].sort(),
          };
        }

        set({
          currentGame: {
            ...state.currentGame,
            board: newBoard,
            currentTime: new Date(),
          },
        });
      },

      clearCell: async (row: number, col: number) => {
        const state = get();
        if (!state.currentGame) return;

        const cell = state.currentGame.board[row][col];
        if (cell.isFixed) return;

        // Reset hint tracking when user makes a move
        await gameEngineService.resetHintTracking();

        const newBoard = [...state.currentGame.board];
        const previousValue = cell.value;
        const previousNotes = [...cell.notes];

        newBoard[row][col] = {
          ...cell,
          value: null,
          notes: [],
          isCorrect: null,
          isIncorrect: false,
        };

        const move: GameMove = {
          row,
          col,
          value: null,
          isNote: false,
          timestamp: new Date(),
          previousValue,
          previousNotes,
        };

        set({
          currentGame: {
            ...state.currentGame,
            board: newBoard,
            currentTime: new Date(),
            moves: [...state.currentGame.moves, move],
          },
        });
      },

      undoMove: () => {
        const state = get();
        if (!state.currentGame || state.currentGame.moves.length === 0) return;

        const moves = [...state.currentGame.moves];
        const lastMove = moves.pop()!;
        const { row, col, previousValue, previousNotes } = lastMove;

        const newBoard = [...state.currentGame.board];
        newBoard[row][col] = {
          ...newBoard[row][col],
          value: previousValue,
          notes: [...previousNotes],
          isCorrect:
            previousValue !== null
              ? previousValue === state.currentGame.solution[row][col]
              : null,
          isIncorrect:
            previousValue !== null
              ? previousValue !== state.currentGame.solution[row][col]
              : false,
        };

        set({
          currentGame: {
            ...state.currentGame,
            board: newBoard,
            moves,
            currentTime: new Date(),
          },
        });
      },

      redoMove: () => {
        // TODO: Implement redo functionality
      },

      clearHintHighlights: () => {
        set({
          hintHighlights: {
            cells: [],
            rows: [],
            columns: [],
            boxes: [],
          },
          hintFilledCells: [], // Also clear hint-filled cells when clearing highlights
        });
      },

      getHint: async () => {
        const state = get();

        // Check if we have a current game and enforce hint limits
        // Note: In development mode, unlimited hints are enabled
        // In production mode, hints are limited based on difficulty level
        if (
          !state.currentGame ||
          (!enableUnlimitedHints() &&
            state.currentGame.hintsUsed >= state.currentGame.maxHints)
        ) {
          return null;
        }

        try {
          // Clear any existing highlights at the start
          set({
            hintHighlights: {
              cells: [],
              rows: [],
              columns: [],
              boxes: [],
            },
            hintFilledCells: [],
          });

          // Generate hint using the game engine
          const hintResult = await gameEngineService.generateHint(
            state.currentGame.board,
            state.currentGame.difficulty,
            state.selectedCell
              ? [state.selectedCell.row, state.selectedCell.col]
              : undefined,
            state.currentGame.solution
          );

          if (!hintResult) {
            // Increment hint count even for fallback hints
            const currentState = get();
            const newHintsUsed = currentState.currentGame!.hintsUsed + 1;
            set({
              currentGame: {
                ...currentState.currentGame!,
                hintsUsed: newHintsUsed,
              },
            });

            // Return a helpful fallback if no hints are found
            return {
              type: 'technique' as const,
              message:
                'No obvious hints available. Try looking for cells with the fewest possible numbers, or examine if any numbers appear only once in a row, column, or 3×3 box.',
              technique: 'general_advice',
            };
          }

          // Track auto-fill info but don't execute yet
          let filledCell: [number, number] | null = null;
          const shouldAutoFill =
            hintResult.hint.autoFill &&
            hintResult.hint.targetCells &&
            hintResult.hint.suggestedValue;

          if (shouldAutoFill && hintResult.hint.targetCells) {
            filledCell = hintResult.hint.targetCells[0];
          }

          // Update hints used count and set highlighting
          const currentState = get();
          if (currentState.currentGame) {
            // Calculate highlighting - only highlight target cells for clarity
            const highlights = {
              cells: [] as [number, number][],
              rows: [] as number[], // Keep for future use but don't populate
              columns: [] as number[], // Keep for future use but don't populate
              boxes: [] as number[], // Keep for future use but don't populate
            };

            if (hintResult.hint.targetCells) {
              // Only highlight the specific target cells - no broader area highlighting
              highlights.cells = hintResult.hint.targetCells;
            }

            // Get fresh state right before setting to avoid stale state issues
            const currentState = get();
            const newHintsUsed = currentState.currentGame!.hintsUsed + 1;
            set({
              currentGame: {
                ...currentState.currentGame!,
                hintsUsed: newHintsUsed,
              },
              hintHighlights: highlights,
              hintFilledCells: filledCell ? [filledCell] : [],
            });

            // Execute auto-fill AFTER hint count is incremented
            if (shouldAutoFill && filledCell) {
              const [row, col] = filledCell;
              get().setCellValue(row, col, hintResult.hint.suggestedValue!);
              // Update filled cells state
              set({ hintFilledCells: [filledCell] });
            }
          }

          // Return the actual hint with proper formatting
          return {
            type:
              hintResult.hint.type === 'value'
                ? 'cell'
                : (hintResult.hint.type as 'cell' | 'technique' | 'note'),
            message: hintResult.hint.message,
            technique: hintResult.hint.technique || hintResult.technique,
            targetCells: hintResult.hint.targetCells,
            suggestedValue: hintResult.hint.suggestedValue,
            autoFill: hintResult.hint.autoFill,
            detailedExplanation: hintResult.hint.detailedExplanation,
          };
        } catch {
          // Increment hint count even for error fallback hints
          const currentState = get();
          const newHintsUsed = currentState.currentGame!.hintsUsed + 1;
          set({
            currentGame: {
              ...currentState.currentGame!,
              hintsUsed: newHintsUsed,
            },
          });

          return {
            type: 'technique' as const,
            message:
              'Unable to analyze the board right now. Try examining cells with fewer possible numbers or look for obvious placements.',
            technique: 'error_fallback',
          };
        }
      },

      validateMove: (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) return false;

        // For synchronous compatibility, just check against solution
        return state.currentGame.solution[row][col] === value;
      },

      checkGameCompletion: () => {
        const state = get();
        if (!state.currentGame) return false;

        // Check if all cells are filled correctly
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            const cell = state.currentGame.board[r][c];
            if (
              !cell.value ||
              cell.value !== state.currentGame.solution[r][c]
            ) {
              return false;
            }
          }
        }
        return true;
      },

      resetGame: () => {
        set({
          currentGame: null,
          isPlaying: false,
          selectedCell: null,
          inputMode: 'pen',
          isGeneratingPuzzle: false,
          showCompletionAnimation: false,
          showMistakesModal: false,
        });
      },

      setInputMode: (mode: 'pen' | 'pencil') => {
        set({ inputMode: mode });
      },

      // Enhanced validation methods using game engine
      validateMoveDetailed: async (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) return null;

        try {
          return await gameEngineService.validateMove(
            state.currentGame.board,
            row,
            col,
            value
          );
        } catch {
          return null;
        }
      },

      getCandidates: async (row: number, col: number) => {
        const state = get();
        if (!state.currentGame) return [];

        try {
          return await gameEngineService.getCandidates(
            state.currentGame.board,
            row,
            col
          );
        } catch {
          return [];
        }
      },

      getBoardValidation: async () => {
        const state = get();
        if (!state.currentGame) return null;

        try {
          // For now, just return basic validation
          return {
            isValid: get().checkGameCompletion(),
            completionPercentage:
              get().getPuzzleStats()?.completionPercentage || 0,
          };
        } catch {
          return null;
        }
      },

      // Solution validation methods
      validateAgainstSolution: (row: number, col: number, value: number) => {
        const state = get();
        if (!state.currentGame) return false;
        return state.currentGame.solution[row][col] === value;
      },

      updateBoardValidation: () => {
        const state = get();
        if (!state.currentGame) return;

        const newBoard = state.currentGame.board.map((row, r) =>
          row.map((cell, c) => {
            if (cell.value !== null && !cell.isFixed) {
              const isCorrect =
                cell.value === state.currentGame!.solution[r][c];
              return {
                ...cell,
                isCorrect,
                isIncorrect: !isCorrect,
              };
            }
            return cell;
          })
        );

        set({
          currentGame: {
            ...state.currentGame,
            board: newBoard,
          },
        });
      },

      getMistakeCount: () => {
        const state = get();
        return state.currentGame?.mistakes || 0;
      },

      getPuzzleStats: () => {
        const state = get();
        if (!state.currentGame) return null;

        const totalCells = 81;
        let filledCells = 0;
        let correctCells = 0;

        state.currentGame.board.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell.value !== null) {
              filledCells++;
              if (cell.value === state.currentGame!.solution[r][c]) {
                correctCells++;
              }
            }
          });
        });

        return {
          totalCells,
          filledCells,
          correctCells,
          completionPercentage: (filledCells / totalCells) * 100,
          accuracy: filledCells > 0 ? (correctCells / filledCells) * 100 : 100,
        };
      },

      getCompletedNumbers: () => {
        const state = get();
        if (!state.currentGame) return [];

        const counts = new Array(10).fill(0); // Index 0 unused, 1-9 for numbers

        state.currentGame.board.forEach(row => {
          row.forEach(cell => {
            if (cell.value !== null) {
              counts[cell.value]++;
            }
          });
        });

        return Array.from({ length: 9 }, (_, i) => i + 1).filter(
          num => counts[num] === 9
        );
      },
    }),
    {
      name: 'sudoku-game-store',
      partialize: state => ({
        currentGame: state.currentGame,
        inputMode: state.inputMode,
      }),
      onRehydrateStorage: () => state => {
        // Set hydrated to true when state is restored from storage or when there's no stored state
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
