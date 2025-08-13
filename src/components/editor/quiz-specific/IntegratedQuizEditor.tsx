import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseQuizEditor, QuizData, SavedQuiz } from '@/hooks/useSupabaseQuizEditor';
import { QuizQuestion } from '@/types/quiz';
import { BookOpen, Eye, Plus, Save, Settings, Database, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function IntegratedQuizEditor() {
  const [activeTab, setActiveTab] = useState('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  
  const { user } = useAuth();
  const { saveQuiz, loadQuiz, loadAllQuizzes, deleteQuiz } = useQuizCRUD();
  
  const [quiz, setQuiz] = useState({
    id: null,
    title: 'Novo Quiz',
    description: 'Descrição do quiz',
    questions: [
      {
        id: 1,
        question: 'Pergunta de exemplo?',
        options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        correctAnswers: [0],
        type: 'single' as const,
      }
    ],
    settings: {
      timeLimit: 300,
      randomizeQuestions: false,
      showCorrectAnswers: true,
    }
  });

  // Testar conexão com Supabase
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('quizzes').select('count').limit(1);
        if (error) throw error;
        setConnectionStatus('connected');
        await loadSavedQuizzes();
      } catch (error) {
        console.error('Erro de conexão:', error);
        setConnectionStatus('error');
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao banco de dados",
          variant: "destructive",
        });
      }
    };
    testConnection();
  }, []);

  const loadSavedQuizzes = async () => {
    try {
      const quizzes = await loadAllQuizzes();
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
    }
  };

  const handleSaveQuiz = async () => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar um quiz",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const savedQuiz = await saveQuiz({
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        settings: quiz.settings,
        author_id: user.id
      });
      
      setQuiz(prev => ({ ...prev, id: savedQuiz.id }));
      
      toast({
        title: "Quiz salvo!",
        description: "Quiz foi salvo com sucesso no banco de dados",
      });
      
      await loadSavedQuizzes();
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o quiz",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadQuiz = async (quizId: string) => {
    setIsLoading(true);
    try {
      const loadedQuiz = await loadQuiz(quizId);
      setQuiz({
        id: loadedQuiz.id,
        title: loadedQuiz.title,
        description: loadedQuiz.description,
        questions: loadedQuiz.questions,
        settings: loadedQuiz.settings || {
          timeLimit: 300,
          randomizeQuestions: false,
          showCorrectAnswers: true,
        }
      });
      
      toast({
        title: "Quiz carregado!",
        description: "Quiz foi carregado do banco de dados",
      });
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now(),
      question: 'Nova pergunta?',
      options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
      correctAnswers: [0],
      type: 'single',
    };
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateQuizInfo = (field: string, value: any) => {
    setQuiz(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Status de Conexão */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : connectionStatus === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <Database className="w-4 h-4 mr-2" />
            {connectionStatus === 'connected' && 'Conectado ao banco de dados'}
            {connectionStatus === 'error' && 'Erro de conexão com banco'}
            {connectionStatus === 'checking' && 'Verificando conexão...'}
          </div>
        </div>

        {/* Título do Editor */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Editor de Quiz Integrado
          </h1>
          <p className="text-lg text-gray-600">
            Sistema completo para criação e gestão de quizzes
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Gerenciar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Aba de Edição */}
          <TabsContent value="edit">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Painel de Edição */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Dados do Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Título do Quiz</Label>
                    <Input
                      id="title"
                      value={quiz.title}
                      onChange={(e) => updateQuizInfo('title', e.target.value)}
                      placeholder="Digite o título do quiz"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={quiz.description}
                      onChange={(e) => updateQuizInfo('description', e.target.value)}
                      placeholder="Descreva o quiz"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Perguntas</h3>
                      <Button onClick={addQuestion} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>

                    {quiz.questions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <div className="space-y-3">
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder="Digite a pergunta"
                            className="font-medium"
                          />
                          
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <input
                                  type={question.type === 'single' ? 'radio' : 'checkbox'}
                                  name={`question-${question.id}`}
                                  checked={question.correctAnswers.includes(optionIndex)}
                                  onChange={(e) => {
                                    const newCorrectAnswers = e.target.checked
                                      ? [...question.correctAnswers, optionIndex]
                                      : question.correctAnswers.filter(i => i !== optionIndex);
                                    updateQuestion(index, 'correctAnswers', newCorrectAnswers);
                                  }}
                                  className="text-blue-600"
                                />
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(index, 'options', newOptions);
                                  }}
                                  placeholder={`Opção ${optionIndex + 1}`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button 
                    onClick={handleSaveQuiz} 
                    disabled={isSaving} 
                    className="w-full"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Quiz
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Painel de Configurações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Tempo Limite (segundos)</Label>
                    <Input
                      type="number"
                      value={quiz.settings.timeLimit}
                      onChange={(e) => updateSettings('timeLimit', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="randomize"
                      checked={quiz.settings.randomizeQuestions}
                      onChange={(e) => updateSettings('randomizeQuestions', e.target.checked)}
                      className="text-blue-600"
                    />
                    <Label htmlFor="randomize">Embaralhar perguntas</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showAnswers"
                      checked={quiz.settings.showCorrectAnswers}
                      onChange={(e) => updateSettings('showCorrectAnswers', e.target.checked)}
                      className="text-blue-600"
                    />
                    <Label htmlFor="showAnswers">Mostrar respostas corretas</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Preview */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visualização do Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuizPreview 
                  quiz={{
                    ...quiz,
                    id: quiz.id || 'preview'
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Gerenciamento */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Quizzes Salvos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Carregando...
                  </div>
                ) : savedQuizzes.length > 0 ? (
                  <div className="space-y-3">
                    {savedQuizzes.map((savedQuiz: any) => (
                      <div key={savedQuiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{savedQuiz.title}</h3>
                          <p className="text-sm text-gray-600">{savedQuiz.description}</p>
                        </div>
                        <Button
                          onClick={() => handleLoadQuiz(savedQuiz.id)}
                          variant="outline"
                          size="sm"
                        >
                          Carregar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum quiz salvo ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Status da Conexão</h3>
                    <p className="text-blue-600">
                      {connectionStatus === 'connected' && '✅ Conectado ao Supabase'}
                      {connectionStatus === 'error' && '❌ Erro de conexão'}
                      {connectionStatus === 'checking' && '⏳ Verificando...'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Informações do Sistema</h3>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Editor integrado com Supabase</li>
                      <li>• Salvamento automático em nuvem</li>
                      <li>• Interface responsiva e intuitiva</li>
                      <li>• Preview em tempo real</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
