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
            className="bg-gradient-to-br from-slate-50 to-blue-50 p-4"
        >
            <div className="max-w-lg w-full px-2 sm:px-0">
                {isGeneratingPuzzle ? (
                    <div className="text-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                            <LoadingSpinner size="medium" className="mx-auto mb-6" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('loading.generatingPuzzle')}</h3>
                            <p className="text-slate-600 text-sm">{t('loading.creatingChallenge')}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8 sm:mb-12">
                            <h1 className="text-2xl sm:text-4xl font-light text-slate-900 mb-2 sm:mb-4 tracking-tight">
                                {t('loading.chooseChallenge')}
                            </h1>
                            <p className="text-sm sm:text-lg text-slate-500 font-light">{t('loading.selectToStart')}</p>
                        </div>

                        {/* Desktop: Vertical List */}
                        <div className="hidden sm:block space-y-8">
                            {DifficultyConfigManager.getDifficultyOptions().map(({ value, color }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 text-left w-full ${isGeneratingPuzzle
                                        ? 'bg-slate-100 cursor-not-allowed opacity-40'
                                        : 'bg-white/40 hover:bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="relative flex items-center gap-5">
                                        <div className={`w-4 h-4 rounded-full ${color} ring-2 ring-white shadow-sm`} />
                                        <div className="flex-1">
                                            <div className="text-xl font-light text-slate-900 mb-1 tracking-wide">{t(`difficulty.${value}`)}</div>
                                            <div className="text-sm text-slate-500 font-light leading-relaxed min-h-[1.25rem]">{t(`difficulty.descriptions.${value}`)}</div>
                                        </div>
                                        <div className="text-slate-400 group-hover:text-blue-600 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Clean 2x2 Grid */}
                        <div className="block sm:hidden grid grid-cols-2 gap-4">
                            {DifficultyConfigManager.getDifficultyOptions().slice(0, 4).map(({ value, color }, index) => (
                                <button
                                    key={value}
                                    onClick={() => onNewGame(value)}
                                    disabled={isGeneratingPuzzle}
                                    className={`group relative overflow-hidden p-4 rounded-xl transition-all duration-300 text-center aspect-square flex flex-col justify-center ${isGeneratingPuzzle
                                        ? 'bg-slate-100 cursor-not-allowed opacity-40'
                                        : 'bg-white/40 hover:bg-white/80 backdrop-blur-sm hover:shadow-lg hover:scale-105'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="relative flex flex-col items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${color} ring-2 ring-white shadow-sm`} />
                                        <div className="text-center">
                                            <div className="text-base font-medium text-slate-900 mb-1">{t(`difficulty.${value}`)}</div>
                                            <div className="text-xs text-slate-500 font-light leading-tight">{t(`difficulty.descriptions.${value}`)}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Advanced Difficulties (Optional Row) */}
                        <div className="block sm:hidden mt-4">
                            <div className="text-center mb-3">
                                <p className="text-xs text-slate-500 font-light">{t('loading.advancedChallenges')}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {DifficultyConfigManager.getDifficultyOptions().slice(4).map(({ value, color }, index) => (
                                    <button
                                        key={value}
                                        onClick={() => onNewGame(value)}
                                        disabled={isGeneratingPuzzle}
                                        className={`group relative overflow-hidden p-3 rounded-lg transition-all duration-300 text-center aspect-[4/3] flex flex-col justify-center ${isGeneratingPuzzle
                                            ? 'bg-slate-100 cursor-not-allowed opacity-40'
                                            : 'bg-white/30 hover:bg-white/70 backdrop-blur-sm hover:shadow-md hover:scale-105 border border-slate-200/50'
                                            }`}
                                        style={{ animationDelay: `${(index + 4) * 50}ms` }}
                                    >
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        <div className="relative flex flex-col items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${color} ring-1 ring-white shadow-sm`} />
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-slate-900 mb-0.5">{t(`difficulty.${value}`)}</div>
                                                <div className="text-xs text-slate-500 font-light leading-tight">{t(`difficulty.descriptions.${value}`)}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modern Loading Overlay */}
                        {isGeneratingPuzzle && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 max-w-sm w-full mx-4 text-center">
                                    <LoadingSpinner size="medium" className="mx-auto mb-4" />
                                    <p className="text-slate-800 font-medium text-sm sm:text-base">{t('loading.generatingPuzzle')}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
};
