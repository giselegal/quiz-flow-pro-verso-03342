/**
 * 🎯 PREVIEW DIALOG (Sprint 2 - TK-ED-04)
 * 
 * Dialog para preview do quiz em produção
 * Lazy-loaded para otimização de bundle
 */

import React, { Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

// Lazy load do preview de produção
const QuizProductionPreview = React.lazy(
  () => import('../QuizProductionPreview')
);

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funnelId?: string;
}

export function PreviewDialog({
  open,
  onOpenChange,
  funnelId,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Preview do Quiz</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <QuizProductionPreview funnelId={funnelId} />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
