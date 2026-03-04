import React from 'react';
import { InfoCircledIcon, Pencil2Icon } from '@radix-ui/react-icons';
import type { Hint } from '../../../../types';

interface HintIconProps {
    hint: Hint;
}

export const HintIcon: React.FC<HintIconProps> = ({ hint }) => {
    if (hint.autoFill) {
        return (
            <div className="w-5 h-5 flex items-center justify-center text-success-600 dark:text-success-400">
                <span className="text-lg">✨</span>
            </div>
        );
    }

    switch (hint.type) {
        case 'cell':
            return (
                <div className="w-5 h-5 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <span className="text-lg">💡</span>
                </div>
            );
        case 'technique':
            return <InfoCircledIcon className="w-5 h-5 text-primary-600 dark:text-primary-500" />;
        case 'note':
            return <Pencil2Icon className="w-5 h-5 text-primary-600 dark:text-primary-500" />;
        default:
            return (
                <div className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <span className="text-lg">💡</span>
                </div>
            );
    }
};
