import React, { useState, useEffect } from 'react';
import { Code2, Eye, EyeOff, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableScriptProps {
    code: string;
    visible?: boolean;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 📜 COMPONENTE DE SCRIPT EDITÁVEL
 * 
 * Permite adicionar JavaScript inline editável:
 * - Editor de código com syntax highlighting básico
 * - Execução no preview
 * - Visibilidade configurável
 * - Indicador de invisibilidade
 */
export default function EditableScript({
    code = '',
    visible = false,
    isEditable = false,
    onEdit = () => { }
}: EditableScriptProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localCode, setLocalCode] = useState(code);

    useEffect(() => {
        setLocalCode(code);
    }, [code]);

    const handleSaveCode = () => {
        onEdit('code', localCode);
        setIsExpanded(false);
    };

    const executeScript = () => {
        if (!code.trim()) return;

        try {
            // Criar um script element e executar
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);

            // Remover após execução para evitar duplicação
            setTimeout(() => {
                document.head.removeChild(script);
            }, 100);

            console.log('Script executado com sucesso');
        } catch (error) {
            console.error('Erro ao executar script:', error);
        }
    };

    if (!isEditable) {
        // MODO PREVIEW: Executar script se não for invisível
        useEffect(() => {
            if (code.trim() && !visible) {
                executeScript();
            }
        }, [code]);

        if (visible) {
            return (
                <div className="w-full p-4 text-sm text-green-500 bg-zinc-800 rounded-md border font-mono">
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                        {code || '// Nenhum código definido'}
                    </pre>
                </div>
            );
        }

        return null; // Script invisível no preview
    }

    // MODO EDIÇÃO: Editor completo
    return (
        <div className="relative group">
            <div className="w-full p-2 text-sm text-green-500 bg-zinc-800 rounded-md border-none min-h-[120px] flex flex-col">
                {isExpanded ? (
                    // Editor expandido
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-green-400 text-xs">JavaScript Editor</span>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSaveCode}
                                    className="h-6 px-2 bg-green-600 text-white border-green-500 hover:bg-green-700"
                                >
                                    <Save className="w-3 h-3 mr-1" />
                                    Salvar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsExpanded(false)}
                                    className="h-6 px-2"
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                        <textarea
                            value={localCode}
                            onChange={(e) => setLocalCode(e.target.value)}
                            className="flex-1 bg-zinc-900 text-green-400 font-mono text-sm p-3 rounded border border-green-600 resize-none outline-none"
                            placeholder="// Digite seu código JavaScript aqui..."
                            spellCheck={false}
                        />
                        <div className="mt-2 text-xs text-green-300">
                            💡 Use console.log() para debug. O código será executado no preview.
                        </div>
                    </div>
                ) : (
                    // Visualização compacta
                    <div className="flex-1 flex flex-col">
                        <pre className="flex-1 whitespace-pre-wrap overflow-hidden text-xs">
                            {code.substring(0, 200) || '// Clique para editar o código JavaScript...'}
                            {code.length > 200 && '...'}
                        </pre>

                        <div className="flex justify-between items-center mt-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsExpanded(true)}
                                className="h-6 px-2 bg-green-600 text-white border-green-500 hover:bg-green-700"
                            >
                                <Code2 className="w-3 h-3 mr-1" />
                                Editar
                            </Button>

                            {/* Controles de Visibilidade */}
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEdit('visible', !visible)}
                                    className={`h-6 px-2 ${visible
                                            ? 'bg-blue-600 text-white border-blue-500'
                                            : 'bg-yellow-600 text-white border-yellow-500'
                                        }`}
                                    title={visible ? 'Tornar invisível' : 'Tornar visível'}
                                >
                                    {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={executeScript}
                                    className="h-6 px-2 bg-purple-600 text-white border-purple-500 hover:bg-purple-700"
                                    title="Testar execução"
                                >
                                    <Play className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Indicador de Invisibilidade */}
                {!visible && (
                    <div className="absolute bottom-2 right-2 bg-yellow-400 opacity-75 text-black p-1 rounded text-xs font-bold">
                        Invisível
                    </div>
                )}
            </div>

            {/* Indicador de Estado */}
            <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                    {visible ? '👁️ Visível no preview' : '🔒 Executa em background'}
                </span>
            </div>
        </div>
    );
}