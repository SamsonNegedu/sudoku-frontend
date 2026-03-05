import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridIcon, LightningBoltIcon, ExclamationTriangleIcon, CursorTextIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Difficulty } from '../../../../types/';
import { GameSidebarCompleted } from './GameSidebarCompleted';

interface KeyboardShortcutsModalRef {
  open: () => void;
  close: () => void;
}

interface GameSidebarProps {
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  hintsUsed: number;
  maxHints: number;
  mistakes: number;
  maxMistakes: number;
  shortcutsModalRef?: React.RefObject<KeyboardShortcutsModalRef>;
  isCompleted?: boolean;
  completionTime?: string;
  accuracy?: number;
  totalMoves?: number;
  isPersonalBest?: boolean;
  onStartNewGame?: () => void;
  onTryHarder?: () => void;
  onViewStats?: () => void;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  selectedCell,
  difficulty,
  hintsUsed,
  maxHints,
  mistakes,
  maxMistakes,
  shortcutsModalRef,
  isCompleted = false,
  completionTime,
  accuracy,
  totalMoves,
  isPersonalBest,
  onStartNewGame,
  onTryHarder,
  onViewStats,
}) => {
  const { t } = useTranslation();

  // Show completion view if game is completed
  if (isCompleted && completionTime && onStartNewGame) {
    return (
      <GameSidebarCompleted
        difficulty={difficulty}
        completionTime={completionTime}
        mistakes={mistakes}
        maxMistakes={maxMistakes}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
        accuracy={accuracy}
        totalMoves={totalMoves}
        isPersonalBest={isPersonalBest}
        onStartNewGame={onStartNewGame}
        onTryHarder={onTryHarder}
        onViewStats={onViewStats}
      />
    );
  }

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Game Info Section */}
      <Card className="hidden lg:block shadow-lg overflow-hidden">
        <CardHeader className="bg-neutral-100 dark:bg-gray-700/90 border-b border-neutral-200 dark:border-gray-600 pb-4 pt-5 px-6">
          <CardTitle className="text-base font-bold">{t('game.gameInfo')}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 px-6 pt-5 pb-6 bg-card">
          {/* Difficulty Card */}
          <div className="group p-4 rounded-lg border bg-card hover:bg-accent transition-all shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t('game.difficulty')}
              </span>
              <GridIcon className="w-4 h-4 text-primary-600 dark:text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-lg font-bold capitalize">
              {t(`difficulty.${difficulty}`)}
            </p>
          </div>

          {/* Hints Card */}
          <div className="group p-4 rounded-lg border bg-card hover:bg-accent transition-all shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t('game.hintsUsed')}
              </span>
              <LightningBoltIcon className="w-4 h-4 text-primary-600 dark:text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{hintsUsed}</span>
              <span className="text-sm font-semibold text-muted-foreground">/ {maxHints}</span>
            </div>
          </div>

          {/* Mistakes Card */}
          <div className="group p-4 rounded-lg border bg-card hover:bg-accent transition-all shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t('game.mistakes')}
              </span>
              <ExclamationTriangleIcon className={`w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity ${mistakes > 0 ? 'text-error-600 dark:text-error-400' : 'text-primary-600 dark:text-primary-500'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-bold ${mistakes > 0 ? 'text-error-600 dark:text-error-400' : ''}`}>
                {mistakes}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">/ {maxMistakes}</span>
            </div>
          </div>

          {/* Selected Cell Card */}
          {selectedCell && (
            <div className="group p-4 rounded-lg border bg-card hover:bg-accent transition-all shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t('game.selectedCell')}
                </span>
                <CursorTextIcon className="w-4 h-4 text-primary-600 dark:text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-lg font-bold">
                R{selectedCell.row + 1} • C{selectedCell.col + 1}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips Section */}
      <Card className="hidden lg:block">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LightningBoltIcon className="w-5 h-5 text-primary-600 dark:text-primary-500" />
            <CardTitle>{t('tips.quickTips')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">{t('tips.spaceToggle')} <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Space</kbd> {t('tips.toggleMode')}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">{t('tips.pressKey')} <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Ctrl+Z</kbd> {t('tips.undoMoves')}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">Use <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">↑↓←→</kbd> to navigate cells</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">1-9</kbd> to enter numbers</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">Del</kbd> to clear a cell</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-500 font-bold">•</span>
            <p className="flex-1">Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md text-xs font-semibold shadow-sm border border-neutral-300 dark:border-gray-600">?</kbd> for help with shortcuts</p>
          </div>
          
          {/* View All Shortcuts Button */}
          <div className="pt-2">
            <Button
              onClick={() => shortcutsModalRef?.current?.open()}
              variant="outline"
              size="sm"
              className="w-full gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
            >
              <QuestionMarkCircledIcon className="w-4 h-4" />
              View All Shortcuts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
