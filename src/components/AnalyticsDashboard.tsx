import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { AnalyticsEmptyState } from './analytics/AnalyticsEmptyState';
import { OverviewStats } from './analytics/OverviewStats';
import { InsightsSection } from './analytics/InsightsSection';
import { DifficultyProgress } from './analytics/DifficultyProgress';
import { RecentGames } from './analytics/RecentGames';
import { DataManagement } from './analytics/DataManagement';
import type { Difficulty } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const {
    userAnalytics,
    getUserInsights,
    getProgressData,
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
  const recentGames = userAnalytics.gamesPlayed.slice(-5);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
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

      {/* Recent Games */}
      <RecentGames games={recentGames} />

      {/* Data Management */}
      <DataManagement onClearAllData={clearAllData} />
    </div>
  );
};
