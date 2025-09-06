import React from 'react';
import { ActionButton } from '../shared/index';

interface GameStateControlsProps {
    onNewGame: () => void;
    onPause: () => void;
    onResume: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    disabled?: boolean;
}

export const GameStateControls: React.FC<GameStateControlsProps> = ({
    onNewGame,
    onPause,
    onResume,
    isPlaying,
    isPaused,
    disabled = false,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {!isPlaying ? (
                <ActionButton
                    onClick={onNewGame}
                    disabled={disabled}
                    aria-label="Start new game"
                >
                    🆕 New Game
                </ActionButton>
            ) : (
                <>
                    {isPaused ? (
                        <ActionButton
                            onClick={onResume}
                            disabled={disabled}
                            aria-label="Resume game"
                        >
                            ▶️ Resume
                        </ActionButton>
                    ) : (
                        <ActionButton
                            onClick={onPause}
                            disabled={disabled}
                            aria-label="Pause game"
                        >
                            ⏸️ Pause
                        </ActionButton>
                    )}
                </>
            )}
        </div>
    );
};
