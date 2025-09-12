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
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">{t('game.difficulty')}</span>
                <span className="font-semibold capitalize text-blue-600">
                    {t(`difficulty.${difficulty}`)}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">{t('completion.time')}</span>
                <span className="font-semibold text-neutral-800 tabular-nums">
                    {completionTime}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">{t('completion.mistakes')}</span>
                <span className="font-semibold text-neutral-800 tabular-nums">
                    {mistakes}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="font-medium text-blue-700">{t('completion.performance')}</span>
                <span className="font-semibold text-blue-700">
                    {performance.emoji} {performance.rating}
                </span>
            </div>
        </div>
    );
};
