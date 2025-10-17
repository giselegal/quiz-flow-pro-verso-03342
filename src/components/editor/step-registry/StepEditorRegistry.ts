// src/components/editor/step-registry/StepEditorRegistry.ts
import React from 'react';

type EditorLoader = () => Promise<{ default: React.ComponentType<any> }>;

class StepEditorRegistryClass {
  private loaders = new Map<string, EditorLoader>();
  private defaultsRegistered = false;

  register(type: string, loader: EditorLoader) {
    this.loaders.set(type, loader);
  }

  getEditorLoader(type: string): EditorLoader | undefined {
    if (!this.defaultsRegistered) this.registerDefaults();
    return this.loaders.get(type);
  }

  private registerDefaults() {
    // Registros padrão para os steps críticos (12, 19, 20)
    this.register('transition', () => import('@/components/editor/step-editors/TransitionStepEditor'));
    this.register('transition-result', () => import('@/components/editor/step-editors/TransitionStepEditor'));
    this.register('result', () => import('@/components/editor/step-editors/ResultStepEditor'));
    this.register('offer', () => import('@/components/editor/step-editors/OfferStepEditor'));
    this.defaultsRegistered = true;
  }
}

export const StepEditorRegistry = new StepEditorRegistryClass();
