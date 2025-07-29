
'use client';

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Save, Settings, Eye, Trash2 } from 'lucide-react';

// Import components
import QuizDashboard from '@/components/quiz/QuizDashboard';
import QuizEditor from '@/components/quiz/QuizEditor';
import QuizPreview from '@/components/quiz/QuizPreview';
import CreateQuizModal from '@/components/quiz/CreateQuizModal';
import { blockComponents } from '@/components/editor/blocks/BlockComponents';

// Import hooks
import { useQuizzes } from '@/hooks/useQuizzes';
import { useQuiz } from '@/hooks/useQuiz';

// Import types
import { Quiz } from '@/types/quiz';

const QuizEditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor' | 'preview'>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Quiz hooks
  const { quizzes, loading: quizzesLoading, createQuiz } = useQuizzes();
  const { 
    quiz, 
    questions, 
    loading: quizLoading, 
    error, 
    updateQuiz, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion,
    saveQuiz
  } = useQuiz(selectedQuiz?.id);

  // Editor state
  const [editorBlocks, setEditorBlocks] = useState<any[]>([]);

  const handleQuizSelect = (selectedQuiz: Quiz) => {
    setSelectedQuiz(selectedQuiz);
    setActiveTab('editor');
  };

  const handleCreateQuiz = async (quizData: Partial<Quiz>) => {
    try {
      const newQuiz = await createQuiz(quizData);
      setSelectedQuiz(newQuiz);
      setActiveTab('editor');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleSaveQuiz = async () => {
    if (!selectedQuiz) return;
    
    try {
      await saveQuiz();
      console.log('Quiz saved successfully');
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedQuiz(null);
    setActiveTab('dashboard');
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: { text: 'Novo bloco' },
      order: editorBlocks.length
    };
    setEditorBlocks([...editorBlocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, content: any) => {
    setEditorBlocks(blocks => 
      blocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    setEditorBlocks(blocks => blocks.filter(block => block.id !== blockId));
  };

  if (quizzesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {selectedQuiz && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
              <h1 className="text-xl font-semibold">
                {selectedQuiz ? `Editando: ${selectedQuiz.title}` : 'Editor de Quizzes'}
              </h1>
            </div>
            
            {selectedQuiz && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('dashboard')}
                  className={activeTab === 'dashboard' ? 'bg-blue-50' : ''}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('editor')}
                  className={activeTab === 'editor' ? 'bg-blue-50' : ''}
                >
                  Editor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('preview')}
                  className={activeTab === 'preview' ? 'bg-blue-50' : ''}
                >
                  Preview
                </Button>
                <Button
                  onClick={handleSaveQuiz}
                  className="flex items-center gap-2"
                  disabled={quizLoading}
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <QuizDashboard 
            quizzes={quizzes} 
            onQuizSelect={handleQuizSelect}
            onCreateQuiz={() => setShowCreateModal(true)}
          />
        )}

        {activeTab === 'editor' && selectedQuiz && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor de Blocos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock('text')}
                  >
                    + Texto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock('question')}
                  >
                    + Pergunta
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock('image')}
                  >
                    + Imagem
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {editorBlocks.map((block) => {
                    const BlockComponent = blockComponents[block.type];
                    if (!BlockComponent) return null;
                    
                    return (
                      <div key={block.id} className="border rounded-lg p-4">
                        <BlockComponent
                          content={block.content}
                          onUpdate={(content) => handleUpdateBlock(block.id, content)}
                          onDelete={() => handleDeleteBlock(block.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <QuizEditor
              quiz={selectedQuiz}
              questions={questions}
              onQuizUpdate={updateQuiz}
              onQuestionAdd={addQuestion}
              onQuestionUpdate={updateQuestion}
              onQuestionDelete={deleteQuestion}
            />
          </div>
        )}

        {activeTab === 'preview' && selectedQuiz && (
          <QuizPreview quiz={selectedQuiz} />
        )}
      </div>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateQuiz}
      />
    </div>
  );
};

export default QuizEditorPage;
