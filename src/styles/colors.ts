/**
 * Color Theme System for Sudoku App
 * 
 * This file defines the complete color palette used throughout the application.
 * All colors are organized semantically for consistent theming across light and dark modes.
 * 
 * USAGE GUIDELINES:
 * 
 * 1. PREFER TAILWIND CLASSES:
 *    - Use Tailwind utility classes in components: `bg-primary-500`, `text-neutral-700`
 *    - This ensures proper dark mode support via Tailwind's dark: prefix
 * 
 * 2. USE SEMANTIC COLORS:
 *    - Background: `bg-background`, `bg-card`
 *    - Text: `text-foreground`, `text-muted-foreground`
 *    - Interactive: `bg-primary`, `hover:bg-primary-600`
 *    - States: `bg-success`, `bg-error`, `bg-warning`, `bg-hint`
 * 
 * 3. GAME-SPECIFIC COLORS:
 *    - Selected cell: `bg-primary-500` (blue)
 *    - Highlighted cells: `bg-primary-50 dark:bg-primary-900`
 *    - Fixed cells: `bg-slate-50 dark:bg-gray-700`
 *    - Errors: `bg-error-100 dark:bg-error-800`
 *    - Hints: `bg-hint-400 dark:bg-hint-600`
 * 
 * 4. DARK MODE:
 *    - Always provide dark mode variants: `bg-white dark:bg-gray-800`
 *    - Test in both light and dark modes
 */

export const colors = {
  /**
   * PRIMARY BRAND COLORS (Blue)
   * Used for: Interactive elements, selected states, primary actions
   */
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  /**
   * SUCCESS COLORS (Green)
   * Used for: Correct answers, completion states, positive feedback
   */
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Main success color
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  /**
   * ERROR COLORS (Red)
   * Used for: Incorrect answers, validation errors, destructive actions
   */
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  /**
   * WARNING COLORS (Amber)
   * Used for: Cautions, important notices
   */
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  /**
   * HINT COLORS (Amber/Yellow)
   * Used for: Hint highlights, attention-grabbing elements
   */
  hint: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',  // Main hint color
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  /**
   * NEUTRAL COLORS (Gray)
   * Used for: Borders, backgrounds, disabled states
   */
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',  // Main neutral color
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  /**
   * SLATE COLORS (Blue-Gray)
   * Used for: Text, subtle backgrounds
   */
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // Main slate color
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

/**
 * SEMANTIC COLOR MAPPINGS
 * These map to CSS custom properties defined in index.css
 */
export const semanticColors = {
  // Base
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',

  // Cards
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',

  // Popovers
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',

  // Primary
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  // Secondary
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',

  // Muted
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  // Accent
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // Destructive
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',

  // Borders
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // Game-specific
  cellBg: 'hsl(var(--cell-bg))',
  cellFixed: 'hsl(var(--cell-fixed))',
  cellSelected: 'hsl(var(--cell-selected))',
  cellHighlighted: 'hsl(var(--cell-highlighted))',
  cellError: 'hsl(var(--cell-error))',
  cellHint: 'hsl(var(--cell-hint))',
} as const;

/**
 * COMPONENT-SPECIFIC COLOR GUIDELINES
 */
export const componentColors = {
  /**
   * SUDOKU GRID
   */
  sudokuGrid: {
    // Cell states
    default: 'bg-white dark:bg-gray-800',
    fixed: 'bg-slate-50 dark:bg-gray-700',
    selected: 'bg-primary-500 text-white',
    highlighted: 'bg-primary-50 dark:bg-primary-900',
    sameNumber: 'bg-primary-200 dark:bg-primary-700',
    error: 'bg-error-100 dark:bg-error-800 text-error-800 dark:text-error-100',
    hintTarget: 'bg-hint-400 dark:bg-hint-600 text-amber-900',
    hintFilled: 'bg-hint-200 dark:bg-hint-700',

    // Borders
    cellBorder: 'border-neutral-200 dark:border-gray-700',
    boxBorder: 'border-neutral-400 dark:border-gray-300',

    // Text
    fixedText: 'text-neutral-800 dark:text-gray-100',
    userText: 'text-neutral-700 dark:text-gray-200',
    notes: 'text-neutral-500 dark:text-gray-400',
  },

  /**
   * NAVIGATION
   */
  navbar: {
    background: 'bg-white dark:bg-gray-800',
    border: 'border-neutral-200 dark:border-gray-700',
    text: 'text-neutral-900 dark:text-neutral-50',
    textMuted: 'text-neutral-600 dark:text-neutral-400',
  },

  /**
   * BUTTONS
   */
  buttons: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600',
    destructive: 'bg-error-500 hover:bg-error-600 text-white',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-gray-800',
    outline: 'border border-neutral-300 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-800',
  },

  /**
   * CARDS & PANELS
   */
  cards: {
    background: 'bg-white dark:bg-gray-800',
    border: 'border-neutral-200 dark:border-gray-700',
    hover: 'hover:bg-neutral-50 dark:hover:bg-gray-700',
  },

  /**
   * MODALS & OVERLAYS
   */
  modals: {
    overlay: 'bg-black/60 backdrop-blur-md',
    background: 'bg-white dark:bg-gray-800',
    border: 'border-white/20 dark:border-gray-700/20',
  },

  /**
   * INPUTS
   */
  inputs: {
    background: 'bg-white dark:bg-gray-800',
    border: 'border-neutral-300 dark:border-gray-600',
    focus: 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    text: 'text-neutral-900 dark:text-neutral-50',
    placeholder: 'placeholder:text-neutral-400 dark:placeholder:text-gray-500',
  },
} as const;

/**
 * UTILITY FUNCTIONS
 */

/**
 * Get a color value by path
 * @example getColor('primary', 500) => '#3b82f6'
 */
export function getColor(
  category: keyof typeof colors,
  shade: keyof typeof colors.primary
): string {
  return colors[category][shade];
}

/**
 * Generate gradient classes
 */
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  success: 'bg-gradient-to-r from-success-500 to-success-600',
  error: 'bg-gradient-to-r from-error-500 to-error-600',
  warning: 'bg-gradient-to-r from-warning-500 to-warning-600',
  neutral: 'bg-gradient-to-r from-neutral-500 to-neutral-600',
} as const;

export default colors;
