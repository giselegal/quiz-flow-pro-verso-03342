import { useCallback, useState } from 'react';

// 🎯 QUIZ 21 STEPS SYSTEM - Importações das 21 etapas
import { Quiz21StepsProvider, useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'text' | 'rating';
  question: string;
  options?: string[];
  correct_answer?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    time_limit?: number;
    allow_back: boolean;
    show_results_immediately: boolean;
  };
}

/**
 * 🏆 EDITOR 4 COLUNAS - LAYOUT PROFISSIONAL
 *
 * Layout com 4 colunas perfeitas:
 * 1️⃣ SIDEBAR COMPONENTES
 * 2️⃣ PAINEL PRINCIPAL DE EDIÇÃO
 * 3️⃣ PROPRIEDADES/CONFIGURAÇÕES
 * 4️⃣ PREVIEW EM TEMPO REAL
 */
const Editor4Colunas = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    id: 'quiz-' + Date.now(),
    title: 'Meu Quiz Profissional',
    description: 'Criado com Editor 4 Colunas',
    questions: [],
    settings: {
      allow_back: true,
      show_results_immediately: false,
    },
  });

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'settings' | 'analytics'>('design');

  // 🎯 FUNÇÃO PARA ADICIONAR PERGUNTA
  const addQuestion = useCallback(
    (type: Question['type']) => {
      const newQuestion: Question = {
        id: 'question-' + Date.now(),
        type,
        question: 'Nova pergunta',
        options:
          type === 'multiple-choice'
            ? ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']
            : type === 'true-false'
              ? ['Verdadeiro', 'Falso']
              : undefined,
        points: 1,
      };

      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setSelectedQuestion(quiz.questions.length);
    },
    [quiz.questions.length]
  );

  // 🎯 FUNÇÃO PARA EDITAR PERGUNTA
  const updateQuestion = useCallback((index: number, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, ...updates } : q)),
    }));
  }, []);

  // 🎯 FUNÇÃO PARA DELETAR PERGUNTA
  const deleteQuestion = useCallback((index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    setSelectedQuestion(null);
  }, []);

  return (
    <Editor4ColunasWrapper
      quiz={quiz}
      setQuiz={setQuiz}
      selectedQuestion={selectedQuestion}
      setSelectedQuestion={setSelectedQuestion}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      addQuestion={addQuestion}
      updateQuestion={updateQuestion}
      deleteQuestion={deleteQuestion}
    />
  );
};

// 🎯 WRAPPER COM PROVIDERS CORRETOS
const Editor4ColunasWrapper = ({
  quiz,
  setQuiz,
  selectedQuestion,
  setSelectedQuestion,
  activeTab,
  setActiveTab,
  addQuestion,
  updateQuestion,
  deleteQuestion,
}: {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  selectedQuestion: number | null;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<number | null>>;
  activeTab: 'design' | 'settings' | 'analytics';
  setActiveTab: React.Dispatch<React.SetStateAction<'design' | 'settings' | 'analytics'>>;
  addQuestion: (type: Question['type']) => void;
  updateQuestion: (index: number, updates: Partial<Question>) => void;
  deleteQuestion: (index: number) => void;
}) => {
  return (
    <FunnelsProvider debug={true}>
      <Quiz21StepsProvider debug={true} initialStep={1}>
        <Editor4ColunasContent
          quiz={quiz}
          setQuiz={setQuiz}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
        />
      </Quiz21StepsProvider>
    </FunnelsProvider>
  );
};

