import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon, ResetIcon, PlayIcon } from '@radix-ui/react-icons';

interface MistakesModalProps {
    isVisible: boolean;
    mistakes: number;
    maxMistakes: number;
    onRestart: () => void;
    onContinue: () => void;
}

export const MistakesModal: React.FC<MistakesModalProps> = ({
    isVisible,
    mistakes,
    maxMistakes,
    onRestart,
    onContinue,
}) => {
    const { t } = useTranslation();

    return (
        <AlertDialog open={isVisible}>
            <AlertDialogContent className="max-w-sm">
                {/* Compact Header */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <ExclamationTriangleIcon className="w-8 h-8 text-error-600 dark:text-error-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">
                            {t('mistakes.maximumReached')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {mistakes}/{maxMistakes} {t('game.mistakes').toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Button
                        onClick={onRestart}
                        variant="destructive"
                        className="flex-1"
                    >
                        <ResetIcon className="w-4 h-4" />
                        {t('mistakes.startOver')}
                    </Button>

                    <Button
                        onClick={onContinue}
                        variant="secondary"
                        className="flex-1"
                    >
                        <PlayIcon className="w-4 h-4" />
                        {t('mistakes.continueUnlimited')}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};
