import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    Link as LinkIcon,
    Zap,
    Eye,
    ArrowRight
} from 'lucide-react';
import StepNoCodeConnections from './StepNoCodeConnections';
import { NoCodeConfigPanel } from '@/pages/admin/NoCodeConfigPage';

interface EditorNoCodePanelProps {
    className?: string;
}

const EditorNoCodePanel: React.FC<EditorNoCodePanelProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('connections');

    // Verificar se há configurações salvas
    const hasConnectionsConfig = localStorage.getItem('quiz-step-connections') !== null;
    const hasNoCodeConfig = localStorage.getItem('quiz-nocode-config') !== null;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className={`relative border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white ${className}`}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações NOCODE
                    {(hasConnectionsConfig || hasNoCodeConfig) && (
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-[#B89B7A] text-white text-xs"
                        >
                            {[hasConnectionsConfig, hasNoCodeConfig].filter(Boolean).length}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:w-[800px] lg:w-[1000px] overflow-y-auto"
                style={{ backgroundColor: '#FAF9F7' }}
            >
                <SheetHeader className="border-b pb-4 mb-6" style={{ borderColor: '#E6DDD4' }}>
                    <SheetTitle className="text-2xl text-[#432818] flex items-center gap-2">
                        <Zap className="w-6 h-6" style={{ color: '#B89B7A' }} />
                        Configurações NOCODE
                    </SheetTitle>
                    <p className="text-[#8F7A6A]">
                        Configure seu funil sem precisar de código - diretamente no editor
                    </p>
                </SheetHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="connections" className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Conexões
                            {hasConnectionsConfig && (
                                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs">
                                    ✓
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Geral
                            {hasNoCodeConfig && (
                                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs">
                                    ✓
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    {/* Aba de Conexões entre Etapas */}
                    <TabsContent value="connections" className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6DDD4' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <LinkIcon className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                <h3 className="font-semibold text-[#432818]">Conexões Entre Etapas</h3>
                            </div>
                            <p className="text-sm text-[#8F7A6A] mb-4">
                                Configure como as etapas do seu quiz se conectam. Defina fluxos lineares ou condicionais baseados nas respostas dos usuários.
                            </p>

                            {/* Preview rápido das conexões */}
                            {hasConnectionsConfig && (
                                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                                    <div className="text-xs text-[#8F7A6A] mb-1">CONFIGURAÇÃO ATUAL</div>
                                    <div className="text-sm text-[#432818]">
                                        Fluxo configurado com conexões personalizadas
                                    </div>
                                </div>
                            )}
                        </div>

                        <StepNoCodeConnections onClose={() => setIsOpen(false)} />
                    </TabsContent>

                    {/* Aba de Configurações Gerais */}
                    <TabsContent value="general" className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6DDD4' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Settings className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                <h3 className="font-semibold text-[#432818]">Configurações Gerais</h3>
                            </div>
                            <p className="text-sm text-[#8F7A6A] mb-4">
                                Configure SEO, domínio, tracking, temas e outras configurações globais do seu funil.
                            </p>
                        </div>

                        <NoCodeConfigPanel />
                    </TabsContent>

                    {/* Aba de Preview */}
                    <TabsContent value="preview" className="space-y-4">
                        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: '#E6DDD4' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Eye className="w-5 h-5" style={{ color: '#B89B7A' }} />
                                <h3 className="font-semibold text-[#432818]">Preview do Fluxo</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F8F6F3' }}>
                                    <h4 className="font-medium text-[#432818] mb-2">🎯 Fluxo Atual</h4>

                                    {hasConnectionsConfig ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge variant="outline">Etapa 1</Badge>
                                                <ArrowRight className="w-4 h-4 text-[#B89B7A]" />
                                                <Badge variant="outline">Etapa 2</Badge>
                                                <ArrowRight className="w-4 h-4 text-[#B89B7A]" />
                                                <span className="text-[#8F7A6A]">...</span>
                                                <ArrowRight className="w-4 h-4 text-[#B89B7A]" />
                                                <Badge variant="secondary">Resultado</Badge>
                                            </div>
                                            <p className="text-xs text-[#8F7A6A]">
                                                Fluxo configurado com conexões personalizadas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge variant="outline">Etapa 1</Badge>
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                                <Badge variant="outline">Etapa 2</Badge>
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400">...</span>
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                                <Badge variant="secondary">Resultado</Badge>
                                            </div>
                                            <p className="text-xs text-[#8F7A6A]">
                                                Fluxo linear padrão (nenhuma configuração personalizada)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => {
                                            // Abrir preview do fluxo
                                            const connections = localStorage.getItem('quiz-step-connections');
                                            if (connections) {
                                                window.open('/step/1?preview=true', '_blank');
                                            }
                                        }}
                                        variant="outline"
                                        className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                                        disabled={!hasConnectionsConfig}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview do Fluxo
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            // Testar o quiz
                                            window.open('/quiz/1', '_blank');
                                        }}
                                        className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                                    >
                                        <Zap className="w-4 h-4 mr-2" />
                                        Testar Quiz
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Status das Configurações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6DDD4' }}>
                                <h4 className="font-medium text-[#432818] mb-2">🔗 Conexões</h4>
                                <div className="flex items-center gap-2">
                                    {hasConnectionsConfig ? (
                                        <>
                                            <Badge className="bg-green-100 text-green-700">Configurado</Badge>
                                            <span className="text-sm text-[#8F7A6A]">Fluxo personalizado ativo</span>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary">Padrão</Badge>
                                            <span className="text-sm text-[#8F7A6A]">Fluxo linear básico</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#E6DDD4' }}>
                                <h4 className="font-medium text-[#432818] mb-2">⚙️ Configurações</h4>
                                <div className="flex items-center gap-2">
                                    {hasNoCodeConfig ? (
                                        <>
                                            <Badge className="bg-green-100 text-green-700">Configurado</Badge>
                                            <span className="text-sm text-[#8F7A6A]">SEO e domínio</span>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary">Padrão</Badge>
                                            <span className="text-sm text-[#8F7A6A]">Configurações básicas</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Ações rápidas no footer */}
                <div className="flex justify-between items-center pt-6 mt-6 border-t" style={{ borderColor: '#E6DDD4' }}>
                    <div className="text-sm text-[#8F7A6A]">
                        Todas as configurações são salvas automaticamente
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                        >
                            Fechar
                        </Button>
                        <Button
                            onClick={() => {
                                // Salvar e aplicar todas as configurações
                                window.location.reload();
                            }}
                            className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                        >
                            Aplicar Configurações
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EditorNoCodePanel;
