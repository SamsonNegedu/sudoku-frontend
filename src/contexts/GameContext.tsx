import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import type { Difficulty, GameState } from '../types';

export interface GameContextValue {
    currentGame: GameState | null;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGeneratingPuzzle: boolean;
    completionPercentage: number;
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onPause: () => void;
    onResume: () => void;
    onShowHelp?: () => void;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);

interface GameProviderProps {
    children: ReactNode;
    value: GameContextValue;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, value }) => {
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
