import React from 'react';
import { GameTimer } from './GameTimer';
import { GameControls } from './GameControls';
import type { Difficulty } from '../types';

interface GameHeaderProps {
  startTime: Date;
  isPaused: boolean;
  isCompleted: boolean;
  isPlaying: boolean;
  difficulty: Difficulty;
  hintsUsed: number;
  maxHints: number;
  canUndo: boolean;
  onNewGame: () => void;
  onPause: () => void;
  onResume: () => void;
  onHint: () => void;
  onUndo: () => void;
  onReset: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  startTime,
  isPaused,
  isCompleted,
  isPlaying,
  difficulty,
  hintsUsed,
  maxHints,
  canUndo,
  onNewGame,
  onPause,
  onResume,
  onHint,
  onUndo,
  onReset,
}) => {
  return (
    <div className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* Left side - Timer and Game Info */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <GameTimer
              startTime={startTime}
              isPaused={isPaused}
              isCompleted={isCompleted}
            />
            
            {isPlaying && (
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <span>Difficulty:</span>
                  <span className="font-medium capitalize text-neutral-800">{difficulty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Hints:</span>
                  <span className="font-medium text-neutral-800">{hintsUsed}/{maxHints}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Game Controls */}
          <div className="flex-shrink-0">
            <GameControls
              onNewGame={onNewGame}
              onPause={onPause}
              onResume={onResume}
              onHint={onHint}
              onUndo={onUndo}
              onReset={onReset}
              isPlaying={isPlaying}
              isPaused={isPaused}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              canUndo={canUndo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
