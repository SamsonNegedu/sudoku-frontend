import React from 'react';
import { Button } from '@radix-ui/themes';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { HintIcon } from './HintIcon';
import type { Hint } from '../../types';

interface HintHeaderProps {
    hint: Hint;
    onClose: () => void;
}

export const HintHeader: React.FC<HintHeaderProps> = ({ hint, onClose }) => {
    const getHintTypeLabel = () => {
        if (hint.autoFill) {
            return 'Auto-filled';
        }

        switch (hint.type) {
            case 'cell':
                return 'Cell Hint';
            case 'technique':
                return 'Technique Hint';
            case 'note':
                return 'Notes Hint';
            default:
                return 'Hint';
        }
    };

    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <HintIcon hint={hint} />
                <h3 className="font-semibold text-neutral-800">
                    {getHintTypeLabel()}
                </h3>
            </div>
            <Button
                onClick={onClose}
                size="1"
                variant="ghost"
                color="gray"
                className="p-1 hover:bg-neutral-200/50"
            >
                <CrossCircledIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};
