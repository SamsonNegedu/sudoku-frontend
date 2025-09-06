import { useEffect, useState } from 'react';

type CompletionStage = 'hidden' | 'confetti' | 'celebration' | 'stats';

export const useCompletionStages = (isVisible: boolean) => {
  const [stage, setStage] = useState<CompletionStage>('hidden');

  useEffect(() => {
    if (isVisible) {
      // Stage 1: Confetti burst
      setStage('confetti');

      // Stage 2: Celebration message
      setTimeout(() => setStage('celebration'), 800);

      // Stage 3: Show stats (and stay there until user action)
      setTimeout(() => setStage('stats'), 2000);

      // No auto-dismiss - modal stays until user clicks an action
    } else {
      setStage('hidden');
    }
  }, [isVisible]);

  return stage;
};
