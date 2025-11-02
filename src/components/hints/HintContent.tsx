import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@radix-ui/themes';
import { HintTargetCells } from './HintTargetCells';
import { HintSuggestedValue } from './HintSuggestedValue';
import { HintTechniqueDescription } from './HintTechniqueDescription';
import type { Hint } from '../../types';

interface HintContentProps {
    hint: Hint;
    onClose: () => void;
}

export const HintContent: React.FC<HintContentProps> = ({ hint, onClose }) => {
    const { t } = useTranslation();

    return (
        <>
            {/* Hint Message */}
            <div className="mb-3">
                <p className="text-neutral-700 dark:text-gray-300 text-sm leading-relaxed">
                    {hint.message}
                </p>
            </div>

            {/* Target Cells Display */}
            <HintTargetCells hint={hint} />

            {/* Suggested Value */}
            <HintSuggestedValue hint={hint} />

            {/* Technique Description */}
            <HintTechniqueDescription hint={hint} />

            {/* Action Button */}
            <div className="flex justify-end">
                <Button
                    onClick={onClose}
                    size="2"
                    variant="solid"
                    color="gray"
                    className="text-sm"
                >
                    {t('hints.gotIt')}
                </Button>
            </div>
        </>
    );
};
