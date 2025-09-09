import React, { useState } from 'react';
import { useQuizTheme, QUIZ_THEMES, QuizTheme } from '@/components/editor/interactive/styles/QuizThemes';
import { HexColorPicker } from 'react-colorful';

interface ThemeSelectorProps {
    currentTheme: QuizTheme;
    onThemeChange: (theme: QuizTheme) => void;
    onCustomColorChange?: (property: string, color: string) => void;
}

export const EditorThemeSelector: React.FC<ThemeSelectorProps> = ({
    currentTheme,
    onThemeChange,
    onCustomColorChange
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColorProperty, setSelectedColorProperty] = useState<string>('');
    const [customColor, setCustomColor] = useState('#000000');

    const { theme } = useQuizTheme(currentTheme);

    const handleColorChange = (color: string) => {
        setCustomColor(color);
        if (onCustomColorChange && selectedColorProperty) {
            onCustomColorChange(selectedColorProperty, color);
        }
    };

    return (
        <div className="p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700/30">
            {/* Título */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-full"></div>
                <h3 className="text-gray-200 font-medium text-sm">
                    Theme Settings
                </h3>
            </div>

            {/* Seletor de Tema Predefinido */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Template Theme
                </label>
                <select
                    value={currentTheme}
                    onChange={(e) => onThemeChange(e.target.value as QuizTheme)}
                    className="w-full p-2 bg-gray-800/80 text-gray-200 rounded border border-gray-600/50 
                     focus:border-brand-brightBlue/50 focus:ring-1 focus:ring-brand-brightBlue/20 text-sm"
                >
                    {Object.entries(QUIZ_THEMES).map(([key, config]) => (
                        <option key={key} value={key} className="bg-gray-800 text-gray-200">
                            {config.name} - {config.description}
                        </option>
                    ))}
                </select>
            </div>

            {/* Preview das Cores */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Color Palette
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {Object.entries(theme.colors).map(([name, colorClass]) => (
                        <button
                            key={name}
                            onClick={() => {
                                setSelectedColorProperty(name);
                                setShowColorPicker(true);
                            }}
                            className="group relative"
                            title={`Customize ${name}`}
                        >
                            <div className={`w-7 h-7 rounded border border-gray-600/50 ${colorClass} 
                              group-hover:scale-105 transition-transform cursor-pointer`}>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-brightBlue 
                               rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 block mt-1 truncate">
                                {name.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Picker Modal */}
            {showColorPicker && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700/50 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-gray-200 font-medium text-sm">
                                Customize {selectedColorProperty}
                            </h4>
                            <button
                                onClick={() => setShowColorPicker(false)}
                                className="text-gray-400 hover:text-gray-200 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <HexColorPicker color={customColor} onChange={handleColorChange} />

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setShowColorPicker(false)}
                                className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded text-sm hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleColorChange(customColor);
                                    setShowColorPicker(false);
                                }}
                                className="px-3 py-1.5 bg-brand-brightBlue text-white rounded text-sm hover:opacity-80"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Área de Preview */}
            <div className="mt-4">
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Theme Preview
                </label>
                <div className={`p-3 rounded border border-gray-700/30 ${theme.colors.background}`}>
                    <div className={`${theme.colors.surface} p-3 ${theme.borderRadius} ${theme.shadows}`}>
                        <h4 className={`${theme.colors.text} font-medium mb-2 text-sm`}>
                            Sample Title
                        </h4>
                        <p className={`${theme.colors.textSecondary} text-xs mb-3`}>
                            Preview how the theme will look in your template.
                        </p>
                        <button className={`px-3 py-1.5 ${theme.colors.primary} ${theme.colors.primaryHover} 
                               text-white ${theme.borderRadius} ${theme.animations} text-xs`}>
                            Sample Button
                        </button>
                    </div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => onThemeChange('default')}
                    className="flex-1 px-3 py-1.5 bg-gray-800/80 text-gray-300 rounded text-xs hover:bg-gray-700/80 border border-gray-600/30"
                >
                    Reset
                </button>
                <button
                    className="flex-1 px-3 py-1.5 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white rounded text-xs hover:opacity-80"
                >
                    Save Preset
                </button>
            </div>
        </div>
    );
};

// Hook para usar o seletor de temas
export const useEditorTheme = () => {
    const [currentTheme, setCurrentTheme] = useState<QuizTheme>('default');
    const [customColors, setCustomColors] = useState<Record<string, string>>({});

    const updateTheme = (theme: QuizTheme) => {
        setCurrentTheme(theme);
    };

    const updateCustomColor = (property: string, color: string) => {
        setCustomColors(prev => ({
            ...prev,
            [property]: color
        }));
    };

    const applyThemeToElement = (element: HTMLElement) => {
        const themeConfig = QUIZ_THEMES[currentTheme];

        // Aplicar cores customizadas se existirem
        Object.entries(customColors).forEach(([property, color]) => {
            element.style.setProperty(`--theme-${property}`, color);
        });

        // Aplicar tema base
        element.style.setProperty('--theme-primary', themeConfig.colors.primary);
        element.style.setProperty('--theme-background', themeConfig.colors.background);
        // ... outras propriedades
    };

    return {
        currentTheme,
        customColors,
        updateTheme,
        updateCustomColor,
        applyThemeToElement,
    };
};
