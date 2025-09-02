import React from 'react';
import { Button } from '@radix-ui/themes';

interface GameControlsProps {
    onNewGame: () => void;
    onPause: () => void;
    onResume: () => void;
    onHint: () => void;
    onUndo: () => void;
    onReset: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    hintsUsed: number;
    maxHints: number;
    canUndo: boolean;
    disabled?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
    onNewGame,
    onPause,
    onResume,
    onHint,
    onUndo,
    onReset,
    isPlaying,
    isPaused,
    hintsUsed,
    maxHints,
    canUndo,
    disabled = false,
}) => {
    const hintsRemaining = maxHints - hintsUsed;

    return (
        <div className="game-controls space-y-3">
            {/* Game state controls */}
            <div className="flex flex-wrap gap-2">
                {!isPlaying ? (
                    <Button
                        onClick={onNewGame}
                        disabled={disabled}
                        size="2"
                        variant="solid"
                        color="blue"
                        className="control-button"
                        aria-label="Start new game"
                    >
                        🆕 New Game
                    </Button>
                ) : (
                    <>
                        {isPaused ? (
                            <Button
                                onClick={onResume}
                                disabled={disabled}
                                size="2"
                                variant="solid"
                                color="green"
                                className="control-button"
                                aria-label="Resume game"
                            >
                                ▶️ Resume
                            </Button>
                        ) : (
                            <Button
                                onClick={onPause}
                                disabled={disabled}
                                size="2"
                                variant="solid"
                                color="blue"
                                className="control-button"
                                aria-label="Pause game"
                            >
                                ⏸️ Pause
                            </Button>
                        )}
                    </>
                )}
            </div>

            {/* Game action controls */}
            {isPlaying && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={onHint}
                        disabled={disabled || hintsRemaining <= 0}
                        size="2"
                        variant="soft"
                        color="blue"
                        className="control-button"
                        aria-label={`Get hint (${hintsRemaining} remaining)`}
                    >
                        💡 Hint ({hintsRemaining})
                    </Button>

                    <Button
                        onClick={onUndo}
                        disabled={disabled || !canUndo}
                        size="2"
                        variant="soft"
                        color="blue"
                        className="control-button"
                        aria-label="Undo last move"
                    >
                        ↩️ Undo
                    </Button>

                    <Button
                        onClick={onReset}
                        disabled={disabled}
                        size="2"
                        variant="solid"
                        color="red"
                        className="control-button"
                        aria-label="Reset current game"
                    >
                        🔄 Reset
                    </Button>
                </div>
            )}
        </div>
    );
};
