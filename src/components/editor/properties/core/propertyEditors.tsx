import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import React from 'react';
import type { PropertyEditorProps, PropertyEditorRegistry } from './types';

// Editor de texto básico
const TextEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
    />
    {(property as any).description ? (
      <p className="text-xs text-muted-foreground">{(property as any).description}</p>
    ) : null}
  </div>
);

// Editor de área de texto
const TextareaEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Textarea
      id={property.key}
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
    />
    {(property as any).description ? (
      <p className="text-xs text-muted-foreground">{(property as any).description}</p>
    ) : null}
  </div>
);

// Editor de cor
const ColorEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <ColorPicker
      value={property.value || '#000000'}
      onChange={color => onChange(property.key, color)}
    />
    {(property as any).description ? (
      <p className="text-xs text-muted-foreground">{(property as any).description}</p>
    ) : null}
  </div>
);

// Editor de número com slider
const NumberEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Slider
      id={property.key}
      value={[property.value || 0]}
      onValueChange={([value]) => onChange(property.key, value)}
      min={0}
      max={100}
      step={1}
    />
  </div>
);

// Editor de switch/toggle
const SwitchEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="flex items-center justify-between">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Switch
      id={property.key}
      checked={property.value || false}
      onCheckedChange={checked => onChange(property.key, checked)}
    />
  </div>
);

// Editor de intervalo (range) com suporte a min/max/step
const RangeEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  const min = (property as any).min ?? 0;
  const max = (property as any).max ?? 100;
  const step = (property as any).step ?? 1;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={property.key}>{property.label}</Label>
        <span className="text-xs text-muted-foreground">{property.value ?? min}</span>
      </div>
      <Slider
        id={property.key}
        value={[Number(property.value ?? min)]}
        onValueChange={([value]) => onChange(property.key, value)}
        min={min}
        max={max}
        step={step}
      />
      {(property as any).description ? (
        <p className="text-xs text-muted-foreground">{(property as any).description}</p>
      ) : null}
    </div>
  );
};

