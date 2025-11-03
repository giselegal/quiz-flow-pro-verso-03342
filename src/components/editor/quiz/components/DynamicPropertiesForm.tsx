import React, { useEffect, useMemo, useState } from 'react';
import { appLogger } from '@/utils/logger';
import { getBlockSchema, BasePropertySchema } from '../schema/blockSchema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageUploadField } from './ImageUploadField';
import { SchemaAPI } from '@/config/schemas';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AdvancedArrayEditor from './AdvancedArrayEditor';
import { schemaValidator } from '@/core/schema/SchemaValidator';

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
    const [query, setQuery] = useState('');
    const [validationErrors, setValidationErrors] = useState<Array<{ path: string; message: string }>>([]);
    const legacySchema = getBlockSchema(type);

    useEffect(() => {
        let mounted = true;
        SchemaAPI.get(type).then((s) => {
            if (mounted) setModernSchema(s);
        }).catch(() => setModernSchema(null));
        return () => { mounted = false; };
    }, [type]);

    // 🔒 FASE 9: Validação Zod em tempo real
    useEffect(() => {
        const validation = schemaValidator.validateProperties(type, values);
        if (!validation.valid && validation.errors) {
            setValidationErrors(validation.errors);
        } else {
            setValidationErrors([]);
        }
    }, [type, values]);

    const schema = modernSchema || legacySchema;

    // 🔍 DEBUG: Log para verificar values recebidos
    appLogger.debug('🔍 DynamicPropertiesForm - type:', type);
    appLogger.debug('🔍 DynamicPropertiesForm - values:', values);
    appLogger.debug('🔒 DynamicPropertiesForm - validationErrors:', validationErrors);

    // Agrupamento de propriedades por grupos definidos no schema (com fallback)
    const groups = useMemo(() => {
        if (!schema) return [] as Array<{ id: string; label: string; description?: string; order?: number; properties: BasePropertySchema[] }>;
        const allProps: BasePropertySchema[] = filterActive(schema.properties as BasePropertySchema[], values)
            .filter((p) => {
                if (!query) return true;
                const q = query.toLowerCase();
                const txt = `${p.label || ''} ${p.key || ''}`.toLowerCase();
                return txt.includes(q);
            });

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
    }, [schema, values, query]);
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
            // UX especial: columns do options-grid como controle segmentado (1-4)
            if (type === 'options-grid' && prop.key === 'columns') {
                const current = Number(value ?? prop.default ?? 2);
                return (
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((n) => (
                            <Button
                                key={n}
                                type="button"
                                size="sm"
                                variant={current === n ? 'default' : 'outline'}
                                className="h-8 w-8 p-0"
                                onClick={() => onChange({ [prop.key]: n })}
                                aria-pressed={current === n}
                            >
                                {n}
                            </Button>
                        ))}
                    </div>
                );
            }
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
            const checked = Boolean(value);
            return (
                <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
                    <span className="text-[11px] text-muted-foreground">{prop.description || 'Ativar'}</span>
                    <Switch
                        {...(common as any)}
                        checked={checked}
                        onCheckedChange={(v) => onChange({ [prop.key]: v })}
                    />
                </div>
            );
        }

        if (prop.type === 'select' || prop.type === 'enum') {
            // UX especial: imageSize do options-grid como segmentado
            if (type === 'options-grid' && prop.key === 'imageSize') {
                const opts = (prop.enumValues || (prop as any).options || []) as string[];
                const order = ['small', 'medium', 'large', 'custom'];
                const values = order.filter(v => opts.includes(v));
                const current = String(value ?? prop.default ?? values[0]);
                return (
                    <div className="flex items-center gap-2 flex-wrap">
                        {values.map((v) => (
                            <Button
                                key={v}
                                type="button"
                                size="sm"
                                variant={current === v ? 'default' : 'outline'}
                                className="h-8 px-3 capitalize"
                                onClick={() => onChange({ [prop.key]: v })}
                                aria-pressed={current === v}
                            >
                                {v}
                            </Button>
                        ))}
                    </div>
                );
            }
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
            const arr = Array.isArray(value) ? value : (value && typeof value === 'object' ? Object.values(value as any) : []);
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
                            ],
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
        <div className="space-y-3" data-testid="dynamic-properties-form" data-type={type}>
            {/* 🔒 FASE 9: Alertas de Validação Zod */}
            {validationErrors.length > 0 && (
                <Alert variant="destructive" className="mb-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        <div className="font-semibold mb-1">Erros de validação:</div>
                        <ul className="list-disc list-inside space-y-0.5">
                            {validationErrors.map((error, idx) => (
                                <li key={idx}>
                                    <span className="font-medium">{error.path || 'Campo'}</span>: {error.message}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Busca rápida */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-md border px-2 py-1.5">
                <Input
                    placeholder="Buscar configuração…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-8 text-xs"
                />
            </div>

            <Accordion type="multiple" defaultValue={groups.length ? [groups[0].id] : []} className="space-y-2">
                {groups.filter(g => g.properties.length > 0).map(group => (
                    <AccordionItem key={group.id} value={group.id} className="rounded-md border bg-card">
                        <AccordionTrigger className="px-3 py-2 text-[12px]">
                            <div className="flex flex-col items-start">
                                <span className="font-semibold uppercase tracking-wide text-slate-600">{group.label}</span>
                                {group.description && (
                                    <span className="text-[10px] text-muted-foreground normal-case font-normal">{group.description}</span>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="space-y-3">
                                {group.properties.map((prop: BasePropertySchema) => {
                                    const error = prop.validate ? prop.validate(values[prop.key], values) : null;
                                    const showHelper = !!prop.description;
                                    const isRange = (prop as any).type === 'range';
                                    return (
                                        <div key={prop.key} className={cn('rounded-md border bg-background px-3 py-2', error && 'ring-1 ring-red-400')} data-field-key={prop.key}>
                                            <div className={cn('flex items-center', isRange ? 'justify-between' : 'justify-start')}>
                                                <Label htmlFor={prop.key} className="text-[11px] font-medium">
                                                    {prop.label}{prop.required && <span className="text-red-500">*</span>}
                                                </Label>
                                                {isRange && typeof values[prop.key] === 'number' && (
                                                    <span className="ml-2 text-[11px] text-muted-foreground">{values[prop.key]}</span>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {isRange ? (
                                                    <div className="flex items-center gap-3">
                                                        {renderField(prop)}
                                                        <Input
                                                            type="number"
                                                            className="w-20 h-8 text-xs"
                                                            value={values[prop.key] ?? prop.default ?? ''}
                                                            min={(prop as any).min}
                                                            max={(prop as any).max}
                                                            step={(prop as any).step || 1}
                                                            onChange={(e) => onChange({ [prop.key]: e.target.value === '' ? undefined : Number(e.target.value) })}
                                                        />
                                                    </div>
                                                ) : (
                                                    renderField(prop)
                                                )}
                                            </div>
                                            {showHelper && (
                                                <p className="mt-1 text-[10px] text-muted-foreground">{prop.description}</p>
                                            )}
                                            {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default DynamicPropertiesForm;
