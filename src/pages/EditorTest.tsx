import React from 'react';

const EditorTest: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">🎨 Editor Unificado V2 - Teste</h1>
        <p className="text-xl text-muted-foreground mb-4">PRIORIDADE 2: Sistema Funcionando!</p>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm">Rota: /editor-test</p>
          <p className="text-sm">Status: ✅ Funcional</p>
        </div>
      </div>
    </div>
  );
};

export default EditorTest;
