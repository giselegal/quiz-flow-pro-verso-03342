import React from "react";
import { useRoute } from "wouter";

const ResultPage: React.FC = () => {
  const [match, params] = useRoute("/resultado/:resultId");
  const resultId = params?.resultId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Página de Resultado</h1>
        <p className="text-gray-600 mb-4">Resultado ID: {resultId}</p>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Seu Resultado</h2>
          <p className="text-gray-700">
            Esta é uma página de resultado de exemplo. O conteúdo seria carregado baseado no ID:{" "}
            {resultId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
