# Dark Mode Implementation Guide

## Overview

Global dark mode support has been added to the Sudoku app with full system preference detection and user override capability. The implementation uses Tailwind CSS's built-in dark mode support with a class-based strategy, combined with Zustand for state management.

## Features

✅ **System Preference Detection** - Automatically respects the user's OS dark mode setting  
✅ **User Toggle** - Moon/Sun emoji button in the navbar to manually switch themes  
✅ **Persistent Storage** - Theme preference is saved and restored across sessions  
✅ **Full Component Coverage** - All pages and components support dark mode  
✅ **Smooth Transitions** - Color changes use smooth CSS transitions  
✅ **Accessible** - Proper contrast ratios maintained in both light and dark modes  

## Architecture

### 1. Theme Store (`src/stores/themeStore.ts`)

The Zustand store manages theme state with persistence:

```typescript
interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleDarkMode: () => void;
  initializeTheme: () => void;
}
```

**Key Functions:**
- `initializeTheme()` - Detects system preference and applies initial theme
- `setTheme()` - Explicitly sets light/dark/system mode
- `toggleDarkMode()` - Toggles between light and dark, with smart handling for system mode
- Persists theme selection in localStorage

### 2. Theme Provider (`src/components/ThemeProvider.tsx`)

Minimal wrapper component that initializes the theme on app mount:

```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 3. Dark Mode Toggle (`src/components/DarkModeToggle.tsx`)

Simple button component in the navbar that toggles theme:

- 🌙 Moon emoji in light mode
- ☀️ Sun emoji in dark mode
- Accessible with proper ARIA labels and title attributes

### 4. Tailwind Configuration

Dark mode is enabled in `tailwind.config.js`:

```javascript
darkMode: 'class',
```

This uses the class-based strategy where `<html class="dark">` activates dark mode styles.

### 5. Global Styles (`src/index.css`)

Comprehensive dark mode CSS includes:

- **Base colors** - Body background and text color inversal
- **Sudoku grid** - Dark gray backgrounds and adjusted borders
- **Cells** - Dark mode variants for selected, highlighted, error states
- **Components** - Cards, buttons, inputs all have dark variants
- **Text** - Proper contrast for all text elements in dark mode

## Usage

### For Users

1. **Automatic** - Dark mode follows system preference by default
2. **Toggle** - Click the moon/sun icon in the navbar top-right to manually switch
3. **Persistence** - Your choice is remembered for next visit

### For Developers

#### Adding Dark Mode to New Components

Use Tailwind's `dark:` prefix for dark mode classes:

```tsx
// Light mode default, dark mode variant
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

#### Color Mapping Reference

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | white / neutral-50 | gray-800 / gray-900 |
| Text (primary) | gray-900 | gray-100 |
| Text (secondary) | gray-600 | gray-400 |
| Borders | neutral-200 | gray-700 |
| Cards | white | gray-800 |
| Hover States | gray-50 | gray-700 |

#### Sudoku Grid Colors

The sudoku grid uses dark mode-specific colors for cell states:

```css
/* Fixed cells */
.dark .sudoku-cell[data-fixed="true"] {
  background-color: rgb(55 65 81) !important; /* gray-700 */
  color: rgb(229 231 235) !important;
}

/* Selected cells */
.sudoku-cell[data-selected="true"] {
  background-color: rgb(59 130 246) !important; /* Blue (same in both modes) */
}

/* Highlighted cells (same row/col/box) */
.dark .sudoku-cell[data-highlighted="true"] {
  background-color: rgb(30 58 138) !important; /* darker blue */
}
```

## Implementation Details

### System Preference Detection

Uses `window.matchMedia('(prefers-color-scheme: dark)')`:

```typescript
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};
```

Listens for system preference changes and updates theme accordingly when set to `'system'`.

### DOM Application

The theme is applied to the HTML root element:

```typescript
const applyTheme = (isDark: boolean) => {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};
```

### Persistence

Theme choice is saved to localStorage via Zustand's persist middleware:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'sudoku-theme-store',
    partialize: state => ({
      theme: state.theme,
    }),
  }
)
```

## Components with Dark Mode Support

### Core
- ✅ AppNavbar
- ✅ PageHeader
- ✅ PageLayout (via parent styling)
- ✅ DarkModeToggle

### Game Components
- ✅ GameBoard
- ✅ SudokuGrid
- ✅ SudokuCell (all states: selected, highlighted, fixed, error)
- ✅ GameSidebar
- ✅ Loading overlays

### Analytics Dashboard
- ✅ OverviewStats (all stat cards)
- ✅ RecentGames
- ✅ DifficultyProgress
- ✅ TechniqueAnalysis
- ✅ InsightsSection

### Learning Center
- ✅ TechniqueCard
- ✅ TechniqueGrid
- ✅ All text elements

## Customization

### Changing Color Schemes

Edit `tailwind.config.js` to modify the color palette, or update dark mode colors in `src/index.css`:

```css
@apply bg-white dark:bg-gray-900;
```

### Adding Custom Dark Styles

For component-specific dark mode styles, add them to `src/index.css`:

```css
.your-component {
  /* light mode */
  background-color: white;
  color: black;
}

.dark .your-component {
  /* dark mode */
  background-color: #1f2937;
  color: white;
}
```

## Testing Dark Mode

### Manual Testing

1. In the browser DevTools, use the Console:
```javascript
document.documentElement.classList.toggle('dark');
```

2. Or change OS dark mode preference and verify auto-switching works

### With System Preference

- **macOS:** System Settings → General → Appearance
- **Windows:** Settings → Personalization → Colors → Dark
- **Linux:** Varies by desktop environment

## Browser Support

Dark mode is supported in all modern browsers. The implementation uses:
- CSS class-based dark mode (all modern browsers)
- `prefers-color-scheme` media query (all modern browsers)
- Zustand for state (no browser limitations)

## Performance Considerations

- ✅ CSS-based dark mode (no JavaScript performance cost)
- ✅ Class application is minimal DOM manipulation
- ✅ Zustand store is lightweight
- ✅ No additional bundle size (uses Tailwind built-in)

## Future Enhancements

Potential improvements:

1. **Theme Selector** - Add multiple theme options (blue, green, custom)
2. **Scheduled Dark Mode** - Auto-switch at sunset/sunrise
3. **Per-Page Overrides** - Allow specific pages different themes
4. **Animation Preferences** - Respect `prefers-reduced-motion`
5. **Accessibility Settings** - High contrast mode option

## Troubleshooting

### Dark mode not applying?
- Verify `<html class="dark">` is present in DOM
- Check Tailwind config has `darkMode: 'class'`
- Ensure component uses `dark:` prefix classes

### System preference not detected?
- Check browser privacy settings allow media query
- Verify OS dark mode setting is enabled
- Clear localStorage: `localStorage.removeItem('sudoku-theme-store')`

### Colors not contrasting well?
- Review WCAG contrast requirements
- Update color mappings in tailwind.config.js
- Test with accessibility tools

---

For questions or improvements, refer to the component files or Tailwind documentation:
- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
