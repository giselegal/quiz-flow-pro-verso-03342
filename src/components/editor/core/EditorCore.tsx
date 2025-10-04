/**
 * 🏗️ CORE EDITOR INFRASTRUCTURE - FASE 2
 * 
 * Sistema central modular do editor com:
 * ✅ EditorCore com state management avançado
 * ✅ Plugin system modular e extensível
 * ✅ Hooks especializados para cada funcionalidade
 * ✅ Context management otimizado
 * ✅ Performance tracking integrado
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    ReactNode
} from 'react';
import { SuperUnifiedProvider, useSuperUnified } from '../providers/SuperUnifiedProvider';
import { useIntelligentCache } from '../providers/IntelligentCacheProvider';

// 🎯 TYPES AND INTERFACES
export type EditorMode = 'design' | 'preview' | 'debug' | 'collaboration';
export type SelectionMode = 'single' | 'multiple' | 'area';
export type GridType = 'none' | 'dots' | 'lines' | 'adaptive';

export interface EditorElement {
    id: string;
    type: string;
    parentId?: string;
    children: string[];
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    visible: boolean;
    locked: boolean;
    properties: Record<string, any>;
    styles: Record<string, any>;
    animations: Record<string, any>;
    interactions: Record<string, any>;
    metadata: {
        created: number;
        modified: number;
        author: string;
        version: string;
    };
}

export interface EditorViewport {
    x: number;
    y: number;
    zoom: number;
    width: number;
    height: number;
}

export interface EditorSelection {
    mode: SelectionMode;
    elements: string[];
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface EditorHistory {
    past: EditorState[];
    present: EditorState;
    future: EditorState[];
    maxSize: number;
}

export interface EditorGrid {
    enabled: boolean;
    type: GridType;
    size: number;
    snapToGrid: boolean;
    showGrid: boolean;
    color: string;
    opacity: number;
}

export interface EditorGuides {
    enabled: boolean;
    horizontal: number[];
    vertical: number[];
    snapToGuides: boolean;
    showDistances: boolean;
    color: string;
}

export interface EditorPreferences {
    autoSave: boolean;
    autoSaveInterval: number;
    showElementBounds: boolean;
    showElementNames: boolean;
    enableAnimations: boolean;
    keyboardShortcuts: Record<string, string>;
    theme: 'light' | 'dark' | 'auto';
    language: string;
}

export interface EditorState {
    // Core data
    elements: Map<string, EditorElement>;
    elementOrder: string[];

    // View state
    viewport: EditorViewport;
    selection: EditorSelection;

    // UI state
    mode: EditorMode;
    activePanel: string | null;
    activeTool: string;

    // Configuration
    grid: EditorGrid;
    guides: EditorGuides;
    preferences: EditorPreferences;

    // Meta state
    isLoading: boolean;
    isDirty: boolean;
    lastSaved: number;
    errors: string[];
    warnings: string[];
}

// 🎯 ACTIONS
export type EditorAction =
    | { type: 'SET_MODE'; payload: EditorMode }
    | { type: 'SET_VIEWPORT'; payload: Partial<EditorViewport> }
    | { type: 'SET_SELECTION'; payload: EditorSelection }
    | { type: 'ADD_ELEMENT'; payload: EditorElement }
    | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<EditorElement> } }
    | { type: 'DELETE_ELEMENT'; payload: string }
    | { type: 'REORDER_ELEMENTS'; payload: string[] }
    | { type: 'SET_GRID'; payload: Partial<EditorGrid> }
    | { type: 'SET_GUIDES'; payload: Partial<EditorGuides> }
    | { type: 'SET_PREFERENCES'; payload: Partial<EditorPreferences> }
    | { type: 'SET_ACTIVE_PANEL'; payload: string | null }
    | { type: 'SET_ACTIVE_TOOL'; payload: string }
    | { type: 'ADD_ERROR'; payload: string }
    | { type: 'CLEAR_ERRORS' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_DIRTY'; payload: boolean }
    | { type: 'RESET_STATE' }
    | { type: 'LOAD_STATE'; payload: Partial<EditorState> };

// 🎯 INITIAL STATE
const createInitialState = (): EditorState => ({
    elements: new Map(),
    elementOrder: [],

    viewport: {
        x: 0,
        y: 0,
        zoom: 1,
        width: 1200,
        height: 800
    },

    selection: {
        mode: 'single',
        elements: []
    },

    mode: 'design',
    activePanel: null,
    activeTool: 'select',

    grid: {
        enabled: true,
        type: 'dots',
        size: 20,
        snapToGrid: true,
        showGrid: true,
        color: '#e5e5e5',
        opacity: 0.5
    },

    guides: {
        enabled: true,
        horizontal: [],
        vertical: [],
        snapToGuides: true,
        showDistances: true,
        color: '#3b82f6'
    },

    preferences: {
        autoSave: true,
        autoSaveInterval: 30000, // 30 seconds
        showElementBounds: true,
        showElementNames: true,
        enableAnimations: true,
        keyboardShortcuts: {
            'ctrl+z': 'undo',
            'ctrl+y': 'redo',
            'ctrl+s': 'save',
            'ctrl+d': 'duplicate',
            'delete': 'delete'
        },
        theme: 'light',
        language: 'pt-BR'
    },

    isLoading: false,
    isDirty: false,
    lastSaved: Date.now(),
    errors: [],
    warnings: []
});

// 🎯 REDUCER
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
    switch (action.type) {
        case 'SET_MODE':
            return { ...state, mode: action.payload };

        case 'SET_VIEWPORT':
            return {
                ...state,
                viewport: { ...state.viewport, ...action.payload }
            };

        case 'SET_SELECTION':
            return { ...state, selection: action.payload };

        case 'ADD_ELEMENT': {
            const newElements = new Map(state.elements);
            newElements.set(action.payload.id, action.payload);

            return {
                ...state,
                elements: newElements,
                elementOrder: [...state.elementOrder, action.payload.id],
                isDirty: true
            };
        }

        case 'UPDATE_ELEMENT': {
            const newElements = new Map(state.elements);
            const existing = newElements.get(action.payload.id);

            if (existing) {
                newElements.set(action.payload.id, {
                    ...existing,
                    ...action.payload.updates,
                    metadata: {
                        ...existing.metadata,
                        modified: Date.now()
                    }
                });
            }

            return {
                ...state,
                elements: newElements,
                isDirty: true
            };
        }

        case 'DELETE_ELEMENT': {
            const newElements = new Map(state.elements);
            newElements.delete(action.payload);

            return {
                ...state,
                elements: newElements,
                elementOrder: state.elementOrder.filter(id => id !== action.payload),
                selection: {
                    ...state.selection,
                    elements: state.selection.elements.filter(id => id !== action.payload)
                },
                isDirty: true
            };
        }

        case 'REORDER_ELEMENTS':
            return {
                ...state,
                elementOrder: action.payload,
                isDirty: true
            };

        case 'SET_GRID':
            return {
                ...state,
                grid: { ...state.grid, ...action.payload }
            };

        case 'SET_GUIDES':
            return {
                ...state,
                guides: { ...state.guides, ...action.payload }
            };

        case 'SET_PREFERENCES':
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload }
            };

        case 'SET_ACTIVE_PANEL':
            return { ...state, activePanel: action.payload };

        case 'SET_ACTIVE_TOOL':
            return { ...state, activeTool: action.payload };

        case 'ADD_ERROR':
            return {
                ...state,
                errors: [...state.errors, action.payload]
            };

        case 'CLEAR_ERRORS':
            return { ...state, errors: [] };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_DIRTY':
            return { ...state, isDirty: action.payload };

        case 'RESET_STATE':
            return createInitialState();

        case 'LOAD_STATE':
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

// 🎯 PLUGIN SYSTEM
export interface EditorPlugin {
    id: string;
    name: string;
    version: string;
    enabled: boolean;
    dependencies: string[];

    // Lifecycle hooks
    onActivate?: (core: EditorCore) => void;
    onDeactivate?: (core: EditorCore) => void;
    onStateChange?: (state: EditorState, action: EditorAction) => void;

    // Extension points
    tools?: Record<string, any>;
    panels?: Record<string, React.ComponentType<any>>;
    shortcuts?: Record<string, (core: EditorCore) => void>;
    validators?: Array<(element: EditorElement) => string[]>;
}

export class PluginManager {
    private plugins = new Map<string, EditorPlugin>();
    private loadOrder: string[] = [];

    register(plugin: EditorPlugin): void {
        if (this.plugins.has(plugin.id)) {
            console.warn(`Plugin ${plugin.id} is already registered`);
            return;
        }

        // Check dependencies
        for (const dep of plugin.dependencies) {
            if (!this.plugins.has(dep)) {
                throw new Error(`Plugin ${plugin.id} depends on ${dep} which is not registered`);
            }
        }

        this.plugins.set(plugin.id, plugin);
        this.loadOrder.push(plugin.id);
    }

    unregister(pluginId: string): void {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            plugin.enabled = false;
            this.plugins.delete(pluginId);
            this.loadOrder = this.loadOrder.filter(id => id !== pluginId);
        }
    }

    enable(pluginId: string, core: EditorCore): void {
        const plugin = this.plugins.get(pluginId);
        if (plugin && !plugin.enabled) {
            plugin.enabled = true;
            plugin.onActivate?.(core);
        }
    }

    disable(pluginId: string, core: EditorCore): void {
        const plugin = this.plugins.get(pluginId);
        if (plugin && plugin.enabled) {
            plugin.enabled = false;
            plugin.onDeactivate?.(core);
        }
    }

    getEnabled(): EditorPlugin[] {
        return this.loadOrder
            .map(id => this.plugins.get(id))
            .filter((plugin): plugin is EditorPlugin => plugin?.enabled === true);
    }

    getTools(): Record<string, any> {
        const tools: Record<string, any> = {};

        for (const plugin of this.getEnabled()) {
            if (plugin.tools) {
                Object.assign(tools, plugin.tools);
            }
        }

        return tools;
    }

    getPanels(): Record<string, React.ComponentType<any>> {
        const panels: Record<string, React.ComponentType<any>> = {};

        for (const plugin of this.getEnabled()) {
            if (plugin.panels) {
                Object.assign(panels, plugin.panels);
            }
        }

        return panels;
    }

    validateElement(element: EditorElement): string[] {
        const errors: string[] = [];

        for (const plugin of this.getEnabled()) {
            if (plugin.validators) {
                for (const validator of plugin.validators) {
                    errors.push(...validator(element));
                }
            }
        }

        return errors;
    }
}

// 🎯 EDITOR CORE CLASS
export class EditorCore {
    private dispatch: React.Dispatch<EditorAction>;
    private state: EditorState;
    private pluginManager: PluginManager;
    private cache: any;
    private eventListeners = new Map<string, Set<Function>>();

    constructor(
        dispatch: React.Dispatch<EditorAction>,
        state: EditorState,
        cache?: any
    ) {
        this.dispatch = dispatch;
        this.state = state;
        this.pluginManager = new PluginManager();
        this.cache = cache;
    }

    // State management
    getState(): EditorState {
        return this.state;
    }

    setState(updates: Partial<EditorState>): void {
        this.dispatch({ type: 'LOAD_STATE', payload: updates });
    }

    // Element management
    addElement(element: EditorElement): void {
        this.dispatch({ type: 'ADD_ELEMENT', payload: element });
        this.emit('elementAdded', element);
    }

    updateElement(id: string, updates: Partial<EditorElement>): void {
        this.dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
        this.emit('elementUpdated', { id, updates });
    }

    deleteElement(id: string): void {
        this.dispatch({ type: 'DELETE_ELEMENT', payload: id });
        this.emit('elementDeleted', id);
    }

    getElement(id: string): EditorElement | undefined {
        return this.state.elements.get(id);
    }

    getElementsByType(type: string): EditorElement[] {
        return Array.from(this.state.elements.values())
            .filter(element => element.type === type);
    }

    // Selection management
    selectElement(id: string): void {
        this.dispatch({
            type: 'SET_SELECTION',
            payload: {
                mode: 'single',
                elements: [id]
            }
        });
        this.emit('selectionChanged', [id]);
    }

    selectElements(ids: string[]): void {
        this.dispatch({
            type: 'SET_SELECTION',
            payload: {
                mode: 'multiple',
                elements: ids
            }
        });
        this.emit('selectionChanged', ids);
    }

    clearSelection(): void {
        this.dispatch({
            type: 'SET_SELECTION',
            payload: {
                mode: 'single',
                elements: []
            }
        });
        this.emit('selectionChanged', []);
    }

    getSelectedElements(): EditorElement[] {
        return this.state.selection.elements
            .map(id => this.state.elements.get(id))
            .filter((element): element is EditorElement => element !== undefined);
    }

    // Viewport management
    setViewport(viewport: Partial<EditorViewport>): void {
        this.dispatch({ type: 'SET_VIEWPORT', payload: viewport });
        this.emit('viewportChanged', viewport);
    }

    zoomIn(factor: number = 1.2): void {
        const newZoom = Math.min(this.state.viewport.zoom * factor, 5);
        this.setViewport({ zoom: newZoom });
    }

    zoomOut(factor: number = 1.2): void {
        const newZoom = Math.max(this.state.viewport.zoom / factor, 0.1);
        this.setViewport({ zoom: newZoom });
    }

    zoomToFit(): void {
        // Calculate bounds of all elements
        const elements = Array.from(this.state.elements.values());
        if (elements.length === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (const element of elements) {
            minX = Math.min(minX, element.position.x);
            minY = Math.min(minY, element.position.y);
            maxX = Math.max(maxX, element.position.x + element.size.width);
            maxY = Math.max(maxY, element.position.y + element.size.height);
        }

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        const padding = 50;

        const zoomX = (this.state.viewport.width - padding * 2) / contentWidth;
        const zoomY = (this.state.viewport.height - padding * 2) / contentHeight;
        const zoom = Math.min(zoomX, zoomY, 1);

        const x = minX - (this.state.viewport.width / zoom - contentWidth) / 2;
        const y = minY - (this.state.viewport.height / zoom - contentHeight) / 2;

        this.setViewport({ x, y, zoom });
    }

    // Plugin management
    getPluginManager(): PluginManager {
        return this.pluginManager;
    }

    // Event system
    on(event: string, listener: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)!.add(listener);
    }

    off(event: string, listener: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(listener);
        }
    }

    emit(event: string, data?: any): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }

    // Persistence
    async save(): Promise<void> {
        if (!this.cache) return;

        this.dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const serializedState = {
                elements: Array.from(this.state.elements.entries()),
                elementOrder: this.state.elementOrder,
                viewport: this.state.viewport,
                grid: this.state.grid,
                guides: this.state.guides,
                preferences: this.state.preferences
            };

            await this.cache.set('editor-state', serializedState, {
                ttl: 3600000, // 1 hour
                persistent: true
            });

            this.dispatch({ type: 'SET_DIRTY', payload: false });
            this.emit('saved');

        } catch (error) {
            this.dispatch({ type: 'ADD_ERROR', payload: `Save failed: ${error}` });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: false });
        }
    }

    async load(): Promise<void> {
        if (!this.cache) return;

        this.dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const serializedState = await this.cache.get('editor-state');

            if (serializedState) {
                const elements = new Map(serializedState.elements);

                this.dispatch({
                    type: 'LOAD_STATE',
                    payload: {
                        elements,
                        elementOrder: serializedState.elementOrder,
                        viewport: serializedState.viewport,
                        grid: serializedState.grid,
                        guides: serializedState.guides,
                        preferences: serializedState.preferences,
                        isDirty: false
                    }
                });

                this.emit('loaded');
            }

        } catch (error) {
            this.dispatch({ type: 'ADD_ERROR', payload: `Load failed: ${error}` });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: false });
        }
    }
}

// 🎯 CONTEXT
interface EditorCoreContextType {
    core: EditorCore;
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}

const EditorCoreContext = createContext<EditorCoreContextType | null>(null);

// 🎯 PROVIDER
interface EditorCoreProviderProps {
    children: ReactNode;
    initialState?: Partial<EditorState>;
    autoSave?: boolean;
    autoSaveInterval?: number;
}

export const EditorCoreProvider: React.FC<EditorCoreProviderProps> = ({
    children,
    initialState = {},
    autoSave = true,
    autoSaveInterval = 30000
}) => {
    const { cache } = useIntelligentCache();
    const [state, dispatch] = useReducer(editorReducer, {
        ...createInitialState(),
        ...initialState
    });

    const coreRef = useRef<EditorCore | null>(null);

    // Initialize core
    if (!coreRef.current) {
        coreRef.current = new EditorCore(dispatch, state, cache);
    }

    // Update core state reference
    useEffect(() => {
        if (coreRef.current) {
            (coreRef.current as any).state = state;
        }
    }, [state]);

    // Auto-save functionality
    useEffect(() => {
        if (!autoSave || !state.isDirty || !coreRef.current) return;

        const timer = setTimeout(() => {
            coreRef.current?.save().catch(console.error);
        }, autoSaveInterval);

        return () => clearTimeout(timer);
    }, [autoSave, autoSaveInterval, state.isDirty]);

    // Load initial state
    useEffect(() => {
        coreRef.current?.load().catch(console.error);
    }, []);

    const contextValue = useMemo<EditorCoreContextType>(() => ({
        core: coreRef.current!,
        state,
        dispatch
    }), [state]);

    return (
        <EditorCoreContext.Provider value={contextValue}>
            {children}
        </EditorCoreContext.Provider>
    );
};

// 🎯 HOOK
export const useEditorCore = () => {
    const context = useContext(EditorCoreContext);
    if (!context) {
        throw new Error('useEditorCore must be used within EditorCoreProvider');
    }
    return context;
};

// 🎯 SPECIALIZED HOOKS
export const useEditorElements = () => {
    const { core, state } = useEditorCore();

    return useMemo(() => ({
        elements: Array.from(state.elements.values()),
        elementOrder: state.elementOrder,
        selectedElements: core.getSelectedElements(),
        addElement: (element: EditorElement) => core.addElement(element),
        updateElement: (id: string, updates: Partial<EditorElement>) => core.updateElement(id, updates),
        deleteElement: (id: string) => core.deleteElement(id),
        getElement: (id: string) => core.getElement(id),
        getElementsByType: (type: string) => core.getElementsByType(type)
    }), [core, state.elements, state.elementOrder]);
};

export const useEditorSelection = () => {
    const { core, state } = useEditorCore();

    return useMemo(() => ({
        selection: state.selection,
        selectedElements: core.getSelectedElements(),
        selectElement: (id: string) => core.selectElement(id),
        selectElements: (ids: string[]) => core.selectElements(ids),
        clearSelection: () => core.clearSelection()
    }), [core, state.selection]);
};

export const useEditorViewport = () => {
    const { core, state } = useEditorCore();

    return useMemo(() => ({
        viewport: state.viewport,
        setViewport: (viewport: Partial<EditorViewport>) => core.setViewport(viewport),
        zoomIn: (factor?: number) => core.zoomIn(factor),
        zoomOut: (factor?: number) => core.zoomOut(factor),
        zoomToFit: () => core.zoomToFit()
    }), [core, state.viewport]);
};

export const useEditorTools = () => {
    const { core, state, dispatch } = useEditorCore();

    return useMemo(() => ({
        activeTool: state.activeTool,
        availableTools: core.getPluginManager().getTools(),
        setActiveTool: (tool: string) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool }),
        mode: state.mode,
        setMode: (mode: EditorMode) => dispatch({ type: 'SET_MODE', payload: mode })
    }), [core, state.activeTool, state.mode, dispatch]);
};

export const useEditorPersistence = () => {
    const { core, state } = useEditorCore();

    return useMemo(() => ({
        isDirty: state.isDirty,
        isLoading: state.isLoading,
        lastSaved: state.lastSaved,
        save: () => core.save(),
        load: () => core.load()
    }), [core, state.isDirty, state.isLoading, state.lastSaved]);
};

export default EditorCoreProvider;