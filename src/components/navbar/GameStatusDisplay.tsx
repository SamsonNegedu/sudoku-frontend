import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameTimer } from '../GameTimer';
import type { Difficulty } from '../../types';

interface GameStatusDisplayProps {
    isPlaying: boolean;
    isPaused: boolean;
    startTime?: Date;
    isCompleted: boolean;
    pauseStartTime?: Date;
    totalPausedTime: number;
    pausedElapsedTime?: number;
    currentTime?: Date;
    currentDifficulty?: Difficulty;
    hintsUsed: number;
    maxHints: number;
}

export const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({
    isPlaying,
    isPaused,
    startTime,
    isCompleted,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,
    currentTime,
    currentDifficulty,
    hintsUsed,
    maxHints,
}) => {
    const { t } = useTranslation();
    if (!isPlaying && !isPaused) return null;

    return (
        <div className="hidden lg:flex items-center space-x-6">
            <GameTimer
                startTime={startTime}
                isPaused={isPaused}
                isCompleted={isCompleted}
                pauseStartTime={pauseStartTime}
                totalPausedTime={totalPausedTime}
                pausedElapsedTime={pausedElapsedTime}
                currentTime={currentTime}
            />

            <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                    <span>Difficulty:</span>
                    <span className="font-medium capitalize text-neutral-800">
                        {currentDifficulty ? t(`difficulty.${currentDifficulty}`) : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span>{t('game.hints')}:</span>
                    <span className="font-medium text-neutral-800">
                        {hintsUsed}/{maxHints}
                    </span>
                </div>
            </div>
        </div>
    );
};
