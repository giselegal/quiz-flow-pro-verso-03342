/**
 * ⚙️ ADVANCED PROPERTIES PANEL - FASE 2
 * 
 * Painel de propriedades dinâmico e inteligente com:
 * ✅ Edição contextual baseada no tipo de elemento
 * ✅ Validação em tempo real
 * ✅ Sincronização automática com canvas
 * ✅ History/Undo system integrado
 * ✅ Batch editing para múltiplas seleções
 * ✅ Smart suggestions e auto-complete
 */

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef
} from 'react';
import { useEditorCore, useEditorElements, useEditorSelection, EditorElement } from '../core/EditorCore';

// 🎯 PROPERTY TYPES
export type PropertyType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'color'
    | 'select'
    | 'multiselect'
    | 'range'
    | 'textarea'
    | 'url'
    | 'file'
    | 'date'
    | 'time'
    | 'json'
    | 'code';

export interface PropertyDefinition {
    key: string;
    label: string;
    type: PropertyType;
    defaultValue?: any;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: (value: any) => string | null;
    };
    options?: Array<{ value: any; label: string }>;
    group?: string;
    description?: string;
    placeholder?: string;
    unit?: string;
    suggestions?: string[];
    conditional?: {
        property: string;
        value: any;
        operator?: '===' | '!==' | '>' | '<' | 'includes';
    };
}

export interface PropertyGroup {
    id: string;
    label: string;
    icon?: string;
    collapsed?: boolean;
    order?: number;
    properties: string[];
}

export interface PropertySchema {
    elementType: string;
    groups: PropertyGroup[];
    properties: Record<string, PropertyDefinition>;
}

