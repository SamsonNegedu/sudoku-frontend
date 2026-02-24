import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { NavBrand } from './navbar/NavBrand';
import { GameTimer } from './GameTimer';
import { NewGameDropdown } from './navbar/NewGameDropdown';
import { DesktopNavigationLinks } from './navbar/DesktopNavigationLinks';
import { UnifiedSettingsDropdown } from './navbar/UnifiedSettingsDropdown';
import { MobileNavigation } from './navbar/MobileNavigation';
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
    isPlaying,
    isPaused,
    isCompleted,
    isGeneratingPuzzle,
    startTime,
    pauseStartTime,
    totalPausedTime,
    pausedElapsedTime,
    currentTime,
}) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo and Brand */}
                    <NavBrand onShowGame={() => navigate({ to: '/game' })} />

                    {/* Center - Timer (only when playing, hidden on mobile) */}
                    {isPlaying && !isCompleted && (
                        <div className="hidden lg:flex items-center">
                            <GameTimer
                                startTime={startTime}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                                pauseStartTime={pauseStartTime}
                                totalPausedTime={totalPausedTime}
                                pausedElapsedTime={pausedElapsedTime}
                                currentTime={currentTime}
                            />
                        </div>
                    )}

                    {/* Right - Minimal Actions */}
                    <div className="flex items-center">
                        {/* Desktop Navigation - Clean & Minimal */}
                        <div className="hidden sm:flex items-center gap-6">
                            {/* New Game Dropdown */}
                            <NewGameDropdown
                                onNewGame={onNewGame}
                                onRestart={onRestart}
                                isGeneratingPuzzle={isGeneratingPuzzle}
                                isPlaying={isPlaying}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                            />

                            {/* Divider */}
                            <div className="h-6 w-px bg-neutral-300 dark:bg-gray-600" />

                            {/* Direct Navigation Links - No hamburger on desktop */}
                            <DesktopNavigationLinks />

                            {/* Divider */}
                            <div className="h-6 w-px bg-neutral-300 dark:bg-gray-600" />

                            {/* Settings Dropdown */}
                            <UnifiedSettingsDropdown onShowHelp={onShowHelp} />
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
