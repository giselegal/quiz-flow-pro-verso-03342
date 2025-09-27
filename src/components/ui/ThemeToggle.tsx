/**
 * 🎨 THEME TOGGLE COMPONENT
 * 
 * Botão para alternar entre tema escuro e claro
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md'
}) => {
    const { theme, toggleTheme, isLight } = useThemeContext();

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
            className={`${sizeClasses[size]} rounded-xl glow-button transition-all duration-300 ${className}`}
            style={{
                background: `linear-gradient(135deg, ${theme.colors.buttons}20, ${theme.colors.detailsMinor}20)`,
                borderColor: `${theme.colors.detailsMinor}50`,
                color: theme.colors.text,
                boxShadow: `0 0 15px ${theme.colors.glowEffect}30`
            }}
            title={isLight ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
        >
            {isLight ? (
                <Moon className={iconSizes[size]} />
            ) : (
                <Sun className={iconSizes[size]} />
            )}
        </Button>
    );
};