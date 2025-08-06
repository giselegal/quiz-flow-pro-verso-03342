import { useState, useCallback } from "react";
import { ResultPageConfig } from "@/types/resultPageConfig";
import { useResultPageConfig } from "./useResultPageConfig";

interface UseResultPageEditorReturn {
  resultPageConfig: ResultPageConfig;
  loading: boolean;
  isPreviewing: boolean;
  isGlobalStylesOpen: boolean;
  actions: {
    handleSave: () => Promise<void>;
    handleReset: () => void;
    toggleGlobalStyles: () => void;
    togglePreview: () => void;
    updateSection: (section: string, content: any) => void;
    importConfig: (config: ResultPageConfig) => void;
  };
}

export const useResultPageEditor = (category: string): UseResultPageEditorReturn => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGlobalStylesOpen, setIsGlobalStylesOpen] = useState(false);

  const { resultPageConfig, updateSection, saveConfig, resetConfig, importConfig, loading } =
    useResultPageConfig(category);

  const handleSave = useCallback(async () => {
    await saveConfig();
  }, [saveConfig]);

  const handleReset = useCallback(() => {
    resetConfig();
  }, [resetConfig]);

  const toggleGlobalStyles = useCallback(() => {
    setIsGlobalStylesOpen(prev => !prev);
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewing(prev => !prev);
  }, []);

  return {
    resultPageConfig,
    loading,
    isPreviewing,
    isGlobalStylesOpen,
    actions: {
      handleSave,
      handleReset,
      toggleGlobalStyles,
      togglePreview,
      updateSection,
      importConfig,
    },
  };
};
