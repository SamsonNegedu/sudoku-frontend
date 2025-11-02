import React from 'react';
import { useTranslation } from 'react-i18next';
import { getDifficultyEmoji, } from '../../utils/completionUtils';

interface CelebrationHeaderProps {
    difficulty: string;
}

export const CelebrationHeader: React.FC<CelebrationHeaderProps> = ({
    difficulty,
}) => {
    const { t } = useTranslation();
    return (
        <div className="bg-neutral-50 dark:bg-gray-700 px-6 py-4 border-b border-neutral-100 dark:border-gray-600">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-bounce-in">
                <div className="text-3xl">{getDifficultyEmoji(difficulty)}</div>
            </div>
            <h2 className="text-2xl font-medium text-neutral-900 dark:text-gray-100 mb-1 tracking-tight">
                {t('completion.puzzleSolved')}
            </h2>
            <p className="text-neutral-600 dark:text-gray-400 text-sm font-normal tracking-normal">
                You successfully completed this {t(`difficulty.${difficulty}`)} puzzle
            </p>
        </div>
    );
};
