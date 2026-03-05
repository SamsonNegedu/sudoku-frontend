import React from 'react';
import { HintHeader } from './HintHeader';
import { HintContent } from './HintContent';
import { getHintColor } from '../../../../utils/hintUtils';
import { Card } from '@/components/ui/card';
import type { Hint } from '../../../../types/';

interface HintDisplayProps {
  hint: Hint | null;
  onClose: () => void;
  isVisible: boolean;
}

export const HintDisplay: React.FC<HintDisplayProps> = ({
  hint,
  onClose,
  isVisible,
}) => {
  if (!hint || !isVisible) return null;

  return (
    <div
      className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-1rem)] 
                 lg:right-1 lg:left-auto lg:-translate-x-1/2 lg:top-24 lg:max-w-lg
                 pointer-events-auto"
      role="alert"
      aria-live="polite"
    >
      <Card className={`${getHintColor(hint)} border-2 shadow-xl`}>
        <div className="p-2 lg:p-4">
          <HintHeader hint={hint} onClose={onClose} />
          <HintContent hint={hint} onClose={onClose} />
        </div>
      </Card>
    </div>
  );
};
