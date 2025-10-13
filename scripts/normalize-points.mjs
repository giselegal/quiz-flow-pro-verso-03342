#!/usr/bin/env node

/**
 * 🔢 NORMALIZAÇÃO DE PONTOS - ETAPAS 2-11
 * 
 * Garante que TODAS as opções das etapas 2-11 marquem exatamente 1 ponto.
 * Isso permite um sistema de pontuação balanceado baseado em frequência de escolha.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function normalizePoints() {
    console.log('🔢 Normalizando pontuação das opções (etapas 2-11)...\n');

    // Ler template JSON
    const templatePath = path.join(rootDir, 'public', 'templates', 'quiz21-complete.json');

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Arquivo quiz21-complete.json não encontrado!');
        process.exit(1);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = JSON.parse(templateContent);

    console.log(`✅ Template carregado\n`);

    let totalUpdated = 0;
    const stepsToUpdate = ['step-02', 'step-03', 'step-04', 'step-05', 'step-06', 'step-07', 'step-08', 'step-09', 'step-10', 'step-11'];

    // Percorrer steps 02-11
    for (const stepId of stepsToUpdate) {
        const step = template.steps[stepId];

        if (!step) {
            console.log(`⚠️ Step ${stepId} não encontrado`);
            continue;
        }

        // Encontrar seção options-grid
        const optionsSection = step.sections.find(s => s.type === 'options-grid');
        if (!optionsSection || !optionsSection.content || !optionsSection.content.options) {
            console.log(`⚠️ Opções não encontradas em ${stepId}`);
            continue;
        }

        const options = optionsSection.content.options;
        let changedInStep = 0;

        // Atualizar pontuação de cada opção para 1
        options.forEach((option, index) => {
            if (option.points !== 1) {
                console.log(`  📝 ${stepId} opção [${index + 1}]: ${option.points} → 1 ponto`);
                option.points = 1;
                changedInStep++;
                totalUpdated++;
            }
        });

        if (changedInStep === 0) {
            console.log(`✅ ${stepId}: Todas as ${options.length} opções já têm 1 ponto`);
        } else {
            console.log(`✅ ${stepId}: ${changedInStep} opções atualizadas para 1 ponto`);
        }
    }

    // Salvar template atualizado
    const updatedContent = JSON.stringify(template, null, 2);
    fs.writeFileSync(templatePath, updatedContent, 'utf-8');

    // Relatório final
    console.log('\n' + '='.repeat(70));
    console.log('📊 RELATÓRIO DE NORMALIZAÇÃO');
    console.log('='.repeat(70));
    console.log(`✅ Steps processados: ${stepsToUpdate.length}`);
    console.log(`✅ Opções atualizadas: ${totalUpdated}`);
    console.log(`✅ Pontuação padrão: 1 ponto por opção`);
    console.log('\n✅ Normalização concluída!');
    console.log(`📁 Arquivo atualizado: ${templatePath}`);
}

// Executar
normalizePoints().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
