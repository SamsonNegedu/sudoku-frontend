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
            // Will be handled by navbar navigation
          }}
          difficulty={currentGame.difficulty}
          completionTime="00:00"
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
