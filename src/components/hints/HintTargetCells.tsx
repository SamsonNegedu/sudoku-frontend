import React from 'react';
import type { Hint } from '../../types';

interface HintTargetCellsProps {
    hint: Hint;
}

export const HintTargetCells: React.FC<HintTargetCellsProps> = ({ hint }) => {
    if (!hint.targetCells || hint.targetCells.length === 0) return null;

    return (
        <div className="mb-3 p-2 bg-white/60 dark:bg-gray-700/40 rounded-lg border border-neutral-200 dark:border-gray-600">
            <p className="text-xs text-neutral-600 dark:text-gray-400 mb-1">
                Target Cell{hint.targetCells.length > 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-1">
                {hint.targetCells.map(([row, col], index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-neutral-800 dark:bg-gray-600 text-white dark:text-gray-100 text-xs rounded font-mono"
                    >
                        R{row + 1}C{col + 1}
                    </span>
                ))}
            </div>
        </div>
    );
};
