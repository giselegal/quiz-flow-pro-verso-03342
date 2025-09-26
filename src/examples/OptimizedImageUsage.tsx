/**
 * 🖼️ EXEMPLO PRÁTICO - Implementação de Imagens Otimizadas
 * 
 * Como usar o sistema de imagens otimizadas no projeto
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import OptimizedImage from '../components/OptimizedImage';
import { useMigrationStatus } from '../services/ImageMigrationService';
import { optimizedImageStorage } from '../services/OptimizedImageStorage';

// ============================================================================
// EXEMPLO 1: TEMPLATE CARD COM IMAGEM OTIMIZADA
// ============================================================================

interface OptimizedTemplateCardProps {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: string;
    conversionRate: string;
    onUse: (templateId: string) => void;
}

export const OptimizedTemplateCard: React.FC<OptimizedTemplateCardProps> = ({
    id,
    name,
    description,
    thumbnail,
    category,
    conversionRate,
    onUse
}) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader className="p-0">
                {/* Imagem otimizada com lazy loading */}
                <OptimizedImage
                    src={thumbnail}
                    alt={name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    width={400}
                    height={300}
                    quality={0.8}
                    format="webp"
                    lazy={true}
                    onLoad={() => console.log(`✅ Template ${id} carregado`)}
                    onError={(error) => console.error(`❌ Erro no template ${id}:`, error)}
                />

                {/* Badge de categoria */}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        {category}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">
                            Taxa: {conversionRate}
                        </span>
                        <Button
                            size="sm"
                            onClick={() => onUse(id)}
                            className="group-hover:bg-blue-600 transition-colors"
                        >
                            Usar Template
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// ============================================================================
// EXEMPLO 2: GALERIA DE TEMPLATES OTIMIZADA
// ============================================================================

interface OptimizedTemplatesGalleryProps {
    templates: Array<{
        id: string;
        name: string;
        description: string;
        thumbnail: string;
        category: string;
        conversionRate: string;
    }>;
    onTemplateSelect: (templateId: string) => void;
}

export const OptimizedTemplatesGallery: React.FC<OptimizedTemplatesGalleryProps> = ({
    templates,
    onTemplateSelect
}) => {
    const [filter, setFilter] = useState<string>('all');

    const filteredTemplates = filter === 'all'
        ? templates
        : templates.filter(template => template.category === filter);

    const categories = ['all', ...new Set(templates.map(t => t.category))];

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={filter === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(category)}
                        className="capitalize"
                    >
                        {category === 'all' ? 'Todos' : category}
                    </Button>
                ))}
            </div>

            {/* Grid de templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map(template => (
                    <OptimizedTemplateCard
                        key={template.id}
                        {...template}
                        onUse={onTemplateSelect}
                    />
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">Nenhum template encontrado nesta categoria</p>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// EXEMPLO 3: DASHBOARD DE MIGRAÇÃO
// ============================================================================

export const ImageMigrationDashboard: React.FC = () => {
    const { isRunning, stats, error, startMigration, clearCache } = useMigrationStatus();
    const [storageInfo, setStorageInfo] = useState<{
        usage: string;
        count: number;
        averageCompression: number;
    } | null>(null);

    // Carregar informações de armazenamento
    useEffect(() => {
        const loadStorageInfo = async () => {
            try {
                const info = await optimizedImageStorage.getStats();
                setStorageInfo({
                    usage: info.totalSize,
                    count: info.count,
                    averageCompression: info.averageCompression
                });
            } catch (err) {
                console.error('❌ Erro ao carregar info de armazenamento:', err);
            }
        };

        loadStorageInfo();
        // Atualizar a cada 10 segundos
        const interval = setInterval(loadStorageInfo, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Sistema de Imagens Otimizadas
                </h2>
                <p className="text-gray-600">
                    Gerencie o cache de imagens otimizadas armazenadas no IndexedDB
                </p>
            </div>

            {/* Cards de informação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Imagens em Cache</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {storageInfo?.count || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-lg mr-3">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 3l3.09 6.26L22 10.27l-5 4.87 1.18 6.88L13 18.77l-6.18 3.25L8 15.14 3 10.27l6.91-1.01L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Espaço Utilizado</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {storageInfo?.usage || '0 MB'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-50 rounded-lg mr-3">
                                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 3l3.09 6.26L22 10.27l-5 4.87 1.18 6.88L13 18.77l-6.18 3.25L8 15.14 3 10.27l6.91-1.01L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Compressão Média</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {storageInfo?.averageCompression.toFixed(1) || '0'}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controles */}
            <Card>
                <CardHeader>
                    <CardTitle>Controles de Migração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button
                            onClick={startMigration}
                            disabled={isRunning}
                            className="flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
                                    </svg>
                                    Migrando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Migrar Templates
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={clearCache}
                            disabled={isRunning}
                        >
                            Limpar Cache
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-medium">Erro na Migração:</p>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {stats && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 font-medium mb-2">Migração Concluída!</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium ml-1">{stats.totalTemplates}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Sucessos:</span>
                                    <span className="font-medium ml-1 text-green-600">{stats.successful}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Falhas:</span>
                                    <span className="font-medium ml-1 text-red-600">{stats.failed}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Compressão:</span>
                                    <span className="font-medium ml-1">{stats.compressionRatio.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================================================
// EXEMPLO 4: COMO USAR EM TEMPLATES EXISTENTES
// ============================================================================

export const ExampleTemplateUsage: React.FC = () => {
    // Exemplo de como migrar do sistema atual para otimizado
    const currentTemplates = [
        {
            id: 'quiz-estilo-21-steps',
            name: 'Quiz de Estilo Completo',
            description: 'Quiz completo com 21 etapas para descobrir o estilo pessoal',
            thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            category: 'quiz-style',
            conversionRate: '87%'
        },
        // ... mais templates
    ];

    const handleTemplateSelect = (templateId: string) => {
        console.log('Template selecionado:', templateId);
        // Navegar para o editor com o template
        window.location.href = `/editor?template=${templateId}`;
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <OptimizedTemplatesGallery
                templates={currentTemplates}
                onTemplateSelect={handleTemplateSelect}
            />

            <hr className="my-8" />

            <ImageMigrationDashboard />
        </div>
    );
};

export default ExampleTemplateUsage;