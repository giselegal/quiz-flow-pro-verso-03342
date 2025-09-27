/**
 * 🎨 THEME TOGGLE COMPONENT
 * 
 * Botão para alternar entre tema escuro e claro
 * Atualizado para usar o ThemeProvider do shadcn/ui
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md'
}) => {
    const { theme, setTheme } = useTheme();

    // Determinar se está no modo claro
    const isLight = theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);

    const toggleTheme = () => {
        setTheme(isLight ? 'dark' : 'light');
    };

    const sizeClasses = {
        sm: 'w-8 h-8 p-1',
        md: 'w-10 h-10 p-2',
        lg: 'w-12 h-12 p-3'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            className={`
                ${sizeClasses[size]} 
                rounded-xl transition-all duration-300 
                ${className}
                bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20
                border-purple-200 dark:border-purple-700
                hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/30 dark:hover:to-blue-800/30
                hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-500/20
                text-purple-700 dark:text-purple-300
            `}
            title={isLight ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
        >
            {isLight ? (
                <Moon className={`${iconSizes[size]} transition-transform hover:rotate-12`} />
            ) : (
                <Sun className={`${iconSizes[size]} transition-transform hover:rotate-45`} />
            )}
        </Button>
    );
};