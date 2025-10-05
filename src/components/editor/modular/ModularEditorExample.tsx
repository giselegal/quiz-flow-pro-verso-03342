/**
 * 🚀 EXEMPLO DE USO DO SISTEMA MODULAR
 * 
 * Demonstração de como integrar o editor modular
 */

import React, { useState } from 'react';
import ModernModularEditor from './ModernModularEditor';
import { ModularQuizStep, ModularQuizFunnel } from '@/types/modular-editor';

interface ModularEditorExampleProps {
    funnelId?: string;
}

// Funil completo de 21 etapas baseado nos dados do QUIZ_STEPS
export const exampleFunnel: ModularQuizFunnel = {
    id: 'gisele_galvao_quiz',
    name: 'Quiz de Estilo Pessoal - Gisele Galvão',
    title: 'Quiz de Estilo Pessoal - Gisele Galvão',
    description: 'Quiz completo de 21 etapas para descobrir seu estilo pessoal e personalidade de vestir',
    steps: [
        // ETAPA 1 - INTRODUÇÃO
        {
            id: 'step-1',
            name: 'Introdução',
            title: 'Introdução',
            type: 'intro',
            order: 1,
            components: [
                {
                    id: 'header_1',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'image_intro',
                    type: 'image',
                    props: {
                        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
                        alt: 'Desordem e Reflexão',
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: 'md',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'title_intro',
                    type: 'title',
                    props: {
                        text: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com você.',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                        className: 'playfair-display',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'form_field_name',
                    type: 'form-field',
                    props: {
                        label: 'Como posso te chamar?',
                        placeholder: 'Digite seu primeiro nome aqui...',
                        type: 'text',
                        required: true,
                        name: 'userName',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'button_start',
                    type: 'button',
                    props: {
                        text: 'Quero Descobrir meu Estilo Agora!',
                        variant: 'solid',
                        colorScheme: 'brand',
                        size: 'lg',
                        isFullWidth: true,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 2 - PERGUNTA 1 DE 10
        {
            id: 'step-2',
            name: 'Pergunta 1 de 10',
            title: 'Pergunta 1 de 10',
            type: 'question',
            order: 2,
            components: [
                {
                    id: 'header_2',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 10,
                    },
                    style: {},
                },
                {
                    id: 'title_q1',
                    type: 'title',
                    props: {
                        text: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q1_instruction',
                    type: 'text',
                    props: {
                        text: '1 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q1',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Conforto, leveza e praticidade no vestir', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp' },
                            { id: 'classico', text: 'Discrição, caimento clássico e sobriedade', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp' },
                            { id: 'contemporaneo', text: 'Praticidade com um toque de estilo atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp' },
                            { id: 'elegante', text: 'Elegância refinada, moderna e sem exageros', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp' },
                            { id: 'romantico', text: 'Delicadeza em tecidos suaves e fluidos', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp' },
                            { id: 'sexy', text: 'Sensualidade com destaque para o corpo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp' },
                            { id: 'dramatico', text: 'Impacto visual com peças estruturadas e assimétricas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp' },
                            { id: 'criativo', text: 'Mix criativo com formas ousadas e originais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 3 - PERGUNTA 2 DE 10
        {
            id: 'step-3',
            name: 'Pergunta 2 de 10',
            title: 'Pergunta 2 de 10',
            type: 'question',
            order: 3,
            components: [
                {
                    id: 'header_3',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 20,
                    },
                    style: {},
                },
                {
                    id: 'title_q2',
                    type: 'title',
                    props: {
                        text: 'RESUMA A SUA PERSONALIDADE:',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q2_instruction',
                    type: 'text',
                    props: {
                        text: '2 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q2',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Informal, espontânea, alegre, essencialista' },
                            { id: 'classico', text: 'Conservadora, séria, organizada' },
                            { id: 'contemporaneo', text: 'Informada, ativa, prática' },
                            { id: 'elegante', text: 'Exigente, sofisticada, seletiva' },
                            { id: 'romantico', text: 'Feminina, meiga, delicada, sensível' },
                            { id: 'sexy', text: 'Glamorosa, vaidosa, sensual' },
                            { id: 'dramatico', text: 'Cosmopolita, moderna e audaciosa' },
                            { id: 'criativo', text: 'Exótica, aventureira, livre' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 4 - PERGUNTA 3 DE 10
        {
            id: 'step-4',
            name: 'Pergunta 3 de 10',
            title: 'Pergunta 3 de 10',
            type: 'question',
            order: 4,
            components: [
                {
                    id: 'header_4',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 30,
                    },
                    style: {},
                },
                {
                    id: 'title_q3',
                    type: 'title',
                    props: {
                        text: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q3_instruction',
                    type: 'text',
                    props: {
                        text: '3 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q3',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Visual leve, despojado e natural', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp' },
                            { id: 'classico', text: 'Visual clássico e tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp' },
                            { id: 'contemporaneo', text: 'Visual casual com toque atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp' },
                            { id: 'elegante', text: 'Visual refinado e imponente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp' },
                            { id: 'romantico', text: 'Visual romântico, feminino e delicado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp' },
                            { id: 'sexy', text: 'Visual sensual, com saia justa e decote', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp' },
                            { id: 'dramatico', text: 'Visual marcante e urbano (jeans + jaqueta)', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp' },
                            { id: 'criativo', text: 'Visual criativo, colorido e ousado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 5 - PERGUNTA 4 DE 10
        {
            id: 'step-5',
            name: 'Pergunta 4 de 10',
            title: 'Pergunta 4 de 10',
            type: 'question',
            order: 5,
            components: [
                {
                    id: 'header_5',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 40,
                    },
                    style: {},
                },
                {
                    id: 'title_q4',
                    type: 'title',
                    props: {
                        text: 'QUAIS DETALHES VOCÊ GOSTA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q4_instruction',
                    type: 'text',
                    props: {
                        text: '4 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q4',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Poucos detalhes, básico e prático' },
                            { id: 'classico', text: 'Bem discretos e sutis, clean e clássico' },
                            { id: 'contemporaneo', text: 'Básico, mas com um toque de estilo' },
                            { id: 'elegante', text: 'Detalhes refinados, chic e que deem status' },
                            { id: 'romantico', text: 'Detalhes delicados, laços, babados' },
                            { id: 'sexy', text: 'Roupas que valorizem meu corpo: couro, zíper, fendas' },
                            { id: 'dramatico', text: 'Detalhes marcantes, firmeza e peso' },
                            { id: 'criativo', text: 'Detalhes diferentes do convencional, produções ousadas' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 6 - PERGUNTA 5 DE 10
        {
            id: 'step-6',
            name: 'Pergunta 5 de 10',
            title: 'Pergunta 5 de 10',
            type: 'question',
            order: 6,
            components: [
                {
                    id: 'header_6',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 50,
                    },
                    style: {},
                },
                {
                    id: 'title_q5',
                    type: 'title',
                    props: {
                        text: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q5_instruction',
                    type: 'text',
                    props: {
                        text: '5 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q5',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Estampas clean, com poucas informações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp' },
                            { id: 'classico', text: 'Estampas clássicas e atemporais', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp' },
                            { id: 'contemporaneo', text: 'Atemporais, mas que tenham uma pegada atual e moderna', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp' },
                            { id: 'elegante', text: 'Estampas clássicas e atemporais, mas sofisticadas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp' },
                            { id: 'romantico', text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp' },
                            { id: 'sexy', text: 'Estampas de animal print, como onça, zebra e cobra', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp' },
                            { id: 'dramatico', text: 'Estampas geométricas, abstratas e exageradas como grandes poás', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp' },
                            { id: 'criativo', text: 'Estampas diferentes do usual, como africanas, xadrez grandes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 7 - PERGUNTA 6 DE 10
        {
            id: 'step-7',
            name: 'Pergunta 6 de 10',
            title: 'Pergunta 6 de 10',
            type: 'question',
            order: 7,
            components: [
                {
                    id: 'header_7',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 60,
                    },
                    style: {},
                },
                {
                    id: 'title_q6',
                    type: 'title',
                    props: {
                        text: 'QUAL CASACO É SEU FAVORITO?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q6_instruction',
                    type: 'text',
                    props: {
                        text: '6 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q6',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Cardigã bege confortável e casual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp' },
                            { id: 'classico', text: 'Blazer verde estruturado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp' },
                            { id: 'contemporaneo', text: 'Trench coat bege tradicional', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp' },
                            { id: 'elegante', text: 'Blazer branco refinado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp' },
                            { id: 'romantico', text: 'Casaco pink vibrante e moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp' },
                            { id: 'sexy', text: 'Jaqueta vinho de couro estilosa', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp' },
                            { id: 'dramatico', text: 'Jaqueta preta estilo rocker', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp' },
                            { id: 'criativo', text: 'Casaco estampado criativo e colorido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 8 - PERGUNTA 7 DE 10
        {
            id: 'step-8',
            name: 'Pergunta 7 de 10',
            title: 'Pergunta 7 de 10',
            type: 'question',
            order: 8,
            components: [
                {
                    id: 'header_8',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 70,
                    },
                    style: {},
                },
                {
                    id: 'title_q7',
                    type: 'title',
                    props: {
                        text: 'QUAL SUA CALÇA FAVORITA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q7_instruction',
                    type: 'text',
                    props: {
                        text: '7 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q7',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Calça fluida acetinada bege', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp' },
                            { id: 'classico', text: 'Calça de alfaiataria cinza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp' },
                            { id: 'contemporaneo', text: 'Jeans reto e básico', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp' },
                            { id: 'elegante', text: 'Calça reta bege de tecido', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp' },
                            { id: 'romantico', text: 'Calça ampla rosa alfaiatada', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp' },
                            { id: 'sexy', text: 'Legging preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp' },
                            { id: 'dramatico', text: 'Calça reta preta de couro', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp' },
                            { id: 'criativo', text: 'Calça estampada floral leve e ampla', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 9 - PERGUNTA 8 DE 10
        {
            id: 'step-9',
            name: 'Pergunta 8 de 10',
            title: 'Pergunta 8 de 10',
            type: 'question',
            order: 9,
            components: [
                {
                    id: 'header_9',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 80,
                    },
                    style: {},
                },
                {
                    id: 'title_q8',
                    type: 'title',
                    props: {
                        text: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q8_instruction',
                    type: 'text',
                    props: {
                        text: '8 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q8',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Tênis nude casual e confortável', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp' },
                            { id: 'classico', text: 'Scarpin nude de salto baixo', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp' },
                            { id: 'contemporaneo', text: 'Sandália dourada com salto bloco', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp' },
                            { id: 'elegante', text: 'Scarpin nude salto alto e fino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp' },
                            { id: 'romantico', text: 'Sandália anabela off white', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp' },
                            { id: 'sexy', text: 'Sandália rosa de tiras finas', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp' },
                            { id: 'dramatico', text: 'Scarpin preto moderno com vinil transparente', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp' },
                            { id: 'criativo', text: 'Scarpin colorido estampado', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 10 - PERGUNTA 9 DE 10
        {
            id: 'step-10',
            name: 'Pergunta 9 de 10',
            title: 'Pergunta 9 de 10',
            type: 'question',
            order: 10,
            components: [
                {
                    id: 'header_10',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 90,
                    },
                    style: {},
                },
                {
                    id: 'title_q9',
                    type: 'title',
                    props: {
                        text: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q9_instruction',
                    type: 'text',
                    props: {
                        text: '9 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q9',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'Pequenos e discretos, às vezes nem uso', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.png' },
                            { id: 'classico', text: 'Brincos pequenos e discretos. Corrente fininha', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.png' },
                            { id: 'contemporaneo', text: 'Acessórios que elevem meu look com um toque moderno', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.png' },
                            { id: 'elegante', text: 'Acessórios sofisticados, joias ou semijoias', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.png' },
                            { id: 'romantico', text: 'Peças delicadas e com um toque feminino', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.png' },
                            { id: 'sexy', text: 'Brincos longos, colares que valorizem minha beleza', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.png' },
                            { id: 'dramatico', text: 'Acessórios pesados, que causem um impacto', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.png' },
                            { id: 'criativo', text: 'Acessórios diferentes, grandes e marcantes', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.png' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'card',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 11 - PERGUNTA 10 DE 10
        {
            id: 'step-11',
            name: 'Pergunta 10 de 10',
            title: 'Pergunta 10 de 10',
            type: 'question',
            order: 11,
            components: [
                {
                    id: 'header_11',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: '#B89B7A',
                        allowReturn: true,
                        progressValue: 100,
                    },
                    style: {},
                },
                {
                    id: 'title_q10',
                    type: 'title',
                    props: {
                        text: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_q10_instruction',
                    type: 'text',
                    props: {
                        text: '10 de 10 • Selecione até 3 opções',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_q10',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'natural', text: 'São fáceis de cuidar' },
                            { id: 'classico', text: 'São de excelente qualidade' },
                            { id: 'contemporaneo', text: 'São fáceis de cuidar e modernos' },
                            { id: 'elegante', text: 'São sofisticados' },
                            { id: 'romantico', text: 'São delicados' },
                            { id: 'sexy', text: 'São perfeitos ao meu corpo' },
                            { id: 'dramatico', text: 'São diferentes, e trazem um efeito para minha roupa' },
                            { id: 'criativo', text: 'São exclusivos, criam identidade no look' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: true,
                        maxSelections: 3,
                        requiredSelections: 3,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 12 - TRANSIÇÃO
        {
            id: 'step-12',
            name: 'Transição',
            title: 'Transição',
            type: 'transition',
            order: 12,
            components: [
                {
                    id: 'header_12',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_transition',
                    type: 'title',
                    props: {
                        text: '🕐 Enquanto calculamos o seu resultado...',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_transition',
                    type: 'text',
                    props: {
                        text: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão.',
                        fontSize: 'lg',
                        textAlign: 'center',
                        color: 'gray.700',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'progress_bar',
                    type: 'progress-bar',
                    props: {
                        value: 0,
                        max: 100,
                        color: '#B89B7A',
                        animated: true,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: true,
                timeLimit: 3000,
            },
        },

        // ETAPA 13 - PERGUNTA ESTRATÉGICA 1
        {
            id: 'step-13',
            name: 'Pergunta Estratégica 1',
            title: 'Pergunta Estratégica 1',
            type: 'strategic-question',
            order: 13,
            components: [
                {
                    id: 'header_13',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_1',
                    type: 'title',
                    props: {
                        text: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_1',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'desconectada', text: 'Me sinto desconectada da mulher que sou hoje' },
                            { id: 'duvidas', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
                            { id: 'as-vezes-acerto', text: 'Às vezes acerto, às vezes erro' },
                            { id: 'segura-evoluir', text: 'Me sinto segura, mas sei que posso evoluir' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 14 - PERGUNTA ESTRATÉGICA 2
        {
            id: 'step-14',
            name: 'Pergunta Estratégica 2',
            title: 'Pergunta Estratégica 2',
            type: 'strategic-question',
            order: 14,
            components: [
                {
                    id: 'header_14',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_2',
                    type: 'title',
                    props: {
                        text: 'O que mais te desafia na hora de se vestir?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_2',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'combinar-pecas', text: 'Tenho peças, mas não sei como combiná-las' },
                            { id: 'comprar-impulso', text: 'Compro por impulso e me arrependo depois' },
                            { id: 'imagem-nao-reflete', text: 'Minha imagem não reflete quem eu sou' },
                            { id: 'perco-tempo', text: 'Perco tempo e acabo usando sempre os mesmos looks' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 15 - PERGUNTA ESTRATÉGICA 3
        {
            id: 'step-15',
            name: 'Pergunta Estratégica 3',
            title: 'Pergunta Estratégica 3',
            type: 'strategic-question',
            order: 15,
            components: [
                {
                    id: 'header_15',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_3',
                    type: 'title',
                    props: {
                        text: 'Com que frequência você se pega pensando: "Com que roupa eu vou?" — mesmo com o guarda-roupa cheio?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_3',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'quase-todos-dias', text: 'Quase todos os dias — é sempre uma indecisão' },
                            { id: 'compromissos-importantes', text: 'Sempre que tenho um compromisso importante' },
                            { id: 'as-vezes-limitada', text: 'Às vezes, mas me sinto limitada nas escolhas' },
                            { id: 'raramente-segura', text: 'Raramente — já me sinto segura ao me vestir' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 16 - PERGUNTA ESTRATÉGICA 4
        {
            id: 'step-16',
            name: 'Pergunta Estratégica 4',
            title: 'Pergunta Estratégica 4',
            type: 'strategic-question',
            order: 16,
            components: [
                {
                    id: 'header_16',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_4',
                    type: 'title',
                    props: {
                        text: 'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_4',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'sim-quero', text: 'Sim! Se existisse algo assim, eu quero' },
                            { id: 'sim-momento-certo', text: 'Sim, mas teria que ser no momento certo' },
                            { id: 'tenho-duvidas', text: 'Tenho dúvidas se funcionaria pra mim' },
                            { id: 'nao-prefiro-continuar', text: 'Não, prefiro continuar como estou' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 17 - PERGUNTA ESTRATÉGICA 5
        {
            id: 'step-17',
            name: 'Pergunta Estratégica 5',
            title: 'Pergunta Estratégica 5',
            type: 'strategic-question',
            order: 17,
            components: [
                {
                    id: 'header_17',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_5',
                    type: 'title',
                    props: {
                        text: 'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_5',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'sim-vale-muito', text: 'Sim! Por esse resultado, vale muito' },
                            { id: 'sim-se-certeza', text: 'Sim, mas só se eu tiver certeza de que funciona pra mim' },
                            { id: 'talvez-depende', text: 'Talvez — depende do que está incluso' },
                            { id: 'nao-nao-pronta', text: 'Não, ainda não estou pronta para investir' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 18 - PERGUNTA ESTRATÉGICA 6
        {
            id: 'step-18',
            name: 'Pergunta Estratégica 6',
            title: 'Pergunta Estratégica 6',
            type: 'strategic-question',
            order: 18,
            components: [
                {
                    id: 'header_18',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_strategic_6',
                    type: 'title',
                    props: {
                        text: 'Qual desses resultados você mais gostaria de alcançar?',
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'options_strategic_6',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'montar-looks-facilidade', text: 'Montar looks com mais facilidade e confiança' },
                            { id: 'usar-que-tenho', text: 'Usar o que já tenho e me sentir estilosa' },
                            { id: 'comprar-consciencia', text: 'Comprar com mais consciência e sem culpa' },
                            { id: 'ser-admirada', text: 'Ser admirada pela imagem que transmito' }
                        ],
                        columns: 1,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                        maxSelections: 1,
                        requiredSelections: 1,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 19 - TRANSIÇÃO PARA RESULTADO
        {
            id: 'step-19',
            name: 'Transição para Resultado',
            title: 'Transição para Resultado',
            type: 'transition',
            order: 19,
            components: [
                {
                    id: 'header_19',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_transition_result',
                    type: 'title',
                    props: {
                        text: 'Obrigada por compartilhar.',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_transition_result',
                    type: 'text',
                    props: {
                        text: 'Agora vamos revelar seu estilo personalizado...',
                        fontSize: 'lg',
                        textAlign: 'center',
                        color: 'gray.700',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'progress_bar_result',
                    type: 'progress-bar',
                    props: {
                        value: 100,
                        max: 100,
                        color: '#B89B7A',
                        animated: true,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: true,
                timeLimit: 2000,
            },
        },

        // ETAPA 20 - RESULTADO
        {
            id: 'step-20',
            name: 'Resultado',
            title: 'Resultado',
            type: 'result',
            order: 20,
            components: [
                {
                    id: 'header_20',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_result',
                    type: 'title',
                    props: {
                        text: '{userName}, seu estilo predominante é:',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'result_display',
                    type: 'result-display',
                    props: {
                        resultType: 'style',
                        showAnimation: true,
                        showDescription: true,
                        showTips: true,
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'button_continue',
                    type: 'button',
                    props: {
                        text: 'Ver Minha Oferta Personalizada',
                        variant: 'solid',
                        colorScheme: 'brand',
                        size: 'lg',
                        isFullWidth: true,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },

        // ETAPA 21 - OFERTA
        {
            id: 'step-21',
            name: 'Oferta Personalizada',
            title: 'Oferta Personalizada',
            type: 'offer',
            order: 21,
            components: [
                {
                    id: 'header_21',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: false,
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'image_offer',
                    type: 'image',
                    props: {
                        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/offer_image_main_jkldsd.webp',
                        alt: 'Oferta Especial',
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: 'md',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'title_offer',
                    type: 'title',
                    props: {
                        text: '{userName}, encontramos a solução perfeita para você!',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_offer_description',
                    type: 'text',
                    props: {
                        text: 'Baseado nas suas respostas, preparamos uma oferta especial que vai transformar completamente sua relação com a moda e seu guarda-roupa.',
                        fontSize: 'lg',
                        textAlign: 'center',
                        color: 'gray.700',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'button_offer',
                    type: 'button',
                    props: {
                        text: 'Quero Transformar Meu Estilo Agora!',
                        variant: 'solid',
                        colorScheme: 'brand',
                        size: 'lg',
                        isFullWidth: true,
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_testimonial',
                    type: 'text',
                    props: {
                        text: '"Finalmente entendi o meu estilo e parei de gastar dinheiro com roupas que não combinavam comigo. Agora consigo montar looks com mais facilidade." - Márcia Silva, 38 anos',
                        fontSize: 'sm',
                        textAlign: 'center',
                        color: 'gray.600',
                        fontStyle: 'italic',
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: false,
                autoAdvance: false,
                timeLimit: 0,
            },
        },
    ],
    settings: {
        title: 'Quiz Modular de Exemplo',
        language: 'pt-BR',
        theme: {
            colors: {
                primary: '#0090FF',
                secondary: '#718096',
                accent: '#38A169',
                background: '#FFFFFF',
                text: '#1A202C',
            },
            fonts: {
                heading: 'Inter',
                body: 'Inter',
            },
            borderRadius: '8px',
            shadows: true,
        },
        allowBackNavigation: true,
        showProgressBar: true,
        saveProgress: true,
        resultCalculation: 'points',
        shuffleQuestions: false,
        showResults: true,
        collectEmail: false,
        collectName: false,
    },
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sistema_modular',
    version: 1,
};

export const ModularEditorExample: React.FC<ModularEditorExampleProps> = ({ funnelId }) => {
    const [currentStepId, setCurrentStepId] = useState('step_intro');
    const [showEditor, setShowEditor] = useState(true);

    const handleSave = (step: ModularQuizStep) => {
        console.log('💾 Etapa salva:', step);
        // Aqui você implementaria a lógica de salvamento
        // Por exemplo, enviar para uma API ou salvar no localStorage
    };

    const handlePreview = (step: ModularQuizStep) => {
        console.log('👁️ Preview da etapa:', step);
        // Aqui você implementaria a lógica de preview
        // Por exemplo, abrir em uma nova aba ou modal
    };

    const handleBack = () => {
        setShowEditor(false);
        // Aqui você voltaria para a lista de etapas ou dashboard
    };

    if (!showEditor) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>📋 Dashboard do Quiz</h2>
                <p>Aqui estaria o dashboard principal do quiz.</p>
                <button
                    onClick={() => setShowEditor(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0090ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    ✏️ Editar Etapa de Introdução
                </button>
            </div>
        );
    }

    return (
        <ModernModularEditor
            className=""
        />
    );
};

// Componente para demonstrar o uso em uma página Next.js
export const ModularEditorPage: React.FC = () => {
    return (
        <div>
            {/* 
        Para usar em uma página Next.js, adicione ao seu pages/editor/modular.tsx:
        
        import { ModularEditorExample } from '@/components/editor/modular/ModularEditorExample';
        
        export default function ModularEditorPage() {
          return <ModularEditorExample />;
        }
      */}
            <ModularEditorExample />
        </div>
    );
};

// Hook para facilitar o uso do editor modular
export const useModularEditor = () => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentStepId, setCurrentStepId] = useState<string>('');

    const openEditor = (stepId: string) => {
        setCurrentStepId(stepId);
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setCurrentStepId('');
    };

    const renderEditor = (props?: {
        onSave?: (step: ModularQuizStep) => void;
        onPreview?: (step: ModularQuizStep) => void;
    }) => {
        if (!isEditorOpen || !currentStepId) return null;

        return (
            <ModernModularEditor
                className=""
            />
        );
    };

    return {
        isEditorOpen,
        currentStepId,
        openEditor,
        closeEditor,
        renderEditor,
    };
};

export default ModularEditorExample;