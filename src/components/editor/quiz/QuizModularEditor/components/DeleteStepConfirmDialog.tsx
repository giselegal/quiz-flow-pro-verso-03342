/**
 * 🗑️ DELETE STEP CONFIRM DIALOG
 * 
 * Dialog de confirmação para deletar etapas customizadas
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteStepConfirmDialogProps {
  open: boolean;
  stepName: string;
  stepId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteStepConfirmDialog({
  open,
  stepName,
  stepId,
  onConfirm,
  onCancel,
}: DeleteStepConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Você tem certeza que deseja deletar a etapa <strong>{stepName}</strong>?
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {stepId}
            </p>
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ Esta ação não pode ser desfeita!
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Todos os blocos e configurações desta etapa serão permanentemente removidos.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Sim, Deletar Etapa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
