import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CheckCircledIcon,
    TimerIcon,
    LightningBoltIcon,
    ExclamationTriangleIcon,
    RocketIcon,
    BarChartIcon,
    ArrowUpIcon
} from '@radix-ui/react-icons';
import { TrophyIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDifficultyEmoji } from '../../../../utils/completionUtils';
import type { Difficulty } from '../../../../types/';
import { DifficultyConfigManager } from '@/config/difficulty';

interface GameSidebarCompletedProps {
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
}

const ProgressBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const colorClasses = {
        green: 'bg-success-500 dark:bg-success-400',
        blue: 'bg-primary-500 dark:bg-primary-400',
        amber: 'bg-amber-500 dark:bg-amber-400',
        red: 'bg-error-500 dark:bg-error-400',
    };

    return (
        <div className="w-full h-2 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
                className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export const GameSidebarCompleted: React.FC<GameSidebarCompletedProps> = ({
    difficulty,
    completionTime,
    mistakes,
    maxMistakes,
    hintsUsed,
    maxHints,
    accuracy = 0,
    totalMoves = 0,
    isPersonalBest = false,
    onStartNewGame,
    onTryHarder,
    onViewStats,
}) => {
    const { t } = useTranslation();

    // Get next difficulty using the config manager
    const nextDifficulty = DifficultyConfigManager.getNextDifficulty(difficulty);
    const hasNextDifficulty = nextDifficulty !== null;

    return (
        <div className="hidden lg:block w-full lg:w-80 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Celebration Header */}
            <Card className="shadow-xl border-2 border-primary-500 dark:border-primary-600/50 bg-primary-50 dark:bg-gray-800">
                <CardHeader className="pb-4 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full border-2 border-primary-300 dark:border-primary-800/50 animate-in zoom-in duration-300">
                            <CheckCircledIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-primary-700 dark:text-primary-300">
                        {t('completion.puzzleSolved')}
                    </CardTitle>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-1">
                        <span>{getDifficultyEmoji(difficulty)}</span>
                        <span>{t(`difficulty.${difficulty}`)}</span>
                    </p>
                </CardHeader>
            </Card>

            {/* Stats Section */}
            <Card className="shadow-lg animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '100ms' }}>
                <CardHeader className="bg-neutral-50 dark:bg-gray-800 pb-4">
                    <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                        <BarChartIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        {t('completion.yourPerformance')}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-6 pt-6 pb-6">
                    {/* Time Stat */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TimerIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {t('completion.time')}
                                </span>
                            </div>
                            <span className="text-lg font-bold tabular-nums">{completionTime}</span>
                        </div>
                        {isPersonalBest && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/20 px-2 py-1 rounded-md border border-primary-300 dark:border-primary-800/50">
                                <TrophyIcon className="w-3.5 h-3.5" />
                                <span>{t('completion.personalBest')}</span>
                            </div>
                        )}
                    </div>

                    {/* Accuracy Stat */}
                    {accuracy > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircledIcon className="w-4 h-4 text-success-600 dark:text-success-500" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t('completion.accuracy')}
                                    </span>
                                </div>
                                <span className="text-lg font-bold tabular-nums">{Math.round(accuracy)}%</span>
                            </div>
                            <ProgressBar value={accuracy} max={100} color="blue" />
                            {totalMoves > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {Math.round((accuracy / 100) * totalMoves)}/{totalMoves} correct first try
                                </p>
                            )}
                        </div>
                    )}

                    {/* Hints Used */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LightningBoltIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {t('game.hintsUsed')}
                                </span>
                            </div>
                            <span className="text-lg font-bold tabular-nums">{hintsUsed} / {maxHints}</span>
                        </div>
                        <ProgressBar value={hintsUsed} max={maxHints} color="blue" />
                    </div>

                    {/* Mistakes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {t('game.mistakes')}
                                </span>
                            </div>
                            <span className="text-lg font-bold tabular-nums">{mistakes} / {maxMistakes}</span>
                        </div>
                        <ProgressBar value={mistakes} max={maxMistakes} color="blue" />
                    </div>

                    {/* Total Moves */}
                    {totalMoves > 0 && (
                        <div className="pt-2 border-t border-neutral-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('completion.totalMoves')}</span>
                                <span className="font-semibold tabular-nums">{totalMoves}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions Section */}
            <Card className="shadow-lg animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '200ms' }}>
                <div className="p-4 space-y-2">
                    {/* Primary Action - New Puzzle */}
                    <Button
                        onClick={onStartNewGame}
                        size="lg"
                        className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold shadow-md transition-all duration-200 gap-2"
                    >
                        <RocketIcon className="w-4 h-4" />
                        {t('completion.newPuzzle')}
                    </Button>

                    {/* Try Harder Level */}
                    {onTryHarder && hasNextDifficulty && (
                        <Button
                            onClick={() => {
                                console.log('Try Harder clicked, current difficulty:', difficulty, 'next:', nextDifficulty);
                                onTryHarder();
                            }}
                            size="default"
                            variant="outline"
                            className="w-full font-medium transition-all duration-200 gap-2"
                        >
                            <ArrowUpIcon className="w-4 h-4" />
                            <span>Try <span className="capitalize">{t(`difficulty.${nextDifficulty}`)}</span></span>
                        </Button>
                    )}

                    {/* View Full Stats */}
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
            </Card>
        </div>
    );
};
