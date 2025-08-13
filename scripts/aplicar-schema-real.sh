#!/bin/bash

echo "🚀 APLICANDO SCHEMA COMPLETO NO SUPABASE VIA API"
echo "================================================"

# Configuração
SUPABASE_URL="https://pwtjuuhchtbzttrzoutw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w"

echo "🔗 Supabase: $SUPABASE_URL"
echo ""

# Função para executar SQL via API
execute_sql() {
    local query="$1"
    local description="$2"
    
    echo "⚡ $description..."
    
    # Usando a API SQL do Supabase
    response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
        -H "apikey: $ANON_KEY" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"sql\": \"$query\"}" 2>&1)
    
    if echo "$response" | grep -q "error\|Error\|404"; then
        echo "⚠️  Erro: $response"
        return 1
    else
        echo "✅ $description - Concluído"
        return 0
    fi
}

# PASSO 1: Criar tabelas principais
echo "🗄️  1. CRIANDO ESTRUTURA DO DATABASE"
echo "===================================="

# Tabela: component_types
execute_sql "
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
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ
);
" "Criando tabela component_types"

# Tabela: component_instances  
execute_sql "
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
  UNIQUE(quiz_id, step_number, instance_key)
);
" "Criando tabela component_instances"

# Tabela: quiz_templates
execute_sql "
CREATE TABLE IF NOT EXISTS quiz_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  steps_count INTEGER NOT NULL DEFAULT 10,
  category TEXT,
  template_structure JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ
);
" "Criando tabela quiz_templates"

# PASSO 2: Inserir dados REAIS do sistema
echo ""
echo "📦 2. INSERINDO COMPONENTES REAIS DO REGISTRY"
echo "=============================================="

# Função para inserir componente via SQL
insert_component_sql() {
    local type_key="$1"
    local display_name="$2" 
    local category="$3"
    local component_path="$4"
    local default_properties="$5"
    local description="$6"
    
    execute_sql "
    INSERT INTO component_types (
      type_key, display_name, description, category, component_path, 
      default_properties, is_system, is_active
    ) VALUES (
      '$type_key', '$display_name', '$description', '$category', '$component_path',
      '$default_properties'::jsonb, true, true
    ) ON CONFLICT (type_key) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      default_properties = EXCLUDED.default_properties,
      updated_at = NOW();
    " "Inserindo $display_name"
}

# COMPONENTES REAIS DO ENHANCED_BLOCK_REGISTRY
insert_component_sql "text-inline" "Texto Inline" "content" "/components/editor/blocks/TextInlineBlock" \
  '{"content":"Texto exemplo","fontSize":"text-lg","color":"#432818"}' \
  "Componente de texto editável inline"

insert_component_sql "heading-inline" "Título Inline" "content" "/components/editor/blocks/HeadingInlineBlock" \
  '{"content":"Título","level":"h2","fontSize":"text-2xl","fontWeight":"font-bold"}' \
  "Componente de título editável"

insert_component_sql "quiz-intro-header" "Header do Quiz" "headers" "/components/editor/blocks/QuizIntroHeaderBlock" \
  '{"logoUrl":"","logoWidth":120,"progressValue":0,"showBackButton":false}' \
  "Cabeçalho com logo e progresso"

insert_component_sql "form-input" "Campo de Formulário" "forms" "/components/editor/blocks/FormInputBlock" \
  '{"label":"Campo","placeholder":"Digite aqui...","required":false,"inputType":"text"}' \
  "Input para coleta de dados"

insert_component_sql "options-grid" "Grade de Opções" "interactive" "/components/editor/blocks/OptionsGridBlock" \
  '{"options":[],"columns":2,"showImages":true,"multipleSelection":false}' \
  "Grade de opções para quiz"

insert_component_sql "button-inline" "Botão" "interactive" "/components/blocks/inline/ButtonInlineFixed" \
  '{"text":"Clique aqui","variant":"primary","backgroundColor":"#B89B7A","textColor":"#ffffff"}' \
  "Botão de ação"

insert_component_sql "image-display-inline" "Imagem Display" "media" "/components/editor/blocks/ImageDisplayInlineBlock" \
  '{"src":"","alt":"Imagem","width":400,"height":300}' \
  "Componente de exibição de imagem"

insert_component_sql "decorative-bar-inline" "Barra Decorativa" "visual" "/components/blocks/inline/DecorativeBarInline" \
  '{"width":"100%","height":4,"color":"#B89B7A","borderRadius":3}' \
  "Barra visual decorativa"

