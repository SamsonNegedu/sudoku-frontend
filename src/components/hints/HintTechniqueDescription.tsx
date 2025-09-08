import React from 'react';
import type { Hint } from '../../types';

interface HintTechniqueDescriptionProps {
    hint: Hint;
}

export const HintTechniqueDescription: React.FC<HintTechniqueDescriptionProps> = ({ hint }) => {
    // Use detailed explanation from hint if available, otherwise fall back to generic descriptions
    const getDescription = () => {
        // First, check if hint has a detailed explanation
        if (hint.detailedExplanation) {
            return hint.detailedExplanation;
        }

        // Fall back to generic technique descriptions
        const descriptions: Record<string, string> = {
            'naked_single': 'A cell that can only contain one number based on the existing numbers in its row, column, and 3×3 box.',
            'hidden_single': 'A number that can only go in one place in a row, column, or box.',
            'naked_pair': 'Two cells in the same unit that can only contain the same two numbers, eliminating those numbers from other cells.',
            'pointing_pair': 'All candidates for a number in a box are confined to a single row or column.',
            'box_line_reduction': 'All candidates for a number in a row or column are confined to a single box.',
            'x_wing': 'A rectangular pattern that allows elimination of candidates.',
            'xy_wing': 'A pattern with a pivot and two pincers that eliminates candidates.',
            'swordfish': 'A 3×3 pattern that allows elimination of candidates across rows and columns.',
            'note_elimination': 'Remove notes that are no longer valid',
            'error_detection': 'Find and fix incorrect values',
            'direct_hint': 'The correct value for this cell',
            'candidate_suggestion': 'Possible values for this cell',
            'confirmation': 'This cell is correctly filled',
            'cell_selection': 'Try selecting a different cell',
            'general_strategy': 'General solving approach',
            'general_advice': 'Look for basic solving patterns',
        };

        return descriptions[hint.technique || ''] || '';
    };

    const description = getDescription();

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
