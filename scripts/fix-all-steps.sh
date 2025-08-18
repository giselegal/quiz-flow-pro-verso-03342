#!/bin/bash

# Script para corrigir todos os componentes Step em lote

echo "🔧 Corrigindo todos os componentes Step..."

cd /workspaces/quiz-quest-challenge-verse

# Para cada step de 01 a 21
for i in {1..21}; do
    step_id=$(printf "%02d" $i)
    file_path="src/components/steps/Step${step_id}Template.tsx"
    
    if [ -f "$file_path" ]; then
        echo "✅ Corrigindo Step${step_id}Template.tsx"
        
        # Cria o conteúdo correto
        cat > "$file_path" << EOF
import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP ${step_id} - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-${step_id}.json que inclui o header otimizado.
 */
export const Step${step_id}Template: React.FC = () => {
  return (
    <TemplateRenderer 
      stepNumber={${i}}
      sessionId="demo"
    />
  );
};

export default Step${step_id}Template;
EOF
    else
        echo "⚠️  Step${step_id}Template.tsx não encontrado"
    fi
done

echo "🎉 Todos os componentes Step foram corrigidos!"
