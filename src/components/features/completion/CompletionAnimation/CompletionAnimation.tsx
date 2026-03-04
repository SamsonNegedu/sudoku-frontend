import React from 'react';
import { useCompletionStages } from '../../../../hooks/useCompletionStages';
import { ConfettiEffect } from './ConfettiEffect';
import { CelebrationHeader } from './CelebrationHeader';
import { CompletionStats } from './CompletionStats';
import { CompletionActions } from './CompletionActions';

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
    onAnimationComplete();
    onStartNewGame();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Confetti particles - overlay only, doesn't block interaction */}
      {stage === 'confetti' && <ConfettiEffect isVisible={true} />}

      {/* Non-blocking celebration card - slides up from bottom */}
      {stage === 'stats' && (
        <>
          {/* Semi-transparent backdrop - click to dismiss */}
          <div 
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[60] backdrop-blur-sm
                       animate-in fade-in duration-300"
            onClick={onAnimationComplete}
          />
          
          {/* Celebration card */}
          <div className="fixed bottom-0 left-0 right-0 z-[70] pointer-events-none">
            <div className="max-w-2xl mx-auto px-2 sm:px-4 pb-4">
              <div 
                className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl pointer-events-auto
                           animate-in slide-in-from-bottom-8 fade-in duration-500"
              >
                <div className="p-4 sm:p-6">
                  {/* Header with success icon */}
                  <CelebrationHeader difficulty={difficulty} />

                  {/* Content */}
                  <div className="space-y-4 sm:space-y-6 mt-4">
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
