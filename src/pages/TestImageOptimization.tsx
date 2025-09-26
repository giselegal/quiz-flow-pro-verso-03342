/**
 * 🧪 TESTE SISTEMA DE IMAGENS OTIMIZADAS
 * 
 * Página de demonstração do sistema completo de imagens otimizadas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OptimizedImage from '@/components/OptimizedImage';
import {
    useOptimizedImages,
    useImageCacheStats,
    useImagePreloader
} from '@/hooks/useOptimizedImage';
import { migrateCurrentTemplates } from '@/services/ImageMigrationService';

const TestImageOptimizationPage: React.FC = () => {
    const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
    const [migrationResults, setMigrationResults] = useState<any>(null);

    // Hook para estatísticas do cache
    const { stats, isLoading: statsLoading, clearCache } = useImageCacheStats();

    // Hook para preloader
    const { preloadImages, isPreloading, preloadingCount } = useImagePreloader();

    // URLs de teste
    const testImages = [
        {
            id: 'unsplash-1',
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
            title: 'Imagem de Negócios',
            description: 'Teste com imagem do Unsplash - alta resolução'
        },
        {
            id: 'unsplash-2',
            src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
            title: 'Imagem Abstrata',
            description: 'Teste com padrões geométricos coloridos'
        },
        {
            id: 'cloudinary-1',
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            title: 'Logo da Marca',
            description: 'Imagem já otimizada do Cloudinary'
        },
        {
            id: 'unsplash-3',
            src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
            title: 'Celebração',
            description: 'Imagem festiva para resultados'
        }
    ];

    // Hook para múltiplas imagens
    const { results: multipleResults, isLoading: multipleLoading } = useOptimizedImages(
        testImages.map(img => ({
            id: img.id,
            src: img.src,
            options: { quality: 0.8, format: 'webp' as const }
        }))
    );

    // Função para executar migração
    const runMigration = async () => {
        setMigrationStatus('running');
        try {
            const results = await migrateCurrentTemplates();
            setMigrationResults(results);
            setMigrationStatus('complete');
        } catch (error) {
            console.error('Erro na migração:', error);
            setMigrationStatus('error');
        }
    };

    // Preload de imagens ao carregar a página
    useEffect(() => {
        const preloadTestImages = async () => {
            await preloadImages(testImages.map(img => ({
                src: img.src,
                options: { quality: 0.7, format: 'webp' as const }
            })));
        };
        preloadTestImages();
    }, []);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#432818] mb-2">
                    🧪 Sistema de Imagens Otimizadas - Demonstração
                </h1>
                <p className="text-[#6B4F43]">
                    Teste completo do sistema IndexedDB com otimização WebP, cache inteligente e lazy loading
                </p>
            </div>

            <Tabs defaultValue="gallery" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="gallery">Galeria de Teste</TabsTrigger>
                    <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                    <TabsTrigger value="migration">Migração</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Galeria de Teste */}
                <TabsContent value="gallery" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🖼️ Galeria de Imagens Otimizadas
                                {isPreloading && (
                                    <Badge variant="outline" className="animate-pulse">
                                        Precarregando {preloadingCount}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testImages.map((image) => {
                                    const result = multipleResults[image.id];
                                    return (
                                        <Card key={image.id} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                <OptimizedImage
                                                    src={image.src}
                                                    alt={image.title}
                                                    className="w-full h-48 object-cover"
                                                    width={400}
                                                    height={200}
                                                    quality={0.8}
                                                    format="webp"
                                                    lazy={true}
                                                    placeholder={
                                                        <div className="w-full h-48 bg-gray-100 animate-pulse flex items-center justify-center">
                                                            <div className="text-gray-400">Carregando...</div>
                                                        </div>
                                                    }
                                                    errorFallback={
                                                        <div className="w-full h-48 bg-red-50 flex items-center justify-center">
                                                            <div className="text-red-500">❌ Erro ao carregar</div>
                                                        </div>
                                                    }
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-[#432818] mb-1">{image.title}</h3>
                                                    <p className="text-sm text-[#6B4F43] mb-3">{image.description}</p>

                                                    {result && !result.isLoading && (
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {result.fileSize}
                                                            </Badge>
                                                            {result.compressionRatio > 0 && (
                                                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                                                    -{result.compressionRatio.toFixed(0)}% compressão
                                                                </Badge>
                                                            )}
                                                            {result.error && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Erro
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                    {result?.isLoading && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-sm text-gray-500">Otimizando...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Estatísticas */}
                <TabsContent value="stats" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    📊 Cache Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {statsLoading ? (
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                ) : stats ? (
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Imagens em Cache:</span>
                                            <div className="text-2xl font-bold text-[#432818]">{stats.count}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Espaço Utilizado:</span>
                                            <div className="text-xl font-semibold text-[#6B4F43]">{stats.totalSize}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Compressão Média:</span>
                                            <div className="text-xl font-semibold text-green-600">
                                                {stats.averageCompression.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Nenhuma estatística disponível</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    ⚡ Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600">Status de Carregamento:</span>
                                        <div className="text-sm font-medium">
                                            {multipleLoading ? (
                                                <Badge variant="outline" className="animate-pulse">Carregando</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    Completo
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Imagens Processadas:</span>
                                        <div className="text-xl font-semibold text-[#432818]">
                                            {Object.keys(multipleResults).length}/{testImages.length}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Preload Status:</span>
                                        <div className="text-sm">
                                            {isPreloading ? (
                                                <Badge variant="outline" className="animate-pulse">
                                                    Precarregando {preloadingCount}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Concluído</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    🔧 Controles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={clearCache}
                                    variant="outline"
                                    className="w-full"
                                    disabled={statsLoading}
                                >
                                    Limpar Cache
                                </Button>

                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Recarregar Página
                                </Button>

                                <Button
                                    onClick={() => {
                                        preloadImages(testImages.map(img => ({
                                            src: img.src,
                                            options: { quality: 0.9, format: 'webp' as const }
                                        })));
                                    }}
                                    variant="outline"
                                    className="w-full"
                                    disabled={isPreloading}
                                >
                                    Precarregar Novamente
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Migração */}
                <TabsContent value="migration" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🔄 Sistema de Migração de Templates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertDescription>
                                    Este sistema migra automaticamente as imagens dos templates existentes para o formato
                                    otimizado WebP e armazena no IndexedDB para melhor performance.
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={runMigration}
                                disabled={migrationStatus === 'running'}
                                className="w-full md:w-auto"
                            >
                                {migrationStatus === 'running' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Executando Migração...
                                    </>
                                ) : (
                                    'Executar Migração de Templates'
                                )}
                            </Button>

                            {migrationStatus === 'complete' && migrationResults && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-800 mb-2">Migração Concluída! ✅</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Templates:</span>
                                            <div className="font-semibold">{migrationResults.totalTemplates}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Sucessos:</span>
                                            <div className="font-semibold text-green-600">{migrationResults.successful}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Falhas:</span>
                                            <div className="font-semibold text-red-600">{migrationResults.failed}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Compressão:</span>
                                            <div className="font-semibold">{migrationResults.compressionRatio?.toFixed(1) || 0}%</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {migrationStatus === 'error' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 font-semibold">❌ Erro na Migração</p>
                                    <p className="text-red-600 text-sm">Verifique o console para mais detalhes</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance */}
                <TabsContent value="performance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>⚡ Análise de Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Alert>
                                    <AlertDescription>
                                        O sistema IndexedDB permite armazenamento local das imagens otimizadas, reduzindo
                                        drasticamente o tempo de carregamento em visitas subsequentes.
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-[#432818] mb-3">🚀 Benefícios</h3>
                                        <ul className="space-y-2 text-sm text-[#6B4F43]">
                                            <li>• Conversão automática para WebP (melhor compressão)</li>
                                            <li>• Cache inteligente no IndexedDB (acesso offline)</li>
                                            <li>• Lazy loading com Intersection Observer</li>
                                            <li>• Redimensionamento automático</li>
                                            <li>• Fallback para imagens originais</li>
                                            <li>• Limpeza automática do cache (limite de 50MB)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#432818] mb-3">📈 Métricas Típicas</h3>
                                        <ul className="space-y-2 text-sm text-[#6B4F43]">
                                            <li>• Redução de tamanho: <strong>60-80%</strong></li>
                                            <li>• Tempo de carregamento: <strong>-70%</strong></li>
                                            <li>• Uso de banda: <strong>-75%</strong></li>
                                            <li>• Cache hit rate: <strong>95%+</strong></li>
                                            <li>• Suporte WebP: <strong>95% navegadores</strong></li>
                                            <li>• Capacidade cache: <strong>50MB padrão</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TestImageOptimizationPage;