// 🎯 COMPONENTE INTERNO COM ACESSO ÀS 21 ETAPAS
const Editor4ColunasContent = ({
  quiz,
  setQuiz,
  selectedQuestion,
  setSelectedQuestion,
  activeTab,
  setActiveTab,
  addQuestion,
  updateQuestion,
  deleteQuestion,
}: {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  selectedQuestion: number | null;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<number | null>>;
  activeTab: 'design' | 'settings' | 'analytics';
  setActiveTab: React.Dispatch<React.SetStateAction<'design' | 'settings' | 'analytics'>>;
  addQuestion: (type: Question['type']) => void;
  updateQuestion: (index: number, updates: Partial<Question>) => void;
  deleteQuestion: (index: number) => void;
}) => {
  // 🎯 ACESSO ÀS 21 ETAPAS
  const { currentStep, goToNextStep, goToPreviousStep, getProgress } = useQuiz21Steps();

  // 🎯 DADOS DA ETAPA ATUAL
  const currentStepTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[`step-${currentStep}`] || [];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* 1️⃣ COLUNA 1: SIDEBAR COMPONENTES */}
      <div
        style={{
          width: '280px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.2)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🧩 Componentes
        </h2>

        {/* BOTÕES DE COMPONENTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { type: 'multiple-choice', icon: '📝', label: 'Múltipla Escolha', color: '#3b82f6' },
            { type: 'true-false', icon: '✅', label: 'Verdadeiro/Falso', color: '#10b981' },
            { type: 'text', icon: '📖', label: 'Texto Livre', color: '#f59e0b' },
            { type: 'rating', icon: '⭐', label: 'Avaliação', color: '#ef4444' },
          ].map(component => (
            <button
              key={component.type}
              onClick={() => addQuestion(component.type as Question['type'])}
              style={{
                padding: '16px',
                background: 'white',
                border: '2px solid transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = component.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <span style={{ fontSize: '20px' }}>{component.icon}</span>
              <span>{component.label}</span>
            </button>
          ))}
        </div>

        {/* ESTATÍSTICAS */}
        <div
          style={{
            marginTop: '30px',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            📊 Estatísticas
          </h3>
          <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
            <div>
              Total de perguntas: <strong>{quiz.questions.length}</strong>
            </div>
            <div>
              Pontos totais: <strong>{quiz.questions.reduce((sum, q) => sum + q.points, 0)}</strong>
            </div>
            <div>
              Tempo estimado:{' '}
              <strong>{Math.max(1, Math.ceil(quiz.questions.length / 2))} min</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2️⃣ COLUNA 2: PAINEL PRINCIPAL DE EDIÇÃO */}
      <div
        style={{
          flex: '1',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2
              style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              🎯 Editor Principal - Etapa {currentStep} de 21
            </h2>

            {/* 🎯 NAVEGAÇÃO DAS 21 ETAPAS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={goToPreviousStep}
                style={{
                  padding: '4px 8px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  opacity: currentStep > 1 ? 1 : 0.5,
                }}
                disabled={currentStep <= 1}
              >
                ← Anterior
              </button>

              <div
                style={{
                  padding: '4px 8px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                Progresso: {Math.round(getProgress())}%
              </div>

              <button
                onClick={goToNextStep}
                style={{
                  padding: '4px 8px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  opacity: currentStep < 21 ? 1 : 0.5,
                }}
                disabled={currentStep >= 21}
              >
                Próxima →
              </button>
            </div>
          </div>

          {/* ABAS */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'design', label: 'Design', icon: '🎨' },
              { key: 'settings', label: 'Config', icon: '⚙️' },
              { key: 'analytics', label: 'Analytics', icon: '📊' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '8px 16px',
                  background: activeTab === tab.key ? '#3b82f6' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#6b7280',
                  border: '1px solid',
                  borderColor: activeTab === tab.key ? '#3b82f6' : '#d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 VISUALIZAÇÃO DA ETAPA ATUAL DAS 21 ETAPAS */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}
          >
            📝 Etapa {currentStep}: {currentStepTemplate[0]?.content?.title || 'Configuração'}
          </h3>

          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            {currentStepTemplate[0]?.content?.subtitle || 'Configure esta etapa do quiz'}
          </div>

          {currentStepTemplate.length > 0 && (
            <div
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#374151',
              }}
            >
              <strong>Blocos disponíveis:</strong> {currentStepTemplate.length} componente(s)
              <div style={{ marginTop: '8px' }}>
                {currentStepTemplate.map(block => (
                  <div
                    key={block.id}
                    style={{
                      display: 'inline-block',
                      background: '#f3f4f6',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      margin: '2px 4px 2px 0',
                      fontSize: '11px',
                    }}
                  >
                    {block.type}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CONTEÚDO DA ABA ATIVA */}
        {activeTab === 'design' && (
          <div>
            {/* CONFIGURAÇÕES DO QUIZ */}
            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                📋 Configurações do Quiz
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}
                  >
                    Título do Quiz
                  </label>
                  <input
                    type="text"
                    value={quiz.title}
                    onChange={e => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}
                  >
                    Descrição
                  </label>
                  <textarea
                    value={quiz.description}
                    onChange={e => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* LISTA DE PERGUNTAS */}
            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                📝 Perguntas ({quiz.questions.length})
              </h3>

              {quiz.questions.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#6b7280',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px dashed #d1d5db',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
                    Nenhuma pergunta criada ainda
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    Use os componentes da sidebar para adicionar perguntas
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {quiz.questions.map((question, index) => (
                    <div
                      key={question.id}
                      onClick={() => setSelectedQuestion(index)}
                      style={{
                        padding: '16px',
                        background: selectedQuestion === index ? '#eff6ff' : '#f9fafb',
                        border: '1px solid',
                        borderColor: selectedQuestion === index ? '#3b82f6' : '#e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6b7280',
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          #{index + 1} - {question.type}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteQuestion(index);
                          }}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937',
                          marginBottom: '4px',
                        }}
                      >
                        {question.question}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {question.points} {question.points === 1 ? 'ponto' : 'pontos'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
              ⚙️ Configurações Avançadas
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={quiz.settings.allow_back}
                  onChange={e =>
                    setQuiz(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allow_back: e.target.checked },
                    }))
                  }
                />
                <span style={{ fontSize: '14px' }}>Permitir voltar às perguntas anteriores</span>
              </label>

              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={quiz.settings.show_results_immediately}
                  onChange={e =>
                    setQuiz(prev => ({
                      ...prev,
                      settings: { ...prev.settings, show_results_immediately: e.target.checked },
                    }))
                  }
                />
                <span style={{ fontSize: '14px' }}>Mostrar resultados imediatamente</span>
              </label>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                  }}
                >
                  Limite de tempo (minutos)
                </label>
                <input
                  type="number"
                  value={quiz.settings.time_limit || ''}
                  onChange={e =>
                    setQuiz(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        time_limit: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    }))
                  }
                  placeholder="Sem limite"
                  style={{
                    width: '200px',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
              📊 Analytics do Quiz
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                {
                  label: 'Total de Perguntas',
                  value: quiz.questions.length,
                  icon: '📝',
                  color: '#3b82f6',
                },
                {
                  label: 'Pontuação Máxima',
                  value: quiz.questions.reduce((sum, q) => sum + q.points, 0),
                  icon: '🏆',
                  color: '#f59e0b',
                },
                {
                  label: 'Tempo Estimado',
                  value: `${Math.max(1, Math.ceil(quiz.questions.length / 2))} min`,
                  icon: '⏱️',
                  color: '#10b981',
                },
                {
                  label: 'Dificuldade',
                  value:
                    quiz.questions.length > 10
                      ? 'Alta'
                      : quiz.questions.length > 5
                        ? 'Média'
                        : 'Baixa',
                  icon: '📈',
                  color: '#ef4444',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: stat.color,
                      marginBottom: '4px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3️⃣ COLUNA 3: PROPRIEDADES/CONFIGURAÇÕES */}
      <div
        style={{
          width: '320px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255,255,255,0.2)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
          }}
        >
          🎛️ Propriedades
        </h2>

        {selectedQuestion !== null && quiz.questions[selectedQuestion] ? (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
              Editando Pergunta #{selectedQuestion + 1}
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                  }}
                >
                  Pergunta
                </label>
                <textarea
                  value={quiz.questions[selectedQuestion].question}
                  onChange={e => updateQuestion(selectedQuestion, { question: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                  }}
                >
                  Pontos
                </label>
                <input
                  type="number"
                  value={quiz.questions[selectedQuestion].points}
                  onChange={e =>
                    updateQuestion(selectedQuestion, { points: parseInt(e.target.value) || 1 })
                  }
                  min="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              {quiz.questions[selectedQuestion].options && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}
                  >
                    Opções de Resposta
                  </label>
                  {quiz.questions[selectedQuestion].options!.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={e => {
                        const newOptions = [...quiz.questions[selectedQuestion].options!];
                        newOptions[optionIndex] = e.target.value;
                        updateQuestion(selectedQuestion, { options: newOptions });
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                      placeholder={`Opção ${optionIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎛️</div>
            <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>
              Selecione uma pergunta
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>para editar suas propriedades</p>
          </div>
        )}
      </div>

      {/* 4️⃣ COLUNA 4: PREVIEW EM TEMPO REAL */}
      <div
        style={{
          width: '350px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255,255,255,0.2)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          👁️ Preview
        </h2>

        {/* PREVIEW DO QUIZ */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            minHeight: '400px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              {quiz.title}
            </h3>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
              }}
            >
              {quiz.description}
            </p>
          </div>

          {quiz.questions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👁️</div>
              <p style={{ margin: '0', fontSize: '14px' }}>
                O preview aparecerá aqui
                <br />
                quando você adicionar perguntas
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quiz.questions.slice(0, 3).map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#64748b',
                      marginBottom: '8px',
                    }}
                  >
                    Pergunta {index + 1} de {quiz.questions.length}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1e293b',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    {question.question}
                  </div>
                  {question.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          style={{
                            padding: '8px 12px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#475569',
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#64748b',
                      textAlign: 'right',
                    }}
                  >
                    {question.points} {question.points === 1 ? 'ponto' : 'pontos'}
                  </div>
                </div>
              ))}

              {quiz.questions.length > 3 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    color: '#6b7280',
                    fontSize: '12px',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                  }}
                >
                  ... e mais {quiz.questions.length - 3}{' '}
                  {quiz.questions.length - 3 === 1 ? 'pergunta' : 'perguntas'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            💾 Salvar Quiz
          </button>

          <button
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            🚀 Publicar Quiz
          </button>

          <button
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'quiz',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            📤 Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor4Colunas;
