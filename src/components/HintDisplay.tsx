import React from 'react';
import { useHintPositioning } from '../hooks/useHintPositioning';
import { useHintModal } from '../hooks/useHintModal';
import { HintHeader } from './hints/HintHeader';
import { HintContent } from './hints/HintContent';
import { getHintColor } from '../utils/hintUtils';
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
  const position = useHintPositioning(isVisible);
  const { fadeOut, modalRef, handleClose } = useHintModal(isVisible, onClose);

  if (!hint || !isVisible) return null;

  return (
    <div
      className={`fixed z-40 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      style={{
        top: typeof position.top === 'number' ? `${position.top}px` : position.top,
        left: typeof position.left === 'number' ? `${position.left}px` : position.left,
        transform: position.transform,
      }}
    >
      <div
        ref={modalRef}
        className={`max-w-md mx-auto p-4 rounded-xl shadow-lg border-2 ${getHintColor(hint)}`}
      >
        <HintHeader hint={hint} onClose={handleClose} />
        <HintContent hint={hint} onClose={handleClose} />
      </div>
    </div>
  );
};
