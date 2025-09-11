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
import ScoreValuesEditor from './ScoreValuesEditor';
import ResponsiveColumnsEditor from './ResponsiveColumnsEditor';
import BoxModelEditor from './BoxModelEditor';
import EnhancedUploadEditor from './EnhancedUploadEditor';
import AnimationPreviewEditor from './AnimationPreviewEditor';
import CanvasContainerPropertyEditor from '../editors/CanvasContainerPropertyEditor';
import React from 'react';
import type { PropertyEditorProps, PropertyEditorRegistry } from './types';

// Wrapper para compatibilidade com PropertyEditorComponent
const CanvasContainerWrapper: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  // As props serão passadas pelo contexto no PropertiesPanel
  return <CanvasContainerPropertyEditor />;
};

// Editor de texto básico
const TextEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
      placeholder={(property as any).placeholder || ''}
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
      placeholder={(property as any).placeholder || ''}
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
const NumberEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  const min = (property as any).min ?? 0;
  const max = (property as any).max ?? 100;
  const step = (property as any).step ?? 1;
  const unit = (property as any).unit ? ` ${(property as any).unit}` : '';
  const val = Number(property.value ?? min);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={property.key}>{property.label}</Label>
        <span className="text-xs text-muted-foreground">{val}{unit}</span>
      </div>
      <Slider
        id={property.key}
        value={[val]}
        onValueChange={([value]) => onChange(property.key, value)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

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
  const unit = (property as any).unit ? ` ${(property as any).unit}` : '';
  const current = Number(property.value ?? min);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={property.key}>{property.label}</Label>
        <span className="text-xs text-muted-foreground">{current}{unit}</span>
      </div>
      <Slider
        id={property.key}
        value={[current]}
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
      placeholder={(property as any).placeholder || 'https://...'}
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
const UploadEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  const url = String(property.value || '');
  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url) || url.startsWith('data:image');
  return (
    <div className="space-y-2">
      <Label htmlFor={property.key}>{property.label}</Label>
      <Input
        id={property.key}
        type="url"
        value={url}
        onChange={e => onChange(property.key, e.target.value)}
        placeholder="Cole a URL da mídia..."
      />
      {url ? (
        <div className="rounded border p-2 bg-muted/30">
          {isImage ? (
            <img
              src={url}
              alt={property.label}
              className="max-h-40 w-auto object-contain mx-auto"
              onError={(e: any) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <a href={url} target="_blank" rel="noreferrer" className="text-xs underline">
              Abrir mídia
            </a>
          )}
        </div>
      ) : null}
      {(property as any).description ? (
        <p className="text-xs text-muted-foreground">{(property as any).description}</p>
      ) : null}
      {/* TODO: integrar upload via Supabase Storage/Cloudinary com botão de upload e seleção */}
    </div>
  );
};

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
        } catch { }
      }}
      className="font-mono text-xs min-h-[120px]"
    />
  </div>
);

// Dispatcher para objetos com editores compostos
const ObjectEditorDispatcher: React.FC<PropertyEditorProps> = props => {
  const key = props.property.key.toLowerCase();
  if (key.includes('border')) return <BorderEditor {...props} />;
  if (key.includes('background')) return <BackgroundEditor {...props} />;
  return <ObjectEditor {...props} />;
};

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

