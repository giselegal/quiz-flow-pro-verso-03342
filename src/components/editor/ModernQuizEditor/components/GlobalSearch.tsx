/**
 * 🔍 GlobalSearch - Search across steps and blocks
 * 
 * Features:
 * - Search in step titles
 * - Search in block content/properties
 * - Quick navigation to results
 * - Highlight matches
 */

import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, Layers, Box } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';

interface SearchResult {
  type: 'step' | 'block';
  stepId: string;
  blockId?: string;
  title: string;
  subtitle?: string;
  matchText: string;
}

export const GlobalSearch = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const quiz = useQuizStore((s) => s.quiz);
  const selectStep = useEditorStore((s) => s.selectStep);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || !quiz?.steps) return [];

    const q = query.toLowerCase().trim();
    const found: SearchResult[] = [];

    quiz.steps.forEach((step: any) => {
      // Search in step title
      if (step.title?.toLowerCase().includes(q)) {
        found.push({
          type: 'step',
          stepId: step.id,
          title: step.title || `Step ${step.order}`,
          matchText: highlightMatch(step.title || '', q),
        });
      }

      // Search in blocks
      step.blocks?.forEach((block: any) => {
        const searchableText = getBlockSearchableText(block);
        if (searchableText.toLowerCase().includes(q)) {
          found.push({
            type: 'block',
            stepId: step.id,
            blockId: block.id,
            title: block.type,
            subtitle: step.title || `Step ${step.order}`,
            matchText: highlightMatch(searchableText.slice(0, 100), q),
          });
        }
      });
    });

    return found.slice(0, 10); // Limit results
  }, [query, quiz]);

  // Get searchable text from block
  const getBlockSearchableText = useCallback((block: any): string => {
    const parts: string[] = [block.type];

    if (block.properties) {
      const props = block.properties;
      if (props.title) parts.push(props.title);
      if (props.text) parts.push(props.text);
      if (props.content) parts.push(props.content);
      if (props.label) parts.push(props.label);
      if (props.placeholder) parts.push(props.placeholder);
      if (props.question) parts.push(props.question);
      if (props.description) parts.push(props.description);
      if (props.options) {
        props.options.forEach((opt: any) => {
          if (typeof opt === 'string') parts.push(opt);
          else if (opt.label) parts.push(opt.label);
          else if (opt.text) parts.push(opt.text);
        });
      }
    }

    return parts.join(' ');
  }, []);

  // Navigate to result
  const handleSelect = useCallback((result: SearchResult) => {
    selectStep(result.stepId);
    if (result.blockId) {
      // Small delay to ensure step is selected first
      setTimeout(() => selectBlock(result.blockId!), 50);
    }
    setIsOpen(false);
    setQuery('');
  }, [selectStep, selectBlock]);

  // Highlight match in text
  function highlightMatch(text: string, query: string): string {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return `${text.slice(0, idx)}**${text.slice(idx, idx + query.length)}**${text.slice(idx + query.length)}`;
  }

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          target.contentEditable !== 'true'
        ) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Buscar</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border border-border">
          ⌘F
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
          />

          {/* Search panel */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-md bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar steps e blocos..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto">
              {query && results.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  Nenhum resultado para "{query}"
                </div>
              ) : results.length > 0 ? (
                <ul className="py-2">
                  {results.map((result, idx) => (
                    <li key={`${result.stepId}-${result.blockId || 'step'}-${idx}`}>
                      <button
                        onClick={() => handleSelect(result)}
                        className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-muted text-left transition-colors"
                      >
                        <div className="mt-0.5">
                          {result.type === 'step' ? (
                            <Layers className="w-4 h-4 text-primary" />
                          ) : (
                            <Box className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {result.title}
                            </span>
                            {result.subtitle && (
                              <span className="text-xs text-muted-foreground truncate">
                                em {result.subtitle}
                              </span>
                            )}
                          </div>
                          <p 
                            className="text-xs text-muted-foreground truncate mt-0.5"
                            dangerouslySetInnerHTML={{
                              __html: result.matchText
                                .replace(/\*\*(.+?)\*\*/g, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>')
                            }}
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query === '' ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Digite para buscar em steps e blocos
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
              <span>↑↓ navegar · ↵ selecionar · esc fechar</span>
              <span>{results.length} resultado(s)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GlobalSearch.displayName = 'GlobalSearch';
