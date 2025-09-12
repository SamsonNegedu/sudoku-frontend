import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storageManager } from '../utils/storageManager';
import type {
  GameAnalytics,
  UserAnalytics,
  DetailedGameMove,
  AnalyticsInsight,
  OverallStats,
} from '../types/analytics';
import type { Difficulty } from '../types';
import type { GameMove } from '../types';

// Type for difficulty progress data
export interface DifficultyProgressData {
  gamesPlayed: number;
  gamesCompleted: number;
  averageTime: number;
  bestTime: number;
  accuracy: number;
  lastPlayed: Date;
}

/**
 * Calculate overall statistics from the games played array
 */
const calculateOverallStats = (gamesPlayed: GameAnalytics[]): OverallStats => {
  if (gamesPlayed.length === 0) {
    return {
      totalGames: 0,
      completedGames: 0,
      averageAccuracy: 0,
      averageTimePerGame: 0,
      favoriteOpeningMoves: [],
      strongTechniques: [],
      weakTechniques: [],
      improvementTrend: 0,
      techniqueUsage: {},
    };
  }

  const totalGames = gamesPlayed.length;
  const completedGames = gamesPlayed.filter(game => game.completed).length;

  // Calculate average accuracy
  const totalAccuracy = gamesPlayed.reduce(
    (sum, game) => sum + (game.accuracy || 0),
    0
  );
  const averageAccuracy = totalAccuracy / totalGames;

  // Calculate average time per game (only for completed games to avoid skewing with incomplete games)
  const completedGamesWithTime = gamesPlayed.filter(
    game => game.completed && game.duration !== undefined
  );
  const averageTimePerGame =
    completedGamesWithTime.length > 0
      ? completedGamesWithTime.reduce(
          (sum, game) => sum + (game.duration || 0),
          0
        ) / completedGamesWithTime.length
      : 0;

  // Calculate improvement trend (last 5 games vs previous 5 games accuracy)
  let improvementTrend = 0;
  if (gamesPlayed.length >= 6) {
    const recentGames = gamesPlayed.slice(-5);
    const previousGames = gamesPlayed.slice(-10, -5);

    const recentAvg =
      recentGames.reduce((sum, game) => sum + (game.accuracy || 0), 0) /
      recentGames.length;
    const previousAvg =
      previousGames.reduce((sum, game) => sum + (game.accuracy || 0), 0) /
      previousGames.length;

    improvementTrend = recentAvg - previousAvg;
  }

  return {
    totalGames,
    completedGames,
    averageAccuracy,
    averageTimePerGame,
    favoriteOpeningMoves: [], // TODO: Implement if needed
    strongTechniques: [], // TODO: Implement if needed
    weakTechniques: [], // TODO: Implement if needed
    improvementTrend,
    techniqueUsage: {},
  };
};

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
  recordMove: (move: GameMove, gameContext: Record<string, unknown>) => void;
  recordCellSelection: (
    cell: { row: number; col: number },
    value: number,
    isCorrect: boolean,
    hintUsed: boolean
  ) => void;
  recordHint: (hintType: string, techniqueRevealed?: string) => void;
  recordTechniqueUsage: (
    technique: string,
    moveNumber: number,
    timeToApply: number,
    successful: boolean,
    wasHintBased: boolean
  ) => void;
  recordGameCompletion: (completed: boolean) => void;
  stopGameRecording: () => void;
  recalculateOverallStats: () => void;

  // Analytics
  getGameInsights: (gameId?: string) => AnalyticsInsight[];
  getUserInsights: () => AnalyticsInsight[];
  getTechniqueInsights: () => Record<string, unknown>[];
  getProgressData: (
    difficulty?: Difficulty
  ) =>
    | DifficultyProgressData
    | Record<Difficulty, DifficultyProgressData>
    | null;
  // Privacy
  clearAllData: () => void;
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

const getTechniqueLevel = (technique: string): Difficulty => {
  const levels = {
    naked_single: 'beginner',
    hidden_single: 'beginner',
    naked_pair: 'intermediate',
    pointing_pair: 'intermediate',
    x_wing: 'advanced',
    xy_wing: 'advanced',
    swordfish: 'expert',
  } as const;

  return (levels as Record<string, Difficulty>)[technique] || 'beginner';
};

