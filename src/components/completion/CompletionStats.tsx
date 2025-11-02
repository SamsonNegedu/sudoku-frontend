import React from 'react';
import { useTranslation } from 'react-i18next';
import { getPerformanceRating, } from '../../utils/completionUtils';

interface CompletionStatsProps {
    difficulty: string;
    completionTime: string;
    mistakes: number;
}

export const CompletionStats: React.FC<CompletionStatsProps> = ({
    difficulty,
    completionTime,
    mistakes,
}) => {
    const { t } = useTranslation();
    const performance = getPerformanceRating(mistakes);

    return (
        <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-neutral-600 dark:text-gray-400">{t('game.difficulty')}</span>
                <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                    {t(`difficulty.${difficulty}`)}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-neutral-600 dark:text-gray-400">{t('completion.time')}</span>
                <span className="font-semibold text-neutral-800 dark:text-gray-100 tabular-nums">
                    {completionTime}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-neutral-600 dark:text-gray-400">{t('completion.mistakes')}</span>
                <span className="font-semibold text-neutral-800 dark:text-gray-100 tabular-nums">
                    {mistakes}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                <span className="font-medium text-blue-700 dark:text-blue-300">{t('completion.performance')}</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {performance.emoji} {performance.rating}
                </span>
            </div>
        </div>
    );
};
