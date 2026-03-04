import React from 'react';
import { useCompletionStages } from '../hooks/useCompletionStages';
import { ConfettiEffect } from './completion/ConfettiEffect';
import { CelebrationHeader } from './completion/CelebrationHeader';
import { CompletionStats } from './completion/CompletionStats';
import { CompletionActions } from './completion/CompletionActions';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

  return (
    <>
      {/* Confetti particles - show during confetti stage */}
      {stage === 'confetti' && <ConfettiEffect isVisible={true} />}
      
      {/* Dialog - show during stats stage */}
      <Dialog open={isVisible && stage === 'stats'}>
        <DialogContent className="completion-modal max-w-md text-center sm:rounded-2xl">
          {/* Header with success icon */}
          <CelebrationHeader difficulty={difficulty} />

          {/* Content */}
          <div className="space-y-6">
            {/* Stats grid */}
            <CompletionStats
              completionTime={completionTime}
              mistakes={mistakes}
            />

            {/* Action buttons */}
            <CompletionActions
              onStartNewGame={handleStartNewGame}
              onClose={onAnimationComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
