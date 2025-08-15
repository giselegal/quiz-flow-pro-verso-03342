'use client';

import React, { useState } from 'react';
import { UserDataProvider } from '@/context/UserDataContext';
import { 
  ModularQuizIntroTemplate,
  HeaderLogoComponent,
  TitleSectionComponent,
  OptimizedImageComponent,
  DescriptionTextComponent,
  NameFormComponent,
  FooterComponent,
  SkipLinkComponent,
  DEFAULT_CONFIG 
} from '@/components/modular';

/**
 * ModularComponentsDemo - Página de demonstração dos componentes modulares
 * 
 * Esta página demonstra:
 * - Uso individual de cada componente
 * - Template completo compositor
 * - Modo de edição ativo/inativo
 * - Configurações personalizadas
 */
const ModularComponentsDemo: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showIndividual, setShowIndividual] = useState(false);

  const handleStartQuiz = (nome: string) => {
    alert(`Quiz iniciado por: ${nome}`);
    console.log('Quiz iniciado por:', nome);
  };

  const handlePropertyChange = (componentId: string, key: string, value: any) => {
    console.log(`Propriedade alterada - ${componentId}.${key}:`, value);
  };

  const customConfig = {
    ...DEFAULT_CONFIG,
    title: {
      ...DEFAULT_CONFIG.title,
      title: "Descubra seu Estilo Único e Transforme sua Aparência!",
      highlightedWordsBefore: ["Descubra"],
      highlightedWordsAfter: ["Único", "Transforme"],
    },
    form: {
      ...DEFAULT_CONFIG.form,
      buttonText: "Começar Minha Transformação!",
    },
  };

  return (
    <UserDataProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Painel de Controle */}
      <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-bold mb-2">🛠️ Painel de Controle</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={(e) => setIsEditMode(e.target.checked)}
            />
            <span>Modo Edição</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showIndividual}
              onChange={(e) => setShowIndividual(e.target.checked)}
            />
            <span>Mostrar Componentes Individuais</span>
          </label>
        </div>
      </div>

      {showIndividual ? (
        // DEMONSTRAÇÃO DE COMPONENTES INDIVIDUAIS
        <div className="pt-20 pb-8 space-y-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Componentes Modulares Individuais
            </h1>
            <p className="text-gray-600">
              Cada componente é independente e editável
            </p>
          </div>

          {/* Skip Link */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. Skip Link (Acessibilidade)</h2>
            <SkipLinkComponent
              target="#demo-form"
              text="Pular para formulário de demo"
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('skipLink', key, value)}
            />
          </section>

          {/* Header Logo */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">2. Header Logo</h2>
            <HeaderLogoComponent
              logoWidth={150}
              showGoldenBar={true}
              goldenBarWidth="400px"
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('header', key, value)}
            />
          </section>

          {/* Title Section */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">3. Title Section</h2>
            <TitleSectionComponent
              title="Componente de Título com Palavras Destacadas em Dourado"
              highlightedWordsBefore={["Componente"]}
              highlightedWordsAfter={["Destacadas", "Dourado"]}
              fontSize="md"
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('title', key, value)}
            />
          </section>

          {/* Optimized Image */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">4. Optimized Image</h2>
            <OptimizedImageComponent
              width={250}
              height={170}
              borderRadius="xl"
              showShadow={true}
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('image', key, value)}
            />
          </section>

          {/* Description Text */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">5. Description Text</h2>
            <DescriptionTextComponent
              description="Este é um exemplo de texto descritivo com frases destacadas que podem ser configuradas individualmente com cores e pesos diferentes."
              highlightedPhrases={[
                { text: "texto descritivo", color: "#B89B7A", fontWeight: "600" },
                { text: "frases destacadas", color: "#432818", fontWeight: "700" },
                { text: "configuradas individualmente", color: "#059669", fontWeight: "500" },
              ]}
              fontSize="lg"
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('description', key, value)}
            />
          </section>

          {/* Name Form */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">6. Name Form (Conectado com Supabase)</h2>
            <div id="demo-form">
              <NameFormComponent
                label="SEU NOME"
                placeholder="Digite aqui seu nome"
                buttonText="Testar Integração!"
                onStart={handleStartQuiz}
                isEditable={isEditMode}
                onPropertyChange={(key, value) => handlePropertyChange('form', key, value)}
              />
            </div>
          </section>

          {/* Footer */}
          <section className="bg-white p-6 m-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">7. Footer</h2>
            <FooterComponent
              companyName="Demonstração Componentes"
              copyrightText="Exemplo de rodapé modular"
              isEditable={isEditMode}
              onPropertyChange={(key, value) => handlePropertyChange('footer', key, value)}
            />
          </section>
        </div>
      ) : (
        // TEMPLATE COMPLETO
        <div className="pt-16">
          <div className="text-center mb-8 bg-white p-4 shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Template Completo Modular
            </h1>
            <p className="text-gray-600">
              Baseado no QuizIntro original, com componentes modulares e editáveis
            </p>
            {isEditMode && (
              <p className="text-blue-600 font-semibold mt-2">
                🛠️ Modo Edição Ativo - Cada componente pode ser editado individualmente
              </p>
            )}
          </div>

          <ModularQuizIntroTemplate
            onStart={handleStartQuiz}
            isEditable={isEditMode}
            onPropertyChange={handlePropertyChange}
            config={customConfig}
          />
        </div>
      )}

      {/* Informações */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg text-sm max-w-xs">
        <p className="font-semibold">💡 Dica:</p>
        <p>
          {isEditMode 
            ? "Modo edição ativo. Componentes mostram controles de edição."
            : "Ative o modo edição para ver controles de personalização."
          }
        </p>
      </div>
    </div>
    </UserDataProvider>
  );
};

export default ModularComponentsDemo;