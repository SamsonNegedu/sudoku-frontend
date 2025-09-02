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
        isRecording
    } = useAnalyticsStore();

    const { currentGame, selectedCell } = useGameStore();

    // Initialize user analytics on mount
    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    // Track new games (with ref to prevent multiple calls)
    const recordingStartedRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentGame && !isRecording && currentGame.id !== recordingStartedRef.current && !currentGame.isCompleted) {
            recordingStartedRef.current = currentGame.id;
            startGameRecording(currentGame.id, currentGame.difficulty);
        }
    }, [currentGame?.id, currentGame?.isCompleted, isRecording]);

    // Track cell selection
    useEffect(() => {
        if (selectedCell && isRecording) {

            recordCellSelection(selectedCell.row, selectedCell.col);
        }
    }, [selectedCell?.row, selectedCell?.col, isRecording]);

    // Track game completion (with ref to prevent multiple calls)
    const completionRecordedRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentGame?.isCompleted && isRecording &&
            currentGame.id !== completionRecordedRef.current &&
            currentGame.id === recordingStartedRef.current) {
            completionRecordedRef.current = currentGame.id;
            recordGameCompletion(true);
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

    const recordHintUsage = (hintType: string) => {

        analyticsStore.recordHint(hintType);
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
