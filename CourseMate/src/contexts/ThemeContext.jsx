import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');

  const themes = {
    red: {
      primary: 'bg-red-600',
      primaryHover: 'hover:bg-red-700',
      primaryText: 'text-red-600',
      primaryBg: 'bg-red-50',
      primaryBorder: 'border-red-200',
      primaryShadow: 'shadow-red-200',
      gradient: 'from-red-50 to-red-100'
    },
    orange: {
      primary: 'bg-orange-600',
      primaryHover: 'hover:bg-orange-700',
      primaryText: 'text-orange-600',
      primaryBg: 'bg-orange-50',
      primaryBorder: 'border-orange-200',
      primaryShadow: 'shadow-orange-200',
      gradient: 'from-orange-50 to-orange-100'
    },
    yellow: {
      primary: 'bg-yellow-600',
      primaryHover: 'hover:bg-yellow-700',
      primaryText: 'text-yellow-600',
      primaryBg: 'bg-yellow-50',
      primaryBorder: 'border-yellow-200',
      primaryShadow: 'shadow-yellow-200',
      gradient: 'from-yellow-50 to-yellow-100'
    },
    green: {
      primary: 'bg-green-600',
      primaryHover: 'hover:bg-green-700',
      primaryText: 'text-green-600',
      primaryBg: 'bg-green-50',
      primaryBorder: 'border-green-200',
      primaryShadow: 'shadow-green-200',
      gradient: 'from-green-50 to-green-100'
    },
    cyan: {
      primary: 'bg-cyan-600',
      primaryHover: 'hover:bg-cyan-700',
      primaryText: 'text-cyan-600',
      primaryBg: 'bg-cyan-50',
      primaryBorder: 'border-cyan-200',
      primaryShadow: 'shadow-cyan-200',
      gradient: 'from-cyan-50 to-cyan-100'
    },
    blue: {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      primaryText: 'text-blue-600',
      primaryBg: 'bg-blue-50',
      primaryBorder: 'border-blue-200',
      primaryShadow: 'shadow-blue-200',
      gradient: 'from-blue-50 to-blue-100'
    },
    purple: {
      primary: 'bg-purple-600',
      primaryHover: 'hover:bg-purple-700',
      primaryText: 'text-purple-600',
      primaryBg: 'bg-purple-50',
      primaryBorder: 'border-purple-200',
      primaryShadow: 'shadow-purple-200',
      gradient: 'from-purple-50 to-purple-100'
    },
    pink: {
      primary: 'bg-pink-600',
      primaryHover: 'hover:bg-pink-700',
      primaryText: 'text-pink-600',
      primaryBg: 'bg-pink-50',
      primaryBorder: 'border-pink-200',
      primaryShadow: 'shadow-pink-200',
      gradient: 'from-pink-50 to-pink-100'
    },
    gray: {
      primary: 'bg-gray-600',
      primaryHover: 'hover:bg-gray-700',
      primaryText: 'text-gray-600',
      primaryBg: 'bg-gray-50',
      primaryBorder: 'border-gray-200',
      primaryShadow: 'shadow-gray-200',
      gradient: 'from-gray-50 to-gray-100'
    },
    black: {
      primary: 'bg-black',
      primaryHover: 'hover:bg-gray-800',
      primaryText: 'text-black',
      primaryBg: 'bg-gray-50',
      primaryBorder: 'border-gray-300',
      primaryShadow: 'shadow-gray-300',
      gradient: 'from-gray-50 to-gray-100'
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    changeTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
