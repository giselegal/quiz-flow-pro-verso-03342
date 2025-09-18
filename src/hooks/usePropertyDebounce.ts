/**
 * 🎯 usePropertyDebounce - Hook para debounce de propriedades
 * Gerencia atualizações de propriedades com debounce inteligente
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';

interface UsePropertyDebounceOptions {
  debounceMs?: number;
  onUpdate?: (value: any) => void;
  immediate?: boolean; // Para mudanças que devem ser aplicadas imediatamente
}

export const usePropertyDebounce = <T = any>(
  initialValue: T,
  options: UsePropertyDebounceOptions = {}
) => {
  const { debounceMs = 300, onUpdate, immediate = false } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isChanging, setIsChanging] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const { debounce, cancel } = useOptimizedScheduler();
  const keyRef = useRef<string>(`prop-debounce-${Math.random().toString(36).slice(2)}`);
  const key = keyRef.current;

  const updateValue = useCallback(
    (newValue: T, forceImmediate = false) => {
      setValue(newValue);
      setIsChanging(true);
      setHasChanged(false);

      if (immediate || forceImmediate) {
        setDebouncedValue(newValue);
        setIsChanging(false);
        setHasChanged(true);
        onUpdate?.(newValue);
      } else {
        debounce(`${key}:update`, () => {
          setDebouncedValue(newValue);
          setIsChanging(false);
          setHasChanged(true);
          onUpdate?.(newValue);
        }, debounceMs);
      }
    },
    [debounceMs, onUpdate, immediate, debounce, key]
  );

  const resetValue = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsChanging(false);
    setHasChanged(false);
  cancel(`${key}:update`);
  }, [initialValue]);

  useEffect(() => {
    return () => cancel(`${key}:update`);
  }, [cancel, key]);

  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue);
      setDebouncedValue(initialValue);
      setIsChanging(false);
      setHasChanged(false);
    }
  }, [initialValue]);

  return {
    value,
    debouncedValue,
    isChanging,
    hasChanged,
    updateValue,
    resetValue,
  };
};

export default usePropertyDebounce;
