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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full text-center overflow-hidden">
                <MistakesHeader mistakes={mistakes} maxMistakes={maxMistakes} />
                <MistakesContent />
                <MistakesActions onRestart={onRestart} onContinue={onContinue} />
            </div>
        </div>
    );
};
