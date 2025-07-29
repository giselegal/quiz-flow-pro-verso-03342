
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useEditor } from '@/contexts/EditorContext';
import QuestionEditor from '@/components/editor/QuestionEditor';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  required: boolean;
  hint?: string;
  title?: string;
  tags?: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  is_public: boolean | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export default function QuizEditorPage() {
  const {
    activeTab,
    blockSearch,
    availableBlocks,
    setActiveTab,
    setBlockSearch,
    handleAddBlock,
    state,
    loadQuiz,
    createQuiz,
    saveQuiz,
    togglePreview,
    toggleSidebar,
    setError,
    updateQuiz,
    selectQuestion,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useEditor();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    if (state.quiz) {
      setQuiz(state.quiz);
      setQuestions(state.quiz.questions.map(q => ({
        ...q,
        title: q.text,
        tags: []
      })));
    }
  }, [state.quiz]);

  const handleCreateQuiz = async () => {
    setLoading(true);
    try {
      const newQuiz = await createQuiz({
        title: 'Novo Quiz',
        description: '',
        author_id: 'user-1',
        category: 'general',
        difficulty: 'medium',
        time_limit: null,
        is_public: false,
        is_published: false
      });
      setQuiz(newQuiz);
    } catch (err) {
      setErrorState('Erro ao criar quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      await saveQuiz();
    } catch (err) {
      setErrorState('Erro ao salvar quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: 'Nova pergunta',
      type: 'multiple_choice',
      options: [
        { text: 'Opção 1', isCorrect: false },
        { text: 'Opção 2', isCorrect: false }
      ],
      required: true,
      hint: '',
      title: 'Nova pergunta',
      tags: []
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const handleQuestionTextChange = (questionId: string, text: string) => {
    handleUpdateQuestion(questionId, { text, title: text });
  };

  const handleQuestionTypeChange = (questionId: string, type: Question['type']) => {
    handleUpdateQuestion(questionId, { type });
  };

  const handleAddOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options, { text: `Opção ${question.options.length + 1}`, isCorrect: false }];
      handleUpdateQuestion(questionId, { options: newOptions });
    }
  };

  const handleUpdateOption = (questionId: string, optionIndex: number, text: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], text };
      handleUpdateQuestion(questionId, { options: newOptions });
    }
  };

  const handleToggleCorrectOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], isCorrect: !newOptions[optionIndex].isCorrect };
      handleUpdateQuestion(questionId, { options: newOptions });
    }
  };

  const handleRemoveOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      handleUpdateQuestion(questionId, { options: newOptions });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor de Quiz</h1>
          <p className="text-gray-600">Crie e edite quizzes interativos</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!quiz ? (
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateQuiz} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Quiz'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quiz-title">Título do Quiz</Label>
                    <Input
                      id="quiz-title"
                      value={quiz.title}
                      onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quiz-description">Descrição</Label>
                    <Textarea
                      id="quiz-description"
                      value={quiz.description || ''}
                      onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quiz-public"
                      checked={quiz.is_public || false}
                      onCheckedChange={(checked) => setQuiz({ ...quiz, is_public: checked })}
                    />
                    <Label htmlFor="quiz-public">Quiz Público</Label>
                  </div>
                  
                  <Button onClick={handleSaveQuiz} disabled={loading} className="w-full">
                    {loading ? 'Salvando...' : 'Salvar Quiz'}
                  </Button>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex space-x-2">
                    <Button
                      variant={activeTab === 'questions' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('questions')}
                    >
                      Perguntas
                    </Button>
                    <Button
                      variant={activeTab === 'blocks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('blocks')}
                    >
                      Blocos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === 'questions' ? (
                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div
                          key={question.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedQuestionId === question.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedQuestionId(question.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Pergunta {index + 1}</span>
                            <Badge variant="secondary">{question.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {question.text}
                          </p>
                        </div>
                      ))}
                      <Button onClick={handleAddQuestion} className="w-full">
                        Adicionar Pergunta
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Input
                          placeholder="Buscar blocos..."
                          value={blockSearch}
                          onChange={(e) => setBlockSearch(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Conteúdo</h3>
                        {availableBlocks.filter((block: any) => block.category === 'content').map((block: any) => (
                          <div
                            key={block.type}
                            className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="text-sm">{block.icon} {block.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Quiz</h3>
                        {availableBlocks.filter((block: any) => block.category === 'quiz').map((block: any) => (
                          <div
                            key={block.type}
                            className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="text-sm">{block.icon} {block.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Layout</h3>
                        {availableBlocks.filter((block: any) => block.category === 'layout').map((block: any) => (
                          <div
                            key={block.type}
                            className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => handleAddBlock(block.type)}
                          >
                            <span className="text-sm">{block.icon} {block.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      {availableBlocks.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          Nenhum bloco disponível
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedQuestion ? `Editando: ${selectedQuestion.text}` : 'Selecione uma pergunta'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedQuestion ? (
                    <QuestionEditor
                      question={selectedQuestion}
                      onUpdate={(updates) => handleUpdateQuestion(selectedQuestion.id, updates)}
                      onDelete={() => handleDeleteQuestion(selectedQuestion.id)}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Selecione uma pergunta na barra lateral para começar a editar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
