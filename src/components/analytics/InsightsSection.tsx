import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsInsight } from '../../types/analytics';

interface InsightsSectionProps {
    insights: AnalyticsInsight[];
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
    const { t } = useTranslation();
    if (insights.length === 0) return null;

    const getInsightStyles = (type: AnalyticsInsight['type']) => {
        switch (type) {
            case 'strength':
                return 'border-green-500 bg-green-50';
            case 'weakness':
                return 'border-red-500 bg-red-50';
            case 'suggestion':
                return 'border-blue-600 bg-blue-50';
            case 'achievement':
                return 'border-purple-500 bg-purple-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {t('analytics.insightsRecommendations')}
            </h2>
            <div className="space-y-3">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${getInsightStyles(insight.type)}`}
                    >
                        <div className="text-sm sm:text-base font-medium text-neutral-900">
                            {insight.title}
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-600">
                            {insight.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
