import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimerIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface CompletionStatsProps {
    completionTime: string;
    mistakes: number;
}

export const CompletionStats: React.FC<CompletionStatsProps> = ({
    completionTime,
    mistakes,
}) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Time Stat */}
            <div className="group p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 rounded-xl border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('completion.time')}
                    </span>
                    <TimerIcon className="w-4 h-4 text-blue-500 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {completionTime}
                </p>
            </div>

            {/* Mistakes Stat */}
            <div className="group p-4 bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10 rounded-xl border border-amber-100 dark:border-amber-900/30 hover:border-amber-200 dark:hover:border-amber-800 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('completion.mistakes')}
                    </span>
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 dark:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {mistakes}
                </p>
            </div>
        </div>
    );
};
