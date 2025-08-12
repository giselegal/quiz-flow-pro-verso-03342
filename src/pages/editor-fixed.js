import { createElement } from 'react';

export default function EditorFixed() {
  return createElement(
    'div',
    {
      className: 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans',
    },
    createElement(
      'div',
      {
        className: 'max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8',
      },
      [
        createElement(
          'div',
          {
            key: 'header',
            className: 'mb-8',
          },
          [
            createElement(
              'h1',
              {
                key: 'title',
                className: 'text-4xl font-bold text-gray-800 mb-2',
              },
              'Editor de Quiz - 21 Etapas'
            ),
            createElement(
              'p',
              {
                key: 'subtitle',
                className: 'text-gray-600',
              },
              'Sistema de criação de quiz personalizado - Funcionando!'
            ),
          ]
        ),

        createElement(
          'div',
          {
            key: 'grid',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
          },
          Array.from({ length: 21 }, (_, i) => {
            const stepNum = i + 1;
            const isIntro = stepNum === 1;
            const isResult = stepNum === 21;

            return createElement(
              'div',
              {
                key: stepNum,
                className:
                  'group bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-pointer',
              },
              [
                createElement(
                  'div',
                  {
                    key: 'header',
                    className: 'flex items-center justify-between mb-3',
                  },
                  [
                    createElement(
                      'div',
                      {
                        key: 'number',
                        className:
                          'w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-semibold',
                      },
                      stepNum
                    ),
                    createElement('div', {
                      key: 'indicator',
                      className: `w-3 h-3 rounded-full ${isIntro ? 'bg-green-500' : isResult ? 'bg-blue-500' : 'bg-yellow-500'}`,
                    }),
                  ]
                ),

                createElement(
                  'h3',
                  {
                    key: 'title',
                    className: 'font-semibold text-gray-800 mb-2',
                  },
                  isIntro ? 'Introdução' : isResult ? 'Resultado Final' : `Pergunta ${stepNum - 1}`
                ),

                createElement(
                  'p',
                  {
                    key: 'description',
                    className: 'text-sm text-gray-600 leading-relaxed',
                  },
                  isIntro
                    ? 'Página inicial do quiz com captura do nome'
                    : isResult
                      ? 'Exibição dos resultados e call-to-action'
                      : 'Questão de múltipla escolha do quiz'
                ),

                createElement(
                  'div',
                  {
                    key: 'footer',
                    className: 'mt-4 pt-4 border-t border-gray-200 group-hover:border-gray-300',
                  },
                  createElement(
                    'span',
                    {
                      className: 'text-xs font-medium text-gray-500 uppercase tracking-wider',
                    },
                    isIntro ? 'Capture' : isResult ? 'Conversão' : 'Engajamento'
                  )
                ),
              ]
            );
          })
        ),

        createElement(
          'div',
          {
            key: 'status',
            className: 'mt-8 pt-8 border-t border-gray-200',
          },
          createElement(
            'div',
            {
              className: 'flex items-center justify-between',
            },
            [
              createElement(
                'div',
                {
                  key: 'info',
                },
                [
                  createElement(
                    'h3',
                    {
                      key: 'status-title',
                      className: 'font-semibold text-gray-800 mb-1',
                    },
                    'Status do Projeto'
                  ),
                  createElement(
                    'p',
                    {
                      key: 'status-desc',
                      className: 'text-sm text-gray-600',
                    },
                    '21 etapas configuradas e prontas para edição'
                  ),
                ]
              ),
              createElement(
                'div',
                {
                  key: 'counter',
                  className: 'text-right',
                },
                [
                  createElement(
                    'div',
                    {
                      key: 'number',
                      className: 'text-2xl font-bold text-gray-800',
                    },
                    '21/21'
                  ),
                  createElement(
                    'div',
                    {
                      key: 'label',
                      className: 'text-xs text-gray-500 uppercase tracking-wide',
                    },
                    'Etapas'
                  ),
                ]
              ),
            ]
          )
        ),
      ]
    )
  );
}
