import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { HintIcon } from './HintIcon';
import type { Hint } from '../../../../types';

interface HintHeaderProps {
    hint: Hint;
    onClose: () => void;
}

export const HintHeader: React.FC<HintHeaderProps> = ({ hint, onClose }) => {
    const { t } = useTranslation();

    const getHintTypeLabel = () => {
        if (hint.autoFill) {
            return t('hints.autoFilled');
        }

        switch (hint.type) {
            case 'cell':
                return t('hints.cellHint');
            case 'technique':
                return t('hints.techniqueHint');
            case 'note':
                return t('hints.notesHint');
            default:
                return t('hints.hint');
        }
    };

    return (
        <div className="flex items-center justify-between mb-1.5 lg:mb-3">
            <div className="flex items-center gap-1.5 lg:gap-2">
                <div className="hidden lg:block">
                    <HintIcon hint={hint} />
                </div>
                <h3 className="font-semibold text-xs lg:text-base text-neutral-800 dark:text-gray-100">
                    {getHintTypeLabel()}
                </h3>
            </div>
            <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="p-0.5 lg:p-1 h-auto hover:bg-neutral-200/50 dark:hover:bg-gray-700/50"
            >
                <CrossCircledIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Button>
        </div>
    );
};
