import React, { useState } from 'react';

interface NameCollectionStepProps {
  onContinue?: () => void;
  currentName?: string;
  onNameChange: (name: string) => void;
}

/**
 * 🎯 STEP 1: COLETA DE NOME
 * Página inicial para coletar o nome do usuário
 */
export const NameCollectionStep: React.FC<NameCollectionStepProps> = ({
  onContinue,
  currentName,
  onNameChange
}) => {
  const [inputValue, setInputValue] = useState(currentName || '');
  const [isValid, setIsValid] = useState(!!currentName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const valid = value.trim().length >= 2;
    setIsValid(valid);
    
    if (valid) {
      onNameChange(value.trim());
    }
  };

  const handleContinue = () => {
    if (isValid && onContinue) {
      onContinue();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Logo Header */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500" 
              style={{ width: '5%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          
          {/* Main Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#432818] leading-tight">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#B89B7A] leading-relaxed">
            Descubra seu estilo predominante e transforme seu guarda-roupa
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-700 leading-relaxed max-w-xl mx-auto">
            Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.
          </p>

          {/* Name Input Section */}
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-left">
              <label 
                htmlFor="name-input" 
                className="block text-lg font-semibold text-[#432818] mb-3"
              >
                NOME
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="Digite seu nome"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 text-lg border-2 border-[#B89B7A] rounded-lg focus:outline-none focus:border-[#432818] focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-20 transition-all"
                autoFocus
              />
              {inputValue && !isValid && (
                <p className="text-red-500 text-sm mt-2">
                  Digite um nome válido (mínimo 2 caracteres)
                </p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`
                w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200
                ${isValid 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#432818] cursor-pointer shadow-lg hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isValid ? 'Quero Descobrir meu Estilo Agora!' : 'Digite seu nome para continuar'}
            </button>
          </div>

          {/* Legal Notice */}
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-gray-400">
          2025 - Gisele Galvão - Todos os direitos reservados
        </p>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border">
          <div><strong>Name Step Debug</strong></div>
          <div>Input: "{inputValue}"</div>
          <div>Valid: {isValid ? 'Yes' : 'No'}</div>
          <div>Current: "{currentName}"</div>
        </div>
      )}
    </div>
  );
};