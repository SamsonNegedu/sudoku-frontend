import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { BarChartIcon, VideoIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const NavigationButtons: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Button
                onClick={() => navigate({ to: '/analytics' })}
                variant="ghost"
                size="icon"
                aria-label={t('navigation.analytics')}
                className="text-primary-600 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30"
            >
                <BarChartIcon />
            </Button>

            <Button
                onClick={() => navigate({ to: '/videos' })}
                variant="ghost"
                size="icon"
                aria-label="Video Tutorials"
                className="text-primary-600 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30"
            >
                <VideoIcon />
            </Button>
        </>
    );
};
