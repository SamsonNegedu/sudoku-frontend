import React, { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useGameAnalytics } from '../hooks/useGameAnalytics';
import { useGameInteraction } from '../hooks/useGameInteraction';
import { LoadingSpinner } from './shared';
import { GameLoadingView } from './game/GameLoadingView';
import { GamePauseOverlay } from './game/GamePauseOverlay';
import { GamePlayView } from './game/GamePlayView';
import type { Difficulty, Hint } from '../types';

export const GameBoard: React.FC = () => {
    const {
        currentGame,
        selectedCell,
        inputMode,
        isGeneratingPuzzle,
        isHydrated,
        startNewGame,
        resumeGame,
        undoMove,
        getHint,
        clearHintHighlights,
        getCompletedNumbers,
    } = useGameStore();


    // Get analytics functions
    const { recordHintUsage } = useGameAnalytics();

    // Local state for hint display
    const [currentHint, setCurrentHint] = useState<Hint | null>(null);
    const [showHint, setShowHint] = useState(false);

    // Game interaction hook
    const {
        handleCellKeyDown,
        handleCellClick,
        handleNumberClick,
        handleClearCell,
        handleToggleNote,
    } = useGameInteraction({
        currentGame,
        selectedCell,
        inputMode
    });

    // Handle hint usage
    const handleUseHint = useCallback(async () => {
        if (getHint) {
            try {
                // If there's already a hint showing, close it first for clean transition
                if (showHint) {
                    setShowHint(false);
                    setCurrentHint(null);
                    // Brief pause for smooth visual transition
                    await new Promise(resolve => setTimeout(resolve, 150));
                }

                const hint = await getHint();
                if (hint) {
                    // Set hint data and show (store handles highlight clearing)
                    setCurrentHint(hint);
                    setShowHint(true);
                    // Record hint usage for analytics with technique information
                    recordHintUsage(hint.type, hint.technique);
                }
            } catch (error) {
                console.error('Failed to get hint:', error);
            }
        }
    }, [getHint, recordHintUsage, showHint]);

    // Handle hint dismissal
    const handleCloseHint = useCallback(() => {
        setShowHint(false);
        setCurrentHint(null);
        clearHintHighlights(); // Clear highlighting when hint is dismissed
    }, [clearHintHighlights]);

    // Handle new game
    const handleNewGame = useCallback((difficulty: Difficulty) => {
        startNewGame(difficulty);
    }, [startNewGame]);

    // Prevent body scrolling when game is paused
    useEffect(() => {
        if (currentGame?.isPaused) {
            // Store original overflow values
            const originalStyle = window.getComputedStyle(document.body);
            const originalOverflow = originalStyle.overflow;

            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Cleanup function to restore scrolling
            return () => {
                document.body.style.overflow = originalOverflow;
                document.documentElement.style.overflow = '';
            };
        }
    }, [currentGame?.isPaused]);

    // Show loading view when no game or generating puzzle, but wait for hydration first
    if (!isHydrated) {
        // Still loading persisted state, show minimal loading
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    if (!currentGame || isGeneratingPuzzle) {
        return (
            <GameLoadingView
                isGeneratingPuzzle={isGeneratingPuzzle}
                onNewGame={handleNewGame}
            />
        );
    }

    return (
        <>
            {/* Full-Screen Pause Overlay */}
            <GamePauseOverlay
                isPaused={currentGame.isPaused}
                onResume={resumeGame}
            />

            {/* Game Play View */}
            <GamePlayView
                currentGame={currentGame}
                selectedCell={selectedCell}
                inputMode={inputMode}
                currentHint={currentHint}
                showHint={showHint}
                onCellClick={handleCellClick}
                onCellKeyDown={handleCellKeyDown}
                onNumberClick={handleNumberClick}
                onClearCell={handleClearCell}
                onToggleNote={handleToggleNote}
                onUseHint={handleUseHint}
                onCloseHint={handleCloseHint}
                onUndo={undoMove}
                getCompletedNumbers={getCompletedNumbers}
            />
        </>
    );
};