// Edior composto: Borda (espera objeto { width, color, radius, style })
const BorderEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
  const val = property.value || { width: 0, color: '#000000', radius: 0, style: 'solid' };
  const update = (patch: any) => onChange(property.key, { ...val, ...patch });
  return (
    <div className="space-y-2">
      <Label>{property.label}</Label>
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-3">
          <Label className="text-xs">Largura</Label>
          <Input type="number" value={Number(val.width ?? 0)} onChange={e => update({ width: Number(e.target.value) || 0 })} />
        </div>
        <div className="col-span-3">
          <Label className="text-xs">Raio</Label>
          <Input type="number" value={Number(val.radius ?? 0)} onChange={e => update({ radius: Number(e.target.value) || 0 })} />
        </div>
        <div className="col-span-3">
          <Label className="text-xs">Estilo</Label>
          <Select value={String(val.style ?? 'solid')} onValueChange={v => update({ style: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Sólido</SelectItem>
              <SelectItem value="dashed">Tracejado</SelectItem>
              <SelectItem value="dotted">Pontilhado</SelectItem>
              <SelectItem value="double">Duplo</SelectItem>
              <SelectItem value="none">Nenhum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3">
          <Label className="text-xs">Cor</Label>
          <ColorPicker value={val.color || '#000000'} onChange={c => update({ color: c })} />
        </div>
      </div>
    </div>
  );
};

// Editor composto: Background (espera objeto { type, color, gradientFrom, gradientTo, imageUrl, size, position })
const
  BackgroundEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
    const val =
      property.value || ({ type: 'color', color: '#ffffff', gradientFrom: '#ffffff', gradientTo: '#ffffff', imageUrl: '', size: 'cover', position: 'center' } as any);
    const update = (patch: any) => onChange(property.key, { ...val, ...patch });
    return (
      <div className="space-y-2">
        <Label>{property.label}</Label>
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-3">
            <Label className="text-xs">Tipo</Label>
            <Select value={String(val.type ?? 'color')} onValueChange={v => update({ type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Cor</SelectItem>
                <SelectItem value="gradient">Gradiente</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {val.type === 'color' && (
            <div className="col-span-3">
              <Label className="text-xs">Cor</Label>
              <ColorPicker value={val.color || '#ffffff'} onChange={c => update({ color: c })} />
            </div>
          )}
          {val.type === 'gradient' && (
            <>
              <div className="col-span-3">
                <Label className="text-xs">De</Label>
                <ColorPicker value={val.gradientFrom || '#ffffff'} onChange={c => update({ gradientFrom: c })} />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Para</Label>
                <ColorPicker value={val.gradientTo || '#ffffff'} onChange={c => update({ gradientTo: c })} />
              </div>
            </>
          )}
          {val.type === 'image' && (
            <>
              <div className="col-span-6">
                <Label className="text-xs">Imagem</Label>
                <Input value={val.imageUrl || ''} onChange={e => update({ imageUrl: e.target.value })} placeholder="URL da imagem" />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Tamanho</Label>
                <Select value={String(val.size ?? 'cover')} onValueChange={v => update({ size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Posição</Label>
                <Select value={String(val.position ?? 'center')} onValueChange={v => update({ position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                    <SelectItem value="top">Topo</SelectItem>
                    <SelectItem value="bottom">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
  // upload: UploadEditor, // REMOVIDO - substituído por EnhancedUploadEditor mais abaixo
  object: ObjectEditorDispatcher,
  json: JsonEditor,
  email: EmailEditor,
  phone: PhoneEditor,
  date: DateEditor,
  time: TimeEditor,
  datetime: DatetimeEditor,
  rich_text: RichTextEditor,
  markdown: MarkdownEditor,
  code: CodeEditor,
  border: BorderEditor,
  background: BackgroundEditor,
  margin: BoxModelEditor,
  padding: BoxModelEditor,
  upload: EnhancedUploadEditor,
  animation: AnimationPreviewEditor,
  canvasContainer: CanvasContainerWrapper,
};

// HOC para selecionar editor automaticamente
export const withPropertyEditor = (propertyType: string) => {
  const Editor = propertyEditors[propertyType] || TextEditor;
  return Editor;
};

// Utilitário: escolhe o editor baseado no objeto da propriedade
export const pickPropertyEditor = (property: any) => {
  const type = String(property?.type ?? 'text');
  const key = String(property?.key ?? '').toLowerCase();

  // Editores especializados por key
  if (key === 'scorevalues') return ScoreValuesEditor;
  if (key === 'responsivecolumns') return ResponsiveColumnsEditor;

  // Box Model (margin/padding)
  if (key.includes('margin') || key.includes('padding')) return BoxModelEditor;

  // Upload avançado
  if (type === 'upload' || key.includes('image') || key.includes('video') || key.includes('media')) {
    return EnhancedUploadEditor;
  }

  // Animations
  if (type === 'animation' || key.includes('animation') || key.includes('transition')) {
    return AnimationPreviewEditor;
  }

  // Arrays
  if (type === 'array') {
    if (key === 'options') return OptionsArrayEditor;
    return ArrayJsonEditor;
  }

  // Objetos
  if (type === 'object' || type === 'json') {
    if (key.includes('border')) return BorderEditor;
    if (key.includes('background')) return BackgroundEditor;
    if (key === 'scorevalues') return ScoreValuesEditor;
    if (key === 'responsivecolumns') return ResponsiveColumnsEditor;
    return type === 'json' ? JsonEditor : ObjectEditor;
  }

  // Upload
  if (type === 'upload') return UploadEditor;

  // Padrão pelo registro
  return propertyEditors[type] || TextEditor;
};
