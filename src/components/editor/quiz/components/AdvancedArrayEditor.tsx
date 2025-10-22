import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FieldDef {
    key: string;
    label: string;
    type: 'text' | 'number' | 'color' | 'image';
}

interface AdvancedArrayEditorProps {
    value: any[];
    onChange: (value: any[]) => void;
    itemSchema: { fields: FieldDef[] };
}

export const AdvancedArrayEditor: React.FC<AdvancedArrayEditorProps> = ({ value = [], onChange, itemSchema }) => {
    const addItem = () => {
        const empty: any = {};
        itemSchema.fields.forEach(f => {
            empty[f.key] = f.type === 'number' ? 0 : '';
        });
        onChange([...(value || []), empty]);
    };

    const removeItem = (idx: number) => {
        const next = [...(value || [])];
        next.splice(idx, 1);
        onChange(next);
    };

    const updateItem = (idx: number, key: string, v: any) => {
        const next = [...(value || [])];
        const current = { ...next[idx] };
        // Sincronizar aliases canônicos ↔ legacy (text/label, imageUrl/image, points/score)
        current[key] = v;
        if (key === 'text') current['label'] = v;
        if (key === 'label') current['text'] = v;
        if (key === 'imageUrl') current['image'] = v;
        if (key === 'image') current['imageUrl'] = v;
        if (key === 'points') current['score'] = v;
        if (key === 'score') current['points'] = v;
        next[idx] = current;
        onChange(next);
    };

    // Helper para obter valor com fallback de aliases
    const getFieldValue = (item: any, field: FieldDef) => {
        const key = field.key;
        const raw = item?.[key];
        if (raw !== undefined && raw !== null && raw !== '') return raw;
        switch (key) {
            case 'text':
                return item?.label ?? '';
            case 'label':
                return item?.text ?? '';
            case 'imageUrl':
                return item?.image ?? '';
            case 'image':
                return item?.imageUrl ?? '';
            case 'points':
                return typeof item?.score === 'number' ? item.score : '';
            case 'score':
                return typeof item?.points === 'number' ? item.points : '';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-3">
            {(value || []).map((item, idx) => (
                <Card key={item.id || idx} className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {itemSchema.fields.map(field => (
                            <div key={field.key}>
                                <Label className="text-xs">{field.label}</Label>
                                <Input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={getFieldValue(item, field)}
                                    onChange={(e) => updateItem(idx, field.key, field.type === 'number' ? Number(e.target.value || 0) : e.target.value)}
                                    className="text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => removeItem(idx)}>Remover</Button>
                    </div>
                </Card>
            ))}
            <Button size="sm" onClick={addItem}>Adicionar Item</Button>
        </div>
    );
};

export default AdvancedArrayEditor;
