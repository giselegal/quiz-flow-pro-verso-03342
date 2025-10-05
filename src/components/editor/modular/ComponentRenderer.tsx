/**
 * 🎨 RENDERIZADOR DE COMPONENTES MODULARES
 * 
 * Sistema de renderização para componentes modulares no editor
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import { ModularComponent } from '@/types/modular-editor';
import { getComponent } from './ComponentRegistry';

interface ComponentRendererProps {
    component: ModularComponent;
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: (componentId: string) => void;
    onUpdate?: (componentId: string, newProps: any) => void;
    onDelete?: (componentId: string) => void;
    renderContext?: 'editor' | 'preview' | 'runtime';
    stepData?: any; // Dados contextuais da etapa atual
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate,
    onDelete,
    renderContext = 'runtime',
    stepData,
}) => {
    const Component = getComponent(component.type);

    if (!Component) {
        console.warn(`Componente não encontrado: ${component.type}`);
        return (
            <Box
                p={4}
                border="2px dashed"
                borderColor="red.300"
                borderRadius="md"
                bg="red.50"
                color="red.600"
                textAlign="center"
            >
                Componente "{component.type}" não encontrado
            </Box>
        );
    }

    const handleSelect = () => {
        if (onSelect && isEditable) {
            onSelect(component.id);
        }
    };

    const handleUpdate = (newProps: Partial<any>) => {
        if (onUpdate && isEditable) {
            onUpdate(component.id, newProps);
        }
    };

    // Props específicas para cada contexto de renderização
    const contextProps = {
        editor: {
            isEditable: true,
            isSelected,
            onSelect: handleSelect,
            onUpdate: handleUpdate,
        },
        preview: {
            isEditable: false,
            isSelected: false,
        },
        runtime: {
            isEditable: false,
            isSelected: false,
        },
    };

    // Props finais do componente
    const finalProps = {
        ...component.props,
        ...contextProps[renderContext],
        style: component.style,
        stepData, // Dados contextuais disponíveis para todos os componentes
    };

    return (
        <Box
            key={component.id}
            data-component-id={component.id}
            data-component-type={component.type}
            position="relative"
        >
            <Component {...finalProps} />
        </Box>
    );
};

// Renderizador para lista de componentes
interface ComponentListRendererProps {
    components: ModularComponent[];
    selectedComponentId?: string;
    isEditable?: boolean;
    onComponentSelect?: (componentId: string) => void;
    onComponentUpdate?: (componentId: string, newProps: any) => void;
    onComponentDelete?: (componentId: string) => void;
    renderContext?: 'editor' | 'preview' | 'runtime';
    stepData?: any;
    spacing?: number;
}

export const ComponentListRenderer: React.FC<ComponentListRendererProps> = ({
    components,
    selectedComponentId,
    isEditable = false,
    onComponentSelect,
    onComponentUpdate,
    onComponentDelete,
    renderContext = 'runtime',
    stepData,
    spacing = 4,
}) => {
    return (
        <Box w="full" h="full">
            {components.map((component, index) => (
                <Box
                    key={component.id}
                    mb={index < components.length - 1 ? spacing : 0}
                >
                    <ComponentRenderer
                        component={component}
                        isEditable={isEditable}
                        isSelected={selectedComponentId === component.id}
                        onSelect={onComponentSelect}
                        onUpdate={onComponentUpdate}
                        onDelete={onComponentDelete}
                        renderContext={renderContext}
                        stepData={stepData}
                    />
                </Box>
            ))}
        </Box>
    );
};

// Hook para renderização de componentes
export const useComponentRenderer = () => {
    const renderComponent = (
        component: ModularComponent,
        options: Partial<ComponentRendererProps> = {}
    ) => {
        return (
            <ComponentRenderer
                component={component}
                {...options}
            />
        );
    };

    const renderComponents = (
        components: ModularComponent[],
        options: Partial<ComponentListRendererProps> = {}
    ) => {
        return (
            <ComponentListRenderer
                components={components}
                {...options}
            />
        );
    };

    return {
        renderComponent,
        renderComponents,
    };
};

export default ComponentRenderer;