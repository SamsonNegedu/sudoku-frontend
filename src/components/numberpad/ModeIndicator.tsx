import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModeIndicatorProps {
    inputMode: 'pen' | 'pencil';
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({ inputMode }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center mb-3 space-y-1">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${inputMode === 'pen'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                }`}>
                {inputMode === 'pen' ? `🖊️ ${t('controls.penMode')}` : `✏️ ${t('controls.pencilMode')}`}
            </div>
        </div>
    );
};
