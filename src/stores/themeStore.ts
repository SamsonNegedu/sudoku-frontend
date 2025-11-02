import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  initializeTheme: () => void;
}

// Function to detect system color scheme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Function to apply theme to DOM
const applyTheme = (isDark: boolean) => {
  if (typeof window === 'undefined') return;
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDarkMode: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        const isDark =
          theme === 'system' ? getSystemTheme() === 'dark' : theme === 'dark';
        set({ isDarkMode: isDark });
        applyTheme(isDark);
      },

      toggleDarkMode: () => {
        const state = get();
        if (state.theme === 'system') {
          // If currently on system preference, toggle to explicit light/dark
          set({ theme: state.isDarkMode ? 'light' : 'dark' });
          set({ isDarkMode: !state.isDarkMode });
          applyTheme(!state.isDarkMode);
        } else {
          // Toggle between light and dark
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          set({ theme: newTheme });
          set({ isDarkMode: newTheme === 'dark' });
          applyTheme(newTheme === 'dark');
        }
      },

      initializeTheme: () => {
        const state = get();
        const isDark =
          state.theme === 'system'
            ? getSystemTheme() === 'dark'
            : state.theme === 'dark';
        set({ isDarkMode: isDark });
        applyTheme(isDark);

        // Listen for system preference changes when theme is set to 'system'
        if (state.theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const listener = (e: MediaQueryListEvent) => {
            set({ isDarkMode: e.matches });
            applyTheme(e.matches);
          };
          mediaQuery.addEventListener('change', listener);

          // Cleanup listener when component unmounts (cleanup would be handled by ThemeProvider)
          return () => {
            mediaQuery.removeEventListener('change', listener);
          };
        }
      },
    }),
    {
      name: 'sudoku-theme-store',
      partialize: state => ({
        theme: state.theme,
      }),
    }
  )
);
