import React from 'react';
import { Button } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

interface CompletionActionsProps {
    onStartNewGame: () => void;
    onClose: () => void;
}

export const CompletionActions: React.FC<CompletionActionsProps> = ({
    onStartNewGame,
    onClose,
}) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-3">
            <Button
                onClick={onStartNewGame}
                size="3"
                variant="solid"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium"
            >
                🎯 {t('completion.newPuzzle')}
            </Button>

            <Button
                onClick={onClose}
                size="3"
                variant="soft"
                color="gray"
                className="w-full font-medium dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
                ✨ Admire My Solution
            </Button>
        </div>
    );
};
