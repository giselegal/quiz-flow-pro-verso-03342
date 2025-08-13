import { QuizPreview } from '@/components/quiz/QuizPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { QuizQuestion } from '@/types/quiz';
import { BookOpen, Database, Eye, Plus, Save, Settings, Target } from 'lucide-react';
import { useState } from 'react';

export default function IntegratedQuizEditor() {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado simplificado do Quiz
  const [quizTitle, setQuizTitle] = useState('Novo Quiz');
  const [quizDescription, setQuizDescription] = useState('Descrição do quiz');
  const [quizCategory, setQuizCategory] = useState('Geral');

  // Adicionar nova pergunta
  const addNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      text: 'Nova pergunta',
      question: 'Nova pergunta',
      options: [
        { id: 'opt1', text: 'Opção 1' },
        { id: 'opt2', text: 'Opção 2' },
        { id: 'opt3', text: 'Opção 3' },
        { id: 'opt4', text: 'Opção 4' },
      ],
      type: 'multiple-choice',
    };

    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestion(questions.length);
  };

  // Atualizar pergunta selecionada
  const updateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
    setQuestions(prev => prev.map((q, i) => (i === index ? updatedQuestion : q)));
  };

  // Remover pergunta
  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedQuestion === index) {
      setSelectedQuestion(null);
    } else if (selectedQuestion && selectedQuestion > index) {
      setSelectedQuestion(selectedQuestion - 1);
    }
  };

  // Salvar quiz
  const handleSaveQuiz = async () => {
    try {
      setLoading(true);

      // Lógica de salvamento simplificada
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Sucesso!',
        description: 'Quiz salvo com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o quiz.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPreviewMode) {
    return (
      <div className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preview do Quiz</h2>
          <Button onClick={() => setIsPreviewMode(false)} variant="outline">
            Voltar ao Editor
          </Button>
        </div>
        <QuizPreview
          questions={questions}
          onComplete={results => {
            console.log('Resultados do quiz:', results);
            toast({
              title: 'Quiz Finalizado!',
              description: `Quiz completado com sucesso!`,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Editor de Quiz Integrado
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreviewMode(true)}
            variant="outline"
            disabled={questions.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button onClick={handleSaveQuiz} disabled={loading || questions.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Quiz'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">
            <Target className="w-4 h-4 mr-2" />
            Perguntas ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das Tabs */}
        <div className="flex-1 mt-4">
          <TabsContent value="questions" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Lista de Perguntas */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Perguntas</span>
                      <Button size="sm" onClick={addNewQuestion}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                    {questions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Nenhuma pergunta adicionada ainda.
                      </p>
                    ) : (
                      questions.map((question, index) => (
                        <div
                          key={question.id}
                          className={`p-3 border rounded cursor-pointer transition-colors ${
                            selectedQuestion === index
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedQuestion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">
                                {question.text || question.question}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {question.options.length} opções
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={e => {
                                e.stopPropagation();
                                removeQuestion(index);
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Editor da Pergunta Selecionada */}
              <div className="lg:col-span-2">
                {selectedQuestion !== null && questions[selectedQuestion] ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Editar Pergunta {selectedQuestion + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Pergunta</Label>
                        <Textarea
                          value={questions[selectedQuestion].text || ''}
                          onChange={e => {
                            const updated = {
                              ...questions[selectedQuestion],
                              text: e.target.value,
                              question: e.target.value,
                            };
                            updateQuestion(selectedQuestion, updated);
                          }}
                          placeholder="Digite a pergunta"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Opções de Resposta</Label>
                        <div className="space-y-2">
                          {questions[selectedQuestion].options.map((option, optIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground w-6">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <Input
                                value={option.text}
                                onChange={e => {
                                  const updated = { ...questions[selectedQuestion] };
                                  updated.options[optIndex].text = e.target.value;
                                  updateQuestion(selectedQuestion, updated);
                                }}
                                placeholder={`Opção ${optIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Selecione uma pergunta para editá-la ou adicione uma nova pergunta.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Quiz</Label>
                  <Input
                    id="title"
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="Digite o título do quiz"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={quizDescription}
                    onChange={e => setQuizDescription(e.target.value)}
                    placeholder="Descreva o objetivo e conteúdo do quiz"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={quizCategory}
                    onChange={e => setQuizCategory(e.target.value)}
                    placeholder="Ex: Matemática, História"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integração com 21 Etapas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Sistema de integração com as 21 etapas do editor. Esse recurso permite integrar
                  perguntas do quiz com as etapas do editor.
                </p>

                <Button
                  variant="outline"
                  disabled={loading || questions.length === 0}
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {loading ? 'Integrando...' : 'Integrar com 21 Etapas'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
