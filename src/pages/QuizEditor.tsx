import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Eye, FileText, GripVertical, Plus, Save, Settings, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'multiple_answer' | 'true_false' | 'text';
  options: string[];
  correct_answers: string[];
  points: number;
  explanation?: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  is_public: boolean;
  questions: QuizQuestion[];
}

const QuizEditor: React.FC = () => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz>({
    id: '',
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium',
    time_limit: undefined,
    is_public: false,
    questions: [],
  });

  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Carregar quiz existente se houver ID na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    if (quizId) {
      loadQuiz(quizId);
    }
  }, []);

  const loadQuiz = async (quizId: string) => {
    try {
      setLoading(true);

      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsError) throw questionsError;

      setQuiz({
        ...quizData,
        questions: questionsData || [],
      });
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuiz = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const quizData = {
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        time_limit: quiz.time_limit,
        is_public: quiz.is_public,
        author_id: user.id,
      };

      let quizId = quiz.id;

      if (quizId) {
        // Atualizar quiz existente
        const { error } = await supabase.from('quizzes').update(quizData).eq('id', quizId);

        if (error) throw error;
      } else {
        // Criar novo quiz
        const { data, error } = await supabase.from('quizzes').insert([quizData]).select().single();

        if (error) throw error;
        quizId = data.id;
        setQuiz(prev => ({ ...prev, id: quizId }));
      }

      // Salvar perguntas
      for (const question of quiz.questions) {
        const questionData = {
          quiz_id: quizId,
          question_text: question.question_text,
          question_type: question.question_type,
          options: question.options,
          correct_answers: question.correct_answers,
          points: question.points,
          explanation: question.explanation,
          order_index: question.order_index,
        };

        if (question.id && question.id !== 'new') {
          await supabase.from('questions').update(questionData).eq('id', question.id);
        } else {
          await supabase.from('questions').insert([questionData]);
        }
      }

      alert('Quiz salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      alert('Erro ao salvar quiz. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: 'new',
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answers: [''],
      points: 1,
      order_index: quiz.questions.length,
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setEditingQuestion(newQuestion);
  };

  const updateQuestion = (updatedQuestion: QuizQuestion) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.order_index === updatedQuestion.order_index ? updatedQuestion : q
      ),
    }));
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Editor */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Editor de Quiz</h1>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Button>

            <Button
              onClick={saveQuiz}
              disabled={loading || !quiz.title}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Quiz</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Configurações do Quiz */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações do Quiz
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Quiz</Label>
                  <Input
                    id="title"
                    value={quiz.title}
                    onChange={e => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do quiz"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={quiz.description}
                    onChange={e => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva seu quiz"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={quiz.category}
                    onValueChange={value => setQuiz(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Geral</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="entertainment">Entretenimento</SelectItem>
                      <SelectItem value="business">Negócios</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={quiz.difficulty}
                    onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                      setQuiz(prev => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeLimit">Tempo Limite (minutos)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={quiz.time_limit || ''}
                    onChange={e =>
                      setQuiz(prev => ({
                        ...prev,
                        time_limit: e.target.value ? parseInt(e.target.value) * 60 : undefined,
                      }))
                    }
                    placeholder="Opcional"
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={quiz.is_public}
                    onChange={e => setQuiz(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Quiz público</Label>
                </div>
              </div>
            </div>

            {/* Estatísticas do Quiz */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Estatísticas
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Perguntas:</span>
                  <span>{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pontos totais:</span>
                  <span>{quiz.questions.reduce((sum, q) => sum + q.points, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo estimado:</span>
                  <span>{Math.ceil(quiz.questions.length * 1.5)} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Área Principal - Lista de Perguntas */}
        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Perguntas do Quiz</h2>
            <Button onClick={addQuestion} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Adicionar Pergunta</span>
            </Button>
          </div>

          <div className="space-y-4">
            {quiz.questions.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma pergunta adicionada
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece adicionando sua primeira pergunta ao quiz
                </p>
                <Button onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Pergunta
                </Button>
              </Card>
            ) : (
              quiz.questions.map((question, index) => (
                <QuestionCard
                  key={question.order_index}
                  question={question}
                  index={index}
                  onEdit={() => setEditingQuestion(question)}
                  onDelete={() => deleteQuestion(index)}
                  onUpdate={updateQuestion}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição de Pergunta */}
      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          onSave={updatedQuestion => {
            updateQuestion(updatedQuestion);
            setEditingQuestion(null);
          }}
          onCancel={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
};

// Componente para Card de Pergunta
const QuestionCard: React.FC<{
  question: QuizQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (question: QuizQuestion) => void;
}> = ({ question, index, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <div>
            <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
            <p className="text-sm text-gray-500 capitalize">
              {question.question_type.replace('_', ' ')} • {question.points} ponto
              {question.points !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>Editar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-900 mb-3">{question.question_text || 'Pergunta sem título'}</p>

        {question.question_type !== 'text' && (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-2 rounded-md border ${
                  question.correct_answers.includes(optionIndex.toString())
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="text-sm">
                  {String.fromCharCode(65 + optionIndex)}. {option || 'Opção vazia'}
                </span>
                {question.correct_answers.includes(optionIndex.toString()) && (
                  <span className="text-xs text-green-600 ml-2">(Correta)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente Modal para Edição de Pergunta
const QuestionEditor: React.FC<{
  question: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion>({ ...question });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectAnswerToggle = (index: number) => {
    const indexStr = index.toString();
    let newCorrectAnswers;

    if (editedQuestion.question_type === 'multiple_choice') {
      newCorrectAnswers = [indexStr];
    } else {
      newCorrectAnswers = editedQuestion.correct_answers.includes(indexStr)
        ? editedQuestion.correct_answers.filter(a => a !== indexStr)
        : [...editedQuestion.correct_answers, indexStr];
    }

    setEditedQuestion(prev => ({ ...prev, correct_answers: newCorrectAnswers }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Editar Pergunta</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="questionText">Texto da Pergunta</Label>
            <Textarea
              id="questionText"
              value={editedQuestion.question_text}
              onChange={e =>
                setEditedQuestion(prev => ({
                  ...prev,
                  question_text: e.target.value,
                }))
              }
              placeholder="Digite sua pergunta aqui"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="questionType">Tipo de Pergunta</Label>
            <Select
              value={editedQuestion.question_type}
              onValueChange={(value: QuizQuestion['question_type']) =>
                setEditedQuestion(prev => ({ ...prev, question_type: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                <SelectItem value="multiple_answer">Múltiplas Respostas</SelectItem>
                <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
                <SelectItem value="text">Resposta Livre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="points">Pontos</Label>
            <Input
              id="points"
              type="number"
              value={editedQuestion.points}
              onChange={e =>
                setEditedQuestion(prev => ({
                  ...prev,
                  points: parseInt(e.target.value) || 1,
                }))
              }
              className="mt-1"
              min="1"
            />
          </div>

          {editedQuestion.question_type !== 'text' && (
            <div>
              <Label>Opções de Resposta</Label>
              <div className="mt-2 space-y-3">
                {editedQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type={
                        editedQuestion.question_type === 'multiple_choice' ? 'radio' : 'checkbox'
                      }
                      name="correctAnswer"
                      checked={editedQuestion.correct_answers.includes(index.toString())}
                      onChange={() => handleCorrectAnswerToggle(index)}
                      className="mt-1"
                    />
                    <Input
                      value={option}
                      onChange={e => handleOptionChange(index, e.target.value)}
                      placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {editedQuestion.question_type === 'multiple_choice'
                  ? 'Selecione a resposta correta'
                  : 'Selecione todas as respostas corretas'}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="explanation">Explicação (Opcional)</Label>
            <Textarea
              id="explanation"
              value={editedQuestion.explanation || ''}
              onChange={e =>
                setEditedQuestion(prev => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              placeholder="Explicação que será mostrada após a resposta"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={() => onSave(editedQuestion)}
            disabled={!editedQuestion.question_text.trim()}
          >
            Salvar Pergunta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
