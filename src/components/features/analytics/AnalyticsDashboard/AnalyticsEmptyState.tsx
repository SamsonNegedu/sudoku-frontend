import React from 'react';
import { useTranslation } from 'react-i18next';

interface AnalyticsEmptyStateProps {
    hasGames: boolean;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({ hasGames }) => {
    const { t } = useTranslation();
    return (
        <div className="p-6 text-center">
            <p className="text-neutral-600 dark:text-gray-400">
                {hasGames
                    ? t('analytics.noCompletedGames')
                    : t('analytics.noDataAvailable')
                }
            </p>
        </div>
    );
};
