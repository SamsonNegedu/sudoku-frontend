import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@radix-ui/themes';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { HintIcon } from './HintIcon';
import type { Hint } from '../../types';

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
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <HintIcon hint={hint} />
                <h3 className="font-semibold text-neutral-800 dark:text-gray-100">
                    {getHintTypeLabel()}
                </h3>
            </div>
            <Button
                onClick={onClose}
                size="1"
                variant="ghost"
                color="gray"
                className="p-1 hover:bg-neutral-200/50 dark:hover:bg-gray-700/50"
            >
                <CrossCircledIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};
