import { BlockFieldSchema, blockPropertySchemas } from '@/config/blockPropertySchemas';
import { getBlockDefinition } from '@/config/funnelBlockDefinitions';
import React from 'react';

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
  const effectiveValue = value ?? (field as any).defaultValue ?? '';
  switch (field.type) {
    case 'text':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input type="text" value={effectiveValue} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
    case 'textarea':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Textarea value={effectiveValue} onChange={e => onChange(e.target.value)} />
        </FieldWrapper>
      );
    case 'number':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Input
            type="number"
            value={Number(effectiveValue) || 0}
            onChange={e => onChange(Number(e.target.value))}
          />
        </FieldWrapper>
      );
    case 'range': {
      // Unidades auxiliares para escala (%) ou fator (×)
      const isPercent = /Escala \(\%\)|Escala do Componente \(\%\)/i.test(field.label);
      const isFactor = /\(fator\)/i.test(field.label);
      const suffix = isPercent ? '%' : isFactor ? '×' : '';
      const displayVal =
        effectiveValue !== '' && effectiveValue !== undefined ? `${effectiveValue}${suffix}` : '';
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={Number(effectiveValue ?? field.min ?? 0)}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full"
            title={field.description || displayVal}
          />
          <div className="text-xs text-muted-foreground">{displayVal}</div>
        </FieldWrapper>
      );
    }
    case 'boolean':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Switch checked={!!effectiveValue} onChange={onChange} />
        </FieldWrapper>
      );
    case 'select': {
      const opts = field.options || [];
      const isNum = typeof opts[0]?.value === 'number';
      const current = effectiveValue ?? '';
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
          <Input
            type="color"
            value={effectiveValue || '#ffffff'}
            onChange={e => onChange(e.target.value)}
          />
        </FieldWrapper>
      );
    case 'options-list': {
      const listValue = Array.isArray(effectiveValue) ? effectiveValue : [];
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <OptionsListEditor value={listValue} onChange={onChange} />
        </FieldWrapper>
      );
    }
    case 'json':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Textarea
            value={JSON.stringify(effectiveValue ?? {}, null, 2)}
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

  const schema =
    blockPropertySchemas[selectedBlock.type] ||
    ((): { label: string; fields: any[] } | null => {
      const def = getBlockDefinition(selectedBlock.type);
      if (!def || !Array.isArray(def.propertiesSchema)) return null;
      // Adaptar legacy PropertySchema para BlockFieldSchema simples
      const fields: BlockFieldSchema[] = def.propertiesSchema
        .filter((f: any) => !!f && !!f.key && !!f.label && !!f.type)
        .map((f: any) => ({
          key: f.key,
          label: f.label,
          type: (f.type === 'boolean' ? 'boolean' : f.type === 'slider' ? 'range' : f.type) as any,
          options: f.options,
          min: f.min,
          max: f.max,
          group: f.group,
        }));
      return { label: def.label || selectedBlock.type, fields };
    })();

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

  // Misturar campos universais de transformação/escala
  const universal = blockPropertySchemas['universal-default'];
  const mergedFields = [
    ...(schema?.fields || []),
    // Evitar duplicatas por chave
    ...universal.fields.filter(uf => !(schema?.fields || []).some(sf => sf.key === uf.key)),
  ];

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
        {Object.entries(
          mergedFields
            .filter(f => {
              // ocultar condicionais de seleção múltipla
              if (
                (f.key === 'minSelections' || f.key === 'maxSelections') &&
                !selectedBlock.properties?.multipleSelection
              ) {
                return false;
              }
              // ocultar hidden
              if ((f as any).hidden) return false;
              // showIf simples: formato "prop === value" ou "prop !== value"
              const showIf = (f as any).showIf as string | undefined;
              if (showIf) {
                try {
                  const [left, op, rawRight] = showIf.split(/\s+/);
                  const right =
                    rawRight === 'true'
                      ? true
                      : rawRight === 'false'
                        ? false
                        : rawRight
                          ? rawRight.replace(/'/g, '')
                          : rawRight;
                  const leftVal = left
                    ?.split('.')
                    .reduce((acc: any, key: string) => acc?.[key], selectedBlock.properties || {});
                  if (op === '===') return leftVal === right;
                  if (op === '!==') return leftVal !== right;
                } catch {}
              }
              return true;
            })
            .reduce((acc: Record<string, BlockFieldSchema[]>, f) => {
              const group = f.group || 'default';
              acc[group] = acc[group] || [];
              acc[group].push(f);
              return acc;
            }, {})
        ).map(([group, fields]) => (
          <section key={group} className="space-y-2">
            {group !== 'default' && (
              <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                {group}
              </h4>
            )}
            {fields.map(field => (
              <div key={field.key} className="space-y-1">
                <PropertyField
                  field={field}
                  value={selectedBlock.properties?.[field.key]}
                  onChange={val => onUpdate(selectedBlock.id, { [field.key]: val })}
                />
                {(field as any).description && (
                  <p className="text-xs text-muted-foreground">{(field as any).description}</p>
                )}
              </div>
            ))}
          </section>
        ))}

        {/* Ações rápidas */}
        <section className="pt-2 border-t">
          <h4 className="text-sm font-semibold mb-2">Ações Rápidas</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              className="px-3 py-1.5 rounded-md border text-xs hover:bg-muted"
              onClick={() =>
                onUpdate(selectedBlock.id, {
                  scale: 100,
                  scaleX: undefined,
                  scaleY: undefined,
                  scaleOrigin: 'center',
                  scaleClass: undefined,
                })
              }
            >
              Resetar escala
            </button>

            {/* Presets rápidos para escala (%) */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Presets:</span>
              {[90, 95, 100, 105, 110].map(preset => (
                <button
                  key={preset}
                  type="button"
                  className={`px-2 py-1 rounded border text-xs hover:bg-muted ${
                    selectedBlock.properties?.scale === preset ? 'bg-muted' : ''
                  }`}
                  title={`${preset}%`}
                  onClick={() => onUpdate(selectedBlock.id, { scale: preset })}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </section>

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
