import React from 'react';
import { useCompletionStages } from '../hooks/useCompletionStages';
import { ConfettiEffect } from './completion/ConfettiEffect';
import { CelebrationHeader } from './completion/CelebrationHeader';
import { CompletionStats } from './completion/CompletionStats';
import { CompletionActions } from './completion/CompletionActions';

interface CompletionAnimationProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
  onStartNewGame: () => void;
  difficulty: string;
  completionTime: string;
  mistakes: number;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  isVisible,
  onAnimationComplete,
  onStartNewGame,
  difficulty,
  completionTime,
  mistakes,
}) => {
  const stage = useCompletionStages(isVisible);

  const handleStartNewGame = () => {
    onAnimationComplete(); // Close the modal
    onStartNewGame(); // Start a new game
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Confetti particles */}
      <ConfettiEffect isVisible={stage === 'confetti' || stage === 'celebration'} />

      {/* Main content */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-center overflow-hidden">
        {/* Header with success icon */}
        {(stage === 'celebration' || stage === 'stats') && (
          <CelebrationHeader
            stage={stage}
            difficulty={difficulty}
            mistakes={mistakes}
          />
        )}

        {/* Content */}
        {stage === 'stats' && (
          <div className="p-6">
            {/* Stats grid */}
            <CompletionStats
              difficulty={difficulty}
              completionTime={completionTime}
              mistakes={mistakes}
            />

            {/* Action buttons */}
            <CompletionActions
              onStartNewGame={handleStartNewGame}
              onClose={onAnimationComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const animationStyles = `
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
`;

export { animationStyles };
