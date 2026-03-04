import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UserAnalytics } from '../../types/analytics';

interface OverviewStatsProps {
    userAnalytics: UserAnalytics;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ userAnalytics }) => {
    const { t } = useTranslation();
    const overallStats = userAnalytics.overallStats;
    const completionRate = overallStats.totalGames > 0
        ? Math.round((overallStats.completedGames / overallStats.totalGames) * 100)
        : 0;
    const avgTimeMinutes = Math.round(overallStats.averageTimePerGame / 60000);
    const abandonedGames = overallStats.totalGames - overallStats.completedGames;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-primary-600 dark:text-primary-500">
                    {overallStats.totalGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">{t('analytics.gamesPlayed')}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-success-600 dark:text-success-400">
                    {overallStats.completedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">{t('analytics.completed')}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-error-600 dark:text-error-400">
                    {abandonedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">{t('analytics.abandoned')}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-primary-700 dark:text-primary-300">
                    {completionRate}%
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">{t('analytics.completionRate')}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="text-lg sm:text-2xl font-bold text-warning-600 dark:text-warning-400">
                    {avgTimeMinutes}m
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-400">{t('analytics.avgTime')}</div>
            </div>
        </div>
    );
};
