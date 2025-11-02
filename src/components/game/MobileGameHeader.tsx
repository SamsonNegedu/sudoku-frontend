import React from 'react';
import { GameTimer } from '../GameTimer';
import type { Game } from '../../types';

interface MobileGameHeaderProps {
    currentGame: Game;
}

export const MobileGameHeader: React.FC<MobileGameHeaderProps> = ({ currentGame }) => {
    return (
        <div className="lg:hidden -mx-4 sm:mx-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 shadow-sm border border-neutral-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                    <GameTimer
                        startTime={currentGame.startTime}
                        isPaused={currentGame.isPaused}
                        isCompleted={currentGame.isCompleted}
                        pauseStartTime={currentGame.pauseStartTime}
                        totalPausedTime={currentGame.totalPausedTime}
                        pausedElapsedTime={currentGame.pausedElapsedTime}
                        currentTime={currentGame.currentTime}
                    />
                    <div className="flex items-center gap-3">
                        <span className="font-medium capitalize text-neutral-800 dark:text-gray-100">{currentGame.difficulty}</span>
                        <span className="text-neutral-700 dark:text-gray-300">H: {currentGame.hintsUsed}/{currentGame.maxHints}</span>
                        <span className={currentGame.mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-gray-100'}>
                            M: {currentGame.mistakes}{currentGame.mistakeLimitDisabled ? '/∞' : `/${currentGame.maxMistakes}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
