import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnalyticsStore } from '../../stores/analyticsStore';

/**
 * Integration tests for analytics functionality
 * These tests focus on the analytics features you can test without full game completion
 */

describe('Analytics Integration Tests', () => {
  beforeEach(() => {
    // Reset analytics store
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
          easy: { gamesPlayed: 0, averageTime: 0, accuracy: 0, bestTime: Infinity },
          medium: { gamesPlayed: 0, averageTime: 0, accuracy: 0, bestTime: Infinity },
          hard: { gamesPlayed: 0, averageTime: 0, accuracy: 0, bestTime: Infinity },
          difficult: { gamesPlayed: 0, averageTime: 0, accuracy: 0, bestTime: Infinity },
          extreme: { gamesPlayed: 0, averageTime: 0, accuracy: 0, bestTime: Infinity },
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
  });

  describe('User Initialization', () => {
    it('should create a user with unique ID', () => {
      const { initializeUser } = useAnalyticsStore.getState();
      
      initializeUser();
      
      const state = useAnalyticsStore.getState();
      expect(state.userAnalytics.userId).not.toBe('');
      expect(state.userAnalytics.userId.length).toBeGreaterThan(10);
    });
  });

  describe('Game Recording Flow', () => {
    it('should start and complete a game recording session', () => {
      const { initializeUser, startGameRecording, recordCellSelection, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      // Initialize user
      initializeUser();
      
      // Start recording a game
      startGameRecording('test-game-123', 'medium');
      
      let state = useAnalyticsStore.getState();
      expect(state.isRecording).toBe(true);
      expect(state.currentGameAnalytics?.gameId).toBe('test-game-123');
      expect(state.currentGameAnalytics?.difficulty).toBe('medium');
      
      // Record some moves
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);
      recordCellSelection({ row: 0, col: 1 }, 3, true, false);
      recordCellSelection({ row: 1, col: 0 }, 7, false, false); // Wrong move
      recordCellSelection({ row: 1, col: 0 }, 6, true, false); // Correct move
      
      state = useAnalyticsStore.getState();
      expect(state.currentGameAnalytics?.movesHistory).toHaveLength(4);
      
      // Complete the game
      recordGameCompletion(true);
      
      state = useAnalyticsStore.getState();
      expect(state.isRecording).toBe(false);
      expect(state.currentGameAnalytics).toBeNull();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1);
      
      const completedGame = state.userAnalytics.gamesPlayed[0];
      expect(completedGame.gameId).toBe('test-game-123');
      expect(completedGame.difficulty).toBe('medium');
      expect(completedGame.completed).toBe(true);
      expect(completedGame.accuracy).toBe(0.75); // 3 correct out of 4 moves
    });

    it('should track statistics across multiple games', () => {
      const { initializeUser, startGameRecording, recordCellSelection, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      initializeUser();
      
      // Play first game (high accuracy)
      startGameRecording('game-1', 'easy');
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);
      recordCellSelection({ row: 0, col: 1 }, 3, true, false);
      recordGameCompletion(true);
      
      // Play second game (lower accuracy)
      startGameRecording('game-2', 'medium');
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);
      recordCellSelection({ row: 0, col: 1 }, 3, false, false); // Wrong
      recordCellSelection({ row: 0, col: 1 }, 4, true, false); // Correct
      recordGameCompletion(true);
      
      const state = useAnalyticsStore.getState();
      
      // Check overall stats
      expect(state.userAnalytics.overallStats.totalGames).toBe(2);
      expect(state.userAnalytics.overallStats.completedGames).toBe(2);
      expect(state.userAnalytics.overallStats.averageAccuracy).toBeCloseTo(0.833, 2); // (1.0 + 0.667) / 2
      
      // Check difficulty-specific stats
      expect(state.userAnalytics.difficultyStats.easy.gamesPlayed).toBe(1);
      expect(state.userAnalytics.difficultyStats.medium.gamesPlayed).toBe(1);
    });

    it('should handle incomplete games', () => {
      const { initializeUser, startGameRecording, recordCellSelection, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      initializeUser();
      
      // Start a game but don't complete it
      startGameRecording('incomplete-game', 'hard');
      recordCellSelection({ row: 0, col: 0 }, 5, true, false);
      recordGameCompletion(false); // Mark as incomplete
      
      const state = useAnalyticsStore.getState();
      
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1);
      expect(state.userAnalytics.gamesPlayed[0].completed).toBe(false);
      expect(state.userAnalytics.overallStats.totalGames).toBe(1);
      expect(state.userAnalytics.overallStats.completedGames).toBe(0);
    });
  });

  describe('Analytics Edge Cases', () => {
    it('should prevent recording without initialization', () => {
      const { startGameRecording } = useAnalyticsStore.getState();
      
      // Try to start recording without initializing user
      startGameRecording('test-game', 'medium');
      
      const state = useAnalyticsStore.getState();
      expect(state.isRecording).toBe(false);
      expect(state.currentGameAnalytics).toBeNull();
    });

    it('should handle duplicate completion calls', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      initializeUser();
      startGameRecording('test-game', 'medium');
      
      // Complete once
      recordGameCompletion(true);
      let state = useAnalyticsStore.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1);
      
      // Try to complete again
      recordGameCompletion(true);
      state = useAnalyticsStore.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(1); // Should still be 1
    });

    it('should handle games with no moves', () => {
      const { initializeUser, startGameRecording, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      initializeUser();
      startGameRecording('no-moves-game', 'easy');
      
      // Complete immediately without moves
      recordGameCompletion(true);
      
      const state = useAnalyticsStore.getState();
      const game = state.userAnalytics.gamesPlayed[0];
      
      expect(game.accuracy).toBe(0); // No moves = 0% accuracy
      expect(game.movesHistory).toHaveLength(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid game sessions efficiently', () => {
      const { initializeUser, startGameRecording, recordCellSelection, recordGameCompletion } = 
        useAnalyticsStore.getState();
      
      initializeUser();
      
      const startTime = Date.now();
      
      // Simulate 10 quick games
      for (let i = 0; i < 10; i++) {
        startGameRecording(`rapid-game-${i}`, 'medium');
        
        // Add a few moves
        for (let j = 0; j < 5; j++) {
          recordCellSelection(
            { row: j % 3, col: (j + 1) % 3 }, 
            (j % 9) + 1, 
            Math.random() > 0.3, // 70% accuracy
            false
          );
        }
        
        recordGameCompletion(true);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete quickly (under 1 second)
      expect(duration).toBeLessThan(1000);
      
      const state = useAnalyticsStore.getState();
      expect(state.userAnalytics.gamesPlayed).toHaveLength(10);
      expect(state.userAnalytics.overallStats.totalGames).toBe(10);
      expect(state.userAnalytics.overallStats.completedGames).toBe(10);
    });
  });
});

// Helper function to create test games programmatically
export const createTestGame = (
  gameId: string, 
  difficulty: 'easy' | 'medium' | 'hard' | 'difficult' | 'extreme', 
  moves: Array<{ correct: boolean }>,
  completed: boolean = true
) => {
  const { initializeUser, startGameRecording, recordCellSelection, recordGameCompletion } = 
    useAnalyticsStore.getState();
  
  if (!useAnalyticsStore.getState().userAnalytics.userId) {
    initializeUser();
  }
  
  startGameRecording(gameId, difficulty);
  
  moves.forEach((move, index) => {
    recordCellSelection(
      { row: index % 9, col: Math.floor(index / 9) },
      (index % 9) + 1,
      move.correct,
      false
    );
  });
  
  recordGameCompletion(completed);
  
  return useAnalyticsStore.getState().userAnalytics.gamesPlayed.slice(-1)[0];
};
