// Tipos canônicos
export type { Block, BlockProps } from './block.types';
export * from './editor.types';

// Reexport específico para manter o tipo union de BlockType do legado
export type { BlockType } from './editor';

// TODO: adicionar quiz.types e funnel.types quando disponíveis

// OBS: Evitamos reexportar arquivos legados aqui para não gerar ambiguidades.
// Os módulos antigos ainda podem ser importados diretamente de '@/types/Block' e '@/types/editor' durante a migração.
export * from './funnel';
