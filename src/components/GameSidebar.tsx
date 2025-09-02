import React from 'react';
import type { Difficulty } from '../types';

interface GameSidebarProps {
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  hintsUsed: number;
  maxHints: number;
  mistakes: number;
  maxMistakes: number;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  selectedCell,
  difficulty,
  hintsUsed,
  maxHints,
  mistakes,
  maxMistakes,
}) => {
  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Game Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Game Info</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-600">Difficulty</span>
            <span className="font-medium capitalize text-neutral-800">{difficulty}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-600">Hints Used</span>
            <span className="font-medium text-neutral-800">{hintsUsed}/{maxHints}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-600">Mistakes</span>
            <span className={`font-medium ${mistakes > 0 ? 'text-red-600' : 'text-neutral-800'}`}>
              {mistakes}/{maxMistakes}
            </span>
          </div>

          {selectedCell && (
            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-600">Selected Cell</span>
              <span className="font-medium text-neutral-800">
                Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">💡 Quick Tips</h3>
        <div className="space-y-2 text-sm text-indigo-700">
          <p>• Use <kbd className="px-1 py-0.5 bg-white rounded text-xs">Space</kbd> to toggle pen/pencil mode</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+Z</kbd> to undo moves</p>
          <p>• Click cells to select and highlight related numbers</p>
          <p>• Numbers appear horizontally below the grid</p>
        </div>
      </div>
    </div>
  );
};
