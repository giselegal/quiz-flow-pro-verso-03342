import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';

const EditorNotFoundPage = () => {
  const [, setLocation] = useLocation();

  const handleRetry = () => {
    // Tenta recarregar a página do editor
    setLocation('/editor');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#432818]">404</h1>
        <p className="text-xl mb-4 text-[#8F7A6A]">Página não encontrada</p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 text-left">
          <h2 className="font-medium text-amber-800 mb-2">Possíveis soluções:</h2>
          <ul className="list-disc pl-5 text-amber-700 space-y-1 text-sm">
            <li>Verifique se você está logado no sistema</li>
            <li>Limpe o cache do navegador e tente novamente</li>
            <li>Verifique sua conexão com a internet</li>
            <li>Se o problema persistir, entre em contato com o suporte</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            className="bg-[#B89B7A] hover:bg-[#9F836A] text-white" 
            onClick={handleRetry}
          >
            Tentar novamente
          </Button>
          
          <Link to="/admin">
            <Button variant="outline" className="border-[#B89B7A] text-[#B89B7A]">
              Voltar para o painel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditorNotFoundPage;