/**
 * Color Palette Reference Component
 * 
 * This component displays all available colors in the theme system.
 * Use it during development to visualize and test colors.
 * 
 * To use: Import and render in a development route or page
 * 
 * @example
 * import { ColorPalette } from '@/components/dev/ColorPalette';
 * 
 * function DevPage() {
 *   return <ColorPalette />;
 * }
 */

import React from 'react';
import { colors } from '@/styles/colors';

interface ColorSwatchProps {
  name: string;
  value: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, value, textColor = 'text-neutral-900 dark:text-neutral-50' }) => (
  <div className="flex flex-col gap-2">
    <div
      className="h-20 rounded-lg border border-neutral-300 dark:border-gray-600 shadow-sm"
      style={{ backgroundColor: value }}
    />
    <div className="text-xs">
      <div className={`font-semibold ${textColor}`}>{name}</div>
      <div className="text-neutral-500 dark:text-gray-400 font-mono">{value}</div>
    </div>
  </div>
);

interface ColorScaleProps {
  title: string;
  scale: Record<string, string>;
}

const ColorScale: React.FC<ColorScaleProps> = ({ title, scale }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Object.entries(scale).map(([shade, value]) => (
        <ColorSwatch key={shade} name={shade} value={value} />
      ))}
    </div>
  </div>
);

export const ColorPalette: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Color System Reference
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Complete color palette for the Sudoku app. All colors support light and dark modes.
          </p>
        </div>

        {/* Semantic Colors */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Semantic Colors
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Use these for theme-aware components that automatically adapt to light/dark mode.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-background border border-border rounded-lg" />
              <div className="text-xs">
                <div className="font-semibold text-foreground">background</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-background</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-card border border-border rounded-lg" />
              <div className="text-xs">
                <div className="font-semibold text-foreground">card</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-card</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary text-primary-foreground flex items-center justify-center rounded-lg font-semibold">
                Primary
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">primary</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-primary</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-secondary text-secondary-foreground flex items-center justify-center rounded-lg font-semibold">
                Secondary
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">secondary</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-secondary</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-muted text-muted-foreground flex items-center justify-center rounded-lg font-semibold">
                Muted
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">muted</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-muted</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-accent text-accent-foreground flex items-center justify-center rounded-lg font-semibold">
                Accent
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">accent</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-accent</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-destructive text-destructive-foreground flex items-center justify-center rounded-lg font-semibold">
                Destructive
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">destructive</div>
                <code className="text-neutral-500 dark:text-gray-400 text-xs">bg-destructive</code>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Colors */}
        <ColorScale title="Primary (Blue) - Interactive Elements" scale={colors.primary} />

        {/* Success Colors */}
        <ColorScale title="Success (Green) - Correct States" scale={colors.success} />

        {/* Error Colors */}
        <ColorScale title="Error (Red) - Incorrect States" scale={colors.error} />

        {/* Hint Colors */}
        <ColorScale title="Hint (Amber) - Attention Elements" scale={colors.hint} />

        {/* Neutral Colors */}
        <ColorScale title="Neutral (Gray) - Backgrounds & Borders" scale={colors.neutral} />

        {/* Slate Colors */}
        <ColorScale title="Slate (Blue-Gray) - Text & Subtle Backgrounds" scale={colors.slate} />

        {/* Usage Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Component Examples
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Common component patterns using the color system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground">Buttons</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                  Primary Button
                </button>
                <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-neutral-900 dark:text-neutral-50 rounded-lg font-medium transition-colors">
                  Secondary Button
                </button>
                <button className="w-full px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg font-medium transition-colors">
                  Destructive Button
                </button>
                <button className="w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors">
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground">Cards</h3>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">Card Title</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Card content with proper contrast</p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
                  <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">Highlighted Card</h4>
                  <p className="text-sm text-primary-700 dark:text-primary-300">With primary color background</p>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground">Alerts</h3>
              <div className="space-y-3">
                <div className="bg-success-100 dark:bg-success-800 border border-success-300 dark:border-success-600 rounded-lg p-4">
                  <p className="text-sm text-success-800 dark:text-success-100 font-medium">Success message</p>
                </div>
                <div className="bg-error-100 dark:bg-error-800 border border-error-300 dark:border-error-600 rounded-lg p-4">
                  <p className="text-sm text-error-800 dark:text-error-100 font-medium">Error message</p>
                </div>
                <div className="bg-warning-100 dark:bg-warning-800 border border-warning-300 dark:border-warning-600 rounded-lg p-4">
                  <p className="text-sm text-warning-800 dark:text-warning-100 font-medium">Warning message</p>
                </div>
              </div>
            </div>

            {/* Sudoku Cell States */}
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground">Sudoku Cell States</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded flex items-center justify-center text-lg font-semibold">
                  5
                </div>
                <div className="aspect-square bg-slate-50 dark:bg-gray-700 border border-neutral-200 dark:border-gray-700 rounded flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <div className="aspect-square bg-primary-500 text-white border border-primary-700 rounded flex items-center justify-center text-lg font-semibold shadow-lg">
                  7
                </div>
                <div className="aspect-square bg-primary-50 dark:bg-primary-900 border border-neutral-200 dark:border-gray-700 rounded flex items-center justify-center text-lg font-semibold">
                  2
                </div>
                <div className="aspect-square bg-error-100 dark:bg-error-800 border border-error-500 rounded flex items-center justify-center text-lg font-semibold text-error-800 dark:text-error-100">
                  9
                </div>
                <div className="aspect-square bg-hint-400 dark:bg-hint-600 border border-hint-600 rounded flex items-center justify-center text-lg font-semibold text-amber-900 shadow-lg">
                  4
                </div>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <p>• Default • Fixed • Selected</p>
                <p>• Highlighted • Error • Hint</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            For more information, see <code className="px-2 py-1 bg-muted rounded">COLOR_SYSTEM.md</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
