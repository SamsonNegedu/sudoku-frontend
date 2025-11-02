import React from 'react';
import { useTranslation } from 'react-i18next';

export const MistakesContent: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="text-xs text-neutral-600 dark:text-gray-400 bg-neutral-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <strong>{t('mistakes.restartLabel')}:</strong> {t('mistakes.restartDescription')}<br />
                    <strong>{t('mistakes.continueLabel')}:</strong> {t('mistakes.continueDescription')}
                </div>
            </div>
        </div>
    );
};
