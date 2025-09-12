import React from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { HamburgerMenuIcon, PlusIcon, PlayIcon, BarChartIcon, ReaderIcon, GlobeIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { GameControlButtons } from './GameControlButtons';
import { DifficultyConfigManager } from '../../config/difficulty';
import type { Difficulty } from '../../types';

interface MobileNavigationProps {
    onNewGame: (difficulty: Difficulty) => void;
    onRestart: () => void;
    onShowAnalytics: () => void;
    onShowLearning: () => void;
    onShowGame?: () => void;
    onPause: () => void;
    onResume: () => void;
    currentPage?: 'game' | 'analytics' | 'learning';
    isPlaying: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    isGeneratingPuzzle: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    onNewGame,
    onRestart,
    onShowAnalytics,
    onShowLearning,
    onShowGame,
    onPause,
    onResume,
    currentPage = 'game',
    isPlaying,
    isPaused,
    isCompleted,
    isGeneratingPuzzle,
}) => {
    const { i18n, t } = useTranslation();

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
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={isGeneratingPuzzle}
                        aria-label="Menu"
                    >
                        {isGeneratingPuzzle ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                            <HamburgerMenuIcon />
                        )}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 p-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50"
                >
                    {/* Back to Game - only when not on game page and has active game */}
                    {currentPage !== 'game' && (isPlaying || isPaused) && onShowGame && (
                        <>
                            <DropdownMenu.Item
                                className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-blue-50 focus:bg-blue-50 outline-none border-0"
                                onClick={onShowGame}
                            >
                                <div className="flex items-center gap-2">
                                    <PlayIcon className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-sm text-blue-600">Back to Game</span>
                                </div>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1" />
                        </>
                    )}

                    {/* Navigation */}
                    {currentPage !== 'analytics' && (
                        <DropdownMenu.Item
                            className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                            onClick={onShowAnalytics}
                        >
                            <div className="flex items-center gap-2">
                                <BarChartIcon className="w-4 h-4 text-neutral-600" />
                                <span className="font-medium text-sm">Analytics</span>
                            </div>
                        </DropdownMenu.Item>
                    )}

                    {currentPage !== 'learning' && (
                        <DropdownMenu.Item
                            className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                            onClick={onShowLearning}
                        >
                            <div className="flex items-center gap-2">
                                <ReaderIcon className="w-4 h-4 text-neutral-600" />
                                <span className="font-medium text-sm">Learning Center</span>
                            </div>
                        </DropdownMenu.Item>
                    )}

                    <DropdownMenu.Separator className="my-1" />

                    {/* New Game section */}
                    <DropdownMenu.Label className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                        New Game
                    </DropdownMenu.Label>

                    {difficultyLevels.map((difficulty) => (
                        <DropdownMenu.Item
                            key={difficulty.level}
                            className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0"
                            onClick={() => onNewGame(difficulty.level)}
                        >
                            <div className="flex items-center gap-2">
                                <PlusIcon className="w-3 h-3 text-neutral-500" />
                                <span className="font-medium text-sm">{difficulty.label}</span>
                            </div>
                        </DropdownMenu.Item>
                    ))}

                    {/* Current game actions */}
                    {(isPlaying || isPaused) && !isCompleted && (
                        <>
                            <DropdownMenu.Separator className="my-1" />
                            <DropdownMenu.Item
                                className="px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-red-50 focus:bg-red-50 outline-none border-0"
                                onClick={onRestart}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                    </svg>
                                    <span className="font-medium text-sm text-red-600">Restart</span>
                                </div>
                            </DropdownMenu.Item>
                        </>
                    )}

                    {/* Language Selection */}
                    <DropdownMenu.Separator className="my-1" />
                    <DropdownMenu.Label className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('settings.language')}
                    </DropdownMenu.Label>
                    {languages.map((language) => (
                        <DropdownMenu.Item
                            key={language.code}
                            className={`px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-50 focus:bg-neutral-50 outline-none border-0 ${i18n.language === language.code ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => i18n.changeLanguage(language.code)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{language.flag}</span>
                                <span className={`font-medium text-sm ${i18n.language === language.code ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                    {t(`languages.${language.code}`)}
                                </span>
                                {i18n.language === language.code && (
                                    <span className="ml-auto text-blue-600 text-sm">✓</span>
                                )}
                            </div>
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
};
