import { useAnalyticsStore } from '../stores/analyticsStore';
import { useGameStore } from '../stores/gameStore';
import type { GameMove, SudokuBoard } from '../types';

// Utility function
const calculateEmptyCells = (board: SudokuBoard): number => {
  let empty = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) {
        empty++;
      }
    }
  }
  return empty;
};

// Hook for components to easily access analytics
export const useGameAnalytics = () => {
  const analyticsStore = useAnalyticsStore();
  const gameStore = useGameStore();

  // Enhanced move recording function
  const recordGameMove = (
    move: GameMove,
    additionalContext?: Record<string, unknown>
  ) => {
    if (!gameStore.currentGame) return;

    const gameContext = {
      isCorrect: additionalContext?.isCorrect,
      boardBefore: additionalContext?.boardBefore,
      boardAfter: gameStore.currentGame.board,
      emptyCellsRemaining: calculateEmptyCells(gameStore.currentGame.board),
      mistakes: gameStore.currentGame.mistakes,
      hintsUsed: gameStore.currentGame.hintsUsed,
      difficultyAtMove: 1, // TODO: Calculate dynamic difficulty
      ...additionalContext,
    };

    analyticsStore.recordMove(move, gameContext);
  };

  const recordHintUsage = (hintType: string, techniqueRevealed?: string) => {
    analyticsStore.recordHint(hintType, techniqueRevealed);
  };

  return {
    ...analyticsStore,
    recordGameMove,
    recordHintUsage,
  };
};
