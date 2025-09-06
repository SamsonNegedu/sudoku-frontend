
import React, { useEffect, useState } from 'react';
import { Theme, Button } from '@radix-ui/themes';
import { AppNavbar } from './components/AppNavbar';
import { GameBoard } from './components/GameBoard';
import { CompletionAnimation } from './components/CompletionAnimation';
import { MistakesModal } from './components/MistakesModal';
import { useGameStore } from './stores/gameStore';
import { storageManager } from './utils/storageManager';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LearningCenter } from './components/learning/LearningCenter';
import { PageLayout } from './components/PageLayout';
import { PageHeader } from './components/PageHeader';
import type { Difficulty } from './types';
import './index.css';

function App() {
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

  // Initialize storage manager on app start
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await storageManager.init();
      } catch (error) {
        console.error('Failed to initialize storage manager:', error);
      }
    };

    initializeStorage();
  }, []);

  // Debug logging removed - completion animation working correctly

  // Derive isPlaying from currentGame state
  const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused;
  const isPaused = currentGame && !currentGame.isCompleted && currentGame.isPaused;

  const handleNewGame = (difficulty: Difficulty) => {
    startNewGame(difficulty);
  };

  const handleShowSettings = () => {
    console.log('Settings clicked - to be implemented');
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
            onShowSettings={handleShowSettings}
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

              {/* Prominent Center-Screen Loading Overlay */}
              {isGeneratingPuzzle && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-sm w-full mx-4 text-center">
                    {/* Large Spinning Sudoku Grid */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm animate-pulse"
                            style={{
                              animationDelay: `${i * 150}ms`,
                              animationDuration: '2s'
                            }}
                          />
                        ))}
                      </div>
                      {/* Rotating outer ring */}
                      <div className="absolute -inset-2 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin opacity-70"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Generating Puzzle
                      </h3>
                      <p className="text-gray-600">
                        Creating your perfect Sudoku challenge
                        <span className="inline-flex ml-1">
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '200ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '400ms' }}>.</span>
                        </span>
                      </p>
                      <div className="mt-4 text-sm text-gray-500">
                        ⚡ Optimizing difficulty and ensuring uniqueness
                      </div>

                      {/* Emergency Recovery Button */}
                      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                        <button
                          onClick={() => {
                            // Force stop current generation and try easy
                            forceStopGeneration();
                            setTimeout(() => handleNewGame('beginner'), 100);
                          }}
                          className="block w-full text-sm text-blue-600 hover:text-blue-700 underline font-medium"
                        >
                          🚨 Stop & Switch to Easy
                        </button>
                        <button
                          onClick={() => {
                            // Force stop and clear loading state
                            forceStopGeneration();
                          }}
                          className="block w-full text-sm text-orange-600 hover:text-orange-800 underline"
                        >
                          Just stop generation
                        </button>
                        <button
                          onClick={() => {
                            // Force reset the generation state
                            window.location.reload();
                          }}
                          className="block w-full text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Restart entire app
                        </button>
                      </div>
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
                title="Analytics Dashboard"
                subtitle="Track your progress and improve your solving skills"
              >
                <Button
                  onClick={handleBackToGame}
                  size="2"
                  variant="solid"
                  className="text-sm sm:text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ← Back to Game
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
                title="Sudoku Learning Center"
                subtitle="Master every solving technique with interactive guides and examples. Experimental AI-generated guides."
              >
                <Button
                  onClick={handleBackToGame}
                  size="2"
                  variant="solid"
                  className="text-sm sm:text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ← Back to Game
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
