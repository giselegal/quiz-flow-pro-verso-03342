/**
 * 🏗️ BUILDER EXAMPLES - Exemplos de uso do sistema de builders
 * 
 * Demonstrações práticas de como usar os builders para criar
 * componentes, funis e layouts otimizados.
 */

import {
  ComponentBuilder,
  FunnelBuilder,
  UIBuilder,
  createQuizQuestion,
  createLeadCapture,
  createFunnelFromTemplate,
  createQuizLayout,
  validateComponent,
  fromTemplate
} from './index';

// ✨ EXEMPLO 1: Criando um componente simples
export function exemploComponenteSimples() {
  const pergunta = createQuizQuestion()
    .withProperty('questionType', 'single-choice')
    .withProperty('required', true)
    .withContentField('question', 'Qual sua cor favorita?')
    .withContentField('options', ['Azul', 'Verde', 'Vermelho', 'Amarelo'])
    .withProperty('showProgress', true)
    .build();

  console.log('✅ Componente criado:', pergunta.component);
  return pergunta;
}

// ✨ EXEMPLO 2: Usando templates de componente
export function exemploTemplateComponente() {
  const capturaEmail = fromTemplate('email-capture')
    .withContentField('title', 'Receba o resultado do seu quiz!')
    .withContentField('subtitle', 'Digite seu email para ver a análise completa')
    .withProperty('required', true)
    .withProperty('validateEmail', true)
    .build();

  if (capturaEmail.validation.isValid) {
    console.log('✅ Template aplicado com sucesso');
    return capturaEmail.component;
  } else {
    console.error('❌ Erros no template:', capturaEmail.validation.errors);
  }
}

// ✨ EXEMPLO 3: Criando um funil completo
export function exemploFunilCompleto() {
  const funil = new FunnelBuilder('Quiz de Personalidade')
    .withDescription('Descubra seu tipo de personalidade em 5 minutos')
    .withTheme('modern-blue')
    
    // Etapa 1: Boas-vindas
    .addStep('Introdução')
      .addComponentFromTemplate('hero-section')
      .withMetadata({ estimatedTime: 30 })
      .complete()
    
    // Etapa 2: Perguntas básicas
    .addStep('Perguntas Básicas')
      .addComponent(createQuizQuestion()
        .withContentField('question', 'Como você se sente em festas?')
        .withContentField('options', ['Energizado', 'Neutro', 'Drenado']))
      .addComponent(createQuizQuestion()
        .withContentField('question', 'Você prefere planejar ou improvisar?')
        .withContentField('options', ['Planejar sempre', 'Meio termo', 'Improvisar']))
      .withMetadata({ estimatedTime: 60 })
      .complete()
    
    // Etapa 3: Captura de dados
    .addStep('Seus Dados')
      .addComponent(createLeadCapture()
        .withContentField('title', 'Quase lá!')
        .withContentField('subtitle', 'Informe seus dados para receber o resultado')
        .withProperty('fields', ['name', 'email']))
      .withMetadata({ estimatedTime: 45 })
      .complete()
    
    // Conectar etapas automaticamente
    .autoConnect()
    
    // Otimizar o funil
    .optimize()
    
    .build();

  console.log('✅ Funil criado com', funil.steps.length, 'etapas');
  return funil;
}

// ✨ EXEMPLO 4: Layout responsivo personalizado
export function exemploLayoutPersonalizado() {
  const layout = new UIBuilder('Layout Quiz Moderno', 'single-column')
    .withTheme('modern-blue')
    .withGrid({
      columns: 1,
      gap: '2rem',
      padding: '1rem',
      maxWidth: '600px'
    })
    .withBreakpoints({
      mobile: 480,
      tablet: 768,
      desktop: 1024
    })
    
    // Adicionar animações
    .withEntranceAnimation('fade', 400)
    .withScrollAnimations()
    
    // Configurar acessibilidade
    .withAccessibility({
      focusVisible: true,
      reducedMotion: true,
      keyboard: { navigation: true, shortcuts: [] }
    })
    
    // Otimizar para mobile
    .optimizeForMobile()
    
    .build();

  const css = new UIBuilder('', 'single-column').generateCSS();
  
  console.log('✅ Layout criado com tema:', layout.theme.name);
  console.log('📱 CSS gerado:', css.length, 'caracteres');
  
  return { layout, css };
}

// ✨ EXEMPLO 5: Usando template de funil
export function exemploTemplateFunil() {
  const funil = createFunnelFromTemplate('lead-qualification')
    .withDescription('Identifique leads qualificados para serviços de consultoria')
    .withSettings({
      allowBackward: true,
      showProgress: true,
      progressStyle: 'bar',
      saveProgress: true
    })
    .withAnalytics({
      trackingEnabled: true,
      events: ['step_start', 'step_complete', 'lead_qualified', 'funnel_complete'],
      goals: [
        {
          id: 'qualification_rate',
          name: 'Taxa de Qualificação',
          type: 'conversion',
          triggerCondition: { type: 'lead_qualified' }
        }
      ]
    })
    .autoConnect()
    .optimize()
    .build();

  console.log('✅ Funil de template criado:', funil.name);
  console.log('📊 Eventos de analytics:', funil.analytics.events);
  
  return funil;
}

