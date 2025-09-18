/**
 * 🎨 RESULT CONFIGURATION PANEL - CONFIGURAÇÃO NOCODE DE RESULTADOS
 * 
 * Interface NoCode para configurar variáveis de resultado personalizadas:
 * - DESCRIÇÃO (do resultado por estilo)
 * - IMAGEM PRINCIPAL (do resultado/estilo) 
 * - IMAGEM DO PRODUTO PERSONALIZADO (guias de estilo)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    Palette,
    Image,
    FileText,
    Save,
    RotateCcw,
    Eye,
    Upload,
    Copy,
    Award
} from 'lucide-react';
import { styleConfig } from '@/config/styleConfig';
import HybridTemplateService from '@/services/HybridTemplateService';

interface ResultVariables {
    estilo: string;
    descricao: string;
    imagemPrincipal: string;
    imagemProdutoPersonalizado: string;
    guideImage: string;
    dicasEspeciais: string[];
    categoria: string;
    palavrasChave: string[];
}

interface ResultConfigPanelProps {
    className?: string;
}

export const ResultConfigurationPanel: React.FC<ResultConfigPanelProps> = ({ className = '' }) => {
    const { toast } = useToast();
    const [configurations, setConfigurations] = useState<Record<string, ResultVariables>>({});
    const [selectedStyle, setSelectedStyle] = useState<string>('Natural');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Estilos disponíveis baseados no styleConfig
    const availableStyles = Object.keys(styleConfig);

    // Carregar configurações iniciais
    useEffect(() => {
        loadAllResultConfigurations();
    }, []);

    const loadAllResultConfigurations = async () => {
        setLoading(true);
        const configs: Record<string, ResultVariables> = {};

        try {
            // Carregar configurações baseadas no styleConfig existente
            Object.entries(styleConfig).forEach(([styleName, config]) => {
                configs[styleName] = {
                    estilo: styleName,
                    descricao: config.description,
                    imagemPrincipal: config.image,
                    imagemProdutoPersonalizado: config.guideImage,
                    guideImage: config.guideImage,
                    dicasEspeciais: config.specialTips || [],
                    categoria: config.category,
                    palavrasChave: config.keywords || []
                };
            });

            setConfigurations(configs);
        } catch (error) {
            console.error('Erro ao carregar configurações de resultado:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as configurações de resultado.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateStyleConfig = (styleName: string, updates: Partial<ResultVariables>) => {
        setConfigurations(prev => ({
            ...prev,
            [styleName]: {
                ...prev[styleName],
                ...updates
            }
        }));
    };

    const saveConfiguration = async (styleName: string) => {
        setSaving(true);
        try {
            const config = configurations[styleName];
            if (!config) return;

            // Preparar override para o HybridTemplateService
            const resultOverride = {
                metadata: {
                    name: `Resultado ${styleName}`,
                    description: config.descricao,
                    type: 'result',
                    category: 'resultado'
                },
                result: {
                    estilo: styleName,
                    descricao: config.descricao,
                    imagemPrincipal: config.imagemPrincipal,
                    imagemProdutoPersonalizado: config.imagemProdutoPersonalizado,
                    guideImage: config.guideImage,
                    dicasEspeciais: config.dicasEspeciais,
                    categoria: config.categoria,
                    palavrasChave: config.palavrasChave
                }
            };

            // Salvar no HybridTemplateService (step 20 é onde os resultados são exibidos)
            await HybridTemplateService.saveStepOverride(20, resultOverride);

            toast({
                title: "Configuração Salva!",
                description: `Resultado ${styleName} configurado com sucesso.`,
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast({
                title: "Erro",
                description: "Não foi possível salvar a configuração.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const saveAllConfigurations = async () => {
        setSaving(true);
        try {
            for (const styleName of availableStyles) {
                await saveConfiguration(styleName);
            }
            toast({
                title: "Todas as Configurações Salvas!",
                description: "Todos os resultados foram configurados com sucesso.",
            });
        } catch (error) {
            console.error('Erro ao salvar todas:', error);
            toast({
                title: "Erro",
                description: "Erro ao salvar algumas configurações.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = async () => {
        await loadAllResultConfigurations();
        toast({
            title: "Configurações Resetadas",
            description: "Todas as configurações foram restauradas para o padrão.",
        });
    };

    const handleImageUpload = (_styleName: string, field: 'imagemPrincipal' | 'imagemProdutoPersonalizado') => {
        // Implementar upload de imagem (por agora apenas placeholder)
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                // Aqui você implementaria o upload real
                toast({
                    title: "Upload simulado",
                    description: `Imagem ${file.name} seria enviada para ${field}`,
                });
            }
        };
        fileInput.click();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copiado!",
            description: "URL copiada para a área de transferência.",
        });
    };

    const currentConfig = configurations[selectedStyle];
    const totalStyles = availableStyles.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
                    <p className="text-[#8F7A6A]">Carregando configurações de resultado...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header com estatísticas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#432818]">
                        <Award className="w-5 h-5 text-[#B89B7A]" />
                        Configuração de Resultados Personalizados
                    </CardTitle>
                    <div className="flex gap-4 mt-4">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Palette className="w-3 h-3 mr-1" />
                            {totalStyles} Estilos Disponíveis
                        </Badge>
                        <Badge variant="outline">
                            Variáveis: Descrição, Imagem Principal, Produto Personalizado
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Estilos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-[#432818]">
                            Selecionar Estilo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px]">
                            <div className="space-y-2">
                                {availableStyles.map((styleName) => {
                                    const config = configurations[styleName];
                                    return (
                                        <Button
                                            key={styleName}
                                            variant={selectedStyle === styleName ? "default" : "ghost"}
                                            onClick={() => setSelectedStyle(styleName)}
                                            className="w-full justify-between p-3 h-auto flex-col"
                                            style={{
                                                backgroundColor: selectedStyle === styleName ? '#B89B7A' : 'transparent',
                                                color: selectedStyle === styleName ? 'white' : '#432818'
                                            }}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-medium">{styleName}</span>
                                                <Palette className="w-4 h-4" />
                                            </div>
                                            {config && (
                                                <div className="text-xs opacity-75 mt-1 text-left w-full">
                                                    {config.categoria}
                                                </div>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Configurações do Estilo Selecionado */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-[#432818]">
                            <span>Configurar Resultado: {selectedStyle}</span>
                            <Button
                                onClick={() => saveConfiguration(selectedStyle)}
                                disabled={saving}
                                className="bg-[#B89B7A] hover:bg-[#A0895B]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Salvar
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentConfig && (
                            <Tabs defaultValue="content" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="content">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Conteúdo
                                    </TabsTrigger>
                                    <TabsTrigger value="images">
                                        <Image className="w-4 h-4 mr-2" />
                                        Imagens
                                    </TabsTrigger>
                                    <TabsTrigger value="advanced">
                                        <Palette className="w-4 h-4 mr-2" />
                                        Avançado
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="content" className="space-y-4">
                                    {/* DESCRIÇÃO DO RESULTADO */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            📝 Descrição do Resultado
                                        </Label>
                                        <Textarea
                                            value={currentConfig.descricao}
                                            onChange={(e) =>
                                                updateStyleConfig(selectedStyle, { descricao: e.target.value })
                                            }
                                            placeholder="Descreva o perfil e características deste estilo..."
                                            rows={4}
                                            className="w-full"
                                        />
                                        <p className="text-xs text-[#8F7A6A]">
                                            Esta descrição será exibida na página de resultado do usuário
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* CATEGORIA E PALAVRAS-CHAVE */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Categoria do Estilo</Label>
                                            <Input
                                                value={currentConfig.categoria}
                                                onChange={(e) =>
                                                    updateStyleConfig(selectedStyle, { categoria: e.target.value })
                                                }
                                                placeholder="Ex: Elegância Atemporal"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Palavras-Chave</Label>
                                            <Input
                                                value={currentConfig.palavrasChave.join(', ')}
                                                onChange={(e) =>
                                                    updateStyleConfig(selectedStyle, {
                                                        palavrasChave: e.target.value.split(',').map(k => k.trim())
                                                    })
                                                }
                                                placeholder="elegante, sofisticado, clássico"
                                            />
                                        </div>
                                    </div>

                                    {/* DICAS ESPECIAIS */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">💡 Dicas Especiais</Label>
                                        <Textarea
                                            value={currentConfig.dicasEspeciais.join('\n')}
                                            onChange={(e) =>
                                                updateStyleConfig(selectedStyle, {
                                                    dicasEspeciais: e.target.value.split('\n').filter(tip => tip.trim())
                                                })
                                            }
                                            placeholder="Digite uma dica por linha..."
                                            rows={4}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="images" className="space-y-4">
                                    {/* IMAGEM PRINCIPAL DO RESULTADO */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            🖼️ Imagem Principal do Resultado
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentConfig.imagemPrincipal}
                                                onChange={(e) =>
                                                    updateStyleConfig(selectedStyle, { imagemPrincipal: e.target.value })
                                                }
                                                placeholder="URL da imagem principal..."
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleImageUpload(selectedStyle, 'imagemPrincipal')}
                                            >
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => copyToClipboard(currentConfig.imagemPrincipal)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {currentConfig.imagemPrincipal && (
                                            <div className="relative">
                                                <img
                                                    src={currentConfig.imagemPrincipal}
                                                    alt="Imagem Principal"
                                                    className="w-full max-w-xs mx-auto rounded-lg border shadow-sm"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* IMAGEM DO PRODUTO PERSONALIZADO (GUIA) */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            🎨 Imagem do Produto Personalizado (Guia de Estilo)
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentConfig.imagemProdutoPersonalizado}
                                                onChange={(e) =>
                                                    updateStyleConfig(selectedStyle, { imagemProdutoPersonalizado: e.target.value })
                                                }
                                                placeholder="URL da imagem do guia personalizado..."
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleImageUpload(selectedStyle, 'imagemProdutoPersonalizado')}
                                            >
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => copyToClipboard(currentConfig.imagemProdutoPersonalizado)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {currentConfig.imagemProdutoPersonalizado && (
                                            <div className="relative">
                                                <img
                                                    src={currentConfig.imagemProdutoPersonalizado}
                                                    alt="Produto Personalizado"
                                                    className="w-full max-w-xs mx-auto rounded-lg border shadow-sm"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-guide.jpg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs text-[#8F7A6A]">
                                            Esta é a imagem do guia de estilo personalizado que será oferecida ao usuário
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="advanced" className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            🔧 Variáveis Disponíveis para Interpolação
                                        </h4>
                                        <div className="text-sm text-blue-800 space-y-1">
                                            <p><code>{`{{estilo}}`}</code> - Nome do estilo (ex: Natural)</p>
                                            <p><code>{`{{descricao}}`}</code> - Descrição personalizada do estilo</p>
                                            <p><code>{`{{imagemPrincipal}}`}</code> - URL da imagem principal</p>
                                            <p><code>{`{{imagemProdutoPersonalizado}}`}</code> - URL do guia personalizado</p>
                                            <p><code>{`{{categoria}}`}</code> - Categoria do estilo</p>
                                            <p><code>{`{{userName}}`}</code> - Nome do usuário</p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-amber-900 mb-2">
                                            ⚡ Preview de Uso
                                        </h4>
                                        <div className="text-sm text-amber-800">
                                            <p>As configurações aqui definidas serão aplicadas na:</p>
                                            <ul className="list-disc list-inside mt-2">
                                                <li><strong>Etapa 20</strong> - Página de resultado</li>
                                                <li><strong>Componentes de resultado</strong> em todo o sistema</li>
                                                <li><strong>E-mails de resultado</strong> (se configurados)</li>
                                                <li><strong>Integrações externas</strong> via API</li>
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Ações Globais */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={resetToDefaults}
                            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurar Padrões
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>

                            <Button
                                onClick={saveAllConfigurations}
                                disabled={saving}
                                className="bg-[#B89B7A] hover:bg-[#A0895B]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Salvar Todas as Configurações
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultConfigurationPanel;