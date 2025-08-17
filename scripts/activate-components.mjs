#!/usr/bin/env node
/**
 * 🚀 ATIVAÇÃO MASSIVA DE COMPONENTES - EDITOR FIXED
 *
 * Conecta automaticamente todos os componentes físicos ao blockDefinitions.ts
 * Transformando de 21 para 167+ componentes ativos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Configuração
const BLOCKS_DIR = path.join(projectRoot, 'src/components/editor/blocks');
const BLOCK_DEFINITIONS_FILE = path.join(projectRoot, 'src/config/blockDefinitions.ts');
const BACKUP_FILE = BLOCK_DEFINITIONS_FILE + '.backup';

// Mapeamento de ícones por categoria
const CATEGORY_ICONS = {
  action: 'MousePointer',
  text: 'Type',
  quiz: 'HelpCircle',
  media: 'Image',
  layout: 'Layout',
  pricing: 'DollarSign',
  'social-proof': 'Users',
  analytics: 'BarChart',
  forms: 'FileText',
  urgency: 'Clock',
  faq: 'MessageCircle',
  feedback: 'Activity',
  gallery: 'Grid',
  conversion: 'Target',
  misc: 'Square',
};

console.log('🚀 ATIVAÇÃO MASSIVA DE COMPONENTES DO EDITOR');
console.log('='.repeat(60));

// 1. Backup do arquivo atual
function createBackup() {
  if (fs.existsSync(BLOCK_DEFINITIONS_FILE)) {
    fs.copyFileSync(BLOCK_DEFINITIONS_FILE, BACKUP_FILE);
    console.log(`✅ Backup criado: ${path.basename(BACKUP_FILE)}`);
  }
}

// 2. Escanear componentes físicos
function scanAllComponents() {
  const components = [];
  const files = fs.readdirSync(BLOCKS_DIR, { withFileTypes: true });

  for (const file of files) {
    if (
      file.isFile() &&
      file.name.endsWith('.tsx') &&
      !file.name.includes('index') &&
      !file.name.includes('types') &&
      !file.name.includes('suppress') &&
      !file.name.includes('disable')
    ) {
      const filePath = path.join(BLOCKS_DIR, file.name);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extrair nome do componente
      const componentMatch = content.match(/^export\s+(?:default\s+)?(?:const|function)\s+(\w+)/m);
      const exportDefaultMatch = content.match(/export\s+default\s+(\w+)/);

      const componentName = componentMatch
        ? componentMatch[1]
        : exportDefaultMatch
          ? exportDefaultMatch[1]
          : file.name.replace('.tsx', '');

      // Skip componentes que não são válidos
      if (
        componentName.includes('HEADING_LEVELS') ||
        componentName.includes('_clean') ||
        componentName.includes('_new') ||
        componentName.length < 3
      ) {
        continue;
      }

      const category = inferCategory(componentName);

      components.push({
        fileName: file.name,
        componentName,
        category,
        type: generateTypeId(componentName),
        importPath: `@/components/editor/blocks/${componentName}`,
      });
    }
  }

  return components.sort((a, b) => a.componentName.localeCompare(b.componentName));
}

// 3. Inferir categoria
function inferCategory(componentName) {
  const name = componentName.toLowerCase();

  if (name.includes('quiz') || name.includes('question')) return 'quiz';
  if (name.includes('text') || name.includes('heading') || name.includes('title')) return 'text';
  if (name.includes('button') || name.includes('cta') || name.includes('call')) return 'action';
  if (name.includes('image') || name.includes('video') || name.includes('media')) return 'media';
  if (name.includes('form') || name.includes('input')) return 'forms';
  if (name.includes('pricing') || name.includes('price')) return 'pricing';
  if (name.includes('testimonial') || name.includes('review')) return 'social-proof';
  if (name.includes('faq')) return 'faq';
  if (name.includes('countdown') || name.includes('timer') || name.includes('urgency'))
    return 'urgency';
  if (name.includes('chart') || name.includes('stats') || name.includes('metrics'))
    return 'analytics';
  if (name.includes('carousel') || name.includes('gallery')) return 'gallery';
  if (name.includes('spacer') || name.includes('divider') || name.includes('section'))
    return 'layout';
  if (name.includes('progress') || name.includes('loader') || name.includes('notification'))
    return 'feedback';
  if (name.includes('result') || name.includes('offer') || name.includes('hero'))
    return 'conversion';

  return 'misc';
}

// 4. Gerar ID do tipo
function generateTypeId(componentName) {
  return componentName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/block$/, '')
    .replace(/inline$/, '')
    .replace(/editor$/, '');
}

// 5. Gerar propriedades básicas baseadas no tipo
function generateBasicProperties(componentName, category) {
  const baseProps = {
    id: {
      type: 'string',
      default: `${componentName.toLowerCase()}-${Date.now()}`,
      label: 'ID',
      description: 'Identificador único do componente',
    },
  };

  // Propriedades específicas por categoria
  if (category === 'text') {
    return {
      ...baseProps,
      content: {
        type: 'textarea',
        default: 'Texto de exemplo',
        label: 'Conteúdo',
        description: 'Conteúdo do texto',
      },
      textAlign: {
        type: 'select',
        default: 'left',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
        ],
      },
    };
  }

  if (category === 'action') {
    return {
      ...baseProps,
      text: {
        type: 'string',
        default: 'Clique aqui',
        label: 'Texto do Botão',
        description: 'Texto exibido no botão',
      },
      url: {
        type: 'string',
        default: '#',
        label: 'URL',
        description: 'Link de destino',
      },
      style: {
        type: 'select',
        default: 'primary',
        label: 'Estilo',
        options: [
          { value: 'primary', label: 'Primário' },
          { value: 'secondary', label: 'Secundário' },
          { value: 'outline', label: 'Contorno' },
        ],
      },
    };
  }

  if (category === 'media') {
    return {
      ...baseProps,
      src: {
        type: 'string',
        default: 'https://via.placeholder.com/400x300',
        label: 'URL da Imagem',
        description: 'URL da imagem ou vídeo',
      },
      alt: {
        type: 'string',
        default: 'Descrição da imagem',
        label: 'Texto Alternativo',
        description: 'Descrição para acessibilidade',
      },
    };
  }

  // Propriedades genéricas para outras categorias
  return {
    ...baseProps,
    title: {
      type: 'string',
      default: 'Título do Componente',
      label: 'Título',
      description: 'Título do componente',
    },
    description: {
      type: 'textarea',
      default: 'Descrição do componente',
      label: 'Descrição',
      description: 'Descrição detalhada',
    },
  };
}

// 6. Gerar definição de bloco
function generateBlockDefinition(component) {
  const icon = CATEGORY_ICONS[component.category] || 'Square';
  const properties = generateBasicProperties(component.componentName, component.category);

  return `  {
    type: '${component.type}',
    name: '${generateDisplayName(component.componentName)}',
    description: '${generateDescription(component.componentName, component.category)}',
    category: '${component.category}',
    icon: ${icon},
    component: ${component.componentName},
    properties: ${JSON.stringify(properties, null, 6).replace(/"/g, "'")},
    label: '${generateDisplayName(component.componentName)}',
    defaultProps: ${JSON.stringify(extractDefaultProps(properties), null, 6).replace(/"/g, "'")},
  }`;
}

// 7. Helpers
function generateDisplayName(componentName) {
  return componentName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/Block|Editor|Inline/g, '')
    .trim();
}

function generateDescription(componentName, category) {
  const name = generateDisplayName(componentName);
  const categoryDesc = {
    quiz: 'para questionários e interação',
    text: 'para conteúdo textual',
    action: 'para chamadas para ação',
    media: 'para conteúdo multimídia',
    layout: 'para estrutura e layout',
    pricing: 'para tabelas de preços',
    'social-proof': 'para prova social',
    analytics: 'para dados e métricas',
    forms: 'para formulários',
    urgency: 'para criar urgência',
    faq: 'para perguntas frequentes',
    feedback: 'para feedback visual',
    gallery: 'para galerias de imagem',
    conversion: 'para conversão',
    misc: 'de uso geral',
  };

  return `Componente ${name} ${categoryDesc[category] || 'personalizado'}`;
}

function extractDefaultProps(properties) {
  const defaults = {};
  Object.entries(properties).forEach(([key, prop]) => {
    if (prop.default !== undefined) {
      defaults[key] = prop.default;
    }
  });
  return defaults;
}

// 8. Ler componentes já conectados
function getExistingConnections() {
  if (!fs.existsSync(BLOCK_DEFINITIONS_FILE)) return new Set();

  const content = fs.readFileSync(BLOCK_DEFINITIONS_FILE, 'utf-8');
  const componentMatches = content.match(/component:\s*(\w+)/g) || [];

  return new Set(
    componentMatches
      .map(match => {
        const nameMatch = match.match(/component:\s*(\w+)/);
        return nameMatch ? nameMatch[1] : null;
      })
      .filter(Boolean)
  );
}

// 9. Gerar arquivo completo
function generateNewBlockDefinitions(allComponents, existingConnections) {
  const newComponents = allComponents.filter(comp => !existingConnections.has(comp.componentName));

  console.log(`\n📊 ESTATÍSTICAS:`);
  console.log(`• Total de componentes: ${allComponents.length}`);
  console.log(`• Já conectados: ${existingConnections.size}`);
  console.log(`• Novos a conectar: ${newComponents.length}`);

  // Organizar por categoria
  const componentsByCategory = {};
  allComponents.forEach(comp => {
    if (!componentsByCategory[comp.category]) {
      componentsByCategory[comp.category] = [];
    }
    componentsByCategory[comp.category].push(comp);
  });

  // Gerar imports
  const imports = allComponents
    .map(comp => `import ${comp.componentName} from '${comp.importPath}';`)
    .join('\n');

  // Gerar definições
  const definitions = Object.entries(componentsByCategory)
    .map(([category, components]) => {
      const categoryDefs = components.map(comp => generateBlockDefinition(comp)).join(',\n\n');
      return `  // ========== ${category.toUpperCase()} COMPONENTS ==========\n${categoryDefs}`;
    })
    .join(',\n\n');

  return `import { BlockDefinition } from '@/types/editor';
import { 
  AlignLeft, 
  BarChart,
  Clock,
  DollarSign,
  FileText,
  Grid,
  HelpCircle,
  Image,
  Layout,
  MessageCircle,
  MousePointer,
  Square,
  Target,
  Type,
  Users,
  Activity
} from 'lucide-react';

// ========== COMPONENT IMPORTS ==========
${imports}

// ========== BLOCK DEFINITIONS ==========
export const blockDefinitions: BlockDefinition[] = [
${definitions}
];

// ========== STATISTICS ==========
// Total Components: ${allComponents.length}
// Categories: ${Object.keys(componentsByCategory).length}
// Generated: ${new Date().toLocaleString()}`;
}

// 10. Executar ativação
function activateComponents() {
  console.log('\n🔍 Escaneando componentes...');
  const allComponents = scanAllComponents();
  const existingConnections = getExistingConnections();

  if (allComponents.length === 0) {
    console.log('❌ Nenhum componente encontrado!');
    return;
  }

  console.log(`\n📦 Componentes por categoria:`);
  const categories = {};
  allComponents.forEach(comp => {
    categories[comp.category] = (categories[comp.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  • ${cat}: ${count} componentes`);
  });

  console.log('\n📝 Gerando novo blockDefinitions.ts...');
  createBackup();

  const newContent = generateNewBlockDefinitions(allComponents, existingConnections);
  fs.writeFileSync(BLOCK_DEFINITIONS_FILE, newContent, 'utf-8');

  console.log(`\n✅ ATIVAÇÃO COMPLETA!`);
  console.log(`• Arquivo: ${path.basename(BLOCK_DEFINITIONS_FILE)}`);
  console.log(`• Backup: ${path.basename(BACKUP_FILE)}`);
  console.log(`• Componentes ativados: ${allComponents.length}`);

  console.log('\n🎯 PRÓXIMOS PASSOS:');
  console.log('1. Teste o build: npm run build');
  console.log('2. Inicie o servidor: npm run dev');
  console.log('3. Acesse /editor-fixed para testar');
  console.log('4. Se houver erros, restaure o backup');
}

// Executar
activateComponents();
