/**
 * Supply Chain Frontend - Design Tokens
 *
 * TypeScript konštanty pre všetky vizuálne hodnoty design systému.
 * Import tento súbor do projektu pre konzistentné používanie farieb, spacing, atď.
 *
 * Použitie:
 * import { COLORS, SPACING, TYPOGRAPHY } from './DESIGN_TOKENS';
 */

// =============================================================================
// FARBY (COLORS)
// =============================================================================

/**
 * Primárne farby - Škoda Brand
 */
export const SKODA_COLORS = {
  /** Hlavná zelená - tlačidlá, akcenty, border-left */
  GREEN: '#4BA82E',
  /** Tmavá zelená - header backgrounds, primárne tlačidlá */
  DARK: '#0E3A2F',
  /** Svetlá zelená - text na tmavom pozadí, hover */
  LIGHT: '#78FAAE',
  /** Extra tmavá - vnorené panely v tmavých headeroch */
  EXTRA_DARK: '#1a5a42',
  /** Svetlé pozadie - hover v tabuľkách, badge backgrounds */
  BACKGROUND: '#E8F5E3',
  /** Text na svetlom zelenom pozadí */
  TEXT_ON_LIGHT: '#2D7A1C',
} as const;

/**
 * Neutrálne farby (Grayscale)
 */
export const GRAY_COLORS = {
  WHITE: '#FFFFFF',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_900: '#111827',
} as const;

/**
 * Sémantické farby - Risk & Status
 */
export const SEMANTIC_COLORS = {
  // Červená (High Risk / Error)
  RED_50: '#FEF2F2',
  RED_100: '#FEE2E2',
  RED_200: '#FECACA',
  RED_500: '#EF4444',
  RED_600: '#DC2626',
  RED_700: '#B91C1C',
  RED_800: '#991B1B',

  // Žltá (Medium Risk / Warning)
  YELLOW_50: '#FFFBEB',
  YELLOW_200: '#FDE68A',
  YELLOW_500: '#F59E0B',
  YELLOW_600: '#D97706',
  YELLOW_700: '#B45309',
  YELLOW_800: '#92400E',

  // Oranžová (Company B / Alternative)
  ORANGE_50: '#FFF7ED',
  ORANGE_100: '#FFEDD5',
  ORANGE_500: '#F97316',
  ORANGE_600: '#EA580C',
  ORANGE_800: '#9A3412',

  // Modrá (Company A / Info)
  BLUE_50: '#EFF6FF',
  BLUE_100: '#DBEAFE',
  BLUE_200: '#BFDBFE',
  BLUE_600: '#2563EB',
  BLUE_700: '#1D4ED8',
  BLUE_800: '#1E40AF',
  BLUE_900: '#1E3A8A',

  // Zelená (Success / Stable)
  GREEN_50: '#F0FDF4',
  GREEN_100: '#DCFCE7',
  GREEN_300: '#86EFAC',
  GREEN_600: '#16A34A',
  GREEN_700: '#15803D',
  GREEN_800: '#166534',

  // Amber (Critical Warning)
  AMBER_50: '#FFFBEB',
  AMBER_500: '#F59E0B',
  AMBER_800: '#92400E',
  AMBER_900: '#78350F',
} as const;

/**
 * Kombinovaný objekt všetkých farieb
 */
export const COLORS = {
  ...SKODA_COLORS,
  ...GRAY_COLORS,
  ...SEMANTIC_COLORS,
} as const;

// =============================================================================
// TYPOGRAFIA (TYPOGRAPHY)
// =============================================================================

/**
 * Font families
 */
export const FONT_FAMILY = {
  /** Primárny font - Geist */
  SANS: 'var(--font-geist-sans), Arial, Helvetica, sans-serif',
  /** Monospace font - pre kódy */
  MONO: 'var(--font-geist-mono), "Courier New", monospace',
  /** Fallback */
  FALLBACK: 'Arial, Helvetica, sans-serif',
} as const;

/**
 * Font váhy
 */
export const FONT_WEIGHT = {
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
} as const;

