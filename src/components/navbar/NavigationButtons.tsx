import React from 'react';
import { Button } from '@radix-ui/themes';
import { BarChartIcon, ReaderIcon } from '@radix-ui/react-icons';

interface NavigationButtonsProps {
    onShowAnalytics: () => void;
    onShowLearning: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onShowAnalytics,
    onShowLearning,
}) => {
    return (
        <>
            <Button
                onClick={onShowAnalytics}
                size="2"
                variant="ghost"
                aria-label="Analytics Dashboard"
                className="text-blue-600 hover:bg-blue-50"
            >
                <BarChartIcon />
            </Button>

            <Button
                onClick={onShowLearning}
                size="2"
                variant="ghost"
                aria-label="Learning Center"
                className="text-blue-600 hover:bg-blue-50"
            >
                <ReaderIcon />
            </Button>
        </>
    );
};
