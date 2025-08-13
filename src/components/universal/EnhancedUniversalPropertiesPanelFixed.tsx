import React from 'react';
import { blockPropertySchemas, BlockFieldSchema } from '@/config/blockPropertySchemas';

interface PanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }>=({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const FieldWrapper: React.FC<{ children: React.ReactNode }>=({ children }) => (
  <div className="space-y-1">
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => (
  <input
    {...props}
    className={
      'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60 ' +
      (props.className || '')
    }
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = props => (
  <textarea
    {...props}
    className={
      'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60 min-h-[96px] ' +
      (props.className || '')
    }
  />
);

const Switch: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center h-6 rounded-full px-1 transition-colors duration-150 ${
      checked ? 'bg-primary text-white' : 'bg-muted'
    }`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block w-4 h-4 bg-background rounded-full transform transition-transform duration-150 ${
        checked ? 'translate-x-4' : ''
      }`}
    />
  </button>
);

const OptionsListEditor: React.FC<{
  value?: Array<{ text: string; value?: string; category?: string; imageUrl?: string }>;
  onChange: (val: Array<{ text: string; value?: string; category?: string; imageUrl?: string }>) => void;
}> = ({ value = [], onChange }) => {
  return (
    <div className="space-y-2">
      {(value || []).map((opt, idx) => (
        <div key={idx} className="grid grid-cols-4 gap-2">
          <Input
            placeholder="Texto"
            value={opt.text || ''}
            onChange={e => {
              const arr = [...value];
              arr[idx] = { ...arr[idx], text: e.target.value };
              onChange(arr);
            }}
          />
          <Input
            placeholder="Valor (opcional)"
            value={opt.value || ''}
            onChange={e => {
              const arr = [...value];
              arr[idx] = { ...arr[idx], value: e.target.value };
              onChange(arr);
            }}
          />
          <Input
            placeholder="Categoria (opcional)"
            value={opt.category || ''}
            onChange={e => {
              const arr = [...value];
              arr[idx] = { ...arr[idx], category: e.target.value };
              onChange(arr);
            }}
          />
          <Input
            placeholder="URL da imagem (opcional)"
            value={opt.imageUrl || ''}
            onChange={e => {
              const arr = [...value];
              arr[idx] = { ...arr[idx], imageUrl: e.target.value };
              onChange(arr);
            }}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="button"
          className="text-sm underline"
          onClick={() => onChange([...(value || []), { text: '', value: '', category: '', imageUrl: '' }])}
        >
          + Adicionar opção
        </button>
        {value.length > 0 && (
          <button
            type="button"
            className="text-sm underline"
            onClick={() => onChange(value.slice(0, -1))}
          >
            Remover última
          </button>
        )}
      </div>
    </div>
  );
};

function PropertyField({ field, value, onChange }: { field: BlockFieldSchema; value: any; onChange: (val: any) => void }) {
  switch (field.type) {
    case 'text':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
    case 'textarea':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Textarea value={value ?? ''} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
    case 'number':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input type="number" value={value ?? 0} onChange={e => onChange(Number(e.target.value))} />
        </FieldWrapper>
      );
    case 'boolean':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Switch checked={!!value} onChange={onChange} />
        </FieldWrapper>
      );
    case 'select': {
      const opts = field.options || [];
      const isNum = typeof (opts[0]?.value) === 'number';
      const current = value ?? '';
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            value={current}
            onChange={e => onChange(isNum ? Number(e.target.value) : e.target.value)}
          >
            <option value="">Selecionar...</option>
            {opts.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldWrapper>
      );
    }
    case 'color':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input type="color" value={value ?? '#ffffff'} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
    case 'options-list':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <OptionsListEditor value={value} onChange={onChange} />
        </FieldWrapper>
      );
    case 'json':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Textarea
            value={JSON.stringify(value ?? {}, null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch {
                // ignore parse error
              }
            }}
          />
        </FieldWrapper>
      );
    default:
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
  }
}

const EnhancedUniversalPropertiesPanelFixed: React.FC<PanelProps> = ({ selectedBlock, onUpdate, onClose, onDelete }) => {
  if (!selectedBlock) return null;

  const schema = blockPropertySchemas[selectedBlock.type];

  if (!schema) {
    return (
      <div className="p-4">
        <h3 className="text-base font-semibold mb-2">Tipo de bloco não suportado</h3>
        <button
          type="button"
          className="text-sm underline"
          onClick={() => onDelete(selectedBlock.id)}
        >
          Excluir bloco
        </button>
      </div>
    );
  }

  return (
    <aside className="h-full w-full overflow-y-auto p-4 space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">{schema.label}</h2>
        <p className="text-xs text-muted-foreground break-all">ID: {selectedBlock.id}</p>
      </header>

      <form
        onSubmit={e => {
          e.preventDefault();
          onClose();
        }}
        className="space-y-4"
      >
        {schema.fields
          .filter(f => {
            if ((f.key === 'minSelections' || f.key === 'maxSelections') && !selectedBlock.properties?.multipleSelection) {
              return false;
            }
            return true;
          })
          .map(field => (
            <div key={field.key} className="space-y-1">
              <PropertyField
                field={field}
                value={selectedBlock.properties?.[field.key]}
                onChange={val => onUpdate(selectedBlock.id, { [field.key]: val })}
              />
            </div>
          ))}


        <div className="pt-2 flex gap-2">
          <button type="submit" className="px-3 py-2 rounded-md border text-sm">Fechar Painel</button>
          <button
            type="button"
            className="px-3 py-2 rounded-md border text-sm"
            onClick={() => onDelete(selectedBlock.id)}
          >
            Excluir bloco
          </button>
        </div>
      </form>
    </aside>
  );
};

export default EnhancedUniversalPropertiesPanelFixed;
