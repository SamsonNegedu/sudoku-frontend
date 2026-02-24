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
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-neutral-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-neutral-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('game.gameInfo')}</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Difficulty Card */}
          <div className="group p-4 bg-neutral-50 dark:bg-gray-700/50 rounded-lg border border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.difficulty')}
              </span>
              <GridIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {t(`difficulty.${difficulty}`)}
            </p>
          </div>

          {/* Hints Card */}
          <div className="group p-4 bg-neutral-50 dark:bg-gray-700/50 rounded-lg border border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.hintsUsed')}
              </span>
              <LightningBoltIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{hintsUsed}</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">/ {maxHints}</span>
            </div>
          </div>

          {/* Mistakes Card */}
          <div className="group p-4 bg-neutral-50 dark:bg-gray-700/50 rounded-lg border border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('game.mistakes')}
              </span>
              <ExclamationTriangleIcon className={`w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity ${mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-bold ${mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {mistakes}
              </span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">/ {maxMistakes}</span>
            </div>
          </div>

          {/* Selected Cell Card */}
          {selectedCell && (
            <div className="group p-4 bg-neutral-50 dark:bg-gray-700/50 rounded-lg border border-neutral-200 dark:border-gray-600 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {t('game.selectedCell')}
                </span>
                <CursorTextIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                R{selectedCell.row + 1} • C{selectedCell.col + 1}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-neutral-50 dark:bg-gray-700/50 rounded-xl p-6 border border-neutral-200 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-4">
          <LightningBoltIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('tips.quickTips')}</h3>
        </div>
        <div className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">{t('tips.spaceToggle')} <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Space</kbd> {t('tips.toggleMode')}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">{t('tips.pressKey')} <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Ctrl+Z</kbd> {t('tips.undoMoves')}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">Use <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">↑↓←→</kbd> to navigate cells</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">1-9</kbd> to enter numbers</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Del</kbd> to clear a cell</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">?</kbd> for help with shortcuts</p>
          </div>
        </div>
      </div>
    </div>
  );
};
