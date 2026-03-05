import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon, ResetIcon, PlayIcon } from '@radix-ui/react-icons';

interface MistakesModalProps {
    isVisible: boolean;
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
    const { t } = useTranslation();

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop - click to continue */}
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/30 z-[65] backdrop-blur-sm
                           animate-in fade-in duration-300"
                onClick={onContinue}
            />

            {/* Banner */}
            <div className="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
                <div className="max-w-2xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
                    <div
                        className="bg-error-50 dark:bg-error-900 border-2 border-error-500 dark:border-error-600 
                                   rounded-lg shadow-2xl pointer-events-auto
                                   animate-in slide-in-from-top-4 fade-in duration-300"
                    >
                        <div className="p-3 sm:p-4">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <ExclamationTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-error-600 dark:text-error-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold text-error-900 dark:text-error-100">
                                        {t('mistakes.maximumReached')}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-error-700 dark:text-error-300">
                                        {mistakes}/{maxMistakes} {t('game.mistakes').toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    onClick={onRestart}
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <ResetIcon className="w-4 h-4" />
                                    {t('mistakes.startOver')}
                                </Button>

                                <Button
                                    onClick={onContinue}
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <PlayIcon className="w-4 h-4" />
                                    {t('mistakes.continueUnlimited')}
                                </Button>
                            </div>

                            {/* Hint text */}
                            <p className="text-xs text-error-600 dark:text-error-400 text-center mt-2">
                                Click outside to continue playing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
