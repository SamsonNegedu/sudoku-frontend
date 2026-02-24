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

    // Consistent sizing - minimum 44px touch targets on mobile
    const sizeClasses = 'w-11 h-11 sm:w-16 sm:h-16'; // 44px mobile, 64px desktop

    return (
        <div className="relative">
            <Button
                onClick={() => onClick(number)}
                disabled={isDisabled}
                size="2"
                variant={isCompleted ? "soft" : "solid"}
                color={isCompleted ? "gray" : undefined}
                className={`${sizeClasses} font-bold text-base sm:text-xl transition-all duration-200 flex items-center justify-center rounded-lg ${!isCompleted && !disabled
                    ? 'hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white dark:bg-blue-700 dark:hover:bg-blue-600'
                    : isCompleted ? 'dark:bg-gray-600 dark:text-gray-300' : 'dark:bg-gray-700 dark:text-gray-100'
                    } ${inputMode === 'pencil' && !isCompleted ? 'italic ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-800' : ''
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-gray-800">
                    ✓
                </span>
            )}
        </div>
    );
};
