import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { BlockDefinition } from '@/core/quiz/blocks/types';
import type { BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';

interface DynamicPropertyRendererProps {
    blockType: string;
    definition?: BlockDefinition;
    schema: BlockTypeSchema | null;
    properties: Record<string, any>;
    errors: Record<string, string>;
    onChange: (key: string, value: any) => void;
    onJsonTextChange?: (key: string, text: string) => void;
    getJsonBuffer?: (key: string) => string;
}

/**
 * Renderizador responsável por adaptar BlockDefinition → DynamicPropertyControls.
 * Centraliza o fallback quando ainda não existe schema derivado.
 */
export const DynamicPropertyRenderer: React.FC<DynamicPropertyRendererProps> = ({
    blockType,
    definition,
    schema,
    properties,
    errors,
    onChange,
    onJsonTextChange,
    getJsonBuffer,
}) => {
    if (!schema) {
        return (
            <Card className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div className="space-y-1 text-xs">
                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                            Nenhum schema disponível
                        </p>
                        <p className="text-amber-800 dark:text-amber-200">
                            {definition ? (
                                <>Bloco <code>{definition.name}</code> ainda não exporta propriedades nocode.</>
                            ) : (
                                <>Bloco <code>{blockType}</code> não foi encontrado no registry.</>
                            )}
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                            Adicione uma definição em `BlockRegistry` ou mantenha um schema legado no `SchemaInterpreter`.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <DynamicPropertyControls
            elementType={blockType}
            schemaOverride={schema}
            properties={properties}
            onChange={onChange}
            errors={errors}
            onJsonTextChange={onJsonTextChange}
            getJsonBuffer={getJsonBuffer}
        />
    );
};
