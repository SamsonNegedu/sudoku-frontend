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

    if (userAnalytics.gamesPlayed.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-neutral-600">No completed games yet. Finish a game to see your analytics!</p>
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
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Your Sudoku Analytics</h1>
                    <p className="text-neutral-600">Track your progress and improve your solving skills</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowExportModal(true)} variant="outline">
                        <DownloadIcon className="mr-2" />
                        Export Data
                    </Button>
                    <Button onClick={anonymizeData} variant="outline">
                        <EyeNoneIcon className="mr-2" />
                        Anonymize
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="text-2xl font-bold text-blue-600">{userAnalytics.overallStats.totalGames}</div>
                    <div className="text-sm text-neutral-600">Games Played</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="text-2xl font-bold text-green-600">{userAnalytics.overallStats.completedGames}</div>
                    <div className="text-sm text-neutral-600">Completed</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="text-2xl font-bold text-red-600">{userAnalytics.overallStats.totalGames - userAnalytics.overallStats.completedGames}</div>
                    <div className="text-sm text-neutral-600">Abandoned</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        {userAnalytics.overallStats.totalGames > 0 ? Math.round((userAnalytics.overallStats.completedGames / userAnalytics.overallStats.totalGames) * 100) : 0}%
                    </div>
                    <div className="text-sm text-neutral-600">Completion Rate</div>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="text-2xl font-bold text-orange-600">
                        {Math.round(userAnalytics.overallStats.averageTimePerGame / 60000)}m
                    </div>
                    <div className="text-sm text-neutral-600">Avg Time</div>
                </div>
            </div>

            {/* Insights */}
            {userInsights.length > 0 && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Insights & Recommendations</h2>
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
                                <div className="font-medium text-neutral-900">{insight.title}</div>
                                <div className="text-sm text-neutral-600">{insight.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Difficulty Progress */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Progress by Difficulty</h2>
                <div className="flex gap-2 mb-4">
                    {(Object.keys(userAnalytics.difficultyProgress) as Difficulty[]).map((difficulty) => (
                        <Button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            variant={selectedDifficulty === difficulty ? "solid" : "outline"}
                            size="1"
                            className={`capitalize ${selectedDifficulty === difficulty
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {difficulty}
                        </Button>
                    ))}
                </div>

                {progressData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-lg font-semibold">{progressData.gamesPlayed}</div>
                            <div className="text-sm text-neutral-600">Games Played</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{progressData.gamesCompleted}</div>
                            <div className="text-sm text-neutral-600">Completed</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{progressData.accuracy.toFixed(1)}%</div>
                            <div className="text-sm text-neutral-600">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">
                                {progressData.bestTime === Infinity ? 'N/A' : Math.round(progressData.bestTime / 60000) + 'm'}
                            </div>
                            <div className="text-sm text-neutral-600">Best Time</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Games</h2>
                <div className="space-y-3">
                    {recentGames.map((game) => (
                        <div
                            key={game.gameId}
                            className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
                        >
                            <div>
                                <div className="font-medium capitalize">{game.difficulty}</div>
                                <div className="text-sm text-neutral-600">
                                    {game.completed ? 'Completed' : 'Incomplete'} • {game.finalStats.totalMoves} moves
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{game.accuracy.toFixed(1)}%</div>
                                <div className="text-sm text-neutral-600">
                                    {game.duration ? Math.round(game.duration / 60000) + 'm' : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Export Analytics Data</h3>
                        <p className="text-neutral-600 mb-6">
                            This will download a JSON file containing all your game analytics and progress data.
                            You can use this to backup your data or import it on another device.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button onClick={() => setShowExportModal(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleExport}>
                                <DownloadIcon className="mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Management */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Data Management</h2>
                <p className="text-red-700 text-sm mb-4">
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
                >
                    <TrashIcon className="mr-2" />
                    Clear All Data
                </Button>
            </div>
        </div>
    );
};
