import React from 'react';
import { GameTimer } from '../GameTimer';
import { LightningBoltIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import type { GameState } from '../../../../types';

interface MobileGameHeaderProps {
    currentGame: GameState;
}

export const MobileGameHeader: React.FC<MobileGameHeaderProps> = ({ currentGame }) => {
    // Calculate completion percentage based on filled cells
    const calculateCompletionPercentage = () => {
        const totalCells = 81; // 9x9 grid
        let filledCells = 0;

        currentGame.board.forEach(row => {
            row.forEach(cell => {
                if (cell.value !== null) {
                    filledCells++;
                }
            });
        });

        return Math.round((filledCells / totalCells) * 100);
    };

    const completionPercentage = calculateCompletionPercentage();

    return (
        <div className="lg:hidden sm:mx-0 sticky top-0 z-50 bg-neutral-50 dark:bg-neutral-900 pb-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 shadow-md border-2 border-neutral-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-950/30 px-2 py-1 rounded-lg border border-primary-200 dark:border-primary-800">
                        <GameTimer
                            startTime={currentGame.startTime}
                            isPaused={currentGame.isPaused}
                            isCompleted={currentGame.isCompleted}
                            pauseStartTime={currentGame.pauseStartTime}
                            totalPausedTime={currentGame.totalPausedTime}
                            pausedElapsedTime={currentGame.pausedElapsedTime}
                            currentTime={currentGame.currentTime}
                            completionPercentage={completionPercentage}
                        />
                    </div>

                    {/* Stats with improved visual hierarchy */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Difficulty badge */}
                        <Badge
                            className="capitalize bg-primary-600 dark:bg-primary-600 
                                text-white dark:text-white 
                                border-primary-700 dark:border-primary-500 
                                font-bold shadow-sm"
                        >
                            {currentGame.difficulty}
                        </Badge>

                        {/* Hints indicator */}
                        <Badge variant="outline" className="gap-1 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                            <LightningBoltIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span className="text-amber-800 dark:text-amber-300">
                                {currentGame.hintsUsed}/{currentGame.maxHints}
                            </span>
                        </Badge>

                        {/* Mistakes indicator */}
                        <Badge
                            variant={currentGame.mistakes > 0 ? "destructive" : "outline"}
                            className={`gap-1 ${currentGame.mistakes > 0
                                ? 'bg-error-50 dark:bg-error-950/30 border-error-200 dark:border-error-800'
                                : 'bg-success-50 dark:bg-success-950/30 border-success-200 dark:border-success-800'
                                }`}
                        >
                            <ExclamationTriangleIcon className={`w-3 h-3 ${currentGame.mistakes > 0
                                ? 'text-error-600 dark:text-error-400'
                                : 'text-success-600 dark:text-success-400'
                                }`} />
                            <span className={currentGame.mistakes > 0
                                ? 'text-error-700 dark:text-error-300'
                                : 'text-success-700 dark:text-success-300'
                            }>
                                {currentGame.mistakes}{currentGame.mistakeLimitDisabled ? '/∞' : `/${currentGame.maxMistakes}`}
                            </span>
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};
