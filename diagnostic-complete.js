#!/usr/bin/env node

/**
 * 🩺 DIAGNÓSTICO COMPLETO - Sistema Editor-Fixed
 *
 * Executa todas as verificações e correções necessárias
 */

const fs = require('fs');
const path = require('path');

class EditorFixedDiagnostic {
  constructor() {
    this.results = {
      server: { status: 'unknown', issues: [], fixes: [] },
      templates: { status: 'unknown', issues: [], fixes: [] },
      registry: { status: 'unknown', issues: [], fixes: [] },
      mapping: { status: 'unknown', issues: [], fixes: [] },
      overall: { status: 'unknown', score: 0 },
    };
  }

  async runFullDiagnostic() {
    console.log('🩺 DIAGNÓSTICO COMPLETO - Sistema Editor-Fixed\n');
    console.log('=' * 60);

    // 1. Verificar configuração do servidor
    await this.checkServerConfiguration();

    // 2. Verificar templates
    await this.checkTemplates();

    // 3. Verificar registry
    await this.checkRegistryCompatibility();

    // 4. Verificar mapeamento de propriedades
    await this.checkPropertyMapping();

    // 5. Calcular score geral
    this.calculateOverallScore();

    // 6. Gerar relatório final
    this.generateFinalReport();

    return this.results;
  }

  async checkServerConfiguration() {
    console.log('1️⃣ VERIFICANDO CONFIGURAÇÃO DO SERVIDOR...');

    const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');

    try {
      if (!fs.existsSync(viteConfigPath)) {
        this.results.server.issues.push('Arquivo vite.config.ts não encontrado');
        this.results.server.status = 'error';
        return;
      }

      const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

      // Verificações específicas
      const checks = [
        {
          condition: viteConfig.includes('publicDir'),
          issue: 'publicDir não configurado',
          fix: 'Adicionar: publicDir: "public"',
        },
        {
          condition: viteConfig.includes('assetsInclude'),
          issue: 'assetsInclude para JSONs não configurado',
          fix: 'Adicionar: assetsInclude: ["**/*.json"]',
        },
        {
          condition: viteConfig.includes('port: 8080') || viteConfig.includes('port: 5173'),
          issue: 'Porta não configurada adequadamente',
          fix: 'Configurar porta fixa (recomendado: 8080)',
        },
        {
          condition: viteConfig.includes('fs:') && viteConfig.includes('allow:'),
          issue: 'Permissões de arquivos não configuradas',
          fix: 'Adicionar fs.allow para templates',
        },
      ];

      let issueCount = 0;
      checks.forEach(check => {
        if (!check.condition) {
          this.results.server.issues.push(check.issue);
          this.results.server.fixes.push(check.fix);
          issueCount++;
        }
      });

      this.results.server.status = issueCount === 0 ? 'ok' : issueCount <= 2 ? 'warning' : 'error';
      console.log(
        `   Status: ${this.results.server.status.toUpperCase()} (${issueCount} problemas)\n`
      );
    } catch (error) {
      this.results.server.issues.push(`Erro ao verificar vite.config.ts: ${error.message}`);
      this.results.server.status = 'error';
    }
  }

  async checkTemplates() {
    console.log('2️⃣ VERIFICANDO TEMPLATES...');

    let foundTemplates = 0;
    let validTemplates = 0;
    const templateDir = path.join(process.cwd(), 'public', 'templates');

    // Verificar se diretório existe
    if (!fs.existsSync(templateDir)) {
      this.results.templates.issues.push('Diretório public/templates não encontrado');
      this.results.templates.fixes.push('Criar diretório e copiar templates');
      this.results.templates.status = 'error';
      return;
    }

    // Verificar cada template das 21 etapas
    for (let step = 1; step <= 21; step++) {
      const stepId = step.toString().padStart(2, '0');
      const templatePath = path.join(templateDir, `step-${stepId}-template.json`);

      if (fs.existsSync(templatePath)) {
        foundTemplates++;

        try {
          const content = fs.readFileSync(templatePath, 'utf8');
          const template = JSON.parse(content);

          // Validação básica da estrutura
          if (template.metadata && template.blocks && Array.isArray(template.blocks)) {
            validTemplates++;
          } else {
            this.results.templates.issues.push(`Template ${step}: estrutura inválida`);
          }
        } catch (error) {
          this.results.templates.issues.push(`Template ${step}: JSON inválido`);
        }
      } else {
        this.results.templates.issues.push(`Template ${step} não encontrado`);
      }
    }

    // Determinar status
    if (foundTemplates === 21 && validTemplates === 21) {
      this.results.templates.status = 'ok';
    } else if (foundTemplates >= 15 && validTemplates >= 15) {
      this.results.templates.status = 'warning';
    } else {
      this.results.templates.status = 'error';
    }

    if (foundTemplates < 21) {
      this.results.templates.fixes.push('Copiar templates faltantes para public/templates/');
    }

    console.log(`   Templates encontrados: ${foundTemplates}/21`);
    console.log(`   Templates válidos: ${validTemplates}/21`);
    console.log(`   Status: ${this.results.templates.status.toUpperCase()}\n`);
  }

