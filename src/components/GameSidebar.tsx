import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Game Info Section */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-gray-100 mb-4">{t('game.gameInfo')}</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-gray-700">
            <span className="text-neutral-600 dark:text-gray-400">{t('game.difficulty')}</span>
            <span className="font-medium capitalize text-neutral-800 dark:text-gray-100">{t(`difficulty.${difficulty}`)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-gray-700">
            <span className="text-neutral-600 dark:text-gray-400">{t('game.hintsUsed')}</span>
            <span className="font-medium text-neutral-800 dark:text-gray-100">{hintsUsed}/{maxHints}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-gray-700">
            <span className="text-neutral-600 dark:text-gray-400">{t('game.mistakes')}</span>
            <span className={`font-medium ${mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-gray-100'}`}>
              {mistakes}/{maxMistakes}
            </span>
          </div>

          {selectedCell && (
            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-600 dark:text-gray-400">{t('game.selectedCell')}</span>
              <span className="font-medium text-neutral-800 dark:text-gray-100">
                Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-3">💡 {t('tips.quickTips')}</h3>
        <div className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
          <p>• {t('tips.spaceToggle')} <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">Space</kbd> {t('tips.toggleMode')}</p>
          <p>• {t('tips.pressKey')} <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">Ctrl+Z</kbd> {t('tips.undoMoves')}</p>
          <p>• {t('tips.clickCells')}</p>
          <p>• {t('tips.numbersAppear')}</p>
        </div>
      </div>
    </div>
  );
};
