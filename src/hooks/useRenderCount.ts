import { useRef } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export function useRenderCount(label: string) {
  const countRef = useRef(0);
  countRef.current += 1;
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    appLogger.debug(`[render] ${label}: #${countRef.current}`);
  }
  return countRef.current;
}

export default useRenderCount;
