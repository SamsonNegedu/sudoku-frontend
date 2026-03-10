import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsInsight } from '../../../../types/analytics';

interface InsightsSectionProps {
    insights: AnalyticsInsight[];
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
    const { t } = useTranslation();
    if (insights.length === 0) return null;

    const getInsightStyles = (type: AnalyticsInsight['type']) => {
        switch (type) {
            case 'strength':
                return 'border-success-500 dark:border-success-600 bg-success-50 dark:bg-success-950/30';
            case 'weakness':
                return 'border-error-500 dark:border-error-600 bg-error-50 dark:bg-error-950/30';
            case 'suggestion':
                return 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-950/30';
            case 'achievement':
                return 'border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30';
            default:
                return 'border-gray-500 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-600 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                {t('analytics.insightsRecommendations')}
            </h2>
            <div className="space-y-3">
                {insights.map((insight, index) => {
                    const title = insight.titleKey ? t(insight.titleKey) : insight.title;
                    const description = insight.descriptionKey
                        ? t(insight.descriptionKey, insight.descriptionParams || {})
                        : insight.description;

                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${getInsightStyles(insight.type)}`}
                        >
                            <div className="text-sm sm:text-base font-medium text-neutral-900 dark:text-gray-100">
                                {title}
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600 dark:text-gray-300">
                                {description}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
