import React from 'react';
import { ModeIndicator, ControlButtons, NumberGrid } from './numberpad/index';

interface NumberPadProps {
    onNumberClick: (number: number) => void;
    onClear: () => void;
    onToggleNote: () => void;
    onHint: () => void;
    onUndo: () => void;
    inputMode: 'pen' | 'pencil';
    disabled?: boolean;
    canUndo?: boolean;
    hintsUsed?: number;
    maxHints?: number;
    completedNumbers?: number[]; // Array of numbers that have been completed (all 9 placed)
    selectedCell?: { row: number; col: number } | null;
    isPlaying?: boolean;
    isPaused?: boolean;
    onPause?: () => void;
    onResume?: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({
    onNumberClick,
    onClear,
    onToggleNote,
    onHint,
    onUndo,
    inputMode,
    disabled = false,
    canUndo = false,
    hintsUsed = 0,
    maxHints = 3,
    completedNumbers = [],
    selectedCell,
    isPlaying = false,
    isPaused = false,
    onPause,
    onResume,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl px-1 sm:px-4 py-3 sm:py-4 shadow-sm border border-neutral-200 dark:border-gray-700">
            {/* Mode indicator */}
            <ModeIndicator inputMode={inputMode} />

            {/* Two-row layout: Controls on top, Numbers on bottom */}
            <div className="flex flex-col gap-4">
                {/* Top Row: Control buttons */}
                <ControlButtons
                    onUndo={onUndo}
                    onClear={onClear}
                    onToggleNote={onToggleNote}
                    onHint={onHint}
                    inputMode={inputMode}
                    disabled={disabled}
                    canUndo={canUndo}
                    hintsUsed={hintsUsed}
                    maxHints={maxHints}
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onPause={onPause}
                    onResume={onResume}
                />

                {/* Bottom Row: Number buttons */}
                <NumberGrid
                    onNumberClick={onNumberClick}
                    inputMode={inputMode}
                    disabled={disabled}
                    completedNumbers={completedNumbers}
                    selectedCell={selectedCell}
                />
            </div>
        </div>
    );
};
