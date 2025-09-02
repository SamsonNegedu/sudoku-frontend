import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storageManager } from '../utils/storageManager';
import type {
  GameAnalytics,
  UserAnalytics,
  DetailedGameMove,
  AnalyticsInsight,
} from '../types/analytics';
import type { Difficulty } from '../types';
import type { GameMove } from '../types';

interface AnalyticsStore {
  // State
  currentGameAnalytics: GameAnalytics | null;
  userAnalytics: UserAnalytics | null;
  isRecording: boolean;
  lastMoveTime: number;
  cellHesitationTracker: Map<string, number>; // cellKey -> startTime

  // Actions
  initializeUser: () => void;
  startGameRecording: (gameId: string, difficulty: Difficulty) => void;
  recordMove: (move: GameMove, gameContext: any) => void;
  recordCellSelection: (row: number, col: number) => void;
  recordHint: (hintType: string) => void;
  recordGameCompletion: (completed: boolean) => void;
  stopGameRecording: () => void;

  // Analytics
  getGameInsights: (gameId?: string) => AnalyticsInsight[];
  getUserInsights: () => AnalyticsInsight[];
  getProgressData: (difficulty?: Difficulty) => any;
  exportUserData: () => string;
  importUserData: (data: string) => boolean;

  // Privacy
  clearAllData: () => void;
  anonymizeData: () => void;
}

// Utility functions
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const detectSolvingTechnique = (move: GameMove): string => {
  // Basic technique detection - can be enhanced
  if (move.isNote) return 'notation';
  if (move.value === null) return 'clearing';

  // TODO: Implement more sophisticated technique detection
  return 'basic_placement';
};

const getCellKey = (row: number, col: number): string => `${row},${col}`;

