import React from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { DifficultyConfigManager } from '../../config/difficulty';
import type { Difficulty } from '../../types';

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
        <DropdownMenu.Root>
            <DropdownMenu.Trigger disabled={isGeneratingPuzzle}>
                <Button
                    size="2"
                    variant="soft"
                    className="hidden sm:inline-flex bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
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
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="w-56 max-w-56 p-2 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl shadow-lg"
            >
                {/* Restart Current Puzzle Option */}
                <DropdownMenu.Item
                    onSelect={onRestart}
                    className="px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                >
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-neutral-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-neutral-900 dark:text-gray-100 text-sm">
                                {t('game.restart')}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-gray-400 leading-normal">
                                Reset to starting state
                            </div>
                        </div>
                    </div>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-2" />

                <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-neutral-600 dark:text-gray-400 uppercase tracking-wide">
                    New Puzzle
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="my-2" />

                {difficultyLevels.map((difficulty, index) => (
                    <div key={difficulty.level}>
                        {index > 0 && <div className="h-4"></div>}
                        <DropdownMenu.Item
                            onSelect={() => onNewGame(difficulty.level)}
                            className="px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="font-semibold text-neutral-900 dark:text-gray-100 text-sm">
                                    {difficulty.label}
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-gray-400 leading-normal break-words">
                                    {difficulty.description}
                                </div>
                            </div>
                        </DropdownMenu.Item>
                    </div>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
