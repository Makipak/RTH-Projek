/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',

    primary: "#2E7D32",
    secondary: "#4CAF50",
    accent: "#A5D6A7",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",

    // RTH Monitor design system (lihat §Design System di CLAUDE.md)
    rthPrimary: '#1B4332',
    rthPrimaryMid: '#2D6A4F',
    rthBackground: '#EEF5EE',
    rthCardBackground: '#FFFFFF',
    rthBorder: '#CDE5CD',
    rthTextMuted: '#9DD4A0',
    rthTextSubtle: '#6B8F6B',
    rthTextFaint: '#7DAF7D',
    rthTextCaption: '#AACBAA',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',

    primary: "#2E7D32",
    secondary: "#4CAF50",
    accent: "#A5D6A7",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",

    // RTH Monitor design system (lihat §Design System di CLAUDE.md)
    rthPrimary: '#52B788',
    rthPrimaryMid: '#2D6A4F',
    rthBackground: '#0F1A12',
    rthCardBackground: '#152019',
    rthBorder: '#2A3D2E',
    rthTextMuted: '#9DD4A0',
    rthTextSubtle: '#5A9060',
    rthTextFaint: '#3B6640',
    rthTextCaption: '#2A4A2E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Kategori skor kuesioner — sama di light & dark mode (lihat §Design System di CLAUDE.md)
export const RthCategoryColors = {
  sangatRendah: '#ef4444',
  rendah: '#f97316',
  sedang: '#eab308',
  tinggi: '#22c55e',
  sangatTinggi: '#10b981',
} as const;

// Warna teks badge kategori di layar hasil kuesioner — beda dari RthCategoryColors
// (yang dipakai untuk dot/arc). Pola skala Tailwind 700 (light) / 400 (dark) per warna
// dasar kategori, dikonfirmasi dari 2 contoh di mockup (sedang & sangatTinggi).
export const RthCategoryTextColors = {
  light: {
    sangatRendah: '#b91c1c',
    rendah: '#c2410c',
    sedang: '#a16207',
    tinggi: '#15803d',
    sangatTinggi: '#047857',
  },
  dark: {
    sangatRendah: '#f87171',
    rendah: '#fb923c',
    sedang: '#fbbf24',
    tinggi: '#4ade80',
    sangatTinggi: '#34d399',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
