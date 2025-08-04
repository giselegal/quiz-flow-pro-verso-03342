import { useState } from "react";
import { EditorBlock } from "@/types/editor";
import { useToast } from "@/components/ui/use-toast";

export const useEditorHistory = (initialBlocks: EditorBlock[]) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<EditorBlock[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = (blocks: EditorBlock[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(blocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      return history[historyIndex - 1];
    } else {
      toast({
        title: "Não é possível desfazer",
        description: "Você já está no início do histórico.",
        variant: "destructive",
      });
      return history[historyIndex];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      return history[historyIndex + 1];
    } else {
      toast({
        title: "Não é possível refazer",
        description: "Você já está no fim do histórico.",
        variant: "destructive",
      });
      return history[historyIndex];
    }
  };

  return {
    addToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
