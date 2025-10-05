/**
 * 🎯 DEMO DO SISTEMA CANVAS HÍBRIDO
 * 
 * Demonstração de como funcionaria o novo sistema canvas integrado
 * com nosso editor WYSIWYG atual
 */

import React, { useState, useCallback } from 'react';
import { VerticalCanvas, CanvasStep, CanvasItem, createCanvasItem, convertStepToCanvas } from './CanvasSystem';

// =============================================================================
// EXEMPLO DE FUNCIONAMENTO PRÁTICO
// =============================================================================

export const CanvasDemoEditor: React.FC = () => {
    // Estado do canvas atual
    const [currentStep, setCurrentStep] = useState<CanvasStep>(() => {
        // Exemplo de step convertido para canvas
        const mockStep = {
            id: 'intro-step',
            type: 'intro',
            title: 'Descubra Seu Estilo Pessoal',
            image: 'https://example.com/style-image.jpg',
            formQuestion: 'Como posso te chamar?',
            placeholder: 'Digite seu nome aqui...',
            buttonText: 'Começar Quiz'
        };

        return convertStepToCanvas(mockStep);
    });

    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(true);

    // Handlers do canvas
    const handleItemSelect = useCallback((itemId: string) => {
        setSelectedItemId(itemId);
        console.log('🎯 Item selecionado:', itemId);
    }, []);

    const handleItemUpdate = useCallback((itemId: string, updates: Partial<CanvasItem>) => {
        setCurrentStep(prev => ({
            ...prev,
            canvasItems: prev.canvasItems.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
            )
        }));
        console.log('📝 Item atualizado:', itemId, updates);
    }, []);

    const handleItemAdd = useCallback((type: CanvasItem['type'], afterIndex?: number) => {
        const newOrder = afterIndex !== undefined ? afterIndex + 1 : currentStep.canvasItems.length;

        // Ajustar ordens dos items subsequentes
        const updatedItems = currentStep.canvasItems.map(item =>
            item.order >= newOrder ? { ...item, order: item.order + 1 } : item
        );

        // Dados padrão por tipo
        const defaultData = {
            heading: { text: 'Novo Título', level: 2, alignment: 'center' },
            image: { src: 'https://via.placeholder.com/400x300', alt: 'Nova imagem' },
            input: { label: 'Novo Campo', placeholder: 'Digite aqui...', required: false },
            button: { text: 'Novo Botão', variant: 'primary', fullWidth: true },
            text: { content: 'Novo texto...', fontSize: 'base' },
            divider: { style: 'solid', color: 'gray' },
            spacer: { height: '20px' }
        };

        const newItem = createCanvasItem(type, newOrder, defaultData[type] || {});

        setCurrentStep(prev => ({
            ...prev,
            canvasItems: [...updatedItems, newItem]
        }));

        // Auto-selecionar o novo item
        setSelectedItemId(newItem.id);
        console.log('➕ Item adicionado:', type, newItem.id);
    }, [currentStep.canvasItems]);

    const handleItemDelete = useCallback((itemId: string) => {
        const itemToDelete = currentStep.canvasItems.find(item => item.id === itemId);
        if (!itemToDelete) return;

        // Remover item e ajustar ordens
        const updatedItems = currentStep.canvasItems
            .filter(item => item.id !== itemId)
            .map(item =>
                item.order > itemToDelete.order
                    ? { ...item, order: item.order - 1 }
                    : item
            );

        setCurrentStep(prev => ({
            ...prev,
            canvasItems: updatedItems
        }));

        // Limpar seleção se era o item selecionado
        if (selectedItemId === itemId) {
            setSelectedItemId('');
        }

        console.log('🗑️ Item removido:', itemId);
    }, [currentStep.canvasItems, selectedItemId]);

    const handleItemReorder = useCallback((fromIndex: number, toIndex: number) => {
        const items = [...currentStep.canvasItems].sort((a, b) => a.order - b.order);

        // Mover item
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        // Reordenar
        const reorderedItems = items.map((item, index) => ({
            ...item,
            order: index
        }));

        setCurrentStep(prev => ({
            ...prev,
            canvasItems: reorderedItems
        }));

        console.log('🔄 Item reordenado:', fromIndex, '->', toIndex);
    }, [currentStep.canvasItems]);

    return (
        <div className="canvas-demo-editor h-full flex">
            {/* Sidebar de Controles */}
            <div className="w-80 bg-gray-50 border-r p-4">
                <div className="space-y-4">
                    {/* Controles do Editor */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Controles do Editor</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditMode(!isEditMode)}
                                className={`px-3 py-1 rounded text-sm ${isEditMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {isEditMode ? '📝 Editando' : '👁️ Preview'}
                            </button>
                        </div>
                    </div>

                    {/* Adicionar Componentes */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Adicionar Componentes</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleItemAdd('heading')}
                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded text-sm"
                            >
                                📝 Título
                            </button>
                            <button
                                onClick={() => handleItemAdd('image')}
                                className="p-2 bg-green-100 hover:bg-green-200 rounded text-sm"
                            >
                                🖼️ Imagem
                            </button>
                            <button
                                onClick={() => handleItemAdd('input')}
                                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded text-sm"
                            >
                                📝 Campo
                            </button>
                            <button
                                onClick={() => handleItemAdd('button')}
                                className="p-2 bg-purple-100 hover:bg-purple-200 rounded text-sm"
                            >
                                🔘 Botão
                            </button>
                            <button
                                onClick={() => handleItemAdd('text')}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            >
                                📄 Texto
                            </button>
                            <button
                                onClick={() => handleItemAdd('spacer')}
                                className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded text-sm"
                            >
                                📏 Espaço
                            </button>
                        </div>
                    </div>

                    {/* Estrutura do Canvas */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Estrutura do Canvas</h3>
                        <div className="space-y-1 text-sm">
                            {currentStep.canvasItems
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`p-2 rounded cursor-pointer flex justify-between items-center ${selectedItemId === item.id
                                                ? 'bg-blue-200 border-blue-400'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                            } border`}
                                        onClick={() => handleItemSelect(item.id)}
                                    >
                                        <span>
                                            {index + 1}. {item.type}
                                            {item.type === 'heading' && ` - "${item.data.text}"`}
                                            {item.type === 'button' && ` - "${item.data.text}"`}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleItemDelete(item.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Propriedades do Item Selecionado */}
                    {selectedItemId && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Propriedades</h3>
                            <ItemPropertiesPanel
                                item={currentStep.canvasItems.find(i => i.id === selectedItemId)!}
                                onUpdate={(updates) => handleItemUpdate(selectedItemId, updates)}
                            />
                        </div>
                    )}

                    {/* Debug Info */}
                    <div className="space-y-2 text-xs text-gray-600">
                        <h3 className="font-semibold">Debug Info</h3>
                        <div>Items: {currentStep.canvasItems.length}</div>
                        <div>Selecionado: {selectedItemId || 'Nenhum'}</div>
                        <div>Modo: {isEditMode ? 'Edição' : 'Preview'}</div>
                    </div>
                </div>
            </div>

            {/* Canvas Principal */}
            <div className="flex-1 bg-white">
                <VerticalCanvas
                    step={currentStep}
                    isEditable={isEditMode}
                    selectedItemId={selectedItemId}
                    onItemSelect={handleItemSelect}
                    onItemUpdate={handleItemUpdate}
                    onItemReorder={handleItemReorder}
                    onItemAdd={handleItemAdd}
                    onItemDelete={handleItemDelete}
                />
            </div>
        </div>
    );
};

// =============================================================================
// PAINEL DE PROPRIEDADES DINÂMICO
// =============================================================================

interface ItemPropertiesPanelProps {
    item: CanvasItem;
    onUpdate: (updates: Partial<CanvasItem>) => void;
}

const ItemPropertiesPanel: React.FC<ItemPropertiesPanelProps> = ({ item, onUpdate }) => {
    const updateData = (key: string, value: any) => {
        onUpdate({
            data: { ...item.data, [key]: value }
        });
    };

    // Propriedades específicas por tipo
    const renderProperties = () => {
        switch (item.type) {
            case 'heading':
                return (
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium mb-1">Texto</label>
                            <input
                                type="text"
                                value={item.data.text || ''}
                                onChange={(e) => updateData('text', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Nível</label>
                            <select
                                value={item.data.level || 1}
                                onChange={(e) => updateData('level', parseInt(e.target.value))}
                                className="w-full p-1 border rounded text-xs"
                            >
                                <option value={1}>H1</option>
                                <option value={2}>H2</option>
                                <option value={3}>H3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Alinhamento</label>
                            <select
                                value={item.data.alignment || 'center'}
                                onChange={(e) => updateData('alignment', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            >
                                <option value="left">Esquerda</option>
                                <option value="center">Centro</option>
                                <option value="right">Direita</option>
                            </select>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium mb-1">URL da Imagem</label>
                            <input
                                type="url"
                                value={item.data.src || ''}
                                onChange={(e) => updateData('src', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Texto Alternativo</label>
                            <input
                                type="text"
                                value={item.data.alt || ''}
                                onChange={(e) => updateData('alt', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                    </div>
                );

            case 'input':
                return (
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium mb-1">Label</label>
                            <input
                                type="text"
                                value={item.data.label || ''}
                                onChange={(e) => updateData('label', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={item.data.placeholder || ''}
                                onChange={(e) => updateData('placeholder', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-xs">
                                <input
                                    type="checkbox"
                                    checked={item.data.required || false}
                                    onChange={(e) => updateData('required', e.target.checked)}
                                    className="mr-1"
                                />
                                Campo obrigatório
                            </label>
                        </div>
                    </div>
                );

            case 'button':
                return (
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium mb-1">Texto</label>
                            <input
                                type="text"
                                value={item.data.text || ''}
                                onChange={(e) => updateData('text', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Estilo</label>
                            <select
                                value={item.data.variant || 'primary'}
                                onChange={(e) => updateData('variant', e.target.value)}
                                className="w-full p-1 border rounded text-xs"
                            >
                                <option value="primary">Primário</option>
                                <option value="secondary">Secundário</option>
                                <option value="outline">Contorno</option>
                                <option value="ghost">Ghost</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center text-xs">
                                <input
                                    type="checkbox"
                                    checked={item.data.fullWidth || false}
                                    onChange={(e) => updateData('fullWidth', e.target.checked)}
                                    className="mr-1"
                                />
                                Largura total
                            </label>
                        </div>
                    </div>
                );

            default:
                return <div className="text-xs text-gray-500">Propriedades não disponíveis</div>;
        }
    };

    return (
        <div className="bg-white border rounded p-2">
            <div className="text-xs font-medium mb-2 text-gray-600">
                {item.type.toUpperCase()} - ID: {item.id.slice(-8)}
            </div>
            {renderProperties()}
        </div>
    );
};

export default CanvasDemoEditor;