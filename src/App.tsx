
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@radix-ui/themes';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from './components/common';
import { AppNavbar } from './components/layout';
import { GameBoard } from './components/features/game';
import { CompletionAnimation } from './components/features/completion';
import { MistakesModal } from './components/features/mistakes';
import { ThemeProvider, AnalyticsProvider } from './components/providers';
import { useGameStore } from './stores/gameStore';
import { storageManager } from './utils/storageManager';
import { gameEngineService } from './services/gameEngineService';
import { GameProvider } from './contexts';
import type { Difficulty } from './types';
import './index.css';
import { useRef } from 'react';

function App() {
  const { t } = useTranslation();
  const {
    currentGame,
    isGeneratingPuzzle,
    showCompletionAnimation,
    showMistakesModal,
    startNewGame,
    restartCurrentGame,
    forceStopGeneration,
    hideCompletionAnimation,
    continueWithUnlimitedMistakes,
    pauseGame,
    resumeGame
  } = useGameStore();

  // Track if we auto-paused the game due to tab visibility (to distinguish from manual pause)
  const autoTabVisibilityPauseRef = useRef(false);

  // Initialize storage manager and game engine on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage manager
        storageManager.init();

        // Initialize game engine
        await gameEngineService.initialize();

      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  // Auto-pause when browser tab loses focus/visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused;

      if (document.hidden && isPlaying) {
        // Tab is hidden/not visible and game is actively playing
        pauseGame();
        autoTabVisibilityPauseRef.current = true;
      } else if (!document.hidden && autoTabVisibilityPauseRef.current && currentGame?.isPaused) {
        // Tab is now visible and we were the ones who paused it
        resumeGame();
        autoTabVisibilityPauseRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentGame, pauseGame, resumeGame]);

  // Derive isPlaying from currentGame state
  const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused;
  const isPaused = currentGame && !currentGame.isCompleted && currentGame.isPaused;

  const handleNewGame = (difficulty: Difficulty) => {
    startNewGame(difficulty);
  };

  const handleCompletionAnimationEnd = () => {
    hideCompletionAnimation();
  };

  const handleStartNewGameFromModal = () => {
    // Start a new game with the same difficulty as the completed one
    if (currentGame?.difficulty) {
      handleNewGame(currentGame.difficulty);
    }
  };

  const handleRestartFromMistakes = () => {
    // Restart the current puzzle (reset to initial state)
    restartCurrentGame();
  };

  const handleContinueWithMistakes = () => {
    // Continue with unlimited mistakes
    continueWithUnlimitedMistakes();
  };

  const formatCompletionTime = () => {
    if (!currentGame?.startTime || !currentGame?.currentTime) return '00:00';

    const totalElapsedMs = new Date(currentGame.currentTime).getTime() -
      new Date(currentGame.startTime).getTime() -
      (currentGame.totalPausedTime || 0);

    const totalElapsedSeconds = Math.floor(totalElapsedMs / 1000);
    const minutes = Math.floor(totalElapsedSeconds / 60);
    const seconds = totalElapsedSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate completion percentage based on filled cells
  const calculateCompletionPercentage = () => {
    if (!currentGame) return 0;

    const totalCells = 81; // 9x9 grid
    let filledCells = 0;

    currentGame.board.forEach(row => {
      row.forEach(cell => {
        if (cell.value !== null) {
          filledCells++;
        }
      });
    });

    return Math.round((filledCells / totalCells) * 100);
  };

  const gameContextValue = {
    currentGame,
    isPlaying: !!isPlaying,
    isPaused: !!isPaused,
    isCompleted: currentGame?.isCompleted || false,
    isGeneratingPuzzle,
    completionPercentage: calculateCompletionPercentage(),
    onNewGame: handleNewGame,
    onRestart: restartCurrentGame,
    onPause: pauseGame,
    onResume: resumeGame,
    onShowHelp: undefined,
  };

  return (
    <ThemeProvider>
      <Theme>
        <AnalyticsProvider>
          <GameProvider value={gameContextValue}>
            <div className="App relative">
              <AppNavbar />

              {/* Game Page */}
              <>
                <GameBoard />

                {/* Modern Loading Overlay */}
                {isGeneratingPuzzle && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 max-w-sm w-full mx-4 text-center">
                      {/* Clean Loading Spinner */}
                      <LoadingSpinner size="large" className="mx-auto mb-6" />

                      {/* Modern Typography */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {t('loading.generatingPuzzle')}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          {t('loading.creatingChallenge')}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 space-y-3">
                        <button
                          onClick={() => {
                            // Force stop current generation and try easy
                            forceStopGeneration();
                            setTimeout(() => handleNewGame('beginner'), 100);
                          }}
                          className="w-full px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-colors"
                        >
                          Switch to easier puzzle
                        </button>

                        <Button
                          onClick={forceStopGeneration}
                          variant="outline"
                          className="w-full text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {t('navigation.cancel') || 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion Animation */}
                {currentGame && (
                  <CompletionAnimation
                    isVisible={showCompletionAnimation}
                    onAnimationComplete={handleCompletionAnimationEnd}
                    onStartNewGame={handleStartNewGameFromModal}
                    difficulty={currentGame.difficulty}
                    completionTime={formatCompletionTime()}
                    mistakes={currentGame.mistakes || 0}
                  />
                )}

                {/* Mistakes Modal */}
                {currentGame && (
                  <MistakesModal
                    isVisible={showMistakesModal}
                    mistakes={currentGame.mistakes}
                    maxMistakes={currentGame.maxMistakes}
                    onRestart={handleRestartFromMistakes}
                    onContinue={handleContinueWithMistakes}
                  />
                )}
              </>
            </div>
          </GameProvider>
        </AnalyticsProvider>
      </Theme>
    </ThemeProvider>
  );
}

export default App;
