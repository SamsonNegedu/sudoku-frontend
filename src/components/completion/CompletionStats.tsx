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
                <span className={`font-bold capitalize ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">Time</span>
                <span className="font-bold text-blue-600">
                    {completionTime}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="font-medium text-neutral-600">Mistakes</span>
                <span className={`font-bold ${getMistakeColor(mistakes)}`}>
                    {mistakes}
                </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <span className="font-medium text-yellow-800">Rating</span>
                <span className={`font-bold ${performance.color}`}>
                    {performance.emoji} {performance.rating}
                </span>
            </div>
        </div>
    );
};
