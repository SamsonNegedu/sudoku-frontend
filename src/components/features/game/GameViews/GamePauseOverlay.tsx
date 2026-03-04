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
            <div className="fixed left-0 right-0 z-[65] pointer-events-none" style={{ top: '4rem' }}>
                <div className="max-w-4xl mx-auto px-2 sm:px-4">
                    <div
                        className="bg-card border-2 border-primary rounded-lg shadow-2xl pointer-events-auto
                                   animate-in slide-in-from-top-4 fade-in duration-300"
                    >
                        <div className="p-4 sm:p-5">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                                        {t('pause.gamePaused')}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        {t('pause.progressSaved')}
                                    </p>
                                </div>
                            </div>

                            {/* Resume Button */}
                            <Button
                                onClick={onResume}
                                size="lg"
                                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all duration-200"
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
