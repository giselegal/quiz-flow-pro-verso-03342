import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { QuizData, SavedQuiz, useSupabaseQuizEditor } from '@/hooks/useSupabaseQuizEditor';
import { BookOpen, Database, Loader2, Plus, Save, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IntegratedQuizEditorProps {
  onSave?: () => void;
  onPreview?: () => void;
  className?: string;
}

export default function IntegratedQuizEditor({
  onSave,
  onPreview,
  className,
}: IntegratedQuizEditorProps = {}) {
  const [activeTab, setActiveTab] = useState('edit');
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);

  const {
    isLoading,
    isSaving,
    connectionStatus,
    testConnection,
    saveQuiz,
    loadQuiz,
    loadAllQuizzes,
    deleteQuiz,
  } = useSupabaseQuizEditor();

  const [quiz, setQuiz] = useState<QuizData>({
    title: 'Novo Quiz',
    description: 'Descrição do quiz',
    questions: [
      {
        id: 1,
        question: 'Pergunta de exemplo?',
        options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        correctAnswers: [0],
        type: 'single',
      },
    ],
    settings: {
      timeLimit: 300,
      randomizeQuestions: false,
      showCorrectAnswers: true,
    },
  });

  // Testar conexão com Supabase ao carregar
  useEffect(() => {
    testConnection();
    loadSavedQuizzes();
  }, [testConnection]);

  const loadSavedQuizzes = async () => {
    try {
      const quizzes = await loadAllQuizzes();
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      const savedId = await saveQuiz(quiz);
      if (savedId) {
        setQuiz(prev => ({ ...prev, id: savedId }));
        await loadSavedQuizzes(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
    }
  };

  const handleLoadQuiz = async (quizId: string) => {
    try {
      const loadedQuiz = await loadQuiz(quizId);
      if (loadedQuiz) {
        setQuiz(loadedQuiz);
        toast({
          title: 'Quiz carregado!',
          description: 'Quiz foi carregado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      await loadSavedQuizzes();
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: 'Nova pergunta?',
      options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
      correctAnswers: [0],
      type: 'single' as const,
    };
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }));
  };

  const updateQuizInfo = (field: string, value: any) => {
    setQuiz(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (field: string, value: any) => {
    setQuiz(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Status de Conexão */}
        <div className="mb-6 text-center">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected'
                ? 'bg-green-100 text-green-800'
                : connectionStatus === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <Database className="w-4 h-4 mr-2" />
            {connectionStatus === 'connected' && 'Sistema Online'}
            {connectionStatus === 'error' && 'Sistema Offline'}
            {connectionStatus === 'checking' && 'Verificando...'}
          </div>
        </div>

        {/* Título do Editor */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Editor de Quiz Integrado</h1>
          <p className="text-lg text-gray-600">Sistema completo para criação e gestão de quizzes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Editor
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
                      onChange={e => updateQuizInfo('title', e.target.value)}
                      placeholder="Digite o título do quiz"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={quiz.description}
                      onChange={e => updateQuizInfo('description', e.target.value)}
                      placeholder="Descreva o quiz"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Perguntas ({quiz.questions.length})</h3>
                      <Button onClick={addQuestion} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>

                    {quiz.questions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Pergunta {index + 1}
                            </span>
                            {quiz.questions.length > 1 && (
                              <Button
                                onClick={() => {
                                  setQuiz(prev => ({
                                    ...prev,
                                    questions: prev.questions.filter((_, i) => i !== index),
                                  }));
                                }}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                Remover
                              </Button>
                            )}
                          </div>

                          <Input
                            value={question.question}
                            onChange={e => updateQuestion(index, 'question', e.target.value)}
                            placeholder="Digite a pergunta"
                            className="font-medium"
                          />

                          <div className="space-y-2">
                            <Label className="text-sm text-gray-600">
                              Opções (marque as corretas):
                            </Label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <input
                                  type={question.type === 'single' ? 'radio' : 'checkbox'}
                                  name={`question-${question.id}`}
                                  checked={question.correctAnswers.includes(optionIndex)}
                                  onChange={e => {
                                    let newCorrectAnswers;
                                    if (question.type === 'single') {
                                      newCorrectAnswers = e.target.checked ? [optionIndex] : [];
                                    } else {
                                      newCorrectAnswers = e.target.checked
                                        ? [...question.correctAnswers, optionIndex]
                                        : question.correctAnswers.filter(i => i !== optionIndex);
                                    }
                                    updateQuestion(index, 'correctAnswers', newCorrectAnswers);
                                  }}
                                  className="text-blue-600"
                                />
                                <Input
                                  value={option}
                                  onChange={e => {
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

                  <Button onClick={handleSaveQuiz} disabled={isSaving} className="w-full" size="lg">
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
                    Configurações do Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Tempo Limite (segundos)</Label>
                    <Input
                      type="number"
                      value={quiz.settings.timeLimit}
                      onChange={e => updateSettings('timeLimit', parseInt(e.target.value) || 0)}
                      className="mt-1"
                      min="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">0 = sem limite de tempo</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="randomize"
                      checked={quiz.settings.randomizeQuestions}
                      onChange={e => updateSettings('randomizeQuestions', e.target.checked)}
                      className="text-blue-600"
                    />
                    <Label htmlFor="randomize">Embaralhar perguntas</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showAnswers"
                      checked={quiz.settings.showCorrectAnswers}
                      onChange={e => updateSettings('showCorrectAnswers', e.target.checked)}
                      className="text-blue-600"
                    />
                    <Label htmlFor="showAnswers">Mostrar respostas corretas ao final</Label>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Resumo do Quiz</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>
                        • {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? 's' : ''}
                      </p>
                      <p>
                        • Tipo:{' '}
                        {quiz.questions[0]?.type === 'single'
                          ? 'Única escolha'
                          : 'Múltipla escolha'}
                      </p>
                      <p>
                        • Tempo:{' '}
                        {quiz.settings.timeLimit > 0 ? `${quiz.settings.timeLimit}s` : 'Ilimitado'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Gerenciamento */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Quizzes Salvos ({savedQuizzes.length})
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
                    {savedQuizzes.map(savedQuiz => (
                      <div
                        key={savedQuiz.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{savedQuiz.title}</h3>
                          <p className="text-sm text-gray-600">{savedQuiz.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {savedQuiz.questions_count} pergunta
                            {savedQuiz.questions_count !== 1 ? 's' : ''} • Criado em{' '}
                            {new Date(savedQuiz.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleLoadQuiz(savedQuiz.id)}
                            variant="outline"
                            size="sm"
                          >
                            Carregar
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuiz(savedQuiz.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Nenhum quiz salvo ainda</p>
                    <p className="text-sm">Comece criando seu primeiro quiz na aba Editor</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Configurações do Sistema */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Status da Conexão</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          connectionStatus === 'connected'
                            ? 'bg-green-500'
                            : connectionStatus === 'error'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-blue-700">
                        {connectionStatus === 'connected' && 'Sistema funcionando normalmente'}
                        {connectionStatus === 'error' && 'Usando armazenamento local'}
                        {connectionStatus === 'checking' && 'Verificando conexão...'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-3">Funcionalidades do Editor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Criação de quizzes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Múltiplas perguntas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Salvamento automático</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Configurações avançadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Gerenciamento de quizzes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Interface responsiva</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Informações Importantes</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Os dados são salvos localmente no navegador</li>
                      <li>• Faça backup dos seus quizzes regularmente</li>
                      <li>• O editor funciona offline</li>
                      <li>• Compatível com todos os navegadores modernos</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      testConnection();
                      loadSavedQuizzes();
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Atualizar Sistema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
