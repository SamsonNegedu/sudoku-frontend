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
            <div className="flex flex-col gap-4">

                {/* Top Row: Control buttons - reordered for better UX */}
                <div className="flex justify-center gap-3 sm:gap-4">

                    <Button
                        onClick={onUndo}
                        disabled={!canUndo}
                        size="2"
                        variant="outline"
                        color={!canUndo ? "gray" : "blue"}
                        className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white hover:bg-blue-50 ${!canUndo ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : 'border-blue-500 text-blue-600'
                            }`}
                        aria-label="Undo last move"
                        title={!canUndo ? "No moves to undo" : "Undo (Ctrl+Z)"}
                    >
                        <ResetIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                        onClick={onClear}
                        disabled={disabled}
                        size="2"
                        variant="outline"
                        color="red"
                        className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white hover:bg-red-50 ${disabled ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : 'border-red-500 text-red-600'
                            }`}
                        aria-label="Clear cell"
                        title="Clear cell"
                    >
                        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <div className="relative">
                        <Button
                            onClick={onToggleNote}
                            disabled={disabled}
                            size="2"
                            variant="outline"
                            color={inputMode === 'pencil' ? "green" : "blue"}
                            className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white ${disabled ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : inputMode === 'pencil' ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                }`}
                            aria-label={`Currently in ${inputMode} mode. Click to switch to ${inputMode === 'pen' ? 'notes' : 'writing'} mode`}
                            title={`Current: ${inputMode === 'pen' ? 'Writing' : 'Notes'} Mode`}
                        >
                            {inputMode === 'pen' ? <Pencil1Icon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pencil2Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </Button>
                        {/* Notes mode status overlay - top right corner */}
                        <div className={`absolute -top-1 -right-1 text-[8px] font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg border-2 border-white ${inputMode === 'pencil' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                            {inputMode === 'pencil' ? 'ON' : 'OFF'}
                        </div>
                    </div>

                    <div className="relative">
                        <Button
                            onClick={onHint}
                            disabled={hintsUsed >= maxHints}
                            size="2"
                            variant="outline"
                            color={hintsUsed >= maxHints ? "gray" : "blue"}
                            className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white ${hintsUsed >= maxHints ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                }`}
                            aria-label={`Get hint (${maxHints - hintsUsed} remaining)`}
                            title={hintsUsed >= maxHints ? 'No hints remaining' : `Hint (${maxHints - hintsUsed} remaining)`}
                        >
                            <QuestionMarkCircledIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        {/* Remaining hints count overlay - top right corner */}
                        {hintsUsed < maxHints && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg border-2 border-white">
                                {maxHints - hintsUsed}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Number buttons */}
                <div className="flex justify-center gap-3 sm:gap-4 sm:flex-nowrap">
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
                                    className={`w-8 h-8 sm:w-16 sm:h-16 font-bold text-base sm:text-xl transition-all duration-200  ${!isCompleted && !disabled
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
