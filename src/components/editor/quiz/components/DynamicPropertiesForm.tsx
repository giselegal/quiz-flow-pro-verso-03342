
import React, { useEffect, useMemo, useState } from 'react';
import { getBlockSchema, BasePropertySchema } from '../schema/blockSchema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageUploadField } from './ImageUploadField';
import { SchemaAPI } from '@/config/schemas';
import { Slider } from '@/components/ui/slider';
import AdvancedArrayEditor from './AdvancedArrayEditor';

export interface DynamicPropertiesFormProps {
    type: string;
    values: Record<string, any>; // union de properties + content (primeira versão simplificada)
    onChange: (patch: Record<string, any>) => void;
    mode?: 'all' | 'content' | 'style' | 'logic';
}

// Helper para extrair propriedades ativas (when)
function filterActive(props: BasePropertySchema[], values: Record<string, any>) {
    return props.filter((p: BasePropertySchema) => !p.when || p.when(values));
}

export const DynamicPropertiesForm: React.FC<DynamicPropertiesFormProps> = ({ type, values, onChange }) => {
    const [modernSchema, setModernSchema] = useState<any | null>(null);
    const legacySchema = getBlockSchema(type);

    useEffect(() => {
        let mounted = true;
        SchemaAPI.get(type).then((s) => {
            if (mounted) setModernSchema(s);
        }).catch(() => setModernSchema(null));
        return () => { mounted = false; };
    }, [type]);

    const schema = modernSchema || legacySchema;

    // 🔍 DEBUG: Log para verificar values recebidos
    console.log('🔍 DynamicPropertiesForm - type:', type);
    console.log('🔍 DynamicPropertiesForm - values:', values);

    // Agrupamento de propriedades por grupos definidos no schema (com fallback)
    const groups = useMemo(() => {
        if (!schema) return [] as Array<{ id: string; label: string; description?: string; order?: number; properties: BasePropertySchema[] }>;
        const allProps: BasePropertySchema[] = filterActive(schema.properties as BasePropertySchema[], values);

        // Quando há groups definidos no schema, respeitar a ordem/descrição
        if (schema.groups && Array.isArray(schema.groups) && schema.groups.length > 0) {
            const map = new Map<string, { id: string; label: string; description?: string; order?: number; properties: BasePropertySchema[] }>();
            schema.groups.forEach((g: any, index: number) => {
                map.set(g.id, { id: g.id, label: g.label, description: g.description, order: g.order ?? index, properties: [] });
            });
            const firstId = schema.groups[0].id;
            allProps.forEach((p) => {
                const gid = (p as any).group && map.has((p as any).group) ? (p as any).group : firstId;
                map.get(gid)!.properties.push(p);
            });
            return Array.from(map.values()).filter(g => g.properties.length > 0).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        // Fallback: agrupar por p.group dinamicamente ou em "default"
        const dynamicMap = new Map<string, { id: string; label: string; description?: string; order?: number; properties: BasePropertySchema[] }>();
        allProps.forEach((p) => {
            const gid = ((p as any).group as string) || 'default';
            if (!dynamicMap.has(gid)) dynamicMap.set(gid, { id: gid, label: gid === 'default' ? 'Propriedades' : gid, properties: [] });
            dynamicMap.get(gid)!.properties.push(p);
        });
        return Array.from(dynamicMap.values());
    }, [schema, values]);
    const renderField = (prop: BasePropertySchema) => {
        const value = values[prop.key] ?? prop.default ?? '';
        const common = { id: prop.key, name: prop.key } as const;

        // ✅ Detectar campos de imagem e usar ImageUploadField
        const isImageField =
            prop.key === 'src' ||
            prop.key.toLowerCase().includes('image') ||
            prop.key.toLowerCase().includes('logo') ||
            // Campo cujo label indique explicitamente imagem (não qualquer URL genérica)
            (!!prop.label && /imagem|image/i.test(prop.label)) ||
            // Caso especial: chave 'url' com label indicando imagem
            (prop.key.toLowerCase() === 'url' && !!prop.label && /imagem|image/i.test(prop.label));

        if (isImageField && prop.type === 'string') {
            return (
                <ImageUploadField
                    value={value}
                    onChange={(url) => onChange({ [prop.key]: url })}
                    placeholder={prop.placeholder || `URL para ${prop.label}`}
                />
            );
        }

        // Suporte a tipos legacy ('text' e 'textarea') além dos novos ('string' e 'richtext')
        const isStringType = prop.type === 'string' || (prop as any).type === 'text';
        const isRichTextType = prop.type === 'richtext' || (prop as any).type === 'textarea';
        if (isStringType || isRichTextType) {
            if ((value?.length || 0) > 80 || isRichTextType) {
                return (
                    <Textarea
                        {...common}
                        rows={isRichTextType ? 4 : 2}
                        value={value}
                        onChange={e => onChange({ [prop.key]: e.target.value })}
                    />
                );
            }
            return (
                <Input
                    {...common}
                    type={(prop as any).inputType || 'text'}
                    value={value}
                    onChange={e => onChange({ [prop.key]: e.target.value })}
                    {...(((prop as any).pattern && typeof (prop as any).pattern === 'string') ? { pattern: (prop as any).pattern } : {})}
                />
            );
        }

        if (prop.type === 'number') {
            return (
                <Input
                    type={(prop as any).inputType === 'number' ? 'number' : 'number'}
                    {...common}
                    value={value}
                    min={prop.min}
                    max={prop.max}
                    step={prop.step || 1}
                    onChange={e => onChange({ [prop.key]: e.target.value === '' ? undefined : Number(e.target.value) })}
                />
            );
        }

        if (prop.type === 'range') {
            const min = typeof prop.min === 'number' ? prop.min : 0;
            const max = typeof prop.max === 'number' ? prop.max : 100;
            const step = typeof prop.step === 'number' ? prop.step : 1;
            const current = typeof value === 'number' ? value : (typeof prop.default === 'number' ? (prop.default as number) : min);
            return (
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{min}</span>
                        <span className="font-medium text-slate-700">{current}</span>
                        <span>{max}</span>
                    </div>
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={[current]}
                        onValueChange={(vals) => {
                            const v = Array.isArray(vals) ? vals[0] : current;
                            onChange({ [prop.key]: v });
                        }}
                    />
                </div>
            );
        }

        if (prop.type === 'color') {
            const normalizeColor = (color: string): string => {
                if (!color) return '#000000';
                if (color.startsWith('#') && (color.length === 9 || color.length === 8)) {
                    return color.substring(0, 7);
                }
                return color;
            };
            return (
                <Input
                    type="color"
                    {...common}
                    value={normalizeColor(value)}
                    onChange={e => onChange({ [prop.key]: e.target.value })}
                />
            );
        }

        if (prop.type === 'boolean') {
            return (
                <input
                    type="checkbox"
                    {...common}
                    checked={Boolean(value)}
                    onChange={e => onChange({ [prop.key]: e.target.checked })}
                    className="rounded border-gray-300"
                />
            );
        }

        if (prop.type === 'select' || prop.type === 'enum') {
            return (
                <select
                    {...common}
                    className="w-full border rounded-md p-2 text-sm"
                    value={value}
                    onChange={e => onChange({ [prop.key]: e.target.value })}
                >
                    {((prop.enumValues || (prop as any).options || []) as string[]).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        if (prop.type === 'options-list') {
            const arr = Array.isArray(value) ? value : [];
            // Se existir um itemSchema no prop, usar AdvancedArrayEditor genérico
            if ((prop as any).itemSchema && (prop as any).itemSchema.fields) {
                return (
                    <AdvancedArrayEditor
                        value={arr}
                        onChange={(newValue) => onChange({ [prop.key]: newValue })}
                        itemSchema={(prop as any).itemSchema}
                    />
                );
            }
            if (type === 'options-grid' && prop.key === 'options') {
                return (
                    <AdvancedArrayEditor
                        value={arr}
                        onChange={(newValue) => onChange({ [prop.key]: newValue })}
                        itemSchema={{
                            fields: [
                                { key: 'text', label: 'Texto', type: 'text' },
                                { key: 'imageUrl', label: 'Imagem', type: 'text' },
                                { key: 'points', label: 'Pontos', type: 'number' },
                                { key: 'category', label: 'Categoria', type: 'text' },
                            ]
                        }}
                    />
                );
            }
            // Fallback simples para outros cases
            return (
                <div className="space-y-2">
                    {arr.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="border rounded-md p-3 bg-slate-50 space-y-2">
                            <Input
                                placeholder="Item"
                                value={item.text || item.label || ''}
                                onChange={e => {
                                    const next = [...arr];
                                    next[idx] = { ...next[idx], text: e.target.value };
                                    onChange({ [prop.key]: next });
                                }}
                                className="text-sm"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => onChange({ [prop.key]: [...arr, { text: '' }] })}
                        className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300"
                    >
                        Adicionar item
                    </button>
                </div>
            );
        }

        return <div className="text-[10px] italic text-muted-foreground">Tipo não suportado</div>;
    };

    return (
        <div className="space-y-6">
            {groups.map(group => (
                <div key={group.id}>
                    <div className="mb-2">
                        <h4 className="text-xs font-semibold uppercase text-slate-600 tracking-wide">{group.label}</h4>
                        {group.description && (
                            <p className="text-[10px] text-muted-foreground leading-snug">{group.description}</p>
                        )}
                    </div>
                    <div className="space-y-4">
                        {group.properties.map((prop: BasePropertySchema) => {
                            const error = prop.validate ? prop.validate(values[prop.key], values) : null;
                            return (
                                <div key={prop.key} className={cn('space-y-1', error && 'animate-pulse')}>
                                    <Label htmlFor={prop.key} className="text-[11px] font-medium flex items-center gap-1">
                                        {prop.label}
                                        {prop.required && <span className="text-red-500">*</span>}
                                    </Label>
                                    {renderField(prop)}
                                    {error && <p className="text-[10px] text-red-500">{error}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DynamicPropertiesForm;
