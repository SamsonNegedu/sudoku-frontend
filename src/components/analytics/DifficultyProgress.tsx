import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@radix-ui/themes';
import type { Difficulty } from '../../types';
import type { UserAnalytics } from '../../types/analytics';
import type { DifficultyProgressData } from '../../stores/analyticsStore';

interface DifficultyProgressProps {
    userAnalytics: UserAnalytics;
    selectedDifficulty: Difficulty;
    onDifficultyChange: (difficulty: Difficulty) => void;
    progressData: DifficultyProgressData;
}

export const DifficultyProgress: React.FC<DifficultyProgressProps> = ({
    userAnalytics,
    selectedDifficulty,
    onDifficultyChange,
    progressData,
}) => {
    const { t } = useTranslation();
    const formatTime = (time: number) => {
        if (!time || time === Infinity) return 'N/A';
        return time < 60000
            ? Math.round(time / 1000) + 's'
            : Math.round(time / 60000) + 'm';
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {t('analytics.difficultyProgress')}
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(userAnalytics.difficultyProgress) as Difficulty[]).map((difficulty) => (
                    <Button
                        key={difficulty}
                        onClick={() => onDifficultyChange(difficulty)}
                        variant={selectedDifficulty === difficulty ? "solid" : "outline"}
                        size="1"
                        className={`capitalize text-xs sm:text-sm px-2 sm:px-3 ${selectedDifficulty === difficulty
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {t(`difficulty.${difficulty}`)}
                    </Button>
                ))}
            </div>

            {progressData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                        <div className="text-base sm:text-lg font-semibold">
                            {progressData.gamesPlayed}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.gamesPlayed')}</div>
                    </div>

                    <div>
                        <div className="text-base sm:text-lg font-semibold">
                            {progressData.gamesCompleted}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.completed')}</div>
                    </div>

                    <div>
                        <div className="text-base sm:text-lg font-semibold">
                            {progressData.accuracy.toFixed(1)}%
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.accuracy')}</div>
                    </div>

                    <div>
                        <div className="text-base sm:text-lg font-semibold">
                            {formatTime(progressData.bestTime)}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">{t('analytics.bestTime')}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
