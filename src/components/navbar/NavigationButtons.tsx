import React from 'react';
import { Button } from '@radix-ui/themes';
import { BarChartIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

interface NavigationButtonsProps {
    onShowAnalytics: () => void;
    onShowLearning: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onShowAnalytics,
    onShowLearning,
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Button
                onClick={onShowAnalytics}
                size="2"
                variant="ghost"
                aria-label={t('navigation.analytics')}
                className="text-blue-600 hover:bg-blue-50"
            >
                <BarChartIcon />
            </Button>

            <Button
                onClick={onShowLearning}
                size="2"
                variant="ghost"
                aria-label={t('navigation.learning')}
                className="text-blue-600 hover:bg-blue-50"
            >
                <ReaderIcon />
            </Button>
        </>
    );
};
