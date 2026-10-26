'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'cobalt' | 'emerald' | 'indigo' | 'violet' | 'amber';

export interface ThemeOption {
  id: ThemeColor;
  name: string;
  badge: string;
  colorHex: string;
  gradient: string;
  buttonClass: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  bgLightClass: string;
}

export const THEME_OPTIONS: Record<ThemeColor, ThemeOption> = {
  cobalt: {
    id: 'cobalt',
    name: 'Ocean Cobalt',
    badge: 'Silicon Valley Standard',
    colorHex: '#2563eb',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-600',
    bgLightClass: 'bg-blue-50/50',
  },
  emerald: {
    id: 'emerald',
    name: 'FinTech Emerald',
    badge: 'High-Trust Marketplace',
    colorHex: '#059669',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-600',
    bgLightClass: 'bg-emerald-50/50',
  },
  indigo: {
    id: 'indigo',
    name: 'Midnight Indigo',
    badge: 'Modern AI & Tech',
    colorHex: '#4f46e5',
    gradient: 'from-indigo-600 via-purple-600 to-indigo-700',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-600',
    bgLightClass: 'bg-indigo-50/50',
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet',
    badge: 'Enterprise Creative',
    colorHex: '#7c3aed',
    gradient: 'from-violet-600 via-fuchsia-600 to-violet-700',
    buttonClass: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-600',
    bgLightClass: 'bg-violet-50/50',
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    badge: 'Global Freelance & Gold',
    colorHex: '#d97706',
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-700',
    bgLightClass: 'bg-amber-50/50',
  },
};

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  currentOption: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cobalt',
  setTheme: () => {},
  currentOption: THEME_OPTIONS.cobalt,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>('cobalt');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('globalhire_theme_color') as ThemeColor;
      if (saved && THEME_OPTIONS[saved]) {
        requestAnimationFrame(() => {
          setThemeState(saved);
        });
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('globalhire_theme_color', theme);
    } catch {
      // Ignore localStorage error
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentOption: THEME_OPTIONS[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
