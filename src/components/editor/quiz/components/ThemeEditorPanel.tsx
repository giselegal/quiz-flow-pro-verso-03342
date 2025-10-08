import React, { useEffect, useState } from 'react';
import { useEditorTheme, defaultTokens, DesignTokens } from '@/theme/editorTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const STORAGE_KEY = 'quiz_editor_theme_overrides_v1';

export const ThemeEditorPanel: React.FC<{ onApply?: (tokens: Partial<DesignTokens>) => void; }> = ({ onApply }) => {
    const { tokens } = useEditorTheme();
    const [overrides, setOverrides] = useState<Partial<DesignTokens>>({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setOverrides(JSON.parse(raw));
        } catch {/* ignore */ }
    }, []);

    const update = (group: keyof DesignTokens, key: string, value: string) => {
        setOverrides(prev => ({
            ...prev,
            [group]: { ...(prev as any)[group], [key]: value }
        }));
    };

    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
        onApply?.(overrides);
    };

    const reset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setOverrides({});
        onApply?.({});
    };

    const merged = {
        colors: { ...tokens.colors, ...(overrides.colors || {}) },
        spacing: { ...tokens.spacing, ...(overrides.spacing || {}) },
        radius: { ...tokens.radius, ...(overrides.radius || {}) },
        fontScale: { ...tokens.fontScale, ...(overrides.fontScale || {}) }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between">
                <h3 className="text-sm font-semibold">Tema</h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={reset} className="h-7 text-xs">Reset</Button>
                    <Button size="sm" onClick={save} className="h-7 text-xs">Aplicar</Button>
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-6">
                    <section>
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Cores</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(merged.colors).map(([k, v]) => (
                                <label key={k} className="flex flex-col gap-1 text-[10px] font-medium">
                                    <span>{k}</span>
                                    <Input
                                        type="color"
                                        value={v}
                                        onChange={e => update('colors', k, e.target.value)}
                                        className="h-7 p-1"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Espaçamento</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(merged.spacing).map(([k, v]) => (
                                <label key={k} className="flex flex-col gap-1 text-[10px] font-medium">
                                    <span>{k}</span>
                                    <Input
                                        value={v}
                                        onChange={e => update('spacing', k, e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Radius</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(merged.radius).map(([k, v]) => (
                                <label key={k} className="flex flex-col gap-1 text-[10px] font-medium">
                                    <span>{k}</span>
                                    <Input
                                        value={v}
                                        onChange={e => update('radius', k, e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Font Scale</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(merged.fontScale).map(([k, v]) => (
                                <label key={k} className="flex flex-col gap-1 text-[10px] font-medium">
                                    <span>{k}</span>
                                    <Input
                                        value={v}
                                        onChange={e => update('fontScale', k, e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ThemeEditorPanel;
