/**
 * 🎯 CONSOLIDATED PROVIDERS - FASE 3
 * 
 * Exports centralizados dos providers consolidados
 * 
 * REDUÇÃO: 13 providers → 5 providers (incluindo Editor, Funnel, Quiz, Versioning)
 * 
 * CONSOLIDAÇÕES:
 * 1. AuthStorage (Auth + Storage)
 * 2. RealTime (Sync + Collaboration)
 * 3. ValidationResult (Validation + Result)
 * 4. UX (UI + Theme + Navigation)
 * 5. Editor (mantido separado)
 * 6. Funnel (mantido separado)
 * 7. Quiz (mantido separado)
 * 8. Versioning (mantido separado)
 */

// Consolidated Providers
export {
    AuthStorageProvider,
    useAuthStorage,
    useAuth,
    useStorage,
    type User,
    type AuthState,
    type StorageType,
    type StorageItem,
    type StorageOptions,
    type AuthStorageContextValue,
} from './AuthStorageProvider';

export {
    RealTimeProvider,
    useRealTime,
    useSync,
    useCollaboration,
    type Collaborator,
    type SyncStatus,
    type RealTimeEvent,
    type RealTimeContextValue,
} from './RealTimeProvider';

export {
    ValidationResultProvider,
    useValidationResult,
    useValidation,
    useResult,
    type ValidationRule,
    type ValidationError,
    type ValidationSchema,
    type QuizResult,
    type ResultAnalysis,
    type ValidationResultContextValue,
} from './ValidationResultProvider';

export {
    UXProvider,
    useUX,
    useTheme,
    useUI,
    useNavigation,
    type ThemeMode,
    type ThemeColors,
    type UIState,
    type Toast,
    type NavigationItem,
    type BreadcrumbItem,
    type UXContextValue,
} from './UXProvider';
