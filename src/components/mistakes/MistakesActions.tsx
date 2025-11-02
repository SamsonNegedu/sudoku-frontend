import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../shared/index';

interface MistakesActionsProps {
    onRestart: () => void;
    onContinue: () => void;
}

export const MistakesActions: React.FC<MistakesActionsProps> = ({
    onRestart,
    onContinue,
}) => {
    const { t } = useTranslation();
    return (
        <div className="px-6 pb-6 space-y-3">
            <ActionButton
                onClick={onRestart}
                size="3"
                color="red"
                fullWidth
                aria-label={t('mistakes.startOver')}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                {t('mistakes.startOver')}
            </ActionButton>

            <ActionButton
                onClick={onContinue}
                size="3"
                variant="soft"
                color="gray"
                fullWidth
                aria-label={t('mistakes.continueUnlimited')}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
                {t('mistakes.continueUnlimited')}
            </ActionButton>

            {/* Note */}
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-gray-600">
                <p className="text-neutral-500 dark:text-gray-400 text-xs">
                    {t('mistakes.disableNote')}
                </p>
            </div>
        </div>
    );
};
