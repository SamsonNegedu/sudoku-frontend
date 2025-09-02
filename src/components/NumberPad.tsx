import React from 'react';
import { Button } from '@radix-ui/themes';
import {
    ResetIcon,
    Pencil1Icon,
    Pencil2Icon,
    TrashIcon,
    QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';

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
}) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-neutral-200">
            {/* Mode indicator */}
            <div className="flex flex-col items-center mb-3 space-y-1">
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${inputMode === 'pen'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                    {inputMode === 'pen' ? '🖊️ Writing Mode' : '✏️ Notes Mode'}
                </div>

            </div>

            {/* Two-row layout: Controls on top, Numbers on bottom */}
            <div className="flex flex-col gap-3">

                {/* Top Row: Control buttons */}
                <div className="flex justify-center gap-2">
                    <Button
                        onClick={onUndo}
                        disabled={!canUndo}
                        size="2"
                        variant={!canUndo ? "soft" : "solid"}
                        color={!canUndo ? "gray" : "blue"}
                        className={`w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center text-sm ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Undo last move"
                        title={!canUndo ? "No moves to undo" : "Undo (Ctrl+Z)"}
                    >
                        <ResetIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                        onClick={onToggleNote}
                        disabled={disabled}
                        size="2"
                        variant="solid"
                        color="blue"
                        className="w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center text-sm"
                        aria-label={`Currently in ${inputMode} mode. Click to switch to ${inputMode === 'pen' ? 'notes' : 'writing'} mode`}
                        title={`Current: ${inputMode === 'pen' ? 'Writing' : 'Notes'} Mode`}
                    >
                        {inputMode === 'pen' ? <Pencil1Icon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pencil2Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </Button>

                    <Button
                        onClick={onClear}
                        disabled={disabled}
                        size="2"
                        variant="solid"
                        color="red"
                        className="w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center text-sm"
                        aria-label="Clear cell"
                        title="Clear cell"
                    >
                        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                        onClick={onHint}
                        disabled={hintsUsed >= maxHints}
                        size="2"
                        variant={hintsUsed >= maxHints ? "soft" : "solid"}
                        color={hintsUsed >= maxHints ? "gray" : "blue"}
                        className={`w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center text-sm ${hintsUsed >= maxHints ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label={`Get hint (${maxHints - hintsUsed} remaining)`}
                        title={hintsUsed >= maxHints ? 'No hints remaining' : `Hint (${maxHints - hintsUsed} remaining)`}
                    >
                        <QuestionMarkCircledIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                </div>

                {/* Bottom Row: Number buttons */}
                <div className="flex justify-center gap-1 sm:gap-3 flex-wrap sm:flex-nowrap">
                    {numbers.map((number) => {
                        const isCompleted = completedNumbers.includes(number);
                        const isDisabled = disabled || isCompleted;

                        return (
                            <div key={number} className="relative">
                                <Button
                                    onClick={() => onNumberClick(number)}
                                    disabled={isDisabled}
                                    size="2"
                                    variant={isCompleted ? "soft" : "solid"}
                                    color={isCompleted ? "gray" : "blue"}
                                    className={`w-8 h-8 sm:w-16 sm:h-16 font-bold text-sm sm:text-xl transition-all duration-200 ${!isCompleted && !disabled
                                        ? 'hover:scale-105 active:scale-95'
                                        : ''
                                        } flex items-center justify-center ${inputMode === 'pencil' && !isCompleted ? 'italic' : ''
                                        } ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''
                                        }`}
                                    aria-label={
                                        isCompleted
                                            ? `Number ${number} is completed (all 9 placed)`
                                            : `${inputMode === 'pen' ? 'Enter' : 'Add note'} ${number}`
                                    }
                                    title={
                                        isCompleted
                                            ? `Number ${number} is completed (9/9 placed)`
                                            : selectedCell
                                                ? `${inputMode === 'pen' ? 'Write' : 'Note'} ${number} in row ${selectedCell.row + 1}, column ${selectedCell.col + 1}`
                                                : `Click to ${inputMode === 'pen' ? 'place' : 'note'} ${number} (will auto-select first empty cell)`
                                    }
                                >
                                    {number}
                                </Button>
                                {isCompleted && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold shadow-sm">
                                        ✓
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
