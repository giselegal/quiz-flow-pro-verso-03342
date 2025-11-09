// src/utils/normalizeByType.ts
import { normalizeOptions, normalizeOfferMap } from './normalize';

export function normalizeByType(type: string, props: any, stepId: string) {
  if (!props) return props;
  switch (type) {
    case 'question':
      return {
        ...props,
        options: normalizeOptions(props.options || [], stepId),
      };
    case 'strategic-question':
      return {
        ...props,
        options: normalizeOptions(props.options || [], stepId),
      };
    case 'offer':
      return {
        ...props,
        offerMap: normalizeOfferMap(props.offerMap || {}),
      };
    default:
      return { ...props };
  }
}
