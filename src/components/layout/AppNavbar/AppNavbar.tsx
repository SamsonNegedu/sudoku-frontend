import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { NavBrand } from './NavBrand';
import { GameTimer } from '../../features/game/GameTimer';
import { NewGameDropdown } from './NewGameDropdown';
import { DesktopNavigationLinks } from './DesktopNavigationLinks';
import { UnifiedSettingsDropdown } from './UnifiedSettingsDropdown';
import { MobileNavigation } from './MobileNavigation';
import { useGameContext } from '../../../contexts';

export const AppNavbar: React.FC = () => {
    const {
        currentGame,
        isPlaying,
        isPaused,
        isCompleted,
        isGeneratingPuzzle,
        completionPercentage,
        onNewGame,
        onRestart,
        onPause,
        onResume,
        onShowHelp,
    } = useGameContext();
    const navigate = useNavigate();

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 shadow-sm lg:sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo and Brand */}
                    <NavBrand onShowGame={() => navigate({ to: '/game' })} />

                    {/* Center - Timer (only when playing, hidden on mobile) */}
                    {isPlaying && !isCompleted && currentGame && (
                        <div className="hidden lg:flex items-center">
                            <GameTimer
                                startTime={currentGame.startTime}
                                isPaused={currentGame.isPaused}
                                isCompleted={currentGame.isCompleted}
                                pauseStartTime={currentGame.pauseStartTime}
                                totalPausedTime={currentGame.totalPausedTime}
                                pausedElapsedTime={currentGame.pausedElapsedTime}
                                currentTime={currentGame.currentTime}
                                completionPercentage={completionPercentage}
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
