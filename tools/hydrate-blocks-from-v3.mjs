#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const PUB_DIR = path.join(ROOT, 'public', 'templates');
const BLOCKS_DIR = path.join(PUB_DIR, 'blocks');

async function readJson(file) {
    try {
        const s = await fs.readFile(file, 'utf8');
        return JSON.parse(s);
    } catch (e) {
        return null;
    }
}

async function writeJson(file, obj) {
    const dir = path.dirname(file);
    await fs.mkdir(dir, { recursive: true });
    const data = JSON.stringify(obj, null, 2);
    await fs.writeFile(file, data + '\n', 'utf8');
}

function secByType(sections, type) {
    return Array.isArray(sections) ? sections.find(s => s && s.type === type) : undefined;
}

function getQuestionNumber(sections) {
    const prog = secByType(sections, 'question-progress');
    const num = secByType(sections, 'question-number');
    if (num?.content?.questionNumber) return String(num.content.questionNumber);
    if (prog?.content?.currentQuestion && prog?.content?.totalQuestions) {
        return `${prog.content.currentQuestion} de ${prog.content.totalQuestions}`;
    }
    return undefined;
}

function getQuestionText(sections) {
    const qt = secByType(sections, 'question-text');
    return qt?.content?.text ? String(qt.content.text) : undefined;
}

function getOptions(sections) {
    const grid = secByType(sections, 'options-grid');
    const opts = Array.isArray(grid?.content?.options) ? grid.content.options : [];
    return opts.map(o => ({ id: String(o.id || o.value), text: String(o.text || o.label || o.value || ''), image: o.imageUrl || o.image }));
}

function getMinSelections(sections) {
    const grid = secByType(sections, 'options-grid');
    return typeof grid?.content?.minSelections === 'number' ? grid.content.minSelections : undefined;
}

function hydrateIntroFromV3(blocks, v3) {
    const sections = v3?.sections || [];
    const header = secByType(sections, 'quiz-intro-header');
    const introTitle = secByType(sections, 'intro-title');
    const introDesc = secByType(sections, 'intro-description');
    const introImg = secByType(sections, 'intro-image');
    const introForm = secByType(sections, 'intro-form');

    return blocks.map(b => {
        const type = String(b.type);
        const cfg = { ...(b.config || b.properties || {}) };
        if (type === 'hero-block') {
            if (introTitle?.content?.titleHtml) cfg.titleHtml = introTitle.content.titleHtml;
            if (introDesc?.content?.text) cfg.subtitleHtml = introDesc.content.text;
            if (introImg?.content?.imageUrl) cfg.imageUrl = introImg.content.imageUrl;
            if (introImg?.content?.imageAlt) cfg.imageAlt = introImg.content.imageAlt;
            if (header?.content?.logoUrl) cfg.logoUrl = header.content.logoUrl;
            if (header?.content?.logoAlt) cfg.logoAlt = header.content.logoAlt;
            return { ...b, config: cfg, properties: cfg };
        }
        if (type === 'welcome-form-block') {
            if (introForm?.content?.formQuestion) cfg.questionLabel = introForm.content.formQuestion;
            if (introForm?.content?.namePlaceholder) cfg.placeholder = introForm.content.namePlaceholder;
            if (introForm?.content?.submitText) cfg.buttonText = introForm.content.submitText;
            return { ...b, config: cfg, properties: cfg };
        }
        return b;
    });
}

function hydrateQuestionFromV3(blocks, v3) {
    const sections = v3?.sections || [];
    const numberStr = getQuestionNumber(sections);
    const textStr = getQuestionText(sections);
    const opts = getOptions(sections);
    const minSel = getMinSelections(sections);

    return blocks.map(b => {
        if (String(b.type) !== 'question-block') return b;
        const cfg = { ...(b.config || b.properties || {}) };
        if (numberStr) cfg.questionNumber = numberStr;
        if (textStr) cfg.questionText = textStr;
        if (opts.length) cfg.options = opts;
        if (typeof minSel === 'number' && minSel > 0) cfg.requiredSelections = minSel;
        return { ...b, config: cfg, properties: cfg };
    });
}

