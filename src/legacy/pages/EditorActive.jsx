import { createElement as h } from 'react';

const EditorFixed = () => {
  return h(
    'div',
    {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
    h(
      'div',
      {
        style: {
          maxWidth: '1400px',
          margin: '0 auto',
        },
      },
      [
        h(
          'header',
          {
            key: 'header',
            style: {
              marginBottom: '2rem',
              textAlign: 'center',
            },
          },
          [
            h(
              'h1',
              {
                key: 'title',
                style: {
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                },
              },
              'Editor de Quiz - 21 Etapas'
            ),
            h(
              'p',
              {
                key: 'subtitle',
                style: {
                  fontSize: '1.2rem',
                  color: '#64748b',
                },
              },
              'Sistema completo de criação de quiz personalizado'
            ),
          ]
        ),

        h(
          'div',
          {
            key: 'content',
            style: {
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          },
          [
            h(
              'div',
              {
                key: 'status',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: '8px',
                },
              },
              [
                h('div', { key: 'status-text' }, [
                  h(
                    'h3',
                    {
                      key: 'status-title',
                      style: { margin: '0 0 0.5rem 0', fontSize: '1.2rem' },
                    },
                    '✅ Sistema Ativo'
                  ),
                  h(
                    'p',
                    {
                      key: 'status-desc',
                      style: { margin: 0, opacity: 0.9 },
                    },
                    'Todas as 21 etapas configuradas e prontas'
                  ),
                ]),
                h(
                  'div',
                  {
                    key: 'counter',
                    style: {
                      textAlign: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    },
                  },
                  '21/21'
                ),
              ]
            ),

            h(
              'div',
              {
                key: 'grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                },
              },
              Array.from({ length: 21 }, (_, index) => {
                const stepNum = index + 1;
                const isIntro = stepNum === 1;
                const isResult = stepNum === 21;
                const isQuestion = stepNum >= 2 && stepNum <= 20;

                return h(
                  'div',
                  {
                    key: stepNum,
                    style: {
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    },
                    onMouseEnter: e => {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                      e.target.style.borderColor = '#3b82f6';
                    },
                    onMouseLeave: e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#e2e8f0';
                    },
                  },
                  [
                    h(
                      'div',
                      {
                        key: 'header',
                        style: {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '1rem',
                        },
                      },
                      [
                        h(
                          'div',
                          {
                            key: 'number',
                            style: {
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                              color: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                            },
                          },
                          stepNum.toString()
                        ),
                        h('div', {
                          key: 'indicator',
                          style: {
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: isIntro ? '#10b981' : isResult ? '#3b82f6' : '#f59e0b',
                          },
                        }),
                      ]
                    ),

                    h(
                      'h3',
                      {
                        key: 'title',
                        style: {
                          fontSize: '1.3rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '0.5rem',
                        },
                      },
                      isIntro
                        ? '🚀 Introdução'
                        : isResult
                          ? '🎯 Resultado Final'
                          : `❓ Pergunta ${stepNum - 1}`
                    ),

                    h(
                      'p',
                      {
                        key: 'description',
                        style: {
                          fontSize: '0.95rem',
                          color: '#64748b',
                          lineHeight: '1.5',
                          marginBottom: '1rem',
                        },
                      },
                      isIntro
                        ? 'Página inicial com captura do nome do usuário'
                        : isResult
                          ? 'Exibição dos resultados personalizados e call-to-action'
                          : `Questão de múltipla escolha com sistema de pontuação`
                    ),

                    h(
                      'div',
                      {
                        key: 'footer',
                        style: {
                          paddingTop: '1rem',
                          borderTop: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        },
                      },
                      [
                        h(
                          'span',
                          {
                            key: 'type',
                            style: {
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: '#64748b',
                            },
                          },
                          isIntro ? 'Captura' : isResult ? 'Conversão' : 'Engajamento'
                        ),
                        h('div', {
                          key: 'status-dot',
                          style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                          },
                        }),
                      ]
                    ),
                  ]
                );
              })
            ),
          ]
        ),
      ]
    )
  );
};

export default EditorFixed;
