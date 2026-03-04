import React from 'react';
import { HintHeader } from './hints/HintHeader';
import { HintContent } from './hints/HintContent';
import { getHintColor } from '../utils/hintUtils';
import { Card } from '@/components/ui/card';
import type { Hint } from '../types';

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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] lg:w-full pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      <Card className={`${getHintColor(hint)} border-2 shadow-2xl`}>
        <div className="p-4">
          <HintHeader hint={hint} onClose={onClose} />
          <HintContent hint={hint} onClose={onClose} />
        </div>
      </Card>
    </div>
  );
};
