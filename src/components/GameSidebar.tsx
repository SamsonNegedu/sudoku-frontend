import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridIcon, LightningBoltIcon, ExclamationTriangleIcon, CursorTextIcon } from '@radix-ui/react-icons';
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
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('game.gameInfo')}</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Difficulty Card */}
          <div className="group p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 rounded-lg border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.difficulty')}
              </span>
              <GridIcon className="w-4 h-4 text-blue-500 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {t(`difficulty.${difficulty}`)}
            </p>
          </div>

          {/* Hints Card */}
          <div className="group p-4 bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10 rounded-lg border border-amber-100 dark:border-amber-900/30 hover:border-amber-200 dark:hover:border-amber-800 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.hintsUsed')}
              </span>
              <LightningBoltIcon className="w-4 h-4 text-amber-500 dark:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{hintsUsed}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ {maxHints}</span>
            </div>
          </div>

          {/* Mistakes Card */}
          <div className="group p-4 bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 rounded-lg border border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.mistakes')}
              </span>
              <ExclamationTriangleIcon className={`w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity ${mistakes > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-bold ${mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {mistakes}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ {maxMistakes}</span>
            </div>
          </div>

          {/* Selected Cell Card */}
          {selectedCell && (
            <div className="group p-4 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 rounded-lg border border-green-100 dark:border-green-900/30 hover:border-green-200 dark:hover:border-green-800 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {t('game.selectedCell')}
                </span>
                <CursorTextIcon className="w-4 h-4 text-green-500 dark:text-green-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                R{selectedCell.row + 1} • C{selectedCell.col + 1}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">💡 {t('tips.quickTips')}</h3>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• {t('tips.spaceToggle')} <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">Space</kbd> {t('tips.toggleMode')}</p>
          <p>• {t('tips.pressKey')} <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">Ctrl+Z</kbd> {t('tips.undoMoves')}</p>
          <p>• Use <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">↑↓←→</kbd> to navigate cells</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">1-9</kbd> to enter numbers</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">Del</kbd> to clear a cell</p>
          <p>• Press <kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 rounded text-xs">?</kbd> for help with shortcuts</p>
        </div>
      </div>
    </div>
  );
};
