import React from 'react';

interface Props {
  sessionId: string;
  onNext: () => void;
}

const Step01Simple: React.FC<Props> = ({ onNext }) => {
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
            <div className="flex justify-center">
              <button
                onClick={onNext}
                className="px-8 py-4 bg-[#B89B7A] text-white text-lg font-medium rounded-lg hover:bg-[#432818] transition-colors"
              >
                Começar Quiz
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
