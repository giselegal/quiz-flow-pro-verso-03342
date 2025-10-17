// src/services/editor/PropsToBlocksAdapter.ts
import { normalizeOptions, normalizeOfferMap, genId } from '@/utils/normalize';

function ensureBlockId(block: any, stepId: string, index: number) {
  // Se id já existir e for string, use; senão crie determinístico com prefixo stepId
  if (block?.id && typeof block.id === 'string' && block.id.trim().length) return block.id;
  // prefer deterministic: stepId + tipo + index
  const safeType = (block?.type || 'block').toString().replace(/[^\w-]/g, '');
  return `${stepId}-${safeType}-${index + 1}`;
}

export const PropsToBlocksAdapter = {
  applyPropsToBlocks: (step: any) => {
    const { id: stepId, type } = step;
    const props = (step.meta && step.meta.props) ? step.meta.props : (step.props || {});
    const blocks: any[] = [];
    let order = 0;

    const push = (block: any) => {
      const made = {
        id: ensureBlockId(block, stepId, blocks.length),
        parentId: block.parentId ?? null,
        type: block.type,
        order: order++,
        content: block.content || {},
        properties: block.properties || {},
      };
      // Garantir unicidade mesmo em casos limite
      if (blocks.some(b => b.id === made.id)) {
        made.id = `${made.id}-${genId('dup')}`;
      }
      blocks.push(made);
    };

    switch (type) {
      case 'intro': {
        push({ type: 'heading', content: { text: props.title || 'Bem-vindo' }, properties: { level: 2 } });
        if (props.subtitle) push({ type: 'text', content: { text: props.subtitle } });
        if (props.logoUrl) push({ type: 'image', content: { src: props.logoUrl, alt: 'Logo' } });
        push({ type: 'button', content: { text: props.cta || 'Começar' }, properties: { action: 'next-step' } });
        break;
      }
      case 'question': {
        push({ type: 'heading', content: { text: props.question || 'Pergunta' }, properties: { level: 3 } });
        const options = normalizeOptions(props.options || [], stepId);
        push({
          type: 'quiz-options',
          content: { options },
          properties: {
            multiSelect: !!props.multiSelect,
            requiredSelections: Number(props.requiredSelections ?? (props.multiSelect ? 1 : 1)),
            maxSelections: Number(props.maxSelections ?? (props.multiSelect ? 3 : 1)),
            autoAdvance: props.autoAdvance !== false,
            showNextButton: props.showNextButton !== false,
            nextButtonText: props.nextButtonText || 'Avançar',
            showImages: props.showImages !== false,
            layout: props.layout || 'auto',
          },
        });
        break;
      }
      case 'strategic-question': {
        push({ type: 'heading', content: { text: props.question || 'Pergunta estratégica' }, properties: { level: 3 } });
        const options = normalizeOptions(props.options || [], stepId);
        push({
          type: 'quiz-options',
          content: { options },
          properties: { multiSelect: false, requiredSelections: 1, maxSelections: 1, autoAdvance: props.autoAdvance !== false },
        });
        break;
      }
      case 'transition':
      case 'transition-result': {
        if (props.title) push({ type: 'heading', content: { text: props.title }, properties: { level: 2, allowHtml: !!props.allowHtml } });
        if (props.text) push({ type: 'text', content: { text: props.text } });
        if (props.showContinueButton) push({ type: 'button', content: { text: props.continueButtonText || 'Continuar' }, properties: { action: 'next-step' } });
        break;
      }
      case 'result': {
        push({ type: 'result-header-inline', content: { title: props.titleTemplate || 'Seu resultado' }, properties: {} });
        if (props.showPrimaryStyleCard) {
          push({ type: 'style-card-inline', content: { styleId: props.primaryStyleId }, properties: {} });
        }
        if (props.showSecondaryStyles) {
          push({ type: 'secondary-styles', content: { count: props.secondaryStylesCount || 2 }, properties: {} });
        }
        if (props.offersToShow && props.offersToShow.length) {
          props.offersToShow.forEach((key: string) => push({ type: 'quiz-offer-cta-inline', content: { offerKey: key }, properties: {} }));
        }
        break;
      }
      case 'offer': {
        const offers = normalizeOfferMap(props.offerMap || {}, stepId);
        Object.keys(offers).forEach((k) => {
          const o = offers[k];
          push({
            type: 'quiz-offer-cta-inline',
            content: { title: o.title, description: o.description, buttonText: o.ctaLabel, price: o.price, image: o.image },
            properties: { offerKey: o.id },
          });
        });
        break;
      }
      default: {
        return step; // mantem como está
      }
    }

    return { ...step, blocks };
  },
};

export type PropsToBlocksAdapterType = typeof PropsToBlocksAdapter;
