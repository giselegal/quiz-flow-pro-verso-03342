import { BLOCK_REGISTRY } from '@/components/editor/blocks/registry';
import { step21BlockDefinition } from './step21OfferBlockDefinition';

// Registrar o bloco da etapa 21
BLOCK_REGISTRY.register('step-21-offer', step21BlockDefinition);

// Re-exportar o registro atualizado
export { BLOCK_REGISTRY };
