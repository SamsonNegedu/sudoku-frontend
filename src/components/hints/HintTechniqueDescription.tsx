import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Hint } from '../../types';

interface HintTechniqueDescriptionProps {
    hint: Hint;
}

export const HintTechniqueDescription: React.FC<HintTechniqueDescriptionProps> = ({ hint }) => {
    const { t } = useTranslation();

    // Use detailed explanation from hint if available, otherwise fall back to generic descriptions
    const getDescription = () => {
        // First, check if hint has a detailed explanation
        if (hint.detailedExplanation) {
            return hint.detailedExplanation;
        }

        // Fall back to translated technique descriptions
        if (hint.technique) {
            return t(`hints.techniques.${hint.technique}`, { defaultValue: '' });
        }

        return '';
    };

    const description = getDescription();

    if (!hint.technique || !description) return null;

    return (
        <div className="mb-3 p-2 bg-white/40 dark:bg-gray-700/30 rounded-lg border border-neutral-200 dark:border-gray-600">
            <p className="text-xs text-neutral-600 dark:text-gray-400 mb-1">{t('hints.aboutTechnique')}</p>
            <p className="text-xs text-neutral-700 dark:text-gray-300">
                {description}
            </p>
        </div>
    );
};
