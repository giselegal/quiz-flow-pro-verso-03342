/**
 * 🎨 THEME TOGGLE COMPONENT
 * 
 * Botão para alternar entre tema escuro e claro
 * Usa o SuperUnifiedProvider para gerenciamento de tema
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useSuperUnified } from '@/providers/SuperUnifiedProvider';

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md'
}) => {
    const { state, setTheme } = useSuperUnified();
    const isLight = state.theme.theme === 'light';
    
    const toggleTheme = () => {
        setTheme(isLight ? 'dark' : 'light');
    };
    
    // Theme colors for styling
    const themeColors = {
        buttons: state.theme.primaryColor,
        detailsMinor: state.theme.secondaryColor,
        text: isLight ? '#1F2937' : '#F3F4F6',
        glowEffect: state.theme.primaryColor
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
            `}
            style={{
                background: `linear-gradient(135deg, ${themeColors.buttons}20, ${themeColors.detailsMinor}20)`,
                borderColor: `${themeColors.detailsMinor}50`,
                color: themeColors.text,
                boxShadow: `0 0 15px ${themeColors.glowEffect}30`
            }}
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