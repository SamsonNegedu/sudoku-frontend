import { useGameStore } from '../stores/gameStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import type { Difficulty, SudokuBoard, GameAnalytics } from '../types';

/**
 * Test utilities for simulating game scenarios
 */

export const createMockPuzzle = (
  difficulty: Difficulty = 'easy'
): {
  puzzle: SudokuBoard;
  solution: SudokuBoard;
} => {
  // Simple test puzzle for automation
  const puzzle: SudokuBoard = [
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

  const solution: SudokuBoard = [
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

  return { puzzle, solution };
};

export const simulateGameStart = (difficulty: Difficulty = 'medium') => {
  const { puzzle, solution } = createMockPuzzle(difficulty);
  const gameStore = useGameStore.getState();
  const analyticsStore = useAnalyticsStore.getState();

  // Start a new game
  gameStore.startNewGame(difficulty);

  // Initialize analytics
  analyticsStore.initializeUser();

  const currentGame = useGameStore.getState().currentGame;
  if (currentGame) {
    analyticsStore.startGameRecording(currentGame.id, difficulty);
  }

  return { puzzle, solution, gameId: currentGame?.id };
};

export const simulateMove = (
  row: number,
  col: number,
  value: number,
  isCorrect: boolean = true
) => {
  const gameStore = useGameStore.getState();
  const analyticsStore = useAnalyticsStore.getState();

  // Select cell and make move
  gameStore.selectCell(row, col);
  if (isCorrect) {
    gameStore.updateCell(row, col, value);
  } else {
    // Simulate an incorrect move
    gameStore.updateCell(row, col, value);
    // The validation will mark it as incorrect
  }

  // Record in analytics
  analyticsStore.recordCellSelection({ row, col }, value, isCorrect, false);
};

export const simulateGameCompletion = (withMistakes: boolean = false) => {
  const gameStore = useGameStore.getState();
  const analyticsStore = useAnalyticsStore.getState();

  const { solution } = createMockPuzzle();

  // Fill the board with correct solution
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const currentBoard = gameStore.currentGame?.currentBoard;
      if (currentBoard && currentBoard[row][col] === 0) {
        if (withMistakes && Math.random() < 0.1) {
          // 10% chance of making a mistake first
          simulateMove(row, col, (solution[row][col] % 9) + 1, false);
          // Then correct it
          simulateMove(row, col, solution[row][col], true);
        } else {
          simulateMove(row, col, solution[row][col], true);
        }
      }
    }
  }

  // Complete the game
  gameStore.completeGame();
  analyticsStore.recordGameCompletion(true);
};

export const simulateMultipleGames = (
  count: number,
  difficulties?: Difficulty[]
) => {
  const results: Array<{
    gameId: string;
    difficulty: Difficulty;
    accuracy: number;
  }> = [];

  for (let i = 0; i < count; i++) {
    const difficulty =
      difficulties?.[i] || (['easy', 'medium', 'hard'] as Difficulty[])[i % 3];
    const { gameId } = simulateGameStart(difficulty);

    // Simulate some moves with varying accuracy
    const accuracy = 0.7 + Math.random() * 0.3; // 70-100% accuracy
    const totalMoves = 20 + Math.floor(Math.random() * 30); // 20-50 moves

    for (let j = 0; j < totalMoves; j++) {
      const isCorrect = Math.random() < accuracy;
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const value = Math.floor(Math.random() * 9) + 1;

      simulateMove(row, col, value, isCorrect);
    }

    // Complete some games
    if (Math.random() < 0.8) {
      // 80% completion rate
      simulateGameCompletion(accuracy < 0.9);
    }

    if (gameId) {
      results.push({ gameId, difficulty, accuracy });
    }
  }

  return results;
};

export const getAnalyticsSnapshot = () => {
  const state = useAnalyticsStore.getState();
  return {
    totalGames: state.userAnalytics.gamesPlayed.length,
    completedGames: state.userAnalytics.gamesPlayed.filter(g => g.completed)
      .length,
    isRecording: state.isRecording,
    currentGame: state.currentGameAnalytics,
    overallStats: state.userAnalytics.overallStats,
  };
};

export const resetStores = () => {
  // Reset game store to initial state
  useGameStore.setState({
    currentGame: null,
    gameHistory: [],
    selectedCell: null,
    highlightedNumber: null,
    showHints: false,
    isPlaying: false,
    isPaused: false,
    isGeneratingPuzzle: false,
    gameSettings: {
      difficulty: 'medium',
      showTimer: true,
      showMistakes: true,
      pauseOnFocusLoss: true,
    },
  });

  // Reset analytics store to initial state
  useAnalyticsStore.setState({
    userAnalytics: {
      userId: '',
      gamesPlayed: [],
      overallStats: {
        totalGames: 0,
        completedGames: 0,
        averageAccuracy: 0,
        averageTimePerGame: 0,
        favoriteOpeningMoves: [],
        strongTechniques: [],
        weakTechniques: [],
        improvementTrend: 0,
      },
      difficultyStats: {
        easy: {
          gamesPlayed: 0,
          averageTime: 0,
          accuracy: 0,
          bestTime: Infinity,
        },
        medium: {
          gamesPlayed: 0,
          averageTime: 0,
          accuracy: 0,
          bestTime: Infinity,
        },
        hard: {
          gamesPlayed: 0,
          averageTime: 0,
          accuracy: 0,
          bestTime: Infinity,
        },
        difficult: {
          gamesPlayed: 0,
          averageTime: 0,
          accuracy: 0,
          bestTime: Infinity,
        },
        extreme: {
          gamesPlayed: 0,
          averageTime: 0,
          accuracy: 0,
          bestTime: Infinity,
        },
      },
      personalRecords: {
        fastestSolveTime: Infinity,
        highestAccuracy: 0,
        longestStreak: 0,
        currentStreak: 0,
      },
      preferences: {
        showHints: true,
        showTimer: true,
        showMistakes: true,
        enableSounds: false,
        theme: 'light',
      },
      createdAt: new Date(),
      lastActive: new Date(),
    },
    currentGameAnalytics: null,
    isRecording: false,
  });
};
