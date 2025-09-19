import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Theme {
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (typeof parsed === 'object' && parsed !== null && 'isDark' in parsed) {
            return { isDark: Boolean((parsed as Theme).isDark) };
          }
        } catch (error) {
          if (savedTheme === 'dark') {
            return { isDark: true };
          }
          if (savedTheme === 'light') {
            return { isDark: false };
          }
        }
      }
    }

    return { isDark: false };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(theme));
      if (theme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}; 
