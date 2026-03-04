import React from 'react';
import type { Hint } from '../../../../types';

interface HintTargetCellsProps {
    hint: Hint;
}

export const HintTargetCells: React.FC<HintTargetCellsProps> = ({ hint }) => {
    if (!hint.targetCells || hint.targetCells.length === 0) return null;

    return (
        <div className="mb-2 lg:mb-3 p-1.5 lg:p-2 bg-white/60 dark:bg-gray-800/90 rounded border border-neutral-200 dark:border-gray-600">
            <p className="text-[10px] lg:text-xs text-neutral-600 dark:text-gray-300 mb-0.5 lg:mb-1">
                Cell{hint.targetCells.length > 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-1">
                {hint.targetCells.map(([row, col], index) => (
                    <span
                        key={index}
                        className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-neutral-800 dark:bg-gray-700 text-white dark:text-gray-100 text-[10px] lg:text-xs rounded font-mono"
                    >
                        R{row + 1}C{col + 1}
                    </span>
                ))}
            </div>
        </div>
    );
};
