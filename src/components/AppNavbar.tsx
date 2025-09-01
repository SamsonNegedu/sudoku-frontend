import React from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { GameTimer } from './GameTimer';
import {
    PlayIcon,
    PauseIcon,
    PlusIcon,
    GearIcon,
    ChevronDownIcon
} from '@radix-ui/react-icons';
import type { Difficulty } from '../types';

interface AppNavbarProps {
    onNewGame: (difficulty: Difficulty) => void;
    onShowSettings: () => void;
    onPause: () => void;
    onResume: () => void;
    currentDifficulty?: Difficulty;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGeneratingPuzzle: boolean;
    startTime?: Date;
    pauseStartTime?: Date;
    totalPausedTime: number;
    pausedElapsedTime?: number;
    hintsUsed: number;
    maxHints: number;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
    onNewGame,
    onShowSettings,
    onPause,
    onResume,
    currentDifficulty,
    isPlaying,
    isPaused,
    isCompleted,
    isGeneratingPuzzle,
    startTime,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,
    hintsUsed,
    maxHints,
}) => {
    const difficultyLevels = [
        { level: 'easy' as Difficulty, label: 'Easy', description: 'Perfect for beginners' },
        { level: 'medium' as Difficulty, label: 'Medium', description: 'A nice challenge' },
        { level: 'hard' as Difficulty, label: 'Hard', description: 'For experienced players' },
        { level: 'difficult' as Difficulty, label: 'Difficult', description: 'Test your skills' },
        { level: 'extreme' as Difficulty, label: 'Extreme', description: 'Only for masters' },
    ];

    return (
        <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">9</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Sudoku Master
                            </h1>
                        </div>
                    </div>

                    {/* Center - Game Status & Timer */}
                    {(isPlaying || isPaused) && (
                        <div className="hidden lg:flex items-center space-x-6">
                            <GameTimer
                                startTime={startTime}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                                pauseStartTime={pauseStartTime}
                                totalPausedTime={totalPausedTime}
                                pausedElapsedTime={pausedElapsedTime}
                            />

                            <div className="flex items-center space-x-4 text-sm text-neutral-600">
                                <div className="flex items-center space-x-2">
                                    <span>Difficulty:</span>
                                    <span className="font-medium capitalize text-neutral-800">{currentDifficulty}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>Hints:</span>
                                    <span className="font-medium text-neutral-800">{hintsUsed}/{maxHints}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right - Navigation Actions */}
                    <div className="flex items-center space-x-3">
                        {(isPlaying || isPaused) && (
                            <>
                                {isPaused ? (
                                    <Button
                                        onClick={onResume}
                                        size="2"
                                        variant="solid"
                                        color="green"
                                        className="hidden sm:inline-flex"
                                    >
                                        <PlayIcon className="mr-2" />
                                        Resume
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={onPause}
                                        size="2"
                                        variant="solid"
                                        color="amber"
                                        className="hidden sm:inline-flex"
                                    >
                                        <PauseIcon className="mr-2" />
                                        Pause
                                    </Button>
                                )}

                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger disabled={isGeneratingPuzzle}>
                                        <Button
                                            size="2"
                                            variant="soft"
                                            color="indigo"
                                            className="hidden sm:inline-flex"
                                            disabled={isGeneratingPuzzle}
                                        >
                                            {isGeneratingPuzzle ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <PlusIcon className="mr-2" />
                                                    New Game
                                                    <ChevronDownIcon className="ml-1" />
                                                </>
                                            )}
                                        </Button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Content
                                        align="end"
                                        sideOffset={8}
                                        className="w-56 max-w-56 p-2 bg-white border border-neutral-200 rounded-xl shadow-lg"
                                    >
                                        <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                            Choose Difficulty
                                        </DropdownMenu.Label>
                                        <DropdownMenu.Separator className="my-2" />

                                        {difficultyLevels.map((difficulty, index) => (
                                            <div key={difficulty.level}>
                                                {index > 0 && <div className="h-4"></div>}
                                                <DropdownMenu.Item
                                                    onSelect={() => onNewGame(difficulty.level)}
                                                    className="px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <div className="font-semibold text-neutral-900 text-sm">
                                                            {difficulty.label}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 leading-normal break-words">
                                                            {difficulty.description}
                                                        </div>
                                                    </div>
                                                </DropdownMenu.Item>
                                            </div>
                                        ))}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </>
                        )}

                        <Button
                            onClick={onShowSettings}
                            size="2"
                            variant="ghost"
                            color="gray"
                            aria-label="Settings"
                        >
                            <GearIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
