
import React, { useState } from 'react';
import { Plus, Save, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BlockComponents from '@/components/editor/blocks/BlockComponents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEditor } from '@/contexts/EditorContext';
import type { Quiz, Question } from '@/types/quiz';
import type { EditorBlock } from '@/types/editor';

export default function QuizEditorPage() {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    activeTab,
    setActiveTab,
    actions
  } = useEditor();

  const [currentQuiz, setCurrentQuiz] = useState<Quiz>({
    id: '',
    title: 'Novo Quiz',
    description: '',
    author_id: '',
    category: 'style',
    difficulty: 'medium',
    time_limit: null,
    is_public: true,
    is_published: false,
    is_template: false,
    thumbnail_url: null,
    tags: [],
    view_count: 0,
    completion_count: 0,
    average_score: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    quiz_id: '',
    question_text: '',
    question_type: 'multiple_choice',
    options: [],
    correct_answer: '',
    points: 1,
    order_index: 0,
    is_required: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const handleAddBlock = (type: string) => {
    actions.addBlock(type);
  };

  const handleUpdateBlock = (id: string, content: any) => {
    actions.updateBlock(id, content);
  };

  const handleDeleteBlock = (id: string) => {
    actions.deleteBlock(id);
  };

  const handleSaveQuiz = () => {
    console.log('Saving quiz:', currentQuiz);
    console.log('Blocks:', blocks);
  };

  const handlePreview = () => {
    console.log('Previewing quiz');
  };

  const handlePublish = () => {
    console.log('Publishing quiz');
  };

  const availableBlocks = [
    { type: 'header', name: 'Cabeçalho', icon: '📄' },
    { type: 'text', name: 'Texto', icon: '📝' },
    { type: 'image', name: 'Imagem', icon: '🖼️' },
    { type: 'button', name: 'Botão', icon: '🔘' },
    { type: 'spacer', name: 'Espaçador', icon: '⬜' },
    { type: 'quiz-question', name: 'Questão', icon: '❓' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Editor de Quiz</h1>
              <Badge variant="secondary">Rascunho</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveQuiz}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button size="sm" onClick={handlePublish}>
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Components */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Componentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {availableBlocks.map((block) => (
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
                </CardContent>
              </Card>

              {/* Main Editor Area */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Canvas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blocks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>Nenhum componente adicionado ainda.</p>
                        <p className="text-sm">Selecione um componente na sidebar para começar.</p>
                      </div>
                    ) : (
                      blocks.map((block) => (
                        <div
                          key={block.id}
                          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedBlockId === block.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedBlockId(block.id)}
                        >
                          <BlockComponents
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onUpdate={(content) => handleUpdateBlock(block.id, content)}
                            onSelect={() => setSelectedBlockId(block.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Properties Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Propriedades</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBlockId ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="block-id">ID do Bloco</Label>
                        <Input
                          id="block-id"
                          value={selectedBlockId}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          handleDeleteBlock(selectedBlockId);
                          setSelectedBlockId(null);
                        }}
                      >
                        Excluir Bloco
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Selecione um bloco para ver suas propriedades
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiz-title">Título</Label>
                    <Input
                      id="quiz-title"
                      value={currentQuiz.title}
                      onChange={(e) => setCurrentQuiz({...currentQuiz, title: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiz-category">Categoria</Label>
                    <Input
                      id="quiz-category"
                      value={currentQuiz.category}
                      onChange={(e) => setCurrentQuiz({...currentQuiz, category: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="quiz-description">Descrição</Label>
                    <Input
                      id="quiz-description"
                      value={currentQuiz.description || ''}
                      onChange={(e) => setCurrentQuiz({...currentQuiz, description: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <BlockComponents
                        key={block.id}
                        block={block}
                        isSelected={false}
                        onUpdate={() => {}}
                        onSelect={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
