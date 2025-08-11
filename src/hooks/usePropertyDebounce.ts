/**
 * 🎯 usePropertyDebounce - Hook para debounce de propriedades
 * Gerencia atualizações de propriedades com debounce inteligente
 */

import { useCallback, useEffect, useRef, useState } from "react";

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
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateValue = useCallback(
    (newValue: T, forceImmediate = false) => {
      setValue(newValue);
      setIsChanging(true);
      setHasChanged(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (immediate || forceImmediate) {
        setDebouncedValue(newValue);
        setIsChanging(false);
        setHasChanged(true);
        onUpdate?.(newValue);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDebouncedValue(newValue);
          setIsChanging(false);
          setHasChanged(true);
          onUpdate?.(newValue);
        }, debounceMs);
      }
    },
    [debounceMs, onUpdate, immediate]
  );

  const resetValue = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsChanging(false);
    setHasChanged(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
