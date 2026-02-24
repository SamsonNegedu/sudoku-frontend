import React from 'react';
import { GameTimer } from '../GameTimer';
import { ClockIcon, LightningBoltIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import type { GameState } from '../../types';

interface MobileGameHeaderProps {
    currentGame: GameState;
}

export const MobileGameHeader: React.FC<MobileGameHeaderProps> = ({ currentGame }) => {
    return (
        <div className="lg:hidden -mx-4 sm:mx-0">
            <div className="bg-gradient-to-r from-white to-neutral-50 dark:from-gray-800 dark:to-gray-900 rounded-xl px-3 py-2.5 shadow-md border-2 border-neutral-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                    {/* Timer with icon */}
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
                        <ClockIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <GameTimer
                            startTime={currentGame.startTime}
                            isPaused={currentGame.isPaused}
                            isCompleted={currentGame.isCompleted}
                            pauseStartTime={currentGame.pauseStartTime}
                            totalPausedTime={currentGame.totalPausedTime}
                            pausedElapsedTime={currentGame.pausedElapsedTime}
                            currentTime={currentGame.currentTime}
                        />
                    </div>

                    {/* Stats with improved visual hierarchy */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Difficulty badge */}
                        <span className="font-semibold text-xs capitalize px-2 py-1 rounded-md bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-950/30 dark:to-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {currentGame.difficulty}
                        </span>

                        {/* Hints indicator */}
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                            <LightningBoltIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                {currentGame.hintsUsed}/{currentGame.maxHints}
                            </span>
                        </div>

                        {/* Mistakes indicator */}
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${currentGame.mistakes > 0
                                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                                : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                            }`}>
                            <ExclamationTriangleIcon className={`w-3 h-3 ${currentGame.mistakes > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`} />
                            <span className={`text-xs font-semibold ${currentGame.mistakes > 0
                                    ? 'text-red-700 dark:text-red-300'
                                    : 'text-green-700 dark:text-green-300'
                                }`}>
                                {currentGame.mistakes}{currentGame.mistakeLimitDisabled ? '/∞' : `/${currentGame.maxMistakes}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
