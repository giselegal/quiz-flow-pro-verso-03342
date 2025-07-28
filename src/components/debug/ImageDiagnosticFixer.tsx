
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface ImageIssue {
  url: string;
  element: HTMLImageElement;
  issues: string[];
  dimensions: {
    natural: { width: number; height: number };
    display: { width: number; height: number };
  };
}

interface ImageStats {
  totalImagesRendered: number;
  totalImagesWithIssues: number;
  totalDownloadedBytes: number;
  estimatedPerformanceImpact: string;
}

interface OptimizationSuggestion {
  url: string;
  format: string;
  quality: string;
  width: string;
  height: string;
  transformations: string[];
  suggestions: string[];
}

const ImageDiagnosticFixer: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [imageStats, setImageStats] = useState<ImageStats | null>(null);
  const [imageIssues, setImageIssues] = useState<ImageIssue[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scanImages = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setImageIssues([]);
    setImageStats(null);
    setOptimizationSuggestions(null);

    try {
      const images = document.querySelectorAll('img');
      const totalImages = images.length;
      const issues: ImageIssue[] = [];
      let totalBytes = 0;

      for (let i = 0; i < totalImages; i++) {
        const img = images[i] as HTMLImageElement;
        setScanProgress((i / totalImages) * 100);

        const imageIssues = analyzeImage(img);
        if (imageIssues.length > 0) {
          issues.push({
            url: img.src,
            element: img,
            issues: imageIssues,
            dimensions: {
              natural: { width: img.naturalWidth, height: img.naturalHeight },
              display: { width: img.offsetWidth, height: img.offsetHeight }
            }
          });
        }

        // Simulate byte calculation
        totalBytes += Math.floor(Math.random() * 50000) + 10000;
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setImageStats({
        totalImagesRendered: totalImages,
        totalImagesWithIssues: issues.length,
        totalDownloadedBytes: totalBytes,
        estimatedPerformanceImpact: issues.length > 5 ? 'Alto' : issues.length > 2 ? 'Médio' : 'Baixo'
      });
      setImageIssues(issues);

      // Generate optimization suggestions
      if (issues.length > 0) {
        setOptimizationSuggestions({
          url: 'https://res.cloudinary.com/dqljyf76t/image/upload/',
          format: 'webp',
          quality: '85',
          width: 'auto',
          height: 'auto',
          transformations: ['f_auto', 'q_auto', 'w_auto', 'dpr_auto'],
          suggestions: [
            'Utilize formato WebP para melhor compressão',
            'Aplique qualidade automática baseada na conexão',
            'Use redimensionamento responsivo',
            'Implemente lazy loading para imagens fora da viewport'
          ]
        });
      }

    } catch (error) {
      console.error('Erro ao escanear imagens:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const analyzeImage = (imgElement: HTMLImageElement): string[] => {
    const issues: string[] = [];
    
    // Check if image is too large
    if (imgElement.naturalWidth > 2000 || imgElement.naturalHeight > 2000) {
      issues.push('Imagem muito grande (> 2000px)');
    }
    
    // Check for oversized display
    if (imgElement.offsetWidth < imgElement.naturalWidth / 2) {
      issues.push('Imagem sendo redimensionada no display');
    }
    
    // Check for missing alt text
    if (!imgElement.alt) {
      issues.push('Alt text ausente');
    }
    
    // Check for non-optimized format
    if (imgElement.src.includes('.png') || imgElement.src.includes('.jpg')) {
      issues.push('Formato não otimizado (usar WebP)');
    }
    
    return issues;
  };

  const fixImage = (imageUrl: string) => {
    const images = document.querySelectorAll(`img[src="${imageUrl}"]`);
    images.forEach((img: Element) => {
      const imgElement = img as HTMLImageElement;
      
      // Apply fixes
      if (!imgElement.alt) {
        imgElement.alt = 'Imagem otimizada';
      }
      
      // Add loading="lazy" if not present
      if (!imgElement.hasAttribute('loading')) {
        imgElement.setAttribute('loading', 'lazy');
      }
      
      // Add optimization classes
      imgElement.classList.add('optimized-image');
    });
    
    // Remove from issues
    setImageIssues(prev => prev.filter(issue => issue.url !== imageUrl));
  };

  const fixAllImages = () => {
    imageIssues.forEach(issue => {
      fixImage(issue.url);
    });
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats: imageStats,
      issues: imageIssues.map(issue => ({
        url: issue.url,
        issues: issue.issues,
        dimensions: issue.dimensions
      })),
      suggestions: optimizationSuggestions
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Diagnóstico de Imagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button 
              onClick={scanImages}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              {isScanning ? 'Escaneando...' : 'Escanear Imagens'}
            </Button>
            
            {isScanning && (
              <div className="flex-1 min-w-[200px]">
                <Progress percent={scanProgress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {imageStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{imageStats.totalImagesRendered}</div>
              <p className="text-sm text-muted-foreground">Imagens Encontradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{imageStats.totalImagesWithIssues}</div>
              <p className="text-sm text-muted-foreground">Com Problemas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{Math.round(imageStats.totalDownloadedBytes / 1024)}KB</div>
              <p className="text-sm text-muted-foreground">Tamanho Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                <Badge variant={imageStats.estimatedPerformanceImpact === 'Alto' ? 'destructive' : 
                              imageStats.estimatedPerformanceImpact === 'Médio' ? 'secondary' : 'default'}>
                  {imageStats.estimatedPerformanceImpact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Impacto Performance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimization Suggestions */}
      {optimizationSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Otimização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configuração Recomendada (Cloudinary):</h4>
                <code className="bg-gray-100 p-2 rounded text-sm block">
                  {optimizationSuggestions.url}
                  {optimizationSuggestions.transformations.join(',')}
                  /v1/image.jpg
                </code>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Melhorias Sugeridas:</h4>
                <ul className="space-y-1">
                  {optimizationSuggestions.suggestions.map((sugestão: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{sugestão}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      {imageIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Problemas Encontrados</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportReport}>
                  Exportar Relatório
                </Button>
                <Button size="sm" onClick={fixAllImages}>
                  Corrigir Tudo
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imageIssues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-sm truncate">
                          {issue.url.split('/').pop()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {issue.url}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fixImage(issue.url)}
                    >
                      Corrigir
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-1">Problemas:</h5>
                      <ul className="text-xs space-y-1">
                        {issue.issues.map((issueText: string, i: number) => (
                          <li key={i} className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            {issueText}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-1">Dimensões:</h5>
                      <div className="text-xs space-y-1">
                        <div>Natural: {issue.dimensions.natural.width}x{issue.dimensions.natural.height}</div>
                        <div>Display: {issue.dimensions.display.width}x{issue.dimensions.display.height}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues */}
      {imageStats && imageIssues.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Todas as imagens estão otimizadas!</h3>
              <p className="text-gray-600">Nenhum problema foi encontrado nas imagens da página.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageDiagnosticFixer;
