import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { HintTargetCells } from './HintTargetCells';
import { HintSuggestedValue } from './HintSuggestedValue';
import { HintTechniqueDescription } from './HintTechniqueDescription';
import type { Hint } from '../../../../types';

interface HintContentProps {
    hint: Hint;
    onClose: () => void;
}

export const HintContent: React.FC<HintContentProps> = ({ hint, onClose }) => {
    const { t } = useTranslation();

    return (
        <>
            {/* Hint Message */}
            <div className="mb-2 lg:mb-3">
                <p className="text-neutral-700 dark:text-gray-300 text-xs lg:text-sm leading-snug lg:leading-relaxed">
                    {hint.message}
                </p>
            </div>

            {/* Suggested Value - Show on mobile, full details on desktop */}
            <HintSuggestedValue hint={hint} />

            {/* Target Cells Display - Desktop only */}
            <div className="hidden lg:block">
                <HintTargetCells hint={hint} />
            </div>

            {/* Technique Description - Desktop only */}
            <div className="hidden lg:block">
                <HintTechniqueDescription hint={hint} />
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
                <Button
                    onClick={onClose}
                    variant="secondary"
                    size="sm"
                    className="text-xs lg:text-sm h-7 lg:h-9"
                >
                    {t('hints.gotIt')}
                </Button>
            </div>
        </>
    );
};
