import React from 'react';
import { ActionButton } from '../../../common';

interface GameActionControlsProps {
    onHint: () => void;
    onUndo: () => void;
    onReset: () => void;
    hintsRemaining: number;
    canUndo: boolean;
    disabled?: boolean;
}

export const GameActionControls: React.FC<GameActionControlsProps> = ({
    onHint,
    onUndo,
    onReset,
    hintsRemaining,
    canUndo,
    disabled = false,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            <ActionButton
                onClick={onHint}
                disabled={disabled || hintsRemaining <= 0}
                variant="outline"
                aria-label={`Get hint (${hintsRemaining} remaining)`}
            >
                💡 Hint ({hintsRemaining})
            </ActionButton>

            <ActionButton
                onClick={onUndo}
                disabled={disabled || !canUndo}
                variant="outline"
                aria-label="Undo last move"
            >
                ↩️ Undo
            </ActionButton>

            <ActionButton
                onClick={onReset}
                disabled={disabled}
                color="red"
                aria-label="Reset current game"
            >
                🔄 Reset
            </ActionButton>
        </div>
    );
};
