import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/index';

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
                variant={isCompleted ? "secondary" : "default"}
                size="lg"
                className={cn(
                    "w-11 h-11 sm:w-16 sm:h-16 font-bold text-base sm:text-xl transition-all duration-200",
                    !isCompleted && !disabled && "hover:scale-105 active:scale-95 hover:shadow-lg",
                    isCompleted && "dark:bg-gray-600 dark:text-gray-300 opacity-60 cursor-not-allowed",
                    disabled && !isCompleted && "dark:bg-gray-700 dark:text-gray-100",
                    inputMode === 'pencil' && !isCompleted && "italic ring-2 ring-success-500 ring-offset-2 dark:ring-offset-gray-800"
                )}
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-success-500 dark:bg-success-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-gray-800">
                    ✓
                </span>
            )}
        </div>
    );
};
