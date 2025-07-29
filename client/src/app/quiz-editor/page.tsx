
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Eye, Settings, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/contexts/EditorContext';
import QuestionEditor from '@/components/editor/QuestionEditor';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  required: boolean;
  hint?: string;
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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (state.quiz) {
      setQuestions(state.quiz.questions);
    }
  }, [state.quiz]);

  const handleCreateNewQuiz = async () => {
    await createQuiz({
      title: 'Novo Quiz',
      description: 'Descrição do quiz',
      category: 'general',
      difficulty: 'medium'
    });
  };

  const handleSaveQuiz = async () => {
    await saveQuiz();
  };

  const handleUpdateQuiz = (field: string, value: any) => {
    updateQuiz({ [field]: value });
  };

  const handleAddQuestion = () => {
    addQuestion();
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    updateQuestion(questionId, updates);
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(questionId);
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    selectQuestion(questionId);
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{state.error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {state.quiz?.title || 'Editor de Quiz'}
              </h1>
              <Badge variant="secondary">
                {state.quiz?.is_published ? 'Publicado' : 'Rascunho'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={togglePreview}>
                <Eye className="w-4 h-4 mr-2" />
                {state.isPreview ? 'Editar' : 'Visualizar'}
              </Button>
              <Button onClick={handleSaveQuiz}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quiz-title">Título do Quiz</Label>
                  <Input
                    id="quiz-title"
                    value={state.quiz?.title || ''}
                    onChange={(e) => handleUpdateQuiz('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quiz-description">Descrição</Label>
                  <Textarea
                    id="quiz-description"
                    value={state.quiz?.description || ''}
                    onChange={(e) => handleUpdateQuiz('description', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quiz-category">Categoria</Label>
                  <Select
                    value={state.quiz?.category || 'general'}
                    onValueChange={(value) => handleUpdateQuiz('category', value)}
                  >
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="entertainment">Entretenimento</SelectItem>
                    <SelectItem value="business">Negócios</SelectItem>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quiz-difficulty">Dificuldade</Label>
                  <Select
                    value={state.quiz?.difficulty || 'medium'}
                    onValueChange={(value) => handleUpdateQuiz('difficulty', value)}
                  >
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quiz-public"
                    checked={state.quiz?.is_public || false}
                    onCheckedChange={(checked) => handleUpdateQuiz('is_public', checked)}
                  />
                  <Label htmlFor="quiz-public">Quiz Público</Label>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Perguntas</CardTitle>
                  <Button size="sm" onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {questions.map((question: Question, index: number) => (
                    <div
                      key={question.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedQuestionId === question.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectQuestion(question.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            Pergunta {index + 1}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {question.text || 'Pergunta sem título'}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(question.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma pergunta adicionada</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={handleAddQuestion}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Primeira Pergunta
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {selectedQuestion ? 'Editar Pergunta' : 'Selecione uma pergunta'}
                  </CardTitle>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1">
                    <Button
                      variant={activeTab === 'editor' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('editor')}
                    >
                      Editor
                    </Button>
                    <Button
                      variant={activeTab === 'blocks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('blocks')}
                    >
                      Blocos
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === 'editor' && (
                  <div>
                    {selectedQuestion ? (
                      <QuestionEditor
                        question={selectedQuestion}
                        onUpdate={(question: Question) => handleUpdateQuestion(question.id, question)}
                        onDelete={() => handleDeleteQuestion(selectedQuestion.id)}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                          Selecione uma pergunta para editar ou crie uma nova
                        </div>
                        <Button onClick={handleAddQuestion}>
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Nova Pergunta
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'blocks' && (
                  <div>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar blocos..."
                          value={blockSearch}
                          onChange={(e) => setBlockSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Conteúdo</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableBlocks.filter((block: any) => block.category === 'content').map((block: any) => (
                            <Button
                              key={block.type}
                              variant="outline"
                              className="h-auto p-3 flex flex-col items-center"
                              onClick={() => handleAddBlock(block.type)}
                            >
                              <span className="text-lg mb-1">{block.icon}</span>
                              <span className="text-xs">{block.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Layout</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableBlocks.filter((block: any) => block.category === 'layout').map((block: any) => (
                            <Button
                              key={block.type}
                              variant="outline"
                              className="h-auto p-3 flex flex-col items-center"
                              onClick={() => handleAddBlock(block.type)}
                            >
                              <span className="text-lg mb-1">{block.icon}</span>
                              <span className="text-xs">{block.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Quiz</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableBlocks.filter((block: any) => block.category === 'quiz').map((block: any) => (
                            <Button
                              key={block.type}
                              variant="outline"
                              className="h-auto p-3 flex flex-col items-center"
                              onClick={() => handleAddBlock(block.type)}
                            >
                              <span className="text-lg mb-1">{block.icon}</span>
                              <span className="text-xs">{block.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Blocos Disponíveis</h4>
                      <div className="text-sm text-gray-600">
                        Total: {availableBlocks.length} blocos
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              {state.quiz && (
                <span>
                  Perguntas: {questions.length} | 
                  Status: {state.quiz.is_published ? 'Publicado' : 'Rascunho'}
                </span>
              )}
            </div>
            <div>
              Última modificação: {state.quiz?.updated_at ? new Date(state.quiz.updated_at).toLocaleDateString() : 'Nunca'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