// 🎯 PROPERTY SCHEMAS
const PROPERTY_SCHEMAS: Record<string, PropertySchema> = {
    text: {
        elementType: 'text',
        groups: [
            {
                id: 'content',
                label: 'Content',
                icon: '📝',
                order: 1,
                properties: ['content', 'placeholder']
            },
            {
                id: 'typography',
                label: 'Typography',
                icon: '🔤',
                order: 2,
                properties: ['fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'textAlign']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                icon: '🎨',
                order: 3,
                properties: ['color', 'backgroundColor', 'border', 'borderRadius', 'shadow']
            },
            {
                id: 'layout',
                label: 'Layout',
                icon: '📐',
                order: 4,
                properties: ['width', 'height', 'padding', 'margin']
            }
        ],
        properties: {
            content: {
                key: 'content',
                label: 'Text Content',
                type: 'textarea',
                defaultValue: 'Text Element',
                required: true,
                group: 'content',
                description: 'The text content to display'
            },
            placeholder: {
                key: 'placeholder',
                label: 'Placeholder',
                type: 'string',
                group: 'content',
                description: 'Placeholder text when content is empty'
            },
            fontSize: {
                key: 'fontSize',
                label: 'Font Size',
                type: 'range',
                defaultValue: 16,
                validation: { min: 8, max: 72 },
                unit: 'px',
                group: 'typography'
            },
            fontWeight: {
                key: 'fontWeight',
                label: 'Font Weight',
                type: 'select',
                defaultValue: '400',
                options: [
                    { value: '300', label: 'Light' },
                    { value: '400', label: 'Normal' },
                    { value: '500', label: 'Medium' },
                    { value: '600', label: 'Semi Bold' },
                    { value: '700', label: 'Bold' }
                ],
                group: 'typography'
            },
            fontFamily: {
                key: 'fontFamily',
                label: 'Font Family',
                type: 'select',
                defaultValue: 'system-ui',
                options: [
                    { value: 'system-ui', label: 'System UI' },
                    { value: 'Arial', label: 'Arial' },
                    { value: 'Helvetica', label: 'Helvetica' },
                    { value: 'Georgia', label: 'Georgia' },
                    { value: 'Times New Roman', label: 'Times New Roman' }
                ],
                group: 'typography'
            },
            lineHeight: {
                key: 'lineHeight',
                label: 'Line Height',
                type: 'range',
                defaultValue: 1.5,
                validation: { min: 1, max: 3 },
                group: 'typography'
            },
            textAlign: {
                key: 'textAlign',
                label: 'Text Align',
                type: 'select',
                defaultValue: 'left',
                options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' }
                ],
                group: 'typography'
            },
            color: {
                key: 'color',
                label: 'Text Color',
                type: 'color',
                defaultValue: '#000000',
                group: 'appearance'
            },
            backgroundColor: {
                key: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                defaultValue: 'transparent',
                group: 'appearance'
            },
            border: {
                key: 'border',
                label: 'Border',
                type: 'string',
                placeholder: 'e.g., 1px solid #ccc',
                group: 'appearance'
            },
            borderRadius: {
                key: 'borderRadius',
                label: 'Border Radius',
                type: 'range',
                defaultValue: 0,
                validation: { min: 0, max: 50 },
                unit: 'px',
                group: 'appearance'
            },
            shadow: {
                key: 'shadow',
                label: 'Box Shadow',
                type: 'string',
                placeholder: 'e.g., 0 2px 4px rgba(0,0,0,0.1)',
                group: 'appearance'
            },
            width: {
                key: 'width',
                label: 'Width',
                type: 'string',
                defaultValue: 'auto',
                suggestions: ['auto', '100%', '50%', '300px'],
                group: 'layout'
            },
            height: {
                key: 'height',
                label: 'Height',
                type: 'string',
                defaultValue: 'auto',
                suggestions: ['auto', '100px', '200px', '50vh'],
                group: 'layout'
            },
            padding: {
                key: 'padding',
                label: 'Padding',
                type: 'string',
                defaultValue: '0',
                placeholder: 'e.g., 10px or 10px 20px',
                group: 'layout'
            },
            margin: {
                key: 'margin',
                label: 'Margin',
                type: 'string',
                defaultValue: '0',
                placeholder: 'e.g., 10px or 10px 20px',
                group: 'layout'
            }
        }
    },

    button: {
        elementType: 'button',
        groups: [
            {
                id: 'content',
                label: 'Content',
                icon: '📝',
                order: 1,
                properties: ['text', 'icon', 'iconPosition']
            },
            {
                id: 'behavior',
                label: 'Behavior',
                icon: '⚡',
                order: 2,
                properties: ['onClick', 'disabled', 'loading', 'type']
            },
            {
                id: 'appearance',
                label: 'Appearance',
                icon: '🎨',
                order: 3,
                properties: ['variant', 'size', 'color', 'backgroundColor', 'borderRadius']
            },
            {
                id: 'layout',
                label: 'Layout',
                icon: '📐',
                order: 4,
                properties: ['width', 'height', 'padding', 'margin']
            }
        ],
        properties: {
            text: {
                key: 'text',
                label: 'Button Text',
                type: 'string',
                defaultValue: 'Button',
                required: true,
                group: 'content',
                validation: {
                    custom: (value: string) => {
                        if (!value || value.trim().length === 0) {
                            return 'Button text is required';
                        }
                        if (value.length > 50) {
                            return 'Button text should be less than 50 characters';
                        }
                        return null;
                    }
                }
            },
            icon: {
                key: 'icon',
                label: 'Icon',
                type: 'string',
                group: 'content',
                suggestions: ['✓', '×', '→', '←', '↑', '↓', '⚙️', '❤️', '⭐']
            },
            iconPosition: {
                key: 'iconPosition',
                label: 'Icon Position',
                type: 'select',
                defaultValue: 'left',
                options: [
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' }
                ],
                group: 'content',
                conditional: { property: 'icon', value: '', operator: '!==' }
            },
            onClick: {
                key: 'onClick',
                label: 'On Click Action',
                type: 'select',
                defaultValue: 'none',
                options: [
                    { value: 'none', label: 'None' },
                    { value: 'submit', label: 'Submit Form' },
                    { value: 'next', label: 'Next Step' },
                    { value: 'previous', label: 'Previous Step' },
                    { value: 'custom', label: 'Custom Action' }
                ],
                group: 'behavior'
            },
            disabled: {
                key: 'disabled',
                label: 'Disabled',
                type: 'boolean',
                defaultValue: false,
                group: 'behavior'
            },
            loading: {
                key: 'loading',
                label: 'Loading State',
                type: 'boolean',
                defaultValue: false,
                group: 'behavior'
            },
            type: {
                key: 'type',
                label: 'Button Type',
                type: 'select',
                defaultValue: 'button',
                options: [
                    { value: 'button', label: 'Button' },
                    { value: 'submit', label: 'Submit' },
                    { value: 'reset', label: 'Reset' }
                ],
                group: 'behavior'
            },
            variant: {
                key: 'variant',
                label: 'Variant',
                type: 'select',
                defaultValue: 'primary',
                options: [
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'success', label: 'Success' },
                    { value: 'warning', label: 'Warning' },
                    { value: 'danger', label: 'Danger' }
                ],
                group: 'appearance'
            },
            size: {
                key: 'size',
                label: 'Size',
                type: 'select',
                defaultValue: 'md',
                options: [
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' }
                ],
                group: 'appearance'
            },
            color: {
                key: 'color',
                label: 'Text Color',
                type: 'color',
                defaultValue: '#ffffff',
                group: 'appearance'
            },
            backgroundColor: {
                key: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                defaultValue: '#3b82f6',
                group: 'appearance'
            },
            borderRadius: {
                key: 'borderRadius',
                label: 'Border Radius',
                type: 'range',
                defaultValue: 6,
                validation: { min: 0, max: 50 },
                unit: 'px',
                group: 'appearance'
            },
            width: {
                key: 'width',
                label: 'Width',
                type: 'string',
                defaultValue: 'auto',
                suggestions: ['auto', '100%', '200px', 'fit-content'],
                group: 'layout'
            },
            height: {
                key: 'height',
                label: 'Height',
                type: 'string',
                defaultValue: 'auto',
                suggestions: ['auto', '40px', '50px', '60px'],
                group: 'layout'
            },
            padding: {
                key: 'padding',
                label: 'Padding',
                type: 'string',
                defaultValue: '8px 16px',
                suggestions: ['4px 8px', '8px 16px', '12px 24px', '16px 32px'],
                group: 'layout'
            },
            margin: {
                key: 'margin',
                label: 'Margin',
                type: 'string',
                defaultValue: '0',
                placeholder: 'e.g., 10px or 10px 20px',
                group: 'layout'
            }
        }
    }
};

