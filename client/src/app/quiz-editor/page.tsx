
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Grid, List, Edit, Trash2 } from 'lucide-react';
import QuizDashboard from '@/components/quiz/QuizDashboard';
import BlockComponents from '@/components/editor/blocks/BlockComponents';
import { useQuiz, useQuizzes } from '@/hooks/useQuiz';
import { Quiz, Question } from '@/types/quiz';

const QuizEditorPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  // Use the correct hook for managing multiple quizzes
  const { quizzes, loading: quizzesLoading, createQuiz, deleteQuiz } = useQuizzes();
  
  // Use the quiz hook for individual quiz management
  const { 
    quiz, 
    questions, 
    loading: quizLoading, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion 
  } = useQuiz(selectedQuiz?.id);

  // Load quizzes on component mount
  useEffect(() => {
    // This would be replaced with actual user ID
    // loadQuizzes('user-id');
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const newQuiz = await createQuiz({
        title: 'Novo Quiz',
        description: 'Descrição do quiz',
        author_id: 'user-id', // This would be the actual user ID
        category: 'general'
      });
      setSelectedQuiz(newQuiz);
      setActiveTab('editor');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz) return;
    
    try {
      await addQuestion({
        title: 'Nova Pergunta',
        text: 'Digite sua pergunta aqui',
        type: 'multiple_choice',
        options: [
          { id: '1', text: 'Opção 1', isCorrect: false },
          { id: '2', text: 'Opção 2', isCorrect: false }
        ],
        required: true,
        tags: []
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
    try {
      await updateQuestion(questionId, updates);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz: Quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quiz Editor</h1>
          <p className="text-gray-600">Crie e gerencie seus quizzes</p>
        </div>
        <Button onClick={handleCreateQuiz} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Quiz
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setActiveTab('editor');
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteQuiz(quiz.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{quiz.category}</Badge>
                <span className="text-xs text-gray-500">
                  {quiz.questions?.length || 0} perguntas
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum quiz encontrado</p>
          <Button onClick={handleCreateQuiz} className="mt-4">
            Criar primeiro quiz
          </Button>
        </div>
      )}
    </div>
  );

  const renderEditor = () => {
    if (!selectedQuiz) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Selecione um quiz para editar</p>
          <Button onClick={() => setActiveTab('dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
            <p className="text-gray-600">Editando quiz</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
              Voltar
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{question.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BlockComponents 
                  content={{ 
                    type: 'quiz-question',
                    question: question.title,
                    options: question.options 
                  }}
                  onUpdate={(content) => handleUpdateQuestion(question.id, {
                    title: content.question,
                    options: content.options
                  })}
                />
              </CardContent>
            </Card>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Nenhuma pergunta adicionada</p>
              <Button onClick={handleAddQuestion} className="mt-4">
                Adicionar primeira pergunta
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBlocks = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Componentes de Quiz</h1>
        <p className="text-gray-600">Explore os componentes disponíveis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Block Example */}
        <Card>
          <CardHeader>
            <CardTitle>Cabeçalho</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockComponents 
              content={{ type: 'header', title: 'Título do Quiz' }}
            />
          </CardContent>
        </Card>

        {/* Text Block Example */}
        <Card>
          <CardHeader>
            <CardTitle>Texto</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockComponents 
              content={{ type: 'text', text: 'Este é um exemplo de bloco de texto.' }}
            />
          </CardContent>
        </Card>

        {/* Quiz Question Block Example */}
        <Card>
          <CardHeader>
            <CardTitle>Pergunta de Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockComponents 
              content={{ 
                type: 'quiz-question',
                question: 'Qual é sua cor favorita?',
                options: [
                  { id: '1', text: 'Azul', isCorrect: false },
                  { id: '2', text: 'Verde', isCorrect: false },
                  { id: '3', text: 'Vermelho', isCorrect: false }
                ]
              }}
            />
          </CardContent>
        </Card>

        {/* Button Block Example */}
        <Card>
          <CardHeader>
            <CardTitle>Botão</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockComponents 
              content={{ 
                type: 'button',
                buttonText: 'Clique aqui',
                buttonUrl: '#'
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (quizzesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="blocks">Componentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>
          
          <TabsContent value="editor" className="mt-6">
            {renderEditor()}
          </TabsContent>
          
          <TabsContent value="blocks" className="mt-6">
            {renderBlocks()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizEditorPage;
