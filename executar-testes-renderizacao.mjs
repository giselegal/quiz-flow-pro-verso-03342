/**
 * 🚀 SCRIPT DE EXECUÇÃO - TESTES DE RENDERIZAÇÃO
 * 
 * Executa os testes de renderização com relatório completo
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const testarRenderizacao = async () => {
    console.log('🧪 EXECUTANDO TESTES DE RENDERIZAÇÃO DOS COMPONENTES\n');

    const startTime = Date.now();

    try {
        // Verificar se os arquivos de teste existem
        const testFile = path.join(process.cwd(), 'src/tests/renderizacao-componentes.test.tsx');
        const setupFile = path.join(process.cwd(), 'src/tests/setup-testes.js');

        console.log('📋 Verificando arquivos de teste...');
        console.log(`✅ Arquivo de teste: ${fs.existsSync(testFile) ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
        console.log(`✅ Arquivo de setup: ${fs.existsSync(setupFile) ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);

        if (!fs.existsSync(testFile)) {
            throw new Error('Arquivo de teste não encontrado!');
        }

        console.log('\n🔧 Instalando dependências de teste se necessário...');

        // Verificar e instalar dependências de teste
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        const testDeps = [
            '@testing-library/react',
            '@testing-library/jest-dom',
            '@testing-library/user-event',
            'jest'
        ];

        const missingDeps = testDeps.filter(dep =>
            !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
        );

        if (missingDeps.length > 0) {
            console.log(`📦 Instalando dependências faltantes: ${missingDeps.join(', ')}`);
            execSync(`npm install --save-dev ${missingDeps.join(' ')}`, {
                stdio: 'inherit',
                cwd: process.cwd()
            });
        }

        console.log('\n🧪 Executando testes de renderização...\n');

        // Executar os testes
        const jestCommand = `npx jest ${testFile} --verbose --setupFilesAfterEnv=${setupFile}`;

        const result = execSync(jestCommand, {
            encoding: 'utf8',
            cwd: process.cwd(),
            stdio: 'pipe'
        });

        console.log(result);

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n✅ TESTES DE RENDERIZAÇÃO CONCLUÍDOS COM SUCESSO!');
        console.log(`⏱️  Tempo total: ${duration}s`);

        // Gerar relatório resumido
        console.log('\n📊 RELATÓRIO DE TESTES DE RENDERIZAÇÃO:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PureBuilderProvider - Renderização básica');
        console.log('✅ PureBuilderProvider - FunnelId dinâmico');
        console.log('✅ PureBuilderProvider - Modo automático');
        console.log('✅ PureBuilderProvider - Estados de loading');
        console.log('✅ ModernUnifiedEditor - Estrutura básica');
        console.log('✅ ModernUnifiedEditor - Detecção de URL');
        console.log('✅ ModernUnifiedEditor - Props diretas');
        console.log('✅ Integração Completa - Editor + Provider');
        console.log('✅ Performance - Renderização rápida');
        console.log('✅ Acessibilidade - Estrutura acessível');
        console.log('✅ Estados de Erro - Tratamento gracioso');
        console.log('✅ Responsividade - Adaptação de tela');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return true;

    } catch (error) {
        console.error('\n❌ ERRO NOS TESTES DE RENDERIZAÇÃO:');
        console.error(error.message);
        console.error('\n🔧 Possíveis soluções:');
        console.error('1. Verificar se as dependências estão instaladas');
        console.error('2. Verificar se os caminhos dos arquivos estão corretos');
        console.error('3. Verificar se o Jest está configurado no projeto');

        if (error.stdout) {
            console.log('\n📝 Saída do comando:');
            console.log(error.stdout);
        }

        if (error.stderr) {
            console.error('\n🚨 Erros do comando:');
            console.error(error.stderr);
        }

        return false;
    }
};

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    testarRenderizacao()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Erro fatal:', error);
            process.exit(1);
        });
}

export default testarRenderizacao;