import React, { useMemo } from 'react';
import { getBlockSchema, BasePropertySchema } from '../schema/blockSchema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageUploadField } from './ImageUploadField';

export interface DynamicPropertiesFormProps {
    type: string;
    values: Record<string, any>; // union de properties + content (primeira versão simplificada)
    onChange: (patch: Record<string, any>) => void;
    mode?: 'all' | 'content' | 'style' | 'logic';
}

// Helper para extrair propriedades ativas (when)
function filterActive(props: BasePropertySchema[], values: Record<string, any>) {
    return props.filter(p => !p.when || p.when(values));
}

export const DynamicPropertiesForm: React.FC<DynamicPropertiesFormProps> = ({ type, values, onChange }) => {
    const schema = getBlockSchema(type);

    // 🔍 DEBUG: Log para verificar values recebidos
    console.log('🔍 DynamicPropertiesForm - type:', type);
    console.log('🔍 DynamicPropertiesForm - values:', values);
    console.log('🔍 DynamicPropertiesForm - values.options:', values.options);

    const groups = useMemo(() => {
        if (!schema) return [];
        const ordered = [...(schema.groups || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
        return ordered.map(g => ({
            ...g,
            properties: filterActive(schema.properties.filter(p => p.group === g.id), values)
        })).filter(g => g.properties.length > 0);
    }, [schema, values]);

    if (!schema) {
        return <div className="text-xs text-muted-foreground">Sem schema para este bloco.</div>;
    }

    const renderField = (prop: BasePropertySchema) => {
        const value = values[prop.key] ?? prop.default ?? '';
        const common = { id: prop.key, name: prop.key } as const;

        // ✅ Detectar campos de imagem e usar ImageUploadField
        const isImageField =
            prop.key === 'src' ||
            prop.key.toLowerCase().includes('image') ||
            prop.key.toLowerCase().includes('logo') ||
            (prop.label?.toLowerCase().includes('imagem') || prop.label?.toLowerCase().includes('url')) &&
            prop.type === 'string';

        if (isImageField && prop.type === 'string') {
            return (
                <ImageUploadField
                    value={value}
                    onChange={(url) => onChange({ [prop.key]: url })}
                    placeholder={prop.placeholder || `URL para ${prop.label}`}
                />
            );
        }

        if (prop.type === 'string' || prop.type === 'richtext') {
            if ((value?.length || 0) > 80 || prop.type === 'richtext') {
                return (
                    <Textarea
                        {...common}
                        rows={prop.type === 'richtext' ? 4 : 2}
                        value={value}
                        onChange={e => onChange({ [prop.key]: e.target.value })}
                    />
                );
            }
            return (
                <Input
                    {...common}
                    value={value}
                    onChange={e => onChange({ [prop.key]: e.target.value })}
                />
            );
        }

        if (prop.type === 'number') {
            return (
                <Input
                    type="number"
                    {...common}
                    value={value}
                    min={prop.min}
                    max={prop.max}
                    step={prop.step || 1}
                    onChange={e => onChange({ [prop.key]: e.target.value === '' ? undefined : Number(e.target.value) })}
                />
            );
        }

        if (prop.type === 'color') {
            // Normalizar cor para formato #rrggbb (remover canal alpha se presente)
            const normalizeColor = (color: string): string => {
                if (!color) return '#000000';
                // Se a cor tiver 8 ou 9 caracteres (#rrggbbaa), remover os últimos 2
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
                    {(prop.enumValues || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        if (prop.type === 'options-list') {
            const arr = Array.isArray(value) ? value : [];
            return (
                <div className="space-y-2">
                    {arr.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="border rounded-md p-3 bg-slate-50 space-y-2">
                            <div className="flex items-start gap-2">
                                <div className="flex-1 space-y-2">
                                    {/* Texto da opção */}
                                    <Input
                                        placeholder="Texto da opção"
                                        value={item.text || ''}
                                        onChange={e => {
                                            const next = [...arr];
                                            next[idx] = { ...next[idx], text: e.target.value };
                                            onChange({ [prop.key]: next });
                                        }}
                                        className="text-sm"
                                    />

                                    {/* Upload de imagem com preview */}
                                    <ImageUploadField
                                        value={item.imageUrl || ''}
                                        onChange={(url) => {
                                            const next = [...arr];
                                            next[idx] = { ...next[idx], imageUrl: url };
                                            onChange({ [prop.key]: next });
                                        }}
                                        placeholder="URL da imagem"
                                    />

                                    {/* Pontuação e Categoria */}
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Pontos"
                                            value={item.points ?? item.score ?? ''}
                                            onChange={e => {
                                                const next = [...arr];
                                                next[idx] = { ...next[idx], points: parseInt(e.target.value) || 0 };
                                                onChange({ [prop.key]: next });
                                            }}
                                            className="text-xs w-20"
                                        />
                                        <Input
                                            placeholder="Categoria"
                                            value={item.category || ''}
                                            onChange={e => {
                                                const next = [...arr];
                                                next[idx] = { ...next[idx], category: e.target.value };
                                                onChange({ [prop.key]: next });
                                            }}
                                            className="text-xs flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Botão remover */}
                                <button
                                    type="button"
                                    className="text-xs px-2 py-1 border rounded hover:bg-red-50 hover:text-red-600 mt-1"
                                    onClick={() => {
                                        const next = arr.filter((_: any, i: number) => i !== idx);
                                        onChange({ [prop.key]: next });
                                    }}
                                    title="Remover opção"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-xs px-3 py-2 border rounded hover:bg-blue-50 w-full font-medium"
                        onClick={() => {
                            const next = [...arr, {
                                id: `opt-${Date.now()}`,
                                text: 'Nova opção',
                                imageUrl: '',
                                points: 0,
                                score: 0,
                                category: ''
                            }];
                            onChange({ [prop.key]: next });
                        }}
                    >
                        ➕ Adicionar Opção
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
                        {group.properties.map(prop => {
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
