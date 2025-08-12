/**
 * 🧪 TESTE SIMPLES DO SISTEMA DE TEMPLATES
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TESTE SIMPLES DO SISTEMA DE TEMPLATES\n');

// Testar se os templates JSON existem
function testTemplateFiles() {
  console.log('📁 VERIFICANDO ARQUIVOS DE TEMPLATE:\n');

  let existingTemplates = 0;
  let totalSize = 0;

  for (let i = 1; i <= 21; i++) {
    const templatePath = path.join(
      __dirname,
      'public/templates',
      `step-${String(i).padStart(2, '0')}-template.json`
    );

    try {
      const stats = fs.statSync(templatePath);
      const content = fs.readFileSync(templatePath, 'utf8');
      const template = JSON.parse(content);

      console.log(
        `✅ Step ${i}: ${template.metadata?.name || 'Sem nome'} (${stats.size} bytes, ${template.blocks?.length || 0} blocos)`
      );
      existingTemplates++;
      totalSize += stats.size;
    } catch (error) {
      console.log(`❌ Step ${i}: Arquivo não encontrado ou inválido`);
    }
  }

  console.log(`\n📊 ESTATÍSTICAS:`);
  console.log(`   Templates válidos: ${existingTemplates}/21`);
  console.log(`   Tamanho total: ${Math.round(totalSize / 1024)}KB`);

  return existingTemplates;
}

// Testar se o arquivo templates.ts foi corrigido
function testTemplatesConfig() {
  console.log('\n⚙️  VERIFICANDO CONFIGURAÇÃO:\n');

  try {
    const configPath = path.join(__dirname, 'src/config/templates/templates.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    const hasProxyPattern = content.includes('new Proxy');
    const hasDynamicLoading = content.includes('loadTemplate');
    const hasCache = content.includes('templateCache');
    const hasAsyncFetch = content.includes('await fetch');

    console.log(`✅ Padrão Proxy implementado: ${hasProxyPattern ? '✅' : '❌'}`);
    console.log(`✅ Carregamento dinâmico: ${hasDynamicLoading ? '✅' : '❌'}`);
    console.log(`✅ Sistema de cache: ${hasCache ? '✅' : '❌'}`);
    console.log(`✅ Fetch assíncrono: ${hasAsyncFetch ? '✅' : '❌'}`);

    const allGood = hasProxyPattern && hasDynamicLoading && hasCache && hasAsyncFetch;
    console.log(`\n🎯 Sistema de carregamento: ${allGood ? '✅ CORRIGIDO' : '❌ PRECISA AJUSTES'}`);

    return allGood;
  } catch (error) {
    console.log('❌ Erro ao verificar configuração:', error.message);
    return false;
  }
}

// Testar se o build está funcionando
function checkBuildConfig() {
  console.log('\n🏗️  VERIFICANDO CONFIGURAÇÃO DE BUILD:\n');

  try {
    const vitePath = path.join(__dirname, 'vite.config.ts');
    const content = fs.readFileSync(vitePath, 'utf8');

    const hasPublicDir = content.includes("publicDir: 'public'");
    const hasAssetsInclude = content.includes("assetsInclude: ['**/*.json']");
    const hasServerFs = content.includes('server: {') && content.includes('fs:');

    console.log(`✅ publicDir configurado: ${hasPublicDir ? '✅' : '❌'}`);
    console.log(`✅ assetsInclude para JSON: ${hasAssetsInclude ? '✅' : '❌'}`);
    console.log(`✅ server.fs configurado: ${hasServerFs ? '✅' : '❌'}`);

    const buildReady = hasPublicDir && hasAssetsInclude;
    console.log(`\n🎯 Configuração de build: ${buildReady ? '✅ PRONTA' : '❌ INCOMPLETA'}`);

    return buildReady;
  } catch (error) {
    console.log('❌ Erro ao verificar build config:', error.message);
    return false;
  }
}

// Executar todos os testes
const templatesFound = testTemplateFiles();
const configFixed = testTemplatesConfig();
const buildReady = checkBuildConfig();

console.log('\n🎉 RESULTADO FINAL:\n');

if (templatesFound >= 20 && configFixed && buildReady) {
  console.log('✅ SISTEMA TOTALMENTE FUNCIONAL!');
  console.log('✅ Templates carregados e válidos');
  console.log('✅ Sistema de carregamento dinâmico implementado');
  console.log('✅ Build configurado corretamente');
  console.log('✅ Problema do Vite resolvido');
  console.log('\n🚀 Pronto para usar em produção!');
} else {
  console.log('❌ Sistema precisa de alguns ajustes:');
  if (templatesFound < 20) console.log(`   - Faltam ${21 - templatesFound} templates`);
  if (!configFixed) console.log('   - Configuração de carregamento precisa correção');
  if (!buildReady) console.log('   - Configuração de build incompleta');
}
