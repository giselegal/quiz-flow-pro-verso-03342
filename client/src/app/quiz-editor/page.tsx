
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Settings, Eye, Save, ArrowLeft } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { Quiz, Question } from '@/types/quiz';
import { QuizService } from '@/services/QuizService';

export default function QuizEditorPage() {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    state,
    loadQuiz,
    createQuiz,
    saveQuiz,
    actions
  } = useEditor();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  // Load quiz data on component mount
  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      try {
        const quizzes = await QuizService.getQuizzes();
        if (quizzes.length > 0) {
          const firstQuiz = quizzes[0];
          setQuiz(firstQuiz);
          setQuestions(firstQuiz.questions || []);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

  const handleSave = async () => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      await QuizService.updateQuiz(quiz.id, {
        ...quiz,
        questions
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      title: 'Nova pergunta',
      text: 'Digite sua pergunta aqui',
      type: 'multiple_choice',
      options: [
        { id: '1', text: 'Opção 1', isCorrect: false },
        { id: '2', text: 'Opção 2', isCorrect: false }
      ],
      required: true,
      tags: []
    };

    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {quiz?.title || 'Editor de Quiz'}
              </h1>
              <p className="text-sm text-gray-500">
                {questions.length} pergunta(s)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} disabled={loading} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Perguntas</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Perguntas do Quiz</h2>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Pergunta
                  </Button>
                </div>

                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">
                              Pergunta {index + 1}
                            </Badge>
                            <Badge variant="outline">
                              {question.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Escolha Única'}
                            </Badge>
                          </div>
                          <Input
                            value={question.text}
                            onChange={(e) =>
                              updateQuestion(question.id, { text: e.target.value })
                            }
                            placeholder="Digite sua pergunta"
                            className="mb-3"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                          className="ml-2"
                        >
                          ×
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <input
                              type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = {
                                  ...option,
                                  isCorrect: e.target.checked
                                };
                                updateQuestion(question.id, { options: newOptions });
                              }}
                            />
                            <Input
                              value={option.text}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = {
                                  ...option,
                                  text: e.target.value
                                };
                                updateQuestion(question.id, { options: newOptions });
                              }}
                              placeholder={`Opção ${optionIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}

                  {questions.length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500 mb-4">
                        Nenhuma pergunta criada ainda
                      </p>
                      <Button onClick={addQuestion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar primeira pergunta
                      </Button>
                    </Card>
                  )}
                </div>
              </div>

              {/* Question Properties */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Propriedades da Pergunta</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Tipo</label>
                      <select className="w-full mt-1 p-2 border rounded">
                        <option value="multiple_choice">Múltipla Escolha</option>
                        <option value="single_choice">Escolha Única</option>
                        <option value="text">Texto Livre</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Obrigatória</label>
                      <input type="checkbox" className="ml-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3">Configurações do Quiz</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Título</label>
                      <Input
                        value={quiz?.title || ''}
                        onChange={(e) => setQuiz(prev => prev ? { ...prev, title: e.target.value } : null)}
                        placeholder="Título do quiz"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea
                        value={quiz?.description || ''}
                        onChange={(e) => setQuiz(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Descrição do quiz"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-6">
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Design do Quiz</h3>
              <p className="text-gray-500">
                Personalize a aparência do seu quiz
              </p>
            </Card>
          </TabsContent>

          <TabsContent className="mt-6">
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Configurações</h3>
              <p className="text-gray-500">
                Configure as opções avançadas do quiz
              </p>
            </Card>
          </TabsContent>

          <TabsContent className="mt-6">
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <p className="text-gray-500">
                Veja como seu quiz será exibido
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
