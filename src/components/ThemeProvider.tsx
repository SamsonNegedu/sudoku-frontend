import React, { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
};
