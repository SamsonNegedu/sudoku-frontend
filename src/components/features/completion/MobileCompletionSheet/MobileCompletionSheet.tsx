import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
    CheckCircledIcon,
    TimerIcon,
    RocketIcon,
    BarChartIcon,
    ArrowUpIcon,
    LightningBoltIcon,
    ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { TrophyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDifficultyEmoji } from '../../../../utils/completionUtils';
import type { Difficulty } from '../../../../types/';
import { DifficultyConfigManager } from '@/config/difficulty';

interface MobileCompletionModalProps {
    isVisible: boolean;
    difficulty: Difficulty;
    completionTime: string;
    mistakes: number;
    maxMistakes: number;
    hintsUsed: number;
    maxHints: number;
    accuracy?: number;
    totalMoves?: number;
    isPersonalBest?: boolean;
    onStartNewGame: () => void;
    onTryHarder?: () => void;
    onViewStats?: () => void;
    onDismiss: () => void;
}

export const MobileCompletionSheet: React.FC<MobileCompletionModalProps> = ({
    isVisible,
    difficulty,
    completionTime,
    mistakes,
    maxMistakes,
    hintsUsed,
    maxHints,
    isPersonalBest = false,
    onStartNewGame,
    onTryHarder,
    onViewStats,
    onDismiss,
}) => {
    const { t } = useTranslation();

    // Get next difficulty using the config manager
    const nextDifficulty = DifficultyConfigManager.getNextDifficulty(difficulty);
    const hasNextDifficulty = nextDifficulty !== null;

    // Prevent the tap that completed the puzzle from immediately dismissing the modal (event bubbling)
    const openedAtRef = useRef<number>(0);
    useEffect(() => {
        if (isVisible) openedAtRef.current = Date.now();
    }, [isVisible]);

    const handleBackdropClick = () => {
        const elapsed = Date.now() - openedAtRef.current;
        if (elapsed < 400) return; // ignore clicks within 400ms of opening
        onDismiss();
    };

    if (!isVisible) return null;

    const modalContent = (
        <>
            {/* Modal Backdrop - only show on mobile (lg:hidden) */}
            <div
                className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] backdrop-blur-sm animate-in fade-in duration-300 lg:hidden"
                onClick={handleBackdropClick}
            />

            {/* Centered Modal - only show on mobile (lg:hidden) */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 pointer-events-none lg:hidden">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 fade-in duration-300 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full border-2 border-primary-300 dark:border-primary-800/50">
                                <CheckCircledIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-primary-700 dark:text-primary-300">
                            {t('completion.puzzleSolved')}
                        </h2>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-1">
                            <span>{getDifficultyEmoji(difficulty)}</span>
                            <span>{t(`difficulty.${difficulty}`)}</span>
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="px-6 pb-5">
                        {/* Personal Best Badge */}
                        {isPersonalBest && (
                            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 px-3 py-2 rounded-lg border border-primary-300 dark:border-primary-800/50 mb-4">
                                <TrophyIcon className="w-4 h-4" />
                                <span>{t('completion.personalBest')}</span>
                            </div>
                        )}

                        {/* Stats Grid - 3 equal columns */}
                        <div className="grid grid-cols-3 gap-2.5">
                            {/* Time */}
                            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-gray-700/50 border border-neutral-200 dark:border-gray-600 text-center">
                                <TimerIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                                <div className="text-[10px] text-muted-foreground mb-1">{t('completion.time')}</div>
                                <div className="text-lg font-bold tabular-nums">{completionTime}</div>
                            </div>

                            {/* Hints */}
                            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-gray-700/50 border border-neutral-200 dark:border-gray-600 text-center">
                                <LightningBoltIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                                <div className="text-[10px] text-muted-foreground mb-1">{t('game.hints')}</div>
                                <div className="text-lg font-bold tabular-nums">{hintsUsed}/{maxHints}</div>
                            </div>

                            {/* Mistakes */}
                            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-gray-700/50 border border-neutral-200 dark:border-gray-600 text-center">
                                <ExclamationTriangleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1.5" />
                                <div className="text-[10px] text-muted-foreground mb-1">{t('game.mistakes')}</div>
                                <div className="text-lg font-bold tabular-nums">{mistakes}/{maxMistakes}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 space-y-2.5">
                        {/* Primary Action - New Puzzle */}
                        <Button
                            onClick={onStartNewGame}
                            size="lg"
                            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold shadow-md transition-all duration-200 gap-2"
                        >
                            <RocketIcon className="w-4 h-4" />
                            {t('completion.newPuzzle')}
                        </Button>

                        {/* Try Harder */}
                        {onTryHarder && hasNextDifficulty && nextDifficulty && (
                            <Button
                                onClick={onTryHarder}
                                size="default"
                                variant="outline"
                                className="w-full font-medium transition-all duration-200 gap-2"
                            >
                                <ArrowUpIcon className="w-4 h-4" />
                                <span>Try <span className="capitalize">{t(`difficulty.${nextDifficulty}`)}</span></span>
                            </Button>
                        )}

                        {/* View Stats */}
                        {onViewStats && (
                            <Button
                                onClick={onViewStats}
                                size="default"
                                variant="outline"
                                className="w-full font-medium transition-all duration-200 gap-2 border-neutral-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
                            >
                                <BarChartIcon className="w-4 h-4" />
                                {t('completion.viewStats')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
};
