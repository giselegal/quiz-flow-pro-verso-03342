// Tipos canônicos
export * from './block.types';
export * from './editor.types';

// TODO: adicionar quiz.types e funnel.types quando disponíveis

// OBS: Evitamos reexportar arquivos legados aqui para não gerar ambiguidades.
// Os módulos antigos ainda podem ser importados diretamente de '@/types/Block' e '@/types/editor' durante a migração.
export * from './funnel';
