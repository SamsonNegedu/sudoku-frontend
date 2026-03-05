import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useGameStore } from '../../../../stores/gameStore';
import { useAnalyticsStore } from '../../../../stores/analyticsStore';
import { useGameAnalytics } from '../../../../hooks/useGameAnalytics';
import { useGameInteraction } from '../../../../hooks/useGameInteraction';
import { LoadingSpinner } from '../../../common';
import { GameLoadingView, GamePauseOverlay, GamePlayView } from '../GameViews';
import { MobileCompletionSheet } from '../../completion/MobileCompletionSheet';
import { KeyboardShortcutsModal } from '../../../modals';
import { DifficultyConfigManager } from '../../../../config/difficulty';
import type { Difficulty, Hint } from '../../../../types';

interface KeyboardShortcutsModalRef {
    open: () => void;
    close: () => void;
}

export const GameBoard: React.FC = () => {
    const shortcutsModalRef = useRef<KeyboardShortcutsModalRef>(null);
    const {
        currentGame,
        selectedCell,
        inputMode,
        isGeneratingPuzzle,
        isHydrated,
        startNewGame,
        resumeGame,
        pauseGame,
        undoMove,
        getHint,
        clearHintHighlights,
        getCompletedNumbers,
        showCompletionAnimation,
        hideCompletionAnimation,
    } = useGameStore();

    const { currentGameAnalytics, getProgressData } = useAnalyticsStore();

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

    // Handle undo with toast
    const handleUndo = useCallback(() => {
        undoMove();
    }, [undoMove]);

    // Calculate completion stats
    const completionStats = useMemo(() => {
        if (!currentGame?.isCompleted) return null;

        // Format completion time
        const formatTime = () => {
            if (!currentGame.startTime) return '0:00';
            const start = new Date(currentGame.startTime).getTime();
            const end = currentGame.currentTime ? new Date(currentGame.currentTime).getTime() : Date.now();
            const totalPaused = currentGame.totalPausedTime || 0;
            const elapsed = Math.max(0, Math.floor((end - start - totalPaused) / 1000));
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        // Get accuracy from analytics
        const accuracy = currentGameAnalytics?.accuracy || 0;
        const totalMoves = currentGameAnalytics?.moves.length || 0;

        // Check if personal best
        const progressData = getProgressData(currentGame.difficulty);
        const isPersonalBest = progressData && currentGame.currentTime ? (() => {
            const currentTime = new Date(currentGame.currentTime).getTime() - new Date(currentGame.startTime).getTime() - (currentGame.totalPausedTime || 0);
            return currentTime <= progressData.bestTime;
        })() : false;

        return {
            completionTime: formatTime(),
            accuracy,
            totalMoves,
            isPersonalBest,
        };
    }, [currentGame, currentGameAnalytics, getProgressData]);

    // Handle completion dismissal (for mobile backdrop tap)
    const handleDismissCompletion = useCallback(() => {
        hideCompletionAnimation();
    }, [hideCompletionAnimation]);

    // Handle start new game from completion
    const handleStartNewGameFromCompletion = useCallback(() => {
        hideCompletionAnimation();
        startNewGame(currentGame?.difficulty || 'beginner');
    }, [hideCompletionAnimation, startNewGame, currentGame?.difficulty]);

    // Handle try harder difficulty
    const handleTryHarder = useCallback(() => {
        hideCompletionAnimation();
        const nextDifficulty = DifficultyConfigManager.getNextDifficulty(currentGame?.difficulty || 'beginner');
        if (nextDifficulty) {
            startNewGame(nextDifficulty);
        }
    }, [hideCompletionAnimation, startNewGame, currentGame?.difficulty]);

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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-950 dark:to-primary-950">
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
                onUndo={handleUndo}
                onPause={pauseGame}
                onResume={resumeGame}
                getCompletedNumbers={getCompletedNumbers}
                shortcutsModalRef={shortcutsModalRef}
                showCompletionAnimation={showCompletionAnimation}
                completionTime={completionStats?.completionTime}
                accuracy={completionStats?.accuracy}
                totalMoves={completionStats?.totalMoves}
                isPersonalBest={completionStats?.isPersonalBest}
                onStartNewGame={handleStartNewGameFromCompletion}
                onTryHarder={handleTryHarder}
                onDismissCompletion={handleDismissCompletion}
            />

            {/* Mobile Completion Modal - Rendered at root level like pause overlay */}
            {showCompletionAnimation && currentGame.isCompleted && (
                <MobileCompletionSheet
                    isVisible={showCompletionAnimation}
                    difficulty={currentGame.difficulty}
                    completionTime={completionStats?.completionTime || '0:00'}
                    mistakes={currentGame.mistakes}
                    maxMistakes={currentGame.maxMistakes}
                    hintsUsed={currentGame.hintsUsed}
                    maxHints={currentGame.maxHints}
                    accuracy={completionStats?.accuracy}
                    totalMoves={completionStats?.totalMoves}
                    isPersonalBest={completionStats?.isPersonalBest}
                    onStartNewGame={handleStartNewGameFromCompletion}
                    onTryHarder={handleTryHarder}
                    onDismiss={handleDismissCompletion}
                />
            )}

            <KeyboardShortcutsModal ref={shortcutsModalRef} />
        </>
    );
};

