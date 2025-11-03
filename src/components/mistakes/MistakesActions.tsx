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
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-semibold shadow-lg shadow-red-600/30 dark:shadow-red-900/30 transition-all duration-200 border-0"
                >
                    <ResetIcon className="w-4 h-4" />
                    {t('mistakes.startOver')}
                </Button>

                <Button
                    onClick={onContinue}
                    size="3"
                    variant="soft"
                    color="gray"
                    className="w-full font-semibold transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-0"
                >
                    <PlayIcon className="w-4 h-4" />
                    {t('mistakes.continueUnlimited')}
                </Button>
            </div>

            {/* Info box about continue unlimited */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    ℹ️ {t('mistakes.disableNote')}
                </p>
            </div>
        </div>
    );
};
