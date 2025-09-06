import React from 'react';
import type { Hint } from '../../types';

interface HintTechniqueDescriptionProps {
    hint: Hint;
}

export const HintTechniqueDescription: React.FC<HintTechniqueDescriptionProps> = ({ hint }) => {
    const getTechniqueDescription = (technique: string | undefined) => {
        const descriptions: Record<string, string> = {
            'naked_single': 'A cell that can only contain one number',
            'hidden_single': 'A number that can only go in one place in a row, column, or box',
            'note_elimination': 'Remove notes that are no longer valid',
            'error_detection': 'Find and fix incorrect values',
            'direct_hint': 'The correct value for this cell',
            'candidate_suggestion': 'Possible values for this cell',
            'confirmation': 'This cell is correctly filled',
            'cell_selection': 'Try selecting a different cell',
            'general_strategy': 'General solving approach',
            'general_advice': 'Look for basic solving patterns',
        };

        return descriptions[technique || ''] || '';
    };

    const description = getTechniqueDescription(hint.technique);

    if (!hint.technique || !description) return null;

    return (
        <div className="mb-3 p-2 bg-white/40 rounded-lg border border-neutral-200">
            <p className="text-xs text-neutral-600 mb-1">About this technique:</p>
            <p className="text-xs text-neutral-700">
                {description}
            </p>
        </div>
    );
};
