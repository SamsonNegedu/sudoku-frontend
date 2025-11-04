import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@radix-ui/themes';
import { BarChartIcon, VideoIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const NavigationButtons: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Button
                onClick={() => navigate({ to: '/analytics' })}
                size="2"
                variant="ghost"
                aria-label={t('navigation.analytics')}
                className="text-blue-600 hover:bg-blue-50"
            >
                <BarChartIcon />
            </Button>

            <Button
                onClick={() => navigate({ to: '/videos' })}
                size="2"
                variant="ghost"
                aria-label="Video Tutorials"
                className="text-blue-600 hover:bg-blue-50"
            >
                <VideoIcon />
            </Button>
        </>
    );
};
