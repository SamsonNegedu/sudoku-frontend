import React from 'react';
import { NumberButton } from '../../../common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        <TooltipProvider delayDuration={300}>
            <div className="inline-flex gap-1 sm:gap-3 flex-nowrap">
                {numbers.map((number) => {
                const isCompleted = completedNumbers.includes(number);
                const tooltipText = isCompleted 
                    ? `Number ${number} completed (9/9 placed)` 
                    : `Press ${number} to ${inputMode === 'pen' ? 'place' : 'add note'}`;

                return (
                    <Tooltip key={number}>
                        <TooltipTrigger asChild>
                            <div>
                                <NumberButton
                                    number={number}
                                    onClick={onNumberClick}
                                    disabled={disabled}
                                    isCompleted={isCompleted}
                                    inputMode={inputMode}
                                    selectedCell={selectedCell}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            </div>
        </TooltipProvider>
    );
};
