import React, { useEffect, useMemo, useState } from "react";
import { ENHANCED_BLOCK_REGISTRY } from "@/config/enhancedBlockRegistry";
import { useEditorWithJson } from "@/components/editor-fixed/useEditorWithJson";
import type { Block } from "@/types/editor";

const StepSelector: React.FC<{ value: number; onChange: (v: number) => void }> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 21 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          className={`px-3 py-1 rounded border transition-colors ${
            value === n ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
          onClick={() => onChange(n)}
          aria-label={`Etapa ${n}`}
        >
          {n.toString().padStart(2, "0")}
        </button>
      ))}
    </div>
  );
};

const EditorFixedMinimal: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [step, setStep] = useState<number>(21);

  const { loadStepTemplate, isLoadingTemplate, templateError, currentTemplate } = useEditorWithJson(
    blocks,
    setBlocks
  );

  // SEO lightweight
  useEffect(() => {
    document.title = `Editor Fixed | Etapa ${step.toString().padStart(2, "0")}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute("content", `Configurar etapa ${step} com componentes do editor-fixed`);
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (link) link.href = window.location.href;
    else {
      const l = document.createElement("link");
      l.rel = "canonical";
      l.href = window.location.href;
      document.head.appendChild(l);
    }
  }, [step]);

  useEffect(() => {
    loadStepTemplate(step);
  }, [step, loadStepTemplate]);

  const rendered = useMemo(() => {
    if (!blocks?.length) return null;
    return blocks
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((block, idx) => {
        const Comp = ENHANCED_BLOCK_REGISTRY[block.type] || ENHANCED_BLOCK_REGISTRY["text-inline"];
        if (!Comp) return null;
        const props = (block.properties as any) || (block.content as any) || {};
        return <Comp key={block.id || `b-${idx}`} {...props} />;
      });
  }, [blocks]);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Editor Fixed – Etapas (1–21)</h1>
            <p className="text-sm text-muted-foreground">
              Carregue e visualize os blocos JSON por etapa
            </p>
          </div>
          <StepSelector value={step} onChange={setStep} />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        {/* Status */}
        {isLoadingTemplate && (
          <div className="py-10 text-center text-muted-foreground">Carregando etapa {step}…</div>
        )}
        {templateError && (
          <div className="my-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive">
            {templateError}
          </div>
        )}

        {/* Preview */}
        <div className="space-y-4">
          {rendered}
          {!isLoadingTemplate && !templateError && !blocks?.length && (
            <div className="py-16 text-center text-muted-foreground">
              Nenhum bloco para esta etapa.
            </div>
          )}
        </div>

        {/* Debug lightweight */}
        {currentTemplate && (
          <aside className="mt-10 rounded-lg border bg-card p-4">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Template</h2>
            <div className="text-sm">
              <div>
                <strong>ID:</strong> {currentTemplate.id}
              </div>
              <div>
                <strong>Nome:</strong> {currentTemplate.name}
              </div>
              <div>
                <strong>Blocos:</strong> {currentTemplate.blocks?.length ?? 0}
              </div>
            </div>
          </aside>
        )}
      </section>
    </main>
  );
};

export default EditorFixedMinimal;
