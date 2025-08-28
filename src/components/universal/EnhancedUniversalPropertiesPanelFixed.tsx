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
    keyword?: string;
    styleCategory?: string;
    imageUrl?: string;
    description?: string;
    points?: number;
  }>;
  onChange: (
    val: Array<{
      text: string;
      value?: string;
      category?: string;
      keyword?: string;
      styleCategory?: string;
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
          <div key={idx} className="flex flex-col gap-2 p-2 bg-background border rounded-lg">
            {/* Miniatura da Imagem */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 cursor-pointer hover:border-primary transition-colors overflow-hidden">
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
              <Input
                placeholder="URL da imagem"
                value={opt.imageUrl || ''}
                onChange={e => {
                  const arr = [...value];
                  arr[idx] = { ...arr[idx], imageUrl: e.target.value };
                  onChange(arr);
                }}
                className="text-xs flex-1"
              />
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
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Categoria"
                  value={opt.category || ''}
                  onChange={e => {
                    const arr = [...value];
                    arr[idx] = { ...arr[idx], category: e.target.value };
                    onChange(arr);
                  }}
                  className="text-xs"
                />
                <Input
                  placeholder="Categoria de Estilo"
                  value={opt.styleCategory || ''}
                  onChange={e => {
                    const arr = [...value];
                    arr[idx] = { ...arr[idx], styleCategory: e.target.value };
                    onChange(arr);
                  }}
                  className="text-xs"
                />
                <Input
                  placeholder="Palavra-chave"
                  value={opt.keyword || ''}
                  onChange={e => {
                    const arr = [...value];
                    arr[idx] = { ...arr[idx], keyword: e.target.value };
                    onChange(arr);
                  }}
                  className="text-xs"
                />
                <Input
                  placeholder="Valor/ID"
                  value={opt.value || ''}
                  onChange={e => {
                    const arr = [...value];
                    arr[idx] = { ...arr[idx], value: e.target.value };
                    onChange(arr);
                  }}
                  className="text-xs"
                />
                <Input
                  placeholder="Pontos"
                  type="number"
                  value={Number.isFinite(opt.points as any) ? String(opt.points) : ''}
                  onChange={e => {
                    const arr = [...value];
                    const n = parseInt(e.target.value || '0', 10);
                    arr[idx] = { ...arr[idx], points: isNaN(n) ? 0 : n };
                    onChange(arr);
                  }}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex-shrink-0 flex gap-2">
              <button
                type="button"
                className="text-xs py-1 px-2 border rounded hover:bg-muted"
                title="Duplicar"
                onClick={() => {
                  const arr = [...value];
                  arr.splice(idx + 1, 0, { ...arr[idx] });
                  onChange(arr);
                }}
              >
                ⎘
              </button>
              <button
                type="button"
                className="text-xs py-1 px-2 border rounded hover:bg-destructive/10 text-destructive"
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
              {
                text: '',
                value: '',
                category: '',
                styleCategory: '',
                keyword: '',
                imageUrl: '',
                description: '',
                points: 0,
              },
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
    <aside className="h-full w-full overflow-y-auto bg-gradient-to-b from-white to-gray-50/30">
      {/* Header Moderno */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{schema.label}</h2>
              <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-md mt-1">
                {selectedBlock.id.slice(0, 8)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
            title="Fechar painel"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Indicador de Status */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600">Propriedades ativas</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {mergedFields.length} campos
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="px-6 pb-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            onClose();
          }}
          className="space-y-6"
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
            <section key={group} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
              {/* Header do Grupo */}
              {group !== 'default' && (
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      {group}
                    </h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {fields.length}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Campos do Grupo */}
              <div className="p-4 space-y-4">
                {fields.map(field => (
                  <div key={field.key} className="group">
                    <div className="bg-white/60 rounded-lg border border-gray-200/40 p-3 hover:border-blue-300/60 hover:shadow-sm transition-all duration-200">
                      <PropertyField
                        field={field}
                        value={selectedBlock.properties?.[field.key]}
                        onChange={val => onUpdate(selectedBlock.id, { [field.key]: val })}
                      />
                      {(field as any).description && (
                        <p className="text-xs text-gray-500 mt-2 italic bg-gray-50/80 px-2 py-1 rounded border-l-2 border-blue-200">
                          💡 {(field as any).description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Ações Rápidas */}
          <section className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Ações Rápidas
                </h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Reset de Escala */}
              <div className="bg-white/60 rounded-lg border border-gray-200/40 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Controle de Escala</span>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-all duration-200 border border-blue-200"
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
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resetar
                  </button>
                </div>
                
                {/* Presets de Escala */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Presets:</span>
                  <div className="flex gap-1">
                    {[90, 95, 100, 105, 110].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          selectedBlock.properties?.scale === preset
                            ? 'bg-blue-500 text-white shadow-sm border border-blue-600'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                        }`}
                        title={`Escala ${preset}%`}
                        onClick={() => onUpdate(selectedBlock.id, { scale: preset })}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
      
      {/* Footer com Ações Principais */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/60 p-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 border border-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Fechar
          </button>
          <button
            type="button"
            onClick={() => onDelete(selectedBlock.id)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
            title="Excluir bloco permanentemente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      </div>
      </form>
    </aside>
  );
};

export default EnhancedUniversalPropertiesPanelFixed;
