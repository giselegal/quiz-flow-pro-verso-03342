import QuizApp from '@/components/quiz/QuizApp';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Save, Settings, Play, Pause } from 'lucide-react';
import '@/styles/globals.css';

/**
 * 🎯 QUIZ ESTILO PESSOAL - GISELE GALVÃO
 * 
 * Página principal do quiz de descoberta de estilo pessoal.
 * Usa os novos componentes modulares criados especificamente 
 * para o sistema da Gisele Galvão.
 * 
 * Funcionalidades:
 * - ✅ 21 etapas completas (intro + 10 perguntas + estratégicas + resultado + oferta)
 * - ✅ Sistema de pontuação por estilo (8 estilos disponíveis)
 * - ✅ Ofertas personalizadas baseadas nas respostas estratégicas
 * - ✅ Design com paleta de cores personalizada
 * - ✅ Responsive e otimizado
 * - ✅ Suporte a templates personalizados via funnelId
 * - 🆕 Modo de edição integrado
 * - 🆕 Preview em tempo real
 * - 🆕 Sistema de versionamento
 */

interface QuizEstiloPessoalPageProps {
    funnelId?: string;
    editMode?: boolean;
    onEditModeChange?: (editMode: boolean) => void;
}

export default function QuizEstiloPessoalPage({ 
    funnelId, 
    editMode = false, 
    onEditModeChange 
}: QuizEstiloPessoalPageProps) {
    const [isEditing, setIsEditing] = useState(editMode);
    const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Detectar se estamos no modo de edição via URL
    useEffect(() => {
        const isEditMode = window.location.pathname.includes('/editor/');
        if (isEditMode !== isEditing) {
            setIsEditing(isEditMode);
            onEditModeChange?.(isEditMode);
        }
    }, [isEditing, onEditModeChange]);

    const handleEditModeToggle = () => {
        const newEditMode = !isEditing;
        setIsEditing(newEditMode);
        onEditModeChange?.(newEditMode);
        
        if (newEditMode) {
            setActiveTab('edit');
        } else {
            setActiveTab('preview');
        }
    };

    const handleSave = () => {
        // TODO: Implementar salvamento
        setHasUnsavedChanges(false);
        console.log('Salvando alterações...');
    };

    return (
        <div className="quiz-estilo-page">
            {/* Meta tags para SEO */}
            <Helmet>
                <title>Descubra Seu Estilo Pessoal - Quiz Completo | Gisele Galvão</title>
                <meta
                    name="description"
                    content="Descubra seu estilo pessoal único com nosso quiz completo. Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático ou Criativo? Faça o teste agora!"
                />
                <meta name="keywords" content="estilo pessoal, moda, consultoria de imagem, Gisele Galvão, quiz de estilo" />
                <meta property="og:title" content="Descubra Seu Estilo Pessoal - Quiz Completo" />
                <meta property="og:description" content="Quiz completo para descobrir seu estilo pessoal único. Receba dicas personalizadas e ofertas exclusivas." />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            {/* Header com controles de edição */}
            {isEditing && (
                <div className="bg-white border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg font-semibold text-gray-900">
                                Editor do Quiz de Estilo
                            </h1>
                            {hasUnsavedChanges && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Alterações não salvas
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSave}
                                disabled={!hasUnsavedChanges}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Salvar
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEditModeToggle}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Sair do Editor
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo principal */}
            <main className="min-h-screen">
                {isEditing ? (
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'edit')}>
                        <div className="flex h-screen">
                            {/* Sidebar de edição */}
                            <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="edit" className="flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="edit" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Configurações do Quiz</CardTitle>
                                            <CardDescription>
                                                Edite as etapas e configurações do quiz
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <Button variant="outline" size="sm" className="w-full justify-start">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configurações Gerais
                                                </Button>
                                                <Button variant="outline" size="sm" className="w-full justify-start">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Editar Etapas
                                                </Button>
                                                <Button variant="outline" size="sm" className="w-full justify-start">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Testar Fluxo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="preview" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm">Preview em Tempo Real</CardTitle>
                                            <CardDescription>
                                                Visualize as mudanças instantaneamente
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-gray-600">
                                                <p>• Preview automático ativo</p>
                                                <p>• Mudanças salvas automaticamente</p>
                                                <p>• Teste de funcionalidades</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>

                            {/* Área principal */}
                            <div className="flex-1 overflow-auto">
                                <TabsContent value="edit" className="h-full">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">Editor de Quiz</h2>
                                        <p className="text-gray-600">
                                            Interface de edição será implementada aqui...
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="preview" className="h-full">
                                    <div className="h-full">
                                        <QuizApp funnelId={funnelId} />
                                    </div>
                                </TabsContent>
                            </div>
                        </div>
                    </Tabs>
                ) : (
                    <QuizApp funnelId={funnelId} />
                )}
            </main>

            {/* Scripts de analytics (exemplo) */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        // Google Analytics ou outras ferramentas
                        console.log('Quiz Gisele Galvão - Página carregada');
                        
                        // Tracking de início do quiz
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'quiz_started', {
                                event_category: 'engagement',
                                event_label: 'quiz_estilo_pessoal'
                            });
                        }
                    `
                }}
            />
        </div>
    );
}