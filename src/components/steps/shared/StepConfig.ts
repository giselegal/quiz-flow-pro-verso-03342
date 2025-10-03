/**
 * ⚙️ CONFIGURAÇÕES COMPARTILHADAS ENTRE STEPS
 * 
 * Configurações que podem ser reutilizadas por múltiplos steps.
 */

// Cores padrão do sistema
export const STEP_COLORS = {
    primary: '#B89B7A',
    secondary: '#432818',
    accent: '#A1835D',
    background: '#FAF9F7',
    text: '#432818',
    textLight: '#6B4F43',
    border: '#E5DDD5',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
} as const;

// Fontes do sistema
export const STEP_FONTS = {
    primary: '"Playfair Display", serif',
    secondary: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace'
} as const;

// Breakpoints responsivos
export const STEP_BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
} as const;

// Durações de animação
export const STEP_ANIMATIONS = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
} as const;

// Classes CSS compartilhadas
export const STEP_CLASSES = {
    container: 'min-h-screen bg-gradient-to-b from-white to-gray-50',
    section: 'w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto',
    button: 'w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
    input: 'w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
    label: 'block text-xs font-semibold text-[#432818] mb-1.5'
} as const;

// Configuração padrão para todos os steps
export const DEFAULT_STEP_CONFIG = {
    colors: STEP_COLORS,
    fonts: STEP_FONTS,
    animations: STEP_ANIMATIONS,
    classes: STEP_CLASSES
} as const;
