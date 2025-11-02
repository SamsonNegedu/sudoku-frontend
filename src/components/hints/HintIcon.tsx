import React from 'react';
import { InfoCircledIcon, Pencil2Icon } from '@radix-ui/react-icons';
import type { Hint } from '../../types';

interface HintIconProps {
    hint: Hint;
}

export const HintIcon: React.FC<HintIconProps> = ({ hint }) => {
    if (hint.autoFill) {
        return (
            <div className="w-5 h-5 flex items-center justify-center text-green-600 dark:text-green-400">
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
            return <InfoCircledIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        case 'note':
            return <Pencil2Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
        default:
            return (
                <div className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <span className="text-lg">💡</span>
                </div>
            );
    }
};