// Editor de seleção (select)
const SelectEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Select
      value={String(property.value ?? '')}
      onValueChange={val => onChange(property.key, val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecionar" />
      </SelectTrigger>
      <SelectContent>
        {(property as any).options?.map((opt: any) => (
          <SelectItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label ?? String(opt.value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {(property as any).description ? (
      <p className="text-xs text-muted-foreground">{(property as any).description}</p>
    ) : null}
  </div>
);

// Editor de URL (string)
const UrlEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      type="url"
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
      placeholder="https://..."
    />
    {(property as any).description ? (
      <p className="text-xs text-muted-foreground">{(property as any).description}</p>
    ) : null}
  </div>
);

// Editor especializado para listas de opções (label/value/points/category/keyword)
const OptionsArrayEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  const options: any[] = Array.isArray(property.value) ? property.value : [];
  const update = (next: any[]) => onChange(property.key, next);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{property.label}</Label>
        <Button
          type="button"
          className="h-8 px-2"
          onClick={() =>
            update([
              ...options,
              { label: 'Nova opção', value: `opt_${options.length + 1}`, points: 0, category: '', keyword: '' },
            ])
          }
        >
          + Adicionar
        </Button>
      </div>
      <div className="space-y-3">
        {options.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nenhuma opção. Clique em "Adicionar".</div>
        ) : (
          options.map((opt, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3">
                <Label className="text-xs">Label</Label>
                <Input
                  value={opt.label ?? ''}
                  onChange={e => {
                    const next = [...options];
                    next[idx] = { ...opt, label: e.target.value };
                    update(next);
                  }}
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Valor</Label>
                <Input
                  value={opt.value ?? ''}
                  onChange={e => {
                    const next = [...options];
                    next[idx] = { ...opt, value: e.target.value };
                    update(next);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Pts</Label>
                <Input
                  type="number"
                  value={Number(opt.points ?? 0)}
                  onChange={e => {
                    const next = [...options];
                    next[idx] = { ...opt, points: Number(e.target.value) || 0 };
                    update(next);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Categoria</Label>
                <Input
                  value={opt.category ?? ''}
                  onChange={e => {
                    const next = [...options];
                    next[idx] = { ...opt, category: e.target.value };
                    update(next);
                  }}
                />
              </div>
              <div className="col-span-1">
                <Label className="text-xs">Keyword</Label>
                <Input
                  value={opt.keyword ?? ''}
                  onChange={e => {
                    const next = [...options];
                    next[idx] = { ...opt, keyword: e.target.value };
                    update(next);
                  }}
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  className="h-9 px-2 text-sm text-red-600"
                  onClick={() => update(options.filter((_, i) => i !== idx))}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Editor genérico de Array via JSON (fallback)
const ArrayJsonEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label} (JSON)</Label>
    <Textarea
      id={property.key}
      defaultValue={JSON.stringify(property.value ?? [], null, 2)}
      onBlur={e => {
        try {
          const parsed = JSON.parse(e.target.value || '[]');
          onChange(property.key, parsed);
        } catch {
          // ignore invalid JSON
        }
      }}
      className="font-mono text-xs min-h-[120px]"
    />
  </div>
);

// Dispatcher para arrays
const ArrayEditor: React.FC<PropertyEditorProps> = props => {
  if (props.property.key === 'options') return <OptionsArrayEditor {...props} />;
  return <ArrayJsonEditor {...props} />;
};

// Editor de upload simples (URL ou arquivo -> por ora só URL para evitar dependências)
const UploadEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      type="url"
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
      placeholder="Cole a URL da mídia..."
    />
  </div>
);

// Object/JSON/Rich editors simples
const ObjectEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label} (Objeto JSON)</Label>
    <Textarea
      id={property.key}
      defaultValue={JSON.stringify(property.value ?? {}, null, 2)}
      onBlur={e => {
        try {
          const parsed = JSON.parse(e.target.value || '{}');
          onChange(property.key, parsed);
        } catch {}
      }}
      className="font-mono text-xs min-h-[120px]"
    />
  </div>
);

const JsonEditor: React.FC<PropertyEditorProps> = ObjectEditor;

const EmailEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      type="email"
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
      placeholder="nome@exemplo.com"
    />
  </div>
);

const PhoneEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      type="tel"
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
      placeholder="(99) 99999-9999"
    />
  </div>
);

const DateEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      type="date"
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
    />
  </div>
);

const TimeEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input id={property.key} type="time" value={property.value || ''} onChange={e => onChange(property.key, e.target.value)} />
  </div>
);

const DatetimeEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input id={property.key} type="datetime-local" value={property.value || ''} onChange={e => onChange(property.key, e.target.value)} />
  </div>
);

const RichTextEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Textarea id={property.key} value={property.value || ''} onChange={e => onChange(property.key, e.target.value)} className="min-h-[140px]" />
  </div>
);

const MarkdownEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label} (Markdown)</Label>
    <Textarea id={property.key} value={property.value || ''} onChange={e => onChange(property.key, e.target.value)} className="min-h-[140px] font-mono text-xs" />
  </div>
);

const CodeEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label} (Code)</Label>
    <Textarea id={property.key} value={property.value || ''} onChange={e => onChange(property.key, e.target.value)} className="min-h-[140px] font-mono text-xs" />
  </div>
);

// Registro de editores
export const propertyEditors: PropertyEditorRegistry = {
  text: TextEditor,
  textarea: TextareaEditor,
  color: ColorEditor,
  number: NumberEditor,
  switch: SwitchEditor,
  range: RangeEditor,
  select: SelectEditor,
  url: UrlEditor,
  array: ArrayEditor,
  upload: UploadEditor,
  object: ObjectEditor,
  json: JsonEditor,
  email: EmailEditor,
  phone: PhoneEditor,
  date: DateEditor,
  time: TimeEditor,
  datetime: DatetimeEditor,
  rich_text: RichTextEditor,
  markdown: MarkdownEditor,
  code: CodeEditor,
};

// HOC para selecionar editor automaticamente
export const withPropertyEditor = (propertyType: string) => {
  const Editor = propertyEditors[propertyType] || TextEditor;
  return Editor;
};