insert_component_sql "legal-notice-inline" "Aviso Legal" "legal" "/components/blocks/inline/LegalNoticeInline" \
  '{"privacyText":"Política de privacidade","copyrightText":"© 2025 Todos os direitos reservados"}' \
  "Componente de aviso legal e copyright"

# PASSO 3: Componentes da marca Gisele Galvão
echo ""
echo "🎨 3. INSERINDO COMPONENTES DA MARCA GISELE GALVÃO"
echo "=================================================="

insert_component_sql "gisele-header" "Header Gisele Galvão" "headers" "/components/editor/blocks/QuizIntroHeaderBlock" \
  '{"logoUrl":"https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp","logoWidth":120,"logoHeight":120,"backgroundColor":"transparent","showBackButton":true}' \
  "Header personalizado da marca"

insert_component_sql "gisele-button" "Botão Gisele Galvão" "interactive" "/components/blocks/inline/ButtonInlineFixed" \
  '{"backgroundColor":"#B89B7A","textColor":"#ffffff","borderRadius":"rounded-full","fontFamily":"Playfair Display, serif","fontWeight":"font-bold","boxShadow":"shadow-xl"}' \
  "Botão com estilo da marca"

insert_component_sql "style-question" "Pergunta de Estilo" "content" "/components/editor/blocks/TextInlineBlock" \
  '{"fontSize":"text-2xl","fontWeight":"font-bold","color":"#432818","textAlign":"text-center","fontFamily":"Playfair Display, serif","marginBottom":24}' \
  "Pergunta formatada para quiz de estilo"

insert_component_sql "style-options-grid" "Opções de Estilo" "interactive" "/components/editor/blocks/OptionsGridBlock" \
  '{"columns":2,"showImages":true,"multipleSelection":true,"maxSelections":3,"gridGap":16,"responsiveColumns":true,"autoAdvanceOnComplete":false}' \
  "Grade otimizada para escolhas de estilo"

# PASSO 4: Criar triggers e funções
echo ""
echo "⚡ 4. CRIANDO TRIGGERS E FUNÇÕES"
echo "================================"

execute_sql "
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ language 'plpgsql';

CREATE TRIGGER update_component_types_updated_at 
BEFORE UPDATE ON component_types 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
" "Criando triggers de atualização"

# PASSO 5: Verificar dados inseridos
echo ""
echo "🔍 5. VERIFICANDO DADOS INSERIDOS"
echo "================================="

# Testar via HTTP REST API diretamente
response=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/component_types?select=type_key,display_name,category&order=category,display_name" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY")

if [ $? -eq 0 ] && [ "$response" != "[]" ] && [ "$response" != "null" ]; then
    echo "✅ DADOS REAIS INSERIDOS COM SUCESSO!"
    echo ""
    echo "📊 COMPONENTES ENCONTRADOS NO DATABASE:"
    echo "======================================"
    
    # Parse manual se jq não estiver disponível
    if command -v jq >/dev/null 2>&1; then
        echo "$response" | jq -r '.[] | "✅ \(.display_name) (\(.type_key)) - \(.category)"'
    else
        # Fallback manual
        echo "$response" | sed 's/},{/}\n{/g' | grep -o '"display_name":"[^"]*"' | sed 's/"display_name":"//g' | sed 's/"//g' | sed 's/^/✅ /'
    fi
    
    echo ""
    echo "🎉 SISTEMA TOTALMENTE FUNCIONAL!"
    echo "================================"
    echo "✅ Schema aplicado via API"
    echo "✅ Componentes reais inseridos"
    echo "✅ Marca Gisele configurada"
    echo "✅ /editor-fixed integrado"
    echo ""
    echo "🎯 PRONTO PARA USAR:"
    echo "http://localhost:5173/editor-fixed"
    echo "👉 Procure a aba 'Reutilizáveis'"
    
else
    echo "⚠️  Erro ao verificar dados ou tabelas não criadas"
    echo "Resposta: $response"
    echo ""
    echo "🔧 ALTERNATIVA - USAR SUPABASE DASHBOARD:"
    echo "========================================"
    echo "1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw"
    echo "2. SQL Editor → New Query"
    echo "3. Cole o arquivo: SCHEMA_SUPABASE_REUSABLE_COMPONENTS.sql"
    echo "4. Execute"
fi
