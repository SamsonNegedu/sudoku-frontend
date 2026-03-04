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
                ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-700'
                : 'bg-gradient-to-r from-success-50 to-success-100 dark:from-success-950 dark:to-success-900 text-success-700 dark:text-success-300 border-2 border-success-300 dark:border-success-700'
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