/**
 * Font veľkosti (v pixeloch)
 */
export const FONT_SIZE = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
  '5XL': 48,
} as const;

/**
 * Line heights
 */
export const LINE_HEIGHT = {
  TIGHT: 1.2,
  SNUG: 1.3,
  NORMAL: 1.5,
  RELAXED: 1.625,
} as const;

/**
 * Letter spacing
 */
export const LETTER_SPACING = {
  NORMAL: '0',
  WIDE: '0.025em',
  WIDER: '0.05em',
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing system (v pixeloch)
 */
export const SPACING = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Box shadows
 */
export const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  NODE: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

/**
 * Border radius hodnoty
 */
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 2,
  DEFAULT: 4,
  MD: 8,
  LG: 12,
  FULL: 9999,
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

/**
 * Transition durations (v ms)
 */
export const TRANSITION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Transition easing
 */
export const TRANSITION_EASING = {
  EASE_IN_OUT: 'ease-in-out',
  EASE_OUT: 'ease-out',
  LINEAR: 'linear',
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

/**
 * Responsive breakpoints (min-width v px)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

/**
 * Z-index hierarchy
 */
export const Z_INDEX = {
  BASE: 0,
  STICKY: 10,
  DROPDOWN: 20,
  TOOLTIP: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOAST: 60,
} as const;

// =============================================================================
// NODE DIMENSIONS (React Flow)
// =============================================================================

/**
 * Rozmery pre React Flow nodes
 */
export const NODE_DIMENSIONS = {
  /** Tier 1 / Depth 0 (Root node) */
  TIER1: { width: 100, height: 50 },
  /** Tier 2 / Depth 1 */
  TIER2: { width: 70, height: 45 },
  /** Tier 3 / Depth 2+ */
  TIER3: { width: 70, height: 40 },

  /** Aliasy pre ownership graph */
  depth0: { width: 100, height: 50 },
  depth1: { width: 70, height: 45 },
  depth2Plus: { width: 70, height: 40 },
} as const;

// =============================================================================
// RISK LEVELS
// =============================================================================

/**
 * Risk level konfigurácia
 */
export const RISK_CONFIG = {
  HIGH: {
    threshold: 50, // score < 50
    icon: '🔴',
    label: 'HIGH RISK',
    bgColor: SEMANTIC_COLORS.RED_50,
    textColor: SEMANTIC_COLORS.RED_800,
    borderColor: SEMANTIC_COLORS.RED_200,
  },
  MEDIUM: {
    threshold: 70, // score < 70
    icon: '⚠️',
    label: 'MEDIUM RISK',
    bgColor: SEMANTIC_COLORS.YELLOW_50,
    textColor: SEMANTIC_COLORS.YELLOW_800,
    borderColor: SEMANTIC_COLORS.YELLOW_200,
  },
  STABLE: {
    threshold: 100, // score >= 70
    icon: '✅',
    label: 'STABLE',
    bgColor: SEMANTIC_COLORS.GREEN_50,
    textColor: SEMANTIC_COLORS.GREEN_800,
    borderColor: SEMANTIC_COLORS.GREEN_300,
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Získa risk level config na základe stability score
 */
export function getRiskConfig(score: number | null | undefined) {
  if (score === null || score === undefined) return null;
  if (score < RISK_CONFIG.HIGH.threshold) return RISK_CONFIG.HIGH;
  if (score < RISK_CONFIG.MEDIUM.threshold) return RISK_CONFIG.MEDIUM;
  return RISK_CONFIG.STABLE;
}

/**
 * Konvertuje spacing hodnotu na px string
 */
export function spacing(value: keyof typeof SPACING): string {
  return `${SPACING[value]}px`;
}

/**
 * Konvertuje font size hodnotu na px string
 */
export function fontSize(value: keyof typeof FONT_SIZE): string {
  return `${FONT_SIZE[value]}px`;
}

// =============================================================================
// CSS CUSTOM PROPERTIES (pre použitie v :root)
// =============================================================================

/**
 * Generuje CSS custom properties string
 */
export const CSS_CUSTOM_PROPERTIES = `
:root {
  /* Primary Colors */
  --color-primary: ${SKODA_COLORS.GREEN};
  --color-primary-dark: ${SKODA_COLORS.DARK};
  --color-primary-light: ${SKODA_COLORS.LIGHT};
  --color-primary-extra-dark: ${SKODA_COLORS.EXTRA_DARK};
  --color-primary-bg: ${SKODA_COLORS.BACKGROUND};
  --color-primary-text: ${SKODA_COLORS.TEXT_ON_LIGHT};

  /* Neutral Colors */
  --color-white: ${GRAY_COLORS.WHITE};
  --color-gray-50: ${GRAY_COLORS.GRAY_50};
  --color-gray-100: ${GRAY_COLORS.GRAY_100};
  --color-gray-200: ${GRAY_COLORS.GRAY_200};
  --color-gray-300: ${GRAY_COLORS.GRAY_300};
  --color-gray-400: ${GRAY_COLORS.GRAY_400};
  --color-gray-500: ${GRAY_COLORS.GRAY_500};
  --color-gray-600: ${GRAY_COLORS.GRAY_600};
  --color-gray-700: ${GRAY_COLORS.GRAY_700};
  --color-gray-900: ${GRAY_COLORS.GRAY_900};

  /* Semantic Colors */
  --color-success: ${SEMANTIC_COLORS.GREEN_600};
  --color-success-bg: ${SEMANTIC_COLORS.GREEN_50};
  --color-warning: ${SEMANTIC_COLORS.YELLOW_500};
  --color-warning-bg: ${SEMANTIC_COLORS.YELLOW_50};
  --color-danger: ${SEMANTIC_COLORS.RED_500};
  --color-danger-bg: ${SEMANTIC_COLORS.RED_50};
  --color-info: ${SEMANTIC_COLORS.BLUE_600};
  --color-info-bg: ${SEMANTIC_COLORS.BLUE_50};

  /* Typography */
  --font-sans: ${FONT_FAMILY.SANS};
  --font-mono: ${FONT_FAMILY.MONO};

  /* Spacing */
  --spacing-1: ${SPACING[1]}px;
  --spacing-2: ${SPACING[2]}px;
  --spacing-3: ${SPACING[3]}px;
  --spacing-4: ${SPACING[4]}px;
  --spacing-5: ${SPACING[5]}px;
  --spacing-6: ${SPACING[6]}px;
  --spacing-8: ${SPACING[8]}px;

  /* Shadows */
  --shadow-sm: ${SHADOWS.SM};
  --shadow-md: ${SHADOWS.MD};
  --shadow-lg: ${SHADOWS.LG};
  --shadow-xl: ${SHADOWS.XL};

  /* Border Radius */
  --radius-none: ${BORDER_RADIUS.NONE}px;
  --radius-sm: ${BORDER_RADIUS.SM}px;
  --radius-md: ${BORDER_RADIUS.MD}px;
  --radius-full: ${BORDER_RADIUS.FULL}px;

  /* Transitions */
  --transition-fast: ${TRANSITION_DURATION.FAST}ms ${TRANSITION_EASING.EASE_IN_OUT};
  --transition-normal: ${TRANSITION_DURATION.NORMAL}ms ${TRANSITION_EASING.EASE_IN_OUT};
  --transition-slow: ${TRANSITION_DURATION.SLOW}ms ${TRANSITION_EASING.EASE_IN_OUT};
}
`;

export default {
  COLORS,
  SKODA_COLORS,
  GRAY_COLORS,
  SEMANTIC_COLORS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  SPACING,
  SHADOWS,
  BORDER_RADIUS,
  TRANSITION_DURATION,
  TRANSITION_EASING,
  BREAKPOINTS,
  Z_INDEX,
  NODE_DIMENSIONS,
  RISK_CONFIG,
  getRiskConfig,
  spacing,
  fontSize,
  CSS_CUSTOM_PROPERTIES,
};
