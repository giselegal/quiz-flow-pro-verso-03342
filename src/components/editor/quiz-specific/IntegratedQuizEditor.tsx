import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useEditor } from '@/context/EditorContext';
import { QuizMetadata, SavedQuiz, useQuizCRUD } from '@/hooks/useQuizCRUD';
import { useQuizStepsIntegration } from '@/hooks/useQuizStepsIntegration';
import { QuizQuestion } from '@/types/quiz';
import {
  BookOpen,
  Database,
  Edit,
  Eye,
  Play,
  Plus,
  Save,
  Settings,
  Target,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import QuestionEditor from '../../quiz-editor/QuestionEditor';

export default function IntegratedQuizEditor() {
  const { editorState } = useEditor();

  // Integração com hooks de CRUD e 21 etapas
  const { saveQuiz, loadUserQuizzes } = useQuizCRUD();
  const {
    stepsIntegration,
    loading: stepsLoading,
    saveCompleteQuiz,
    isQuizStep,
  } = useQuizStepsIntegration();

  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado do Quiz com tipos corretos
  const [quizMetadata, setQuizMetadata] = useState<QuizMetadata>({
    title: 'Novo Quiz',
    description: 'Descrição do quiz',
    category: 'general',
    difficulty: 'medium', // Usando valor correto do tipo
    timeLimit: undefined,
    isPublic: false,
    settings: {
      showProgress: true,
      randomizeQuestions: false,
      allowRetake: true,
      passScore: 70,
    },
  });

  // Carregar dados ao inicializar
  useEffect(() => {
    loadSavedQuizzes();
    loadAllSteps();
  }, []);

  const loadSavedQuizzes = async () => {
    try {
      setLoading(true);
      const quizzes = await loadUserQuizzes();
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os quizzes salvos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova pergunta
  const addNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      type: 'multiple-choice',
      question: 'Nova pergunta',
      options: [
        { id: 'opt1', text: 'Opção 1', isCorrect: true },
        { id: 'opt2', text: 'Opção 2', isCorrect: false },
        { id: 'opt3', text: 'Opção 3', isCorrect: false },
        { id: 'opt4', text: 'Opção 4', isCorrect: false },
      ],
      points: 10,
      timeLimit: 30,
      explanation: 'Explicação da resposta correta',
    };

    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestion(questions.length);
  };

  // Atualizar pergunta selecionada
  const updateQuestion = (updatedQuestion: QuizQuestion) => {
    if (selectedQuestion !== null) {
      setQuestions(prev =>
        prev.map((q, index) => (index === selectedQuestion ? updatedQuestion : q))
      );
    }
  };

  // Remover pergunta
  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestion === index) {
      setSelectedQuestion(null);
    } else if (selectedQuestion && selectedQuestion > index) {
      setSelectedQuestion(selectedQuestion - 1);
    }
  };

  // Salvar quiz completo
  const handleSaveQuiz = async () => {
    try {
      setLoading(true);

      const quizToSave = {
        metadata: quizMetadata,
        questions: questions,
      };

      await saveQuiz(quizToSave);

      toast({
        title: 'Sucesso!',
        description: 'Quiz salvo com sucesso.',
      });

      await loadSavedQuizzes();
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o quiz.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Integração com 21 etapas
  const handleIntegrateWithSteps = async () => {
    try {
      setLoading(true);

      if (questions.length === 0) {
        toast({
          title: 'Aviso',
          description: 'Adicione pelo menos uma pergunta antes de integrar com as etapas.',
          variant: 'destructive',
        });
        return;
      }

      await saveCompleteQuiz(quizMetadata, questions);

      toast({
        title: 'Sucesso!',
        description: 'Quiz integrado com as 21 etapas com sucesso.',
      });

      await loadAllSteps();
    } catch (error) {
      console.error('Erro ao integrar com etapas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível integrar o quiz com as etapas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar quiz salvo
  const loadSavedQuiz = (quiz: SavedQuiz) => {
    setQuizMetadata(quiz.metadata);
    setQuestions(quiz.questions);
    setSelectedQuestion(null);

    toast({
      title: 'Quiz Carregado',
      description: `Quiz "${quiz.metadata.title}" foi carregado para edição.`,
    });
  };

  if (isPreviewMode) {
    return (
      <div className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preview do Quiz</h2>
          <Button onClick={() => setIsPreviewMode(false)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Voltar ao Editor
          </Button>
        </div>
        <QuizPreview
          title={quizMetadata.title}
          description={quizMetadata.description}
          questions={questions}
          onComplete={results => {
            console.log('Resultados do quiz:', results);
            toast({
              title: 'Quiz Finalizado!',
              description: `Pontuação: ${results.score}/${results.totalQuestions}`,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Editor de Quiz Integrado
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreviewMode(true)}
            variant="outline"
            disabled={questions.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button
            onClick={handleIntegrateWithSteps}
            variant="outline"
            disabled={loading || questions.length === 0}
          >
            <Database className="w-4 h-4 mr-2" />
            Integrar 21 Etapas
          </Button>

          <Button onClick={handleSaveQuiz} disabled={loading || questions.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Quiz'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">
            <Target className="w-4 h-4 mr-2" />
            Perguntas ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="metadata">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="integration">
            <Database className="w-4 h-4 mr-2" />
            21 Etapas
          </TabsTrigger>
          <TabsTrigger value="library">
            <BookOpen className="w-4 h-4 mr-2" />
            Biblioteca ({savedQuizzes.length})
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das Tabs */}
        <div className="flex-1 mt-4">
          <TabsContent value="questions" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Lista de Perguntas */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Perguntas</span>
                      <Button size="sm" onClick={addNewQuestion}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                    {questions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Nenhuma pergunta adicionada ainda.
                      </p>
                    ) : (
                      questions.map((question, index) => (
                        <div
                          key={question.id}
                          className={`p-3 border rounded cursor-pointer transition-colors ${
                            selectedQuestion === index
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedQuestion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">{question.question}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {question.points}pts
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={e => {
                                e.stopPropagation();
                                removeQuestion(index);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Editor da Pergunta Selecionada */}
              <div className="lg:col-span-2">
                {selectedQuestion !== null && questions[selectedQuestion] ? (
                  <QuestionEditor
                    question={questions[selectedQuestion]}
                    onChange={updateQuestion}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Selecione uma pergunta para editá-la ou adicione uma nova pergunta.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Quiz</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Quiz</Label>
                  <Input
                    id="title"
                    value={quizMetadata.title}
                    onChange={e => setQuizMetadata(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do quiz"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={quizMetadata.category}
                    onChange={e => setQuizMetadata(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Matemática, História"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={quizMetadata.description}
                    onChange={e =>
                      setQuizMetadata(prev => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Descreva o objetivo e conteúdo do quiz"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <select
                    id="difficulty"
                    value={quizMetadata.difficulty}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                      }))
                    }
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="passingScore">Nota Mínima (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={quizMetadata.passingScore}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        passingScore: parseInt(e.target.value) || 70,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="timeLimit">Tempo Limite (minutos)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    value={quizMetadata.timeLimit || ''}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined,
                      }))
                    }
                    placeholder="Opcional"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="allowRetries"
                    type="checkbox"
                    checked={quizMetadata.allowRetries}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        allowRetries: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="allowRetries">Permitir refazer</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="showCorrectAnswers"
                    type="checkbox"
                    checked={quizMetadata.showCorrectAnswers}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        showCorrectAnswers: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="showCorrectAnswers">Mostrar respostas corretas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="randomizeQuestions"
                    type="checkbox"
                    checked={quizMetadata.randomizeQuestions}
                    onChange={e =>
                      setQuizMetadata(prev => ({
                        ...prev,
                        randomizeQuestions: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="randomizeQuestions">Embaralhar perguntas</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integração com 21 Etapas</CardTitle>
              </CardHeader>
              <CardContent>
                {stepsLoading ? (
                  <p>Carregando integração das etapas...</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sistema de integração com as 21 etapas do editor. Etapas identificadas como
                      quiz: {stepsIntegration.filter(step => isQuizStep(step.stepNumber)).length}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stepsIntegration
                        .filter(step => isQuizStep(step.stepNumber))
                        .map(step => (
                          <Card key={step.stepNumber} className="p-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Etapa {step.stepNumber}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {step.questions.length} perguntas
                              </span>
                            </div>
                            <p className="text-sm mt-2 truncate">
                              {step.templateData?.title || `Etapa ${step.stepNumber}`}
                            </p>
                          </Card>
                        ))}
                    </div>

                    <Button
                      onClick={handleIntegrateWithSteps}
                      disabled={loading || questions.length === 0}
                      className="w-full"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {loading ? 'Integrando...' : 'Integrar Quiz Atual com Etapas'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Biblioteca de Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando quizzes salvos...</p>
                ) : savedQuizzes.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum quiz salvo ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedQuizzes.map(quiz => (
                      <Card
                        key={quiz.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{quiz.metadata.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {quiz.questions.length} perguntas
                            </span>
                          </div>
                          <CardTitle className="text-lg">{quiz.metadata.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {quiz.metadata.description}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => loadSavedQuiz(quiz)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setQuestions(quiz.questions);
                                setQuizMetadata(quiz.metadata);
                                setIsPreviewMode(true);
                              }}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
