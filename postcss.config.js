export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifySelectors: true,
          calc: false, // Disable calc optimization to avoid parse errors with complex expressions
          colormin: false, // Disable color minification to preserve CSS variables
        }],
      },
    } : {}),
  },
}
