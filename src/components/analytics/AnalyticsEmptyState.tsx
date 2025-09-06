import React from 'react';

interface AnalyticsEmptyStateProps {
    hasGames: boolean;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({ hasGames }) => {
    return (
        <div className="p-6 text-center">
            <p className="text-neutral-600">
                {hasGames
                    ? "No completed games yet. Finish a game to see your analytics!"
                    : "No analytics data available yet. Play some games to see your progress!"
                }
            </p>
        </div>
    );
};
