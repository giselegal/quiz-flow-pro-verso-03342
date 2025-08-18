import React from 'react';
import { blockPropertySchemas, BlockFieldSchema } from '@/config/blockPropertySchemas';

interface PanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({
  htmlFor,
  children,
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const FieldWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-1">{children}</div>
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

const Switch: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({
  checked,
  onChange,
}) => (
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
  value?: Array<{
    text: string;
    value?: string;
    category?: string;
    imageUrl?: string;
    description?: string;
    points?: number;
  }>;
  onChange: (
    val: Array<{
      text: string;
      value?: string;
      category?: string;
      imageUrl?: string;
      description?: string;
      points?: number;
    }>
  ) => void;
}> = ({ value = [], onChange }) => {
  return (
    <div className="space-y-4">
      {/* Seção de Configuração Visual */}
      <div className="p-3 bg-muted/50 rounded-lg border">
        <h4 className="text-sm font-medium mb-3 text-foreground">Configuração Visual</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Colunas</label>
            <select className="w-full text-xs p-1 border rounded">
              <option value="1">1 Coluna</option>
              <option value="2" selected>
                2 Colunas
              </option>
              <option value="3">3 Colunas</option>
              <option value="4">4 Colunas</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Direção</label>
            <select className="w-full text-xs p-1 border rounded">
              <option value="vertical" selected>
                Vertical
              </option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Disposição</label>
            <select className="w-full text-xs p-1 border rounded">
              <option value="image-text" selected>
                Imagem|Texto
              </option>
              <option value="text-image">Texto|Imagem</option>
              <option value="image-only">Só Imagem</option>
              <option value="text-only">Só Texto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Opções */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Opções ({(value || []).length})</h4>
        {(value || []).map((opt, idx) => (
          <div key={idx} className="flex gap-2 p-2 bg-background border rounded-lg">
            {/* Miniatura da Imagem */}
            <div className="flex-shrink-0 w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 cursor-pointer hover:border-primary transition-colors">
              {opt.imageUrl ? (
                <img
                  src={opt.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-xs text-muted-foreground">📷</span>
              )}
            </div>

            {/* Texto Descritivo */}
            <div className="flex-1">
              <Input
                placeholder="Título da opção"
                value={opt.text || ''}
                onChange={e => {
                  const arr = [...value];
                  arr[idx] = { ...arr[idx], text: e.target.value };
                  onChange(arr);
                }}
                className="text-sm font-medium mb-1"
              />
              <Textarea
                placeholder="Descrição (ex: Amo roupas confortáveis e práticas...)"
                value={opt.description || ''}
                onChange={e => {
                  const arr = [...value];
                  arr[idx] = { ...arr[idx], description: e.target.value };
                  onChange(arr);
                }}
                className="text-xs resize-none"
                rows={2}
              />
            </div>

            {/* Ações */}
            <div className="flex-shrink-0 flex flex-col gap-1">
              <button
                type="button"
                className="text-xs p-1 border rounded hover:bg-muted"
                title="Editar"
              >
                ✏️
              </button>
              <button
                type="button"
                className="text-xs p-1 border rounded hover:bg-destructive/10 text-destructive"
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                title="Remover"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 text-sm py-2 px-3 border border-dashed rounded-lg hover:bg-muted transition-colors"
          onClick={() =>
            onChange([
              ...(value || []),
              { text: '', value: '', category: '', imageUrl: '', description: '', points: 0 },
            ])
          }
        >
          + Adicionar opção
        </button>
        {value.length > 0 && (
          <button
            type="button"
            className="text-sm py-2 px-3 border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            onClick={() => onChange(value.slice(0, -1))}
          >
            Remover última
          </button>
        )}
      </div>
    </div>
  );
};

function PropertyField({
  field,
  value,
  onChange,
}: {
  field: BlockFieldSchema;
  value: any;
  onChange: (val: any) => void;
}) {
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
          <Input
            type="number"
            value={value ?? 0}
            onChange={e => onChange(Number(e.target.value))}
          />
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
      const isNum = typeof opts[0]?.value === 'number';
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

const EnhancedUniversalPropertiesPanelFixed: React.FC<PanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
}) => {
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
            if (
              (f.key === 'minSelections' || f.key === 'maxSelections') &&
              !selectedBlock.properties?.multipleSelection
            ) {
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
          <button type="submit" className="px-3 py-2 rounded-md border text-sm">
            Fechar Painel
          </button>
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
