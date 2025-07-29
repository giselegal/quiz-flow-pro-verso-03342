
'use client';

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useQuiz } from '@/hooks/useQuiz';
import { Quiz, Question } from '@/types/quiz';
import { QuizDashboard } from '@/components/quiz/QuizDashboard';
import { QuizEditor } from '@/components/quiz/QuizEditor';
import { QuizPreview } from '@/components/quiz/QuizPreview';
import { CreateQuizModal } from '@/components/quiz/CreateQuizModal';
import BlockComponents from '@/components/editor/blocks/BlockComponents';
import { Plus, Save, Eye, Settings } from 'lucide-react';

interface EditorBlock {
  id: string;
  type: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  content: any;
  order: number;
}

const QuizEditorPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const { quizzes, loading: quizzesLoading, error: quizzesError, createQuiz } = useQuizzes();
  const { quiz, questions, loading, error, loadQuiz, updateQuiz, addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);

  const saveQuiz = async () => {
    if (!selectedQuiz) return;
    
    try {
      await updateQuiz({ ...selectedQuiz });
      console.log('Quiz saved successfully');
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleQuizSelect = (selectedQuiz: Quiz) => {
    setSelectedQuiz(selectedQuiz);
    setActiveTab('editor');
  };

  const handleCreateQuiz = async (quizData: any) => {
    try {
      const newQuiz = await createQuiz(quizData);
      setSelectedQuiz(newQuiz);
      setActiveTab('editor');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const addBlock = (type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
      order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content: { ...block.content, ...content } } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const getDefaultContentForType = (type: EditorBlock['type']) => {
    switch (type) {
      case 'text':
        return { text: 'Digite seu texto aqui...' };
      case 'multiple_choice':
        return {
          question: 'Sua pergunta aqui?',
          options: ['Opção 1', 'Opção 2', 'Opção 3']
        };
      case 'single_choice':
        return {
          question: 'Sua pergunta aqui?',
          options: ['Opção A', 'Opção B', 'Opção C']
        };
      case 'rating':
        return {
          question: 'Como você avaliaria?',
          minLabel: 'Ruim',
          maxLabel: 'Excelente',
          scale: 5
        };
      default:
        return {};
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <QuizDashboard 
            quizzes={quizzes}
            onQuizSelect={handleQuizSelect}
            onCreateQuiz={() => setShowCreateModal(true)}
          />
        );
      case 'editor':
        return selectedQuiz ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">{selectedQuiz.title}</h1>
                  <p className="text-gray-500 text-sm">Editor de Quiz</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab('preview')}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={saveQuiz}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r p-4">
                <h3 className="font-medium mb-4">Componentes</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock('text')}
                    className="w-full justify-start"
                  >
                    📝 Texto
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock('multiple_choice')}
                    className="w-full justify-start"
                  >
                    ☑️ Múltipla Escolha
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock('single_choice')}
                    className="w-full justify-start"
                  >
                    ⚪ Escolha Única
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock('rating')}
                    className="w-full justify-start"
                  >
                    ⭐ Avaliação
                  </Button>
                </div>
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-4">
                  {blocks.map(block => (
                    <div key={block.id} className="border rounded-lg p-4 bg-white">
                      <BlockComponents
                        block={block}
                        onUpdate={(content) => updateBlock(block.id, content)}
                        onDelete={() => deleteBlock(block.id)}
                      />
                    </div>
                  ))}
                  
                  {blocks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="mb-4">Nenhum componente adicionado ainda</p>
                      <p className="text-sm">Use a barra lateral para adicionar componentes ao seu quiz</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Selecione um quiz para editar</p>
          </div>
        );
      case 'preview':
        return selectedQuiz ? (
          <QuizPreview quiz={selectedQuiz} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Nenhum quiz selecionado para preview</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Editor</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'editor' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
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
