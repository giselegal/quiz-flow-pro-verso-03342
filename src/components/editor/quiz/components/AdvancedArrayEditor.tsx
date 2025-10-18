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
        next[idx] = { ...next[idx], [key]: v };
        onChange(next);
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
                                    value={item[field.key] ?? ''}
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
