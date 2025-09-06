import React, { useState } from 'react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { AnalyticsEmptyState } from './analytics/AnalyticsEmptyState';
import { OverviewStats } from './analytics/OverviewStats';
import { InsightsSection } from './analytics/InsightsSection';
import { DifficultyProgress } from './analytics/DifficultyProgress';
import { TechniqueAnalysis } from './analytics/TechniqueAnalysis';
import { RecentGames } from './analytics/RecentGames';
import { DataManagement } from './analytics/DataManagement';
import type { Difficulty } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const {
    userAnalytics,
    getUserInsights,
    getProgressData,
    getTechniqueInsights,
    clearAllData,
  } = useAnalyticsStore();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');

  // Early returns for empty states
  if (!userAnalytics) {
    return <AnalyticsEmptyState hasGames={false} />;
  }

  if (userAnalytics.gamesPlayed.length === 0) {
    return <AnalyticsEmptyState hasGames={true} />;
  }

  // Get data for current state
  const progressData = getProgressData(selectedDifficulty);
  const userInsights = getUserInsights();
  const techniqueInsights = getTechniqueInsights();
  const recentGames = userAnalytics.gamesPlayed.slice(-5);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Your Sudoku Analytics
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          Track your progress and improve your solving skills
        </p>
      </div>

      {/* Overview Stats */}
      <OverviewStats userAnalytics={userAnalytics} />

      {/* Insights */}
      <InsightsSection insights={userInsights} />

      {/* Difficulty Progress */}
      <DifficultyProgress
        userAnalytics={userAnalytics}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        progressData={progressData}
      />

      {/* Technique Mastery */}
      <TechniqueAnalysis insights={techniqueInsights} />

      {/* Recent Games */}
      <RecentGames games={recentGames} />

      {/* Data Management */}
      <DataManagement onClearAllData={clearAllData} />
    </div>
  );
};
