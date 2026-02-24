import React from 'react';
import { DropdownMenu, Button } from '@radix-ui/themes';
import { GearIcon, QuestionMarkCircledIcon, GlobeIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';

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
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button
                    variant="ghost"
                    size="2"
                    className="text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    aria-label={t('navigation.settings')}
                >
                    <GearIcon className="w-5 h-5" />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="min-w-[200px]">
                {/* Language Section */}
                <DropdownMenu.Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                    <div className="flex items-center gap-2">
                        <GlobeIcon className="w-3.5 h-3.5" />
                        {t('settings.language')}
                    </div>
                </DropdownMenu.Label>
                
                {languages.map((language) => (
                    <DropdownMenu.Item
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={i18n.language === language.code ? 'bg-blue-50 dark:bg-blue-950/30' : ''}
                    >
                        <span className="flex items-center justify-between w-full gap-2">
                            <span className="flex items-center gap-2">
                                <span>{language.flag}</span>
                                <span>{t(`languages.${language.code}`)}</span>
                            </span>
                            {i18n.language === language.code && <span className="text-blue-600 dark:text-blue-400">✓</span>}
                        </span>
                    </DropdownMenu.Item>
                ))}

                <DropdownMenu.Separator />

                {/* Theme Section */}
                <DropdownMenu.Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                    {t('settings.theme')}
                </DropdownMenu.Label>
                
                <DropdownMenu.Item onClick={toggleDarkMode}>
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
                </DropdownMenu.Item>

                {onShowHelp && (
                    <>
                        <DropdownMenu.Separator />
                        
                        {/* Help Section */}
                        <DropdownMenu.Item onClick={onShowHelp}>
                            <div className="flex items-center gap-2">
                                <QuestionMarkCircledIcon className="w-4 h-4" />
                                {t('navigation.help')}
                            </div>
                        </DropdownMenu.Item>
                    </>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
