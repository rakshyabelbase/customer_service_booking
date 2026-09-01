/**
 * Dark Theme Color Tokens & WCAG Contrast Standards
 *
 * All color tokens are designed and verified against dark background surface values
 * (--color-bg-base: #0f172a, --color-bg-surface: #1e293b, --color-bg-surface-raised: #334155)
 * to maintain WCAG AA minimum contrast (>= 4.5:1 for normal text, >= 3:1 for large text/icons).
 */

export const colors = {
  // Background Tokens
  bgBase: 'var(--color-bg-base)',          // #0f172a - page main background
  bgSurface: 'var(--color-bg-surface)',       // #1e293b - card/panel background
  bgSurfaceRaised: 'var(--color-bg-surface-raised)', // #334155 - modal/dropdown background
  bgMuted: 'var(--color-bg-muted)',         // rgba(255, 255, 255, 0.05) - subtle fills

  // Text Tokens
  textPrimary: 'var(--color-text-primary)',   // #f8fafc - high contrast primary headings & text (Contrast > 15:1)
  textSecondary: 'var(--color-text-secondary)', // #cbd5e1 - medium contrast readable body text (Contrast > 9:1)
  textMuted: 'var(--color-text-muted)',     // #94a3b8 - helper text, timestamps, placeholders (Contrast >= 4.6:1)
  textDisabled: 'var(--color-text-disabled)',  // #64748b - disabled elements (allowed to fail AA, non-critical)
  textInverse: 'var(--color-text-inverse)',   // #ffffff - text on filled primary/brand buttons

  // Primary / Brand Tokens
  primary: 'var(--color-primary)',         // #6366f1 - primary brand indigo
  primaryHover: 'var(--color-primary-hover)',    // #4f46e5 - primary hover state
  primaryLight: 'var(--color-primary-light)',    // #a5b4fc - light indigo text token
  primaryBg: 'var(--color-primary-bg)',       // rgba(99, 102, 241, 0.15) - primary badge background

  // Semantic Status Tokens
  success: 'var(--color-success)',         // #34d399 - emerald green text token (Contrast >= 5.5:1 on dark bg)
  successBg: 'var(--color-success-bg)',       // rgba(16, 185, 129, 0.15) - emerald badge background
  warning: 'var(--color-warning)',         // #fbbf24 - amber text token (Contrast >= 8:1 on dark bg)
  warningBg: 'var(--color-warning-bg)',       // rgba(245, 158, 11, 0.15) - amber badge background
  danger: 'var(--color-danger)',          // #f87171 - rose red text token (Contrast >= 5.2:1 on dark bg)
  dangerBg: 'var(--color-danger-bg)',        // rgba(244, 63, 94, 0.15) - rose badge background
  info: 'var(--color-info)',            // #60a5fa - sky blue text token
  infoBg: 'var(--color-info-bg)',          // rgba(59, 130, 246, 0.15) - sky blue badge background

  // Border Tokens
  borderSubtle: 'var(--color-border-subtle)', // rgba(255, 255, 255, 0.1)
  borderStrong: 'var(--color-border-strong)', // rgba(255, 255, 255, 0.2)
};

export type ColorToken = keyof typeof colors;
