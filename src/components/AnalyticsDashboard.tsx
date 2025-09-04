import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { useAnalyticsStore } from '../stores/analyticsStore';
import type { Difficulty } from '../types';
import {
    TrashIcon,
} from '@radix-ui/react-icons';

export const AnalyticsDashboard: React.FC = () => {
    const {
        userAnalytics,
        getUserInsights,
        getProgressData,
        getTechniqueInsights,
        clearAllData,
    } = useAnalyticsStore();

    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');

    if (!userAnalytics) {
        return (
            <div className="p-6 text-center">
                <p className="text-neutral-600">No analytics data available yet. Play some games to see your progress!</p>
            </div>
        );
    }

    if (userAnalytics.gamesPlayed.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-neutral-600">No completed games yet. Finish a game to see your analytics!</p>
            </div>
        );
    }

    const progressData = getProgressData(selectedDifficulty);
    const userInsights = getUserInsights();
    const techniqueInsights = getTechniqueInsights();
    const recentGames = userAnalytics.gamesPlayed.slice(-5);


    return (
        <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Your Sudoku Analytics</h1>
                <p className="text-sm sm:text-base text-neutral-600">Track your progress and improve your solving skills</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{userAnalytics.overallStats.totalGames}</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Games Played</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">{userAnalytics.overallStats.completedGames}</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Completed</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-red-600">{userAnalytics.overallStats.totalGames - userAnalytics.overallStats.completedGames}</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Abandoned</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                        {userAnalytics.overallStats.totalGames > 0 ? Math.round((userAnalytics.overallStats.completedGames / userAnalytics.overallStats.totalGames) * 100) : 0}%
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600">Completion Rate</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4 col-span-2 sm:col-span-1">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">
                        {Math.round(userAnalytics.overallStats.averageTimePerGame / 60000)}m
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600">Avg Time</div>
                </div>
            </div>

            {/* Insights */}
            {userInsights.length > 0 && (
                <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Insights & Recommendations</h2>
                    <div className="space-y-3">
                        {userInsights.map((insight, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border-l-4 ${insight.type === 'strength' ? 'border-green-500 bg-green-50' :
                                    insight.type === 'weakness' ? 'border-red-500 bg-red-50' :
                                        insight.type === 'suggestion' ? 'border-blue-600 bg-blue-50' :
                                            'border-purple-500 bg-purple-50'
                                    }`}
                            >
                                <div className="text-sm sm:text-base font-medium text-neutral-900">{insight.title}</div>
                                <div className="text-xs sm:text-sm text-neutral-600">{insight.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Difficulty Progress */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Progress by Difficulty</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {(Object.keys(userAnalytics.difficultyProgress) as Difficulty[]).map((difficulty) => (
                        <Button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            variant={selectedDifficulty === difficulty ? "solid" : "outline"}
                            size="1"
                            className={`capitalize text-xs sm:text-sm px-2 sm:px-3 ${selectedDifficulty === difficulty
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {difficulty}
                        </Button>
                    ))}
                </div>

                {progressData && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                            <div className="text-base sm:text-lg font-semibold">{progressData.gamesPlayed}</div>
                            <div className="text-xs sm:text-sm text-neutral-600">Games Played</div>
                        </div>
                        <div>
                            <div className="text-base sm:text-lg font-semibold">{progressData.gamesCompleted}</div>
                            <div className="text-xs sm:text-sm text-neutral-600">Completed</div>
                        </div>
                        <div>
                            <div className="text-base sm:text-lg font-semibold">{progressData.accuracy.toFixed(1)}%</div>
                            <div className="text-xs sm:text-sm text-neutral-600">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-base sm:text-lg font-semibold">
                                {!progressData.bestTime || progressData.bestTime === Infinity ? 'N/A' :
                                    progressData.bestTime < 60000 ?
                                        Math.round(progressData.bestTime / 1000) + 's' :
                                        Math.round(progressData.bestTime / 60000) + 'm'
                                }
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600">Best Time</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Technique Mastery */}
            {techniqueInsights.length > 0 && (
                <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Solving Technique Analysis</h2>
                    <div className="space-y-3">
                        {techniqueInsights.slice(0, 6).map((insight, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border-l-4 ${insight.type === 'strength' ? 'bg-green-50 border-green-400' :
                                        insight.type === 'weakness' ? 'bg-red-50 border-red-400' :
                                            insight.type === 'improvement' ? 'bg-yellow-50 border-yellow-400' :
                                                'bg-blue-50 border-blue-400'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${insight.type === 'strength' ? 'bg-green-100 text-green-800' :
                                                    insight.type === 'weakness' ? 'bg-red-100 text-red-800' :
                                                        insight.type === 'improvement' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {insight.type === 'strength' ? '💪 Strength' :
                                                    insight.type === 'weakness' ? '📖 Needs Practice' :
                                                        insight.type === 'improvement' ? '⚡ Speed Up' :
                                                            '🎯 Next Level'}
                                            </span>
                                            {insight.level && (
                                                <span className="text-xs text-neutral-500 capitalize">
                                                    {insight.level}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-neutral-900 mb-1">
                                            {insight.message}
                                        </p>
                                        <p className="text-xs text-neutral-600">
                                            💡 {insight.actionable}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {techniqueInsights.length === 0 && (
                            <p className="text-sm text-neutral-600 text-center py-4">
                                Complete more games with hints to see your technique analysis!
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Games */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Games</h2>
                <div className="space-y-2 sm:space-y-3">
                    {recentGames.map((game) => (
                        <div
                            key={game.gameId}
                            className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm sm:text-base font-medium capitalize truncate">{game.difficulty}</div>
                                <div className="text-xs sm:text-sm text-neutral-600">
                                    {game.completed ? 'Completed' : 'Incomplete'} • {game.finalStats.totalMoves} moves
                                </div>
                            </div>
                            <div className="text-right ml-3">
                                <div className="text-sm sm:text-base font-medium">{game.accuracy.toFixed(1)}%</div>
                                <div className="text-xs sm:text-sm text-neutral-600">
                                    {game.duration ? Math.round(game.duration / 60000) + 'm' : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Data Management */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Data Management</h2>


                <p className="text-red-700 text-xs sm:text-sm mb-3 sm:mb-4">
                    These actions are permanent and cannot be undone.
                </p>
                <Button
                    onClick={() => {
                        if (confirm('Are you sure you want to delete all analytics data? This cannot be undone.')) {
                            clearAllData();
                        }
                    }}
                    variant="outline"
                    color="red"
                    className="text-xs sm:text-sm"
                >
                    <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Clear All Data
                </Button>
            </div>
        </div>
    );
};
