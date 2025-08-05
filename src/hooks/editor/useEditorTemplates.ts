import { useCallback } from "react";
import { EditorConfig } from "@/types/editor";
import { EditorTemplateActions } from "@/types/editorActions";

export const useEditorTemplates = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorTemplateActions => {
  const saveAsTemplate = useCallback(
    (name: string) => {
      try {
        const templates = JSON.parse(localStorage.getItem("editor_templates") || "{}");
        templates[name] = config;
        localStorage.setItem("editor_templates", JSON.stringify(templates));
      } catch (error) {
        console.error("Error saving template:", error);
      }
    },
    [config]
  );

  const loadTemplate = useCallback(
    (name: string): boolean => {
      try {
        const templates = JSON.parse(localStorage.getItem("editor_templates") || "{}");
        if (templates[name]) {
          setConfig(templates[name]);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error loading template:", error);
        return false;
      }
    },
    [setConfig]
  );

  return {
    saveAsTemplate,
    loadTemplate,
  };
};
