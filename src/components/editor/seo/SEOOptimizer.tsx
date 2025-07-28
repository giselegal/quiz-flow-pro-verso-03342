
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SEOOptimizerProps {
  funnelId: string;
}

export const SEOOptimizer: React.FC<SEOOptimizerProps> = ({ funnelId }) => {
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  });

  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAnalyze = () => {
    // Simulate SEO analysis
    const newScore = Math.floor(Math.random() * 100);
    setScore(newScore);
    
    const newSuggestions = [
      'Adicione palavras-chave relevantes no título',
      'Meta description muito curta, recomendado 150-160 caracteres',
      'Inclua uma imagem Open Graph',
      'Optimize o título para mecanismos de busca'
    ];
    
    setSuggestions(newSuggestions);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título SEO</Label>
              <Input
                id="title"
                value={seoData.title}
                onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título otimizado para SEO"
              />
            </div>
            
            <div>
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                id="keywords"
                value={seoData.keywords}
                onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="palavra1, palavra2, palavra3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={seoData.description}
              onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição que aparecerá nos resultados de busca"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ogTitle">Open Graph Title</Label>
              <Input
                id="ogTitle"
                value={seoData.ogTitle}
                onChange={(e) => setSeoData(prev => ({ ...prev, ogTitle: e.target.value }))}
                placeholder="Título para redes sociais"
              />
            </div>
            
            <div>
              <Label htmlFor="ogImage">Open Graph Image</Label>
              <Input
                id="ogImage"
                value={seoData.ogImage}
                onChange={(e) => setSeoData(prev => ({ ...prev, ogImage: e.target.value }))}
                placeholder="URL da imagem para redes sociais"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ogDescription">Open Graph Description</Label>
            <Textarea
              id="ogDescription"
              value={seoData.ogDescription}
              onChange={(e) => setSeoData(prev => ({ ...prev, ogDescription: e.target.value }))}
              placeholder="Descrição para redes sociais"
              rows={2}
            />
          </div>

          <Button onClick={handleAnalyze} className="w-full">
            Analisar SEO
          </Button>
        </CardContent>
      </Card>

      {score > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getScoreIcon(score)}
              Score SEO: <span className={getScoreColor(score)}>{score}/100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-medium">Sugestões de Melhoria:</h4>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
