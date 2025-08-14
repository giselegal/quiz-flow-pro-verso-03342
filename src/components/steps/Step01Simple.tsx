import React, { useState, useEffect } from 'react';

interface Props {
  sessionId: string;
  onNext: () => void;
}

const Step01Simple: React.FC<Props> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Validate name input (minimum 2 characters)
  useEffect(() => {
    const isValid = name.trim().length >= 2;
    setIsButtonEnabled(isValid);

    // Dispatch custom event for compatibility with existing validation system
    window.dispatchEvent(
      new CustomEvent('quiz-input-change', {
        detail: { 
          blockId: 'intro-form-input', 
          value: name.trim(), 
          valid: isValid 
        },
      })
    );
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNext = () => {
    if (isButtonEnabled) {
      console.log('✅ [Step01Simple] Navegando para próxima etapa com nome:', name.trim());
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#432818] mb-6">Quiz de Estilo Pessoal</h1>

          <p className="text-xl text-[#6B4F43] mb-12">Descubra seu estilo único em 21 etapas</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
              style={{ width: '4.76%' }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card A - Clássico */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Clássico</h3>
              <p className="text-sm text-[#6B4F43]">Elegante e atemporal</p>
            </div>

            {/* Card B - Romântico */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Romântico</h3>
              <p className="text-sm text-[#6B4F43]">Delicado e feminino</p>
            </div>

            {/* Card C - Moderno */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Moderno</h3>
              <p className="text-sm text-[#6B4F43]">Contemporâneo e clean</p>
            </div>

            {/* Card D - Boho */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Boho</h3>
              <p className="text-sm text-[#6B4F43]">Livre e descontraído</p>
            </div>

            {/* Card E - Casual */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Casual</h3>
              <p className="text-sm text-[#6B4F43]">Confortável e prático</p>
            </div>

            {/* Card F - Dramático */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Dramático</h3>
              <p className="text-sm text-[#6B4F43]">Marcante e impactante</p>
            </div>

            {/* Card G - Criativo */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Criativo</h3>
              <p className="text-sm text-[#6B4F43]">Único e expressivo</p>
            </div>

            {/* Card H - Natural */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h3 className="text-lg font-semibold text-[#432818] mb-2">Natural</h3>
              <p className="text-sm text-[#6B4F43]">Autêntico e espontâneo</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-[#432818] mb-4">
              Bem-vindo ao seu Quiz de Estilo!
            </h2>
            <p className="text-[#6B4F43] mb-6">
              Vamos descobrir juntos qual dos 8 estilos de personalidade combina mais com você. Este
              quiz foi desenvolvido para te ajudar a entender seu estilo único através de uma
              jornada de autoconhecimento.
            </p>

            {/* Form input for name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#432818] mb-2">
                Como posso te chamar?
                <span className="text-[#B89B7A] ml-1">*</span>
              </label>
              <input
                id="intro-form-input"
                type="text"
                placeholder="Digite seu primeiro nome aqui..."
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 border-2 border-[#B89B7A] rounded-lg focus:ring-2 focus:ring-[#B89B7A] focus:border-[#B89B7A] outline-none transition-all bg-white text-[#432818]"
              />
            </div>

            <div className="flex justify-center">
              <button
                id="intro-cta-button"
                onClick={handleNext}
                disabled={!isButtonEnabled}
                className={`px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 ${
                  isButtonEnabled
                    ? 'bg-[#B89B7A] text-white hover:bg-[#432818] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                {isButtonEnabled 
                  ? 'Quero Descobrir meu Estilo Agora!' 
                  : 'Digite seu nome para continuar'
                }
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">Etapa 1 de 21 • 4,76% concluído</div>
        </div>
      </div>
    </div>
  );
};

export default Step01Simple;