// 🎯 PROPERTY INPUT COMPONENTS
interface PropertyInputProps {
    definition: PropertyDefinition;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    disabled?: boolean;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
    definition,
    value,
    onChange,
    error,
    disabled = false
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const handleInputChange = (newValue: any) => {
        onChange(newValue);

        // Filter suggestions
        if (definition.suggestions && typeof newValue === 'string') {
            const filtered = definition.suggestions.filter(s =>
                s.toLowerCase().includes(newValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0 && newValue.length > 0);
        }
    };

    const renderInput = () => {
        const baseProps = {
            value: value ?? definition.defaultValue ?? '',
            onChange: (e: any) => handleInputChange(e.target.value),
            disabled,
            placeholder: definition.placeholder,
            style: {
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
            }
        };

        switch (definition.type) {
            case 'string':
            case 'url':
                return (
                    <div style={{ position: 'relative' }}>
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={definition.type === 'url' ? 'url' : 'text'}
                            {...baseProps}
                            onFocus={() => setShowSuggestions(suggestions.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        />
                        {showSuggestions && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none'
                                        }}
                                        onMouseDown={() => {
                                            onChange(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLElement).style.background = '#f3f4f6';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLElement).style.background = 'white';
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        {...baseProps}
                        rows={3}
                        style={{ ...baseProps.style, resize: 'vertical' }}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        {...baseProps}
                        min={definition.validation?.min}
                        max={definition.validation?.max}
                        onChange={(e) => handleInputChange(parseFloat(e.target.value) || 0)}
                    />
                );

            case 'range':
                return (
                    <div>
                        <input
                            type="range"
                            value={value ?? definition.defaultValue ?? 0}
                            min={definition.validation?.min ?? 0}
                            max={definition.validation?.max ?? 100}
                            step={0.1}
                            onChange={(e) => handleInputChange(parseFloat(e.target.value))}
                            disabled={disabled}
                            style={{ width: '100%' }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px'
                        }}>
                            <span>{definition.validation?.min ?? 0}</span>
                            <span>
                                {value ?? definition.defaultValue ?? 0}
                                {definition.unit && ` ${definition.unit}`}
                            </span>
                            <span>{definition.validation?.max ?? 100}</span>
                        </div>
                    </div>
                );

            case 'boolean':
                return (
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={value ?? definition.defaultValue ?? false}
                            onChange={(e) => handleInputChange(e.target.checked)}
                            disabled={disabled}
                        />
                        <span>{definition.label}</span>
                    </label>
                );

            case 'color':
                return (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={value ?? definition.defaultValue ?? '#000000'}
                            onChange={(e) => handleInputChange(e.target.value)}
                            disabled={disabled}
                            style={{
                                width: '40px',
                                height: '40px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        />
                        <input
                            type="text"
                            {...baseProps}
                            style={{ ...baseProps.style, flex: 1 }}
                        />
                    </div>
                );

            case 'select':
                return (
                    <select
                        {...baseProps}
                        onChange={(e) => handleInputChange(e.target.value)}
                        style={{
                            ...baseProps.style,
                            cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {definition.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'multiselect':
                return (
                    <select
                        {...baseProps}
                        multiple
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => option.value);
                            handleInputChange(values);
                        }}
                        style={{
                            ...baseProps.style,
                            height: '120px',
                            cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {definition.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'file':
                return (
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => handleInputChange(reader.result);
                                reader.readAsDataURL(file);
                            }
                        }}
                        disabled={disabled}
                        style={baseProps.style}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        {...baseProps}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                );

            case 'time':
                return (
                    <input
                        type="time"
                        {...baseProps}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                );

            case 'json':
                return (
                    <textarea
                        {...baseProps}
                        rows={5}
                        style={{ ...baseProps.style, fontFamily: 'monospace', fontSize: '12px' }}
                        value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleInputChange(parsed);
                            } catch {
                                handleInputChange(e.target.value);
                            }
                        }}
                    />
                );

            case 'code':
                return (
                    <textarea
                        {...baseProps}
                        rows={8}
                        style={{
                            ...baseProps.style,
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                            fontSize: '12px',
                            lineHeight: '1.4'
                        }}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        {...baseProps}
                    />
                );
        }
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            {definition.type !== 'boolean' && (
                <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#374151'
                }}>
                    {definition.label}
                    {definition.required && <span style={{ color: '#ef4444' }}>*</span>}
                    {definition.unit && <span style={{ color: '#6b7280' }}> ({definition.unit})</span>}
                </label>
            )}

            {renderInput()}

            {error && (
                <div style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#ef4444'
                }}>
                    {error}
                </div>
            )}

