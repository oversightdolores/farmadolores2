import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

// Define el tipo para tu tema
type ThemeType = typeof lightTheme;

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

type ThemeContextType = {
  theme: typeof lightTheme;
  toggleTheme: () => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  toggleTheme: () => {},
  resetTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(themes.light);

  const saveThemeToStorage = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', theme.dark ? 'dark' : 'light');
    } catch (e) {
      console.error('Error saving theme to storage', e);
    }
  };

  const loadThemeFromStorage = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setTheme(themes.dark);
      } else {
        setTheme(themes.light);
      }
    } catch (e) {
      console.error('Error loading theme from storage', e);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.dark ? themes.light : themes.dark;
    setTheme(newTheme);
    saveThemeToStorage(newTheme);
  };

  const resetTheme = () => {
    setTheme(themes.light);
    AsyncStorage.removeItem('theme');
  };

  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resetTheme }}>
      <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};
