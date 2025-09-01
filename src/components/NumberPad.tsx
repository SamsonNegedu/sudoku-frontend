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
}) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="number-pad-horizontal bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
            {/* Mode indicator */}
            <div className="flex justify-center mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${inputMode === 'pen'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                    {inputMode === 'pen' ? '🖊️ Writing Mode' : '✏️ Notes Mode'}
                </div>
            </div>

            {/* Main horizontal layout */}
            <div className="flex items-center justify-center gap-4">
                {/* Undo button - Far left */}
                <Button
                    onClick={onUndo}
                    disabled={!canUndo}
                    size="3"
                    variant="soft"
                    color="blue"
                    className="control-button-horizontal w-12 h-12 flex items-center justify-center text-lg"
                    aria-label="Undo last move"
                    title="Undo (Ctrl+Z)"
                >
                    <ResetIcon />
                </Button>

                {/* Vertical divider */}
                <div className="h-8 w-px bg-neutral-300"></div>

                {/* Number buttons */}
                <div className="flex gap-2">
                    {numbers.map((number) => (
                        <Button
                            key={number}
                            onClick={() => onNumberClick(number)}
                            disabled={disabled}
                            size="3"
                            variant="solid"
                            color={inputMode === 'pen' ? 'indigo' : 'amber'}
                            className={`number-button-horizontal w-12 h-12 font-bold text-lg transition-all duration-100 hover:scale-105 active:scale-95 flex items-center justify-center ${inputMode === 'pencil' ? 'italic' : ''
                                }`}
                            aria-label={`${inputMode === 'pen' ? 'Enter' : 'Add note'} ${number}`}
                            title={`${inputMode === 'pen' ? 'Write' : 'Note'} ${number}`}
                        >
                            {number}
                        </Button>
                    ))}
                </div>

                {/* Vertical divider */}
                <div className="h-8 w-px bg-neutral-300"></div>

                {/* Control buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={onToggleNote}
                        disabled={disabled}
                        size="3"
                        variant="solid"
                        color={inputMode === 'pen' ? 'indigo' : 'amber'}
                        className="control-button-horizontal w-12 h-12 flex items-center justify-center text-lg"
                        aria-label={`Currently in ${inputMode} mode. Click to switch to ${inputMode === 'pen' ? 'notes' : 'writing'} mode`}
                        title={`Current: ${inputMode === 'pen' ? 'Writing' : 'Notes'} Mode`}
                    >
                        {inputMode === 'pen' ? <Pencil1Icon /> : <Pencil2Icon />}
                    </Button>

                    <Button
                        onClick={onClear}
                        disabled={disabled}
                        size="3"
                        variant="soft"
                        color="gray"
                        className="control-button-horizontal w-12 h-12 flex items-center justify-center text-lg"
                        aria-label="Clear cell"
                        title="Clear cell"
                    >
                        <TrashIcon />
                    </Button>

                    <Button
                        onClick={onHint}
                        disabled={hintsUsed >= maxHints}
                        size="3"
                        variant="soft"
                        color="orange"
                        className="control-button-horizontal w-12 h-12 flex items-center justify-center text-lg"
                        aria-label={`Get hint (${hintsUsed}/${maxHints} used)`}
                        title={`Hint (${hintsUsed}/${maxHints} used)`}
                    >
                        <QuestionMarkCircledIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};
