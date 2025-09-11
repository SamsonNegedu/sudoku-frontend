import React from 'react';
import { getDifficultyEmoji, getPerformanceRating } from '../../utils/completionUtils';

interface CelebrationHeaderProps {
    stage: 'stats';
    difficulty: string;
    mistakes: number;
}

export const CelebrationHeader: React.FC<CelebrationHeaderProps> = ({
    stage,
    difficulty,
    mistakes,
}) => {
    return (
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center animate-bounce-in">
                <div className="text-3xl">{getDifficultyEmoji(difficulty)}</div>
            </div>
            <h2 className="text-2xl font-medium text-neutral-900 mb-1 tracking-tight">
                Puzzle Solved!
            </h2>
            <p className="text-neutral-600 text-sm font-normal tracking-normal">
                You successfully completed this {difficulty} puzzle
            </p>
        </div>
    );
};
