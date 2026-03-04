import React from 'react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '../../../stores/themeStore';

export const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    return (
        <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            className="rounded-lg"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </Button>
    );
};
