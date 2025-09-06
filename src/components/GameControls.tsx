import React from 'react';
import { GameStateControls, GameActionControls } from './controls/index';

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
            <GameStateControls
                onNewGame={onNewGame}
                onPause={onPause}
                onResume={onResume}
                isPlaying={isPlaying}
                isPaused={isPaused}
                disabled={disabled}
            />

            {/* Game action controls */}
            {isPlaying && (
                <GameActionControls
                    onHint={onHint}
                    onUndo={onUndo}
                    onReset={onReset}
                    hintsRemaining={hintsRemaining}
                    canUndo={canUndo}
                    disabled={disabled}
                />
            )}
        </div>
    );
};
