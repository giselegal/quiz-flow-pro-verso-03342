import { describe, it, expect, beforeEach } from 'vitest';
import { logger } from '../logger';

// Vamos mockar console.log temporariamente

describe('logger', () => {
    let outputs: any[] = [];
    const orig = console.log;
    beforeEach(() => {
        outputs = [];
        // @ts-ignore
        console.log = (msg: string) => { outputs.push(msg); };
        process.env.LOG_LEVEL = 'debug';
    });

    afterAll(() => {
        console.log = orig;
    });

    it('emite JSON válido com campos básicos', () => {
        logger.info('test.event', { foo: 'bar' });
        expect(outputs.length).toBe(1);
        const parsed = JSON.parse(outputs[0]);
        expect(parsed.msg).toBe('test.event');
        expect(parsed.level).toBe('info');
        expect(parsed.foo).toBe('bar');
        expect(parsed.ts).toBeTruthy();
    });

    it('filtra níveis abaixo do threshold', () => {
        process.env.LOG_LEVEL = 'warn';
        logger.debug('will.skip');
        logger.info('will.skip2');
        logger.error('will.log');
        const parsed = outputs.map(o => JSON.parse(o));
        expect(parsed.some(p => p.msg === 'will.log')).toBe(true);
        expect(parsed.some(p => p.msg === 'will.skip')).toBe(false);
        expect(parsed.some(p => p.msg === 'will.skip2')).toBe(false);
    });

    it('logEvent inclui evt', () => {
        logger.logEvent('runtime.advance', { sessionId: 'abc' });
        const parsed = JSON.parse(outputs[0]);
        expect(parsed.evt).toBe('runtime.advance');
        expect(parsed.sessionId).toBe('abc');
    });
});
