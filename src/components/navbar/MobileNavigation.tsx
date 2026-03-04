import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HamburgerMenuIcon, PlusIcon, BarChartIcon, VideoIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { GameControlButtons } from './GameControlButtons';
import { DifficultyConfigManager } from '../../config/difficulty';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '@/utils/index';
import type { Difficulty } from '../../types';

interface MobileNavigationProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onPause: () => void;
    onResume: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGeneratingPuzzle: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    onNewGame,
    onRestart,
    onPause,
    onResume,
    isPlaying,
    isPaused,
    isCompleted,
    isGeneratingPuzzle,
}) => {
    const { i18n, t } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const navigate = useNavigate();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ];
    const difficultyLevels = DifficultyConfigManager.getDifficultyOptions().map(option => ({
        level: option.value,
        label: option.label,
        description: option.description,
    }));

    return (
        <div className="flex items-center space-x-2 sm:hidden">
            {/* Mobile Pause/Resume Button */}
            <GameControlButtons
                isPlaying={isPlaying}
                isPaused={isPaused}
                isCompleted={isCompleted}
                onPause={onPause}
                onResume={onResume}
                isMobile={true}
            />

            {/* Mobile Hamburger Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isGeneratingPuzzle}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary-600 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                        disabled={isGeneratingPuzzle}
                        aria-label="Menu"
                    >
                        {isGeneratingPuzzle ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 dark:border-primary-400"></div>
                        ) : (
                            <HamburgerMenuIcon />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 p-1 z-50"
                >
                    {/* Navigation to Analytics */}
                    <DropdownMenuItem
                        className="px-3 py-2 rounded-md cursor-pointer"
                        onClick={() => navigate({ to: '/analytics' })}
                    >
                        <BarChartIcon className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                        <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">Analytics</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="px-3 py-2 rounded-md cursor-pointer"
                        onClick={() => navigate({ to: '/videos' })}
                    >
                        <VideoIcon className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                        <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">Video Tutorials</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    {/* New Game section */}
                    <DropdownMenuLabel className="px-3 py-1 text-xs font-semibold text-neutral-500 dark:text-gray-400 uppercase tracking-wide">
                        New Game
                    </DropdownMenuLabel>

                    {difficultyLevels.map((difficulty) => (
                        <DropdownMenuItem
                            key={difficulty.level}
                            className="px-3 py-2 rounded-md cursor-pointer"
                            onClick={() => onNewGame(difficulty.level)}
                        >
                            <PlusIcon className="w-3 h-3 text-neutral-500 dark:text-gray-400" />
                            <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">{difficulty.label}</span>
                        </DropdownMenuItem>
                    ))}

                    {/* Current game actions */}
                    {(isPlaying || isPaused) && !isCompleted && (
                        <>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                                className="px-3 py-2 rounded-md cursor-pointer hover:bg-error-50 dark:hover:bg-error-950/30"
                                onClick={onRestart}
                            >
                                <svg className="w-4 h-4 text-error-600 dark:text-error-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                </svg>
                                <span className="font-medium text-sm text-error-600 dark:text-error-400">Restart</span>
                            </DropdownMenuItem>
                        </>
                    )}

                    {/* Language Selection */}
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuLabel className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('settings.language')}
                    </DropdownMenuLabel>
                    {languages.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            className={cn(
                                "px-3 py-2 rounded-md cursor-pointer",
                                i18n.language === language.code && 'bg-primary-50 dark:bg-primary-950/30'
                            )}
                            onClick={() => i18n.changeLanguage(language.code)}
                        >
                            <span className="text-lg">{language.flag}</span>
                            <span className={cn(
                                "font-medium text-sm",
                                i18n.language === language.code
                                    ? 'text-primary-600 dark:text-primary-500'
                                    : 'text-gray-700 dark:text-gray-300'
                            )}>
                                {t(`languages.${language.code}`)}
                            </span>
                            {i18n.language === language.code && (
                                <span className="ml-auto text-primary-600 dark:text-primary-500 text-sm">✓</span>
                            )}
                        </DropdownMenuItem>
                    ))}

                    {/* Dark Mode Toggle */}
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                        className="px-3 py-2 rounded-md cursor-pointer"
                        onClick={toggleDarkMode}
                    >
                        <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                        <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
