import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@radix-ui/themes';
import { TrashIcon } from '@radix-ui/react-icons';

interface DataManagementProps {
    onClearAllData: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ onClearAllData }) => {
    const { t } = useTranslation();

    const handleClearData = () => {
        if (confirm(t('analytics.confirmDelete'))) {
            onClearAllData();
        }
    };

    return (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                {t('analytics.dataManagement')}
            </h2>

            <p className="text-red-700 dark:text-red-200 text-xs sm:text-sm mb-3 sm:mb-4">
                {t('analytics.permanentWarning')}
            </p>

            <Button
                onClick={handleClearData}
                variant="outline"
                color="red"
                className="text-xs sm:text-sm"
            >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {t('analytics.clearAllData')}
            </Button>
        </div>
    );
};
