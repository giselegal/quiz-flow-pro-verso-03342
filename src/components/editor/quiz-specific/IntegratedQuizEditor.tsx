import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useEditor } from '@/context/EditorContext';
import { QuizQuestion } from '@/types/quiz';
import { BookOpen, Edit, Eye, Plus, Save, Settings, Target, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import QuestionEditor from '../../quiz-editor/QuestionEditor';

interface IntegratedQuizEditorProps {
  onSave?: () => void;
  onPreview?: () => void;
  className?: string;
}

interface QuizMetadata {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  isPublic: boolean;
  settings: {
    showProgress: boolean;
    randomizeQuestions: boolean;
    allowRetake: boolean;
    passScore: number;
  };
}

/**
 * 🎯 EDITOR DE QUIZ INTEGRADO
 *
 * Editor completo de quiz integrado ao sistema /editor-fixed:
 * - Criação e edição de perguntas
 * - Múltiplos tipos de pergunta
 * - Configurações de quiz
 * - Preview em tempo real
 * - Integração com Supabase
 * - Interface responsiva
 */
const IntegratedQuizEditor: React.FC<IntegratedQuizEditorProps> = ({
  onSave,
  onPreview,
  className = '',
}) => {
  // Estado do Quiz
  const [quizMetadata, setQuizMetadata] = useState<QuizMetadata>({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium',
    timeLimit: undefined,
    isPublic: false,
    settings: {
      showProgress: true,
      randomizeQuestions: false,
      allowRetake: true,
      passScore: 70,
    },
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Editor Context para integração
  const {
    blockActions: { addBlock },
  } = useEditor();

  // ===== HANDLERS =====
  const handleSaveQuiz = async () => {
    if (!quizMetadata.title.trim()) {
      toast({
        title: 'Erro',
        description: 'Título do quiz é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos uma pergunta',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular salvamento (aqui integraria com Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Adicionar quiz como bloco no editor-fixed (simulado)
      addBlock('quiz-complete', undefined);

      toast({
        title: 'Sucesso',
        description: `Quiz "${quizMetadata.title}" salvo com sucesso!`,
      });

      onSave?.();
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar quiz',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setIsCreatingNew(true);
    setEditingQuestion(null);
    setActiveTab('questions');
  };

  const handleSaveQuestion = (question: QuizQuestion) => {
    if (isCreatingNew) {
      const newQuestion: QuizQuestion = {
        ...question,
        id: `question-${Date.now()}`,
        order: questions.length,
      };
      setQuestions(prev => [...prev, newQuestion]);
    } else {
      setQuestions(prev => prev.map(q => (q.id === question.id ? question : q)));
    }

    setEditingQuestion(null);
    setIsCreatingNew(false);
    setActiveTab('questions');
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsCreatingNew(false);
    setActiveTab('question-editor');
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (editingQuestion?.id === questionId) {
        setEditingQuestion(null);
        setActiveTab('questions');
      }
    }
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsCreatingNew(false);
    setActiveTab('questions');
  };

  const handleDeleteCurrent = () => {
    if (editingQuestion) {
      handleDeleteQuestion(editingQuestion.id);
    }
  };

  const handlePreview = () => {
    if (questions.length === 0) {
      toast({
        title: 'Aviso',
        description: 'Adicione perguntas para visualizar o preview',
        variant: 'default',
      });
      return;
    }
    onPreview?.();
  };

  // ===== RENDER CONDICIONAL PARA EDITOR DE PERGUNTA =====
  if (editingQuestion || isCreatingNew) {
    return (
      <div className={`integrated-quiz-editor ${className}`}>
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[#432818]">
                <Edit className="w-5 h-5" />
                {isCreatingNew ? 'Nova Pergunta' : 'Editando Pergunta'}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="border-[#B89B7A] text-[#432818]"
              >
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <QuestionEditor
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={handleCancel}
              onDelete={editingQuestion ? handleDeleteCurrent : undefined}
              isNew={isCreatingNew}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== INTERFACE PRINCIPAL =====
  return (
    <div className={`integrated-quiz-editor ${className}`}>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#432818]">
              <Target className="w-6 h-6" />
              Editor de Quiz Integrado
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="border-[#B89B7A] text-[#432818]"
                disabled={questions.length === 0}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSaveQuiz}
                className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Quiz'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="px-6 border-b border-[#B89B7A]/20">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Perguntas ({questions.length})
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* TAB: VISÃO GERAL */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="quiz-title" className="text-sm font-medium text-[#432818]">
                      Título do Quiz *
                    </Label>
                    <Input
                      id="quiz-title"
                      placeholder="Ex: Descubra seu estilo de aprendizado"
                      value={quizMetadata.title}
                      onChange={e => setQuizMetadata(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="quiz-description"
                      className="text-sm font-medium text-[#432818]"
                    >
                      Descrição
                    </Label>
                    <Textarea
                      id="quiz-description"
                      placeholder="Descreva o objetivo e conteúdo do seu quiz..."
                      value={quizMetadata.description}
                      onChange={e =>
                        setQuizMetadata(prev => ({ ...prev, description: e.target.value }))
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[#432818]">Categoria</Label>
                      <select
                        value={quizMetadata.category}
                        onChange={e =>
                          setQuizMetadata(prev => ({ ...prev, category: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                      >
                        <option value="general">Geral</option>
                        <option value="education">Educação</option>
                        <option value="business">Negócios</option>
                        <option value="lifestyle">Estilo de Vida</option>
                        <option value="personality">Personalidade</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-[#432818]">Dificuldade</Label>
                      <select
                        value={quizMetadata.difficulty}
                        onChange={e =>
                          setQuizMetadata(prev => ({ ...prev, difficulty: e.target.value as any }))
                        }
                        className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                      >
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ESTATÍSTICAS DO QUIZ */}
                <Card className="bg-[#FAF9F7] border-[#B89B7A]/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-[#432818] mb-3">Estatísticas do Quiz</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#B89B7A]">{questions.length}</div>
                        <div className="text-[#8F7A6A]">Perguntas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#B89B7A]">
                          {questions.reduce((acc, q) => acc + (q.options?.length || 0), 0)}
                        </div>
                        <div className="text-[#8F7A6A]">Total Opções</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#B89B7A]">
                          ~{Math.max(1, Math.ceil(questions.length * 1.5))}min
                        </div>
                        <div className="text-[#8F7A6A]">Tempo Est.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: PERGUNTAS */}
              <TabsContent value="questions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#432818]">
                    Perguntas do Quiz ({questions.length})
                  </h3>
                  <Button
                    onClick={handleAddQuestion}
                    className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Pergunta
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <Card className="p-8 text-center border-dashed border-2 border-[#B89B7A]/30">
                    <div className="text-6xl mb-4">❓</div>
                    <h4 className="text-lg font-medium text-[#432818] mb-2">
                      Nenhuma pergunta adicionada
                    </h4>
                    <p className="text-[#8F7A6A] mb-4">
                      Comece criando sua primeira pergunta para o quiz
                    </p>
                    <Button
                      onClick={handleAddQuestion}
                      variant="outline"
                      className="border-[#B89B7A] text-[#432818]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeira Pergunta
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Pergunta {index + 1}
                                </Badge>
                                <Badge
                                  variant={question.type === 'normal' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {question.type === 'normal' ? 'Múltipla Escolha' : question.type}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-[#432818] mb-2">
                                {question.title || question.question || question.text}
                              </h4>
                              <p className="text-sm text-[#8F7A6A]">
                                {question.options?.length || 0} opções •{question.multiSelect}{' '}
                                seleções permitidas
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                                className="border-[#B89B7A] text-[#432818]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TAB: CONFIGURAÇÕES */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium text-[#432818] mb-4">Configurações de Exibição</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Mostrar Progresso</Label>
                          <p className="text-xs text-[#8F7A6A]">
                            Exibir barra de progresso durante o quiz
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={quizMetadata.settings.showProgress}
                          onChange={e =>
                            setQuizMetadata(prev => ({
                              ...prev,
                              settings: { ...prev.settings, showProgress: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Randomizar Perguntas</Label>
                          <p className="text-xs text-[#8F7A6A]">Embaralhar ordem das perguntas</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={quizMetadata.settings.randomizeQuestions}
                          onChange={e =>
                            setQuizMetadata(prev => ({
                              ...prev,
                              settings: { ...prev.settings, randomizeQuestions: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium text-[#432818] mb-4">Configurações de Acesso</h4>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Pontuação Mínima (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={quizMetadata.settings.passScore}
                          onChange={e =>
                            setQuizMetadata(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                passScore: parseInt(e.target.value) || 0,
                              },
                            }))
                          }
                          className="mt-1 w-24"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Permitir Repetir</Label>
                          <p className="text-xs text-[#8F7A6A]">Usuário pode refazer o quiz</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={quizMetadata.settings.allowRetake}
                          onChange={e =>
                            setQuizMetadata(prev => ({
                              ...prev,
                              settings: { ...prev.settings, allowRetake: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedQuizEditor;
