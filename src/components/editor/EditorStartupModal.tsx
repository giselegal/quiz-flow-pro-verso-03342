/**
 * 🎯 EDITOR STARTUP MODAL
 * 
 * Modal de escolha inicial para o usuário decidir como começar no editor:
 * - Canvas vazio (modo construção livre)
 * - Template pré-pronto (21 etapas)
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface EditorStartupModalProps {
    open: boolean;
    onSelectMode: (mode: 'blank' | 'template') => void;
}

export function EditorStartupModal({ open, onSelectMode }: EditorStartupModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    console.log('🎯🎯🎯 EDITOR STARTUP MODAL RENDERIZADO!!! 🎯🎯🎯');
    console.log('Modal open:', open);
    console.log('Timestamp:', new Date().toISOString());

    // Permitir fechar o modal escolhendo modo blank
    const handleClose = () => {
        console.log('❌ Modal fechado via X ou backdrop');
        if (dontShowAgain) {
            localStorage.setItem('editor:skipStartupModal', 'true');
            console.log('✅ Preferência salva: não mostrar modal novamente');
        }
        onSelectMode('blank');
    };

    const handleSelectMode = (mode: 'blank' | 'template') => {
        console.log(`🎨 Modo selecionado: ${mode}`);
        if (dontShowAgain) {
            localStorage.setItem('editor:skipStartupModal', 'true');
            console.log('✅ Preferência salva: não mostrar modal novamente');
        }
        onSelectMode(mode);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent
                className="sm:max-w-[600px]"
                data-testid="editor-startup-modal"
            >
                <button
                    onClick={handleClose}
                    data-testid="editor-startup-modal-close"
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    aria-label="Fechar"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                </button>

                <DialogHeader>
                    <DialogTitle className="text-2xl">Como deseja começar?</DialogTitle>
                </DialogHeader>                <div className="grid grid-cols-2 gap-4 py-6">
                    {/* Opção 1: Canvas Vazio */}
                    <button
                        onClick={() => handleSelectMode('blank')}
                        data-testid="editor-startup-blank-button"
                        className="flex flex-col items-center gap-4 p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg mb-1">Começar do Zero</h3>
                            <p className="text-sm text-gray-500">
                                Canvas vazio para construir seu funil personalizado
                            </p>
                        </div>
                    </button>

                    {/* Opção 2: Usar Template */}
                    <button
                        onClick={() => handleSelectMode('template')}
                        data-testid="editor-startup-template-button"
                        className="flex flex-col items-center gap-4 p-6 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-gray-600 group-hover:text-purple-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg mb-1">Usar Template</h3>
                            <p className="text-sm text-gray-500">
                                Começar com quiz completo de 21 etapas
                            </p>
                        </div>
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                    <input
                        type="checkbox"
                        id="dontShowAgain"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dontShowAgain" className="text-sm text-gray-600 cursor-pointer">
                        Não mostrar novamente
                    </label>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    💡 Você poderá adicionar/remover etapas depois
                </p>
            </DialogContent>
        </Dialog>
    );
}