  async checkRegistryCompatibility() {
    console.log('3️⃣ VERIFICANDO COMPATIBILIDADE DO REGISTRY...');

    try {
      // Tentar importar o registry
      const registryPath = path.join(process.cwd(), 'src', 'config', 'enhancedBlockRegistry.ts');

      if (!fs.existsSync(registryPath)) {
        this.results.registry.issues.push('ENHANCED_BLOCK_REGISTRY não encontrado');
        this.results.registry.status = 'error';
        return;
      }

      // Simular análise de compatibilidade (versão simplificada)
      const templateDir = path.join(process.cwd(), 'public', 'templates');
      const blockTypes = new Set();
      let totalBlocks = 0;

      // Coletar todos os tipos de blocos dos templates
      for (let step = 1; step <= 21; step++) {
        const stepId = step.toString().padStart(2, '0');
        const templatePath = path.join(templateDir, `step-${stepId}-template.json`);

        if (fs.existsSync(templatePath)) {
          try {
            const content = fs.readFileSync(templatePath, 'utf8');
            const template = JSON.parse(content);

            if (template.blocks) {
              template.blocks.forEach(block => {
                blockTypes.add(block.type);
                totalBlocks++;
              });
            }
          } catch {
            // Ignorar erros de parsing aqui
          }
        }
      }

      // Tipos comuns que devem existir no registry
      const expectedTypes = [
        'text-inline',
        'button-inline',
        'image-inline',
        'header-inline',
        'grid-inline',
        'card-inline',
        'form-inline',
        'spacer-inline',
      ];

      const missingExpectedTypes = expectedTypes.filter(type => !blockTypes.has(type));
      const unknownTypes = [
        'quiz-intro-header',
        'options-grid',
        'result-card',
        'loading-animation',
      ];
      const foundUnknownTypes = unknownTypes.filter(type => blockTypes.has(type));

      if (foundUnknownTypes.length > 0) {
        this.results.registry.issues.push(
          `Tipos específicos encontrados: ${foundUnknownTypes.join(', ')}`
        );
        this.results.registry.fixes.push('Implementar fallbacks no TemplateAdapter');
        this.results.registry.fixes.push('Adicionar componentes específicos ao registry');
      }

      this.results.registry.status = foundUnknownTypes.length <= 3 ? 'warning' : 'error';

      console.log(`   Tipos únicos encontrados: ${blockTypes.size}`);
      console.log(`   Total de blocos: ${totalBlocks}`);
      console.log(`   Status: ${this.results.registry.status.toUpperCase()}\n`);
    } catch (error) {
      this.results.registry.issues.push(`Erro ao verificar registry: ${error.message}`);
      this.results.registry.status = 'error';
    }
  }

