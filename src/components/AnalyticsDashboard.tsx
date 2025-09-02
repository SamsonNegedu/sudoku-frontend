import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { useAnalyticsStore } from '../stores/analyticsStore';
import type { Difficulty } from '../types';
import {
    DownloadIcon,
    TrashIcon,
    EyeNoneIcon,
} from '@radix-ui/react-icons';

export const AnalyticsDashboard: React.FC = () => {
    const {
        userAnalytics,
        getUserInsights,
        getProgressData,
        exportUserData,
        clearAllData,
        anonymizeData,
    } = useAnalyticsStore();

    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');
    const [showExportModal, setShowExportModal] = useState(false);

    if (!userAnalytics) {
        return (
            <div className="p-6 text-center">
                <p className="text-neutral-600">No analytics data available yet. Play some games to see your progress!</p>
            </div>
        );
    }

    const progressData = getProgressData(selectedDifficulty);
    const userInsights = getUserInsights();
    const recentGames = userAnalytics.gamesPlayed.slice(-5);

    const handleExport = () => {
        const data = exportUserData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sudoku-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowExportModal(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Your Sudoku Analytics</h1>
                    <p className="text-sm sm:text-base text-neutral-600">Track your progress and improve your solving skills</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={() => setShowExportModal(true)} variant="outline" size="2">
                        <DownloadIcon className="mr-2" />
                        <span className="hidden sm:inline">Export Data</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                    <Button onClick={anonymizeData} variant="outline" size="2">
                        <EyeNoneIcon className="mr-2" />
                        <span className="hidden sm:inline">Anonymize</span>
                        <span className="sm:hidden">Anon</span>
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{userAnalytics.overallStats.totalGames}</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Total Games</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">{userAnalytics.overallStats.completedGames}</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Completed</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">{userAnalytics.overallStats.averageAccuracy.toFixed(1)}%</div>
                    <div className="text-xs sm:text-sm text-neutral-600">Avg Accuracy</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4">
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
                                        insight.type === 'suggestion' ? 'border-blue-500 bg-blue-50' :
                                            'border-purple-500 bg-purple-50'
                                    }`}
                            >
                                <div className="font-medium text-neutral-900">{insight.title}</div>
                                <div className="text-sm text-neutral-600">{insight.description}</div>
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
                            className="capitalize text-xs sm:text-sm"
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
                                {progressData.bestTime === Infinity ? 'N/A' : Math.round(progressData.bestTime / 60000) + 'm'}
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600">Best Time</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Games</h2>
                <div className="space-y-2 sm:space-y-3">
                    {recentGames.map((game) => (
                        <div
                            key={game.gameId}
                            className="flex justify-between items-center p-2 sm:p-3 bg-neutral-50 rounded-lg"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm sm:text-base font-medium capitalize truncate">{game.difficulty}</div>
                                <div className="text-xs sm:text-sm text-neutral-600">
                                    {game.completed ? 'Completed' : 'Incomplete'} • {game.finalStats.totalMoves} moves
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-sm sm:text-base font-medium">{game.accuracy.toFixed(1)}%</div>
                                <div className="text-xs sm:text-sm text-neutral-600">
                                    {game.duration ? Math.round(game.duration / 60000) + 'm' : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Export Analytics Data</h3>
                        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
                            This will download a JSON file containing all your game analytics and progress data.
                            You can use this to backup your data or import it on another device.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                            <Button onClick={() => setShowExportModal(false)} variant="outline" className="w-full sm:w-auto">
                                Cancel
                            </Button>
                            <Button onClick={handleExport} className="w-full sm:w-auto">
                                <DownloadIcon className="mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                    size="2"
                    className="w-full sm:w-auto"
                >
                    <TrashIcon className="mr-2" />
                    Clear All Data
                </Button>
            </div>
        </div>
    );
};