// ✨ EXEMPLO 6: Validação avançada
export function exemploValidacao() {
  // Componente com problemas intencionais para demonstrar validação
  const componenteProblematico = new ComponentBuilder('quiz-question')
    .withProperty('questionType', 'invalid-type') // Tipo inválido
    .withProperty('maxSelections', -1) // Valor inválido
    .withContentField('question', '') // Campo obrigatório vazio
    .withContentField('options', []) // Array vazio
    .build();

  console.log('🔍 Validação do componente problemático:');
  console.log('Válido:', componenteProblematico.validation.isValid);
  console.log('Erros:', componenteProblematico.validation.errors);
  console.log('Avisos:', componenteProblematico.validation.warnings);
  console.log('Sugestões:', componenteProblematico.suggestions);
  console.log('Otimizações:', componenteProblematico.optimizations);

  return componenteProblematico;
}

// ✨ EXEMPLO 7: Construção condicional
export function exemploConstrucaoCondicional() {
  const isAdvancedUser = true;
  const theme: 'modern-blue' | 'minimal-gray' = 'modern-blue';

  const builder = new ComponentBuilder('quiz-question')
    .withContentField('question', 'Qual seu nível de experiência?')
    .withContentField('options', ['Iniciante', 'Intermediário', 'Avançado']);

  // Adicionar funcionalidades condicionalmente
  if (isAdvancedUser) {
    builder
      .withProperty('showScoring', true)
      .withProperty('allowCustomAnswers', true)
      .withProperty('timeLimit', 60);
  }

  // Aplicar tema baseado na preferência
  switch (theme) {
    case 'modern-blue':
      builder.withStyle({
        primaryColor: '#3b82f6',
        borderRadius: '8px'
      });
      break;
    case 'minimal-gray':
      builder.withStyle({
        primaryColor: '#6b7280',
        borderRadius: '4px'
      });
      break;
  }

  const resultado = builder.build();
  
  console.log('✅ Componente construído condicionalmente');
  console.log('Configurações avançadas:', isAdvancedUser ? 'Habilitadas' : 'Desabilitadas');
  
  return resultado.component;
}

// ✨ EXEMPLO 8: Pipeline de construção completo
export function exemploPipelineCompleto() {
  console.log('🚀 Iniciando pipeline de construção completo...');

  // 1. Criar componentes
  const components = [
    fromTemplate('hero-section')
      .withContentField('title', 'Descubra seu Perfil Profissional')
      .withContentField('subtitle', 'Um quiz rápido para identificar suas características')
      .build().component,
      
    createQuizQuestion()
      .withContentField('question', 'Você prefere trabalhar:')
      .withContentField('options', ['Em equipe', 'Sozinho', 'Depende da situação'])
      .build().component,
      
    createLeadCapture()
      .withContentField('title', 'Receba seu perfil completo')
      .withProperty('fields', ['name', 'email', 'company'])
      .build().component
  ];

  // 2. Validar todos os componentes
  const validationResults = components.map(validateComponent);
  const allValid = validationResults.every(result => result.isValid);
  
  console.log('✅ Validação dos componentes:', allValid ? 'Passou' : 'Falhou');

  // 3. Criar funil com os componentes
  const funil = new FunnelBuilder('Pipeline Profissional')
    .addStep('Introdução').complete()
    .addStep('Avaliação').complete()
    .addStep('Dados de Contato').complete()
    .autoConnect()
    .optimize()
    .build();

  // 4. Criar layout otimizado
  const layout = createQuizLayout('Layout Pipeline')
    .withTheme('modern-blue')
    .withFullAccessibility()
    .optimize()
    .build();

  // 5. Gerar CSS final
  const css = new UIBuilder('', 'single-column').generateCSS();

  console.log('🎉 Pipeline completo finalizado!');
  console.log(`📋 ${components.length} componentes criados`);
  console.log(`🔄 ${funil.steps.length} etapas no funil`);
  console.log(`🎨 ${css.length} caracteres de CSS gerado`);

  return {
    components,
    funil,
    layout,
    css,
    isValid: allValid
  };
}

