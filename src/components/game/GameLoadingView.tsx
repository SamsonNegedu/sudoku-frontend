import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../PageLayout';
import { LoadingSpinner } from '../shared';
import { DifficultyConfigManager } from '../../config/difficulty';
import type { Difficulty } from '../../types';

interface GameLoadingViewProps {
    isGeneratingPuzzle: boolean;
    onNewGame: (difficulty: Difficulty) => void;
}

export const GameLoadingView: React.FC<GameLoadingViewProps> = ({
    isGeneratingPuzzle,
    onNewGame
}) => {
    const { t } = useTranslation();
    return (
        <PageLayout
            centered={true}
            className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4"
        >
            <div className="max-w-2xl w-full px-2 sm:px-0">
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
                        <div className="text-center mb-10 sm:mb-14">
                            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                {t('loading.chooseChallenge')}
                            </h1>
                            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400">{t('loading.selectToStart')}</p>
                        </div>

                        {/* Desktop: Modern Card Grid */}
                        <div className="hidden sm:grid grid-cols-2 gap-5">
                            {DifficultyConfigManager.getDifficultyOptions().map(({ value }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-8 rounded-2xl transition-all duration-300 text-center ${isGeneratingPuzzle
                                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-40'
                                        : 'bg-white dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative flex flex-col items-center gap-4">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {t(`difficulty.${value}`)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px]">
                                            {t(`difficulty.descriptions.${value}`)}
                                        </div>
                                        <div className="mt-1 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Clean Grid */}
                        <div className="block sm:hidden grid grid-cols-2 gap-4">
                            {DifficultyConfigManager.getDifficultyOptions().map(({ value }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 text-center aspect-square flex flex-col justify-center ${isGeneratingPuzzle
                                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-40'
                                        : 'bg-white dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 active:scale-95'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative flex flex-col items-center gap-2">
                                        <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
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
