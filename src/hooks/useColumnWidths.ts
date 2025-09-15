import { useState, useEffect } from 'react';

export interface ColumnWidths {
  stepSidebar: number;
  componentsSidebar: number;
  canvasArea: number;
  propertiesColumn: number;
}

const DEFAULT_WIDTHS: ColumnWidths = {
  stepSidebar: 18, // 18% of screen width
  componentsSidebar: 22, // 22% 
  canvasArea: 45, // 45% - flexible (increased)
  propertiesColumn: 15, // 15% (reduced)
};

const MIN_WIDTHS: ColumnWidths = {
  stepSidebar: 12, // minimum 12%
  componentsSidebar: 15, // minimum 15%
  canvasArea: 30, // minimum 30%
  propertiesColumn: 12, // minimum 12% (reduced)
};

const MAX_WIDTHS: ColumnWidths = {
  stepSidebar: 25, // maximum 25%
  componentsSidebar: 30, // maximum 30%
  canvasArea: 60, // maximum 60%
  propertiesColumn: 25, // maximum 25% (reduced)
};

const STORAGE_KEY = 'editor-column-widths';

export const useColumnWidths = () => {
  const [widths, setWidths] = useState<ColumnWidths>(DEFAULT_WIDTHS);

  // Load persisted widths on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ColumnWidths;
        // Validate parsed widths
        const validated = validateWidths(parsed);
        setWidths(validated);
      }
    } catch (error) {
      console.warn('Failed to load column widths from localStorage:', error);
    }
  }, []);

  // Save widths to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
    } catch (error) {
      console.warn('Failed to save column widths to localStorage:', error);
    }
  }, [widths]);

  const validateWidths = (newWidths: ColumnWidths): ColumnWidths => {
    const validated = { ...newWidths };
    
    // Ensure minimums and maximums
    (Object.keys(validated) as (keyof ColumnWidths)[]).forEach(key => {
      validated[key] = Math.max(MIN_WIDTHS[key], Math.min(MAX_WIDTHS[key], validated[key]));
    });

    // Ensure total doesn't exceed 100%
    const total = validated.stepSidebar + validated.componentsSidebar + validated.canvasArea + validated.propertiesColumn;
    if (total > 100) {
      // Proportionally reduce all widths
      const factor = 100 / total;
      (Object.keys(validated) as (keyof ColumnWidths)[]).forEach(key => {
        validated[key] = Math.round(validated[key] * factor);
      });
    }

    return validated;
  };

  const updateWidths = (newWidths: Partial<ColumnWidths>) => {
    const updated = { ...widths, ...newWidths };
    const validated = validateWidths(updated);
    setWidths(validated);
  };

  const resetToDefaults = () => {
    setWidths(DEFAULT_WIDTHS);
  };

  return {
    widths,
    updateWidths,
    resetToDefaults,
    DEFAULT_WIDTHS,
    MIN_WIDTHS,
    MAX_WIDTHS,
  };
};