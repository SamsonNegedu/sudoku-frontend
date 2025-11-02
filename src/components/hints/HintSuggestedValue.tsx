import React from 'react';
import type { Hint } from '../../types';

interface HintSuggestedValueProps {
    hint: Hint;
}

export const HintSuggestedValue: React.FC<HintSuggestedValueProps> = ({ hint }) => {
    if (!hint.suggestedValue || hint.autoFill) return null;

    return (
        <div className="mb-3 p-2 bg-white/60 dark:bg-gray-700/40 rounded-lg border border-neutral-200 dark:border-gray-600">
            <p className="text-xs text-neutral-600 dark:text-gray-400 mb-1">Suggested Value:</p>
            <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-bold text-lg rounded flex items-center justify-center">
                    {hint.suggestedValue}
                </span>
                <span className="text-sm text-neutral-700 dark:text-gray-300">
                    Try placing this number
                </span>
            </div>
        </div>
    );
};
