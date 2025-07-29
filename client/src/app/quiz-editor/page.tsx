
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/hooks/useQuiz';
import { useQuizzes } from '@/hooks/useQuizzes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockComponents } from '@/components/editor/blocks/BlockComponents';
import { EditorBlock } from '@/types/editor';
import { Question } from '@/types/quiz';
import { QuizDashboard } from '@/components/quiz/QuizDashboard';
import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Plus, Save, Eye, Settings, ArrowLeft } from 'lucide-react';

export default function QuizEditorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<EditorBlock | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: '',
    text: '',
    type: 'multiple_choice',
    options: [],
    required: true,
    tags: []
  });

  const {
    quiz,
    questions,
    loading,
    error,
    loadQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useQuiz();

  const { getUserQuizzes } = useQuizzes();

  useEffect(() => {
    // Load initial data or initialize new quiz
    const initializeEditor = async () => {
      try {
        await getUserQuizzes();
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };
    
    initializeEditor();
  }, [getUserQuizzes]);

  const handleAddQuestion = async () => {
    if (!newQuestion.title || !newQuestion.text) return;

    try {
      await addQuestion(newQuestion);
      setNewQuestion({
        title: '',
        text: '',
        type: 'multiple_choice',
        options: [],
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

  const handleSaveQuiz = async () => {
    if (!quiz) return;
    
    try {
      await updateQuiz({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category
      });
      alert('Quiz salvo com sucesso!');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Erro ao salvar quiz');
    }
  };

  const addBlock = (type: string) => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Texto padrão' };
      case 'header':
        return { title: 'Título' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem' };
      case 'button':
        return { buttonText: 'Botão', buttonUrl: '#' };
      case 'quiz-question':
        return { 
          question: 'Pergunta do quiz',
          options: [
            { id: '1', text: 'Opção 1', isCorrect: false },
            { id: '2', text: 'Opção 2', isCorrect: false }
          ]
        };
      default:
        return {};
    }
  };

  const handleQuizSelect = (selectedQuiz: any) => {
    if (selectedQuiz) {
      loadQuiz(selectedQuiz.id);
    }
  };

  const updateBlockContent = (blockId: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...content } }
        : block
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Erro: {error}</p>
          <Button onClick={() => router.push('/quiz')} className="mt-4">
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/quiz')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold">
                  {quiz ? `Editando: ${quiz.title}` : 'Novo Quiz'}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleSaveQuiz} disabled={!quiz}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="questions">Perguntas</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <QuizDashboard onQuizSelect={handleQuizSelect} />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova Pergunta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título da pergunta"
                    value={newQuestion.title || ''}
                    onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  />
                  <Input
                    placeholder="Texto da pergunta"
                    value={newQuestion.text || ''}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  />
                  <Button onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Pergunta
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma pergunta adicionada ainda.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{question.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{question.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline">{question.type}</Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Componentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addBlock('text')}
                    >
                      Texto
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addBlock('header')}
                    >
                      Cabeçalho
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addBlock('image')}
                    >
                      Imagem
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addBlock('button')}
                    >
                      Botão
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addBlock('quiz-question')}
                    >
                      Pergunta Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Visual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-96 border-2 border-dashed border-gray-200 rounded-lg p-4">
                      {blocks.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">Adicione componentes para começar</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {blocks.map((block) => (
                            <div
                              key={block.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedBlock?.id === block.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedBlock(block)}
                            >
                              <BlockComponents
                                block={block}
                                isSelected={selectedBlock?.id === block.id}
                                onUpdate={(content) => updateBlockContent(block.id, content)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Visualização do Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quiz ? (
                  <QuizPreview quiz={quiz} questions={questions} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Selecione ou crie um quiz para visualizar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
