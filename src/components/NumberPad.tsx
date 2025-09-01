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
}) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-neutral-200">
            {/* Mode indicator */}
            <div className="flex justify-center mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${inputMode === 'pen'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                    {inputMode === 'pen' ? '🖊️ Writing Mode' : '✏️ Notes Mode'}
                </div>
            </div>

            {/* Responsive layout: mobile stacked, desktop all in one compact row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">

                {/* Mobile: Number buttons in grid, Desktop: horizontal centered */}
                <div className="flex flex-wrap justify-center gap-1 sm:gap-1 order-2 sm:order-2 sm:flex-1 sm:justify-center">
                    {numbers.map((number) => {
                        const isCompleted = completedNumbers.includes(number);
                        const isDisabled = disabled || isCompleted;

                        return (
                            <div className="relative">
                                <Button
                                    key={number}
                                    onClick={() => onNumberClick(number)}
                                    disabled={isDisabled}
                                    size="2"
                                    variant={isCompleted ? "soft" : "solid"}
                                    color={isCompleted ? "gray" : (inputMode === 'pen' ? 'indigo' : 'amber')}
                                    className={`number-button-horizontal w-8 h-8 sm:w-14 sm:h-14 font-bold text-sm sm:text-lg transition-all duration-200 ${!isCompleted && !disabled
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
                                            : `${inputMode === 'pen' ? 'Write' : 'Note'} ${number}`
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

                {/* Mobile: Control buttons row, Desktop: left side */}
                <div className="flex justify-center gap-2 order-1 sm:order-1">
                    <Button
                        onClick={onUndo}
                        disabled={!canUndo}
                        size="2"
                        variant="soft"
                        color="blue"
                        className="control-button-horizontal w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm"
                        aria-label="Undo last move"
                        title="Undo (Ctrl+Z)"
                    >
                        <ResetIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>

                    <Button
                        onClick={onToggleNote}
                        disabled={disabled}
                        size="2"
                        variant="solid"
                        color={inputMode === 'pen' ? 'indigo' : 'amber'}
                        className="control-button-horizontal w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm"
                        aria-label={`Currently in ${inputMode} mode. Click to switch to ${inputMode === 'pen' ? 'notes' : 'writing'} mode`}
                        title={`Current: ${inputMode === 'pen' ? 'Writing' : 'Notes'} Mode`}
                    >
                        {inputMode === 'pen' ? <Pencil1Icon className="w-3 h-3 sm:w-4 sm:h-4" /> : <Pencil2Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </Button>
                </div>

                {/* Mobile: Additional controls row, Desktop: right side */}
                <div className="flex justify-center gap-2 order-3 sm:order-3">
                    <Button
                        onClick={onClear}
                        disabled={disabled}
                        size="2"
                        variant="soft"
                        color="gray"
                        className="control-button-horizontal w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm"
                        aria-label="Clear cell"
                        title="Clear cell"
                    >
                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>

                    <Button
                        onClick={onHint}
                        disabled={hintsUsed >= maxHints}
                        size="2"
                        variant="soft"
                        color="orange"
                        className="control-button-horizontal w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm"
                        aria-label={`Get hint (${hintsUsed}/${maxHints} used)`}
                        title={`Hint (${hintsUsed}/${maxHints} used)`}
                    >
                        <QuestionMarkCircledIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
