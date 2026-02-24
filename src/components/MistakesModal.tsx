import React from 'react';
import { MistakesHeader, MistakesContent, MistakesActions } from './mistakes/index';
import type { Difficulty } from '../types';

interface MistakesModalProps {
    isVisible: boolean;
    difficulty: Difficulty;
    mistakes: number;
    maxMistakes: number;
    onRestart: () => void;
    onContinue: () => void;
}

export const MistakesModal: React.FC<MistakesModalProps> = ({
    isVisible,
    mistakes,
    maxMistakes,
    onRestart,
    onContinue,
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-sm w-full text-center overflow-hidden border border-gray-100 dark:border-gray-700 animate-bounce-in">
                <MistakesHeader mistakes={mistakes} maxMistakes={maxMistakes} />
                <div className="p-6">
                    <MistakesContent />
                    <MistakesActions onRestart={onRestart} onContinue={onContinue} />
                </div>
            </div>
        </div>
    );
};
