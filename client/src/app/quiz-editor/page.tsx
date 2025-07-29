
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BlockComponents } from '@/components/editor/blocks/BlockComponents';
import { useQuiz } from '@/hooks/useQuiz';
import { Question } from '@/types/quiz';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function QuizEditorPage() {
  const {
    quizzes,
    selectedQuiz,
    setSelectedQuiz,
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    loading,
    error
  } = useQuiz();

  const [activeTab, setActiveTab] = useState('questions');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestionForm, setNewQuestionForm] = useState<Partial<Question>>({
    title: '',
    text: '',
    type: 'multiple_choice',
    options: [],
    required: true,
    tags: []
  });

  // Create a new question
  const handleCreateQuestion = () => {
    if (!selectedQuiz) return;

    const questionData: Partial<Question> = {
      title: newQuestionForm.title || '',
      text: newQuestionForm.text || '',
      type: newQuestionForm.type || 'multiple_choice',
      options: newQuestionForm.options || [],
      required: newQuestionForm.required || true,
      tags: newQuestionForm.tags || []
    };

    addQuestion(selectedQuiz.id, questionData);
    setNewQuestionForm({
      title: '',
      text: '',
      type: 'multiple_choice',
      options: [],
      required: true,
      tags: []
    });
  };

  const handleUpdateQuestion = (content: any) => {
    if (!editingQuestion || !selectedQuiz) return;
    
    updateQuestion(selectedQuiz.id, editingQuestion.id, content);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedQuiz) return;
    deleteQuestion(selectedQuiz.id, questionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>Erro ao carregar o editor: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor de Quiz</h1>
          <p className="text-gray-600">Crie e edite perguntas para seu quiz</p>
        </div>

        {!selectedQuiz ? (
          <Card>
            <CardHeader>
              <CardTitle>Selecione um Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                      <Button 
                        onClick={() => setSelectedQuiz(quiz)}
                        className="w-full"
                      >
                        Editar Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedQuiz.title}</h2>
                <p className="text-gray-600">{selectedQuiz.description}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedQuiz(null)}
              >
                Voltar aos Quizzes
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
                <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nova Pergunta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Título</label>
                      <Input
                        value={newQuestionForm.title || ''}
                        onChange={(e) => setNewQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título da pergunta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Texto da Pergunta</label>
                      <Textarea
                        value={newQuestionForm.text || ''}
                        onChange={(e) => setNewQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Digite o texto da pergunta"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleCreateQuestion} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Pergunta
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Perguntas ({questions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        Nenhuma pergunta criada ainda. Adicione sua primeira pergunta acima.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={question.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">#{index + 1}</Badge>
                                <span className="font-medium">{question.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingQuestion(question)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{question.text}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{question.type}</Badge>
                              {question.required && <Badge variant="outline">Obrigatória</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pré-visualização do Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
                        <p className="text-gray-600">{selectedQuiz.description}</p>
                      </div>
                      
                      {questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge>{index + 1}</Badge>
                            <h3 className="font-semibold">{question.title}</h3>
                          </div>
                          <p className="mb-4">{question.text}</p>
                          
                          {question.type === 'multiple_choice' && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name={`question-${question.id}`} 
                                    disabled 
                                  />
                                  <span>{option.text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'text' && (
                            <Input disabled placeholder="Resposta de texto livre" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Configurações avançadas do quiz em desenvolvimento.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
