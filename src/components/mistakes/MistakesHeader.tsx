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
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 px-6 py-8 border-b border-red-100 dark:border-red-900/50">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 opacity-50 dark:opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-200 dark:bg-red-600 rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="relative space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-red-100 dark:border-red-900">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
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
