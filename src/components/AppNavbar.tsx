import React from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { GameTimer } from './GameTimer';
import {
    PlayIcon,
    PauseIcon,
    PlusIcon,
    GearIcon,
    ChevronDownIcon,
    HamburgerMenuIcon,
    BarChartIcon
} from '@radix-ui/react-icons';
import type { Difficulty } from '../types';
import { DifficultyConfigManager } from '../config/difficulty';

interface AppNavbarProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onShowSettings: () => void;
    onShowAnalytics: () => void;
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
    onRestart,
    onShowSettings,
    onShowAnalytics,
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
    const difficultyLevels = DifficultyConfigManager.getDifficultyOptions().map(option => ({
        level: option.value,
        label: option.label,
        description: option.description,
    }));

    return (
        <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">9</span>
                        </div>
                        <div className="block">
                            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Grid Logic
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
                        {(isPlaying || isPaused) && !isCompleted && (
                            <>
                                {isPaused ? (
                                    <>
                                        {/* Mobile Resume Button - Icon Only */}
                                        <Button
                                            onClick={onResume}
                                            size="2"
                                            variant="solid"
                                            color="green"
                                            className="sm:hidden"
                                            aria-label="Resume Game"
                                        >
                                            <PlayIcon />
                                        </Button>
                                        {/* Desktop Resume Button - With Text */}
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
                                    </>
                                ) : (
                                    <>
                                        {/* Mobile Pause Button - Icon Only */}
                                        <Button
                                            onClick={onPause}
                                            size="2"
                                            variant="solid"
                                            color="blue"
                                            className="sm:hidden"
                                            aria-label="Pause Game"
                                        >
                                            <PauseIcon />
                                        </Button>
                                        {/* Desktop Pause Button - With Text */}
                                        <Button
                                            onClick={onPause}
                                            size="2"
                                            variant="solid"
                                            color="blue"
                                            className="hidden sm:inline-flex"
                                        >
                                            <PauseIcon className="mr-2" />
                                            Pause
                                        </Button>
                                    </>
                                )}
                            </>
                        )}

                        {(isPlaying || isPaused || isCompleted) && (
                            <>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger disabled={isGeneratingPuzzle}>
                                        <Button
                                            size="2"
                                            variant="soft"
                                            color="blue"
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
                                        {/* Restart Current Puzzle Option */}
                                        <DropdownMenu.Item
                                            onSelect={onRestart}
                                            className="px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                                </svg>
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-semibold text-neutral-900 text-sm">
                                                        Restart This Puzzle
                                                    </div>
                                                    <div className="text-xs text-neutral-500 leading-normal">
                                                        Reset to starting state
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenu.Item>

                                        <DropdownMenu.Separator className="my-2" />

                                        <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                            New Puzzle
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

                                {/* Mobile Game Menu - Only visible on mobile when game is active */}
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger disabled={isGeneratingPuzzle}>
                                        <Button
                                            size="2"
                                            variant="soft"
                                            color="blue"
                                            className="sm:hidden"
                                            disabled={isGeneratingPuzzle}
                                            aria-label="Game Menu"
                                        >
                                            {isGeneratingPuzzle ? (
                                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <HamburgerMenuIcon />
                                            )}
                                        </Button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Content
                                        align="end"
                                        sideOffset={8}
                                        className="w-56 max-w-56 p-2 bg-white border border-neutral-200 rounded-xl shadow-lg"
                                    >
                                        {/* Restart Current Puzzle Option */}
                                        <DropdownMenu.Item
                                            onSelect={onRestart}
                                            className="px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                                </svg>
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-semibold text-neutral-900 text-sm">
                                                        Restart This Puzzle
                                                    </div>
                                                    <div className="text-xs text-neutral-500 leading-normal">
                                                        Reset to starting state
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenu.Item>

                                        <DropdownMenu.Separator className="my-2" />

                                        <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                            New Puzzle
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
                            onClick={onShowAnalytics}
                            size="2"
                            variant="ghost"
                            color="gray"
                            aria-label="Analytics Dashboard"
                            className="mr-2"
                        >
                            <BarChartIcon />
                        </Button>

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
