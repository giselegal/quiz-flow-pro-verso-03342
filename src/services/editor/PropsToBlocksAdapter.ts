// src/services/editor/PropsToBlocksAdapter.ts
import { normalizeOptions, normalizeOfferMap } from '@/utils/normalize';

export const PropsToBlocksAdapter = {
  applyPropsToBlocks: (step: any) => {
    const { id: stepId, type } = step;
    const props = (step.meta && step.meta.props) ? step.meta.props : (step.props || {});
    const blocks: any[] = [];
    let order = 0;

    const push = (block: any) => {
      const blockId = block.id || `${stepId}-block-${block.type}-${blocks.length + 1}`;
      blocks.push({
        id: blockId,
        parentId: block.parentId ?? null,
        type: block.type,
        order: order++,
        content: block.content || {},
        properties: block.properties || {},
      });
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
        const offers = normalizeOfferMap(props.offerMap || {});
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
