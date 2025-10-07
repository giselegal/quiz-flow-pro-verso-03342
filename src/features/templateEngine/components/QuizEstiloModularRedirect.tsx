import React, { useEffect } from 'react';
import { useTemplatesList, useCreateTemplate } from '../api/hooks';

/**
 * Redireciona automaticamente para o editor modular 4 colunas carregando (ou criando) um template com slug 'quiz-estilo'.
 * Uso: rota /editor/quiz-estilo-modular
 */
export const QuizEstiloModularRedirect: React.FC = () => {
  const { data, isLoading, error } = useTemplatesList();
  const createMut = useCreateTemplate();

  useEffect(() => {
    if (isLoading || createMut.isPending) return;
    if (error) return; // deixamos UI mostrar
    const existing = (data || []).find(t => t.slug === 'quiz-estilo');
    if (existing) {
      // Redireciona para rota direta que já abre o layout 4 colunas
      window.location.replace(`/template-engine/${existing.id}`);
      return;
    }
    // Criar template base
    createMut.mutate({ name: 'Quiz Estilo', slug: 'quiz-estilo' }, {
      onSuccess: (res: any) => {
        window.location.replace(`/template-engine/${res.id}`);
      }
    });
  }, [isLoading, data, error, createMut.isPending]);

  return (
    <div className="max-w-md mx-auto p-8 text-sm space-y-4">
      <h1 className="text-lg font-semibold">Carregando Editor Modular (quiz-estilo)</h1>
      {isLoading && <p>Buscando templates existentes...</p>}
      {createMut.isPending && <p>Criando template base 'quiz-estilo'...</p>}
      {error && (
        <div className="text-red-600 text-xs">
          Falha ao buscar lista de templates.<br />
          {(error as Error).message}
          {/(Unexpected non-JSON)/.test((error as Error).message) && (
            <div className="mt-2 bg-red-50 border border-red-200 p-2 rounded">
              Backend não respondeu JSON. Execute:
              <pre className="mt-1 bg-white p-2 rounded border text-[10px] whitespace-pre">npm run dev:server</pre>
              e recarregue.
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-600">Você será redirecionado automaticamente assim que o template estiver pronto.</p>
    </div>
  );
};

export default QuizEstiloModularRedirect;
