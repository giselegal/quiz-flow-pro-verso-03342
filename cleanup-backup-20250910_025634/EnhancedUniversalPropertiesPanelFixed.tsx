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
      'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/60 transition-all duration-200 ' +
      (props.className || '')
    }
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = props => (
  <textarea
    {...props}
    className={
      'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/60 min-h-[96px] transition-all duration-200 ' +
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
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
      checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
    }`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const OptionsListEditor: React.FC<{
  value?: Array<{
    id?: string;
    text: string;
    value?: string;
    category?: string;
    styleCategory?: string;
    keyword?: string;
    imageUrl?: string;
    description?: string;
    points?: number;
  }>;
  onChange: (
    val: Array<{
      id?: string;
      text: string;
      value?: string;
      category?: string;
      styleCategory?: string;
      keyword?: string;
      imageUrl?: string;
      description?: string;
      points?: number;
    }>
  ) => void;
}> = ({ value = [], onChange }) => {
  return (
    <div className="space-y-4">
      {/* Seção de Configuração Rápida */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium mb-3 text-blue-800 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Configuração Rápida do Grid
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Tipo de Conteúdo</label>
            <select className="w-full text-xs p-2 border border-blue-300 rounded bg-white">
              <option value="text-and-image">🖼️ Imagem + Texto</option>
              <option value="image-only">📷 Só Imagem</option>
              <option value="text-only">📝 Só Texto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Layout</label>
            <select className="w-full text-xs p-2 border border-blue-300 rounded bg-white">
              <option value="vertical">⬇️ Vertical</option>
              <option value="horizontal">➡️ Horizontal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Posição da Imagem</label>
            <select className="w-full text-xs p-2 border border-blue-300 rounded bg-white">
              <option value="top">⬆️ Acima</option>
              <option value="left">⬅️ Esquerda</option>
              <option value="right">➡️ Direita</option>
              <option value="bottom">⬇️ Abaixo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Opções */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Opções da Questão ({(value || []).length})
          </h4>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {value.length === 0 ? 'Nenhuma opção' : `${value.length} opç${value.length === 1 ? 'ão' : 'ões'}`}
          </div>
        </div>
        
        {(value || []).map((opt, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
            {/* Header da Opção */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-medium text-gray-700">Opção {idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="text-xs py-1 px-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                  title="Duplicar opção"
                  onClick={() => {
                    const arr = [...value];
                    arr.splice(idx + 1, 0, { 
                      ...arr[idx], 
                      id: `option-${Date.now()}`,
                      text: arr[idx].text + ' (cópia)'
                    });
                    onChange(arr);
                  }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicar
                </button>
                <button
                  type="button"
                  className="text-xs py-1 px-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors flex items-center gap-1"
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  title="Remover opção"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover
                </button>
              </div>
            </div>

            {/* Conteúdo da Opção */}
            <div className="p-4 space-y-4">
              {/* Imagem e Texto Principal */}
              <div className="grid grid-cols-3 gap-4">
                {/* Preview da Imagem */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Imagem</label>
                  <div className="relative group">
                    <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors overflow-hidden">
                      {opt.imageUrl ? (
                        <img
                          src={opt.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs">Clique para adicionar</span>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="URL da imagem..."
                      value={opt.imageUrl || ''}
                      onChange={e => {
                        const arr = [...value];
                        arr[idx] = { ...arr[idx], imageUrl: e.target.value };
                        onChange(arr);
                      }}
                      className="text-xs mt-1"
                    />
                  </div>
                </div>

                {/* Texto Principal */}
                <div className="col-span-2 space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Texto da Opção</label>
                  <Textarea
                    placeholder="Ex: Conforto, leveza e praticidade no vestir..."
                    value={opt.text || ''}
                    onChange={e => {
                      const arr = [...value];
                      arr[idx] = { ...arr[idx], text: e.target.value };
                      onChange(arr);
                    }}
                    className="text-sm resize-none"
                    rows={3}
                  />
                  
                  {/* Configurações Rápidas */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Valor/ID</label>
                      <Input
                        placeholder="ex: 1a, option-natural"
                        value={opt.value || opt.id || ''}
                        onChange={e => {
                          const arr = [...value];
                          arr[idx] = { ...arr[idx], value: e.target.value, id: e.target.value };
                          onChange(arr);
                        }}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pontos</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="range"
                          min="0"
                          max="10"
                          value={opt.points || 1}
                          onChange={e => {
                            const arr = [...value];
                            arr[idx] = { ...arr[idx], points: parseInt(e.target.value) };
                            onChange(arr);
                          }}
                          className="flex-1"
                        />
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded min-w-[2rem] text-center">
                          {opt.points || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorização */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria Principal</label>
                  <Input
                    placeholder="ex: Natural, Clássico, Romântico"
                    value={opt.category || ''}
                    onChange={e => {
                      const arr = [...value];
                      arr[idx] = { ...arr[idx], category: e.target.value };
                      onChange(arr);
                    }}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria de Estilo</label>
                  <Input
                    placeholder="ex: styleCategory, keyword"
                    value={opt.styleCategory || opt.keyword || ''}
                    onChange={e => {
                      const arr = [...value];
                      arr[idx] = { 
                        ...arr[idx], 
                        styleCategory: e.target.value,
                        keyword: e.target.value
                      };
                      onChange(arr);
                    }}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações de Adição */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 text-sm py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors text-gray-600 flex items-center justify-center gap-2"
          onClick={() =>
            onChange([
              ...(value || []),
              {
                id: `option-${Date.now()}`,
                text: `Opção ${(value || []).length + 1}`,
                value: `option-${(value || []).length + 1}`,
                category: 'Categoria',
                styleCategory: 'Estilo',
                keyword: 'keyword',
                imageUrl: 'https://via.placeholder.com/256x256',
                description: 'Descrição da opção...',
                points: 1,
              },
            ])
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Nova Opção
        </button>
        {value.length > 0 && (
          <button
            type="button"
            className="text-sm py-3 px-4 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            onClick={() => onChange([])}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpar Todas
          </button>
        )}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm mb-4">Nenhuma opção configurada</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() =>
              onChange([
                {
                  id: 'option-1',
                  text: 'Primeira opção',
                  value: 'option-1',
                  category: 'Categoria A',
                  styleCategory: 'Estilo',
                  imageUrl: 'https://via.placeholder.com/256x256',
                  points: 1,
                },
                {
                  id: 'option-2',
                  text: 'Segunda opção',
                  value: 'option-2',
                  category: 'Categoria B',
                  styleCategory: 'Estilo',
                  imageUrl: 'https://via.placeholder.com/256x256',
                  points: 2,
                },
              ])
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Opções de Exemplo
          </button>
        </div>
      )}
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
          <Input 
            type="text" 
            value={effectiveValue} 
            onChange={e => onChange(e.target.value)} 
            placeholder={(field as any).placeholder}
            required={field.required}
          />
        </FieldWrapper>
      );
    case 'textarea':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <Textarea 
            value={effectiveValue} 
            onChange={e => onChange(e.target.value)} 
            placeholder={(field as any).placeholder}
            required={field.required}
          />
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
            placeholder={(field as any).placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
          />
        </FieldWrapper>
      );
    case 'range': {
      // Unidades auxiliares para escala (%) ou fator (×)
      const isPercent = /Escala \(\%\)|Escala do Componente \(\%\)/i.test(field.label);
      const isFactor = /\(fator\)/i.test(field.label);
      const unit = (field as any).unit || (isPercent ? '%' : isFactor ? '×' : '');
      const suffix = unit ? ` ${unit}` : '';
      const displayVal =
        effectiveValue !== '' && effectiveValue !== undefined ? `${effectiveValue}${suffix}` : '';
      return (
        <FieldWrapper>
          <div className="flex items-center justify-between mb-1">
            <Label>{field.label}</Label>
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{displayVal}</span>
          </div>
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={Number(effectiveValue ?? field.min ?? 0)}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            title={field.description || displayVal}
          />
        </FieldWrapper>
      );
    }
    case 'boolean': {
      const boolVal = Boolean(effectiveValue);
      return (
        <FieldWrapper>
          <div className="flex items-center justify-between">
            <Label>{field.label}</Label>
            <Switch checked={boolVal} onChange={val => onChange(val)} />
          </div>
        </FieldWrapper>
      );
    }
    case 'color':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={effectiveValue || '#ffffff'}
              onChange={e => onChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded cursor-pointer"
            />
            <Input
              type="text"
              value={effectiveValue || '#ffffff'}
              onChange={e => onChange(e.target.value)}
              placeholder="#ffffff"
              className="flex-1 font-mono text-sm"
            />
          </div>
        </FieldWrapper>
      );
    case 'select':
      return (
        <FieldWrapper>
          <Label>{field.label}</Label>
          <select
            value={effectiveValue}
            onChange={e => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/60 transition-all duration-200"
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                // ignore parse error - keep editing
              }
            }}
            className="font-mono text-xs"
            rows={6}
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

  // Mapeamento de grupos para nomes amigáveis
  const getGroupDisplayName = (group: string): string => {
    const groupNames: Record<string, string> = {
      'content': '📝 Conteúdo',
      'layout': '📐 Layout',
      'images': '🖼️ Imagens',
      'behavior': '⚙️ Comportamento',
      'style': '🎨 Aparência',
      'validation': '✅ Validação',
      'advanced': '🔧 Avançado',
      'transform': '↔️ Transformação',
      'spacing': '📏 Espaçamento',
      'animation': '✨ Animação',
      'default': '⚙️ Configurações'
    };
    return groupNames[group] || `📋 ${group.charAt(0).toUpperCase() + group.slice(1)}`;
  };

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
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                      {getGroupDisplayName(group)}
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
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50/80 px-2 py-1 rounded border-l-2 border-blue-200 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18h6m-5-2a7 7 0 117 0c0 1.657-1.343 3-3 3H11c-1.657 0-3-1.343-3-3zm2-7h.01M13 9h.01"/>
                          </svg>
                          <span className="italic">{(field as any).description}</span>
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
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
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
                  <div className="flex gap-1.5">
                    {[90, 95, 100, 105, 110].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          selectedBlock.properties?.scale === preset
                            ? 'bg-blue-500 text-white shadow-md border border-blue-600'
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
      <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition-all duration-200 border border-gray-300 dark:border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      </div>
    
  </aside>
  );
};

export default EnhancedUniversalPropertiesPanelFixed;
