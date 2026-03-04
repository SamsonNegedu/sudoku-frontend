import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { DifficultyConfigManager } from '../../../config/difficulty';
import type { Difficulty } from '../../../types';

interface NewGameDropdownProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    isGeneratingPuzzle: boolean;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
}

export const NewGameDropdown: React.FC<NewGameDropdownProps> = ({
    onNewGame,
    onRestart,
    isGeneratingPuzzle,
    isPlaying,
    isPaused,
    isCompleted,
}) => {
    const { t } = useTranslation();
    const difficultyLevels = DifficultyConfigManager.getDifficultyOptions().map(option => ({
        level: option.value,
        label: t(`difficulty.${option.value}`),
        description: option.description,
    }));

    if (!isPlaying && !isPaused && !isCompleted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isGeneratingPuzzle}>
                <Button
                    variant="secondary"
                    className="hidden sm:inline-flex bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/50 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
                    disabled={isGeneratingPuzzle}
                >
                    {isGeneratingPuzzle ? (
                        <>
                            <div className="w-4 h-4 mr-2 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            {t('navigation.newGame')}...
                        </>
                    ) : (
                        <>
                            <PlusIcon className="mr-2" />
                            {t('navigation.newGame')}
                            <ChevronDownIcon className="ml-1" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 p-1.5"
            >
                {/* Restart Current Puzzle Option */}
                <DropdownMenuItem
                    onClick={onRestart}
                    className="px-3 py-2 rounded cursor-pointer text-sm"
                >
                    <svg className="w-4 h-4 mr-2 text-neutral-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                    {t('game.restart')}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-neutral-600 dark:text-gray-400 uppercase tracking-wide">
                    New Puzzle
                </DropdownMenuLabel>

                {difficultyLevels.map((difficulty) => (
                    <DropdownMenuItem
                        key={difficulty.level}
                        onClick={() => onNewGame(difficulty.level)}
                        className="px-3 py-2 rounded cursor-pointer text-sm capitalize"
                    >
                        {difficulty.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
