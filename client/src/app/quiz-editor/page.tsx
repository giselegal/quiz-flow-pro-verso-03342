
import React, { useState } from 'react';
import { EditorProvider } from '@/contexts/EditorContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Settings, Save, ArrowLeft } from 'lucide-react';
import { BlockComponents } from '@/components/editor/blocks/BlockComponents';
import { Quiz, Question } from '@/types/quiz';

const QuizEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: 'Nova Pergunta',
      tags: [],
      text: 'Digite sua pergunta aqui...',
      type: 'single_choice',
      options: [
        { id: 'opt1', text: 'Opção 1', isCorrect: false },
        { id: 'opt2', text: 'Opção 2', isCorrect: true },
        { id: 'opt3', text: 'Opção 3', isCorrect: false },
        { id: 'opt4', text: 'Opção 4', isCorrect: false }
      ],
      required: true
    };
    setQuestions([...questions, newQuestion]);
  };

  const sampleBlocks = [
    {
      id: 'block-1',
      type: 'header',
      content: {
        title: 'Título do Quiz',
        subtitle: 'Subtítulo opcional'
      },
      order: 0
    },
    {
      id: 'block-2',
      type: 'text',
      content: {
        text: 'Descrição do quiz aqui...'
      },
      order: 1
    }
  ];

  return (
    <EditorProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Editor de Quiz</h1>
                  <p className="text-sm text-gray-500">
                    {currentQuiz?.title || 'Novo Quiz'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-medium mb-4">Componentes</h3>
                    <div className="space-y-2">
                      {['header', 'text', 'image', 'button', 'quiz-question'].map(type => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow-sm border min-h-[600px]">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium">Canvas do Quiz</h2>
                        <Badge variant="outline">
                          {sampleBlocks.length} componentes
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {sampleBlocks.map(block => (
                          <div key={block.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <BlockComponents
                              block={block}
                              isSelected={false}
                              isEditing={false}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Add Question Button */}
                      <div className="mt-6 pt-6 border-t">
                        <Button
                          onClick={handleAddQuestion}
                          variant="outline"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Pergunta
                        </Button>
                      </div>

                      {/* Questions List */}
                      {questions.length > 0 && (
                        <div className="mt-6 space-y-4">
                          <h3 className="font-medium">Perguntas ({questions.length})</h3>
                          {questions.map((question, index) => (
                            <div key={question.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  Pergunta {index + 1}
                                </Badge>
                                <Badge variant={question.type === 'single_choice' ? 'default' : 'secondary'}>
                                  {question.type}
                                </Badge>
                              </div>
                              <Input
                                value={question.text}
                                onChange={(e) => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].text = e.target.value;
                                  setQuestions(updatedQuestions);
                                }}
                                placeholder="Digite sua pergunta..."
                                className="mb-3"
                              />
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div key={option.id} className="flex items-center space-x-2">
                                    <Input
                                      value={option.text}
                                      onChange={(e) => {
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[index].options[optIndex].text = e.target.value;
                                        setQuestions(updatedQuestions);
                                      }}
                                      placeholder={`Opção ${optIndex + 1}`}
                                      className="flex-1"
                                    />
                                    <Badge variant={option.isCorrect ? 'default' : 'secondary'}>
                                      {option.isCorrect ? 'Correta' : 'Incorreta'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium mb-4">Visualização</h2>
                <div className="text-center py-12 text-gray-500">
                  Visualização do quiz será mostrada aqui
                </div>
              </div>
            </TabsContent>

            <TabsContent className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium mb-4">Configurações</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título do Quiz</label>
                    <Input placeholder="Digite o título do quiz" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <Input placeholder="Digite a descrição do quiz" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <Input placeholder="Digite a categoria" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EditorProvider>
  );
};

export default QuizEditorPage;
