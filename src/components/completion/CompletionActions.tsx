import React from 'react';
import { Button } from '@radix-ui/themes';
import { Cross2Icon, RocketIcon } from '@radix-ui/react-icons';
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
        <div className="flex gap-3">
            <Button
                onClick={onStartNewGame}
                size="3"
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-200 border-0"
            >
                <RocketIcon className="w-4 h-4" />
                {t('completion.newPuzzle')}
            </Button>

            <Button
                onClick={onClose}
                size="3"
                variant="soft"
                color="gray"
                className="flex-1 font-medium transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-gray-700 border-0"
            >
                <Cross2Icon className="w-4 h-4" />
            </Button>
        </div>
    );
};
