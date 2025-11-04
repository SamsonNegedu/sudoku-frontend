import { useEffect, useRef } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider } from './components/ThemeProvider'
import { AppNavbar } from './components/AppNavbar'
import { AnalyticsProvider } from './components/AnalyticsProvider'
import { useGameStore } from './stores/gameStore'
import { storageManager } from './utils/storageManager'
import { gameEngineService } from './services/gameEngineService'
import type { Difficulty } from './types'
import './index.css'

export default function Root() {
  const routerState = useRouterState()
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
    startNewGame(difficulty)
  }

  return (
    <ThemeProvider>
      <Theme>
        <AnalyticsProvider>
          <div className="App relative">
            <AppNavbar
              onNewGame={handleNewGame}
              onRestart={restartCurrentGame}
              onPause={pauseGame}
              onResume={resumeGame}
              currentDifficulty={currentGame?.difficulty}
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
            <Outlet />
          </div>
        </AnalyticsProvider>
      </Theme>
    </ThemeProvider>
  )
}
