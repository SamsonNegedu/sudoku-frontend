import React from 'react';
import type { Hint } from '../../../../types';

interface HintSuggestedValueProps {
    hint: Hint;
}

export const HintSuggestedValue: React.FC<HintSuggestedValueProps> = ({ hint }) => {
    if (!hint.suggestedValue || hint.autoFill) return null;

    return (
        <div className="mb-1.5 lg:mb-3 p-1.5 lg:p-2 bg-white/60 dark:bg-gray-800/90 rounded border border-neutral-200 dark:border-gray-600">
            <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-success-500 to-success-600 dark:from-success-600 dark:to-success-700 text-white font-bold text-sm lg:text-lg rounded flex items-center justify-center">
                    {hint.suggestedValue}
                </span>
                <span className="text-xs lg:text-sm text-neutral-700 dark:text-gray-200">
                    <span className="lg:hidden">Try this</span>
                    <span className="hidden lg:inline">Try placing this number</span>
                </span>
            </div>
        </div>
    );
};
