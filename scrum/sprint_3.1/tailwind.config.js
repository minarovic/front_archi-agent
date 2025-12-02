/** @type {import('tailwindcss').Config} */

/**
 * Supply Chain Frontend - Tailwind Configuration
 *
 * Kompletná Tailwind konfigurácia pre Škoda Supply Chain design systém.
 * Skopíruj tento súbor do nového projektu ako tailwind.config.js
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // =====================================================================
      // COLORS
      // =====================================================================
      colors: {
        // Škoda Brand Colors
        'skoda': {
          'green': '#4BA82E',        // Hlavná zelená
          'dark': '#0E3A2F',         // Tmavá zelená (headers)
          'light': '#78FAAE',        // Svetlá zelená (accent text)
          'extra-dark': '#1a5a42',   // Extra tmavá (vnorené panely)
          'bg': '#E8F5E3',           // Svetlé pozadie
          'text': '#2D7A1C',         // Text na svetlom zelenom
        },

        // Semantic aliases
        'primary': '#4BA82E',
        'primary-dark': '#0E3A2F',
        'primary-light': '#78FAAE',

        // Risk Colors
        'risk': {
          'high': '#EF4444',
          'high-bg': '#FEF2F2',
          'high-text': '#991B1B',
          'medium': '#F59E0B',
          'medium-bg': '#FFFBEB',
          'medium-text': '#92400E',
          'low': '#16A34A',
          'low-bg': '#F0FDF4',
          'low-text': '#166534',
        },
      },

      // =====================================================================
      // TYPOGRAPHY
      // =====================================================================
      fontFamily: {
        'sans': ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'Courier New', 'monospace'],
      },

      fontSize: {
        // Custom sizes if needed (Tailwind defaults are usually sufficient)
      },

      fontWeight: {
        // Tailwind defaults: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
      },

      lineHeight: {
        'tight': '1.2',
        'snug': '1.3',
        'relaxed': '1.625',
      },

      letterSpacing: {
        'wide': '0.025em',
        'wider': '0.05em',
      },

      // =====================================================================
      // SPACING
      // =====================================================================
      spacing: {
        // Tailwind defaults are sufficient (0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8...)
      },

      // =====================================================================
      // SHADOWS
      // =====================================================================
      boxShadow: {
        'node': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        // Tailwind defaults: sm, DEFAULT, md, lg, xl, 2xl
      },

      // =====================================================================
      // BORDER RADIUS
      // =====================================================================
      borderRadius: {
        // Tailwind defaults: none, sm, DEFAULT (4px), md (6px), lg (8px), xl, 2xl, 3xl, full
      },

      // =====================================================================
      // ANIMATIONS
      // =====================================================================
      animation: {
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
        'fade-in': 'fadeIn 500ms ease-in-out',
        'slide-in': 'slideIn 500ms ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },

      // =====================================================================
      // TRANSITIONS
      // =====================================================================
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },

      // =====================================================================
      // Z-INDEX
      // =====================================================================
      zIndex: {
        'sticky': '10',
        'dropdown': '20',
        'tooltip': '30',
        'modal-backdrop': '40',
        'modal': '50',
        'toast': '60',
      },

      // =====================================================================
      // MAX-WIDTH (for containers)
      // =====================================================================
      maxWidth: {
        'chat': '600px',  // Chat panel width
      },

      // =====================================================================
      // WIDTH
      // =====================================================================
      width: {
        'chat': '600px',  // Fixed chat panel width
      },

      // =====================================================================
      // HEIGHT
      // =====================================================================
      height: {
        'graph': '600px',  // React Flow graph height
        'map': '500px',    // Map view height
      },
    },
  },
  plugins: [
    // Uncomment if using forms
    // require('@tailwindcss/forms'),

    // Uncomment if using typography prose
    // require('@tailwindcss/typography'),
  ],
}
