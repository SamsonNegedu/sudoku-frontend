import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { getDifficultyEmoji } from '../../utils/completionUtils';

interface CelebrationHeaderProps {
    difficulty: string;
}

export const CelebrationHeader: React.FC<CelebrationHeaderProps> = ({
    difficulty,
}) => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 px-6 py-8 border-b border-blue-100 dark:border-blue-900/50">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 opacity-50 dark:opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-600 rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="relative space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-blue-100 dark:border-blue-900">
                        <CheckCircledIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                        {t('completion.puzzleSolved')}
                    </h2>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                        <span>{getDifficultyEmoji(difficulty)}</span>
                        <span>{t(`difficulty.${difficulty}`)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
