import React from 'react';
import { Button } from '@radix-ui/themes';

interface CompletionActionsProps {
    onStartNewGame: () => void;
    onClose: () => void;
}

export const CompletionActions: React.FC<CompletionActionsProps> = ({
    onStartNewGame,
    onClose,
}) => {
    return (
        <div className="space-y-3">
            <Button
                onClick={onStartNewGame}
                size="3"
                variant="solid"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
                🎯 Start New Game
            </Button>

            <Button
                onClick={onClose}
                size="3"
                variant="soft"
                color="gray"
                className="w-full"
            >
                ✨ Admire My Solution
            </Button>
        </div>
    );
};
