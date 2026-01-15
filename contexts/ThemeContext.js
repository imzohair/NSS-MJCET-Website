'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Patriotic mode is now permanent and ONLY for light theme
        const shouldShowPatriotic = savedTheme === 'light';
        document.documentElement.setAttribute('data-patriotic', shouldShowPatriotic);

        if (savedTheme === 'dark') {
            document.body.classList.add('marvelous-theme');
        } else {
            document.body.classList.remove('marvelous-theme');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        // Update patriotic visibility - permanently on for light, off for dark
        const shouldShowPatriotic = newTheme === 'light';
        document.documentElement.setAttribute('data-patriotic', shouldShowPatriotic);

        if (newTheme === 'dark') {
            document.body.classList.add('marvelous-theme');
        } else {
            document.body.classList.remove('marvelous-theme');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
