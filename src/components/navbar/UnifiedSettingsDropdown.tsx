import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GearIcon, QuestionMarkCircledIcon, GlobeIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '@/utils/index';

interface UnifiedSettingsDropdownProps {
    onShowHelp?: () => void;
}

export const UnifiedSettingsDropdown: React.FC<UnifiedSettingsDropdownProps> = ({ onShowHelp }) => {
    const { t, i18n } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    aria-label={t('navigation.settings')}
                >
                    <GearIcon className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[200px]" align="end">
                {/* Language Section */}
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <GlobeIcon className="w-3.5 h-3.5" />
                        {t('settings.language')}
                    </div>
                </DropdownMenuLabel>

                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={cn(
                            i18n.language === language.code && 'bg-primary-50 dark:bg-primary-950/30'
                        )}
                    >
                        <span className="flex items-center justify-between w-full gap-2">
                            <span className="flex items-center gap-2">
                                <span>{language.flag}</span>
                                <span>{t(`languages.${language.code}`)}</span>
                            </span>
                            {i18n.language === language.code && <span className="text-primary-600 dark:text-primary-500">✓</span>}
                        </span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {/* Theme Section */}
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {t('settings.theme')}
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={toggleDarkMode}>
                    <div className="flex items-center gap-2">
                        {isDarkMode ? (
                            <>
                                <SunIcon className="w-4 h-4" />
                                {t('settings.lightMode')}
                            </>
                        ) : (
                            <>
                                <MoonIcon className="w-4 h-4" />
                                {t('settings.darkMode')}
                            </>
                        )}
                    </div>
                </DropdownMenuItem>

                {onShowHelp && (
                    <>
                        <DropdownMenuSeparator />

                        {/* Help Section */}
                        <DropdownMenuItem onClick={onShowHelp}>
                            <div className="flex items-center gap-2">
                                <QuestionMarkCircledIcon className="w-4 h-4" />
                                {t('navigation.help')}
                            </div>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
