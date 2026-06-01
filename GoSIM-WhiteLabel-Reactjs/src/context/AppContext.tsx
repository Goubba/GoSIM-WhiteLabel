import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { fr } from '../locales/fr';
import { ar } from '../locales/ar';

interface AppContextType {
  apiKey: string;
  language: string;
  currency: string;
  showHeader: boolean;
  showFooter: boolean;
  primaryColor: string;
  apiUrl: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const locales: Record<string, any> = { en, fr, ar };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous URL query parameter parser and session persistence helper
  const initializeParams = () => {
    // Only execute parameter sync if URL search params are present
    if (!window.location.search) return;
    
    const params = new URLSearchParams(window.location.search);
    const key = params.get('api-key');
    const lang = params.get('language');
    const curr = params.get('currency');
    const head = params.get('header');
    const foot = params.get('footer');
    const col = params.get('color');
    const hst = params.get('host');

    if (key) sessionStorage.setItem('api-key', key);
    if (lang) {
      const normalizedLang = lang.toLowerCase() === 'ar' ? 'ar' : lang.toLowerCase() === 'fr' ? 'fr' : 'en';
      sessionStorage.setItem('language', normalizedLang);
    }
    if (curr) sessionStorage.setItem('currency', curr.toLowerCase());
    if (head) sessionStorage.setItem('header', head);
    if (foot) sessionStorage.setItem('footer', foot);
    if (col) {
      const finalColor = col.startsWith('#') ? col : `#${col}`;
      sessionStorage.setItem('color', finalColor);
    }
    if (hst) {
      const formattedHost = hst.endsWith('/') ? hst.slice(0, -1) : hst;
      sessionStorage.setItem('host', formattedHost);
    }
  };

  // Run initialization SYNCHRONOUSLY before initial state hook setup!
  initializeParams();

  // Helper to get from sessionStorage or fallback
  const getSessionValue = (key: string, defaultValue: string): string => {
    return sessionStorage.getItem(key) || defaultValue;
  };

  // State initialization
  const [apiKey] = useState(() => getSessionValue('api-key', ''));
  const [language, setLanguageState] = useState(() => getSessionValue('language', 'en'));
  const [currency, setCurrencyState] = useState(() => getSessionValue('currency', 'dzd'));
  const [showHeader] = useState(() => getSessionValue('header', 'true') !== 'false');
  const [showFooter] = useState(() => getSessionValue('footer', 'true') !== 'false');
  const [primaryColor] = useState(() => getSessionValue('color', '#DB143C'));
  const [apiUrl] = useState(() => getSessionValue('host', 'https://api.getgosim.com/api/v1'));

  // Update layout direction, body classes, and CSS variables on language/color updates
  useEffect(() => {
    // 1. Language Layout Config
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.dir = 'rtl';
      document.body.classList.add('arabic-lang');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.dir = 'ltr';
      document.body.classList.remove('arabic-lang');
    }
  }, [language]);

  useEffect(() => {
    // 2. Branding Accents Injector
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    
    // Create secondary color with 30% opacity for borders/effects
    let secondary = `${primaryColor}50`;
    if (primaryColor.startsWith('rgb')) {
      secondary = primaryColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
    }
    root.style.setProperty('--color-secondary', secondary);
  }, [primaryColor]);

  // Setters with storage synchronization
  const setLanguage = (lang: string) => {
    sessionStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const setCurrency = (curr: string) => {
    sessionStorage.setItem('currency', curr);
    setCurrencyState(curr);
  };

  // i18n Translation Engine
  const t = (key: string, params?: Record<string, string>): string => {
    const dictionary = locales[language] || locales['en'];
    const parts = key.split('.');
    let value = dictionary;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      // Fallback to English dictionary
      let fallbackValue = locales['en'];
      for (const part of parts) {
        if (fallbackValue && typeof fallbackValue === 'object') {
          fallbackValue = fallbackValue[part];
        } else {
          fallbackValue = undefined;
          break;
        }
      }
      value = fallbackValue;
    }

    if (typeof value !== 'string') {
      return key; // return key as fallback if not resolved
    }

    // Interpolate parameters, e.g. "Welcome, {name}" -> "Welcome, Karim"
    if (params) {
      let interpolated = value;
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        interpolated = interpolated.replace(new RegExp(`{${paramKey}}`, 'g'), paramVal);
      });
      return interpolated;
    }

    return value;
  };

  return (
    <AppContext.Provider
      value={{
        apiKey,
        language,
        currency,
        showHeader,
        showFooter,
        primaryColor,
        apiUrl,
        setLanguage,
        setCurrency,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
