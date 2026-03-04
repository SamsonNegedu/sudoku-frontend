import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/index';

interface GameControlButtonsProps {
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    onPause: () => void;
    onResume: () => void;
    isMobile?: boolean;
}

export const GameControlButtons: React.FC<GameControlButtonsProps> = ({
    isPlaying,
    isPaused,
    isCompleted,
    onPause,
    onResume,
    isMobile = false,
}) => {
    const { t } = useTranslation();
    if ((!isPlaying && !isPaused) || isCompleted) return null;

    if (isPaused) {
        return (
            <Button
                onClick={onResume}
                className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-600 dark:hover:bg-primary-700"
                aria-label={isMobile ? t('game.resume') : undefined}
            >
                <PlayIcon className={cn(!isMobile && "mr-2")} />
                {!isMobile && t('game.resume')}
            </Button>
        );
    }

    return (
        <Button
            onClick={onPause}
            className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-600 dark:hover:bg-primary-700"
            aria-label={isMobile ? t('game.pause') : undefined}
        >
            <PauseIcon className={cn(!isMobile && "mr-2")} />
            {!isMobile && t('game.pause')}
        </Button>
    );
};
