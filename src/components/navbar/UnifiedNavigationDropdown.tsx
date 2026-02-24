import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DropdownMenu, Button } from '@radix-ui/themes';
import { HamburgerMenuIcon, BarChartIcon, VideoIcon, BookmarkIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const UnifiedNavigationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button
                    variant="ghost"
                    size="2"
                    className="text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    aria-label={t('navigation.menu')}
                >
                    <HamburgerMenuIcon className="w-5 h-5" />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="min-w-[180px]">
                <DropdownMenu.Item onClick={() => navigate({ to: '/game' })}>
                    <div className="flex items-center gap-2">
                        <BookmarkIcon className="w-4 h-4" />
                        {t('navigation.game')}
                    </div>
                </DropdownMenu.Item>

                <DropdownMenu.Item onClick={() => navigate({ to: '/analytics' })}>
                    <div className="flex items-center gap-2">
                        <BarChartIcon className="w-4 h-4" />
                        {t('navigation.analytics')}
                    </div>
                </DropdownMenu.Item>

                <DropdownMenu.Item onClick={() => navigate({ to: '/videos' })}>
                    <div className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4" />
                        {t('navigation.videos')}
                    </div>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
