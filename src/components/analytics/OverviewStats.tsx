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
            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {overallStats.totalGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.gamesPlayed')}</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {overallStats.completedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.completed')}</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-red-600">
                    {abandonedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.abandoned')}</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {completionRate}%
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.completionRate')}</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">
                    {avgTimeMinutes}m
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.avgTime')}</div>
            </div>
        </div>
    );
};
