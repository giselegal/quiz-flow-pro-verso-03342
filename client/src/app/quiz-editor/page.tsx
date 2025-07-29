
'use client';

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuiz } from '@/hooks/useQuiz';
import { useQuizzes } from '@/hooks/useQuiz';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockComponents } from '@/components/editor/blocks/BlockComponents';
import { QuizDashboard } from '@/components/quiz/QuizDashboard';
import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Plus, Save, Eye, Settings } from 'lucide-react';
import { Quiz, Question } from '@/types/quiz';

export default function QuizEditorPage() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    quiz,
    questions,
    loading,
    error,
    loadQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    saveQuiz
  } = useQuiz();

  const { quizzes, loading: quizzesLoading, createQuiz } = useQuizzes();

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Handle quiz selection
  const handleQuizSelect = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    await loadQuiz(quiz.id);
  };

  // Handle adding new question
  const handleAddQuestion = async () => {
    if (!quiz) return;
    
    try {
      await addQuestion({
        title: 'Nova Pergunta',
        text: 'Digite sua pergunta aqui',
        type: 'multiple_choice',
        options: []
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Handle updating question
  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
    try {
      await updateQuestion(questionId, updates);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  // Handle saving quiz
  const handleSave = async () => {
    if (!quiz) return;
    
    try {
      await saveQuiz();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Editor de Quiz</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="questions">Perguntas</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <QuizDashboard 
              quizzes={quizzes}
              onQuizSelect={handleQuizSelect}
            />
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Perguntas do Quiz</h2>
                <Button onClick={handleAddQuestion} disabled={!quiz}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Pergunta
                </Button>
              </div>

              {error && (
                <Card className="p-4 border-red-200 bg-red-50">
                  <p className="text-red-600">{error}</p>
                </Card>
              )}

              {!quiz && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">Selecione um quiz para começar a editar</p>
                </Card>
              )}

              {quiz && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Informações do Quiz</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Título</Label>
                        <Input 
                          value={quiz.title} 
                          onChange={(e) => updateQuiz({ title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea 
                          value={quiz.description} 
                          onChange={(e) => updateQuiz({ description: e.target.value })}
                        />
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">Pergunta {index + 1}</Badge>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label>Título da Pergunta</Label>
                            <Input 
                              value={question.title}
                              onChange={(e) => handleUpdateQuestion(question.id, { title: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <Label>Texto da Pergunta</Label>
                            <Textarea 
                              value={question.text}
                              onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-1">
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Componentes</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      📝 Texto
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🖼️ Imagem
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🔘 Botão
                    </Button>
                  </div>
                </Card>
              </div>
              
              <div className="col-span-2">
                <Card className="p-6 min-h-[400px]">
                  <h3 className="font-medium mb-4">Editor Visual</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Arraste componentes aqui para personalizar seu quiz</p>
                  </div>
                </Card>
              </div>
              
              <div className="col-span-1">
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Propriedades</h3>
                  <p className="text-gray-500 text-sm">Selecione um componente para editar suas propriedades</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Preview do Quiz</h3>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Tela Cheia
                    </Button>
                  </div>
                  
                  {quiz ? (
                    <QuizPreview quiz={quiz} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Selecione um quiz para visualizar o preview
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
