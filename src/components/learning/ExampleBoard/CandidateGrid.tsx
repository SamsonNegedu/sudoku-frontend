import React from 'react';
import { SUDOKU_NUMBERS } from '../../../constants/learning';

interface CandidateGridProps {
    candidates: number[];
    className?: string;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({
    candidates,
    className = ''
}) => {
    if (candidates.length === 1) {
        return (
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {candidates[0]}
            </span>
        );
    }

    return (
        <div className={`grid grid-cols-3 gap-0 w-full h-full p-0.5 ${className}`}>
            {SUDOKU_NUMBERS.map(num => (
                <div
                    key={num}
                    className="flex items-center justify-center text-[0.45rem] leading-none font-semibold"
                >
                    {candidates.includes(num) ? (
                        <span className="text-blue-700 dark:text-blue-400">{num}</span>
                    ) : (
                        <span className="opacity-0" aria-hidden="true">·</span>
                    )}
                </div>
            ))}
        </div>
    );
};
