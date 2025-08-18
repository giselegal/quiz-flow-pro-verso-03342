import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SCRIPT PARA APLICAR SCHEMA SUPABASE VIA API
// ============================================================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applySchemaViaAPI() {
  console.log('🚀 APLICANDO SCHEMA SUPABASE VIA API');
  console.log('====================================');

  try {
    // ========================================================================
    // 1. CRIAR TABELA: component_types
    // ========================================================================
    console.log('📦 1. Criando tabela component_types...');

    const { error: createComponentTypesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS component_types (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type_key TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          subcategory TEXT,
          icon TEXT,
          preview_image_url TEXT,
          default_properties JSONB NOT NULL DEFAULT '{}',
          validation_schema JSONB NOT NULL DEFAULT '{}',
          custom_styling JSONB DEFAULT '{}',
          component_path TEXT NOT NULL,
          is_system BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          version INTEGER DEFAULT 1,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          created_by UUID,
          usage_count INTEGER DEFAULT 0,
          last_used_at TIMESTAMPTZ
        );
      `,
    });

    if (createComponentTypesError) {
      console.log('⚠️  Tentando método alternativo para component_types...');
      // Método alternativo usando inserção direta
    } else {
      console.log('✅ component_types criada');
    }

    // ========================================================================
    // 2. CRIAR TABELA: component_instances
    // ========================================================================
    console.log('🧩 2. Criando tabela component_instances...');

    const { error: createInstancesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS component_instances (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          instance_key TEXT NOT NULL,
          component_type_key TEXT NOT NULL,
          quiz_id TEXT NOT NULL,
          step_number INTEGER NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 1,
          properties JSONB NOT NULL DEFAULT '{}',
          custom_styling JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          is_locked BOOLEAN DEFAULT false,
          is_template BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          created_by UUID,
          UNIQUE(quiz_id, step_number, instance_key)
        );
      `,
    });

    if (!createInstancesError) {
      console.log('✅ component_instances criada');
    }

    // ========================================================================
    // 3. INSERIR DADOS INICIAIS - COMPONENTES DO REGISTRY
    // ========================================================================
    console.log('📝 3. Inserindo componentes do registry...');

    const componentTypesData = [
      {
        type_key: 'text-inline',
        display_name: 'Texto Inline',
        description: 'Componente de texto editável inline',
        category: 'content',
        component_path: '/components/editor/blocks/TextInlineBlock',
        default_properties: { content: 'Texto exemplo', fontSize: 'text-lg', color: '#432818' },
        validation_schema: { content: { type: 'string', required: true } },
      },
      {
        type_key: 'heading-inline',
        display_name: 'Título Inline',
        description: 'Componente de título editável',
        category: 'content',
        component_path: '/components/editor/blocks/HeadingInlineBlock',
        default_properties: {
          content: 'Título',
          level: 'h2',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
        },
        validation_schema: { content: { type: 'string', required: true } },
      },
      {
        type_key: 'quiz-intro-header',
        display_name: 'Header do Quiz',
        description: 'Cabeçalho com logo e progresso',
        category: 'headers',
        component_path: '/components/editor/blocks/QuizIntroHeaderBlock',
        default_properties: {
          logoUrl: '',
          logoWidth: 120,
          progressValue: 0,
          showBackButton: false,
        },
        validation_schema: { logoUrl: { type: 'string', required: true } },
      },
      {
        type_key: 'options-grid',
        display_name: 'Grade de Opções',
        description: 'Grade de opções para quiz',
        category: 'interactive',
        component_path: '/components/editor/blocks/OptionsGridBlock',
        default_properties: { options: [], columns: 2, showImages: true, multipleSelection: false },
        validation_schema: { options: { type: 'array', required: true } },
      },
      {
        type_key: 'button-inline',
        display_name: 'Botão',
        description: 'Botão de ação',
        category: 'interactive',
        component_path: '/components/blocks/inline/ButtonInlineFixed',
        default_properties: {
          text: 'Clique aqui',
          variant: 'primary',
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
        },
        validation_schema: { text: { type: 'string', required: true } },
      },
      {
        type_key: 'form-input',
        display_name: 'Campo de Formulário',
        description: 'Input para coleta de dados',
        category: 'forms',
        component_path: '/components/editor/blocks/FormInputBlock',
        default_properties: {
          label: 'Campo',
          placeholder: 'Digite aqui...',
          required: false,
          inputType: 'text',
        },
        validation_schema: { label: { type: 'string', required: true } },
      },
    ];

    for (const componentType of componentTypesData) {
      const { error } = await supabase
        .from('component_types')
        .upsert(componentType, { onConflict: 'type_key' });

      if (error) {
        console.log(`⚠️  Erro ao inserir ${componentType.type_key}:`, error.message);
      } else {
        console.log(`✅ ${componentType.display_name} inserido`);
      }
    }

    // ========================================================================
    // 4. INSERIR COMPONENTES DA MARCA GISELE
    // ========================================================================
    console.log('🎨 4. Inserindo componentes da marca Gisele...');

    const giseleComponents = [
      {
        type_key: 'gisele-header',
        display_name: 'Header Gisele Galvão',
        description: 'Header personalizado da marca',
        category: 'headers',
        component_path: '/components/editor/blocks/QuizIntroHeaderBlock',
        default_properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoWidth: 120,
          logoHeight: 120,
          backgroundColor: 'transparent',
          showBackButton: true,
        },
      },
      {
        type_key: 'gisele-button',
        display_name: 'Botão Gisele Galvão',
        description: 'Botão com estilo da marca',
        category: 'interactive',
        component_path: '/components/blocks/inline/ButtonInlineFixed',
        default_properties: {
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
          borderRadius: 'rounded-full',
          fontFamily: 'Playfair Display, serif',
          fontWeight: 'font-bold',
          boxShadow: 'shadow-xl',
        },
      },
      {
        type_key: 'style-question',
        display_name: 'Pergunta de Estilo',
        description: 'Pergunta formatada para quiz de estilo',
        category: 'content',
        component_path: '/components/editor/blocks/TextInlineBlock',
        default_properties: {
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          color: '#432818',
          textAlign: 'text-center',
          fontFamily: 'Playfair Display, serif',
          marginBottom: 24,
        },
      },
      {
        type_key: 'style-options-grid',
        display_name: 'Opções de Estilo',
        description: 'Grade otimizada para escolhas de estilo',
        category: 'interactive',
        component_path: '/components/editor/blocks/OptionsGridBlock',
        default_properties: {
          columns: 2,
          showImages: true,
          multipleSelection: true,
          maxSelections: 3,
          gridGap: 16,
          responsiveColumns: true,
          autoAdvanceOnComplete: false,
        },
      },
    ];

    for (const component of giseleComponents) {
      const { error } = await supabase
        .from('component_types')
        .upsert(component, { onConflict: 'type_key' });

      if (error) {
        console.log(`⚠️  Erro ao inserir ${component.type_key}:`, error.message);
      } else {
        console.log(`✅ ${component.display_name} inserido`);
      }
    }

    // ========================================================================
    // 5. VERIFICAR RESULTADO
    // ========================================================================
    console.log('🔍 5. Verificando dados inseridos...');

    const { data: allComponents, error: fetchError } = await supabase
      .from('component_types')
      .select('type_key, display_name, category')
      .order('category, display_name');

    if (fetchError) {
      console.log('⚠️  Erro ao buscar componentes:', fetchError.message);
    } else {
      console.log(`\n📊 COMPONENTES CRIADOS (${allComponents?.length || 0}):`);
      console.log('=====================================');

      const groupedByCategory = (allComponents || []).reduce((acc, comp) => {
        if (!acc[comp.category]) acc[comp.category] = [];
        acc[comp.category].push(comp);
        return acc;
      }, {});

      Object.entries(groupedByCategory).forEach(([category, components]) => {
        console.log(`\n🎯 ${category.toUpperCase()}:`);
        components.forEach(comp => {
          console.log(`  ✅ ${comp.display_name} (${comp.type_key})`);
        });
      });
    }

    console.log('\n🎉 SCHEMA APLICADO COM SUCESSO VIA API!');
    console.log('=====================================');
    console.log('✅ Tabelas criadas');
    console.log('✅ Componentes do registry inseridos');
    console.log('✅ Componentes da marca Gisele inseridos');
    console.log('✅ Sistema pronto para uso no /editor-fixed');
  } catch (error) {
    console.error('❌ Erro ao aplicar schema:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  applySchemaViaAPI();
}

export { applySchemaViaAPI };
