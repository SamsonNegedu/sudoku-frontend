import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnalyticsStore } from '../analyticsStore';
import type { Difficulty } from '../../types';

// Helper to create a fresh store instance
const createFreshStore = () => {
  // Reset the store state
  useAnalyticsStore.setState({
    userAnalytics: {
      userId: '',
      username: '',
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

  return useAnalyticsStore;
};

describe('Analytics Store', () => {
  let store: ReturnType<typeof useAnalyticsStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createFreshStore();
  });

  describe('initializeUser', () => {
    it('should initialize a new user with default analytics', () => {
      const { initializeUser } = store.getState();

      initializeUser();

      const state = store.getState();
      // After initialization, userId should be set
      expect(state.userAnalytics.userId).not.toBe('');
      expect(state.userAnalytics.gamesPlayed).toEqual([]);
      expect(state.userAnalytics.overallStats.totalGames).toBe(0);
    });
  });

  describe('startGameRecording', () => {
    it('should start recording a new game', () => {
      const { initializeUser, startGameRecording } = store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      const state = store.getState();
      expect(state.isRecording).toBe(true);
      expect(state.currentGameAnalytics).toBeDefined();
      expect(state.currentGameAnalytics?.gameId).toBe('test-game-id');
      expect(state.currentGameAnalytics?.difficulty).toBe('medium');
    });

    it('should not start recording if already recording same game', () => {
      const { initializeUser, startGameRecording } = store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      const firstState = store.getState();
      const firstStartTime = firstState.currentGameAnalytics?.startTime;

      // Try to start recording the same game again
      startGameRecording('test-game-id', 'medium');

      const secondState = store.getState();
      expect(secondState.currentGameAnalytics?.startTime).toBe(firstStartTime);
    });
  });

  describe('recordGameCompletion', () => {
    it('should record game completion successfully', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } =
        store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      // Simulate some game activity
      const state = store.getState();
      if (state.currentGameAnalytics) {
        state.currentGameAnalytics.movesHistory = [
          {
            cell: { row: 0, col: 0 },
            value: 5,
            timestamp: new Date(),
            isCorrect: true,
            hintUsed: false,
          },
        ];
      }

      recordGameCompletion(true);

      const finalState = store.getState();
      expect(finalState.isRecording).toBe(false);
      expect(finalState.currentGameAnalytics).toBeNull();
      expect(finalState.userAnalytics.gamesPlayed).toHaveLength(1);
      expect(finalState.userAnalytics.overallStats.totalGames).toBe(1);
      expect(finalState.userAnalytics.overallStats.completedGames).toBe(1);
    });

    it('should not record completion if not recording', () => {
      const { initializeUser, recordGameCompletion } = store.getState();

      initializeUser();
      recordGameCompletion(true);

      const state = store.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(0);
    });

    it('should not record completion twice for same game', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } =
        store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      recordGameCompletion(true);

      const firstState = store.getState();
      const gamesCount = firstState.userAnalytics.gamesPlayed.length;

      // Try to record completion again
      recordGameCompletion(true);

      const secondState = store.getState();
      expect(secondState.userAnalytics.gamesPlayed).toHaveLength(gamesCount);
    });
  });

  describe('recordCellSelection', () => {
    it('should record cell selections during active recording', () => {
      const { initializeUser, startGameRecording, recordCellSelection } =
        store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      recordCellSelection({ row: 0, col: 0 }, 5, true, false);

      const state = store.getState();
      expect(state.currentGameAnalytics?.movesHistory).toHaveLength(1);
      expect(state.currentGameAnalytics?.movesHistory[0]).toMatchObject({
        cell: { row: 0, col: 0 },
        value: 5,
        isCorrect: true,
        hintUsed: false,
      });
    });

    it('should not record cell selections when not recording', () => {
      const { initializeUser, recordCellSelection } = store.getState();

      initializeUser();
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);

      const state = store.getState();
      expect(state.currentGameAnalytics).toBeNull();
    });
  });

  describe('calculateOverallStats', () => {
    it('should calculate correct overall statistics', () => {
      const {
        initializeUser,
        startGameRecording,
        recordGameCompletion,
        recordCellSelection,
      } = store.getState();

      initializeUser();

      // Simulate completing a game
      startGameRecording('game-1', 'easy');
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);
      recordCellSelection({ row: 0, col: 1 }, 3, true, false);
      recordGameCompletion(true);

      // Simulate completing another game
      startGameRecording('game-2', 'medium');
      recordCellSelection({ row: 1, col: 0 }, 7, true, false);
      recordCellSelection({ row: 1, col: 1 }, 2, false, false); // incorrect move
      recordGameCompletion(true);

      const state = store.getState();
      expect(state.userAnalytics.overallStats.totalGames).toBe(2);
      expect(state.userAnalytics.overallStats.completedGames).toBe(2);
      expect(state.userAnalytics.overallStats.averageAccuracy).toBeGreaterThan(
        0
      );
      expect(
        state.userAnalytics.overallStats.averageTimePerGame
      ).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle completing incomplete game', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } =
        store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');

      // Complete game as incomplete
      recordGameCompletion(false);

      const state = store.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1);
      expect(state.userAnalytics.gamesPlayed[0].completed).toBe(false);
      expect(state.userAnalytics.overallStats.totalGames).toBe(1);
      expect(state.userAnalytics.overallStats.completedGames).toBe(0);
    });

    it('should handle games with no moves', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } =
        store.getState();

      initializeUser();
      startGameRecording('test-game-id', 'medium');
      recordGameCompletion(true);

      const state = store.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1);
      expect(state.userAnalytics.gamesPlayed[0].accuracy).toBe(0);
    });
  });
});
