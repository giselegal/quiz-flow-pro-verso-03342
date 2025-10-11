#!/usr/bin/env tsx
/**
 * Script para validar templates JSON
 * 
 * Uso: npm run validate:templates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const REQUIRED_FIELDS = ['templateVersion', 'metadata', 'blocks'];
const REQUIRED_METADATA = ['id', 'name', 'category'];

/**
 * Valida todos os templates JSON
 */
function validateAllTemplates(): void {
    console.log('🔍 Validando templates JSON...\n');

    if (!fs.existsSync(TEMPLATES_DIR)) {
        console.error(`❌ Diretório de templates não encontrado: ${TEMPLATES_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(TEMPLATES_DIR)
        .filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.warn('⚠️  Nenhum template JSON encontrado');
        return;
    }

    let validCount = 0;
    let invalidCount = 0;

    files.forEach(file => {
        const filepath = path.join(TEMPLATES_DIR, file);
        const result = validateTemplate(filepath);

        if (result.valid) {
            console.log(`✅ ${file} - OK`);
            validCount++;
        } else {
            console.log(`❌ ${file} - INVÁLIDO`);
            result.errors.forEach(err => console.log(`   ⚠️  ${err}`));
            invalidCount++;
        }

        if (result.warnings.length > 0) {
            result.warnings.forEach(warn => console.log(`   ⚡ ${warn}`));
        }
    });

    console.log(`\n📊 Validação concluída:`);
    console.log(`   ✅ Válidos: ${validCount}/${files.length}`);
    console.log(`   ❌ Inválidos: ${invalidCount}/${files.length}`);

    if (invalidCount > 0) {
        process.exit(1);
    }
}

/**
 * Valida um template individual
 */
function validateTemplate(filepath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
        // 1. Validar JSON
        const content = fs.readFileSync(filepath, 'utf-8');
        const template = JSON.parse(content);

        // 2. Validar campos obrigatórios
        REQUIRED_FIELDS.forEach(field => {
            if (!template[field]) {
                errors.push(`Campo obrigatório ausente: ${field}`);
            }
        });

        // 3. Validar metadata
        if (template.metadata) {
            REQUIRED_METADATA.forEach(field => {
                if (!template.metadata[field]) {
                    errors.push(`Metadata obrigatória ausente: ${field}`);
                }
            });
        }

        // 4. Validar versão
        if (template.templateVersion !== "2.0") {
            warnings.push(`Versão do template: ${template.templateVersion} (esperado: 2.0)`);
        }

        // Validate blocks
        if (!template.blocks || !Array.isArray(template.blocks)) {
            errors.push('Template deve ter um array de blocos');
        }

        // Allow empty blocks for transition steps (step-19 is a transition)
        if (template.blocks && template.blocks.length === 0) {
            const isTransition = template.metadata?.category?.includes('transition');
            if (!isTransition) {
                warnings.push('Template não possui blocos');
            }
        }

    } catch (error: any) {
        errors.push(`Erro ao ler arquivo: ${error.message}`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

// Executar validação
validateAllTemplates();
