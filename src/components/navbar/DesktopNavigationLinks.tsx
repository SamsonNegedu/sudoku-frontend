import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@radix-ui/themes';
import { BarChartIcon, VideoIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const DesktopNavigationLinks: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const router = useRouterState();
    const currentPath = router.location.pathname;

    return (
        <div className="flex items-center gap-8">
            <Button
                onClick={() => navigate({ to: '/analytics' })}
                size="2"
                variant="ghost"
                className={`text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors ${currentPath === '/analytics' ? 'bg-neutral-100 dark:bg-gray-700' : ''
                    }`}
                aria-label={t('navigation.analytics')}
            >
                <BarChartIcon className="w-4 h-4" />
                <span className="hidden lg:inline ml-2">{t('navigation.analytics')}</span>
            </Button>

            <Button
                onClick={() => navigate({ to: '/videos' })}
                size="2"
                variant="ghost"
                className={`text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors ${currentPath === '/videos' ? 'bg-neutral-100 dark:bg-gray-700' : ''
                    }`}
                aria-label={t('navigation.videos')}
            >
                <VideoIcon className="w-4 h-4" />
                <span className="hidden lg:inline ml-2">{t('navigation.videos')}</span>
            </Button>
        </div>
    );
};
