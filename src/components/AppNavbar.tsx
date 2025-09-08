import React from 'react';
import { NavBrand } from './navbar/NavBrand';
import { GameStatusDisplay } from './navbar/GameStatusDisplay';
import { GameControlButtons } from './navbar/GameControlButtons';
import { NewGameDropdown } from './navbar/NewGameDropdown';
import { NavigationButtons } from './navbar/NavigationButtons';
import { MobileNavigation } from './navbar/MobileNavigation';
import type { Difficulty } from '../types';

interface AppNavbarProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onShowAnalytics: () => void;
    onShowLearning: () => void;
    onShowGame?: () => void;
    onPause: () => void;
    onResume: () => void;
    currentDifficulty?: Difficulty;
    currentPage?: 'game' | 'analytics' | 'learning';
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
    onShowAnalytics,
    onShowLearning,
    onShowGame,
    onPause,
    onResume,
    currentDifficulty,
    currentPage = 'game',
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
    return (
        <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <NavBrand onShowGame={onShowGame} />

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
                            <GameControlButtons
                                isPlaying={isPlaying}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                                onPause={onPause}
                                onResume={onResume}
                            />

                            <NewGameDropdown
                                onNewGame={onNewGame}
                                onRestart={onRestart}
                                isGeneratingPuzzle={isGeneratingPuzzle}
                                isPlaying={isPlaying}
                                isPaused={isPaused}
                                isCompleted={isCompleted}
                            />

                            <NavigationButtons
                                onShowAnalytics={onShowAnalytics}
                                onShowLearning={onShowLearning}
                            />
                        </div>

                        {/* Mobile Navigation */}
                        <MobileNavigation
                            onNewGame={onNewGame}
                            onRestart={onRestart}
                            onShowAnalytics={onShowAnalytics}
                            onShowLearning={onShowLearning}
                            onShowGame={onShowGame}
                            onPause={onPause}
                            onResume={onResume}
                            currentPage={currentPage}
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
