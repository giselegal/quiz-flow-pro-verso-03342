// src/pages/Quiz.tsx
// Página dedicada para o quiz usando a nova configuração modular

import React from "react";
import { QuizRenderer } from "@/components/quiz/QuizRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QUIZ_CONFIGURATION } from "@/config/quizConfiguration";

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: QUIZ_CONFIGURATION.design.backgroundColor,
        fontFamily: QUIZ_CONFIGURATION.design.fontFamily 
      }}
    >
      {/* Header do Quiz */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Botão Voltar */}
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {/* Logo/Título do Quiz */}
            <div className="text-center">
              <h1 
                className="text-lg font-semibold"
                style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
              >
                {QUIZ_CONFIGURATION.meta.name}
              </h1>
              <p 
                className="text-xs"
                style={{ color: QUIZ_CONFIGURATION.design.primaryColor }}
              >
                {QUIZ_CONFIGURATION.meta.description}
              </p>
            </div>

            {/* Espaço para manter o layout centralizado */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizRenderer />
        </div>
      </main>

      {/* Footer do Quiz */}
      <footer className="mt-16 py-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p 
            className="text-sm"
            style={{ color: QUIZ_CONFIGURATION.design.primaryColor }}
          >
            Versão {QUIZ_CONFIGURATION.meta.version} • Criado por {QUIZ_CONFIGURATION.meta.author}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Quiz;