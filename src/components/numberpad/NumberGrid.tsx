import React from 'react';
import { NumberButton } from '../shared/index';

interface NumberGridProps {
    onNumberClick: (number: number) => void;
    inputMode: 'pen' | 'pencil';
    disabled?: boolean;
    completedNumbers?: number[];
    selectedCell?: { row: number; col: number } | null;
}

export const NumberGrid: React.FC<NumberGridProps> = ({
    onNumberClick,
    inputMode,
    disabled = false,
    completedNumbers = [],
    selectedCell,
}) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {numbers.map((number) => {
                const isCompleted = completedNumbers.includes(number);

                return (
                    <NumberButton
                        key={number}
                        number={number}
                        onClick={onNumberClick}
                        disabled={disabled}
                        isCompleted={isCompleted}
                        inputMode={inputMode}
                        selectedCell={selectedCell}
                    />
                );
            })}
        </div>
    );
};
