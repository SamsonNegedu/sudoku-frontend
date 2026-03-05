import React from 'react';
import { ConfettiEffect } from './ConfettiEffect';

interface CompletionAnimationProps {
  isVisible: boolean;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Confetti particles - celebration effect only */}
      <ConfettiEffect isVisible={true} />
    </>
  );
};