// ✨ EXEMPLO 9: Customização avançada com hooks
export function exemploCustomizacaoAvancada() {
  const builder = new ComponentBuilder('quiz-question')
    .withContentField('question', 'Como você toma decisões importantes?')
    .withContentField('options', [
      'Analiso dados detalhadamente',
      'Confio na intuição',
      'Consulto outras pessoas',
      'Combino análise e intuição'
    ]);

  // Hook personalizado para validação extra
  const originalBuild = builder.build.bind(builder);
  builder.build = function() {
    const result = originalBuild();
    
    // Validação customizada
    if (result.component.content?.options?.length < 3) {
      result.validation.warnings.push({
        field: 'options',
        message: 'Perguntas com poucas opções podem ter baixo engajamento',
        suggestion: 'Considere adicionar mais opções de resposta'
      });
    }
    
    return result;
  };

  const resultado = builder.build();
  
  console.log('🔧 Validação customizada aplicada');
  console.log('Avisos extras:', resultado.validation.warnings.length);
  
  return resultado;
}

// ✨ EXEMPLO 10: Integração com dados externos
export async function exemploIntegracaoDados() {
  console.log('🌐 Simulando integração com dados externos...');

  // Simular dados vindos de uma API
  const dadosExternos = {
    perguntas: [
      {
        id: 1,
        texto: 'Qual sua experiência com programação?',
        opcoes: ['Nenhuma', 'Básica', 'Intermediária', 'Avançada']
      },
      {
        id: 2,
        texto: 'Quantas horas por dia você programa?',
        opcoes: ['0-2h', '2-4h', '4-8h', '8+h']
      }
    ],
    configuracao: {
      tema: 'modern-blue',
      mostrarProgresso: true,
      permitirVoltar: false
    }
  };

  // Construir funil baseado nos dados externos
  const funnelBuilder = new FunnelBuilder('Quiz de Programação')
    .withDescription('Avalie seu nível de programação')
    .withTheme(dadosExternos.configuracao.tema)
    .withSettings({
      showProgress: dadosExternos.configuracao.mostrarProgresso,
      allowBackward: dadosExternos.configuracao.permitirVoltar
    });

  // Adicionar etapa introdutória
  funnelBuilder.addStep('Introdução')
    .addComponentFromTemplate('hero-section')
    .complete();

  // Criar componentes para cada pergunta dos dados externos
  dadosExternos.perguntas.forEach((pergunta, index) => {
    funnelBuilder.addStep(`Pergunta ${index + 1}`)
      .addComponent(
        createQuizQuestion()
          .withContentField('question', pergunta.texto)
          .withContentField('options', pergunta.opcoes)
          .withProperty('required', true)
      )
      .complete();
  });

  // Finalizar com captura de dados
  funnelBuilder.addStep('Finalização')
    .addComponent(
      createLeadCapture()
        .withContentField('title', 'Veja seus resultados!')
        .withProperty('fields', ['email'])
    )
    .complete();

  const funil = funnelBuilder
    .autoConnect()
    .optimize()
    .build();

  console.log('✅ Funil criado a partir de dados externos');
  console.log(`📊 ${dadosExternos.perguntas.length} perguntas processadas`);
  console.log(`🔄 ${funil.steps.length} etapas criadas`);

  return funil;
}

// ✨ EXPORTAR TODOS OS EXEMPLOS
export const BUILDER_EXAMPLES = {
  exemploComponenteSimples,
  exemploTemplateComponente,
  exemploFunilCompleto,
  exemploLayoutPersonalizado,
  exemploTemplateFunil,
  exemploValidacao,
  exemploConstrucaoCondicional,
  exemploPipelineCompleto,
  exemploCustomizacaoAvancada,
  exemploIntegracaoDados
};

// ✨ EXECUTAR TODOS OS EXEMPLOS
export async function executarTodosOsExemplos() {
  console.log('🚀 Executando todos os exemplos do Builder System...\n');

  try {
    console.log('1️⃣ Exemplo: Componente Simples');
    exemploComponenteSimples();
    console.log('');

    console.log('2️⃣ Exemplo: Template de Componente');
    exemploTemplateComponente();
    console.log('');

    console.log('3️⃣ Exemplo: Funil Completo');
    exemploFunilCompleto();
    console.log('');

    console.log('4️⃣ Exemplo: Layout Personalizado');
    exemploLayoutPersonalizado();
    console.log('');

    console.log('5️⃣ Exemplo: Template de Funil');
    exemploTemplateFunil();
    console.log('');

    console.log('6️⃣ Exemplo: Validação Avançada');
    exemploValidacao();
    console.log('');

    console.log('7️⃣ Exemplo: Construção Condicional');
    exemploConstrucaoCondicional();
    console.log('');

    console.log('8️⃣ Exemplo: Pipeline Completo');
    exemploPipelineCompleto();
    console.log('');

    console.log('9️⃣ Exemplo: Customização Avançada');
    exemploCustomizacaoAvancada();
    console.log('');

    console.log('🔟 Exemplo: Integração com Dados Externos');
    await exemploIntegracaoDados();
    console.log('');

    console.log('🎉 Todos os exemplos executados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao executar exemplos:', error);
  }
}

export default BUILDER_EXAMPLES;
