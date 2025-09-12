
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, Button } from '@radix-ui/themes';
import { LoadingSpinner } from './components/shared';
import { AppNavbar } from './components/AppNavbar';
import { GameBoard } from './components/GameBoard';
import { CompletionAnimation } from './components/CompletionAnimation';
import { MistakesModal } from './components/MistakesModal';
import { useGameStore } from './stores/gameStore';
import { storageManager } from './utils/storageManager';
import { gameEngineService } from './services/gameEngineService';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LearningCenter } from './components/learning/LearningCenter';
import { PageLayout } from './components/PageLayout';
import { PageHeader } from './components/PageHeader';
import type { Difficulty } from './types';
import './index.css';

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

  // App navigation state
  const [currentPage, setCurrentPage] = useState<'game' | 'analytics' | 'learning'>('game');

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

  // Debug logging removed - completion animation working correctly

  // Derive isPlaying from currentGame state
  const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused;
  const isPaused = currentGame && !currentGame.isCompleted && currentGame.isPaused;

  const handleNewGame = (difficulty: Difficulty) => {
    startNewGame(difficulty);
  };

  const handleShowAnalytics = () => {
    setCurrentPage('analytics');
  };

  const handleBackToGame = () => {
    setCurrentPage('game');
  };

  const handleShowLearning = () => {
    setCurrentPage('learning');
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

  // No cleanup needed anymore

  return (
    <Theme>
      <AnalyticsProvider>
        <div className="App relative">
          <AppNavbar
            onNewGame={handleNewGame}
            onRestart={restartCurrentGame}
            onShowAnalytics={handleShowAnalytics}
            onShowLearning={handleShowLearning}
            onShowGame={handleBackToGame}
            onPause={pauseGame}
            onResume={resumeGame}
            currentDifficulty={currentGame?.difficulty}
            currentPage={currentPage}
            isPlaying={!!isPlaying}
            isPaused={!!isPaused}
            isCompleted={currentGame?.isCompleted || false}
            isGeneratingPuzzle={isGeneratingPuzzle}
            startTime={currentGame?.startTime}
            pauseStartTime={currentGame?.pauseStartTime}
            totalPausedTime={currentGame?.totalPausedTime || 0}
            pausedElapsedTime={currentGame?.pausedElapsedTime}
            currentTime={currentGame?.currentTime}
            hintsUsed={currentGame?.hintsUsed || 0}
            maxHints={currentGame?.maxHints || 3}
          />

          {/* Conditional page rendering */}
          {currentPage === 'game' && (
            <>
              <GameBoard />

              {/* Modern Loading Overlay */}
              {isGeneratingPuzzle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-sm w-full mx-4 text-center">
                    {/* Clean Loading Spinner */}
                    <LoadingSpinner size="large" className="mx-auto mb-6" />

                    {/* Modern Typography */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {t('loading.generatingPuzzle')}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
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
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Switch to easier puzzle
                      </button>

                      <Button
                        onClick={forceStopGeneration}
                        size="2"
                        variant="outline"
                        className="w-full text-slate-600 border-slate-300 hover:bg-slate-50"
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
                  difficulty={currentGame.difficulty}
                  mistakes={currentGame.mistakes}
                  maxMistakes={currentGame.maxMistakes}
                  onRestart={handleRestartFromMistakes}
                  onContinue={handleContinueWithMistakes}
                />
              )}
            </>
          )}

          {/* Analytics Dashboard Page */}
          {currentPage === 'analytics' && (
            <PageLayout className="bg-gray-50">
              <PageHeader
                title={t('analytics.dashboardTitle')}
                subtitle={t('analytics.trackProgress')}
              >
                <Button
                  onClick={handleBackToGame}
                  size="2"
                  variant="solid"
                  className="text-sm sm:text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ← {t('navigation.backToGame')}
                </Button>
              </PageHeader>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AnalyticsDashboard />
              </div>
            </PageLayout>
          )}

          {/* Learning Center Page */}
          {currentPage === 'learning' && (
            <PageLayout>
              <PageHeader
                title={t('learning.centerTitle')}
                subtitle={t('learning.centerSubtitle')}
              >
                <Button
                  onClick={handleBackToGame}
                  size="2"
                  variant="solid"
                  className="text-sm sm:text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ← {t('navigation.backToGame')}
                </Button>
              </PageHeader>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <LearningCenter />
              </div>
            </PageLayout>
          )}
        </div>
      </AnalyticsProvider>
    </Theme>
  );
}

export default App;
