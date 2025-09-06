import React from 'react';
import type { UserAnalytics } from '../../types/analytics';

interface OverviewStatsProps {
    userAnalytics: UserAnalytics;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ userAnalytics }) => {
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
                <div className="text-xs sm:text-sm text-neutral-600">Games Played</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {overallStats.completedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">Completed</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-red-600">
                    {abandonedGames}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">Abandoned</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {completionRate}%
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">Completion Rate</div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">
                    {avgTimeMinutes}m
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">Avg Time</div>
            </div>
        </div>
    );
};
