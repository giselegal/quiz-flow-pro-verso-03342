/**
 * 📚 VersioningProvider - Controle de Versões
 * 
 * Responsabilidades:
 * - Histórico de versões
 * - Snapshots de estado
 * - Comparação de versões
 * - Restauração de versões anteriores
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Version {
    id: string;
    label: string;
    description?: string;
    data: any;
    createdAt: number;
    createdBy: string;
    tags?: string[];
    parentVersionId?: string;
}

export interface VersionDiff {
    added: string[];
    removed: string[];
    modified: string[];
}

export interface VersioningState {
    versions: Version[];
    currentVersionId: string | null;
    maxVersions: number;
    autoSave: boolean;
}

export interface VersioningContextValue {
    // State
    state: VersioningState;

    // Version management
    createVersion: (label: string, data: any, description?: string, tags?: string[]) => Version;
    getVersion: (versionId: string) => Version | undefined;
    deleteVersion: (versionId: string) => boolean;
    restoreVersion: (versionId: string) => any | null;

    // Version queries
    getAllVersions: () => Version[];
    getVersionHistory: (limit?: number) => Version[];
    getVersionsByTag: (tag: string) => Version[];
    findVersionByLabel: (label: string) => Version | undefined;

    // Comparison
    compareVersions: (versionId1: string, versionId2: string) => VersionDiff | null;
    getDiff: (versionId: string) => VersionDiff | null;

    // Configuration
    setMaxVersions: (max: number) => void;
    setAutoSave: (enabled: boolean) => void;
    clearVersions: () => void;

    // Utilities
    exportVersion: (versionId: string) => string | null;
    importVersion: (versionJson: string) => Version | null;
}

interface VersioningProviderProps {
    children: ReactNode;
    maxVersions?: number;
    autoSave?: boolean;
    currentUserId?: string;
}

// ============================================================================
// CONTEXT
// ============================================================================

const VersioningContext = createContext<VersioningContextValue | undefined>(undefined);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateVersionId(): string {
    return `v${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function calculateDiff(oldData: any, newData: any): VersionDiff {
    const diff: VersionDiff = {
        added: [],
        removed: [],
        modified: [],
    };

    if (typeof oldData !== 'object' || typeof newData !== 'object') {
        return diff;
    }

    // Find added and modified keys
    Object.keys(newData).forEach(key => {
        if (!(key in oldData)) {
            diff.added.push(key);
        } else if (!deepEqual(oldData[key], newData[key])) {
            diff.modified.push(key);
        }
    });

    // Find removed keys
    Object.keys(oldData).forEach(key => {
        if (!(key in newData)) {
            diff.removed.push(key);
        }
    });

    return diff;
}

// ============================================================================
// PROVIDER
// ============================================================================

export function VersioningProvider({
    children,
    maxVersions = 50,
    autoSave = true,
    currentUserId = 'anonymous',
}: VersioningProviderProps) {
    // State
    const [versions, setVersions] = useState<Version[]>([]);
    const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
    const [maxVersionsLimit, setMaxVersionsLimit] = useState(maxVersions);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(autoSave);

    // Version management
    const createVersion = useCallback((
        label: string,
        data: any,
        description?: string,
        tags?: string[]
    ): Version => {
        const version: Version = {
            id: generateVersionId(),
            label,
            description,
            data: JSON.parse(JSON.stringify(data)), // Deep clone
            createdAt: Date.now(),
            createdBy: currentUserId,
            tags,
            parentVersionId: currentVersionId || undefined,
        };

        setVersions(prev => {
            let newVersions = [version, ...prev];

            // Enforce max versions limit
            if (newVersions.length > maxVersionsLimit) {
                newVersions = newVersions.slice(0, maxVersionsLimit);
            }

            return newVersions;
        });

        setCurrentVersionId(version.id);

        appLogger.info('Version created', 'VersioningProvider', {
            id: version.id,
            label,
            tags,
        });

        return version;
    }, [currentVersionId, currentUserId, maxVersionsLimit]);

    const getVersion = useCallback((versionId: string): Version | undefined => {
        return versions.find(v => v.id === versionId);
    }, [versions]);

    const deleteVersion = useCallback((versionId: string): boolean => {
        const versionExists = versions.some(v => v.id === versionId);
        if (!versionExists) return false;

        setVersions(prev => prev.filter(v => v.id !== versionId));

        if (currentVersionId === versionId) {
            setCurrentVersionId(versions[0]?.id || null);
        }

        appLogger.info('Version deleted', 'VersioningProvider', { versionId });
        return true;
    }, [versions, currentVersionId]);

    const restoreVersion = useCallback((versionId: string): any | null => {
        const version = getVersion(versionId);
        if (!version) {
            appLogger.warn('Version not found', 'VersioningProvider', { versionId });
            return null;
        }

        setCurrentVersionId(versionId);

        appLogger.info('Version restored', 'VersioningProvider', {
            versionId,
            label: version.label,
        });

        return JSON.parse(JSON.stringify(version.data)); // Return deep clone
    }, [getVersion]);

    // Version queries
    const getAllVersions = useCallback((): Version[] => {
        return [...versions];
    }, [versions]);

    const getVersionHistory = useCallback((limit = 10): Version[] => {
        return versions.slice(0, limit);
    }, [versions]);

    const getVersionsByTag = useCallback((tag: string): Version[] => {
        return versions.filter(v => v.tags?.includes(tag));
    }, [versions]);

    const findVersionByLabel = useCallback((label: string): Version | undefined => {
        return versions.find(v => v.label === label);
    }, [versions]);

    // Comparison
    const compareVersions = useCallback((
        versionId1: string,
        versionId2: string
    ): VersionDiff | null => {
        const v1 = getVersion(versionId1);
        const v2 = getVersion(versionId2);

        if (!v1 || !v2) {
            appLogger.warn('Versions not found for comparison', 'VersioningProvider', {
                versionId1,
                versionId2,
            });
            return null;
        }

        return calculateDiff(v1.data, v2.data);
    }, [getVersion]);

    const getDiff = useCallback((versionId: string): VersionDiff | null => {
        const version = getVersion(versionId);
        if (!version || !version.parentVersionId) return null;

        const parentVersion = getVersion(version.parentVersionId);
        if (!parentVersion) return null;

        return calculateDiff(parentVersion.data, version.data);
    }, [getVersion]);

    // Configuration
    const setMaxVersions = useCallback((max: number) => {
        setMaxVersionsLimit(max);

        // Trim versions if necessary
        setVersions(prev => {
            if (prev.length <= max) return prev;
            return prev.slice(0, max);
        });

        appLogger.info('Max versions limit updated', 'VersioningProvider', { max });
    }, []);

    const setAutoSave = useCallback((enabled: boolean) => {
        setAutoSaveEnabled(enabled);
        appLogger.info('Auto-save toggled', 'VersioningProvider', { enabled });
    }, []);

    const clearVersions = useCallback(() => {
        setVersions([]);
        setCurrentVersionId(null);
        appLogger.info('All versions cleared', 'VersioningProvider');
    }, []);

    // Utilities
    const exportVersion = useCallback((versionId: string): string | null => {
        const version = getVersion(versionId);
        if (!version) return null;

        try {
            return JSON.stringify(version, null, 2);
        } catch (error) {
            appLogger.error('Failed to export version', 'VersioningProvider', { error });
            return null;
        }
    }, [getVersion]);

    const importVersion = useCallback((versionJson: string): Version | null => {
        try {
            const version = JSON.parse(versionJson) as Version;

            // Validate structure
            if (!version.id || !version.label || !version.data) {
                throw new Error('Invalid version structure');
            }

            // Generate new ID to avoid conflicts
            const importedVersion: Version = {
                ...version,
                id: generateVersionId(),
                createdAt: Date.now(),
                tags: [...(version.tags || []), 'imported'],
            };

            setVersions(prev => [importedVersion, ...prev]);

            appLogger.info('Version imported', 'VersioningProvider', {
                originalId: version.id,
                newId: importedVersion.id,
            });

            return importedVersion;

        } catch (error) {
            appLogger.error('Failed to import version', 'VersioningProvider', { error });
            return null;
        }
    }, []);

    // Build state object
    const state: VersioningState = useMemo(() => ({
        versions,
        currentVersionId,
        maxVersions: maxVersionsLimit,
        autoSave: autoSaveEnabled,
    }), [versions, currentVersionId, maxVersionsLimit, autoSaveEnabled]);

    // Context value with memoization
    const contextValue = useMemo<VersioningContextValue>(() => ({
        state,
        createVersion,
        getVersion,
        deleteVersion,
        restoreVersion,
        getAllVersions,
        getVersionHistory,
        getVersionsByTag,
        findVersionByLabel,
        compareVersions,
        getDiff,
        setMaxVersions,
        setAutoSave,
        clearVersions,
        exportVersion,
        importVersion,
    }), [
        state,
        createVersion,
        getVersion,
        deleteVersion,
        restoreVersion,
        getAllVersions,
        getVersionHistory,
        getVersionsByTag,
        findVersionByLabel,
        compareVersions,
        getDiff,
        setMaxVersions,
        setAutoSave,
        clearVersions,
        exportVersion,
        importVersion,
    ]);

    return (
        <VersioningContext.Provider value={contextValue}>
            {children}
        </VersioningContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useVersioning(): VersioningContextValue {
    const context = useContext(VersioningContext);

    if (!context) {
        throw new Error('useVersioning must be used within VersioningProvider');
    }

    return context;
}

// Display name for debugging
VersioningProvider.displayName = 'VersioningProvider';
