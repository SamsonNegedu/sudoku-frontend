import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameAnalytics } from '../../../../types/analytics';

interface RecentGamesProps {
    games: GameAnalytics[];
    allGames: GameAnalytics[];
}

export const RecentGames: React.FC<RecentGamesProps> = ({ games, allGames }) => {
    const { t } = useTranslation();
    const formatDuration = (duration?: number) => {
        if (!duration) return 'N/A';
        const seconds = Math.round(duration / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.round(duration / 60000);
        return `${minutes}m`;
    };

    const formatDateTime = (game: GameAnalytics) => {
        const startDate = new Date(game.startTime);
        const endDate = game.endTime ? new Date(game.endTime) : null;
        const now = new Date();

        const formatTime = (date: Date) => {
            const isToday = date.toDateString() === now.toDateString();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const isYesterday = date.toDateString() === yesterday.toDateString();

            const timeStr = date.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            if (isToday) {
                return `Today ${timeStr}`;
            } else if (isYesterday) {
                return `Yesterday ${timeStr}`;
            } else {
                return date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            }
        };

        // If game spans multiple days, show both start and end on separate lines
        if (endDate && startDate.toDateString() !== endDate.toDateString()) {
            return (
                <div className="text-xs leading-tight">
                    <div className="text-neutral-600 dark:text-gray-300 whitespace-nowrap">{formatTime(startDate)}</div>
                    <div className="text-neutral-500 dark:text-gray-400 whitespace-nowrap">→ {formatTime(endDate)}</div>
                </div>
            );
        }

        // Otherwise just show end time (or start if not ended)
        return <span className="whitespace-nowrap text-neutral-600 dark:text-gray-300">{formatTime(endDate || startDate)}</span>;
    };

    // Calculate averages from all completed games for comparison
    const averages = useMemo(() => {
        const completedGames = allGames.filter(g => g.completed);
        if (completedGames.length === 0) return { accuracy: 0, time: 0 };

        const avgAccuracy = completedGames.reduce((sum, g) => sum + g.accuracy, 0) / completedGames.length;
        const avgTime = completedGames.reduce((sum, g) => sum + (g.duration || 0), 0) / completedGames.length;

        return { accuracy: avgAccuracy, time: avgTime };
    }, [allGames]);

    const getComparisonIndicator = (value: number, average: number, lowerIsBetter = false) => {
        const threshold = average * 0.1; // 10% threshold
        const diff = lowerIsBetter ? average - value : value - average;

        if (diff > threshold) {
            return { icon: '↗️', color: 'text-success-600 dark:text-success-400', text: 'Better' };
        } else if (diff < -threshold) {
            return { icon: '↘️', color: 'text-error-600 dark:text-error-400', text: 'Worse' };
        }
        return { icon: '→', color: 'text-gray-500 dark:text-gray-500', text: 'Average' };
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-600 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                {t('analytics.recentGames')}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-neutral-200 dark:border-gray-600">
                            <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-gray-200 w-64">
                                {t('analytics.played')}
                            </th>
                            <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-gray-200">
                                {t('analytics.difficulty')}
                            </th>
                            <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-gray-200">
                                {t('analytics.status')}
                            </th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-gray-200">
                                {t('analytics.moves')}
                            </th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-gray-200">
                                {t('analytics.accuracy')}
                            </th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-gray-200">
                                {t('analytics.time')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game, index) => (
                            <tr
                                key={game.gameId}
                                className={`border-b border-neutral-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-neutral-50 dark:bg-gray-700/30' : 'dark:bg-gray-800'
                                    }`}
                            >
                                <td className="py-3 px-2 text-neutral-600 dark:text-gray-300 w-64">
                                    {formatDateTime(game)}
                                </td>
                                <td className="py-3 px-2 capitalize text-gray-900 dark:text-gray-200">
                                    {t(`difficulty.${game.difficulty}`)}
                                </td>
                                <td className="py-3 px-2">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${game.completed
                                                ? 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300'
                                                : 'bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-300'
                                            }`}
                                    >
                                        {game.completed ? t('analytics.completed') : t('analytics.incomplete')}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-right text-gray-900 dark:text-gray-200">
                                    {game.finalStats.totalMoves}
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {game.accuracy.toFixed(1)}%
                                        </span>
                                        {game.completed && averages.accuracy > 0 && (
                                            <span
                                                className={`text-xs ${getComparisonIndicator(game.accuracy, averages.accuracy).color}`}
                                                title={getComparisonIndicator(game.accuracy, averages.accuracy).text}
                                            >
                                                {getComparisonIndicator(game.accuracy, averages.accuracy).icon}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="text-neutral-600 dark:text-gray-300">
                                            {formatDuration(game.duration)}
                                        </span>
                                        {game.completed && game.duration && averages.time > 0 && (
                                            <span
                                                className={`text-xs ${getComparisonIndicator(game.duration, averages.time, true).color}`}
                                                title={getComparisonIndicator(game.duration, averages.time, true).text}
                                            >
                                                {getComparisonIndicator(game.duration, averages.time, true).icon}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
