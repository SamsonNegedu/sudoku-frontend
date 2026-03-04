import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HamburgerMenuIcon, BarChartIcon, VideoIcon, BookmarkIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

export const UnifiedNavigationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    aria-label={t('navigation.menu')}
                >
                    <HamburgerMenuIcon className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[180px]" align="end">
                <DropdownMenuItem onClick={() => navigate({ to: '/game' })}>
                    <BookmarkIcon className="w-4 h-4" />
                    {t('navigation.game')}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate({ to: '/analytics' })}>
                    <BarChartIcon className="w-4 h-4" />
                    {t('navigation.analytics')}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate({ to: '/videos' })}>
                    <VideoIcon className="w-4 h-4" />
                    {t('navigation.videos')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
