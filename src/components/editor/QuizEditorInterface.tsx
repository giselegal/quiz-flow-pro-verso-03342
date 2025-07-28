import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Save, Eye, Plus, Trash2, TestTube, ExternalLink,
  Palette, Settings, BarChart3 
} from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  points: Record<string, number>;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

interface QuizResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface QuizConfig {
  intro: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
  };
  questions: QuizQuestion[];
  results: QuizResult[];
}

interface FunnelData {
  id?: string;
  name: string;
  description: string;
  userId: number;
  isPublished: boolean;
  settings: string;
}

const QuizEditorInterface: React.FC = () => {
  // State para o quiz config
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    intro: {
      title: 'Descubra Seu Estilo Único',
      subtitle: 'Quiz Personalizado',
      description: 'Descubra qual estilo combina mais com você através deste quiz personalizado',
      buttonText: 'Começar Quiz'
    },
    questions: [
      {
        id: 'q1',
        text: 'Qual cor você mais gosta?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Azul', points: { elegante: 2, casual: 1 } },
          { id: 'o2', text: 'Vermelho', points: { elegante: 1, casual: 2 } },
          { id: 'o3', text: 'Verde', points: { elegante: 1, casual: 2 } }
        ]
      },
      {
        id: 'q2',
        text: 'Qual seu ambiente favorito?',
        type: 'single',
        options: [
          { id: 'o4', text: 'Escritório moderno', points: { elegante: 2, casual: 0 } },
          { id: 'o5', text: 'Café aconchegante', points: { elegante: 0, casual: 2 } },
          { id: 'o6', text: 'Parque ao ar livre', points: { elegante: 1, casual: 1 } }
        ]
      }
    ],
    results: [
      {
        id: 'elegante',
        title: 'Estilo Elegante',
        description: 'Você tem um estilo refinado e sofisticado. Prefere looks mais formais e bem estruturados.',
        imageUrl: 'https://via.placeholder.com/300x200/b89b7a/ffffff?text=Elegante'
      },
      {
        id: 'casual',
        title: 'Estilo Casual',
        description: 'Você prefere conforto e praticidade. Seu estilo é mais descontraído e funcional.',
        imageUrl: 'https://via.placeholder.com/300x200/432818/ffffff?text=Casual'
      }
    ]
  });

  const [funnelInfo, setFunnelInfo] = useState({
    name: 'Quiz Teste - Descubra Seu Estilo',
    description: 'Quiz para descobrir seu estilo pessoal único'
  });

  const [currentFunnelId, setCurrentFunnelId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Carregar funil existente se houver
  useEffect(() => {
    // Verificar se há um funil salvo no localStorage ou buscar do backend
    loadExistingFunnel();
  }, []);

  const loadExistingFunnel = async () => {
    try {
      // Buscar funnels do usuário
      const response = await fetch('http://localhost:3001/api/funnels/user/1');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const testFunnel = data.data.find((f: any) => f.name.includes('Quiz Teste'));
        if (testFunnel) {
          setCurrentFunnelId(testFunnel.id);
          setIsPublished(testFunnel.isPublished);
          
          // Parse das configurações se existirem
          if (testFunnel.settings) {
            try {
              const settings = JSON.parse(testFunnel.settings);
              if (settings.quiz_config) {
                setQuizConfig(settings.quiz_config);
              }
            } catch (e) {
              console.warn('Erro ao carregar configurações:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar funil:', error);
    }
  };

  // Salvar funil
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const funnelData = {
        name: funnelInfo.name,
        description: funnelInfo.description,
        userId: 1,
        settings: JSON.stringify({
          tracking_enabled: true,
          utm_tracking: true,
          quiz_config: quizConfig
        })
      };

      let response;
      if (currentFunnelId) {
        // Atualizar funil existente
        response = await fetch(`http://localhost:3001/api/funnels/${currentFunnelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(funnelData)
        });
      } else {
        // Criar novo funil
        response = await fetch('http://localhost:3001/api/funnels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(funnelData)
        });
      }

      const result = await response.json();
      
      if (result.success) {
        if (!currentFunnelId) {
          setCurrentFunnelId(result.data.id);
        }
        toast({
          title: 'Funil Salvo!',
          description: 'Suas alterações foram salvas com sucesso.',
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar');
      }
    } catch (error) {
      toast({
        title: 'Erro ao Salvar',
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  // Publicar funil
  const handlePublish = async () => {
    if (!currentFunnelId) {
      toast({
        title: 'Erro',
        description: 'Salve o funil antes de publicar.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/funnels/${currentFunnelId}/publish`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        setIsPublished(true);
        toast({
          title: 'Funil Publicado!',
          description: `Acesse em: ${result.publishUrl}`,
        });
      } else {
        throw new Error(result.error || 'Erro ao publicar');
      }
    } catch (error) {
      toast({
        title: 'Erro ao Publicar',
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: 'destructive',
      });
    }
    setIsPublishing(false);
  };

  // Testar funil
  const handleTest = () => {
    if (!currentFunnelId) {
      toast({
        title: 'Erro',
        description: 'Salve e publique o funil antes de testar.',
        variant: 'destructive',
      });
      return;
    }

    const testUrl = `/teste-funil?id=${currentFunnelId}`;
    window.open(testUrl, '_blank');
  };

  // Validar regras de pontuação
  const validateScoringRules = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quiz/validate-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizConfig })
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.isValid) {
          toast({
            title: 'Validação OK! ✅',
            description: `${result.summary.questionsCount} questões, ${result.summary.resultsCount} resultados, ${result.summary.totalOptions} opções`,
          });
        } else {
          toast({
            title: 'Problemas Encontrados ⚠️',
            description: `${result.issues.length} problemas: ${result.issues.slice(0, 2).join('; ')}${result.issues.length > 2 ? '...' : ''}`,
            variant: 'destructive',
          });
          console.log('Problemas detalhados:', result.issues);
        }
      }
    } catch (error) {
      toast({
        title: 'Erro na Validação',
        description: 'Não foi possível validar as regras de pontuação.',
        variant: 'destructive',
      });
    }
  };

  // Simular resultado do quiz
  const simulateQuizResult = async () => {
    // Criar respostas de exemplo (primeira opção de cada questão)
    const sampleAnswers: Record<string, string> = {};
    quizConfig.questions.forEach((question, index) => {
      if (question.options.length > 0) {
        sampleAnswers[index.toString()] = question.options[0].id;
      }
    });

    try {
      const response = await fetch('http://localhost:3001/api/quiz/simulate-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quizConfig, 
          answers: sampleAnswers 
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const scoresText = Object.entries(result.scores)
          .map(([id, score]) => `${id}: ${score}`)
          .join(', ');
          
        toast({
          title: `Resultado: ${result.resultData?.title || result.predominantResult}`,
          description: `Pontuações: ${scoresText}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na Simulação',
        description: 'Não foi possível simular o resultado.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editor de Quiz</h1>
          <p className="text-muted-foreground">
            Configure seu quiz, teste as regras de pontuação e publique
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={validateScoringRules}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Validar Regras
          </Button>
          
          <Button 
            onClick={simulateQuizResult}
            variant="outline"
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Simular Resultado
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
          
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || !currentFunnelId}
            variant="default"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
          
          <Button
            onClick={handleTest}
            disabled={!currentFunnelId || !isPublished}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Testar
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex gap-4 text-sm">
        <span className={`px-2 py-1 rounded ${currentFunnelId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {currentFunnelId ? `ID: ${currentFunnelId}` : 'Não salvo'}
        </span>
        <span className={`px-2 py-1 rounded ${isPublished ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
          {isPublished ? 'Publicado' : 'Rascunho'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração do Funil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração do Funil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="funnel-name">Nome do Funil</Label>
              <Input
                id="funnel-name"
                value={funnelInfo.name}
                onChange={(e) => setFunnelInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="funnel-description">Descrição</Label>
              <Textarea
                id="funnel-description"
                value={funnelInfo.description}
                onChange={(e) => setFunnelInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Introdução do Quiz</Label>
              <Input
                placeholder="Título"
                value={quizConfig.intro.title}
                onChange={(e) => setQuizConfig(prev => ({
                  ...prev,
                  intro: { ...prev.intro, title: e.target.value }
                }))}
              />
              <Input
                placeholder="Subtítulo"
                value={quizConfig.intro.subtitle}
                onChange={(e) => setQuizConfig(prev => ({
                  ...prev,
                  intro: { ...prev.intro, subtitle: e.target.value }
                }))}
              />
              <Textarea
                placeholder="Descrição"
                value={quizConfig.intro.description}
                onChange={(e) => setQuizConfig(prev => ({
                  ...prev,
                  intro: { ...prev.intro, description: e.target.value }
                }))}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview/Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Teste e Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Eye className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                {currentFunnelId && isPublished 
                  ? 'Funil publicado e pronto para teste'
                  : 'Salve e publique para testar'
                }
              </p>
              
              {currentFunnelId && isPublished && (
                <div className="space-y-2">
                  <Button onClick={handleTest} className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Quiz em Nova Aba
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    URL: /teste-funil?id={currentFunnelId}
                  </p>
                </div>
              )}
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {quizConfig.questions.length}
                </div>
                <div className="text-sm text-blue-600">Questões</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {quizConfig.results.length}
                </div>
                <div className="text-sm text-green-600">Resultados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Questões do Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quizConfig.questions.map((question, qIndex) => (
              <div key={question.id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Questão {qIndex + 1}</h4>
                </div>
                
                <Input
                  value={question.text}
                  onChange={(e) => {
                    const newQuestions = [...quizConfig.questions];
                    newQuestions[qIndex].text = e.target.value;
                    setQuizConfig(prev => ({ ...prev, questions: newQuestions }));
                  }}
                  className="mb-4"
                  placeholder="Texto da questão"
                />

                <div className="space-y-3">
                  <Label>Opções de Resposta</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex gap-3 items-center">
                      <Input
                        value={option.text}
                        onChange={(e) => {
                          const newQuestions = [...quizConfig.questions];
                          newQuestions[qIndex].options[oIndex].text = e.target.value;
                          setQuizConfig(prev => ({ ...prev, questions: newQuestions }));
                        }}
                        placeholder={`Opção ${oIndex + 1}`}
                      />
                      
                      <div className="flex gap-2 min-w-0">
                        {quizConfig.results.map(result => (
                          <div key={result.id} className="flex items-center gap-1">
                            <Label className="text-xs">{result.id}:</Label>
                            <Input
                              type="number"
                              value={option.points[result.id] || 0}
                              onChange={(e) => {
                                const newQuestions = [...quizConfig.questions];
                                newQuestions[qIndex].options[oIndex].points[result.id] = parseInt(e.target.value) || 0;
                                setQuizConfig(prev => ({ ...prev, questions: newQuestions }));
                              }}
                              className="w-16"
                              min="0"
                              max="10"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados Possíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizConfig.results.map((result, rIndex) => (
              <div key={result.id} className="border p-4 rounded-lg">
                <Input
                  value={result.title}
                  onChange={(e) => {
                    const newResults = [...quizConfig.results];
                    newResults[rIndex].title = e.target.value;
                    setQuizConfig(prev => ({ ...prev, results: newResults }));
                  }}
                  className="mb-2 font-semibold"
                  placeholder="Título do resultado"
                />
                
                <Textarea
                  value={result.description}
                  onChange={(e) => {
                    const newResults = [...quizConfig.results];
                    newResults[rIndex].description = e.target.value;
                    setQuizConfig(prev => ({ ...prev, results: newResults }));
                  }}
                  rows={3}
                  placeholder="Descrição do resultado"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizEditorInterface;
