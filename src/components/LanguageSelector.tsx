import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, GlobeIcon } from '@radix-ui/react-icons';
import { cn } from '@/utils/index';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSelectorProps {
    className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 min-w-32 bg-white dark:bg-gray-800 text-neutral-900 dark:text-gray-100 border-neutral-200 dark:border-gray-700"
            >
                <GlobeIcon className="w-4 h-4" />
                <span className="text-sm">{currentLanguage.flag}</span>
                <span className="text-sm font-medium">{currentLanguage.name}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="py-2">
                            {languages.map((language) => (
                                <Button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start px-4 py-2 text-sm gap-3 h-auto",
                                        i18n.language === language.code
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500 font-medium'
                                            : 'text-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    <span className="text-lg">{language.flag}</span>
                                    <span>{t(`languages.${language.code}`)}</span>
                                    {i18n.language === language.code && (
                                        <span className="ml-auto text-primary-600 dark:text-primary-500">✓</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
