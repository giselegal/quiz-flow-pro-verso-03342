import { useRef } from 'react';

export function useRenderCount(label: string) {
  const countRef = useRef(0);
  countRef.current += 1;
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug(`[render] ${label}: #${countRef.current}`);
  }
  return countRef.current;
}

export default useRenderCount;
