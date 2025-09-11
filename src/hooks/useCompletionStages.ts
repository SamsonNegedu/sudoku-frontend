import { useEffect, useState } from 'react';

type CompletionStage = 'hidden' | 'confetti' | 'stats';

export const useCompletionStages = (isVisible: boolean) => {
  const [stage, setStage] = useState<CompletionStage>('hidden');

  useEffect(() => {
    if (isVisible) {
      // Stage 1: Confetti burst
      setStage('confetti');

      // Stage 2: Show stats directly (skip celebration stage)
      setTimeout(() => setStage('stats'), 1200);

      // No auto-dismiss - modal stays until user clicks an action
    } else {
      setStage('hidden');
    }
  }, [isVisible]);

  return stage;
};
