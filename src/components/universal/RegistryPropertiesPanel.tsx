import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { X, Trash2, RotateCcw, Plus, Minus } from 'lucide-react';
import { blocksRegistry, type PropSchema } from '@/core/blocks/registry';
import QuizQuestionPropertiesPanel from '@/components/editor/properties/QuizQuestionPropertiesPanel';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}


// ✅ Advanced Options Array Editor for Quiz Options
// (OptionsArrayEditor removido neste painel para simplificar)

// ✅ Property Field Renderer
// Mantido apenas como referência futura
// interface PropSchema { /* removida - não utilizada aqui */ }


const RegistryPropertiesPanel: React.FC<RegistryPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate: _onUpdate,
  onClose,
  onDelete,
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <p>Selecione um componente para editar suas propriedades</p>
      </div>
    );
  }

  const blockDefinition = blocksRegistry[selectedBlock.type];

  if (!blockDefinition) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="text-lg font-semibold mb-2">Tipo de bloco não suportado</h3>
        <p className="text-gray-600 mb-4">O tipo "{selectedBlock.type}" não foi encontrado no registro</p>
        <Button
          onClick={() => onDelete(selectedBlock.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Bloco
        </Button>
      </div>
    );
  }

  const isQuestionBlock = (
    selectedBlock.type === 'options-grid' ||
    selectedBlock.type === 'quiz-question' ||
    selectedBlock.type === 'quiz-question-inline'
  );

  const [localDraft, setLocalDraft] = useState<Record<string, any>>(() => ({ ...(selectedBlock.properties || {}) }));

  // Debounce apply
  const applyUpdates = useCallback((partial: Record<string, any>) => {
    setLocalDraft(prev => {
      const next = { ...prev, ...partial };
      // Debounce simples: aplica após 300ms de inatividade
      const ts = Date.now();
      setTimeout(() => {
        // Se nenhuma nova alteração sobrescreveu dentro do período (~300ms), aplicar
        if (Date.now() - ts >= 280) {
          _onUpdate(selectedBlock.id, { properties: next });
        }
      }, 300);
      return next;
    });
  }, [_onUpdate, selectedBlock.id]);

  const handleUpdate = (updates: Record<string, any>) => {
    applyUpdates(updates);
  };

  // ✨ NOVA FUNCIONALIDADE: Reset de campo individual
  const handleResetField = (schema: PropSchema) => {
    handleUpdate({ [schema.key]: schema.default ?? '' });
  };

  // ✨ NOVA FUNCIONALIDADE: Verificar condições dependsOn/when
  const isFieldVisible = (schema: PropSchema): boolean => {
    // Verificar dependsOn (campo deve existir e ter valor)
    if (schema.dependsOn) {
      for (const dep of schema.dependsOn) {
        const depValue = localDraft[dep];
        if (!depValue && depValue !== 0 && depValue !== false) {
          return false;
        }
      }
    }

    // Verificar condição when (campo específico deve ter valor específico)
    if (schema.when) {
      const conditionValue = localDraft[schema.when.key];
      if (conditionValue !== schema.when.value) {
        return false;
      }
    }

    return true;
  };

  const groupedSchemas = useMemo(() => {
    const groups: Record<string, PropSchema[]> = {};
    (blockDefinition.propsSchema || []).forEach(schema => {
      // ✨ FILTRAR POR CONDIÇÕES DEPENDSON/WHEN
      if (!isFieldVisible(schema)) return;
      
      const cat = schema.category || 'content';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(schema);
    });
    return groups;
  }, [blockDefinition.propsSchema, localDraft]); // ✨ DEPENDÊNCIA ADICIONAL: localDraft

  const renderField = (schema: PropSchema) => {
    const value = localDraft[schema.key] ?? schema.default ?? '';
    const isModified = value !== (schema.default ?? '');
    
    const commonLabel = (
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={schema.key} className="text-xs font-medium text-gray-600">
          {schema.label}
          {schema.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-center gap-1">
          {schema.kind === 'range' && typeof value === 'number' && (
            <span className="text-[10px] text-gray-400 font-mono">{value}{schema.unit || ''}</span>
          )}
          {/* ✨ BOTÃO DE RESET POR CAMPO */}
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResetField(schema)}
              className="h-5 w-5 p-0 hover:bg-gray-100"
              title="Resetar para valor padrão"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );

    switch (schema.kind) {
      case 'text':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Input
              id={schema.key}
              value={value}
              placeholder={schema.placeholder}
              onChange={e => handleUpdate({ [schema.key]: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Textarea
              id={schema.key}
              value={value}
              placeholder={schema.placeholder}
              onChange={e => handleUpdate({ [schema.key]: e.target.value })}
              className="text-xs min-h-[70px]"
            />
          </div>
        );
      case 'color':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Input
              type="color"
              id={schema.key}
              value={value || '#ffffff'}
              onChange={e => handleUpdate({ [schema.key]: e.target.value })}
              className="h-8 p-1"
            />
          </div>
        );
      case 'number':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Input
              type="number"
              id={schema.key}
              value={value}
              min={schema.min}
              max={schema.max}
              step={schema.step}
              onChange={e => handleUpdate({ [schema.key]: e.target.value === '' ? '' : Number(e.target.value) })}
              className="h-8 text-xs"
            />
          </div>
        );
      case 'range':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Slider
              defaultValue={[typeof value === 'number' ? value : schema.min || 0]}
              min={schema.min ?? 0}
              max={schema.max ?? 100}
              step={schema.step ?? 1}
              onValueChange={vals => handleUpdate({ [schema.key]: vals[0] })}
            />
          </div>
        );
      case 'select':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Select
              value={value}
              onValueChange={val => handleUpdate({ [schema.key]: val })}
            >
              <SelectTrigger id={schema.key} className="h-8 text-xs">
                <SelectValue placeholder={schema.placeholder || 'Selecione...'} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {schema.options?.map(opt => (
                  <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'switch':
        return (
          <div key={schema.key} className="flex items-center justify-between py-1">
            <Label htmlFor={schema.key} className="text-xs text-gray-600">
              {schema.label}
            </Label>
            <Switch
              id={schema.key}
              checked={!!value}
              onCheckedChange={val => handleUpdate({ [schema.key]: val })}
            />
          </div>
        );
      case 'url':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <Input
              id={schema.key}
              type="url"
              value={value}
              placeholder={schema.placeholder || 'https://...'}
              onChange={e => handleUpdate({ [schema.key]: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        );
      case 'array':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <div className="border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50">
              {(Array.isArray(value) ? value : []).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={e => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray[index] = e.target.value;
                      handleUpdate({ [schema.key]: newArray });
                    }}
                    className="h-8 text-xs flex-1"
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newArray = [...(Array.isArray(value) ? value : [])];
                      newArray.splice(index, 1);
                      handleUpdate({ [schema.key]: newArray });
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newArray = [...(Array.isArray(value) ? value : []), ''];
                  handleUpdate({ [schema.key]: newArray });
                }}
                className="h-8 w-full border-dashed border border-gray-300 hover:border-gray-400"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Item
              </Button>
            </div>
          </div>
        );
      case 'object':
        return (
          <div key={schema.key} className="space-y-1">
            {commonLabel}
            <div className="border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50">
              <Textarea
                value={JSON.stringify(value || {}, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleUpdate({ [schema.key]: parsed });
                  } catch {
                    // Ignorar erros de parsing enquanto digita
                  }
                }}
                className="text-xs min-h-[100px] font-mono"
                placeholder="{ }"
              />
              <div className="text-[10px] text-gray-500">
                Edite o JSON diretamente. Deve ser um objeto válido.
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div key={schema.key} className="space-y-1 opacity-60">
            {commonLabel}
            <div className="text-[10px] italic text-gray-400">Tipo não suportado ainda: {schema.kind}</div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {blockDefinition.icon || '🧩'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{blockDefinition.title}</h2>
              <p className="text-sm text-gray-500 font-mono">
                {selectedBlock.id.slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isQuestionBlock ? (
          <QuizQuestionPropertiesPanel
            block={selectedBlock}
            onUpdate={handleUpdate}
            onDelete={() => onDelete(selectedBlock.id)}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSchemas).map(([category, schemas]) => (
              <div key={category} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{category}</h3>
                  <span className="text-[10px] text-gray-400">{schemas.length} campos</span>
                </div>
                <div className="p-3 space-y-3">
                  {schemas.map(sc => renderField(sc))}
                </div>
              </div>
            ))}
            {(!blockDefinition.propsSchema || blockDefinition.propsSchema.length === 0) && (
              <div className="text-center text-xs text-gray-400 py-8">
                Nenhuma propriedade configurável definida para este bloco.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Sistema de propriedades simplificado
          </div>
          <Button
            onClick={() => onDelete(selectedBlock.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistryPropertiesPanel;
