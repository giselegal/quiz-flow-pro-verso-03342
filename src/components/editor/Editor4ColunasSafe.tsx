import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { useCallback, useState } from 'react';

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
 * 🏆 EDITOR 4 COLUNAS SAFE - SEM DEPENDÊNCIAS PROBLEMÁTICAS
 *
 * Layout com 4 colunas perfeitas:
 * 1️⃣ SIDEBAR COMPONENTES
 * 2️⃣ PAINEL PRINCIPAL DE EDIÇÃO
 * 3️⃣ PROPRIEDADES/CONFIGURAÇÕES
 * 4️⃣ PREVIEW EM TEMPO REAL
 */
const Editor4ColunasSafe = () => {
  // 🎯 ESTADO DO QUIZ
  const [quiz, setQuiz] = useState<Quiz>({
    id: 'quiz-' + Date.now(),
    title: 'Meu Quiz Profissional',
    description: 'Descrição do quiz',
    questions: [],
    settings: {
      allow_back: true,
      show_results_immediately: true,
    },
  });

  // 🎯 ESTADO DA INTERFACE
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'settings' | 'analytics'>('design');
  const [currentStep, setCurrentStep] = useState(1);

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

  // 🎯 NAVEGAÇÃO DAS 21 ETAPAS (SEM PROVIDER)
  const goToNextStep = () => {
    if (currentStep < 21) setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const getProgress = () => {
    return (currentStep / 21) * 100;
  };

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
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#1f2937',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = component.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <span style={{ fontSize: '20px' }}>{component.icon}</span>
              <div>
                <div style={{ fontWeight: '600' }}>{component.label}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Arrastar para adicionar
                </div>
              </div>
            </button>
          ))}
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
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
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
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
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
            ❓ Perguntas ({quiz.questions.length})
          </h3>

          {quiz.questions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              Nenhuma pergunta adicionada ainda.
              <br />
              Use os componentes da sidebar para adicionar perguntas.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    border: `2px solid ${selectedQuestion === index ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setSelectedQuestion(index)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                      {index + 1}. {question.question}
                    </h4>
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
                      🗑️
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Tipo: {question.type} | Pontos: {question.points}
                  </div>

                  {question.options && (
                    <div style={{ fontSize: '12px', color: '#374151' }}>
                      Opções: {question.options.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3️⃣ COLUNA 3: PROPRIEDADES */}
      <div
        style={{
          width: '400px',
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
          }}
        >
          ⚙️ Propriedades
        </h2>

        {selectedQuestion !== null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                Editando Pergunta {selectedQuestion + 1}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                    Pergunta
                  </label>
                  <input
                    type="text"
                    value={quiz.questions[selectedQuestion]?.question || ''}
                    onChange={e => updateQuestion(selectedQuestion, { question: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                    Pontos
                  </label>
                  <input
                    type="number"
                    value={quiz.questions[selectedQuestion]?.points || 1}
                    onChange={e =>
                      updateQuestion(selectedQuestion, { points: parseInt(e.target.value) || 1 })
                    }
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>

                {quiz.questions[selectedQuestion]?.options && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                      Opções
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
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Selecione uma pergunta para editar suas propriedades
          </div>
        )}
      </div>

      {/* 4️⃣ COLUNA 4: PREVIEW */}
      <div
        style={{
          width: '500px',
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
          }}
        >
          👁️ Preview
        </h2>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            minHeight: '400px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700' }}>
            {quiz.title}
          </h3>

          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
            {quiz.description}
          </p>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            {quiz.questions.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                Adicione perguntas para ver o preview
              </div>
            ) : (
              quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    marginBottom: '20px',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                  }}
                >
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                    {index + 1}. {question.question}
                  </h4>

                  {question.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                            name={`question-${index}`}
                            style={{ margin: '0' }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'text' && (
                    <textarea
                      placeholder="Digite sua resposta..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical',
                      }}
                    />
                  )}

                  {question.type === 'rating' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          style={{
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#fbbf24',
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    Pontos: {question.points}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CONTROLES DE AÇÃO */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            justifyContent: 'space-between',
          }}
        >
          <button
            style={{
              flex: '1',
              padding: '12px',
              background: '#10b981',
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
            💾 Salvar
          </button>

          <button
            style={{
              flex: '1',
              padding: '12px',
              background: '#3b82f6',
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
            📤 Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor4ColunasSafe;
