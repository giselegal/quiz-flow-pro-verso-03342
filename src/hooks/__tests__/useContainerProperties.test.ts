import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContainerProperties } from '../useContainerProperties';

describe('useContainerProperties', () => {
  describe('memoization', () => {
    it('should memoize results when properties do not change', () => {
      const properties = {
        containerWidth: 'medium' as const,
        spacing: 'normal' as const,
        backgroundColor: 'white' as const
      };

      const { result, rerender } = renderHook(
        (props) => useContainerProperties(props),
        { initialProps: properties }
      );

      const firstResult = result.current;
      
      // Re-render with same properties
      rerender(properties);
      const secondResult = result.current;

      // Should return the same reference due to memoization
      expect(firstResult).toBe(secondResult);
    });

    it('should recalculate when properties change', () => {
      const initialProps = {
        containerWidth: 'medium' as const,
        spacing: 'normal' as const
      };

      const { result, rerender } = renderHook(
        (props) => useContainerProperties(props),
        { initialProps: initialProps }
      );

      const firstResult = result.current;
      
      // Re-render with different properties
      rerender({
        containerWidth: 'large' as const,
        spacing: 'normal' as const
      });
      
      const secondResult = result.current;

      // Should return different reference when properties change
      expect(firstResult).not.toBe(secondResult);
      expect(firstResult.containerClasses).not.toBe(secondResult.containerClasses);
    });
  });

  describe('CSS class generation', () => {
    it('should generate correct classes for default properties', () => {
      const { result } = renderHook(() => useContainerProperties());
      
      expect(result.current.containerClasses).toContain('w-full');
      expect(result.current.containerClasses).toContain('mx-auto');
      expect(result.current.containerClasses).toContain('px-3');
    });

    it('should generate correct classes for custom properties', () => {
      const properties = {
        containerWidth: 'medium' as const,
        containerPosition: 'left' as const,
        spacing: 'comfortable' as const,
        backgroundColor: 'gray-50' as const,
        marginTop: 16
      };

      const { result } = renderHook(() => useContainerProperties(properties));
      
      expect(result.current.containerClasses).toContain('max-w-2xl');
      expect(result.current.containerClasses).toContain('ml-0 mr-auto');
      expect(result.current.containerClasses).toContain('px-6');
      expect(result.current.containerClasses).toContain('bg-gray-50');
      expect(result.current.containerClasses).toContain('mt-4');
    });

    it('should handle negative margins correctly', () => {
      const properties = {
        marginTop: -16,
        marginBottom: -8
      };

      const { result } = renderHook(() => useContainerProperties(properties));
      
      expect(result.current.containerClasses).toContain('-mt-4');
      expect(result.current.containerClasses).toContain('-mb-2');
    });
  });

  describe('performance optimization', () => {
    it('should only call console.log once per unique property set', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const properties = {
        containerWidth: 'medium' as const,
        spacing: 'normal' as const
      };

      const { rerender } = renderHook(
        (props) => useContainerProperties(props),
        { initialProps: properties }
      );

      // Re-render with same properties multiple times
      rerender(properties);
      rerender(properties);
      rerender(properties);

      // Should only log once due to memoization
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      
      consoleSpy.mockRestore();
    });
  });
});