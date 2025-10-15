/**
 * 🔍 DIAGNÓSTICO DE TEMPLATES NO EDITOR
 * 
 * Verifica quais templates estão sendo carregados e se há inconsistências
 */

import { promises as fs } from 'fs';
import path from 'path';

async function diagnoseEditorTemplates() {
  console.log('🔍 DIAGNÓSTICO DE TEMPLATES NO EDITOR\n');

  try {
    // 1. Verificar templates disponíveis
    const templatesDir = '/workspaces/quiz-flow-pro-verso/public/templates';
    const files = await fs.readdir(templatesDir);
    
    const step20Files = files.filter(f => f.includes('step-20'));
    console.log('📁 Arquivos Step 20 encontrados:');
    step20Files.forEach(file => console.log(`  • ${file}`));
    
    // 2. Verificar conteúdo dos templates Step 20
    console.log('\n📄 CONTEÚDO DOS TEMPLATES Step 20:');
    
    for (const file of step20Files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(templatesDir, file), 'utf8');
        const json = JSON.parse(content);
        
        console.log(`\n🔸 ${file}:`);
        console.log(`  • ID: ${json.metadata?.id}`);
        console.log(`  • Nome: ${json.metadata?.name}`);
        console.log(`  • Versão: ${json.templateVersion}`);
        console.log(`  • Seções: ${json.sections?.length || json.blocks?.length || 0}`);
        
        if (json.sections) {
          const calcSection = json.sections.find((s: any) => s.type === 'ResultCalculationSection');
          console.log(`  • Tem ResultCalculationSection: ${calcSection ? '✅' : '❌'}`);
        }
      }
    }
    
    // 3. Verificar se há duplicatas em outras pastas
    console.log('\n🔎 VERIFICANDO DUPLICATAS:');
    
    const possiblePaths = [
      '/workspaces/quiz-flow-pro-verso/templates',
      '/workspaces/quiz-flow-pro-verso/src/templates',
      '/workspaces/quiz-flow-pro-verso/public/templates/normalized'
    ];
    
    for (const dir of possiblePaths) {
      try {
        const files = await fs.readdir(dir);
        const step20Files = files.filter(f => f.includes('step-20'));
        if (step20Files.length > 0) {
          console.log(`❌ DUPLICATAS em ${dir}:`);
          step20Files.forEach(f => console.log(`  • ${f}`));
        } else {
          console.log(`✅ ${dir}: sem duplicatas`);
        }
      } catch (error) {
        console.log(`✅ ${dir}: pasta não existe`);
      }
    }
    
    // 4. Testar carregamento via HTTP
    console.log('\n🌐 TESTE DE CARREGAMENTO HTTP:');
    
    const testUrls = [
      'http://localhost:5173/templates/step-20-v3.json',
      'http://localhost:5173/templates/step-20-template.json'
    ];
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${url}:`);
          console.log(`  • Status: ${response.status}`);
          console.log(`  • ID: ${data.metadata?.id}`);
        } else {
          console.log(`❌ ${url}: Status ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${url}: Erro de rede`);
      }
    }
    
    // 5. Verificar código que pode estar carregando templates antigos
    console.log('\n💻 VERIFICANDO CÓDIGO:');
    
    const sourceFiles = [
      '/workspaces/quiz-flow-pro-verso/src/hooks/useTemplateLoader.ts',
      '/workspaces/quiz-flow-pro-verso/src/services/HybridTemplateService.ts',
      '/workspaces/quiz-flow-pro-verso/src/core/editor/services/EditorDataService.ts'
    ];
    
    for (const file of sourceFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const hasOldPattern = content.includes('-template.json');
        const hasNewPattern = content.includes('-v3.json');
        
        console.log(`${hasOldPattern ? '❌' : '✅'} ${path.basename(file)}:`);
        console.log(`  • Padrão antigo (-template.json): ${hasOldPattern ? 'SIM' : 'NÃO'}`);
        console.log(`  • Padrão novo (-v3.json): ${hasNewPattern ? 'SIM' : 'NÃO'}`);
      } catch (error) {
        console.log(`❓ ${file}: Não conseguiu verificar`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  }
}

diagnoseEditorTemplates().catch(console.error);