import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { HamburgerMenuIcon, PlusIcon, BarChartIcon, VideoIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { GameControlButtons } from './GameControlButtons';
import { DifficultyConfigManager } from '../../config/difficulty';
import { useThemeStore } from '../../stores/themeStore';
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
            <DropdownMenu.Root>
                <DropdownMenu.Trigger disabled={isGeneratingPuzzle}>
                    <Button
                        size="2"
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        disabled={isGeneratingPuzzle}
                        aria-label="Menu"
                    >
                        {isGeneratingPuzzle ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        ) : (
                            <HamburgerMenuIcon />
                        )}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 p-1 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                >
                    {/* Navigation to Analytics */}
                    <DropdownMenu.Item
                        className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                        onClick={() => navigate({ to: '/analytics' })}
                    >
                        <div className="flex items-center gap-2">
                            <BarChartIcon className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                            <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">Analytics</span>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                        onClick={() => navigate({ to: '/videos' })}
                    >
                        <div className="flex items-center gap-2">
                            <VideoIcon className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                            <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">Video Tutorials</span>
                        </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="my-1 bg-neutral-200 dark:bg-gray-700" />

                    {/* New Game section */}
                    <DropdownMenu.Label className="px-3 py-1 text-xs font-semibold text-neutral-500 dark:text-gray-400 uppercase tracking-wide">
                        New Game
                    </DropdownMenu.Label>

                    {difficultyLevels.map((difficulty) => (
                        <DropdownMenu.Item
                            key={difficulty.level}
                            className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                            onClick={() => onNewGame(difficulty.level)}
                        >
                            <div className="flex items-center gap-2">
                                <PlusIcon className="w-3 h-3 text-neutral-500 dark:text-gray-400" />
                                <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">{difficulty.label}</span>
                            </div>
                        </DropdownMenu.Item>
                    ))}

                    {/* Current game actions */}
                    {(isPlaying || isPaused) && !isCompleted && (
                        <>
                            <DropdownMenu.Separator className="my-1 bg-neutral-200 dark:bg-gray-700" />
                            <DropdownMenu.Item
                                className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 outline-none border-0"
                                onClick={onRestart}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                    </svg>
                                    <span className="font-medium text-sm text-red-600 dark:text-red-400">Restart</span>
                                </div>
                            </DropdownMenu.Item>
                        </>
                    )}

                    {/* Language Selection */}
                    <DropdownMenu.Separator className="my-1 bg-neutral-200 dark:bg-gray-700" />
                    <DropdownMenu.Label className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('settings.language')}
                    </DropdownMenu.Label>
                    {languages.map((language) => (
                        <DropdownMenu.Item
                            key={language.code}
                            className={`px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0 ${i18n.language === language.code ? 'bg-blue-50 dark:bg-blue-950/30' : ''
                                }`}
                            onClick={() => i18n.changeLanguage(language.code)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{language.flag}</span>
                                <span className={`font-medium text-sm ${i18n.language === language.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {t(`languages.${language.code}`)}
                                </span>
                                {i18n.language === language.code && (
                                    <span className="ml-auto text-blue-600 dark:text-blue-400 text-sm">✓</span>
                                )}
                            </div>
                        </DropdownMenu.Item>
                    ))}

                    {/* Dark Mode Toggle */}
                    <DropdownMenu.Separator className="my-1 bg-neutral-200 dark:bg-gray-700" />
                    <DropdownMenu.Item
                        className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-gray-700 focus:bg-neutral-50 dark:focus:bg-gray-700 outline-none border-0"
                        onClick={toggleDarkMode}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                            <span className="font-medium text-sm text-neutral-900 dark:text-gray-100">
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </div>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
};
