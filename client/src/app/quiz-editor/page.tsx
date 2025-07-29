
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuizzes } from '@/hooks/useQuiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blockComponents } from '@/components/editor/blocks/BlockComponents';
import { QuizDashboard } from '@/components/quiz/QuizDashboard';
import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Quiz, Question } from '@/types/quiz';
import { Plus, Save, Eye, Settings } from 'lucide-react';

const QuizEditorPage = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'multiple_choice' | 'text'>('multiple_choice');
  const [newOptions, setNewOptions] = useState(['', '']);

  const { quizzes, loading, error, createQuiz, loadQuizzes } = useQuizzes();

  useEffect(() => {
    loadQuizzes('user-1'); // Load quizzes for current user
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const newQuiz = await createQuiz({
        title: 'Novo Quiz',
        description: 'Descrição do quiz',
        category: 'general',
        author_id: 'user-1'
      });
      setSelectedQuiz(newQuiz);
      setActiveTab('editor');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab('editor');
  };

  const addNewQuestion = () => {
    if (!selectedQuiz || !newQuestionText.trim()) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      title: newQuestionText,
      text: newQuestionText,
      type: newQuestionType,
      options: newOptions.filter(opt => opt.trim()).map((opt, index) => ({
        id: `opt-${Date.now()}-${index}`,
        text: opt,
        isCorrect: index === 0 // First option is correct by default
      })),
      required: true,
      tags: []
    };

    const updatedQuiz = {
      ...selectedQuiz,
      questions: [...(selectedQuiz.questions || []), newQuestion]
    };

    setSelectedQuiz(updatedQuiz);
    setNewQuestionText('');
    setNewOptions(['', '']);
  };

  const generateBlockContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Texto de exemplo' };
      case 'header':
        return { title: 'Título de exemplo' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem' };
      case 'button':
        return { buttonText: 'Clique aqui', buttonUrl: '#' };
      case 'spacer':
        return {};
      default:
        return {};
    }
  };

  const renderBlockComponent = (type: string, content: any) => {
    const Component = blockComponents[type as keyof typeof blockComponents];
    if (!Component) {
      return <div>Componente não encontrado: {type}</div>;
    }
    return <Component content={content} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor de Quiz</h1>
          <p className="text-gray-600">Crie e gerencie seus quizzes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <QuizDashboard
              quizzes={quizzes}
              onQuizSelect={handleQuizSelect}
              onShowTemplates={() => setActiveTab('templates')}
            />
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            {selectedQuiz ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Configurações do Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-title">Título</Label>
                      <Input
                        id="quiz-title"
                        value={selectedQuiz.title}
                        onChange={(e) => setSelectedQuiz({
                          ...selectedQuiz,
                          title: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-description">Descrição</Label>
                      <Textarea
                        id="quiz-description"
                        value={selectedQuiz.description || ''}
                        onChange={(e) => setSelectedQuiz({
                          ...selectedQuiz,
                          description: e.target.value
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Adicionar Pergunta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question-text">Pergunta</Label>
                      <Input
                        id="question-text"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        placeholder="Digite sua pergunta..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="question-type">Tipo</Label>
                      <select
                        id="question-type"
                        value={newQuestionType}
                        onChange={(e) => setNewQuestionType(e.target.value as 'multiple_choice' | 'text')}
                        className="w-full p-2 border rounded"
                      >
                        <option value="multiple_choice">Múltipla Escolha</option>
                        <option value="text">Texto</option>
                      </select>
                    </div>
                    {newQuestionType === 'multiple_choice' && (
                      <div>
                        <Label>Opções</Label>
                        {newOptions.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...newOptions];
                              updatedOptions[index] = e.target.value;
                              setNewOptions(updatedOptions);
                            }}
                            placeholder={`Opção ${index + 1}`}
                            className="mt-2"
                          />
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setNewOptions([...newOptions, ''])}
                          className="mt-2"
                        >
                          Adicionar Opção
                        </Button>
                      </div>
                    )}
                    <Button onClick={addNewQuestion} className="w-full">
                      Adicionar Pergunta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-4">Selecione um quiz para editar</h3>
                <Button onClick={handleCreateQuiz}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Quiz
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            {selectedQuiz ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview do Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizPreview quiz={selectedQuiz} />
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Selecione um quiz para ver o preview</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Configurações em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizEditorPage;