            {definition.description && (
                <div style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    color: '#6b7280'
                }}>
                    {definition.description}
                </div>
            )}
        </div>
    );
};

// 🎯 MAIN PROPERTIES PANEL COMPONENT
interface AdvancedPropertiesPanelProps {
    selectedElements?: EditorElement[];
    onElementUpdate?: (elementId: string, updates: Partial<EditorElement>) => void;
    onBatchUpdate?: (updates: Record<string, Partial<EditorElement>>) => void;
    customSchemas?: Record<string, PropertySchema>;
    enableBatchEditing?: boolean;
    enableHistory?: boolean;
    width?: number;
    height?: number;
    className?: string;
}

export const AdvancedPropertiesPanel: React.FC<AdvancedPropertiesPanelProps> = ({
    selectedElements = [],
    onElementUpdate,
    onBatchUpdate,
    customSchemas = {},
    enableBatchEditing = true,
    enableHistory = true,
    width = 320,
    height = 600,
    className = ''
}) => {
    const { core } = useEditorCore();
    const { selectedElements: coreSelectedElements } = useEditorSelection();

    const elements = selectedElements.length > 0 ? selectedElements : coreSelectedElements;
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({});
    const [changeHistory, setChangeHistory] = useState<Array<{ elementId: string; property: string; oldValue: any; newValue: any; timestamp: number }>>([]);

    // Merge schemas
    const allSchemas = useMemo(() => ({
        ...PROPERTY_SCHEMAS,
        ...customSchemas
    }), [customSchemas]);

    // Get schema for current selection
    const currentSchema = useMemo(() => {
        if (elements.length === 0) return null;
        if (elements.length === 1) {
            return allSchemas[elements[0].type] || null;
        }
        // For multiple selection, find common properties
        const commonType = elements.every(el => el.type === elements[0].type) ? elements[0].type : 'mixed';
        return allSchemas[commonType] || null;
    }, [elements, allSchemas]);

    // Filter properties by search
    const filteredProperties = useMemo(() => {
        if (!currentSchema || !searchQuery) return currentSchema?.properties || {};

        const filtered: Record<string, PropertyDefinition> = {};
        Object.entries(currentSchema.properties).forEach(([key, prop]) => {
            if (
                prop.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                filtered[key] = prop;
            }
        });

        return filtered;
    }, [currentSchema, searchQuery]);

    // Group filtered properties
    const groupedProperties = useMemo(() => {
        if (!currentSchema) return [];

        return currentSchema.groups
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(group => ({
                ...group,
                properties: group.properties.filter(propKey => propKey in filteredProperties)
            }))
            .filter(group => group.properties.length > 0);
    }, [currentSchema, filteredProperties]);

    // Validate property value
    const validateProperty = useCallback((definition: PropertyDefinition, value: any): string | null => {
        if (definition.required && (value === undefined || value === null || value === '')) {
            return `${definition.label} is required`;
        }

        if (definition.validation) {
            const { min, max, pattern, custom } = definition.validation;

            if (min !== undefined && (typeof value === 'number' && value < min)) {
                return `${definition.label} must be at least ${min}`;
            }

            if (max !== undefined && (typeof value === 'number' && value > max)) {
                return `${definition.label} must be at most ${max}`;
            }

            if (pattern && typeof value === 'string') {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    return `${definition.label} format is invalid`;
                }
            }

            if (custom) {
                return custom(value);
            }
        }

        return null;
    }, []);

    // Handle property change
    const handlePropertyChange = useCallback((elementId: string, propertyKey: string, newValue: any) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const definition = currentSchema?.properties[propertyKey];
        if (!definition) return;

        // Validate
        const error = validateProperty(definition, newValue);
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [elementId]: {
                    ...prev[elementId] || {},
                    [propertyKey]: error
                }
            }));
            return;
        } else {
            // Clear error
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                if (newErrors[elementId]) {
                    delete newErrors[elementId][propertyKey];
                    if (Object.keys(newErrors[elementId]).length === 0) {
                        delete newErrors[elementId];
                    }
                }
                return newErrors;
            });
        }

        // Store history
        if (enableHistory) {
            const oldValue = element.properties[propertyKey];
            setChangeHistory(prev => [
                ...prev.slice(-99), // Keep last 100 changes
                {
                    elementId,
                    property: propertyKey,
                    oldValue,
                    newValue,
                    timestamp: Date.now()
                }
            ]);
        }

        // Update element
        const updates: Partial<EditorElement> = {
            properties: {
                ...element.properties,
                [propertyKey]: newValue
            }
        };

        onElementUpdate?.(elementId, updates);
        core.updateElement(elementId, updates);

    }, [elements, currentSchema, validateProperty, enableHistory, onElementUpdate, core]);

    // Handle batch change (for multiple selection)
    const handleBatchChange = useCallback((propertyKey: string, newValue: any) => {
        if (!enableBatchEditing || elements.length <= 1) return;

        const updates: Record<string, Partial<EditorElement>> = {};

        elements.forEach(element => {
            updates[element.id] = {
                properties: {
                    ...element.properties,
                    [propertyKey]: newValue
                }
            };
        });

        onBatchUpdate?.(updates);

        // Update each element individually
        Object.entries(updates).forEach(([elementId, elementUpdates]) => {
            core.updateElement(elementId, elementUpdates);
        });

    }, [elements, enableBatchEditing, onBatchUpdate, core]);

    // Toggle group collapse
    const toggleGroup = useCallback((groupId: string) => {
        setCollapsedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    }, []);

    // Check if property should be shown based on conditional logic
    const shouldShowProperty = useCallback((definition: PropertyDefinition, element: EditorElement): boolean => {
        if (!definition.conditional) return true;

        const { property, value, operator = '===' } = definition.conditional;
        const actualValue = element.properties[property];

        switch (operator) {
            case '===':
                return actualValue === value;
            case '!==':
                return actualValue !== value;
            case '>':
                return actualValue > value;
            case '<':
                return actualValue < value;
            case 'includes':
                return Array.isArray(actualValue) && actualValue.includes(value);
            default:
                return true;
        }
    }, []);

    if (elements.length === 0) {
        return (
            <div
                className={`advanced-properties-panel ${className}`}
                style={{
                    width,
                    height,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                }}
            >
                Select an element to edit properties
            </div>
        );
    }

    return (
        <div
            className={`advanced-properties-panel ${className}`}
            style={{
                width,
                height,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '8px'
                }}>
                    Properties
                    {elements.length > 1 && (
                        <span style={{ color: '#6b7280', fontWeight: 400 }}>
                            {' '}({elements.length} selected)
                        </span>
                    )}
                </h3>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '16px'
            }}>
                {groupedProperties.map(group => {
                    const isCollapsed = collapsedGroups.has(group.id);

                    return (
                        <div key={group.id} style={{ marginBottom: '16px' }}>
                            {/* Group Header */}
                            <button
                                onClick={() => toggleGroup(group.id)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#374151'
                                }}
                            >
                                <span>{group.icon}</span>
                                <span style={{ flex: 1, textAlign: 'left' }}>{group.label}</span>
                                <span style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    ▼
                                </span>
                            </button>

                            {/* Group Content */}
                            {!isCollapsed && (
                                <div style={{
                                    marginTop: '8px',
                                    padding: '8px',
                                    background: '#fafafa',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '4px'
                                }}>
                                    {group.properties.map(propKey => {
                                        const definition = filteredProperties[propKey];
                                        if (!definition) return null;

                                        // For single element
                                        if (elements.length === 1) {
                                            const element = elements[0];

                                            if (!shouldShowProperty(definition, element)) {
                                                return null;
                                            }

                                            return (
                                                <PropertyInput
                                                    key={propKey}
                                                    definition={definition}
                                                    value={element.properties[propKey]}
                                                    onChange={(value) => handlePropertyChange(element.id, propKey, value)}
                                                    error={validationErrors[element.id]?.[propKey]}
                                                />
                                            );
                                        }

                                        // For multiple elements (batch editing)
                                        if (enableBatchEditing) {
                                            const commonValue = elements.every(el =>
                                                el.properties[propKey] === elements[0].properties[propKey]
                                            ) ? elements[0].properties[propKey] : '(mixed)';

                                            return (
                                                <PropertyInput
                                                    key={propKey}
                                                    definition={definition}
                                                    value={commonValue === '(mixed)' ? '' : commonValue}
                                                    onChange={(value) => handleBatchChange(propKey, value)}
                                                    disabled={commonValue === '(mixed)'}
                                                />
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer - History */}
            {enableHistory && changeHistory.length > 0 && (
                <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px'
                    }}>
                        Recent Changes
                    </div>
                    <div style={{
                        maxHeight: '100px',
                        overflow: 'auto',
                        fontSize: '11px',
                        color: '#4b5563'
                    }}>
                        {changeHistory.slice(-5).reverse().map((change, index) => (
                            <div key={index} style={{ marginBottom: '2px' }}>
                                {change.property}: {String(change.oldValue)} → {String(change.newValue)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedPropertiesPanel;