
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { QuestionEditor } from '@/components/editor/QuestionEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Eye, Settings, Search } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
  category?: string;
  points?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    timeLimit?: number;
    shuffleQuestions: boolean;
    showResults: boolean;
    allowRetakes: boolean;
  };
}

function QuizEditorContent() {
  const {
    activeTab,
    setActiveTab,
    blockSearch,
    setBlockSearch,
    availableBlocks,
    handleAddBlock
  } = useEditor();

  const [quiz, setQuiz] = useState<Quiz>({
    id: '',
    title: '',
    description: '',
    questions: [],
    settings: {
      shuffleQuestions: false,
      showResults: true,
      allowRetakes: true
    }
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    // Load quiz from localStorage or API
    const savedQuiz = localStorage.getItem('current-quiz');
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz));
    }
  }, []);

  const saveQuiz = () => {
    localStorage.setItem('current-quiz', JSON.stringify(quiz));
    console.log('Quiz saved:', quiz);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type: 'multiple_choice',
      options: ['Opção 1', 'Opção 2'],
      required: true,
      points: 1
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? updatedQuestion : q)
    }));
  };

  const deleteQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = quiz.questions[index];
    const duplicatedQuestion: Question = {
      ...questionToDuplicate,
      id: `q-${Date.now()}`,
      text: `${questionToDuplicate.text} (Cópia)`
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions.slice(0, index + 1),
        duplicatedQuestion,
        ...prev.questions.slice(index + 1)
      ]
    }));
  };

  const filteredQuestions = quiz.questions.filter((q: Question) => 
    q.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const renderPreview = () => {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{quiz.title || 'Título do Quiz'}</h1>
          <p className="text-gray-600">{quiz.description || 'Descrição do quiz'}</p>
        </div>
        
        {filteredQuestions.map((question: Question, index: number) => (
          <Card key={question.id} className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {index + 1}. {question.text}
            </h3>
            
            {question.type === 'multiple_choice' || question.type === 'single_choice' ? (
              <div className="space-y-2">
                {question.options?.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <input
                      type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                      name={`question-${question.id}`}
                      className="rounded"
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            ) : question.type === 'text' ? (
              <Textarea placeholder="Digite sua resposta aqui..." />
            ) : question.type === 'rating' ? (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button key={rating} variant="outline" size="sm">
                    {rating}
                  </Button>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
        
        <div className="text-center">
          <Button className="px-8">Enviar Respostas</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Editor de Quiz</h1>
          <Badge variant="secondary">
            {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'editor' ? 'default' : 'outline'}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveQuiz}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeTab === 'editor' ? (
          <>
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Título do Quiz</Label>
                <Input
                  id="quiz-title"
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do quiz"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Descrição</Label>
                <Textarea
                  id="quiz-description"
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite a descrição do quiz"
                />
              </div>

              <div className="space-y-2">
                <Label>Componentes Disponíveis</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar componentes..."
                    value={blockSearch}
                    onChange={(e) => setBlockSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Conteúdo</h3>
                {availableBlocks.filter((block: any) => block.category === 'content').map((block: any) => (
                  <Button
                    key={block.type}
                    variant="outline"
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
                    variant="outline"
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
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddBlock(block.type)}
                  >
                    <span className="mr-2">{block.icon}</span>
                    {block.name}
                  </Button>
                ))}
              </div>

              <Button onClick={addQuestion} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Perguntas</h2>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Buscar perguntas..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 mb-4">Nenhuma pergunta encontrada</p>
                  <Button onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Pergunta
                  </Button>
                </Card>
              ) : (
                filteredQuestions.map((question: Question, index: number) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                    onDelete={() => deleteQuestion(index)}
                    onDuplicate={() => duplicateQuestion(index)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 bg-gray-50">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizEditorPage() {
  return (
    <EditorProvider>
      <QuizEditorContent />
    </EditorProvider>
  );
}
