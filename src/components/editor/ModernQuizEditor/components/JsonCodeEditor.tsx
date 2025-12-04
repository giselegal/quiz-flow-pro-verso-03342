/**
 * 📝 JSON Code Editor - Monaco-based JSON editing
 * 
 * Features:
 * - Syntax highlighting
 * - Auto-formatting
 * - Real-time validation
 * - Bidirectional sync with visual editor
 */

import { memo, useCallback, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useQuizStore } from '../store/quizStore';
import { QuizSchemaZ } from '@/schemas/quiz-schema.zod';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';

export const JsonCodeEditor = memo(() => {
  const { quiz, loadQuiz } = useQuizStore();
  const [jsonString, setJsonString] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync from store to editor
  useEffect(() => {
    if (quiz) {
      const formatted = JSON.stringify(quiz, null, 2);
      setJsonString(formatted);
      setHasChanges(false);
      setValidationError(null);
    }
  }, [quiz]);

  // Handle editor changes
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value) return;
    setJsonString(value);
    setHasChanges(true);

    // Validate JSON syntax
    try {
      JSON.parse(value);
      setValidationError(null);
    } catch (e) {
      setValidationError(`Sintaxe JSON inválida: ${(e as Error).message}`);
    }
  }, []);

  // Apply changes to store
  const handleApplyChanges = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate with Zod schema
      const result = QuizSchemaZ.safeParse(parsed);
      
      if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
        setValidationError(`Schema inválido:\n${errors}`);
        return;
      }

      loadQuiz(result.data);
      setHasChanges(false);
      setValidationError(null);
    } catch (e) {
      setValidationError(`Erro ao aplicar: ${(e as Error).message}`);
    }
  }, [jsonString, loadQuiz]);

  // Format JSON
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch {
      // If invalid JSON, can't format
    }
  }, [jsonString]);

  // Reset to store state
  const handleReset = useCallback(() => {
    if (quiz) {
      setJsonString(JSON.stringify(quiz, null, 2));
      setHasChanges(false);
      setValidationError(null);
    }
  }, [quiz]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Editor JSON</span>
          {validationError ? (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              Erro
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3 h-3" />
              Válido
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
            title="Formatar JSON"
          >
            Formatar
          </button>
          
          {hasChanges && (
            <>
              <button
                onClick={handleReset}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors flex items-center gap-1"
                title="Descartar alterações"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
              
              <button
                onClick={handleApplyChanges}
                disabled={!!validationError}
                className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Aplicar alterações ao editor visual"
              >
                Aplicar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20">
          <pre className="text-xs text-destructive whitespace-pre-wrap font-mono">
            {validationError}
          </pre>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          value={jsonString}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            automaticLayout: true,
            formatOnPaste: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
});

JsonCodeEditor.displayName = 'JsonCodeEditor';
