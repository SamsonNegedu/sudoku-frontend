import React from 'react';
import { getDifficultyEmoji, getPerformanceRating } from '../../utils/completionUtils';

interface CelebrationHeaderProps {
    stage: 'celebration' | 'stats';
    difficulty: string;
    mistakes: number;
}

export const CelebrationHeader: React.FC<CelebrationHeaderProps> = ({
    stage,
    difficulty,
    mistakes,
}) => {
    const performance = getPerformanceRating(mistakes, difficulty);

    if (stage === 'celebration') {
        return (
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
                    <div className="text-3xl">🎉</div>
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-1">
                    Puzzle Solved!
                </h2>
                <p className={`text-sm ${performance.color}`}>
                    {performance.emoji} {performance.rating}
                </p>
            </div>
        );
    }

    if (stage === 'stats') {
        return (
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="text-3xl">{getDifficultyEmoji(difficulty)}</div>
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-1">
                    Congratulations!
                </h2>
                <p className="text-green-600 text-sm">
                    You successfully completed this {difficulty} puzzle
                </p>
            </div>
        );
    }

    return null;
};
