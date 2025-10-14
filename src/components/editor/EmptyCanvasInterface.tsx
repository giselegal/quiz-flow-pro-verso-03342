import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Wand2 } from 'lucide-react';
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
import { useNotification } from '@/components/ui/Notification';

/**
 * 🆕 INTERFACE PARA CANVAS VAZIO
 * Componente que aparece quando o canvas está completamente vazio (totalSteps = 0)
 * e oferece opções para o usuário começar a criar seu funil do zero
 */

interface EmptyCanvasInterfaceProps {
    onCreateFirstStep?: () => void;
    className?: string;
}

export const EmptyCanvasInterface: React.FC<EmptyCanvasInterfaceProps> = ({
    onCreateFirstStep,
    className = ''
}) => {
    const { actions } = usePureBuilder();
    const { addNotification } = useNotification();

    const handleCreateFirstStep = async () => {
        try {
            await actions.createFirstStep();
            addNotification('✅ Primeira etapa criada! Comece editando seu funil.', 'success');

            // Callback opcional para componente pai
            onCreateFirstStep?.();
        } catch (error) {
            console.error('❌ Erro ao criar primeira etapa:', error);
            addNotification('❌ Erro ao criar primeira etapa. Tente novamente.', 'error');
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-white/80 to-stone-50/80 rounded-xl border-2 border-dashed border-stone-200 ${className}`}>
            {/* Ícone principal */}
            <div className="mb-6 p-4 bg-gradient-to-br from-[#B89B7A] to-[#8B7355] rounded-full text-white">
                <Wand2 className="w-12 h-12" />
            </div>

            {/* Título e descrição */}
            <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
                Canvas Vazio - Comece do Zero
            </h2>
            <p className="text-stone-600 text-center mb-8 max-w-md leading-relaxed">
                Crie seu funil personalizado do zero! Comece adicionando sua primeira etapa
                e construa uma experiência única para seus usuários.
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Botão principal: Criar primeira etapa */}
                <Button
                    onClick={handleCreateFirstStep}
                    size="lg"
                    className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] hover:from-[#8B7355] to-[#6B5943] text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Primeira Etapa
                </Button>

                {/* Botão secundário: Usar template (futuro) */}
                <Button
                    variant="outline"
                    size="lg"
                    className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-3 transition-all duration-200"
                    onClick={() => addNotification('🔄 Galeria de templates em desenvolvimento')}
                >
                    <Zap className="w-5 h-5 mr-2" />
                    Usar Template
                </Button>
            </div>

            {/* Dicas úteis */}
            <div className="mt-8 p-6 bg-blue-50/80 rounded-lg border border-blue-100 max-w-md">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Dicas para começar:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Comece com uma etapa de introdução</li>
                    <li>• Use a sidebar para adicionar componentes</li>
                    <li>• Configure as propriedades no painel direito</li>
                    <li>• Teste no modo preview (ícone olho)</li>
                </ul>
            </div>

            {/* Informações técnicas (desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-stone-100 rounded text-xs text-stone-600 font-mono">
                    🔧 DEV: Canvas vazio detectado (totalSteps = 0)
                </div>
            )}
        </div>
    );
};

export default EmptyCanvasInterface;