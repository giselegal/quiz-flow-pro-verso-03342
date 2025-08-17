import React from 'react';

// Minimal working editor to bypass TypeScript config issues
export default function EditorWorkingMinimal() {
  return React.createElement(
    'div',
    {
      className: 'min-h-screen bg-gray-50 p-8',
      style: { fontFamily: 'system-ui, sans-serif' },
    },
    React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-lg shadow p-8' },
        React.createElement(
          'h1',
          {
            className: 'text-3xl font-bold mb-4',
            style: { color: '#1f2937' },
          },
          'Editor de Quiz - Funcionando'
        ),
        React.createElement(
          'p',
          {
            className: 'text-gray-600 mb-8',
          },
          'Sistema temporário enquanto resolvemos problemas de configuração TypeScript'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
          ...Array.from({ length: 21 }, (_, i) =>
            React.createElement(
              'div',
              {
                key: i + 1,
                className: 'border border-gray-200 rounded p-4 hover:bg-gray-50 cursor-pointer',
                style: { transition: 'all 0.2s' },
              },
              React.createElement(
                'div',
                {
                  className: 'font-semibold text-gray-800 mb-2',
                },
                `Etapa ${i + 1}`
              ),
              React.createElement(
                'div',
                {
                  className: 'text-sm text-gray-600',
                },
                i === 0 ? 'Introdução' : i === 20 ? 'Resultado' : `Pergunta ${i}`
              )
            )
          )
        )
      )
    )
  );
}
