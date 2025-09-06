import React from 'react';
import { PageLayout } from '../PageLayout';
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
    return (
        <PageLayout
            centered={true}
            className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-4"
        >
            <div className="max-w-md w-full">
                {isGeneratingPuzzle ? (
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Generating Puzzle</h3>
                            <p className="text-neutral-600">Creating your perfect Sudoku challenge...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                                Choose your challenge level
                            </h1>
                            <p className="text-neutral-600">Select a difficulty to start playing</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 relative">
                            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Select Difficulty</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {DifficultyConfigManager.getDifficultyOptions().map(({ value, label, description, color }) => (
                                    <button
                                        key={value}
                                        onClick={() => onNewGame(value)}
                                        disabled={isGeneratingPuzzle}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${isGeneratingPuzzle
                                            ? 'border-neutral-100 bg-neutral-50 cursor-not-allowed opacity-60'
                                            : 'border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${color}`} />
                                        <div className="flex-1">
                                            <div className="font-medium text-base text-neutral-800">{label}</div>
                                            <div className="text-sm text-neutral-600">{description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Modern Loading Overlay */}
                            {isGeneratingPuzzle && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                                    <div className="text-center">
                                        {/* Animated Sudoku Grid Icon */}
                                        <div className="relative w-12 h-12 mx-auto mb-4">
                                            <div className="absolute inset-0 grid grid-cols-3 gap-px">
                                                {[...Array(9)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-indigo-500 rounded-sm animate-pulse"
                                                        style={{
                                                            animationDelay: `${i * 100}ms`,
                                                            animationDuration: '1.5s'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Loading Text with Difficulty-aware Estimates */}
                                        <div className="space-y-1">
                                            <p className="font-medium text-neutral-800">
                                                Crafting your puzzle
                                                <span className="inline-flex ml-1">
                                                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                                                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                                                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                                                </span>
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                🚀 Using Web Worker for smooth performance
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                Your browser stays responsive while we work
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};
