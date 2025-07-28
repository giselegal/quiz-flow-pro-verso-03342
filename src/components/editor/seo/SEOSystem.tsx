// Sistema de URLs Customizadas e SEO
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Globe, 
  Link, 
  Search, 
  Eye, 
  Edit, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { supabase } from '../../../lib/supabase';

// Tipos para SEO e URLs
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  robots?: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'website' | 'quiz' | 'article';
    url?: string;
  };
  twitterCard: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image: string;
    creator?: string;
  };
  jsonLd?: any;
}

export interface CustomURL {
  id: string;
  funnelId: string;
  slug: string;
  isActive: boolean;
  isPrimary: boolean;
  redirectCount: number;
  lastAccessed?: Date;
  createdAt: Date;
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  strengths: string[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'title' | 'description' | 'keywords' | 'images' | 'structure';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

export interface SEOSuggestion {
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

// Hook para gerenciar URLs customizadas
export const useCustomURLs = (funnelId: string) => {
  const [urls, setUrls] = useState<CustomURL[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const loadURLs = useCallback(async () => {
    if (!funnelId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('funnel_urls')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUrls(data?.map(url => ({
        id: url.id,
        funnelId: url.funnel_id,
        slug: url.slug,
        isActive: url.is_active,
        isPrimary: url.is_primary,
        redirectCount: url.redirect_count || 0,
        lastAccessed: url.last_accessed ? new Date(url.last_accessed) : undefined,
        createdAt: new Date(url.created_at)
      })) || []);
    } catch (error) {
      console.error('Error loading URLs:', error);
    } finally {
      setLoading(false);
    }
  }, [funnelId]);

  const checkSlugAvailability = useCallback(async (slug: string): Promise<boolean> => {
    if (!slug || slug.length < 3) return false;
    
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('funnel_urls')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error && error.code === 'PGRST116') {
        // Não encontrado = disponível
        return true;
      }

      return !data; // Se tem dados, não está disponível
    } catch (error) {
      console.error('Error checking slug:', error);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  const createURL = useCallback(async (slug: string, isPrimary = false): Promise<boolean> => {
    try {
      const isAvailable = await checkSlugAvailability(slug);
      if (!isAvailable) return false;

      const { error } = await supabase
        .from('funnel_urls')
        .insert({
          funnel_id: funnelId,
          slug,
          is_active: true,
          is_primary: isPrimary
        });

      if (error) throw error;

      await loadURLs();
      return true;
    } catch (error) {
      console.error('Error creating URL:', error);
      return false;
    }
  }, [funnelId, checkSlugAvailability, loadURLs]);

  const updateURL = useCallback(async (urlId: string, updates: Partial<CustomURL>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('funnel_urls')
        .update({
          slug: updates.slug,
          is_active: updates.isActive,
          is_primary: updates.isPrimary
        })
        .eq('id', urlId);

      if (error) throw error;

      await loadURLs();
      return true;
    } catch (error) {
      console.error('Error updating URL:', error);
      return false;
    }
  }, [loadURLs]);

  const deleteURL = useCallback(async (urlId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('funnel_urls')
        .delete()
        .eq('id', urlId);

      if (error) throw error;

      await loadURLs();
      return true;
    } catch (error) {
      console.error('Error deleting URL:', error);
      return false;
    }
  }, [loadURLs]);

  useEffect(() => {
    loadURLs();
  }, [loadURLs]);

  return {
    urls,
    loading,
    checking,
    checkSlugAvailability,
    createURL,
    updateURL,
    deleteURL,
    refresh: loadURLs
  };
};

// Hook para análise de SEO
export const useSEOAnalysis = () => {
  const analyzeSEO = useCallback((metadata: SEOMetadata): SEOAnalysis => {
    const issues: SEOIssue[] = [];
    const suggestions: SEOSuggestion[] = [];
    const strengths: string[] = [];

    // Análise do título
    if (!metadata.title) {
      issues.push({
        type: 'error',
        category: 'title',
        message: 'Título é obrigatório',
        impact: 'high',
        fix: 'Adicione um título descritivo para sua página'
      });
    } else {
      if (metadata.title.length < 30) {
        issues.push({
          type: 'warning',
          category: 'title',
          message: 'Título muito curto (mínimo 30 caracteres)',
          impact: 'medium',
          fix: 'Expanda o título para melhor descrição'
        });
      } else if (metadata.title.length > 60) {
        issues.push({
          type: 'warning',
          category: 'title',
          message: 'Título muito longo (máximo 60 caracteres)',
          impact: 'medium',
          fix: 'Reduza o título para não ser cortado nos resultados de busca'
        });
      } else {
        strengths.push('Título com tamanho ideal');
      }
    }

    // Análise da descrição
    if (!metadata.description) {
      issues.push({
        type: 'error',
        category: 'description',
        message: 'Meta descrição é obrigatória',
        impact: 'high',
        fix: 'Adicione uma descrição atrativa para os resultados de busca'
      });
    } else {
      if (metadata.description.length < 120) {
        issues.push({
          type: 'warning',
          category: 'description',
          message: 'Descrição muito curta (mínimo 120 caracteres)',
          impact: 'medium',
          fix: 'Expanda a descrição para ser mais informativa'
        });
      } else if (metadata.description.length > 160) {
        issues.push({
          type: 'warning',
          category: 'description',
          message: 'Descrição muito longa (máximo 160 caracteres)',
          impact: 'medium',
          fix: 'Reduza a descrição para não ser cortada'
        });
      } else {
        strengths.push('Meta descrição com tamanho ideal');
      }
    }

    // Análise das palavras-chave
    if (!metadata.keywords || metadata.keywords.length === 0) {
      suggestions.push({
        category: 'keywords',
        message: 'Adicione palavras-chave relevantes',
        priority: 'medium'
      });
    } else if (metadata.keywords.length > 10) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: 'Muitas palavras-chave (máximo 10)',
        impact: 'low',
        fix: 'Foque nas palavras-chave mais importantes'
      });
    } else {
      strengths.push('Palavras-chave definidas');
    }

    // Análise do Open Graph
    if (!metadata.openGraph.title || !metadata.openGraph.description) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: 'Open Graph incompleto',
        impact: 'medium',
        fix: 'Complete as informações para melhor compartilhamento social'
      });
    } else {
      strengths.push('Open Graph configurado');
    }

    if (!metadata.openGraph.image) {
      suggestions.push({
        category: 'images',
        message: 'Adicione uma imagem para compartilhamento social',
        priority: 'high'
      });
    } else {
      strengths.push('Imagem social definida');
    }

    // Análise do Twitter Card
    if (!metadata.twitterCard.title || !metadata.twitterCard.description) {
      suggestions.push({
        category: 'structure',
        message: 'Configure Twitter Card para melhor aparência no Twitter',
        priority: 'medium'
      });
    } else {
      strengths.push('Twitter Card configurado');
    }

    // Calcular score
    const totalChecks = 10;
    const errorPenalty = issues.filter(i => i.type === 'error').length * 20;
    const warningPenalty = issues.filter(i => i.type === 'warning').length * 10;
    const strengthBonus = strengths.length * 10;
    
    const score = Math.max(0, Math.min(100, 100 - errorPenalty - warningPenalty + strengthBonus));

    return {
      score,
      issues,
      suggestions,
      strengths
    };
  }, []);

  return { analyzeSEO };
};

