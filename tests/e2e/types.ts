/**
 * 🔧 DEFINIÇÕES DE TIPOS PARA TESTES E2E
 * 
 * Tipos adicionais e declarações de módulo para os testes.
 */

// Extensões para Page do Playwright
declare module '@playwright/test' {
  interface Page {
    // Métodos customizados se necessário
  }
}

// Tipos para métricas de performance
export interface PerformanceMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  } | null;
  resourceCount: number;
}

// Tipos para resultados de responsividade
export interface ResponsiveTestResult {
  viewport: string;
  success: boolean;
  error?: string;
}

// Tipos para viewport
export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

// Tipos para seletores
export interface SelectorMap {
  [key: string]: string;
}

// Tipos para timeouts
export interface TimeoutConfig {
  [key: string]: number;
}

// Extensões para performance API
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

// Tipos para fixtures
export interface QuizFixture {
  id: string;
  title: string;
  description: string;
  questions: QuestionFixture[];
}

export interface QuestionFixture {
  id: string;
  text: string;
  type: string;
  options?: OptionFixture[];
  min?: number;
  max?: number;
  step?: number;
}

export interface OptionFixture {
  id: string;
  text: string;
  value: string;
}

export interface TemplateFixture {
  id: string;
  name: string;
  category: string;
  components: ComponentFixture[];
}

export interface ComponentFixture {
  id: string;
  type: string;
  content: any;
  style?: any;
}

export interface UserFixture {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

// Tipos para API fixtures
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: string;
}

// Tipos para localStorage fixtures
export interface LocalStorageState {
  [key: string]: string;
}

// Tipos para análise de acessibilidade
export interface AccessibilityAnalysis {
  issues: string[];
  stats: {
    images: number;
    buttons: number;
    headings: number;
    hasWhiteBackground: boolean;
  };
}