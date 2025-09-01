import React from 'react';
import { Button } from '@radix-ui/themes';
import type { Difficulty } from '../types';

interface DifficultySelectorProps {
    selectedDifficulty: Difficulty;
    onDifficultyChange: (difficulty: Difficulty) => void;
    disabled?: boolean;
}

const difficulties: { value: Difficulty; label: string; description: string; color: string }[] = [
    { value: 'easy', label: 'Easy', description: 'Simple techniques', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', description: 'Basic strategies', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Hard', description: 'Advanced techniques', color: 'bg-orange-500' },
    { value: 'difficult', label: 'Difficult', description: 'Expert strategies', color: 'bg-red-500' },
    { value: 'extreme', label: 'Extreme', description: 'Master level', color: 'bg-purple-500' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    selectedDifficulty,
    onDifficultyChange,
    disabled = false,
}) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">Select Difficulty</h3>

            <div className="grid grid-cols-1 gap-2">
                {difficulties.map(({ value, label, description, color }) => (
                    <Button
                        key={value}
                        onClick={() => onDifficultyChange(value)}
                        disabled={disabled}
                        size="3"
                        variant={selectedDifficulty === value ? 'solid' : 'soft'}
                        color={selectedDifficulty === value ? 'indigo' : 'gray'}
                        className={`
              flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
              ${selectedDifficulty === value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                        aria-label={`Select ${label} difficulty`}
                        aria-pressed={selectedDifficulty === value}
                    >
                        {/* Difficulty indicator */}
                        <div className={`w-4 h-4 rounded-full ${color}`} />

                        {/* Difficulty info */}
                        <div className="flex-1 text-left">
                            <div className="font-medium text-neutral-800">{label}</div>
                            <div className="text-sm text-neutral-600">{description}</div>
                        </div>

                        {/* Selection indicator */}
                        {selectedDifficulty === value && (
                            <div className="text-primary-500 text-xl">✓</div>
                        )}
                    </Button>
                ))}
            </div>

            <div className="mt-3 text-xs text-neutral-500 text-center">
                Choose a difficulty level to start a new game
            </div>
        </div>
    );
};
