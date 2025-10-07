// Component model base (fase inicial de componentização)
import { genId, timestamp } from './models';

export enum ComponentKind {
    Header = 'Header',
    Navigation = 'Navigation',
    QuestionSingle = 'QuestionSingle',
    QuestionMulti = 'QuestionMulti',
    Transition = 'Transition',
    ResultPlaceholder = 'ResultPlaceholder',
    RawLegacyBundle = 'RawLegacyBundle'
}

export interface BaseComponentMeta {
    source?: 'legacy' | 'native';
    legacyBlockId?: string;
    tags?: string[];
}

export interface HeaderProps { title: string; subtitle?: string; description?: string; showProgress?: boolean; }
export interface NavigationProps { showNext: boolean; showPrevious: boolean; nextButtonText?: string; }
export interface QuestionOption { id: string; label: string; description?: string; value?: string; points?: number; category?: string; }
export interface QuestionBaseProps { title: string; subtitle?: string; required?: boolean; }
export interface QuestionSingleProps extends QuestionBaseProps { options: QuestionOption[]; }
export interface QuestionMultiProps extends QuestionBaseProps { options: QuestionOption[]; maxSelections?: number; }
export interface TransitionProps { message: string; variant?: 'info' | 'success' | 'warning'; showDivider?: boolean; showButton?: boolean; buttonText?: string; }
export interface ResultPlaceholderProps { template: string; }
export interface RawLegacyBundleProps { blocks: any[]; legacyStepId?: string; legacyMeta?: any; }

export type ComponentProps =
    | HeaderProps
    | NavigationProps
    | QuestionSingleProps
    | QuestionMultiProps
    | TransitionProps
    | ResultPlaceholderProps
    | RawLegacyBundleProps;

export interface BaseComponent<P extends ComponentProps = ComponentProps> {
    id: string;
    kind: ComponentKind;
    version: string; // semantic version of this component shape
    createdAt: string;
    updatedAt: string;
    props: P;
    meta?: BaseComponentMeta;
}

export type AnyComponent = BaseComponent;

// Type guards
export function isHeader(c: AnyComponent): c is BaseComponent<HeaderProps> { return c.kind === ComponentKind.Header; }
export function isNavigation(c: AnyComponent): c is BaseComponent<NavigationProps> { return c.kind === ComponentKind.Navigation; }
export function isQuestionSingle(c: AnyComponent): c is BaseComponent<QuestionSingleProps> { return c.kind === ComponentKind.QuestionSingle; }
export function isQuestionMulti(c: AnyComponent): c is BaseComponent<QuestionMultiProps> { return c.kind === ComponentKind.QuestionMulti; }
export function isTransition(c: AnyComponent): c is BaseComponent<TransitionProps> { return c.kind === ComponentKind.Transition; }
export function isResultPlaceholder(c: AnyComponent): c is BaseComponent<ResultPlaceholderProps> { return c.kind === ComponentKind.ResultPlaceholder; }
export function isRawLegacyBundle(c: AnyComponent): c is BaseComponent<RawLegacyBundleProps> { return c.kind === ComponentKind.RawLegacyBundle; }

// Factory helpers
function base<P extends ComponentProps>(kind: ComponentKind, props: P, meta?: BaseComponentMeta, version = '1.0.0'): BaseComponent<P> {
    const now = timestamp();
    return { id: genId('cmp'), kind, version, createdAt: now, updatedAt: now, props, meta };
}

export const createHeader = (p: HeaderProps, meta?: BaseComponentMeta) => base(ComponentKind.Header, p, meta);
export const createNavigation = (p: NavigationProps, meta?: BaseComponentMeta) => base(ComponentKind.Navigation, p, meta);
export const createQuestionSingle = (p: QuestionSingleProps, meta?: BaseComponentMeta) => base(ComponentKind.QuestionSingle, p, meta);
export const createQuestionMulti = (p: QuestionMultiProps, meta?: BaseComponentMeta) => base(ComponentKind.QuestionMulti, p, meta);
export const createTransition = (p: TransitionProps, meta?: BaseComponentMeta) => base(ComponentKind.Transition, p, meta);
export const createResultPlaceholder = (p: ResultPlaceholderProps, meta?: BaseComponentMeta) => base(ComponentKind.ResultPlaceholder, p, meta);
export const createRawLegacyBundle = (p: RawLegacyBundleProps, meta?: BaseComponentMeta) => base(ComponentKind.RawLegacyBundle, p, meta);

// Simple validations (can be expanded later)
export interface ComponentValidationIssue { componentId: string; kind: string; message: string; severity: 'error' | 'warning'; field?: string; }

export function validateComponent(c: AnyComponent): ComponentValidationIssue[] {
    const issues: ComponentValidationIssue[] = [];
    switch (c.kind) {
        case ComponentKind.Header: {
            const p = c.props as HeaderProps;
            if (!p.title) issues.push(err(c, 'Header sem title', 'error', 'title'));
            break;
        }
        case ComponentKind.Navigation: {
            const p = c.props as NavigationProps;
            if (p.showNext && !p.nextButtonText) issues.push(err(c, 'Navigation com showNext mas sem nextButtonText', 'warning', 'nextButtonText'));
            break;
        }
        case ComponentKind.QuestionSingle: {
            const p = c.props as QuestionSingleProps;
            if (!p.options || p.options.length < 2) issues.push(err(c, 'QuestionSingle exige ao menos 2 options', 'error', 'options'));
            if (!p.title) issues.push(err(c, 'QuestionSingle sem title', 'error', 'title'));
            break;
        }
        case ComponentKind.QuestionMulti: {
            const p = c.props as QuestionMultiProps;
            if (!p.options || p.options.length < 2) issues.push(err(c, 'QuestionMulti exige ao menos 2 options', 'error', 'options'));
            if (!p.title) issues.push(err(c, 'QuestionMulti sem title', 'error', 'title'));
            if (p.maxSelections && p.maxSelections < 2) issues.push(err(c, 'maxSelections deve ser >= 2', 'warning', 'maxSelections'));
            break;
        }
        case ComponentKind.Transition: {
            const p = c.props as TransitionProps;
            if (!p.message) issues.push(err(c, 'Transition requer message', 'error', 'message'));
            break;
        }
        case ComponentKind.ResultPlaceholder: {
            const p = c.props as ResultPlaceholderProps;
            if (!p.template) issues.push(err(c, 'ResultPlaceholder sem template', 'error', 'template'));
            break;
        }
        default:
            break;
    }
    return issues;
}

function err(c: AnyComponent, message: string, severity: 'error' | 'warning' = 'error', field?: string): ComponentValidationIssue {
    return { componentId: c.id, kind: c.kind, message, severity, field };
}
