import { useCallback } from 'react';
import { EditorConfig } from '@/types/editor';
import { EditorTemplateActions } from '@/types/editorActions';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

export const useEditorTemplates = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void,
): EditorTemplateActions => {
  const saveAsTemplate = useCallback(
    (name: string) => {
      try {
        const templates = StorageService.safeGetJSON('editor_templates');
        templates[name] = config;
        StorageService.safeSetJSON('editor_templates', templates);
      } catch (error) {
        appLogger.error('Error saving template:', { data: [error] });
      }
    },
    [config],
  );

  const loadTemplate = useCallback(
    (name: string): boolean => {
      try {
        const templates = StorageService.safeGetJSON('editor_templates');
        if (templates[name]) {
          setConfig(templates[name]);
          return true;
        }
        return false;
      } catch (error) {
        appLogger.error('Error loading template:', { data: [error] });
        return false;
      }
    },
    [setConfig],
  );

  return {
    saveAsTemplate,
    loadTemplate,
  };
};
