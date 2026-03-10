import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameAnalytics } from '../../../../types/analytics';

interface PerformanceTrendsProps {
    games: GameAnalytics[];
}

export const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ games }) => {
    const { t } = useTranslation();

    // Get last 10 completed games for trends
    const recentCompletedGames = useMemo(() => {
        return games
            .filter(game => game.completed)
            .slice(-10);
    }, [games]);

    // Calculate trends
    const trends = useMemo(() => {
        if (recentCompletedGames.length < 2) {
            return { accuracy: 'stable', time: 'stable', completion: 'stable' };
        }

        const midPoint = Math.floor(recentCompletedGames.length / 2);
        const firstHalf = recentCompletedGames.slice(0, midPoint);
        const secondHalf = recentCompletedGames.slice(midPoint);

        // Accuracy trend
        const firstHalfAccuracy = firstHalf.reduce((sum, g) => sum + g.accuracy, 0) / firstHalf.length;
        const secondHalfAccuracy = secondHalf.reduce((sum, g) => sum + g.accuracy, 0) / secondHalf.length;
        const accuracyDiff = secondHalfAccuracy - firstHalfAccuracy;

        // Time trend (lower is better)
        const firstHalfTime = firstHalf.reduce((sum, g) => sum + (g.duration || 0), 0) / firstHalf.length;
        const secondHalfTime = secondHalf.reduce((sum, g) => sum + (g.duration || 0), 0) / secondHalf.length;
        const timeDiff = firstHalfTime - secondHalfTime; // Reversed: positive means getting faster

        return {
            accuracy: accuracyDiff > 2 ? 'improving' : accuracyDiff < -2 ? 'declining' : 'stable',
            time: timeDiff > 60000 ? 'improving' : timeDiff < -60000 ? 'declining' : 'stable',
            accuracyChange: accuracyDiff,
            timeChange: timeDiff / 60000, // Convert to minutes
        };
    }, [recentCompletedGames]);

    // Calculate chart data with better scaling
    const chartData = useMemo(() => {
        if (recentCompletedGames.length === 0) return [];

        const accuracies = recentCompletedGames.map(g => g.accuracy);
        const minAccuracy = Math.min(...accuracies);
        const maxAccuracy = Math.max(...accuracies);

        // Use a dynamic range for better visualization
        // If all games are similar (within 10%), zoom in on that range
        const range = maxAccuracy - minAccuracy;
        const useZoom = range < 10;

        // Add padding: 10% below min, 15% above max for breathing room
        const padding = useZoom ? 5 : 10;
        const topPadding = useZoom ? 8 : 15; // Extra padding at top

        const chartMin = Math.max(0, minAccuracy - padding);
        const chartMax = Math.min(105, maxAccuracy + topPadding); // Allow up to 105% for visual space
        const chartRange = chartMax - chartMin;

        return recentCompletedGames.map((game, index) => ({
            index: index + 1,
            accuracy: game.accuracy,
            time: game.duration || 0,
            // Scale to chart range for better visualization
            displayY: ((game.accuracy - chartMin) / chartRange) * 100,
            chartMin,
            chartMax,
        }));
    }, [recentCompletedGames]);

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return '↗️';
            case 'declining': return '↘️';
            default: return '→';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'improving': return 'text-success-600 dark:text-success-400';
            case 'declining': return 'text-error-600 dark:text-error-400';
            default: return 'text-gray-600 dark:text-gray-300';
        }
    };

    if (recentCompletedGames.length < 2) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-600 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    {t('analytics.performanceTrends')}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-gray-300">
                    {t('analytics.needMoreGames')}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-600 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {t('analytics.performanceTrends')}
            </h2>

            {/* Trend Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 dark:bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm text-neutral-600 dark:text-gray-300">
                            {t('analytics.accuracy')}
                        </span>
                        <span className={`text-lg font-bold ${getTrendColor(trends.accuracy)}`}>
                            {getTrendIcon(trends.accuracy)}
                        </span>
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {trends.accuracyChange !== undefined && (trends.accuracyChange > 0 ? '+' : '')}{trends.accuracyChange?.toFixed(1) || '0.0'}%
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-gray-500">
                        {t('analytics.vsEarlierGames')}
                    </div>
                </div>

                <div className="bg-neutral-50 dark:bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm text-neutral-600 dark:text-gray-300">
                            {t('analytics.speed')}
                        </span>
                        <span className={`text-lg font-bold ${getTrendColor(trends.time)}`}>
                            {getTrendIcon(trends.time)}
                        </span>
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {trends.timeChange !== undefined && (
                            trends.timeChange > 0
                                ? `${Math.abs(trends.timeChange).toFixed(1)} mins faster`
                                : `${Math.abs(trends.timeChange).toFixed(1)} mins slower`
                        )}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-gray-500">
                        {t('analytics.vsEarlierGames')}
                    </div>
                </div>
            </div>

            {/* Line Chart */}
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {t('analytics.accuracyTrend')} ({t('analytics.last10Games')})
                    </div>
                    {chartData.length > 0 && chartData[0].chartMin > 0 && (
                        <div className="text-xs text-neutral-500 dark:text-gray-500 italic">
                            Zoomed: {chartData[0].chartMin.toFixed(0)}%-{chartData[0].chartMax.toFixed(0)}%
                        </div>
                    )}
                </div>
                <div className="relative h-40 pl-14 pr-4">
                    {/* Y-axis labels - dynamic based on data */}
                    {chartData.length > 0 && (
                        <>
                            <div className="absolute left-0 top-0 text-xs font-semibold text-gray-700 dark:text-gray-300 w-12 text-right pr-2">
                                {chartData[0].chartMax.toFixed(0)}%
                            </div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-12 text-right pr-2">
                                {((chartData[0].chartMax + chartData[0].chartMin) / 2).toFixed(0)}%
                            </div>
                            <div className="absolute left-0 bottom-0 text-xs font-semibold text-gray-700 dark:text-gray-300 w-12 text-right pr-2">
                                {chartData[0].chartMin.toFixed(0)}%
                            </div>
                        </>
                    )}

                    {/* Chart area with border */}
                    <div className="relative h-full border-l-2 border-b-2 border-neutral-300 dark:border-gray-600 ml-2">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-dashed border-neutral-200 dark:border-gray-600"></div>
                            <div className="border-t border-dashed border-neutral-200 dark:border-gray-600"></div>
                            <div className="border-t border-dashed border-neutral-200 dark:border-gray-600"></div>
                        </div>

                        {/* Line chart */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Draw line connecting points */}
                            {chartData.length > 1 && (
                                <polyline
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={chartData.map((data, index) => {
                                        const x = (index / (chartData.length - 1)) * 100;
                                        const y = 100 - data.displayY;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                />
                            )}

                            {/* Draw points */}
                            {chartData.map((data, index) => {
                                const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                                const y = 100 - data.displayY;
                                return (
                                    <g key={index}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r="2"
                                            fill="#3b82f6"
                                            stroke="white"
                                            strokeWidth="0.5"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                        <title>Game {data.index}: {data.accuracy.toFixed(1)}%</title>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 ml-2">
                        {chartData.map((data, index) => {
                            const showLabel = chartData.length <= 5 ||
                                index === 0 ||
                                index === chartData.length - 1 ||
                                index % Math.ceil(chartData.length / 5) === 0;
                            return showLabel ? (
                                <div key={index} className="text-xs text-neutral-500 dark:text-gray-500 flex-1 text-center">
                                    {data.index}
                                </div>
                            ) : <div key={index} className="flex-1" />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
