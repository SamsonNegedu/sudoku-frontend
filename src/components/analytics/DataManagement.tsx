import React from 'react';
import { Button } from '@radix-ui/themes';
import { TrashIcon } from '@radix-ui/react-icons';

interface DataManagementProps {
    onClearAllData: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ onClearAllData }) => {
    const handleClearData = () => {
        if (confirm('Are you sure you want to delete all analytics data? This cannot be undone.')) {
            onClearAllData();
        }
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-red-800 mb-2">
                Data Management
            </h2>

            <p className="text-red-700 text-xs sm:text-sm mb-3 sm:mb-4">
                These actions are permanent and cannot be undone.
            </p>

            <Button
                onClick={handleClearData}
                variant="outline"
                color="red"
                className="text-xs sm:text-sm"
            >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Clear All Data
            </Button>
        </div>
    );
};
