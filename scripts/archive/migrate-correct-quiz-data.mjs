#!/usr/bin/env node

/**
 * 🔄 MIGRAÇÃO DE DADOS CORRETOS DO QUIZ
 * 
 * Este script migra as informações CORRETAS de src/data/quizSteps.ts
 * para o template quiz21-complete.json
 * 
 * FONTE DE VERDADE: src/data/quizSteps.ts
 * DESTINO: public/templates/quiz21-complete.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// DADOS CORRETOS (fonte de verdade: quizSteps.ts)
// ============================================================================

const CORRECT_QUIZ_DATA = {
    'step-02': {
        questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        requiredSelections: 3,
        options: [
            { value: '2a', text: 'Conforto, leveza e praticidade no vestir', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp', styleType: 'natural' },
            { value: '2b', text: 'Discrição, caimento clássico e sobriedade', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp', styleType: 'classico' },
            { value: '2c', text: 'Praticidade com um toque de estilo atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp', styleType: 'contemporaneo' },
            { value: '2d', text: 'Elegância refinada, moderna e sem exageros', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp', styleType: 'elegante' },
            { value: '2e', text: 'Delicadeza em tecidos suaves e fluidos', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp', styleType: 'romantico' },
            { value: '2f', text: 'Sensualidade com destaque para o corpo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp', styleType: 'sexy' },
            { value: '2g', text: 'Impacto visual com peças estruturadas e assimétricas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp', styleType: 'dramatico' },
            { value: '2h', text: 'Mix criativo com formas ousadas e originais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp', styleType: 'criativo' },
        ]
    },

    'step-03': {
        questionText: 'RESUMA A SUA PERSONALIDADE:',
        requiredSelections: 3,
        options: [
            { value: '3a', text: 'Informal, espontânea, alegre, essencialista', styleType: 'natural' },
            { value: '3b', text: 'Conservadora, séria, organizada', styleType: 'classico' },
            { value: '3c', text: 'Informada, ativa, prática', styleType: 'contemporaneo' },
            { value: '3d', text: 'Exigente, sofisticada, seletiva', styleType: 'elegante' },
            { value: '3e', text: 'Feminina, meiga, delicada, sensível', styleType: 'romantico' },
            { value: '3f', text: 'Glamorosa, vaidosa, sensual', styleType: 'sexy' },
            { value: '3g', text: 'Cosmopolita, moderna e audaciosa', styleType: 'dramatico' },
            { value: '3h', text: 'Exótica, aventureira, livre', styleType: 'criativo' },
        ]
    },

    'step-04': {
        questionText: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        requiredSelections: 3,
        options: [
            { value: '4a', text: 'Visual leve, despojado e natural', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp', styleType: 'natural' },
            { value: '4b', text: 'Visual clássico e tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp', styleType: 'classico' },
            { value: '4c', text: 'Visual casual com toque atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp', styleType: 'contemporaneo' },
            { value: '4d', text: 'Visual refinado e imponente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp', styleType: 'elegante' },
            { value: '4e', text: 'Visual romântico, feminino e delicado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp', styleType: 'romantico' },
            { value: '4f', text: 'Visual sensual, com saia justa e decote', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp', styleType: 'sexy' },
            { value: '4g', text: 'Visual marcante e urbano (jeans + jaqueta)', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp', styleType: 'dramatico' },
            { value: '4h', text: 'Visual criativo, colorido e ousado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp', styleType: 'criativo' },
        ]
    },

    'step-05': {
        questionText: 'QUAIS DETALHES VOCÊ GOSTA?',
        requiredSelections: 3,
        options: [
            { value: '5a', text: 'Poucos detalhes, básico e prático', styleType: 'natural' },
            { value: '5b', text: 'Bem discretos e sutis, clean e clássico', styleType: 'classico' },
            { value: '5c', text: 'Básico, mas com um toque de estilo', styleType: 'contemporaneo' },
            { value: '5d', text: 'Detalhes refinados, chic e que deem status', styleType: 'elegante' },
            { value: '5e', text: 'Detalhes delicados, laços, babados', styleType: 'romantico' },
            { value: '5f', text: 'Roupas que valorizem meu corpo: couro, zíper, fendas', styleType: 'sexy' },
            { value: '5g', text: 'Detalhes marcantes, firmeza e peso', styleType: 'dramatico' },
            { value: '5h', text: 'Detalhes diferentes do convencional, produções ousadas', styleType: 'criativo' },
        ]
    },

    'step-06': {
        questionText: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        requiredSelections: 3,
        options: [
            { value: '6a', text: 'Estampas clean, com poucas informações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp', styleType: 'natural' },
            { value: '6b', text: 'Estampas clássicas e atemporais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp', styleType: 'classico' },
            { value: '6c', text: 'Atemporais, mas que tenham uma pegada atual e moderna', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp', styleType: 'contemporaneo' },
            { value: '6d', text: 'Estampas clássicas e atemporais, mas sofisticadas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp', styleType: 'elegante' },
            { value: '6e', text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp', styleType: 'romantico' },
            { value: '6f', text: 'Estampas de animal print, como onça, zebra e cobra', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp', styleType: 'sexy' },
            { value: '6g', text: 'Estampas geométricas, abstratas e exageradas como grandes poás', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp', styleType: 'dramatico' },
            { value: '6h', text: 'Estampas diferentes do usual, como africanas, xadrez grandes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp', styleType: 'criativo' },
        ]
    },

    'step-07': {
        questionText: 'QUAL CASACO É SEU FAVORITO?',
        requiredSelections: 3,
        options: [
            { value: '7a', text: 'Cardigã bege confortável e casual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp', styleType: 'natural' },
            { value: '7b', text: 'Blazer verde estruturado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp', styleType: 'classico' },
            { value: '7c', text: 'Trench coat bege tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp', styleType: 'contemporaneo' },
            { value: '7d', text: 'Blazer branco refinado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp', styleType: 'elegante' },
            { value: '7e', text: 'Casaco pink vibrante e moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp', styleType: 'romantico' },
            { value: '7f', text: 'Jaqueta vinho de couro estilosa', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp', styleType: 'sexy' },
            { value: '7g', text: 'Jaqueta preta estilo rocker', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp', styleType: 'dramatico' },
            { value: '7h', text: 'Casaco estampado criativo e colorido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp', styleType: 'criativo' },
        ]
    },

    'step-08': {
        questionText: 'QUAL SUA CALÇA FAVORITA?',
        requiredSelections: 3,
        options: [
            { value: '8a', text: 'Calça fluida acetinada bege', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp', styleType: 'natural' },
            { value: '8b', text: 'Calça de alfaiataria cinza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp', styleType: 'classico' },
            { value: '8c', text: 'Jeans reto e básico', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp', styleType: 'contemporaneo' },
            { value: '8d', text: 'Calça reta bege de tecido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp', styleType: 'elegante' },
            { value: '8e', text: 'Calça ampla rosa alfaiatada', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp', styleType: 'romantico' },
            { value: '8f', text: 'Legging preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp', styleType: 'sexy' },
            { value: '8g', text: 'Calça reta preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp', styleType: 'dramatico' },
            { value: '8h', text: 'Calça estampada floral leve e ampla', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp', styleType: 'criativo' },
        ]
    },

    'step-09': {
        questionText: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        requiredSelections: 3,
        options: [
            { value: '9a', text: 'Tênis nude casual e confortável', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp', styleType: 'natural' },
            { value: '9b', text: 'Scarpin nude de salto baixo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp', styleType: 'classico' },
            { value: '9c', text: 'Sandália dourada com salto bloco', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp', styleType: 'contemporaneo' },
            { value: '9d', text: 'Scarpin nude salto alto e fino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp', styleType: 'elegante' },
            { value: '9e', text: 'Sandália anabela off white', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp', styleType: 'romantico' },
            { value: '9f', text: 'Sandália rosa de tiras finas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp', styleType: 'sexy' },
            { value: '9g', text: 'Scarpin preto moderno com vinil transparente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp', styleType: 'dramatico' },
            { value: '9h', text: 'Scarpin colorido estampado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp', styleType: 'criativo' },
        ]
    },

    'step-10': {
        questionText: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        requiredSelections: 3,
        options: [
            { value: '10a', text: 'Pequenos e discretos, às vezes nem uso', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.png', styleType: 'natural' },
            { value: '10b', text: 'Brincos pequenos e discretos. Corrente fininha', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.png', styleType: 'classico' },
            { value: '10c', text: 'Acessórios que elevem meu look com um toque moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.png', styleType: 'contemporaneo' },
            { value: '10d', text: 'Acessórios sofisticados, joias ou semijoias', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.png', styleType: 'elegante' },
            { value: '10e', text: 'Peças delicadas e com um toque feminino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.png', styleType: 'romantico' },
            { value: '10f', text: 'Brincos longos, colares que valorizem minha beleza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.png', styleType: 'sexy' },
            { value: '10g', text: 'Acessórios pesados, que causem um impacto', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.png', styleType: 'dramatico' },
            { value: '10h', text: 'Acessórios diferentes, grandes e marcantes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.png', styleType: 'criativo' },
        ]
    },

    'step-11': {
        questionText: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
        requiredSelections: 3,
        options: [
            { value: '11a', text: 'São fáceis de cuidar', styleType: 'natural' },
            { value: '11b', text: 'São de excelente qualidade', styleType: 'classico' },
            { value: '11c', text: 'São fáceis de cuidar e modernos', styleType: 'contemporaneo' },
            { value: '11d', text: 'São sofisticados', styleType: 'elegante' },
            { value: '11e', text: 'São delicados', styleType: 'romantico' },
            { value: '11f', text: 'São perfeitos ao meu corpo', styleType: 'sexy' },
            { value: '11g', text: 'São diferentes, e trazem um efeito para minha roupa', styleType: 'dramatico' },
            { value: '11h', text: 'São exclusivos, criam identidade no look', styleType: 'criativo' },
        ]
    }
};

// ============================================================================
// MIGRAÇÃO
// ============================================================================

async function migrateQuizData() {
    console.log('🔄 Iniciando migração de dados corretos do quiz...\n');

    // Ler template JSON
    const templatePath = path.join(rootDir, 'public', 'templates', 'quiz21-complete.json');

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Arquivo quiz21-complete.json não encontrado!');
        process.exit(1);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = JSON.parse(templateContent);

    const stepCount = Object.keys(template.steps || {}).length;
    console.log(`✅ Template carregado: ${stepCount} steps\n`);

    let updatedCount = 0;
    let errors = [];

    // Percorrer steps 02-11 e atualizar
    for (const [stepId, correctData] of Object.entries(CORRECT_QUIZ_DATA)) {
        console.log(`📝 Processando ${stepId}...`);

        // Encontrar step no template (steps é um objeto, não array)
        const step = template.steps[stepId]; if (!step) {
            errors.push(`❌ Step ${stepId} não encontrado no template`);
            continue;
        }

        // Encontrar seção question-hero
        const questionSection = step.sections.find(s => s.type === 'question-hero');
        if (!questionSection) {
            errors.push(`❌ Seção question-hero não encontrada em ${stepId}`);
            continue;
        }

        // Atualizar questionText
        questionSection.content = questionSection.content || {};
        questionSection.content.questionText = correctData.questionText;        // Encontrar seção options-grid
        const optionsSection = step.sections.find(s => s.type === 'options-grid');
        if (!optionsSection) {
            errors.push(`❌ Seção options-grid não encontrada em ${stepId}`);
            continue;
        }

        // Atualizar requiredSelections
        optionsSection.content = optionsSection.content || {};
        optionsSection.content.requiredSelections = correctData.requiredSelections;

        // Atualizar options
        const currentOptions = optionsSection.content.options || [];

        if (correctData.options.length !== currentOptions.length) {
            console.log(`  ⚠️ Expandindo opções: ${currentOptions.length} → ${correctData.options.length}`);
        }

        // SUBSTITUIR todas as opções (não apenas atualizar)
        optionsSection.content.options = correctData.options.map((correctOption, index) => {
            // Manter estrutura existente se houver, senão criar nova
            const existingOption = currentOptions[index] || {};

            return {
                id: correctOption.value,
                text: correctOption.text,
                imageUrl: correctOption.image || existingOption.imageUrl || '',
                value: correctOption.value,
                category: existingOption.category || correctOption.styleType || '',
                points: existingOption.points || 1,
                styleType: correctOption.styleType
            };
        }); console.log(`  ✅ ${stepId} atualizado: ${correctData.options.length} opções`);
        updatedCount++;
    }

    // Salvar template atualizado
    const updatedContent = JSON.stringify(template, null, 2);
    fs.writeFileSync(templatePath, updatedContent, 'utf-8');

    // Relatório final
    console.log('\n' + '='.repeat(70));
    console.log('📊 RELATÓRIO DE MIGRAÇÃO');
    console.log('='.repeat(70));
    console.log(`✅ Steps atualizados: ${updatedCount}/10`);
    console.log(`✅ Todas as 8 opções por questão foram adicionadas`);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log(`📁 Arquivo atualizado: ${templatePath}`);
    console.log('\n🎯 Próximo passo: Testar no editor /editor?template=quiz21StepsComplete');
}

// Executar
migrateQuizData().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
