
'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { QuizService } from '@/services/QuizService';
import { Quiz, Question } from '@/types/quiz';

const QuizEditorPage = () => {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    availableBlocks,
    handleAddBlock,
    blockSearch,
    setBlockSearch,
    actions
  } = useEditor();

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuiz = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await QuizService.getQuizById(id);
      if (quiz) {
        // Transform the quiz to match our Quiz type
        const transformedQuiz: Quiz = {
          ...quiz,
          is_template: quiz.is_template || false,
          thumbnail_url: quiz.thumbnail_url || null,
          tags: quiz.tags || [],
          view_count: quiz.view_count || 0,
          average_score: quiz.average_score || 0,
        };
        setCurrentQuiz(transformedQuiz);
        
        // Transform questions to match our Question type
        const transformedQuestions: Question[] = quiz.questions.map(q => ({
          ...q,
          title: q.title || q.text,
          tags: q.tags || [],
          options: q.options.map(opt => ({
            ...opt,
            id: opt.id || Date.now().toString()
          }))
        }));
        setQuestions(transformedQuestions);
      }
    } catch (err) {
      setError('Erro ao carregar quiz');
      console.error('Error loading quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async () => {
    setLoading(true);
    try {
      const newQuiz = await QuizService.createQuiz({
        title: 'Novo Quiz',
        description: 'Descrição do quiz',
        category: 'general',
        is_public: false,
        is_published: false,
        is_template: false,
        thumbnail_url: null,
        tags: [],
        view_count: 0,
        average_score: 0,
        questions: []
      });
      setCurrentQuiz(newQuiz);
      setQuestions([]);
    } catch (err) {
      setError('Erro ao criar quiz');
    } finally {
      setLoading(false);
    }
  };

  const saveQuiz = async () => {
    if (!currentQuiz) return;
    
    setLoading(true);
    try {
      const updatedQuiz = await QuizService.updateQuiz(currentQuiz.id, {
        ...currentQuiz,
        questions
      });
      setCurrentQuiz(updatedQuiz);
    } catch (err) {
      setError('Erro ao salvar quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = (updates: Partial<Quiz>) => {
    if (currentQuiz) {
      setCurrentQuiz({ ...currentQuiz, ...updates });
    }
  };

  const selectQuestion = (questionId: string) => {
    setSelectedBlockId(questionId);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: 'Nova Pergunta',
      text: 'Digite sua pergunta aqui',
      type: 'multiple_choice',
      options: [
        { id: Date.now().toString(), text: 'Opção 1', isCorrect: false },
        { id: (Date.now() + 1).toString(), text: 'Opção 2', isCorrect: true }
      ],
      required: true,
      tags: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const filteredBlocks = availableBlocks.filter(block =>
    block.name.toLowerCase().includes(blockSearch.toLowerCase()) ||
    block.category.toLowerCase().includes(blockSearch.toLowerCase())
  );

  const blocksByCategory = {
    content: filteredBlocks.filter(block => block.category === 'content'),
    layout: filteredBlocks.filter(block => block.category === 'layout'),
    quiz: filteredBlocks.filter(block => block.category === 'quiz'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Editor</h1>
            <p className="text-sm text-gray-500">
              {currentQuiz ? `Editando: ${currentQuiz.title}` : 'Nenhum quiz selecionado'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={createQuiz}>
              Novo Quiz
            </Button>
            <Button onClick={saveQuiz} disabled={!currentQuiz}>
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-6 mt-4">
          {error}
        </div>
      )}

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Tabs defaultValue="components" className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="questions">Perguntas</TabsTrigger>
              <TabsTrigger value="settings">Config</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="mb-4">
                  <Input
                    placeholder="Buscar componentes..."
                    value={blockSearch}
                    onChange={(e) => setBlockSearch(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-2">Conteúdo</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {blocksByCategory.content.map((block) => (
                        <Button
                          key={block.type}
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center text-xs"
                          onClick={() => handleAddBlock(block.type)}
                        >
                          <span className="text-lg mb-1">{block.icon}</span>
                          <span>{block.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-2">Layout</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {blocksByCategory.layout.map((block) => (
                        <Button
                          key={block.type}
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center text-xs"
                          onClick={() => handleAddBlock(block.type)}
                        >
                          <span className="text-lg mb-1">{block.icon}</span>
                          <span>{block.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-2">Quiz</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {blocksByCategory.quiz.map((block) => (
                        <Button
                          key={block.type}
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center text-xs"
                          onClick={() => handleAddBlock(block.type)}
                        >
                          <span className="text-lg mb-1">{block.icon}</span>
                          <span>{block.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Perguntas</h3>
                  <Button size="sm" onClick={addQuestion}>
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <Card 
                      key={question.id} 
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedBlockId === question.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectQuestion(question.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{question.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{question.text}</p>
                        </div>
                        <Badge variant="secondary">{question.type}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-y-auto">
              <div className="p-4">
                {currentQuiz && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                      </label>
                      <Input
                        value={currentQuiz.title}
                        onChange={(e) => updateQuiz({ title: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <Input
                        value={currentQuiz.description || ''}
                        onChange={(e) => updateQuiz({ description: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <Input
                        value={currentQuiz.category}
                        onChange={(e) => updateQuiz({ category: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          <div className="h-full overflow-y-auto p-6">
            {currentQuiz ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm min-h-96 p-6">
                  <h2 className="text-xl font-bold mb-6">{currentQuiz.title}</h2>
                  
                  {questions.length > 0 ? (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-medium">{index + 1}. {question.title}</h3>
                            <Badge variant="outline">{question.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{question.text}</p>
                          
                          {question.options.length > 0 && (
                            <div className="space-y-2">
                              {question.options.map((option) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name={`question-${question.id}`}
                                    disabled 
                                  />
                                  <span className="text-sm">{option.text}</span>
                                  {option.isCorrect && (
                                    <Badge variant="secondary" className="ml-2">
                                      Correta
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Nenhuma pergunta adicionada ainda</p>
                      <Button onClick={addQuestion}>
                        Adicionar Primeira Pergunta
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Nenhum quiz selecionado</p>
                  <Button onClick={createQuiz}>
                    Criar Novo Quiz
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditorPage;
