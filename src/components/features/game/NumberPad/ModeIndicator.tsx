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
            <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${inputMode === 'pen'
                ? 'bg-primary-100/60 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'bg-success-100/60 dark:bg-success-900/40 text-success-700 dark:text-success-300'
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
