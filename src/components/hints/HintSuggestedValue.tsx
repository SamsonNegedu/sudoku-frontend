import React from 'react';
import type { Hint } from '../../types';

interface HintSuggestedValueProps {
    hint: Hint;
}

export const HintSuggestedValue: React.FC<HintSuggestedValueProps> = ({ hint }) => {
    if (!hint.suggestedValue || hint.autoFill) return null;

    return (
        <div className="mb-3 p-2 bg-white/60 rounded-lg border border-neutral-200">
            <p className="text-xs text-neutral-600 mb-1">Suggested Value:</p>
            <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg rounded flex items-center justify-center">
                    {hint.suggestedValue}
                </span>
                <span className="text-sm text-neutral-700">
                    Try placing this number
                </span>
            </div>
        </div>
    );
};
