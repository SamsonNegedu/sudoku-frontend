import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { NavBrand } from './navbar/NavBrand';
import { GameStatusDisplay } from './navbar/GameStatusDisplay';
import { NewGameDropdown } from './navbar/NewGameDropdown';
import { NavigationButtons } from './navbar/NavigationButtons';
import { MobileNavigation } from './navbar/MobileNavigation';
import { LanguageSelector } from './LanguageSelector';
import { DarkModeToggle } from './DarkModeToggle';
import { HelpButton } from './navbar/HelpButton';
import type { Difficulty } from '../types';

interface AppNavbarProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onPause: () => void;
    onResume: () => void;
    onShowHelp?: () => void;
    currentDifficulty?: Difficulty;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGeneratingPuzzle: boolean;
    startTime?: Date;
    pauseStartTime?: Date;
    totalPausedTime: number;
    pausedElapsedTime?: number;
    currentTime?: Date;
    hintsUsed: number;
    maxHints: number;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
    onNewGame,
    onRestart,
    onPause,
    onResume,
    onShowHelp,
    currentDifficulty,
    isPlaying,
    isPaused,
    isCompleted,
    isGeneratingPuzzle,
    startTime,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,
    currentTime,
    hintsUsed,
    maxHints,
}) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <NavBrand onShowGame={() => navigate({ to: '/game' })} />

                    {/* Center - Game Status & Timer */}
                    <GameStatusDisplay
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        startTime={startTime}
                        isCompleted={isCompleted}
                        pauseStartTime={pauseStartTime}
                        totalPausedTime={totalPausedTime}
                        pausedElapsedTime={pausedElapsedTime}
                        currentTime={currentTime}
                        currentDifficulty={currentDifficulty}
                        hintsUsed={hintsUsed}
                        maxHints={maxHints}
                    />

                    {/* Right - Navigation Actions */}
                    <div className="flex items-center">
                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <NewGameDropdown
                                onNewGame={onNewGame}
                                onRestart={onRestart}
                                isGeneratingPuzzle={isGeneratingPuzzle}
                                isPlaying={isPlaying}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                            />

                            <NavigationButtons />

                            <LanguageSelector />

                            {onShowHelp && <HelpButton onHelpClick={onShowHelp} />}

                            <DarkModeToggle />
                        </div>

                        {/* Mobile Navigation */}
                        <MobileNavigation
                            onNewGame={onNewGame}
                            onRestart={onRestart}
                            onPause={onPause}
                            onResume={onResume}
                            isPlaying={isPlaying}
                            isPaused={isPaused}
                            isCompleted={isCompleted}
                            isGeneratingPuzzle={isGeneratingPuzzle}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};
