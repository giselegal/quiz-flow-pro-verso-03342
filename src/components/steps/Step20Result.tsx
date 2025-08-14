import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { quizResultsService, type QuizResults } from '@/services/quizResultsService';
import {
  ChevronRight,
  Download,
  Heart,
  Lightbulb,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Step20ResultProps {
  sessionId: string;
  onContinue?: () => void;
}

/**
 * 🎯 STEP 20: RESULTADO FINAL DO QUIZ DE ESTILO
 *
 * Exibe o resultado personalizado baseado no styleConfig.ts
 * - Estilo predominante com imagem e descrição
 * - Guia personalizado para download
 * - Recomendações de guarda-roupa, cores e marcas
 * - Progress e scores detalhados
 */
export default function Step20Result({ sessionId, onContinue }: Step20ResultProps) {
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar resultados existentes
      let loadedResults = await quizResultsService.getResults(sessionId);

      // Se não existir, calcular novos resultados
      if (!loadedResults) {
        console.log('⚡ Calculando novos resultados...');

        // Simular dados da sessão para cálculo
        const mockSession = {
          id: sessionId,
          session_id: sessionId,
          responses: {}, // Seria carregado do banco de dados real
          current_step: 20,
        };

        loadedResults = await quizResultsService.calculateResults(mockSession);
      }

      setResults(loadedResults);
    } catch (err: any) {
      console.error('❌ Erro ao carregar resultados:', err);
      setError(err.message || 'Erro ao carregar resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGuide = () => {
    if (results?.recommendations.guide.downloadUrl) {
      window.open(results.recommendations.guide.downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold text-[#432818]">Analisando seu estilo pessoal...</h2>
          <p className="text-[#6B4F43]">
            Estamos processando suas respostas para criar seu guia personalizado
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-[#432818]">Oops! Algo deu errado</h2>
            <p className="text-[#6B4F43]">{error || 'Não foi possível carregar seus resultados'}</p>
            <Button onClick={loadResults} className="bg-[#B89B7A] hover:bg-[#432818] text-white">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { styleProfile, recommendations, completionScore } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10">
      {/* Header com resultado principal */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">
                {results.userName 
                  ? `Resultado Personalizado para ${results.userName}`
                  : 'Seu Resultado Personalizado'
                }
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">
              {results.userName ? (
                <>
                  Olá <span className="text-[#FAF9F7]">{results.userName}</span>,<br />
                  Seu Estilo é <span className="text-[#FAF9F7]">{styleProfile.primaryStyle}</span>
                </>
              ) : (
                <>
                  Seu Estilo é <span className="text-[#FAF9F7]">{styleProfile.primaryStyle}</span>
                </>
              )}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {results.userName 
                ? `${results.userName}, ${styleProfile.primaryStyleConfig.description.toLowerCase()}`
                : styleProfile.primaryStyleConfig.description
              }
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {styleProfile.primaryStyleConfig.category}
              </Badge>
              {styleProfile.secondaryStyle && (
                <Badge variant="outline" className="border-white/30 text-white">
                  + {styleProfile.secondaryStyle}
                </Badge>
              )}
              <Badge variant="outline" className="border-white/30 text-white">
                {Math.round(completionScore)}% Completo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Imagem do estilo e guia */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={styleProfile.primaryStyleConfig.image}
                alt={`Estilo ${styleProfile.primaryStyle}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-semibold mb-2">Seu Look Inspiração</h3>
                <p className="text-sm opacity-90">
                  Este visual representa perfeitamente seu estilo {styleProfile.primaryStyle}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Seu Guia Personalizado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <img
                  src={styleProfile.primaryStyleConfig.guideImage}
                  alt={`Guia ${styleProfile.primaryStyle}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-[#432818]">Dicas Personalizadas:</h4>
                <ul className="space-y-2">
                  {recommendations.guide.personalizedTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-[#6B4F43]">
                      <Star className="h-4 w-4 mt-0.5 text-[#B89B7A] flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleDownloadGuide}
                className="w-full bg-[#B89B7A] hover:bg-[#432818] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Guia Completo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com recomendações detalhadas */}
        <Tabs defaultValue="wardrobe" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wardrobe" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Guarda-roupa</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Compras</span>
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Styling</span>
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Análise</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wardrobe" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essenciais</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.wardrobe.essentials.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-[#B89B7A] rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cores Ideais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations.wardrobe.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></div>
                        <span className="text-sm">{color}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estampas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.wardrobe.patterns.map((pattern, index) => (
                      <li key={index} className="text-sm">
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acessórios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.wardrobe.accessories.map((accessory, index) => (
                      <li key={index} className="text-sm">
                        {accessory}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prioridades</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.shopping.priorityItems.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#B89B7A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dicas de Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.shopping.budgetSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Lightbulb className="h-4 w-4 mt-0.5 text-[#B89B7A] flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Marcas Recomendadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.shopping.brands.map((brand, index) => (
                      <li key={index} className="text-sm font-medium">
                        {brand}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="styling" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dicas de Styling</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.styling.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-[#FAF9F7] rounded-lg"
                      >
                        <div className="w-6 h-6 bg-[#B89B7A] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Looks para Ocasiões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(recommendations.styling.occasions).map(
                      ([occasion, outfits]) => (
                        <div key={occasion} className="border-l-4 border-[#B89B7A] pl-4">
                          <h4 className="font-semibold text-[#432818] mb-2 capitalize">
                            {occasion}
                          </h4>
                          <ul className="space-y-1">
                            {outfits.map((outfit, index) => (
                              <li key={index} className="text-sm text-[#6B4F43]">
                                {outfit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise Detalhada do Seu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#432818] mb-4">Scores por Estilo</h4>
                    <div className="space-y-3">
                      {Object.entries(styleProfile.styleScores)
                        .sort(([, a], [, b]) => b - a)
                        .map(([style, score]) => (
                          <div key={style} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className={score > 0 ? 'font-medium' : 'text-gray-500'}>
                                {style}
                              </span>
                              <span
                                className={score > 0 ? 'font-bold text-[#432818]' : 'text-gray-400'}
                              >
                                {score > 0
                                  ? `${Math.round((score / Math.max(...Object.values(styleProfile.styleScores))) * 100)}%`
                                  : '0%'}
                              </span>
                            </div>
                            <Progress
                              value={
                                score > 0
                                  ? (score / Math.max(...Object.values(styleProfile.styleScores))) *
                                    100
                                  : 0
                              }
                              className="h-2"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#432818] mb-4">Perfil Resumido</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-[#6B4F43]">Estilo Principal</span>
                        <span className="font-semibold text-[#432818]">
                          {styleProfile.primaryStyle}
                        </span>
                      </div>
                      {styleProfile.secondaryStyle && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-[#6B4F43]">Estilo Complementar</span>
                          <span className="font-semibold text-[#432818]">
                            {styleProfile.secondaryStyle}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-[#6B4F43]">Nível de Confiança</span>
                        <span className="font-semibold text-[#432818]">
                          {Math.round(styleProfile.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-[#6B4F43]">Quiz Completude</span>
                        <span className="font-semibold text-[#432818]">
                          {Math.round(completionScore)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Parabéns! Você descobriu seu estilo único</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Agora que você conhece seu perfil de estilo, que tal explorar produtos e looks
              personalizados especialmente para você?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleDownloadGuide}
                variant="secondary"
                size="lg"
                className="bg-white text-[#432818] hover:bg-gray-100"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Guia Completo
              </Button>
              {onContinue && (
                <Button
                  onClick={onContinue}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#432818]"
                >
                  Explorar Produtos
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
