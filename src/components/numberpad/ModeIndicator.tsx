import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil1Icon, Pencil2Icon } from '@radix-ui/react-icons';

interface ModeIndicatorProps {
    inputMode: 'pen' | 'pencil';
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({ inputMode }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center mb-3 space-y-1">
            <div className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${inputMode === 'pen'
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'
                : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                }`}>
                {inputMode === 'pen' ? (
                    <>
                        <Pencil1Icon className="w-4 h-4" />
                        <span>{t('controls.penMode')}</span>
                    </>
                ) : (
                    <>
                        <Pencil2Icon className="w-4 h-4" />
                        <span>{t('controls.pencilMode')}</span>
                    </>
                )}
            </div>
        </div>
    );
};
