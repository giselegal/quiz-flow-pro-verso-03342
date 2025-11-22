/**
 * 📚 USAGE EXAMPLES - Wave 3
 * 
 * Exemplos práticos de uso do sistema oficial CaktoQuiz/Inlead.
 * Demonstra integração completa: Types → Registry → Validation → Loading → Rendering.
 * 
 * @version 1.0.0
 * @wave 3
 */

import React from 'react';
import {
  // Types
  type BlockInstance,
  type FunnelTemplate,
  // Registry
  BlockRegistry,
  // Adapters
  adaptLegacyBlock,
  normalizeBlockInstance,
  // Validation
  validateBlockInstance,
  validateFunnelTemplate,
  // Loading
  TemplateLoader,
  // Hooks
  useBlockDefinition,
  useBlockValidation,
} from '@/core/quiz';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * ============================================================================
 * EXEMPLO 1: Acessar BlockRegistry
 * ============================================================================
 */

export function Example1_AccessRegistry() {
  // Obter definição de um bloco
  const definition = BlockRegistry.getDefinition('intro-logo-header');
  
  if (!definition) {
    return <div>Bloco não encontrado</div>;
  }

  return (
    <div>
      <h3>{definition.name}</h3>
      <p>{definition.description}</p>
      <ul>
        {definition.properties.map((prop) => (
          <li key={prop.key}>
            {prop.label} ({prop.type}) - {prop.defaultValue}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ============================================================================
 * EXEMPLO 2: Usar Hook no Editor
 * ============================================================================
 */

export function Example2_UseHooks({ blockType }: { blockType: string }) {
  const definition = useBlockDefinition(blockType);
  
  if (!definition) {
    return <div>Tipo de bloco desconhecido: {blockType}</div>;
  }

  return (
    <div className="block-properties-panel">
      <h4>Propriedades: {definition.name}</h4>
      <div>
        {definition.properties.map((prop) => (
          <div key={prop.key} className="property-field">
            <label>{prop.label}</label>
            {prop.description && <p className="help-text">{prop.description}</p>}
            {/* Renderizar input baseado em prop.type */}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * EXEMPLO 3: Validar Bloco em Tempo Real
 * ============================================================================
 */

export function Example3_ValidateBlock({ instance }: { instance: BlockInstance }) {
  const validation = useBlockValidation(instance);

  return (
    <div className="validation-feedback">
      {validation.hasErrors && (
        <div className="errors">
          <h5>Erros:</h5>
          <ul>
            {validation.errors.map((error, idx) => (
              <li key={idx}>
                {error.property}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <div className="success">✓ Bloco válido</div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * EXEMPLO 4: Adaptar Bloco Legado
 * ============================================================================
 */

export function Example4_AdaptLegacyBlock() {
  // Dados legados do sistema antigo
  const legacyBlockData = {
    id: 'old-block-1',
    type: 'intro-hero', // tipo antigo (alias)
    properties: {
      title: 'Meu Título',
      subtitle: 'Subtítulo aqui',
    },
    order: 1,
  };

  // Adaptar para formato oficial
  const officialBlock = adaptLegacyBlock(legacyBlockData);
  
  appLogger.info('Tipo oficial:', { data: [officialBlock.type] }); // 'intro-logo-header'
  appLogger.info('Propriedades adaptadas:', { data: [officialBlock.properties] });

  // Normalizar (aplicar defaults)
  const normalized = normalizeBlockInstance(officialBlock);

  return (
    <div>
      <p>Tipo legado: {legacyBlockData.type}</p>
      <p>Tipo oficial: {normalized.type}</p>
      <pre>{JSON.stringify(normalized, null, 2)}</pre>
    </div>
  );
}

/**
 * ============================================================================
 * EXEMPLO 5: Carregar e Validar Template
 * ============================================================================
 */

export function Example5_LoadTemplate() {
  const [template, setTemplate] = React.useState<FunnelTemplate | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const loadTemplate = async () => {
    setLoading(true);
    setErrors([]);

    const result = await TemplateLoader.loadTemplate('example-quiz-fashion', {
      source: 'local',
      validate: true,
      strict: false,
    });

    if (result.success && result.template) {
      setTemplate(result.template);
      
      // Validar adicionalmente
      const validation = validateFunnelTemplate(result.template);
      if (!validation.success) {
        setErrors(validation.error.errors.map((e) => e.message));
      }
    } else {
      setErrors(result.errors?.map((e) => e.message) || ['Erro desconhecido']);
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={loadTemplate} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Template'}
      </button>

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, idx) => (
            <p key={idx} className="error">{error}</p>
          ))}
        </div>
      )}

      {template && (
        <div>
          <h3>{template.metadata.name}</h3>
          <p>{template.metadata.description}</p>
          <p>Steps: {template.steps.length}</p>
          <p>Blocos: {template.blocksUsed.length}</p>
        </div>
      )}
    </div>
  );
}
