
'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import QuestionEditor from '@/components/editor/QuestionEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Eye, Save, ArrowLeft } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.quiz) {
      setQuiz(state.quiz);
      setQuestions(state.quiz.questions || []);
    }
  }, [state.quiz]);

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    try {
      await createQuiz({
        title: 'Novo Quiz',
        description: 'Descrição do quiz',
        category: 'general'
      });
    } catch (error) {
      setError('Erro ao criar quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quiz) return;
    
    setIsLoading(true);
    try {
      await saveQuiz();
    } catch (error) {
      setError('Erro ao salvar quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuiz = (updates: Partial<Quiz>) => {
    if (!quiz) return;
    const updatedQuiz = { ...quiz, ...updates };
    setQuiz(updatedQuiz);
    updateQuiz(updates);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      title: 'Nova pergunta',
      text: 'Digite sua pergunta aqui',
      type: 'multiple_choice',
      options: [
        { text: 'Opção 1', isCorrect: false },
        { text: 'Opção 2', isCorrect: false }
      ],
      required: true,
      hint: '',
      tags: []
    };

    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
    addQuestion();
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    );
    updateQuestion(questionId, updates);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
    deleteQuestion(questionId);
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    selectQuestion(questionId);
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const renderQuestionList = () => (
    <div className="space-y-2">
      {questions.map((question: Question, index: number) => (
        <Card 
          key={question.id}
          className={`cursor-pointer transition-colors ${
            selectedQuestionId === question.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleSelectQuestion(question.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">Pergunta {index + 1}</h4>
                <p className="text-sm text-gray-600 truncate">{question.text}</p>
              </div>
              <Badge variant="secondary">{question.type}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderQuizSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título do Quiz</label>
        <Input
          value={quiz?.title || ''}
          onChange={(e) => handleUpdateQuiz({ title: e.target.value })}
          placeholder="Digite o título do quiz"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Descrição</label>
        <Input
          value={quiz?.description || ''}
          onChange={(e) => handleUpdateQuiz({ description: e.target.value })}
          placeholder="Digite a descrição do quiz"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Categoria</label>
        <Input
          value={quiz?.category || ''}
          onChange={(e) => handleUpdateQuiz({ category: e.target.value })}
          placeholder="Digite a categoria"
        />
      </div>
    </div>
  );

  if (!quiz) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Editor de Quiz</h1>
          <p className="text-gray-600 mb-6">Crie um novo quiz para começar</p>
          <Button onClick={handleCreateQuiz} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? 'Criando...' : 'Criar Novo Quiz'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={togglePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSaveQuiz} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">Perguntas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="blocks">Blocos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="p-4">
              <div className="space-y-4">
                <Button onClick={handleAddQuestion} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pergunta
                </Button>
                {renderQuestionList()}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="p-4">
              {renderQuizSettings()}
            </TabsContent>
            
            <TabsContent value="blocks" className="p-4">
              <div className="space-y-4">
                <Input
                  placeholder="Buscar blocos..."
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Conteúdo</h3>
                  {availableBlocks.filter((block: any) => block.category === 'content').map((block: any) => (
                    <Button
                      key={block.type}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddBlock(block.type)}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Layout</h3>
                  {availableBlocks.filter((block: any) => block.category === 'layout').map((block: any) => (
                    <Button
                      key={block.type}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddBlock(block.type)}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Quiz</h3>
                  {availableBlocks.filter((block: any) => block.category === 'quiz').map((block: any) => (
                    <Button
                      key={block.type}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddBlock(block.type)}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'questions' && selectedQuestion && (
            <QuestionEditor
              question={selectedQuestion}
              onUpdate={(updates) => handleUpdateQuestion(selectedQuestion.id, updates)}
              onDelete={() => handleDeleteQuestion(selectedQuestion.id)}
            />
          )}
          
          {activeTab === 'questions' && !selectedQuestion && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Selecione uma pergunta para editar</p>
                <Button onClick={handleAddQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Pergunta
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {renderQuizSettings()}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'blocks' && (
            <div className="text-center">
              <p className="text-gray-500">Selecione um bloco na barra lateral para adicionar ao quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
