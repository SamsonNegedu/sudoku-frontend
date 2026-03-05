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
            <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${inputMode === 'pen'
                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                : 'bg-primary-500 dark:bg-primary-600 text-white border border-primary-600 dark:border-primary-700'
                }`}>
                {inputMode === 'pen' ? (
                    <>
                        <Pencil1Icon className="w-3.5 h-3.5" />
                        <span>{t('controls.penMode')}</span>
                    </>
                ) : (
                    <>
                        <Pencil2Icon className="w-3.5 h-3.5" />
                        <span>{t('controls.pencilMode')}</span>
                    </>
                )}
            </div>
        </div>
    );
};
