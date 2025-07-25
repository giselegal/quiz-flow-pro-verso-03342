// =============================================================================
// EDITOR PRINCIPAL DE QUIZ - LAYOUT RESPONSIVO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import QuestionEditor from '@/components/editor/QuestionEditor';

// Tipo temporário para Question
interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any[];
  correct_answers: any[];
  points: number;
  required: boolean;
  order_index: number;
  time_limit?: number;
  explanation?: string;
  hint?: string;
  tags?: string[];
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const QuizEditorContent: React.FC = () => {
  const { 
    state, 
    loadQuiz, 
    createQuiz, 
    saveQuiz, 
    togglePreview, 
    toggleSidebar,
    setError,
    updateQuiz,
    selectQuestion,
    addQuestion
  } = useEditor();
  
  const [isInitialized, setIsInitialized] = useState(false);

  // =============================================================================
  // INICIALIZAÇÃO
  // =============================================================================

  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Criar novo quiz por padrão
        await createQuiz({
          title: 'Novo Quiz',
          description: 'Descrição do quiz',
          category: 'geral',
          difficulty: 'medium',
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro ao inicializar editor:', error);
        setError('Erro ao carregar o editor');
      }
    };

    if (!isInitialized) {
      initializeEditor();
    }
  }, [createQuiz, setError, isInitialized]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleSave = async () => {
    try {
      await saveQuiz();
      alert('Quiz salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar quiz');
    }
  };

  const handleAddQuestion = async () => {
    try {
      await addQuestion({
        question_text: 'Nova pergunta',
        question_type: 'multiple_choice',
        options: [],
        correct_answers: [],
        points: 1,
        required: true,
        order_index: state.questions.length
      });
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    // TODO: Implementar updateQuestion no contexto
    console.log('Update question:', questionId, updates);
  };

  const handleDeleteQuestion = (questionId: string) => {
    // TODO: Implementar deleteQuestion no contexto
    console.log('Delete question:', questionId);
  };

  const handleDuplicateQuestion = (questionId: string) => {
    // TODO: Implementar duplicateQuestion no contexto
    console.log('Duplicate question:', questionId);
  };

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    // TODO: Implementar moveQuestion no contexto
    console.log('Move question:', questionId, direction);
  };  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (!isInitialized || state.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Carregando editor...</span>
        </div>
      </div>
    );
  }

  // =============================================================================
  // ERROR STATE
  // =============================================================================

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setError(null)}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // =============================================================================
  // PREVIEW MODE
  // =============================================================================

  if (state.previewMode) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b bg-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Pré-visualização</h1>
          <div className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={togglePreview}
            >
              Sair da Pré-visualização
            </button>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{state.currentQuiz?.title}</h2>
            <p className="text-gray-600 mb-6">{state.currentQuiz?.description}</p>
            
            {state.questions.map((question, index) => (
              <div key={question.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {index + 1}. {question.question_text}
                </h3>
                
                {question.question_type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input type="radio" name={`question_${question.id}`} disabled />
                        <label>{option.text}</label>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Explicação:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // EDITOR LAYOUT
  // =============================================================================

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="border-b bg-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Editor de Quiz</h1>
          {state.currentQuiz && (
            <input 
              type="text"
              value={state.currentQuiz.title}
              onChange={(e) => state.currentQuiz && updateQuiz({ title: e.target.value })}
              className="text-lg font-medium bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 focus:rounded px-2 py-1"
              placeholder="Título do quiz"
            />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            onClick={handleAddQuestion}
          >
            + Pergunta
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            onClick={togglePreview}
          >
            Pré-visualizar
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={state.isSaving}
          >
            {state.isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Main Editor - Layout Simples de 3 Colunas */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {state.sidebarVisible && (
          <div className="w-80 bg-white border-r p-4">
            <h3 className="font-semibold mb-4">Perguntas</h3>
            <div className="space-y-2">
              {state.questions.map((question, index) => (
                <div 
                  key={question.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    state.selectedQuestionId === question.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => selectQuestion(question.id)}
                >
                  <div className="font-medium text-sm">Pergunta {index + 1}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {question.question_text || 'Sem título'}
                  </div>
                </div>
              ))}
              
              {state.questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma pergunta criada ainda.</p>
                  <button 
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddQuestion}
                  >
                    Criar primeira pergunta
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canvas Central */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {state.selectedQuestionId ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Editar Pergunta</h2>
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => selectQuestion(null)}
                  >
                    ← Voltar à lista
                  </button>
                </div>
                
                {/* Editor de Pergunta */}
                {(() => {
                  const question = state.questions.find(q => q.id === state.selectedQuestionId);
                  const questionIndex = state.questions.findIndex(q => q.id === state.selectedQuestionId);
                  
                  if (!question) {
                    return (
                      <div className="bg-white rounded-lg border p-6 text-center">
                        <p className="text-gray-500">Pergunta não encontrada</p>
                      </div>
                    );
                  }
                  
                  return (
                    <QuestionEditor
                      question={question}
                      questionIndex={questionIndex}
                      onUpdate={handleUpdateQuestion}
                      onDelete={handleDeleteQuestion}
                      onDuplicate={handleDuplicateQuestion}
                      onMove={handleMoveQuestion}
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Bem-vindo ao Editor de Quiz
                </h2>
                <p className="text-gray-600 mb-6">
                  Selecione uma pergunta na barra lateral ou crie uma nova para começar.
                </p>
                <button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleAddQuestion}
                >
                  Criar Primeira Pergunta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l p-4">
          <h3 className="font-semibold mb-4">Propriedades</h3>
          
          {state.currentQuiz && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input 
                  type="text"
                  value={state.currentQuiz.title}
                  onChange={(e) => updateQuiz({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea 
                  value={state.currentQuiz.description || ''}
                  onChange={(e) => updateQuiz({ description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select 
                  value={state.currentQuiz.category}
                  onChange={(e) => updateQuiz({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="geral">Geral</option>
                  <option value="educacao">Educação</option>
                  <option value="entretenimento">Entretenimento</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dificuldade
                </label>
                <select 
                  value={state.currentQuiz.difficulty}
                  onChange={(e) => updateQuiz({ difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-white px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>
            {state.questions.length} pergunta(s)
          </span>
          {state.hasUnsavedChanges && (
            <span className="text-amber-600">• Alterações não salvas</span>
          )}
          {state.isSaving && (
            <span className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 mr-1 border-b border-blue-600"></div>
              Salvando...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {state.currentQuiz?.title}
          </span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// WRAPPER COM PROVIDER
// =============================================================================

const QuizEditorPage: React.FC = () => {
  return (
    <EditorProvider>
      <QuizEditorContent />
    </EditorProvider>
  );
};

export default QuizEditorPage;