const formatTechniqueName = (technique: string): string => {
  const names = {
    naked_single: 'Naked Singles',
    hidden_single: 'Hidden Singles',
    naked_pair: 'Naked Pairs',
    pointing_pair: 'Pointing Pairs',
    x_wing: 'X-Wing',
    xy_wing: 'XY-Wing',
    swordfish: 'Swordfish',
  } as const;

  return (
    (names as Record<string, string>)[technique] ||
    technique.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
};

// Custom storage interface that uses our StorageManager for IndexedDB
const analyticsStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const data = storageManager.loadAnalytics(name);
      return data ? JSON.stringify(data) : null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const parsedValue = JSON.parse(value);
      storageManager.saveAnalytics(name, parsedValue);
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  },
  removeItem: async (): Promise<void> => {
    try {
      storageManager.clearAllAnalytics();
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
            overallStats: calculateOverallStats([]),
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

      recalculateOverallStats: () => {
        const state = get();
        if (state.userAnalytics) {
          const updatedAnalytics = {
            ...state.userAnalytics,
            overallStats: calculateOverallStats(
              state.userAnalytics.gamesPlayed
            ),
          };
          set({ userAnalytics: updatedAnalytics });
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

        // If we already have a different game recording, mark it as abandoned
        if (
          state.currentGameAnalytics &&
          state.currentGameAnalytics.gameId !== gameId &&
          state.isRecording
        ) {
          console.log(
            '🔄 Abandoning previous game:',
            state.currentGameAnalytics.gameId
          );
          get().recordGameCompletion(false); // Mark as incomplete/abandoned
        }

        // Check if we're already recording this game
        if (state.currentGameAnalytics?.gameId === gameId) {
          // If we have a game analytics object but isRecording is false, it's a broken state
          if (!state.isRecording) {
            // Fix the broken state by setting isRecording to true
            set({
              isRecording: true,
              lastMoveTime: Date.now(),
              cellHesitationTracker: new Map(),
            });
            return;
          } else {
            return; // Already recording this game properly
          }
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
            overallStats: calculateOverallStats([]),
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
          techniquesUsed: [],
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

      recordMove: (move: GameMove, gameContext: Record<string, unknown>) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) {
          return;
        }

        const now = Date.now();
        const gameStart = new Date(
          state.currentGameAnalytics.startTime
        ).getTime();
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
          isCorrect: (gameContext.isCorrect as boolean | null) ?? null,
          technique: detectSolvingTechnique(move),
          hesitationTime,
          undoChainLength: 0, // Will be updated if undos follow
          emptyCellsRemaining: (gameContext.emptyCellsRemaining as number) || 0,
          difficultyAtMove: (gameContext.difficultyAtMove as number) || 1,
          mistakesSoFar: (gameContext.mistakes as number) || 0,
          hintsSoFar: (gameContext.hintsUsed as number) || 0,
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
          // Ensure techniquesUsed is an array (migrate from old object format)
          if (!Array.isArray(updatedAnalytics.techniquesUsed)) {
            updatedAnalytics.techniquesUsed = [];
          }

          updatedAnalytics.techniquesUsed.push({
            technique: detailedMove.technique,
            moveNumber: updatedAnalytics.moves.length,
            timeToApply: detailedMove.timeFromLastMove || 0,
            successful: detailedMove.isCorrect !== false,
            wasHintBased: false,
            context: {
              emptyCellsRemaining: 81 - updatedAnalytics.moves.length,
              previousTechnique:
                updatedAnalytics.techniquesUsed.length > 0
                  ? updatedAnalytics.techniquesUsed[
                      updatedAnalytics.techniquesUsed.length - 1
                    ].technique
                  : undefined,
              difficultyAtPoint: Math.min(
                5,
                Math.max(1, Math.ceil(updatedAnalytics.moves.length / 15))
              ),
            },
          });
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

      recordCellSelection: (
        cell: { row: number; col: number },
        value: number,
        isCorrect: boolean,
        hintUsed: boolean
      ) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) {
          return;
        }

        const now = Date.now();
        const gameStart = new Date(
          state.currentGameAnalytics.startTime
        ).getTime();
        const timeFromStart = now - gameStart;
        const timeFromLastMove = now - state.lastMoveTime;

        // Calculate hesitation time for this cell
        const cellKey = getCellKey(cell.row, cell.col);
        const hesitationStart = state.cellHesitationTracker.get(cellKey) || now;
        const hesitationTime = now - hesitationStart;

        const move: GameMove = {
          row: cell.row,
          col: cell.col,
          value: value,
          timestamp: new Date(),
          isNote: false,
          previousValue: 0,
          previousNotes: [],
        };

        const detailedMove: DetailedGameMove = {
          ...move,
          moveNumber: state.currentGameAnalytics.moves.length + 1,
          timeFromStart,
          timeFromLastMove,
          isCorrect,
          technique: detectSolvingTechnique(move),
          hesitationTime,
          undoChainLength: 0,
          emptyCellsRemaining: 0,
          difficultyAtMove: 1,
          mistakesSoFar: 0,
          hintsSoFar: hintUsed ? 1 : 0,
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
          // Ensure techniquesUsed is an array (migrate from old object format)
          if (!Array.isArray(updatedAnalytics.techniquesUsed)) {
            updatedAnalytics.techniquesUsed = [];
          }

          updatedAnalytics.techniquesUsed.push({
            technique: detailedMove.technique,
            moveNumber: updatedAnalytics.moves.length,
            timeToApply: detailedMove.timeFromLastMove || 0,
            successful: detailedMove.isCorrect !== false,
            wasHintBased: false,
            context: {
              emptyCellsRemaining: 81 - updatedAnalytics.moves.length,
              previousTechnique:
                updatedAnalytics.techniquesUsed.length > 0
                  ? updatedAnalytics.techniquesUsed[
                      updatedAnalytics.techniquesUsed.length - 1
                    ].technique
                  : undefined,
              difficultyAtPoint: Math.min(
                5,
                Math.max(1, Math.ceil(updatedAnalytics.moves.length / 15))
              ),
            },
          });
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

      recordHint: (hintType: string, techniqueRevealed?: string) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) return;

        const hintUsage = {
          moveNumber: state.currentGameAnalytics.moves.length,
          timeWhenUsed:
            Date.now() -
            new Date(state.currentGameAnalytics.startTime).getTime(),
          type: hintType,
          techniqueRevealed,
          wasAppliedSuccessfully: false, // Will be updated when move is made
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

      recordTechniqueUsage: (
        technique: string,
        moveNumber: number,
        timeToApply: number,
        successful: boolean,
        wasHintBased: boolean
      ) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) return;

        const techniqueUsage = {
          technique,
          moveNumber,
          timeToApply,
          successful,
          wasHintBased,
          context: {
            emptyCellsRemaining:
              state.currentGameAnalytics.moves.length > 0
                ? 81 -
                  state.currentGameAnalytics.moves.filter(m => m.value !== null)
                    .length
                : 81,
            previousTechnique:
              state.currentGameAnalytics.techniquesUsed.length > 0
                ? state.currentGameAnalytics.techniquesUsed[
                    state.currentGameAnalytics.techniquesUsed.length - 1
                  ].technique
                : undefined,
            difficultyAtPoint: Math.min(
              5,
              Math.max(1, Math.ceil(moveNumber / 15))
            ), // Rough difficulty estimate
          },
        };

        set({
          currentGameAnalytics: {
            ...state.currentGameAnalytics,
            techniquesUsed: [
              ...state.currentGameAnalytics.techniquesUsed,
              techniqueUsage,
            ],
          },
        });
      },

      recordGameCompletion: (completed: boolean) => {
        const state = get();

        if (!state.isRecording || !state.currentGameAnalytics) {
          return;
        }

        // Prevent multiple completion recordings
        if (state.currentGameAnalytics.completed) {
          return;
        }

        const endTime = new Date();
        const duration =
          endTime.getTime() -
          new Date(state.currentGameAnalytics.startTime).getTime();

        // Calculate final stats
        const moves = state.currentGameAnalytics.moves;
        const correctFirstTries = moves.filter(
          m => m.isCorrect === true
        ).length;
        const totalUndos = moves.filter(
          m =>
            (m as DetailedGameMove).value === null &&
            !(m as DetailedGameMove).isNote
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

        // Note: Difficulty progress stats are now calculated in real-time
        // from the gamesPlayed array in getProgressData()

        // Update overall stats
        updatedUserAnalytics.overallStats = calculateOverallStats(
          updatedUserAnalytics.gamesPlayed
        );

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
        const state = get();
        console.log('🛑 stopGameRecording called:', {
          hasCurrentGameAnalytics: !!state.currentGameAnalytics,
          isRecording: state.isRecording,
          gameId: state.currentGameAnalytics?.gameId,
        });

        // If we're stopping a game that was being recorded, mark it as abandoned
        if (state.currentGameAnalytics && state.isRecording) {
          console.log(
            '🛑 Game stopped/abandoned - calling recordGameCompletion(false):',
            state.currentGameAnalytics.gameId
          );
          get().recordGameCompletion(false); // Mark as incomplete/abandoned
        } else {
          console.log(
            '🛑 Just clearing state - no active recording to abandon'
          );
          // Just clear the state if no active recording
          set({
            currentGameAnalytics: null,
            isRecording: false,
            cellHesitationTracker: new Map(),
          });
        }
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

      getTechniqueInsights: () => {
        const state = get();
        if (
          !state.userAnalytics ||
          state.userAnalytics.gamesPlayed.length === 0
        ) {
          return [];
        }

        const insights: Record<string, unknown>[] = [];
        const allTechniques: Record<
          string,
          {
            name: string;
            timesUsed: number;
            timesSuccessful: number;
            totalTime: number;
            recentUses: Array<{
              successful: boolean;
              timeToApply: number;
              wasHintBased: boolean;
            }>;
            level: Difficulty;
          }
        > = {};

        // Aggregate technique usage across all games
        state.userAnalytics.gamesPlayed.forEach(game => {
          // Safety check: ensure techniquesUsed exists and is an array
          if (!game.techniquesUsed || !Array.isArray(game.techniquesUsed)) {
            return; // Skip games without technique data
          }

          game.techniquesUsed.forEach(tech => {
            if (!allTechniques[tech.technique]) {
              allTechniques[tech.technique] = {
                name: tech.technique,
                timesUsed: 0,
                timesSuccessful: 0,
                totalTime: 0,
                recentUses: [],
                level: getTechniqueLevel(tech.technique),
              };
            }

            allTechniques[tech.technique].timesUsed++;
            if (tech.successful)
              allTechniques[tech.technique].timesSuccessful++;
            allTechniques[tech.technique].totalTime += tech.timeToApply;
            allTechniques[tech.technique].recentUses.push({
              successful: tech.successful,
              timeToApply: tech.timeToApply,
              wasHintBased: tech.wasHintBased,
            });
          });
        });

        // Generate insights for each technique
        Object.values(allTechniques).forEach(tech => {
          const successRate = (tech.timesSuccessful / tech.timesUsed) * 100;
          const avgTime = tech.totalTime / tech.timesUsed;

          if (tech.timesUsed >= 3) {
            if (successRate >= 80) {
              insights.push({
                type: 'strength',
                technique: tech.name,
                message: `You've mastered ${formatTechniqueName(tech.name)}! ${successRate.toFixed(0)}% success rate.`,
                actionable: `Try applying this technique earlier in puzzles to solve them faster.`,
                priority: 3,
                level: tech.level,
              });
            } else if (successRate < 50) {
              insights.push({
                type: 'weakness',
                technique: tech.name,
                message: `${formatTechniqueName(tech.name)} needs practice - only ${successRate.toFixed(0)}% success rate.`,
                actionable: `Focus on recognizing the pattern before applying the technique. Take your time to verify the logic.`,
                priority: 4,
                level: tech.level,
              });
            }

            if (avgTime > 30000) {
              // More than 30 seconds
              insights.push({
                type: 'improvement',
                technique: tech.name,
                message: `You're taking ${Math.round(avgTime / 1000)}s on average for ${formatTechniqueName(tech.name)}.`,
                actionable: `Practice pattern recognition for this technique to reduce application time.`,
                priority: 2,
                level: tech.level,
              });
            }
          }
        });

        // Generate progression suggestions
        const basicTechniques = ['naked_single', 'hidden_single'];
        const intermediateTechniques = ['naked_pair', 'pointing_pair'];
        const advancedTechniques = ['x_wing', 'xy_wing', 'swordfish'];

        const masteredBasic = basicTechniques.every(
          tech =>
            allTechniques[tech] &&
            allTechniques[tech].timesSuccessful /
              allTechniques[tech].timesUsed >=
              0.8
        );

        const masteredIntermediate = intermediateTechniques.every(
          tech =>
            allTechniques[tech] &&
            allTechniques[tech].timesSuccessful /
              allTechniques[tech].timesUsed >=
              0.7
        );

        if (masteredBasic && !masteredIntermediate) {
          insights.push({
            type: 'suggestion',
            technique: 'progression',
            message: `Ready for intermediate techniques! You've mastered the basics.`,
            actionable: `Try focusing on Naked Pairs and Pointing Pairs in your next games.`,
            priority: 5,
            level: 'intermediate',
          });
        } else if (
          masteredIntermediate &&
          !advancedTechniques.some(tech => allTechniques[tech])
        ) {
          insights.push({
            type: 'suggestion',
            technique: 'progression',
            message: `Time for advanced techniques! You're ready for X-Wing and XY-Wing patterns.`,
            actionable: `Challenge yourself with expert-level puzzles to encounter these techniques.`,
            priority: 5,
            level: 'advanced',
          });
        }

        return insights.sort((a, b) => {
          const aPriority = (a.priority as number) || 0;
          const bPriority = (b.priority as number) || 0;
          return bPriority - aPriority;
        });
      },

      getProgressData: (difficulty?: Difficulty) => {
        const state = get();
        if (!state.userAnalytics) return null;

        // Calculate stats in real-time from games played
        const calculateDifficultyStats = (targetDifficulty: Difficulty) => {
          const games = state.userAnalytics!.gamesPlayed.filter(
            game => game.difficulty === targetDifficulty
          );

          const completedGames = games.filter(game => game.completed === true);
          const gamesPlayed = games.length;
          const gamesCompleted = completedGames.length;

          // Calculate best time from completed games with valid durations
          const completedGamesWithDuration = completedGames.filter(
            game => game.duration && game.duration > 0
          );

          const bestTime =
            completedGamesWithDuration.length > 0
              ? Math.min(
                  ...completedGamesWithDuration.map(game => game.duration!)
                )
              : Infinity;

          // Calculate average time from all games (including incomplete for overall play time)
          const averageTime =
            games.length > 0
              ? games.reduce((sum, game) => sum + (game.duration || 0), 0) /
                games.length
              : 0;

          // Calculate accuracy from all games
          const accuracy =
            games.length > 0
              ? games.reduce((sum, game) => sum + (game.accuracy || 0), 0) /
                games.length
              : 0;

          // Find last played date
          const lastPlayed =
            games.length > 0
              ? new Date(
                  Math.max(
                    ...games.map(game => {
                      const endTime = game.endTime
                        ? new Date(game.endTime).getTime()
                        : 0;
                      const startTime = game.startTime
                        ? new Date(game.startTime).getTime()
                        : 0;
                      return Math.max(endTime, startTime);
                    })
                  )
                )
              : new Date();

          return {
            gamesPlayed,
            gamesCompleted,
            averageTime,
            bestTime,
            accuracy,
            lastPlayed,
          };
        };

        if (difficulty) {
          return calculateDifficultyStats(difficulty);
        }

        // Return all difficulties calculated in real-time
        const difficulties: Difficulty[] = [
          'beginner',
          'intermediate',
          'advanced',
          'expert',
          'master',
          'grandmaster',
        ];
        const result: Record<Difficulty, DifficultyProgressData> = {} as Record<
          Difficulty,
          DifficultyProgressData
        >;

        difficulties.forEach(diff => {
          result[diff] = calculateDifficultyStats(diff);
        });

        return result;
      },

      clearAllData: () => {
        set({
          currentGameAnalytics: null,
          userAnalytics: null,
          isRecording: false,
          cellHesitationTracker: new Map(),
        });
      },
    }),
    {
      name: 'sudoku-analytics-storage',
      storage: createJSONStorage(() => analyticsStorage),
      partialize: state => ({
        userAnalytics: state.userAnalytics,
        currentGameAnalytics: state.currentGameAnalytics,
      }),
      onRehydrateStorage: () => state => {
        // Recalculate overall stats when data is loaded from storage
        if (state?.userAnalytics?.gamesPlayed) {
          state.userAnalytics.overallStats = calculateOverallStats(
            state.userAnalytics.gamesPlayed
          );
        }
      },
    }
  )
);
