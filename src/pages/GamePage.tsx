import { GameBoard } from '../components/GameBoard'
import { CompletionAnimation } from '../components/CompletionAnimation'
import { MistakesModal } from '../components/MistakesModal'
import { GameLoadingView } from '../components/game/GameLoadingView'
import { useGameStore } from '../stores/gameStore'

export function GamePage() {
  const {
    currentGame,
    isGeneratingPuzzle,
    showCompletionAnimation,
    showMistakesModal,
    hideCompletionAnimation,
    continueWithUnlimitedMistakes,
    restartCurrentGame,
    startNewGame,
  } = useGameStore()

  const formatCompletionTime = () => {
    if (!currentGame?.startTime || !currentGame?.currentTime) return '00:00'

    const totalElapsedMs = new Date(currentGame.currentTime).getTime() -
      new Date(currentGame.startTime).getTime() -
      (currentGame.totalPausedTime || 0)

    const totalElapsedSeconds = Math.floor(totalElapsedMs / 1000)
    const minutes = Math.floor(totalElapsedSeconds / 60)
    const seconds = totalElapsedSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Show welcome/loading screen if no active game
  if (!currentGame) {
    return (
      <GameLoadingView
        isGeneratingPuzzle={isGeneratingPuzzle}
        onNewGame={startNewGame}
      />
    )
  }

  // Show game board if there's an active game
  return (
    <>
      <GameBoard />

      {currentGame && (
        <CompletionAnimation
          isVisible={showCompletionAnimation}
          onAnimationComplete={() => hideCompletionAnimation()}
          onStartNewGame={() => {
            // Start a new game with the same difficulty
            startNewGame(currentGame.difficulty);
          }}
          difficulty={currentGame.difficulty}
          completionTime={formatCompletionTime()}
          mistakes={currentGame.mistakes || 0}
        />
      )}

      {currentGame && (
        <MistakesModal
          isVisible={showMistakesModal}
          difficulty={currentGame.difficulty}
          mistakes={currentGame.mistakes}
          maxMistakes={currentGame.maxMistakes}
          onRestart={() => restartCurrentGame()}
          onContinue={() => continueWithUnlimitedMistakes()}
        />
      )}
    </>
  )
}
