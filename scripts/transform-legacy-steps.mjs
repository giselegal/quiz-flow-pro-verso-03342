#!/usr/bin/env node
// Script de transformação de steps legacy → formato normalized
// Fase 1: step-01 e step-02
// Fase 2: expansão para steps 03, 04 e 05
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_TS_PATH = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');
const OUTPUT_DIR = path.join(__dirname, '../public/templates/normalized');

if (!fs.existsSync(TEMPLATE_TS_PATH)) {
    console.error('❌ Template TS não encontrado em', TEMPLATE_TS_PATH);
    process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Carrega o módulo TS dinamicamente (Node interpretará via transpiler de build, aqui simplificado lendo texto)
const source = fs.readFileSync(TEMPLATE_TS_PATH, 'utf8');

// Heurística simples: extrair objetos step-01 e step-02 via regex (piloto). Para expansão futura, usar parser TS/AST.
function extractRawObject(stepId) {
    // Estratégia: localizar índice de 'step-XX': { e contar chaves para fechar objeto corretamente.
    const marker = `'${stepId}': {`;
    const startIdx = source.indexOf(marker);
    if (startIdx === -1) return null;
    let braceCount = 0;
    let i = startIdx + marker.length - 1; // posição no primeiro '{'
    // Avança até primeira '{'
    while (i < source.length && source[i] !== '{') i++;
    if (source[i] !== '{') return null;
    braceCount = 1;
    let j = i + 1;
    while (j < source.length && braceCount > 0) {
        const ch = source[j];
        if (ch === '{') braceCount++;
        else if (ch === '}') braceCount--;
        j++;
    }
    const objText = source.slice(i, j); // inclui chaves externas
    return objText;
}

function safeJsonParse(objText) {
    try {
        // Transform aspas duplas corretas e remover trailing vírgulas toscas se existirem
        // Como o trecho já é JSON-like do template gerado, deve ser válido.
        return eval('(' + objText + ')'); // Usando eval controlado (conteúdo interno do repo). AST seria mais seguro.
    } catch (e) {
        console.error('Erro ao parsear trecho do step:', e.message);
        return null;
    }
}

function normalizeIntro(stepId, legacyObj) {
    const sections = legacyObj.sections || [];
    const hero = sections.find(s => s.type === 'intro-hero');
    const form = sections.find(s => s.type === 'welcome-form');
    const titleHtml = hero?.content?.title || '';
    const heroBlock = {
        type: 'hero-block',
        config: {
            titleHtml,
            subtitleHtml: hero?.content?.subtitle,
            imageUrl: hero?.content?.imageUrl,
            imageAlt: hero?.content?.imageAlt,
            logoUrl: hero?.content?.logoUrl,
            logoAlt: hero?.content?.logoAlt
        }
    };
    const formBlock = form ? {
        type: 'welcome-form-block',
        config: {
            questionLabel: form?.content?.questionText || 'Seu nome',
            placeholder: form?.content?.namePlaceholder || 'Digite seu nome',
            buttonText: form?.content?.submitText || 'Continuar',
            required: true
        }
    } : null;
    return {
        id: stepId,
        type: 'intro',
        templateVersion: '3.0',
        blocks: [heroBlock, ...(formBlock ? [formBlock] : [])],
        meta: { order: 1, originalType: 'intro' }
    };
}

function normalizeQuestion(stepId, legacyObj) {
    const questionText = legacyObj?.questionText || legacyObj?.metadata?.name || 'Pergunta';
    // Unificar coleta de opções: direct options, sections[].options, sections[].content.options
    const sectionOptions = Array.isArray(legacyObj?.sections)
        ? legacyObj.sections.flatMap(s => {
            const direct = s?.options || [];
            const nested = s?.content?.options || [];
            return [...direct, ...nested];
        })
        : [];
    const directOptions = legacyObj?.options || [];
    const mergedRaw = [...directOptions, ...sectionOptions];
    // Deduplicar
    const seen = new Set();
    const optionsRaw = mergedRaw.filter(o => {
        const key = o?.id || o?.optionId || o?.text || o?.label;
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    const options = optionsRaw.map(o => ({
        id: o.id || o.optionId || o.text?.toLowerCase()?.replace(/\s+/g, '-').slice(0, 32),
        text: o.text || o.label || 'Opção',
        image: o.image || o.imageUrl
    }));
    const required = legacyObj?.validation?.minSelections || legacyObj?.requiredSelections || 1;
    return {
        id: stepId,
        type: 'question',
        templateVersion: '3.0',
        blocks: [
            {
                type: 'question-block',
                config: {
                    questionNumber: legacyObj?.questionNumber || legacyObj?.metadata?.questionNumber || stepId.replace('step-', ''),
                    questionText,
                    requiredSelections: required,
                    options
                }
            }
        ],
        meta: { order: parseInt(stepId.replace('step-', ''), 10) || 2, originalType: 'question' }
    };
}

const stepsToProcess = ['step-01', 'step-02', 'step-03', 'step-04', 'step-05'];
const normalized = {};

for (const sid of stepsToProcess) {
    const rawObj = extractRawObject(sid);
    if (!rawObj) {
        console.warn('⚠️ Step não encontrado no template TS:', sid);
        continue;
    }
    const parsed = safeJsonParse(rawObj);
    if (!parsed) continue;
    let unified;
    if (sid === 'step-01') unified = normalizeIntro(sid, parsed);
    else unified = normalizeQuestion(sid, parsed);
    normalized[sid] = unified;
    const outPath = path.join(OUTPUT_DIR, `${sid}.json`);
    fs.writeFileSync(outPath, JSON.stringify(unified, null, 2), 'utf8');
    console.log('✅ Gerado', outPath);
}

// (Opcional) gerar master parcial
const masterPath = path.join(OUTPUT_DIR, 'master-partial.json');
fs.writeFileSync(masterPath, JSON.stringify({ templateId: 'quiz21StepsComplete', version: '3.0', generatedAt: new Date().toISOString(), steps: normalized }, null, 2));
console.log('✅ Gerado master parcial', masterPath);

console.log('🎯 Transformação concluída para', stepsToProcess.length, 'steps (piloto expandido).');
