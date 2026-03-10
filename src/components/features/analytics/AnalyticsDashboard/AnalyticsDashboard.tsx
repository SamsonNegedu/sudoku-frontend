import React from 'react';
import { useAnalyticsStore } from '../../../../stores/analyticsStore';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';
import { OverviewStats } from './OverviewStats';
import { RecentGames } from './RecentGames';
import { DataManagement } from './DataManagement';

export const AnalyticsDashboard: React.FC = () => {
  const {
    userAnalytics,
    clearAllData,
  } = useAnalyticsStore();

  // Early returns for empty states
  if (!userAnalytics) {
    return <AnalyticsEmptyState hasGames={false} />;
  }

  if (userAnalytics.gamesPlayed.length === 0) {
    return <AnalyticsEmptyState hasGames={true} />;
  }

  // Get data for current state
  const recentGames = userAnalytics.gamesPlayed.slice(-10);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Overview Stats */}
      <OverviewStats userAnalytics={userAnalytics} />

      {/* Recent Games */}
      <RecentGames games={recentGames} allGames={userAnalytics.gamesPlayed} />

      {/* Data Management */}
      <DataManagement onClearAllData={clearAllData} />
    </div>
  );
};