function hydrateTransition19FromV3(blocks, v3) {
    const sections = v3?.sections || [];
    const hero = secByType(sections, 'transition-hero');
    const paragraphs = sections.filter(s => s?.type === 'text-inline').map(s => String(s?.content?.text || '')).filter(Boolean);
    const cta = sections.find(s => s?.type === 'CTAButton');

    return blocks.map(b => {
        if (String(b.type) !== 'transition.next') return b;
        const cfg = { ...(b.config || b.properties || {}) };
        if (hero?.content?.title) cfg.title = hero.content.title;
        cfg.paragraphs = paragraphs;
        if (cta?.content?.label) cfg.buttonLabel = cta.content.label;
        return { ...b, config: cfg, properties: cfg };
    });
}

function hydrateOfferResultFromV3(blocks, v3) {
    const sections = v3?.sections || [];
    const offer = v3?.offer || {};
    const ctaPrimary = sections.find(s => s?.id === 'cta-primary' && s?.type === 'CTAButton');
    const styleProfile = sections.find(s => s?.type === 'StyleProfileSection');
    const ctaLabel = ctaPrimary?.props?.text || 'Quero começar agora';
    const checkout = offer?.links?.checkout || offer?.checkout;
    const offerTitle = offer?.productName || 'Programa Especial';
    const offerDesc = offer?.description || 'Método completo para dominar seu estilo.';

    return blocks.map(b => {
        const type = String(b.type);
        const cfg = { ...(b.config || b.properties || {}) };
        if (type === 'offer.core') {
            cfg.title = offerTitle;
            cfg.description = offerDesc;
            if (checkout) cfg.ctaUrl = checkout;
            if (ctaLabel) cfg.ctaLabel = ctaLabel;
            return { ...b, config: cfg, properties: cfg };
        }
        if (type === 'result.secondaryList') {
            const titleFormat = styleProfile?.props?.progressBars?.titleFormat;
            if (titleFormat) cfg.title = titleFormat;
            return { ...b, config: cfg, properties: cfg };
        }
        return b;
    });
}

async function processStep(stepNum) {
    const key = `step-${String(stepNum).padStart(2, '0')}`;
    const v3Path = path.join(PUB_DIR, `${key}-v3.json`);
    const blocksPath = path.join(BLOCKS_DIR, `${key}.json`);

    const v3 = await readJson(v3Path);
    if (!v3) {
        console.log(`- ${key}: v3 não encontrado, pulando`);
        return;
    }
    const blocksJson = await readJson(blocksPath);
    if (!blocksJson) {
        console.log(`- ${key}: blocks v3.1 não encontrado, pulando`);
        return;
    }

    let changed = false;
    let blocks = Array.isArray(blocksJson.blocks) ? blocksJson.blocks : [];

    if (stepNum === 1) {
        const before = JSON.stringify(blocks);
        blocks = hydrateIntroFromV3(blocks, v3);
        changed = changed || JSON.stringify(blocks) !== before;
    }

    if (stepNum >= 2 && stepNum <= 18) {
        const before = JSON.stringify(blocks);
        blocks = hydrateQuestionFromV3(blocks, v3);
        changed = changed || JSON.stringify(blocks) !== before;
    }

    if (stepNum === 19) {
        const before = JSON.stringify(blocks);
        blocks = hydrateTransition19FromV3(blocks, v3);
        changed = changed || JSON.stringify(blocks) !== before;
    }

    if (stepNum === 20 || stepNum === 21) {
        const before = JSON.stringify(blocks);
        blocks = hydrateOfferResultFromV3(blocks, v3);
        changed = changed || JSON.stringify(blocks) !== before;
    }

    if (changed) {
        const out = { ...blocksJson, blocks };
        await writeJson(blocksPath, out);
        console.log(`✓ ${key}: atualizado`);
    } else {
        console.log(`= ${key}: sem mudanças`);
    }
}

async function main() {
    let updated = 0;
    for (let i = 1; i <= 21; i++) {
        await processStep(i).then(() => { updated++; }).catch(err => {
            console.warn(`! step-${String(i).padStart(2, '0')}: erro`, err?.message || err);
        });
    }
    console.log(`\nConcluído. Passos verificados: ${updated}`);
}

main().catch(err => {
    console.error('Erro fatal na hidratação:', err);
    process.exit(1);
});
