import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GameAnalytics } from '../../types/analytics';

interface RecentGamesProps {
    games: GameAnalytics[];
}

export const RecentGames: React.FC<RecentGamesProps> = ({ games }) => {
    const { t } = useTranslation();
    const formatDuration = (duration?: number) => {
        if (!duration) return 'N/A';
        return Math.round(duration / 60000) + 'm';
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {t('analytics.recentGames')}
            </h2>

            <div className="space-y-2 sm:space-y-3">
                {games.map((game) => (
                    <div
                        key={game.gameId}
                        className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="text-sm sm:text-base font-medium capitalize truncate">
                                {t(`difficulty.${game.difficulty}`)}
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600">
                                {game.completed ? t('analytics.completed') : t('analytics.incomplete')} • {game.finalStats.totalMoves} {t('analytics.moves')}
                            </div>
                        </div>

                        <div className="text-right ml-3">
                            <div className="text-sm sm:text-base font-medium">
                                {game.accuracy.toFixed(1)}%
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600">
                                {formatDuration(game.duration)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
