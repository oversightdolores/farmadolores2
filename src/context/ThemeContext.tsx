// ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';

const themes = {
  light: DefaultTheme,
  dark: DarkTheme,
};

const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === themes.light ? themes.dark : themes.light));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