// Componente de configuração de URL customizada
export const CustomURLEditor: React.FC<{
  funnelId: string;
  currentSlug?: string;
  onSave?: (slug: string) => void;
}> = ({ funnelId, currentSlug, onSave }) => {
  const [slug, setSlug] = useState(currentSlug || '');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { checkSlugAvailability, createURL, checking } = useCustomURLs(funnelId);

  const validateSlug = (value: string) => {
    // Remove caracteres especiais e espaços
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSlugChange = useCallback(async (value: string) => {
    const cleanSlug = validateSlug(value);
    setSlug(cleanSlug);

    if (cleanSlug.length >= 3) {
      const available = await checkSlugAvailability(cleanSlug);
      setIsAvailable(available);
    } else {
      setIsAvailable(null);
    }
  }, [checkSlugAvailability]);

  const handleSave = async () => {
    if (isAvailable && slug.length >= 3) {
      const success = await createURL(slug, true);
      if (success && onSave) {
        onSave(slug);
      }
    }
  };

  const getFullURL = () => {
    return `${window.location.origin}/${slug}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="slug">URL Customizada</Label>
        <div className="flex items-center mt-1">
          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
            {window.location.origin}/
          </span>
          <div className="relative flex-1">
            <Input
              id="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="meu-quiz-incrivel"
              className="rounded-l-none"
            />
            {checking && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
              </div>
            )}
            {!checking && isAvailable !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isAvailable ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {slug.length >= 3 && (
          <div className="mt-2">
            {isAvailable === true && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  URL disponível: <strong>{getFullURL()}</strong>
                </AlertDescription>
              </Alert>
            )}
            {isAvailable === false && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Esta URL já está em uso. Tente outra variação.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {slug.length > 0 && slug.length < 3 && (
          <p className="text-sm text-gray-500 mt-1">
            Mínimo de 3 caracteres
          </p>
        )}
      </div>

      <Button 
        onClick={handleSave}
        disabled={!isAvailable || slug.length < 3 || checking}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        Salvar URL
      </Button>
    </div>
  );
};

// Componente de configuração de SEO
export const SEOEditor: React.FC<{
  metadata: SEOMetadata;
  onChange: (metadata: SEOMetadata) => void;
}> = ({ metadata, onChange }) => {
  const { analyzeSEO } = useSEOAnalysis();
  const analysis = useMemo(() => analyzeSEO(metadata), [metadata, analyzeSEO]);

  const updateMetadata = (field: string, value: any) => {
    const newMetadata = { ...metadata };
    const fields = field.split('.');
    let current = newMetadata;
    
    for (let i = 0; i < fields.length - 1; i++) {
      current = current[fields[i]];
    }
    
    current[fields[fields.length - 1]] = value;
    onChange(newMetadata);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <div className="space-y-6">
      {/* Score SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Análise SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score SEO</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </span>
                <Badge variant={analysis.score >= 80 ? "secondary" : analysis.score >= 60 ? "outline" : "destructive"}>
                  {getScoreLabel(analysis.score)}
                </Badge>
              </div>
            </div>
            <Progress value={analysis.score} className="h-2" />
            
            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Problemas Encontrados</h4>
                {analysis.issues.map((issue, index) => (
                  <Alert key={index} className={
                    issue.type === 'error' ? 'border-red-200 bg-red-50' :
                    issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }>
                    <AlertDescription className="text-sm">
                      <strong>{issue.category}:</strong> {issue.message}
                      {issue.fix && (
                        <div className="mt-1 text-xs opacity-80">
                          💡 {issue.fix}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-700">Pontos Fortes</h4>
                <ul className="text-sm text-green-600 mt-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configurações SEO */}
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="seo-title">Título SEO</Label>
            <Input
              id="seo-title"
              value={metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              placeholder="Título otimizado para buscadores (30-60 caracteres)"
              maxLength={60}
            />
            <div className="text-xs text-gray-500 mt-1">
              {metadata.title.length}/60 caracteres
            </div>
          </div>

          <div>
            <Label htmlFor="seo-description">Meta Descrição</Label>
            <Textarea
              id="seo-description"
              value={metadata.description}
              onChange={(e) => updateMetadata('description', e.target.value)}
              placeholder="Descrição atrativa para os resultados de busca (120-160 caracteres)"
              maxLength={160}
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1">
              {metadata.description.length}/160 caracteres
            </div>
          </div>

          <div>
            <Label htmlFor="seo-keywords">Palavras-chave</Label>
            <Input
              id="seo-keywords"
              value={metadata.keywords.join(', ')}
              onChange={(e) => updateMetadata('keywords', 
                e.target.value.split(',').map(k => k.trim()).filter(k => k)
              )}
              placeholder="quiz, personalidade, estilo, descoberta"
            />
            <div className="text-xs text-gray-500 mt-1">
              Separe por vírgulas (máximo 10)
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Graph */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Facebook className="h-4 w-4" />
                  Facebook / Open Graph
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="og-title">Título</Label>
                  <Input
                    id="og-title"
                    value={metadata.openGraph.title}
                    onChange={(e) => updateMetadata('openGraph.title', e.target.value)}
                    placeholder="Título para compartilhamento"
                  />
                </div>
                <div>
                  <Label htmlFor="og-description">Descrição</Label>
                  <Textarea
                    id="og-description"
                    value={metadata.openGraph.description}
                    onChange={(e) => updateMetadata('openGraph.description', e.target.value)}
                    rows={2}
                    placeholder="Descrição para compartilhamento"
                  />
                </div>
                <div>
                  <Label htmlFor="og-image">Imagem URL</Label>
                  <Input
                    id="og-image"
                    value={metadata.openGraph.image}
                    onChange={(e) => updateMetadata('openGraph.image', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Twitter Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Twitter className="h-4 w-4" />
                  Twitter Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="twitter-title">Título</Label>
                  <Input
                    id="twitter-title"
                    value={metadata.twitterCard.title}
                    onChange={(e) => updateMetadata('twitterCard.title', e.target.value)}
                    placeholder="Título para Twitter"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter-description">Descrição</Label>
                  <Textarea
                    id="twitter-description"
                    value={metadata.twitterCard.description}
                    onChange={(e) => updateMetadata('twitterCard.description', e.target.value)}
                    rows={2}
                    placeholder="Descrição para Twitter"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter-image">Imagem URL</Label>
                  <Input
                    id="twitter-image"
                    value={metadata.twitterCard.image}
                    onChange={(e) => updateMetadata('twitterCard.image', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="canonical">URL Canônica</Label>
            <Input
              id="canonical"
              value={metadata.canonical || ''}
              onChange={(e) => updateMetadata('canonical', e.target.value)}
              placeholder="https://exemplo.com/pagina-principal"
            />
          </div>

          <div>
            <Label htmlFor="robots">Robots</Label>
            <Input
              id="robots"
              value={metadata.robots || ''}
              onChange={(e) => updateMetadata('robots', e.target.value)}
              placeholder="index, follow"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview das redes sociais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview de Compartilhamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook Preview */}
            <div className="border rounded p-3 bg-gray-50">
              <div className="text-xs text-gray-500 mb-2">Facebook</div>
              <div className="space-y-2">
                {metadata.openGraph.image && (
                  <div className="w-full h-32 bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={metadata.openGraph.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm line-clamp-2">
                    {metadata.openGraph.title || 'Título não definido'}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {metadata.openGraph.description || 'Descrição não definida'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {window.location.hostname}
                  </div>
                </div>
              </div>
            </div>

            {/* Twitter Preview */}
            <div className="border rounded p-3 bg-gray-50">
              <div className="text-xs text-gray-500 mb-2">Twitter</div>
              <div className="space-y-2">
                {metadata.twitterCard.image && (
                  <div className="w-full h-32 bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={metadata.twitterCard.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm line-clamp-2">
                    {metadata.twitterCard.title || 'Título não definido'}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {metadata.twitterCard.description || 'Descrição não definida'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {window.location.hostname}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default useCustomURLs;
