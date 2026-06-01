import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { showHeader, language, setLanguage } = useApp();

  if (!showHeader) return null;

  const languages = [
    { code: 'ar', name: 'العربية', icon: '🇩🇿' },
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'en', name: 'English', icon: '🇺🇸' },
  ];

  return (
    <header className="hidden md:block py-3 px-4 bg-white sticky top-0 inset-x-0 z-50 border-b border-gray-200">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/src/assets/logo.png" alt="GoSIM" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="hidden md:flex items-center space-x-5 font-medium"></div>
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer pr-1 text-xs py-2"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </nav>
    </header>
  );
};
