// @ts-nocheck
import React from 'react';
import Step20Result from '../components/steps/Step20Result';
import { cleanStorageForStep20 } from '../utils/cleanStorage';

/**
 * 🧪 PÁGINA DE TESTE - ETAPA 20 CORRIGIDA
 * 
 * CORREÇÕES APLICADAS:
 * ✅ Componente Step20Result criado
 * ✅ Limpeza automática do localStorage
 * ✅ Fallback robusto para erros
 * ✅ UI consistente com design system
 */
const TestStep20Page: React.FC = () => {
  // Limpeza automática ao carregar a página de teste
  React.useEffect(() => {
    console.log('🧪 [TestStep20Page] Limpando storage para teste...');
    cleanStorageForStep20();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Banner de teste */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <p className="font-medium">🧪 Modo Teste - Etapa 20 | Step20Result Corrigido</p>
      </div>
      
      {/* Componente principal */}
      <Step20Result isPreview={false} />
    </div>
  );
};

export default TestStep20Page;
