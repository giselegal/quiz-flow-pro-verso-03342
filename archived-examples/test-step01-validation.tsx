// 🧪 TESTE DE VALIDAÇÃO STEP01
// Componente para testar sistema de validação de botão por nome

import React from 'react';
import { Step01ValidationProvider } from './src/hooks/useStep01Validation';

// Mock dos componentes para teste
const MockFormInput = ({ id }: { id: string }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valid = value.trim().length >= 2;

    window.dispatchEvent(
      new CustomEvent('quiz-input-change', {
        detail: { blockId: id, value: value.trim(), valid },
      })
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2">NOME *</label>
      <input
        type="text"
        placeholder="Digite seu nome"
        onChange={handleInputChange}
        className="w-full px-4 py-3 border-2 border-[#B89B7A] rounded-lg focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-50"
      />
    </div>
  );
};

const MockButton = ({ id }: { id: string }) => {
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [text, setText] = React.useState('Digite seu nome para continuar');

  React.useEffect(() => {
    const handleButtonStateChange = (event: CustomEvent) => {
      const { buttonId, enabled } = event.detail;

      if (buttonId === id) {
        setIsDisabled(!enabled);
        setText(enabled ? 'Quero Descobrir Meu Estilo!' : 'Digite seu nome para continuar');
      }
    };

    window.addEventListener('step01-button-state-change', handleButtonStateChange as EventListener);

    return () => {
      window.removeEventListener(
        'step01-button-state-change',
        handleButtonStateChange as EventListener
      );
    };
  }, [id]);

  const handleClick = () => {
    if (!isDisabled) {
      alert('🎉 Botão funcionou! Quiz pode prosseguir.');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        w-full py-4 px-8 text-lg font-bold rounded-lg transition-all duration-300
        ${
          isDisabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
            : 'bg-[#B89B7A] text-white hover:bg-[#aa6b5d] hover:shadow-xl'
        }
      `}
    >
      {text}
    </button>
  );
};

const TestStep01Validation = () => {
  return (
    <Step01ValidationProvider>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#432818]">
          🧪 Teste de Validação Step01
        </h2>

        <div className="space-y-4">
          <MockFormInput id="name-input-modular" />
          <MockButton id="cta-button-modular" />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Como testar:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Digite seu nome no campo acima</li>
            <li>2. O botão deve ficar habilitado após 2+ caracteres</li>
            <li>3. Limpe o campo e veja o botão ser desabilitado</li>
            <li>4. Botão habilitado permite clique e mostra alerta</li>
          </ol>
        </div>
      </div>
    </Step01ValidationProvider>
  );
};

export default TestStep01Validation;
