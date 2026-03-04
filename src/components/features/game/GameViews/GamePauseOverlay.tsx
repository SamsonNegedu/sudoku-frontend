import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

interface GamePauseOverlayProps {
    isPaused: boolean;
    onResume: () => void;
}

export const GamePauseOverlay: React.FC<GamePauseOverlayProps> = ({
    isPaused,
    onResume
}) => {
    const { t } = useTranslation();
    if (!isPaused) return null;

    return (
        <>
            {/* Heavy backdrop to completely hide the grid - prevents cheating */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-[50] pointer-events-none
                           animate-in fade-in duration-300"
                style={{ top: '4rem' }}
            />

            {/* Compact pause banner */}
            <div className="fixed top-0 left-0 right-0 z-[65] pointer-events-none">
                <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
                    <div
                        className="bg-primary-50 dark:bg-primary-900 border-2 border-primary-400 dark:border-primary-600 
                                   rounded-lg shadow-2xl pointer-events-auto
                                   animate-in slide-in-from-top-4 fade-in duration-300"
                    >
                        <div className="p-3 sm:p-4">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full">
                                    <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-primary-900 dark:text-primary-100">
                                        {t('pause.gamePaused')}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-primary-700 dark:text-primary-300">
                                        {t('pause.progressSaved')}
                                    </p>
                                </div>
                            </div>

                            {/* Resume Button */}
                            <Button
                                onClick={onResume}
                                size="lg"
                                className="w-full gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 
                                           text-white font-semibold shadow-md transition-all duration-200"
                            >
                                <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                {t('game.resume')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
