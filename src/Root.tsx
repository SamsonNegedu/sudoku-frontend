import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider, AnalyticsProvider } from './components/providers'
import { AppNavbar } from './components/layout'
import { GameProvider } from './contexts'
import { Toaster } from '@/components/ui/toaster'
import { useGameStore } from './stores/gameStore'
import { storageManager } from './utils/storageManager'
import { gameEngineService } from './services/gameEngineService'
import type { Difficulty } from './types'
import './index.css'
import { LoadingSpinner } from './components/common/LoadingSpinner'

export default function Root() {
  const routerState = useRouterState()
  const navigate = useNavigate()
  const {
    currentGame,
    isGeneratingPuzzle,
    startNewGame,
    restartCurrentGame,
    pauseGame,
    resumeGame,
  } = useGameStore()

  // Track if we auto-paused the game due to tab visibility
  const autoTabVisibilityPauseRef = useRef(false)

  // Initialize storage manager and game engine on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage manager
        storageManager.init()

        // Initialize game engine
        await gameEngineService.initialize()
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initializeApp()
  }, [])

  // Auto-pause when navigating away from game screen
  useEffect(() => {
    const currentPath = routerState.location.pathname
    const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused

    if (currentPath !== '/game' && isPlaying) {
      // Navigating away from game screen - auto pause
      pauseGame()
    }
  }, [routerState.location.pathname, currentGame, pauseGame])

  // Auto-pause when browser tab loses focus/visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused

      if (document.hidden && isPlaying) {
        // Tab is hidden/not visible and game is actively playing
        pauseGame()
        autoTabVisibilityPauseRef.current = true
      } else if (!document.hidden && autoTabVisibilityPauseRef.current && currentGame?.isPaused) {
        // Tab is now visible and we were the ones who paused it
        resumeGame()
        autoTabVisibilityPauseRef.current = false
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentGame, pauseGame, resumeGame])

  // Derive isPlaying from currentGame state
  const isPlaying = currentGame && !currentGame.isCompleted && !currentGame.isPaused
  const isPaused = currentGame && !currentGame.isCompleted && currentGame.isPaused

  const handleNewGame = (difficulty: Difficulty) => {
    // Navigate to game page first, then start new game
    navigate({ to: '/game' })
    startNewGame(difficulty)
  }

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
              <main>
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-950 dark:to-primary-950">
                    <LoadingSpinner size="medium" />
                  </div>
                }>
                  <Outlet />
                </Suspense>
              </main>
              <Toaster />
            </div>
          </GameProvider>
        </AnalyticsProvider>
      </Theme>
    </ThemeProvider>
  )
}
