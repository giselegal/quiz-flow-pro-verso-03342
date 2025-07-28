import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Palette, Grid, Eye, Plus, Trash2 } from 'lucide-react';
import { PropertySchema } from '../../config/funnelBlockDefinitions';

interface PropertyGroup {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  properties: PropertySchema[];
}

interface ModernPropertiesPanelProps {
  blockType: string;
  properties: Record<string, any>;
  propertiesSchema: PropertySchema[];
  onPropertyChange: (key: string, value: any) => void;
  className?: string;
}

const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  blockType,
  properties,
  propertiesSchema,
  onPropertyChange,
  className = ''
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['content']));

  // Agrupar propriedades por grupo
  const groupedProperties = React.useMemo(() => {
    const groups: Record<string, PropertyGroup> = {};

    propertiesSchema.forEach(prop => {
      const groupId = prop.group || 'general';
      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          label: getGroupLabel(groupId),
          icon: getGroupIcon(groupId),
          properties: []
        };
      }
      groups[groupId].properties.push(prop);
    });

    return Object.values(groups);
  }, [propertiesSchema]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderPropertyInput = (prop: PropertySchema) => {
    const value = properties[prop.key] ?? prop.defaultValue;

    switch (prop.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
            placeholder={prop.defaultValue}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent resize-vertical"
            placeholder={prop.defaultValue}
          />
        );

      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onPropertyChange(prop.key, Number(e.target.value))}
              min={prop.min}
              max={prop.max}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
            />
            {prop.min !== undefined && prop.max !== undefined && (
              <span className="text-xs text-gray-500">
                {prop.min}-{prop.max}
              </span>
            )}
          </div>
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onPropertyChange(prop.key, e.target.checked)}
              className="rounded border-gray-300 text-[#B89B7A] focus:ring-[#B89B7A]"
            />
            <span className="text-sm text-gray-700">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
          >
            {prop.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onPropertyChange(prop.key, e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onPropertyChange(prop.key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
              placeholder="#000000"
            />
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={prop.min || 0}
              max={prop.max || 100}
              value={value || prop.defaultValue || 0}
              onChange={(e) => onPropertyChange(prop.key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{prop.min || 0}</span>
              <span className="font-medium text-[#B89B7A]">{value || prop.defaultValue || 0}</span>
              <span>{prop.max || 100}</span>
            </div>
          </div>
        );

      case 'array-of-objects':
        return (
          <ArrayObjectEditor
            value={value || []}
            itemSchema={prop.itemSchema || []}
            onChange={(newValue) => onPropertyChange(prop.key, newValue)}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className={`bg-white border-l border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#B89B7A]" />
          <h3 className="font-semibold text-gray-900">Propriedades</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {blockType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </div>

      {/* Groups */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {groupedProperties.map(group => {
          const isExpanded = expandedGroups.has(group.id);
          const Icon = group.icon;

          return (
            <div key={group.id} className="border-b border-gray-100">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{group.label}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {group.properties.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {group.properties.map(prop => (
                    <div key={prop.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {prop.label}
                        {prop.description && (
                          <span className="text-xs text-gray-500 block font-normal">
                            {prop.description}
                          </span>
                        )}
                      </label>
                      {renderPropertyInput(prop)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente para editar arrays de objetos
const ArrayObjectEditor: React.FC<{
  value: any[];
  itemSchema: PropertySchema[];
  onChange: (value: any[]) => void;
}> = ({ value, itemSchema, onChange }) => {
  const addItem = () => {
    const newItem: any = { id: crypto.randomUUID() };
    itemSchema.forEach(schema => {
      newItem[schema.key] = schema.defaultValue || '';
    });
    onChange([...value, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, newValue: any) => {
    const updated = value.map((item, i) => 
      i === index ? { ...item, [key]: newValue } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={item.id || index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {itemSchema.filter(schema => !schema.hidden).map(schema => (
              <div key={schema.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {schema.label}
                </label>
                {schema.type === 'text' && (
                  <input
                    type="text"
                    value={item[schema.key] || ''}
                    onChange={(e) => updateItem(index, schema.key, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#B89B7A] focus:border-transparent"
                  />
                )}
                {schema.type === 'textarea' && (
                  <textarea
                    value={item[schema.key] || ''}
                    onChange={(e) => updateItem(index, schema.key, e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#B89B7A] focus:border-transparent"
                  />
                )}
                {schema.type === 'image' && (
                  <input
                    type="url"
                    value={item[schema.key] || ''}
                    onChange={(e) => updateItem(index, schema.key, e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#B89B7A] focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-[#B89B7A] hover:text-[#B89B7A] transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar Item</span>
      </button>
    </div>
  );
};

// Helper functions
const getGroupLabel = (groupId: string): string => {
  const labels: Record<string, string> = {
    content: 'Conteúdo',
    style: 'Estilo',
    layout: 'Layout',
    validation: 'Validação',
    colors: 'Cores',
    advanced: 'Avançado',
    header: 'Cabeçalho',
    question: 'Pergunta',
    options: 'Opções',
    general: 'Geral'
  };
  return labels[groupId] || groupId.charAt(0).toUpperCase() + groupId.slice(1);
};

const getGroupIcon = (groupId: string): React.ComponentType<any> => {
  const icons: Record<string, React.ComponentType<any>> = {
    content: Settings,
    style: Palette,
    layout: Grid,
    validation: Eye,
    colors: Palette,
    advanced: Settings,
    header: Settings,
    question: Settings,
    options: Grid,
    general: Settings
  };
  return icons[groupId] || Settings;
};

export default ModernPropertiesPanel;
