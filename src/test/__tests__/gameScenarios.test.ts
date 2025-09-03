import { describe, it, expect, beforeEach } from 'vitest';
import {
  simulateGameStart,
  simulateMove,
  simulateGameCompletion,
  simulateMultipleGames,
  getAnalyticsSnapshot,
  resetStores,
} from '../testUtils';

describe('End-to-End Game Scenarios', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Single Game Completion', () => {
    it('should track a complete game from start to finish', () => {
      // Start a new game
      const { gameId } = simulateGameStart('medium');
      expect(gameId).toBeTruthy();

      // Check initial analytics state
      let snapshot = getAnalyticsSnapshot();
      expect(snapshot.isRecording).toBe(true);
      expect(snapshot.currentGame).toBeTruthy();
      expect(snapshot.totalGames).toBe(0); // Not completed yet

      // Make some moves
      simulateMove(0, 2, 4, true);  // Correct move
      simulateMove(0, 3, 6, true);  // Correct move
      simulateMove(1, 1, 7, false); // Incorrect move
      simulateMove(1, 1, 7, true);  // Correct move

      // Complete the game
      simulateGameCompletion(false);

      // Check final analytics state
      snapshot = getAnalyticsSnapshot();
      expect(snapshot.isRecording).toBe(false);
      expect(snapshot.currentGame).toBeNull();
      expect(snapshot.totalGames).toBe(1);
      expect(snapshot.completedGames).toBe(1);
      expect(snapshot.overallStats.averageAccuracy).toBeGreaterThan(0);
      expect(snapshot.overallStats.averageTimePerGame).toBeGreaterThan(0);
    });

    it('should handle incomplete games', () => {
      // Start game but don't complete it
      const { gameId } = simulateGameStart('easy');
      
      // Make some moves
      simulateMove(0, 2, 4, true);
      simulateMove(0, 3, 6, true);

      // Abandon the game (simulate recordGameCompletion with false)
      const analyticsStore = require('../../stores/analyticsStore').useAnalyticsStore.getState();
      analyticsStore.recordGameCompletion(false);

      const snapshot = getAnalyticsSnapshot();
      expect(snapshot.totalGames).toBe(1);
      expect(snapshot.completedGames).toBe(0);
    });
  });

  describe('Multiple Games Tracking', () => {
    it('should correctly track statistics across multiple games', () => {
      // Simulate 5 games with different difficulties
      const results = simulateMultipleGames(5, ['easy', 'medium', 'hard', 'medium', 'easy']);

      const snapshot = getAnalyticsSnapshot();
      
      // Should have tracked all games
      expect(snapshot.totalGames).toBeGreaterThan(0);
      expect(snapshot.totalGames).toBeLessThanOrEqual(5);
      
      // Should have reasonable completion rate (80% from testUtils)
      expect(snapshot.completedGames).toBeGreaterThan(0);
      
      // Statistics should be calculated
      if (snapshot.completedGames > 0) {
        expect(snapshot.overallStats.averageAccuracy).toBeGreaterThan(0);
        expect(snapshot.overallStats.averageAccuracy).toBeLessThanOrEqual(1);
        expect(snapshot.overallStats.averageTimePerGame).toBeGreaterThan(0);
      }
    });

    it('should track difficulty-specific statistics', () => {
      // Play multiple games of each difficulty
      simulateMultipleGames(3, ['easy', 'easy', 'easy']);
      simulateMultipleGames(2, ['hard', 'hard']);

      const analyticsState = require('../../stores/analyticsStore').useAnalyticsStore.getState();
      const difficultyStats = analyticsState.userAnalytics.difficultyStats;

      // Should have stats for easy games
      expect(difficultyStats.easy.gamesPlayed).toBeGreaterThan(0);
      
      // Should have stats for hard games
      expect(difficultyStats.hard.gamesPlayed).toBeGreaterThan(0);
      
      // Medium should have no games
      expect(difficultyStats.medium.gamesPlayed).toBe(0);
    });
  });

  describe('Analytics Edge Cases', () => {
    it('should handle rapid game starts and stops', () => {
      // Start multiple games quickly
      const game1 = simulateGameStart('easy');
      const game2 = simulateGameStart('medium'); // Should not interfere with game1
      
      const snapshot = getAnalyticsSnapshot();
      
      // Should only be recording the latest game
      expect(snapshot.isRecording).toBe(true);
      expect(snapshot.currentGame?.gameId).toBe(game2.gameId);
    });

    it('should handle games with no moves', () => {
      simulateGameStart('easy');
      
      // Complete immediately without any moves
      const analyticsStore = require('../../stores/analyticsStore').useAnalyticsStore.getState();
      analyticsStore.recordGameCompletion(true);
      
      const snapshot = getAnalyticsSnapshot();
      expect(snapshot.totalGames).toBe(1);
      expect(snapshot.completedGames).toBe(1);
      // Accuracy should be 0 for no moves
      expect(snapshot.overallStats.averageAccuracy).toBe(0);
    });

    it('should prevent duplicate completions', () => {
      simulateGameStart('medium');
      simulateMove(0, 2, 4, true);
      
      const analyticsStore = require('../../stores/analyticsStore').useAnalyticsStore.getState();
      
      // Complete once
      analyticsStore.recordGameCompletion(true);
      let snapshot = getAnalyticsSnapshot();
      expect(snapshot.totalGames).toBe(1);
      
      // Try to complete again
      analyticsStore.recordGameCompletion(true);
      snapshot = getAnalyticsSnapshot();
      expect(snapshot.totalGames).toBe(1); // Should still be 1
    });
  });

  describe('Performance Scenarios', () => {
    it('should handle large numbers of games efficiently', () => {
      const startTime = Date.now();
      
      // Simulate 50 games (should complete quickly in tests)
      simulateMultipleGames(50);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (5 seconds max)
      expect(duration).toBeLessThan(5000);
      
      const snapshot = getAnalyticsSnapshot();
      expect(snapshot.totalGames).toBeGreaterThan(0);
      expect(snapshot.totalGames).toBeLessThanOrEqual(50);
    });

    it('should maintain data integrity across many operations', () => {
      // Generate significant amount of data
      simulateMultipleGames(20);
      
      const snapshot = getAnalyticsSnapshot();
      const analyticsState = require('../../stores/analyticsStore').useAnalyticsStore.getState();
      
      // Verify data consistency
      const actualCompleted = analyticsState.userAnalytics.gamesPlayed.filter(g => g.completed).length;
      expect(snapshot.completedGames).toBe(actualCompleted);
      
      const actualTotal = analyticsState.userAnalytics.gamesPlayed.length;
      expect(snapshot.totalGames).toBe(actualTotal);
      
      // Overall stats should be consistent with individual games
      if (actualCompleted > 0) {
        expect(snapshot.overallStats.completedGames).toBe(actualCompleted);
        expect(snapshot.overallStats.totalGames).toBe(actualTotal);
      }
    });
  });
});
