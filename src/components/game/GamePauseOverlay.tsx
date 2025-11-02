import React from 'react';
import { Button } from '@radix-ui/themes';
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
            className="fixed bg-black/50 backdrop-blur-md z-40 flex items-center justify-center"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mx-4 shadow-2xl max-w-sm w-full text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-gray-100 mb-2">{t('pause.gamePaused')}</h2>
                    <p className="text-neutral-600 dark:text-gray-400 text-sm">
                        {t('pause.progressSaved')}
                    </p>
                </div>

                <Button
                    onClick={onResume}
                    size="4"
                    variant="solid"
                    className="w-full flex items-center justify-center gap-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    {t('game.resume')}
                </Button>

                <p className="text-neutral-500 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
                    {t('pause.orUseButton')}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                    </svg>
                </p>
            </div>
        </div>
    );
};
