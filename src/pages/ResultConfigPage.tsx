import React from "react";
import { Button } from "@/components/ui/button";

export const ResultConfigPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuração de Resultados
          </h1>
          <Button>Adicionar Resultado</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Nenhum resultado configurado
            </h2>
            <p className="text-gray-600 mb-6">
              Configure os resultados que serão exibidos após completar o quiz
            </p>
            <Button>Configurar Primeiro Resultado</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
