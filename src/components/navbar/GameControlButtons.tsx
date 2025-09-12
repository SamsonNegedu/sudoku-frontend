import React from 'react';
import { Button } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

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
                size="2"
                variant="solid"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label={isMobile ? t('game.resume') : undefined}
            >
                <PlayIcon className={isMobile ? "" : "mr-2"} />
                {!isMobile && t('game.resume')}
            </Button>
        );
    }

    return (
        <Button
            onClick={onPause}
            size="2"
            variant="solid"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            aria-label={isMobile ? t('game.pause') : undefined}
        >
            <PauseIcon className={isMobile ? "" : "mr-2"} />
            {!isMobile && t('game.pause')}
        </Button>
    );
};
