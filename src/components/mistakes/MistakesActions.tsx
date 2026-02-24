import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@radix-ui/themes';
import { ResetIcon, PlayIcon } from '@radix-ui/react-icons';

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
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <Button
                    onClick={onRestart}
                    size="3"
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold shadow-md transition-all duration-200 border-0"
                >
                    <ResetIcon className="w-4 h-4" />
                    {t('mistakes.startOver')}
                </Button>

                <Button
                    onClick={onContinue}
                    size="3"
                    variant="soft"
                    color="gray"
                    className="w-full font-semibold transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-gray-700 border-0"
                >
                    <PlayIcon className="w-4 h-4" />
                    {t('mistakes.continueUnlimited')}
                </Button>
            </div>

            {/* Info box about continue unlimited */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    ℹ️ {t('mistakes.disableNote')}
                </p>
            </div>
        </div>
    );
};
