import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../PageLayout';
import { LoadingSpinner } from '../shared';
import { DifficultyConfigManager } from '../../config/difficulty';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '@/components/ui/button';
import { PlayIcon, LightningBoltIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import type { Difficulty } from '../../types';

interface GameLoadingViewProps {
    isGeneratingPuzzle: boolean;
    onNewGame: (difficulty: Difficulty) => void;
}

// Difficulty icons mapping
const difficultyIcons: Record<string, string> = {
    'beginner': '🟢',
    'intermediate': '🟡',
    'advanced': '🟠',
    'expert': '🔴',
    'master': '🟣',
    'grandmaster': '⚫'
};

export const GameLoadingView: React.FC<GameLoadingViewProps> = ({
    isGeneratingPuzzle,
    onNewGame
}) => {
    const { t } = useTranslation();
    const { currentGame, resumeGame } = useGameStore();

    // Check if there's a game in progress
    const hasGameInProgress = currentGame && !currentGame.isCompleted;

    return (
        <PageLayout
            centered={true}
            className="bg-gray-50 dark:bg-gray-950 p-4"
        >
            <div className="max-w-2xl w-full px-2 sm:px-4">
                {isGeneratingPuzzle ? (
                    <div className="text-center">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-gray-700 p-8 sm:p-12">
                            <LoadingSpinner size="medium" className="mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('loading.generatingPuzzle')}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{t('loading.creatingChallenge')}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Hero Section */}
                        <div className="text-center mb-4 sm:mb-6">
                            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                {t('loading.appTitle')}
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                                {t('loading.appTagline')}
                            </p>

                            {/* Feature Highlights */}
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-4 sm:mb-6">
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <LightningBoltIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                                    <span>{t('loading.smartHints')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                                    <span>{t('loading.trackProgress')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <CheckCircledIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                                    <span>{t('loading.difficultyLevels')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Continue Game Button */}
                        {hasGameInProgress && (
                            <div className="mb-4 sm:mb-6">
                                <Button
                                    onClick={resumeGame}
                                    size="lg"
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg py-4 sm:py-5 text-base sm:text-lg"
                                >
                                    <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    {t('loading.continueGame')} ({t(`difficulty.${currentGame.difficulty}`)})
                                </Button>
                            </div>
                        )}

                        {/* Difficulty Selection Title */}
                        <div className="text-center mb-3 sm:mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                                {hasGameInProgress ? t('loading.orStartNew') : t('loading.chooseChallenge')}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {t('loading.selectToStart')}
                            </p>
                        </div>

                        {/* Desktop: Modern Card Grid */}
                        <div className="hidden sm:grid grid-cols-3 gap-3 lg:gap-4">
                            {DifficultyConfigManager.getDifficultyOptions().map(({ value }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-4 lg:p-5 rounded-xl transition-all duration-300 text-center ${isGeneratingPuzzle
                                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-40'
                                        : 'bg-white dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative flex flex-col items-center gap-2">
                                        {/* Difficulty Icon */}
                                        <div className="text-3xl lg:text-4xl">
                                            {difficultyIcons[value]}
                                        </div>
                                        <div className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors duration-300 capitalize">
                                            {t(`difficulty.${value}`)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                            {t(`difficulty.descriptions.${value}`)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Clean Grid */}
                        <div className="block sm:hidden grid grid-cols-2 gap-3">
                            {DifficultyConfigManager.getDifficultyOptions().map(({ value }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 text-center aspect-square flex flex-col justify-center ${isGeneratingPuzzle
                                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-40'
                                        : 'bg-white dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-500/50 active:scale-95'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative flex flex-col items-center gap-3">
                                        {/* Difficulty Icon */}
                                        <div className="text-4xl">
                                            {difficultyIcons[value]}
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors duration-300 capitalize">
                                            {t(`difficulty.${value}`)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                            {t(`difficulty.descriptions.${value}`)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Modern Loading Overlay */}
                        {isGeneratingPuzzle && (
                            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-gray-700 p-10 sm:p-12 max-w-sm w-full mx-4 text-center">
                                    <LoadingSpinner size="medium" className="mx-auto mb-6" />
                                    <p className="text-gray-900 dark:text-white font-bold text-lg">{t('loading.generatingPuzzle')}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
};
