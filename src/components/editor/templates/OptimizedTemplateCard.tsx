/**
 * 📋 Template Card Otimizado - Card de   // Otimizar a thumbnail se for uma URL de imagem
  const { isLoading, compressionRatio } = useOptimizedImage(mplate com imagem otimizada
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, Download, Star, Eye } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { BlockData } from '@/types/blocks';

// Tipo do template (importado do arquivo principal)
interface Template {
    id: string;
    name: string;
    description: string;
    category: 'intro' | 'question' | 'result' | 'custom';
    tags: string[];
    blocks: BlockData[];
    thumbnail?: string;
    isPublic: boolean;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: string;
    downloads?: number;
    rating?: number;
}

interface OptimizedTemplateCardProps {
    template: Template;
    viewMode: 'grid' | 'list';
    onApply: (template: Template) => void;
    onToggleFavorite: (templateId: string) => void;
    onPreview?: (template: Template) => void;
}

export const OptimizedTemplateCard: React.FC<OptimizedTemplateCardProps> = ({
    template,
    viewMode,
    onApply,
    onToggleFavorite,
    onPreview
}) => {
    // Otimizar a thumbnail se for uma URL de imagem
    const { isLoading, compressionRatio } = useOptimizedImage(
        template.thumbnail && template.thumbnail.startsWith('http') ? template.thumbnail : '',
        {
            maxWidth: viewMode === 'grid' ? 400 : 96,
            maxHeight: viewMode === 'grid' ? 300 : 96,
            quality: 0.8,
            format: 'webp',
            enableCache: true
        }
    );

    // Função para renderizar a thumbnail
    const renderThumbnail = () => {
        if (template.thumbnail?.startsWith('http')) {
            return (
                <OptimizedImage
                    src={template.thumbnail}
                    alt={`Preview do template ${template.name}`}
                    className="w-full h-full object-cover"
                    width={viewMode === 'grid' ? 400 : 96}
                    height={viewMode === 'grid' ? 300 : 96}
                    quality={0.8}
                    format="webp"
                    lazy={true}
                    placeholder={
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <div className="animate-pulse">
                                <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                            </div>
                        </div>
                    }
                    errorFallback={
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">❌ Erro</span>
                        </div>
                    }
                />
            );
        }

        // Fallback para emoji ou ícone
        return (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <span className="text-3xl">{template.thumbnail || '📄'}</span>
            </div>
        );
    };

    // Função para formatar data
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div
            className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group ${viewMode === 'list' ? 'flex' : ''
                }`}
        >
            {/* Thumbnail/Preview */}
            <div
                className={`relative bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${viewMode === 'grid' ? 'h-48' : 'w-24 h-24 flex-shrink-0'
                    }`}
            >
                {renderThumbnail()}

                {/* Indicador de carregamento */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                )}

                {/* Badge de otimização */}
                {compressionRatio > 0 && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            -{compressionRatio.toFixed(0)}%
                        </Badge>
                    </div>
                )}

                {/* Overlay de ações (aparece no hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {onPreview && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview(template);
                            }}
                            className="bg-white/90 hover:bg-white"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onApply(template);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Usar
                    </Button>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3
                            className="font-semibold text-lg text-[#432818] line-clamp-1 mb-1"
                            title={template.name}
                        >
                            {template.name}
                        </h3>
                        {template.author && (
                            <p className="text-xs text-gray-500 mb-1">por {template.author}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(template.id);
                                        }}
                                        className="p-1 h-auto"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${template.isFavorite ? 'fill-current text-red-500' : 'text-gray-400 hover:text-red-400'
                                                }`}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {template.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <p
                    className="text-sm text-[#6B4F43] line-clamp-2 mb-3"
                    title={template.description}
                >
                    {template.description}
                </p>

                {/* Tags e categoria */}
                <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs capitalize">
                        {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {template.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 2}
                        </Badge>
                    )}
                </div>

                {/* Estatísticas e ações */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                        {template.downloads !== undefined && (
                            <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                <span>{template.downloads}</span>
                            </div>
                        )}
                        {template.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-400" />
                                <span>{template.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    <span>{formatDate(template.updatedAt)}</span>
                </div>

                {/* Ações do template (visível apenas em modo lista) */}
                {viewMode === 'list' && (
                    <div className="flex gap-2 mt-3">
                        <Button
                            size="sm"
                            onClick={() => onApply(template)}
                            className="flex-1 bg-[#432818] hover:bg-[#5a3525] text-white"
                        >
                            Usar Template
                        </Button>
                        {onPreview && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onPreview(template)}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizedTemplateCard;