import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { formatTime } from '../utils';
import { StopwatchIcon, PauseIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';

interface GameTimerProps {
    startTime: Date | string | undefined;
    isPaused: boolean;
    isCompleted: boolean;
    pauseStartTime?: Date | string;
    totalPausedTime: number;
    pausedElapsedTime?: number;
    currentTime?: Date | string; // For completed games
    completionPercentage?: number; // Percentage of cells filled (0-100)
}

export const GameTimer: React.FC<GameTimerProps> = ({
    startTime,
    isPaused,
    isCompleted,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,
    currentTime,
    completionPercentage = 0,
}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Convert startTime to Date object if it's a string
    const startTimeDate = useMemo(() =>
        startTime ? (startTime instanceof Date ? startTime : new Date(startTime)) : null,
        [startTime]
    );

    // Calculate the current elapsed time
    const calculateElapsedTime = useCallback(() => {
        if (!startTimeDate) return 0;
        if (isCompleted && currentTime) {
            // For completed games, calculate total duration using completion time
            const currentTimeDate = currentTime instanceof Date ? currentTime : new Date(currentTime);
            const startTimeMs = startTimeDate.getTime();
            const completionTimeMs = currentTimeDate.getTime();
            return Math.max(0, Math.floor((completionTimeMs - startTimeMs - totalPausedTime) / 1000));
        } else if (isPaused && pausedElapsedTime !== undefined) {
            // When paused, show the frozen elapsed time
            return pausedElapsedTime;
        } else {
            // When not paused, calculate current elapsed time
            const startTimeMs = startTimeDate.getTime();
            const now = Date.now();
            return Math.max(0, Math.floor((now - startTimeMs - totalPausedTime) / 1000));
        }
    }, [startTimeDate, isCompleted, currentTime, isPaused, pausedElapsedTime, totalPausedTime]);

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Don't do anything if no start time
        if (!startTimeDate) {
            return;
        }

        // Always update elapsed time, even if completed
        const elapsed = calculateElapsedTime();
        setElapsedTime(elapsed);

        // Don't start interval if completed
        if (isCompleted) {
            return;
        }

        // Update the elapsed time immediately (only if not already updated above)
        if (!isCompleted) {
            const elapsed = calculateElapsedTime();
            setElapsedTime(elapsed);
        }

        // Only start interval if not paused
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                const elapsed = calculateElapsedTime();
                setElapsedTime(elapsed);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [startTimeDate, isCompleted, isPaused, pauseStartTime, totalPausedTime, pausedElapsedTime, currentTime, calculateElapsedTime]);

    // Don't render timer if no start time (no active game)
    if (!startTime) {
        return null;
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <StopwatchIcon className={`w-4 h-4 ${isPaused
                        ? 'text-amber-600 dark:text-amber-400'
                        : isCompleted
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-primary-500 dark:text-primary-500'
                    }`} />
                <span className={`text-sm font-mono font-bold tabular-nums ${isPaused
                        ? 'text-amber-700 dark:text-amber-300'
                        : isCompleted
                            ? 'text-success-700 dark:text-success-300'
                            : 'text-primary-500 dark:text-primary-500'
                    }`}>
                    {formatTime(elapsedTime)}
                </span>
                {isPaused && !isCompleted && (
                    <PauseIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
                {isCompleted && (
                    <CheckCircledIcon className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
                )}
            </div>
            {/* Subtle progress bar - shows completion based on filled cells */}
            <Progress 
                value={completionPercentage} 
                className={`h-1 w-full ${isPaused
                    ? 'opacity-50'
                    : isCompleted
                        ? 'opacity-75'
                        : 'opacity-60'
                }`}
            />
        </div>
    );
};
