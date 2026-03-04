import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

interface HelpButtonProps {
    onHelpClick: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onHelpClick }) => {
    return (
        <Button
            onClick={onHelpClick}
            variant="ghost"
            size="icon"
            className="text-neutral-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700"
            aria-label="Keyboard shortcuts help (Press ?)"
            title="Keyboard shortcuts (Press ?)"
        >
            <QuestionMarkCircledIcon className="w-5 h-5" />
        </Button>
    );
};

