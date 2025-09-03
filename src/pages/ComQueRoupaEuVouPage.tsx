import React from 'react';
import { QuizFlowProvider } from '@/context/QuizFlowProvider';

/**
 * Página especializada para o quiz "Com que roupa eu vou"
 */
const ComQueRoupaEuVouPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <QuizFlowProvider initialStep={1} totalSteps={21}>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Com que roupa eu vou?</h1>
          
          <div className="text-center p-8">
            <p className="text-lg mb-4">
              Esta página está em desenvolvimento. Em breve você poderá descobrir seu estilo ideal!
            </p>
            
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Voltar para o início
            </a>
          </div>
        </div>
      </QuizFlowProvider>
    </div>
  );
};

export default ComQueRoupaEuVouPage;