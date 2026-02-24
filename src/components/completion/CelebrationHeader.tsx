import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { getDifficultyEmoji } from '../../utils/completionUtils';

interface CelebrationHeaderProps {
    difficulty: string;
}

export const CelebrationHeader: React.FC<CelebrationHeaderProps> = ({
    difficulty,
}) => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden bg-neutral-50 dark:bg-gray-700/50 px-6 py-8 border-b border-neutral-200 dark:border-gray-700">
            <div className="relative space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full border-2 border-green-200 dark:border-green-800">
                        <CheckCircledIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('completion.puzzleSolved')}
                    </h2>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                        <span>{getDifficultyEmoji(difficulty)}</span>
                        <span>{t(`difficulty.${difficulty}`)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
