/**
 * 🎯 EDITOR PERFORMANCE TESTS
 * 
 * Testes para identificar gargalos no carregamento do editor
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';

describe('Editor Performance - Step Loading', () => {
    it('should load QUIZ_STEPS data structure quickly', () => {
        const start = performance.now();

        const stepsData = { ...QUIZ_STEPS };
        const order = [...STEP_ORDER];

        const end = performance.now();
        const duration = end - start;

        console.log(`✅ QUIZ_STEPS load time: ${duration.toFixed(2)}ms`);

        expect(Object.keys(stepsData)).toHaveLength(21);
        expect(order).toHaveLength(21);
        expect(duration).toBeLessThan(10); // Should be instant
    });

    it('should build enriched blocks structure efficiently', () => {
        const start = performance.now();

        const enrichedSteps = STEP_ORDER.map((stepId, idx) => {
            const quizStep: any = (QUIZ_STEPS as any)[stepId];

            if (!quizStep) {
                return { stepId, blocks: [], time: 0 };
            }

            const stepStart = performance.now();
            const blocks: any[] = [];

            // Simular construção de blocks
            switch (quizStep.type) {
                case 'intro':
                    if (quizStep.title) blocks.push({ type: 'heading', content: { text: quizStep.title } });
                    if (quizStep.image) blocks.push({ type: 'image', content: { src: quizStep.image } });
                    if (quizStep.formQuestion) blocks.push({ type: 'form-input', content: { label: quizStep.formQuestion } });
                    blocks.push({ type: 'button', content: { text: quizStep.buttonText || 'Continuar' } });
                    break;

                case 'question':
                case 'strategic-question':
                    if (quizStep.questionText) blocks.push({ type: 'heading', content: { text: quizStep.questionText } });
                    blocks.push({ type: 'quiz-options', content: { options: quizStep.options || [] } });
                    break;

                case 'transition':
                case 'transition-result':
                    if (quizStep.title) blocks.push({ type: 'heading', content: { text: quizStep.title } });
                    if (quizStep.text) blocks.push({ type: 'text', content: { text: quizStep.text } });
                    if (quizStep.showContinueButton) blocks.push({ type: 'button' });
                    break;

                case 'result':
                    blocks.push({ type: 'result-header-inline', content: { title: quizStep.title } });
                    break;

                case 'offer':
                    if (quizStep.image) blocks.push({ type: 'image', content: { src: quizStep.image } });
                    const firstOffer = quizStep.offerMap ? Object.values(quizStep.offerMap)[0] as any : null;
                    blocks.push({ type: 'quiz-offer-cta-inline', content: { title: firstOffer?.title || 'Oferta' } });
                    break;
            }

            const stepEnd = performance.now();
            return {
                stepId,
                type: quizStep.type,
                blocks,
                time: stepEnd - stepStart
            };
        });

        const end = performance.now();
        const totalDuration = end - start;

        console.log(`\n📊 Block Building Performance:`);
        console.log(`Total time: ${totalDuration.toFixed(2)}ms`);
        console.log(`Average per step: ${(totalDuration / 21).toFixed(2)}ms`);

        const slowSteps = enrichedSteps.filter(s => s.time > 1);
        if (slowSteps.length > 0) {
            console.log(`\n⚠️ Slow steps (>1ms):`);
            slowSteps.forEach(s => {
                console.log(`  - ${s.stepId} (${s.type}): ${s.time.toFixed(2)}ms, ${s.blocks.length} blocks`);
            });
        }

        expect(enrichedSteps).toHaveLength(21);
        expect(totalDuration).toBeLessThan(100); // Should be very fast
    });

    it('should measure JSON stringification overhead', () => {
        const start = performance.now();

        const enrichedSteps = STEP_ORDER.map((stepId) => {
            const quizStep: any = (QUIZ_STEPS as any)[stepId];
            return {
                id: stepId,
                type: quizStep?.type,
                meta: quizStep
            };
        });

        const jsonStart = performance.now();
        const json = JSON.stringify(enrichedSteps);
        const jsonEnd = performance.now();

        const totalEnd = performance.now();

        console.log(`\n📊 Serialization Performance:`);
        console.log(`Data preparation: ${(jsonStart - start).toFixed(2)}ms`);
        console.log(`JSON.stringify: ${(jsonEnd - jsonStart).toFixed(2)}ms`);
        console.log(`JSON size: ${(json.length / 1024).toFixed(2)}KB`);
        console.log(`Total: ${(totalEnd - start).toFixed(2)}ms`);

        expect(json.length).toBeGreaterThan(0);
        expect(jsonEnd - jsonStart).toBeLessThan(50); // JSON serialization should be fast
    });

    it('should identify memory-heavy operations', () => {
        const start = performance.now();
        const memoryStart = (performance as any).memory?.usedJSHeapSize || 0;

        // Simular operações pesadas
        const largeArrays: any[] = [];
        for (let i = 0; i < 21; i++) {
            const stepId = STEP_ORDER[i];
            const quizStep = (QUIZ_STEPS as any)[stepId];

            // Simular clonagem profunda (operação comum em setState)
            const cloned = JSON.parse(JSON.stringify(quizStep));
            largeArrays.push(cloned);
        }

        const end = performance.now();
        const memoryEnd = (performance as any).memory?.usedJSHeapSize || 0;
        const memoryDelta = memoryEnd - memoryStart;

        console.log(`\n📊 Memory Impact:`);
        console.log(`Time: ${(end - start).toFixed(2)}ms`);
        if (memoryDelta > 0) {
            console.log(`Memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
        }

        expect(end - start).toBeLessThan(100);
    });

    it('should profile React component mount simulation', () => {
        const start = performance.now();

        // Simular mount de 21 steps
        const mountTimes: number[] = [];

        STEP_ORDER.forEach((stepId) => {
            const stepStart = performance.now();

            const quizStep: any = (QUIZ_STEPS as any)[stepId];

            // Simular operações de mount
            const state = {
                id: stepId,
                type: quizStep?.type,
                blocks: []
            };

            // Simular construção de blocks (como no useEffect)
            if (quizStep?.type === 'question') {
                (state.blocks as any) = [
                    { type: 'heading', content: { text: quizStep.questionText } },
                    { type: 'quiz-options', content: { options: quizStep.options || [] } }
                ];
            }

            const stepEnd = performance.now();
            mountTimes.push(stepEnd - stepStart);
        });

        const end = performance.now();
        const total = end - start;
        const avg = mountTimes.reduce((a, b) => a + b, 0) / mountTimes.length;
        const max = Math.max(...mountTimes);

        console.log(`\n📊 Component Mount Simulation:`);
        console.log(`Total: ${total.toFixed(2)}ms`);
        console.log(`Average per step: ${avg.toFixed(2)}ms`);
        console.log(`Max single step: ${max.toFixed(2)}ms`);

        expect(total).toBeLessThan(200);
        expect(avg).toBeLessThan(10);
    });
});

describe('Editor Performance - Block Rendering', () => {
    it('should measure quiz-options block complexity', () => {
        const start = performance.now();

        const questionSteps = STEP_ORDER
            .map(id => (QUIZ_STEPS as any)[id])
            .filter(step => step?.type === 'question' || step?.type === 'strategic-question');

        const optionsCounts = questionSteps.map(step => ({
            id: step.id || 'unknown',
            type: step.type,
            optionsCount: step.options?.length || 0,
            hasImages: step.options?.some((opt: any) => opt.image) || false
        }));

        const end = performance.now();

        console.log(`\n📊 Quiz Options Complexity:`);
        console.log(`Question steps: ${questionSteps.length}`);
        console.log(`Time to analyze: ${(end - start).toFixed(2)}ms`);

        optionsCounts.forEach(info => {
            console.log(`  ${info.type}: ${info.optionsCount} options, images: ${info.hasImages}`);
        });

        const totalOptions = optionsCounts.reduce((sum, info) => sum + info.optionsCount, 0);
        const avgOptions = totalOptions / optionsCounts.length;

        console.log(`\nTotal options across all questions: ${totalOptions}`);
        console.log(`Average options per question: ${avgOptions.toFixed(1)}`);

        expect(questionSteps).toHaveLength(16); // 10 regular + 6 strategic
        expect(avgOptions).toBeGreaterThan(0);
    });

    it('should identify potential render bottlenecks', () => {
        const analysis = {
            stepsWithImages: 0,
            stepsWithHTML: 0,
            stepsWithManyOptions: 0,
            totalBlocks: 0
        };

        STEP_ORDER.forEach(stepId => {
            const step: any = (QUIZ_STEPS as any)[stepId];
            if (!step) return;

            // Contar blocks potenciais
            let blockCount = 0;

            if (step.title) blockCount++;
            if (step.text) blockCount++;
            if (step.image) {
                blockCount++;
                analysis.stepsWithImages++;
            }
            if (step.questionText) blockCount++;
            if (step.formQuestion) blockCount++;
            if (step.buttonText || step.showContinueButton) blockCount++;
            if (step.options) {
                blockCount++;
                if (step.options.length > 6) {
                    analysis.stepsWithManyOptions++;
                }
            }
            if (step.offerMap) blockCount += 2;

            // Detectar HTML
            if (step.title?.includes('<') || step.questionText?.includes('<')) {
                analysis.stepsWithHTML++;
            }

            analysis.totalBlocks += blockCount;
        });

        console.log(`\n📊 Render Complexity Analysis:`);
        console.log(`Total blocks: ${analysis.totalBlocks}`);
        console.log(`Avg blocks per step: ${(analysis.totalBlocks / 21).toFixed(1)}`);
        console.log(`Steps with images: ${analysis.stepsWithImages}`);
        console.log(`Steps with HTML: ${analysis.stepsWithHTML}`);
        console.log(`Steps with many options (>6): ${analysis.stepsWithManyOptions}`);

        expect(analysis.totalBlocks).toBeGreaterThan(0);
    });
});
