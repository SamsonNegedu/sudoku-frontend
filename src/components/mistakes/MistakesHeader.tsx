import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface MistakesHeaderProps {
    mistakes: number;
    maxMistakes: number;
}

export const MistakesHeader: React.FC<MistakesHeaderProps> = ({
    mistakes,
    maxMistakes,
}) => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden bg-neutral-50 dark:bg-gray-700/50 px-6 py-8 border-b border-neutral-200 dark:border-gray-700">
            <div className="relative space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full border-2 border-red-200 dark:border-red-800">
                        <ExclamationTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('mistakes.maximumReached')}
                    </h2>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {t('mistakes.youveMade', { mistakes, maxMistakes })}
                    </p>
                </div>
            </div>
        </div>
    );
};
