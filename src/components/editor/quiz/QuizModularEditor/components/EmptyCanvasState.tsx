/**
 * 🎯 EMPTY CANVAS STATE
 * 
 * Componente exibido quando o canvas está vazio (modo construção livre)
 * Oferece opções para:
 * - Adicionar blocos da biblioteca
 * - Carregar template pré-pronto
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, FileText } from 'lucide-react';

interface EmptyCanvasStateProps {
    onLoadTemplate?: () => void;
}

export const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({ onLoadTemplate }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center max-w-md space-y-4">
                {/* Ícone */}
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-2">
                    <FileText className="w-10 h-10 text-blue-600" />
                </div>

                {/* Título */}
                <h3 className="text-2xl font-semibold text-gray-800">Canvas Vazio</h3>
                
                {/* Descrição */}
                <p className="text-gray-600 leading-relaxed">
                    Você escolheu começar do zero! Adicione blocos da biblioteca à esquerda 
                    ou carregue um template pré-pronto para começar rapidamente.
                </p>

                {/* Ações */}
                <div className="flex flex-col gap-3 pt-4">
                    {/* Botão principal: Carregar Template */}
                    {onLoadTemplate && (
                        <Button
                            size="lg"
                            onClick={onLoadTemplate}
                            className="gap-2 w-full shadow-md hover:shadow-lg transition-shadow"
                        >
                            <Sparkles className="w-5 h-5" />
                            Carregar Template de 21 Etapas
                        </Button>
                    )}

                    {/* Divisor */}
                    <div className="flex items-center gap-3 py-2">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-500 font-medium">ou</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Instruções */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 text-left">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">
                                Adicionar blocos manualmente
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Arraste componentes da biblioteca para o canvas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dica */}
                <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    💡 <strong>Dica:</strong> Você pode adicionar ou remover etapas a qualquer momento
                </p>
            </div>
        </div>
    );
};

export default EmptyCanvasState;
