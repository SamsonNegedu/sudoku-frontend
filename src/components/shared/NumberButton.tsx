import React from 'react';
import { Button } from '@radix-ui/themes';

interface NumberButtonProps {
    number: number;
    onClick: (number: number) => void;
    disabled?: boolean;
    isCompleted?: boolean;
    inputMode?: 'pen' | 'pencil';
    selectedCell?: { row: number; col: number } | null;
}

export const NumberButton: React.FC<NumberButtonProps> = ({
    number,
    onClick,
    disabled = false,
    isCompleted = false,
    inputMode = 'pen',
    selectedCell,
}) => {
    const isDisabled = disabled || isCompleted;

    return (
        <div className="relative">
            <Button
                onClick={() => onClick(number)}
                disabled={isDisabled}
                size="2"
                variant={isCompleted ? "soft" : "solid"}
                color={isCompleted ? "gray" : undefined}
                className={`w-8 h-8 sm:w-16 sm:h-16 font-bold text-base sm:text-xl transition-all duration-200 flex items-center justify-center ${!isCompleted && !disabled
                        ? 'hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white'
                        : ''
                    } ${inputMode === 'pencil' && !isCompleted ? 'italic' : ''
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
};