// Custom storage interface that uses our StorageManager
const analyticsStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const data = await storageManager.loadAnalytics(name);
      return data ? JSON.stringify(data) : null;
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const parsedValue = JSON.parse(value);
      await storageManager.saveAnalytics(name, parsedValue);
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  },
  removeItem: async (_name: string): Promise<void> => {
    try {
      await storageManager.clearAllAnalytics();
    } catch (error) {
      console.error('Failed to remove analytics data:', error);
    }
  },
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentGameAnalytics: null,
      userAnalytics: null,
      isRecording: false,
      lastMoveTime: 0,
      cellHesitationTracker: new Map(),

      initializeUser: () => {
        const state = get();
        if (!state.userAnalytics) {
          const newUser: UserAnalytics = {
            userId: generateUserId(),
            createdAt: new Date(),
            lastUpdated: new Date(),
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
            difficultyProgress: {
              beginner: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              intermediate: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              advanced: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              expert: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              master: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              grandmaster: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
            },
            playingPatterns: {
              preferredInputMode: 'pen',
              noteUsageFrequency: 0,
              hintUsageStrategy: 'moderate',
              errorRecoveryStyle: 'methodical',
              solvingStyle: 'systematic',
            },
          };

          set({ userAnalytics: newUser });
        }
      },

      startGameRecording: (gameId: string, difficulty: Difficulty) => {
        const state = get();

        // Check if this game is already completed in our analytics
        if (
          state.userAnalytics?.gamesPlayed.some(
            game => game.gameId === gameId && game.completed
          )
        ) {
          return; // Don't start recording for already completed games
        }

        // Also check if we're already recording this game
        if (state.currentGameAnalytics?.gameId === gameId) {
          return; // Already recording this game
        }

        // Ensure we have user analytics without causing recursive calls
        let userAnalytics = state.userAnalytics;
        if (!userAnalytics) {
          // Create user analytics inline instead of calling initializeUser
          const newUser: UserAnalytics = {
            userId: generateUserId(),
            createdAt: new Date(),
            lastUpdated: new Date(),
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
            difficultyProgress: {
              beginner: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              intermediate: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              advanced: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              expert: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              master: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
              grandmaster: {
                gamesPlayed: 0,
                gamesCompleted: 0,
                averageTime: 0,
                bestTime: Infinity,
                accuracy: 0,
                lastPlayed: new Date(),
              },
            },
            playingPatterns: {
              preferredInputMode: 'pen',
              noteUsageFrequency: 0,
              hintUsageStrategy: 'moderate',
              errorRecoveryStyle: 'methodical',
              solvingStyle: 'systematic',
            },
          };
          userAnalytics = newUser;
        }

        const gameAnalytics: GameAnalytics = {
          gameId,
          userId: userAnalytics.userId,
          startTime: new Date(),
          difficulty,
          completed: false,
          moves: [],
          accuracy: 0,
          averageTimePerMove: 0,
          totalHesitationTime: 0,
          undoFrequency: 0,
          openingMoves: [],
          bottlenecks: [],
          techniquesUsed: {},
          hintUsagePattern: [],
          errorCells: [],
          finalStats: {
            totalMoves: 0,
            correctFirstTries: 0,
            totalUndos: 0,
            totalHints: 0,
            finalAccuracy: 0,
          },
        };

        set({
          userAnalytics,
          currentGameAnalytics: gameAnalytics,
          isRecording: true,
          lastMoveTime: Date.now(),
          cellHesitationTracker: new Map(),
        });
      },

      recordMove: (move: GameMove, gameContext: any) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) return;

        const now = Date.now();
        const gameStart = state.currentGameAnalytics.startTime.getTime();
        const timeFromStart = now - gameStart;
        const timeFromLastMove = now - state.lastMoveTime;

        // Calculate hesitation time for this cell
        const cellKey = getCellKey(move.row, move.col);
        const hesitationStart = state.cellHesitationTracker.get(cellKey) || now;
        const hesitationTime = now - hesitationStart;

        const detailedMove: DetailedGameMove = {
          ...move,
          moveNumber: state.currentGameAnalytics.moves.length + 1,
          timeFromStart,
          timeFromLastMove,
          isCorrect: gameContext.isCorrect ?? null,
          technique: detectSolvingTechnique(move),
          hesitationTime,
          undoChainLength: 0, // Will be updated if undos follow
          emptyCellsRemaining: gameContext.emptyCellsRemaining || 0,
          difficultyAtMove: gameContext.difficultyAtMove || 1,
          mistakesSoFar: gameContext.mistakes || 0,
          hintsSoFar: gameContext.hintsUsed || 0,
        };

        // Update current game analytics
        const updatedAnalytics: GameAnalytics = {
          ...state.currentGameAnalytics,
          moves: [...state.currentGameAnalytics.moves, detailedMove],
        };

        // Update opening moves (first 10)
        if (detailedMove.moveNumber <= 10) {
          updatedAnalytics.openingMoves = [
            ...updatedAnalytics.openingMoves,
            detailedMove,
          ];
        }

        // Update technique tracking
        if (detailedMove.technique) {
          updatedAnalytics.techniquesUsed = {
            ...updatedAnalytics.techniquesUsed,
            [detailedMove.technique]:
              (updatedAnalytics.techniquesUsed[detailedMove.technique] || 0) +
              1,
          };
        }

        // Clear hesitation tracker for this cell
        const newHesitationTracker = new Map(state.cellHesitationTracker);
        newHesitationTracker.delete(cellKey);

        set({
          currentGameAnalytics: updatedAnalytics,
          lastMoveTime: now,
          cellHesitationTracker: newHesitationTracker,
        });
      },

      recordCellSelection: (row: number, col: number) => {
        const state = get();
        if (!state.isRecording) return;

        const cellKey = getCellKey(row, col);
        const now = Date.now();

        // Start tracking hesitation time for this cell
        const newHesitationTracker = new Map(state.cellHesitationTracker);
        newHesitationTracker.set(cellKey, now);

        set({ cellHesitationTracker: newHesitationTracker });
      },

      recordHint: (hintType: string) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) return;

        const hintUsage = {
          moveNumber: state.currentGameAnalytics.moves.length,
          timeWhenUsed:
            Date.now() - state.currentGameAnalytics.startTime.getTime(),
          type: hintType,
        };

        set({
          currentGameAnalytics: {
            ...state.currentGameAnalytics,
            hintUsagePattern: [
              ...state.currentGameAnalytics.hintUsagePattern,
              hintUsage,
            ],
          },
        });
      },

      recordGameCompletion: (completed: boolean) => {
        const state = get();
        if (!state.isRecording || !state.currentGameAnalytics) return;

        // Prevent multiple completion recordings
        if (state.currentGameAnalytics.completed) return;

        const endTime = new Date();
        const duration =
          endTime.getTime() - state.currentGameAnalytics.startTime.getTime();

        // Calculate final stats
        const moves = state.currentGameAnalytics.moves;
        const correctFirstTries = moves.filter(
          m => m.isCorrect === true
        ).length;
        const totalUndos = moves.filter(
          m => (m as any).value === null && !(m as any).isNote
        ).length;
        const finalAccuracy =
          moves.length > 0 ? (correctFirstTries / moves.length) * 100 : 0;

        const completedAnalytics: GameAnalytics = {
          ...state.currentGameAnalytics,
          endTime,
          duration,
          completed,
          accuracy: finalAccuracy,
          averageTimePerMove: moves.length > 0 ? duration / moves.length : 0,
          finalStats: {
            totalMoves: moves.length,
            correctFirstTries,
            totalUndos,
            totalHints: state.currentGameAnalytics.hintUsagePattern.length,
            finalAccuracy,
          },
        };

        // Add to user's game history
        const updatedUserAnalytics: UserAnalytics = {
          ...state.userAnalytics!,
          lastUpdated: new Date(),
          gamesPlayed: [
            ...state.userAnalytics!.gamesPlayed,
            completedAnalytics,
          ],
        };

        // Update difficulty progress
        const difficultyStats =
          updatedUserAnalytics.difficultyProgress[
            completedAnalytics.difficulty
          ];
        difficultyStats.gamesPlayed += 1;
        if (completed) {
          difficultyStats.gamesCompleted += 1;
          if (duration < difficultyStats.bestTime) {
            difficultyStats.bestTime = duration;
          }
        }
        difficultyStats.lastPlayed = endTime;
        difficultyStats.averageTime =
          (difficultyStats.averageTime * (difficultyStats.gamesPlayed - 1) +
            duration) /
          difficultyStats.gamesPlayed;
        difficultyStats.accuracy =
          (difficultyStats.accuracy * (difficultyStats.gamesPlayed - 1) +
            finalAccuracy) /
          difficultyStats.gamesPlayed;

        // Use setTimeout to break the synchronous update cycle
        setTimeout(() => {
          set({
            currentGameAnalytics: null,
            userAnalytics: updatedUserAnalytics,
            isRecording: false,
            cellHesitationTracker: new Map(),
          });
        }, 0);
      },

      stopGameRecording: () => {
        set({
          currentGameAnalytics: null,
          isRecording: false,
          cellHesitationTracker: new Map(),
        });
      },

      getGameInsights: (gameId?: string): AnalyticsInsight[] => {
        const state = get();
        const game = gameId
          ? state.userAnalytics?.gamesPlayed.find(g => g.gameId === gameId)
          : state.currentGameAnalytics;

        if (!game) return [];

        const insights: AnalyticsInsight[] = [];

        // Performance insights
        if (game.accuracy > 90) {
          insights.push({
            type: 'strength',
            title: 'Excellent Accuracy',
            description: `You achieved ${game.accuracy.toFixed(1)}% accuracy in this game!`,
            priority: 'high',
          });
        } else if (game.accuracy < 70) {
          insights.push({
            type: 'weakness',
            title: 'Accuracy Needs Work',
            description: `Consider taking more time to analyze before placing numbers. Your accuracy was ${game.accuracy.toFixed(1)}%.`,
            priority: 'high',
            actionable: true,
          });
        }

        // Speed insights
        if (game.averageTimePerMove < 5000) {
          // Under 5 seconds per move
          insights.push({
            type: 'strength',
            title: 'Fast Solver',
            description:
              'You solve very quickly! Average time per move was under 5 seconds.',
            priority: 'medium',
          });
        }

        return insights;
      },

      getUserInsights: (): AnalyticsInsight[] => {
        const state = get();
        if (
          !state.userAnalytics ||
          state.userAnalytics.gamesPlayed.length === 0
        )
          return [];

        const insights: AnalyticsInsight[] = [];
        const stats = state.userAnalytics.overallStats;

        // Overall performance
        if (stats.totalGames > 10) {
          insights.push({
            type: 'achievement',
            title: 'Dedicated Player',
            description: `You've completed ${stats.totalGames} games! Keep up the great work.`,
            priority: 'low',
          });
        }

        // Completion rate
        const completionRate = (stats.completedGames / stats.totalGames) * 100;
        if (completionRate > 80) {
          insights.push({
            type: 'strength',
            title: 'High Completion Rate',
            description: `You complete ${completionRate.toFixed(0)}% of your games!`,
            priority: 'medium',
          });
        }

        return insights;
      },

      getProgressData: (difficulty?: Difficulty) => {
        const state = get();
        if (!state.userAnalytics) return null;

        if (difficulty) {
          return state.userAnalytics.difficultyProgress[difficulty];
        }

        return state.userAnalytics.difficultyProgress;
      },

      exportUserData: (): string => {
        const state = get();
        return JSON.stringify(
          {
            userAnalytics: state.userAnalytics,
            exportDate: new Date(),
            version: '1.0',
          },
          null,
          2
        );
      },

      importUserData: (data: string): boolean => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.userAnalytics) {
            set({ userAnalytics: parsed.userAnalytics });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      clearAllData: () => {
        set({
          currentGameAnalytics: null,
          userAnalytics: null,
          isRecording: false,
          cellHesitationTracker: new Map(),
        });
      },

      anonymizeData: () => {
        const state = get();
        if (!state.userAnalytics) return;

        const anonymized: UserAnalytics = {
          ...state.userAnalytics,
          userId: generateUserId(),
          gamesPlayed: state.userAnalytics.gamesPlayed.map(game => ({
            ...game,
            userId: 'anonymous',
            gameId: 'anon_' + Math.random().toString(36).substr(2, 9),
          })),
        };

        set({ userAnalytics: anonymized });
      },
    }),
    {
      name: 'sudoku-analytics-storage',
      // Temporarily disable custom storage to debug
      // storage: createJSONStorage(() => analyticsStorage),
      partialize: state => ({
        userAnalytics: state.userAnalytics,
        currentGameAnalytics: state.currentGameAnalytics,
      }),
    }
  )
);
