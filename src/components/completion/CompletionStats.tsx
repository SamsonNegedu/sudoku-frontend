import React from 'react';
import { getDifficultyColor, getPerformanceRating, getMistakeColor } from '../../utils/completionUtils';

interface CompletionStatsProps {
    difficulty: string;
    completionTime: string;
    mistakes: number;
}

export const CompletionStats: React.FC<CompletionStatsProps> = ({
    difficulty,
    completionTime,
    mistakes,
}) => {
    const performance = getPerformanceRating(mistakes, difficulty);

    return (
        <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">Difficulty</span>
                <span className="font-semibold capitalize text-blue-600">
                    {difficulty}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">Time</span>
                <span className="font-semibold text-neutral-800 tabular-nums">
                    {completionTime}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">Mistakes</span>
                <span className="font-semibold text-neutral-800 tabular-nums">
                    {mistakes}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="font-medium text-blue-700">Performance</span>
                <span className="font-semibold text-blue-700">
                    {performance.emoji} {performance.rating}
                </span>
            </div>
        </div>
    );
};
