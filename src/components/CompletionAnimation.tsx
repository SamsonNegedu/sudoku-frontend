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
      {/* Confetti particles - show during confetti stage and briefly into stats */}
      <ConfettiEffect isVisible={stage === 'confetti'} />

      {/* Main content - only show during stats stage */}
      {stage === 'stats' && (
        <div className="completion-modal bg-white rounded-2xl shadow-2xl max-w-md w-full text-center overflow-hidden">
          {/* Header with success icon */}
          <CelebrationHeader
            difficulty={difficulty}
          />

          {/* Content */}
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
        </div>
      )}
    </div>
  );
};
