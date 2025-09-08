import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { formatTime } from '../utils';
import { StopwatchIcon } from '@radix-ui/react-icons';

interface GameTimerProps {
    startTime: Date | string | undefined;
    isPaused: boolean;
    isCompleted: boolean;
    pauseStartTime?: Date | string;
    totalPausedTime: number;
    pausedElapsedTime?: number;
    currentTime?: Date | string; // For completed games
}

export const GameTimer: React.FC<GameTimerProps> = ({
    startTime,
    isPaused,
    isCompleted,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,

    currentTime,
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
        <div className="flex items-center gap-2 p-3 bg-neutral-100 rounded-lg">
            <div className="flex items-center gap-2">
                <StopwatchIcon className="w-5 h-5 text-neutral-600" />
                <span className="text-lg font-mono font-bold text-neutral-800">
                    {formatTime(elapsedTime)}
                </span>
            </div>

            {isCompleted && (
                <span className="text-sm text-neutral-600 bg-green-100 px-2 py-1 rounded">
                    COMPLETED
                </span>
            )}
        </div>
    );
};