  async checkPropertyMapping() {
    console.log('4️⃣ VERIFICANDO MAPEAMENTO DE PROPRIEDADES...');

    const adapterPath = path.join(
      process.cwd(),
      'src',
      'components',
      'editor-fixed',
      'TemplateAdapter.ts'
    );

    try {
      if (!fs.existsSync(adapterPath)) {
        this.results.mapping.issues.push('TemplateAdapter.ts não encontrado');
        this.results.mapping.status = 'error';
        return;
      }

      const adapterContent = fs.readFileSync(adapterPath, 'utf8');

      // Verificar se métodos importantes existem
      const requiredMethods = [
        'mapComponentType',
        'mapProperties',
        'convertTailwindFontSize',
        'convertTailwindTextAlign',
        'convertTailwindFontWeight',
      ];

      let missingMethods = 0;
      requiredMethods.forEach(method => {
        if (!adapterContent.includes(method)) {
          this.results.mapping.issues.push(`Método ${method} não encontrado`);
          missingMethods++;
        }
      });

      // Verificar se há fallbacks
      if (!adapterContent.includes('COMPONENT_FALLBACKS')) {
        this.results.mapping.issues.push('Fallbacks de componentes não implementados');
        this.results.mapping.fixes.push('Implementar mapeamento de fallbacks');
      }

      this.results.mapping.status =
        missingMethods === 0 ? 'ok' : missingMethods <= 2 ? 'warning' : 'error';
      console.log(
        `   Métodos verificados: ${requiredMethods.length - missingMethods}/${requiredMethods.length}`
      );
      console.log(`   Status: ${this.results.mapping.status.toUpperCase()}\n`);
    } catch (error) {
      this.results.mapping.issues.push(`Erro ao verificar TemplateAdapter: ${error.message}`);
      this.results.mapping.status = 'error';
    }
  }

  calculateOverallScore() {
    const weights = { server: 20, templates: 40, registry: 25, mapping: 15 };
    const statusScores = { ok: 100, warning: 70, error: 30, unknown: 0 };

    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(category => {
      const status = this.results[category].status;
      const score = statusScores[status] || 0;
      totalScore += score * weights[category];
      totalWeight += weights[category];
    });

    this.results.overall.score = Math.round(totalScore / totalWeight);

    if (this.results.overall.score >= 85) {
      this.results.overall.status = 'excellent';
    } else if (this.results.overall.score >= 70) {
      this.results.overall.status = 'good';
    } else if (this.results.overall.score >= 50) {
      this.results.overall.status = 'fair';
    } else {
      this.results.overall.status = 'poor';
    }
  }

  generateFinalReport() {
    console.log('📊 RELATÓRIO FINAL');
    console.log('=' * 60);

    // Score geral
    const scoreEmoji =
      this.results.overall.score >= 85
        ? '🎉'
        : this.results.overall.score >= 70
          ? '👍'
          : this.results.overall.score >= 50
            ? '⚠️'
            : '❌';

    console.log(
      `${scoreEmoji} SCORE GERAL: ${this.results.overall.score}/100 (${this.results.overall.status.toUpperCase()})\n`
    );

    // Detalhes por categoria
    Object.keys(this.results).forEach(category => {
      if (category === 'overall') return;

      const result = this.results[category];
      const statusEmoji = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';

      console.log(`${statusEmoji} ${category.toUpperCase()}: ${result.status}`);

      if (result.issues.length > 0) {
        console.log('   Problemas:');
        result.issues.slice(0, 3).forEach(issue => console.log(`     - ${issue}`));
        if (result.issues.length > 3) {
          console.log(`     ... e mais ${result.issues.length - 3} problemas`);
        }
      }

      if (result.fixes.length > 0) {
        console.log('   Correções recomendadas:');
        result.fixes.slice(0, 2).forEach(fix => console.log(`     • ${fix}`));
      }

      console.log('');
    });

    // Próximos passos
    console.log('🔧 PRÓXIMOS PASSOS:');
    if (this.results.overall.score >= 85) {
      console.log('✨ Sistema em excelente estado! Pronto para produção.');
    } else if (this.results.overall.score >= 70) {
      console.log('👍 Sistema funcionando bem. Aplicar correções menores.');
    } else if (this.results.overall.score >= 50) {
      console.log('⚠️ Sistema precisa de ajustes importantes.');
      console.log('   1. Corrigir configuração do servidor');
      console.log('   2. Completar templates faltantes');
      console.log('   3. Implementar fallbacks no registry');
    } else {
      console.log('❌ Sistema requer intervenção urgente.');
      console.log('   1. Revisar toda a configuração');
      console.log('   2. Verificar estrutura de arquivos');
      console.log('   3. Testar componentes essenciais');
    }
  }
}

// Executar diagnóstico se chamado diretamente
if (require.main === module) {
  const diagnostic = new EditorFixedDiagnostic();
  diagnostic.runFullDiagnostic().catch(console.error);
}

module.exports = { EditorFixedDiagnostic };
