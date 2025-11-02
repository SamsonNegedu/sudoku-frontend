import React from 'react';
import { useThemeStore } from '../stores/themeStore';

export const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};
