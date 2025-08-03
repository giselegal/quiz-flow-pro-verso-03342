
import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const FunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Funis</h1>
          <Button onClick={() => setLocation('/editor')}>
            Criar Novo Funil
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Nenhum funil encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro funil de conversão
            </p>
            <Button onClick={() => setLocation('/editor')}>
              Criar Primeiro Funil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelsPage;
