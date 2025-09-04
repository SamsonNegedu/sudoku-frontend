import React, { useEffect, useRef } from 'react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useGameStore } from '../stores/gameStore';

/**
 * Analytics Provider Component
 * Handles automatic recording of game events and user actions
 * Should be placed high in the component tree to capture all game events
 */
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        initializeUser,
        startGameRecording,
        recordCellSelection,
        recordGameCompletion,
        stopGameRecording,
        isRecording
    } = useAnalyticsStore();

    const { currentGame } = useGameStore();

    // Track moves using React patterns instead of direct subscription
    const movesCountRef = useRef(0);

    useEffect(() => {
        const currentMoves = currentGame?.moves || [];
        const newMovesCount = currentMoves.length;

        // Check if a new move was added
        if (newMovesCount > movesCountRef.current && newMovesCount > 0) {
            const newMove = currentMoves[newMovesCount - 1];

            if (newMove && currentGame && newMove.value !== null) {
                if (isRecording) {
                    // Determine if move was correct
                    const isCorrect = currentGame.board[newMove.row][newMove.col]?.isCorrect ?? false;

                    recordCellSelection(
                        { row: newMove.row, col: newMove.col },
                        newMove.value,
                        isCorrect,
                        false // TODO: Track hint usage separately
                    );
                } else {
                    // Auto-fix: Try to start recording if we have a game but aren't recording
                    if (currentGame.id && !currentGame.isCompleted) {
                        startGameRecording(currentGame.id, currentGame.difficulty);
                    }
                }
            }
        }

        // Update the ref to current count
        movesCountRef.current = newMovesCount;
    }, [currentGame?.moves?.length, currentGame?.id, isRecording, recordCellSelection]);

    // Initialize user analytics on mount
    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    // Track new games (with ref to prevent multiple calls)
    const recordingStartedRef = useRef<string | null>(null);
    const lastGameIdRef = useRef<string | null>(null);

    useEffect(() => {
        console.log('🎯 Game ID tracking:', {
            currentGameId: currentGame?.id,
            lastGameId: lastGameIdRef.current,
            isRecording,
            gameChanged: currentGame?.id !== lastGameIdRef.current
        });

        // Detect game changes (new game or restart)
        if (currentGame?.id !== lastGameIdRef.current) {
            // If we had a previous game, it was abandoned/restarted
            if (lastGameIdRef.current && isRecording) {
                console.log('🔄 Game changed - previous game abandoned:', lastGameIdRef.current);
                stopGameRecording();
            }
            lastGameIdRef.current = currentGame?.id || null;
        }

        if (currentGame && !isRecording && currentGame.id !== recordingStartedRef.current && !currentGame.isCompleted) {
            // Double-check that we don't already have analytics for this game
            const { currentGameAnalytics } = useAnalyticsStore.getState();
            if (!currentGameAnalytics || currentGameAnalytics.gameId !== currentGame.id) {
                recordingStartedRef.current = currentGame.id;
                startGameRecording(currentGame.id, currentGame.difficulty);
            }
        }
    }, [currentGame?.id, currentGame?.isCompleted, isRecording]);

    // Track game completion (with ref to prevent multiple calls)
    const completionRecordedRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentGame?.isCompleted && isRecording &&
            currentGame.id !== completionRecordedRef.current) {
            // Additional check: ensure we have analytics for this game
            const { currentGameAnalytics } = useAnalyticsStore.getState();

            if (currentGameAnalytics && currentGameAnalytics.gameId === currentGame.id) {
                completionRecordedRef.current = currentGame.id;
                recordGameCompletion(true);
            } else {
                // Try to start recording for this completed game retroactively
                if (currentGame.id && !currentGameAnalytics) {
                    startGameRecording(currentGame.id, currentGame.difficulty);
                    // Give it a moment then try completion again
                    setTimeout(() => {
                        const { currentGameAnalytics: newAnalytics } = useAnalyticsStore.getState();
                        if (newAnalytics && newAnalytics.gameId === currentGame.id) {
                            recordGameCompletion(true);
                        }
                    }, 100);
                }
            }
        }
    }, [currentGame?.isCompleted, currentGame?.id, isRecording]);

    return <>{children}</>;
};

// Hook for components to easily access analytics
export const useGameAnalytics = () => {
    const analyticsStore = useAnalyticsStore();
    const gameStore = useGameStore();

    // Enhanced move recording function
    const recordGameMove = (move: any, additionalContext?: any) => {
        if (!gameStore.currentGame) return;



        const gameContext = {
            isCorrect: additionalContext?.isCorrect,
            boardBefore: additionalContext?.boardBefore,
            boardAfter: gameStore.currentGame.board,
            emptyCellsRemaining: calculateEmptyCells(gameStore.currentGame.board),
            mistakes: gameStore.currentGame.mistakes,
            hintsUsed: gameStore.currentGame.hintsUsed,
            difficultyAtMove: 1, // TODO: Calculate dynamic difficulty
            ...additionalContext,
        };

        analyticsStore.recordMove(move, gameContext);
    };

    const recordHintUsage = (hintType: string, techniqueRevealed?: string) => {
        analyticsStore.recordHint(hintType, techniqueRevealed);
    };

    return {
        ...analyticsStore,
        recordGameMove,
        recordHintUsage,
    };
};

// Utility function
const calculateEmptyCells = (board: any[][]): number => {
    let empty = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value === null) {
                empty++;
            }
        }
    }
    return empty;
};
