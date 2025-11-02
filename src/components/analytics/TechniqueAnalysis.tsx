import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TechniqueInsight } from '../../types/analytics';

interface TechniqueAnalysisProps {
    insights: TechniqueInsight[];
}

export const TechniqueAnalysis: React.FC<TechniqueAnalysisProps> = ({ insights }) => {
    const { t } = useTranslation();
    if (insights.length === 0) return null;

    const getInsightStyles = (type: TechniqueInsight['type']) => {
        switch (type) {
            case 'strength':
                return 'bg-green-50 border-green-400';
            case 'weakness':
                return 'bg-red-50 border-red-400';
            case 'improvement':
                return 'bg-yellow-50 border-yellow-400';
            default:
                return 'bg-blue-50 border-blue-400';
        }
    };

    const getInsightBadgeStyles = (type: TechniqueInsight['type']) => {
        switch (type) {
            case 'strength':
                return 'bg-green-100 text-green-800';
            case 'weakness':
                return 'bg-red-100 text-red-800';
            case 'improvement':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getInsightLabel = (type: TechniqueInsight['type']) => {
        switch (type) {
            case 'strength':
                return '💪 Strength';
            case 'weakness':
                return '📖 Needs Practice';
            case 'improvement':
                return '⚡ Speed Up';
            default:
                return '🎯 Next Level';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                {t('analytics.techniqueAnalysis')}
            </h2>

            <div className="space-y-3">
                {insights.slice(0, 6).map((insight, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${getInsightStyles(insight.type)} dark:bg-opacity-20`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getInsightBadgeStyles(insight.type)}`}>
                                        {getInsightLabel(insight.type)}
                                    </span>
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

                {insights.length === 0 && (
                    <p className="text-sm text-neutral-600 text-center py-4">
                        Complete more games with hints to see your technique analysis!
                    </p>
                )}
            </div>
        </div>
    );
};
