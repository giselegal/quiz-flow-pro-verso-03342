/**
 * 📄 STEP CONTEXT - Nível 2: Configurações da Etapa
 * 
 * Renderiza configurações quando uma etapa está selecionada:
 * - 📝 Conteúdo (nome, tipo, ordem)
 * - 🎨 Tema (cores e fontes específicas da etapa)
 * - ✨ Animações (entrada/saída)
 * - 🧠 Lógica condicional
 */

import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Palette, Sparkles, Brain } from 'lucide-react';

import { CollapsibleSection } from '../components/CollapsibleSection';

// ============================================================================
// TYPES
// ============================================================================

interface StepContextProps {
    stepId: string;
    data: any;
    editor: any;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StepContext({ stepId, data, editor }: StepContextProps) {
    const handleUpdateMetadata = (updates: any) => {
        if (editor?.actions?.updateStepMetadata) {
            editor.actions.updateStepMetadata(stepId, updates);
        }
    };

    const blockCount = data?.blocks?.length || 0;
    const stepCategory = data?.metadata?.category || 'default';

    return (
        <div className="space-y-4">

            {/* Quick Info */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{stepId}</Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <Badge>{stepCategory}</Badge>
                </div>
                <Badge variant="secondary">{blockCount} blocos</Badge>
            </div>

            {/* Accordion com seções */}
            <Accordion type="multiple" defaultValue={['content']} className="space-y-3">

                {/* ===== CONTEÚDO ===== */}
                <CollapsibleSection
                    id="content"
                    title="Conteúdo da Etapa"
                    icon={<FileText className="w-4 h-4" />}
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="step-name">Nome da Etapa</Label>
                            <Input
                                id="step-name"
                                value={data?.metadata?.name || ''}
                                onChange={(e) => handleUpdateMetadata({ name: e.target.value })}
                                placeholder="Ex: Introdução"
                            />
                        </div>

                        <div>
                            <Label htmlFor="step-category">Tipo da Etapa</Label>
                            <Select
                                value={stepCategory}
                                onValueChange={(value) => handleUpdateMetadata({ category: value })}
                            >
                                <SelectTrigger id="step-category">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="intro">📋 Introdução</SelectItem>
                                    <SelectItem value="question">❓ Pergunta</SelectItem>
                                    <SelectItem value="transition">⏳ Transição</SelectItem>
                                    <SelectItem value="result">🎯 Resultado</SelectItem>
                                    <SelectItem value="lead">📧 Captura de Lead</SelectItem>
                                    <SelectItem value="offer">💰 Oferta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ordem</Label>
                                <Input
                                    value={data?.metadata?.order || ''}
                                    onChange={(e) => handleUpdateMetadata({ order: parseInt(e.target.value) })}
                                    type="number"
                                    min="1"
                                />
                            </div>

                            <div>
                                <Label>Total de Blocos</Label>
                                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                                    <span className="text-sm font-medium">{blockCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* ===== TEMA ===== */}
                <CollapsibleSection
                    id="theme"
                    title="Tema da Etapa"
                    icon={<Palette className="w-4 h-4" />}
                >
                    <ThemePlaceholder />
                </CollapsibleSection>

                {/* ===== ANIMAÇÕES ===== */}
                <CollapsibleSection
                    id="animations"
                    title="Animações"
                    icon={<Sparkles className="w-4 h-4" />}
                >
                    <AnimationPlaceholder />
                </CollapsibleSection>

                {/* ===== LÓGICA ===== */}
                <CollapsibleSection
                    id="logic"
                    title="Lógica Condicional"
                    icon={<Brain className="w-4 h-4" />}
                >
                    <LogicPlaceholder />
                </CollapsibleSection>

            </Accordion>
        </div>
    );
}

// ============================================================================
// PLACEHOLDERS
// ============================================================================

function ThemePlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tema da Etapa</p>
            <p className="text-xs mt-1">Cores e fontes específicas</p>
        </div>
    );
}

function AnimationPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Animações</p>
            <p className="text-xs mt-1">Entrada, saída e transições</p>
        </div>
    );
}

function LogicPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Lógica Condicional</p>
            <p className="text-xs mt-1">Regras de exibição e navegação</p>
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default StepContext;
