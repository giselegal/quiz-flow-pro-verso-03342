import React from 'react';
import { ModularResultEditor, ModularResultHeaderBlock, ResponsivePreview } from '../src/components/editor/modules';

// Página de demonstração do sistema modular
export const ModularResultDemo: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold p-8 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white text-center">
                🧩 Sistema Modular de Resultado - Demonstração
            </h1>

            {/* Editor completo */}
            <ModularResultEditor />

            {/* Preview responsivo do componente integrado
      <ResponsivePreview>
        <ModularResultHeaderBlock 
          block={{
            properties: {
              containerLayout: 'two-column',
              backgroundColor: '#fafafa',
              userName: 'Maria Silva'
            }
          }}
          isSelected={false}
          onPropertyChange={(key, value) => console.log('Property changed:', key, value)}
        />
      </ResponsivePreview>
      */}
        </div>
    );
};

export default ModularResultDemo;