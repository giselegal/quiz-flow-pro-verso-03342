// Debug test for AICache
import { AICache } from './src/services/AICache.ts';

const cache = new AICache();

console.log('🐛 Iniciando debug do cache');

// Set some data
cache.set('key1', { data: 'test1' });
cache.set('key2', { data: 'test2' });

console.log('🐛 Dados definidos:');
console.log('key1:', cache.get('key1'));
console.log('key2:', cache.get('key2'));

// Clear cache
console.log('🐛 Limpando cache...');
cache.clear();

console.log('🐛 Após limpeza:');
console.log('key1:', cache.get('key1'));
console.log('key2:', cache.get('key2'));

console.log('🐛 localStorage keys:', Object.keys(localStorage));