import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
    isDarkTheme: boolean;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    isDarkTheme: false,
    toggleTheme: () => {},
});

interface ThemeContextProviderProps {
    children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkTheme(prev => !prev);
    };

    useEffect(() => {
        if (isDarkTheme) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }, [isDarkTheme]);   

return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};