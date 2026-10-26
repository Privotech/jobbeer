'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_OPTIONS, ThemeColor } from '@/lib/ThemeContext';
import { Palette, Check, ChevronDown } from 'lucide-react';

export default function ThemeSelector() {
  const { theme, setTheme, currentOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-200/90 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all text-xs font-medium text-neutral-700 shadow-2xs"
        title="Change App Accent Color Palette"
        aria-label="Change Color Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
          style={{ backgroundColor: currentOption.colorHex }}
        />
        <span className="hidden sm:inline font-medium text-neutral-800">{currentOption.name}</span>
        <Palette className="w-3.5 h-3.5 text-neutral-400" />
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 border-b border-neutral-100 mb-1.5">
            <span className="text-[11px] font-bold text-neutral-900 tracking-wide uppercase">App Color Palette</span>
            <p className="text-[10px] text-neutral-500">Pick an accent to update the UI theme</p>
          </div>

          <div className="space-y-1">
            {(Object.keys(THEME_OPTIONS) as ThemeColor[]).map((themeKey) => {
              const opt = THEME_OPTIONS[themeKey];
              const isSelected = theme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    setTheme(themeKey);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-neutral-100/90 text-neutral-900 font-semibold'
                      : 'hover:bg-neutral-50 text-neutral-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs ring-2 ring-white"
                      style={{ backgroundColor: opt.colorHex }}
                    />
                    <div>
                      <div className="text-xs text-neutral-900 leading-tight">{opt.name}</div>
                      <div className="text-[10px] text-neutral-400 font-normal">{opt.badge}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-neutral-900 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
