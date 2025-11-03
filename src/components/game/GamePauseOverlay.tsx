import React from 'react';
import { Button } from '@radix-ui/themes';
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
        <div
            className="fixed bg-black/40 backdrop-blur-md z-40 flex items-center justify-center animate-fade-in"
            style={{
                position: 'fixed',
                top: '4rem', // Start below navbar (navbar height is h-16 = 4rem)
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                touchAction: 'none' // Prevent touch scrolling
            }}
            onTouchMove={(e) => e.preventDefault()} // Prevent scroll on touch
            onWheel={(e) => e.preventDefault()} // Prevent scroll on wheel
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl p-8 mx-4 shadow-2xl max-w-sm w-full text-center border border-blue-100 dark:border-blue-900/50 animate-bounce-in">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 opacity-50 dark:opacity-20 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-600 rounded-full blur-3xl opacity-10"></div>
                </div>

                <div className="relative space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-blue-100 dark:border-blue-900">
                            <PauseIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('pause.gamePaused')}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {t('pause.progressSaved')}
                        </p>
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={onResume}
                        size="4"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/30 dark:shadow-blue-900/30 transition-all duration-200 border-0"
                    >
                        <PlayIcon className="w-5 h-5" />
                        {t('game.resume')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
