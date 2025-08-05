import { useState, useRef, useEffect, useCallback } from "react";

interface UseInlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  autoSelect?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  saveOnBlur?: boolean;
  validateOnSave?: (value: string) => boolean;
}

export const useInlineEdit = ({
  value,
  onSave,
  multiline = false,
  autoSelect = true,
  preventDefault = true,
  stopPropagation = true,
  saveOnBlur = true,
  validateOnSave,
}: UseInlineEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (autoSelect) {
        inputRef.current.select();
      }
    }
  }, [isEditing, autoSelect]);

  const startEdit = useCallback(
    (e?: React.MouseEvent) => {
      if (preventDefault && e) {
        e.preventDefault();
      }
      if (stopPropagation && e) {
        e.stopPropagation();
      }
      setIsEditing(true);
    },
    [preventDefault, stopPropagation]
  );

  const saveEdit = useCallback(() => {
    if (validateOnSave && !validateOnSave(editValue)) {
      return false;
    }
    onSave(editValue);
    setIsEditing(false);
    return true;
  }, [editValue, onSave, validateOnSave]);

  const cancelEdit = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !multiline) {
        e.preventDefault();
        saveEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
    },
    [multiline, saveEdit, cancelEdit]
  );

  const handleBlur = useCallback(() => {
    if (saveOnBlur) {
      saveEdit();
    }
  }, [saveOnBlur, saveEdit]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditValue(e.target.value);
    },
    []
  );

  return {
    isEditing,
    editValue,
    mounted,
    inputRef,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    handleBlur,
    handleChange,
  };
};
