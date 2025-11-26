import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/core/hooks/useEditorContext';

interface ThemeToggleProps {
    size?: 'sm' | 'default' | 'lg';
    variant?: 'outline' | 'ghost' | 'default';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    size = 'default',
    variant = 'outline',
}) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            onClick={toggleTheme}
            variant={variant}
            size={size}
            className="backdrop-blur-sm shadow-sm"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
    );
};

export default ThemeToggle;
