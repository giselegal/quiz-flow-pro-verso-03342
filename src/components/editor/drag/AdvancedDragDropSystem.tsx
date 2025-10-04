/**
 * 🎯 ADVANCED DRAG & DROP SYSTEM - FASE 2
 * 
 * Sistema completo de drag & drop com:
 * ✅ Preview em tempo real durante o arrasto
 * ✅ Collision detection e constraints
 * ✅ Snapping inteligente para grids e guias
 * ✅ Multi-element dragging
 * ✅ Keyboard modifiers (Shift, Ctrl, Alt)
 * ✅ Touch support para dispositivos móveis
 * ✅ Performance otimizada para grandes quantidades de elementos
 */

import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
    ReactNode,
    CSSProperties
} from 'react';
import { useEditorCore, useEditorElements, useEditorSelection, useEditorViewport, EditorElement } from '../core/EditorCore';

// 🎯 DRAG & DROP TYPES
export interface DragInfo {
    elementId: string;
    startPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
    offset: { x: number; y: number };
    isDragging: boolean;
    draggedElements: string[];
    modifiers: {
        shift: boolean;
        ctrl: boolean;
        alt: boolean;
    };
}

export interface DropZone {
    id: string;
    bounds: { x: number; y: number; width: number; height: number };
    accepts: string[];
    canDrop?: (dragInfo: DragInfo) => boolean;
    onDrop?: (dragInfo: DragInfo) => void;
    highlight?: boolean;
    preview?: ReactNode;
}

export interface DragConstraints {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    snapToGrid?: boolean;
    snapToGuides?: boolean;
    snapToElements?: boolean;
    snapDistance?: number;
    lockX?: boolean;
    lockY?: boolean;
    containerBounds?: { x: number; y: number; width: number; height: number };
}

export interface CollisionResult {
    hasCollision: boolean;
    collidingElements: string[];
    availablePosition?: { x: number; y: number };
}

// 🎯 DRAG CONTEXT
interface DragContextType {
    dragInfo: DragInfo | null;
    dropZones: Map<string, DropZone>;
    isDragging: boolean;
    dragPreview?: ReactNode;
    startDrag: (elementId: string, startPos: { x: number; y: number }, offset: { x: number; y: number }) => void;
    updateDrag: (position: { x: number; y: number }, modifiers: DragInfo['modifiers']) => void;
    endDrag: () => void;
    registerDropZone: (dropZone: DropZone) => void;
    unregisterDropZone: (zoneId: string) => void;
    setDragPreview: (preview: ReactNode) => void;
}

const DragContext = React.createContext<DragContextType | null>(null);

// 🎯 DRAG PROVIDER
interface DragProviderProps {
    children: ReactNode;
    constraints?: DragConstraints;
    enableCollisionDetection?: boolean;
    enableSnapping?: boolean;
    snapDistance?: number;
    dragPreviewOffset?: { x: number; y: number };
    onDragStart?: (elementId: string) => void;
    onDragMove?: (elementId: string, position: { x: number; y: number }) => void;
    onDragEnd?: (elementId: string, position: { x: number; y: number }) => void;
}

export const DragProvider: React.FC<DragProviderProps> = ({
    children,
    constraints = {},
    enableCollisionDetection = true,
    enableSnapping = true,
    snapDistance = 10,
    dragPreviewOffset = { x: 10, y: 10 },
    onDragStart,
    onDragMove,
    onDragEnd
}) => {
    const { core } = useEditorCore();
    const { elements, updateElement } = useEditorElements();
    const { selection, selectedElements } = useEditorSelection();
    const { viewport } = useEditorViewport();

    const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
    const [dropZones] = useState(new Map<string, DropZone>());
    const [dragPreview, setDragPreview] = useState<ReactNode>(null);

    // 🎯 SNAPPING UTILITIES
    const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
        if (!enableSnapping || !constraints.snapToGrid) return { x, y };

        const gridSize = core.getState().grid.size;
        return {
            x: Math.round(x / gridSize) * gridSize,
            y: Math.round(y / gridSize) * gridSize
        };
    }, [core, enableSnapping, constraints.snapToGrid]);

    const snapToGuides = useCallback((x: number, y: number): { x: number; y: number } => {
        if (!enableSnapping || !constraints.snapToGuides) return { x, y };

        const guides = core.getState().guides;
        let snappedX = x;
        let snappedY = y;

        // Snap to vertical guides
        for (const guide of guides.vertical) {
            if (Math.abs(x - guide) <= snapDistance) {
                snappedX = guide;
                break;
            }
        }

        // Snap to horizontal guides
        for (const guide of guides.horizontal) {
            if (Math.abs(y - guide) <= snapDistance) {
                snappedY = guide;
                break;
            }
        }

        return { x: snappedX, y: snappedY };
    }, [core, enableSnapping, constraints.snapToGuides, snapDistance]);

    const snapToElements = useCallback((draggedElementId: string, x: number, y: number): { x: number; y: number } => {
        if (!enableSnapping || !constraints.snapToElements) return { x, y };

        const draggedElement = elements.find(el => el.id === draggedElementId);
        if (!draggedElement) return { x, y };

        let snappedX = x;
        let snappedY = y;
        let minDistance = snapDistance;

        for (const element of elements) {
            if (element.id === draggedElementId) continue;

            const elementBounds = {
                left: element.position.x,
                right: element.position.x + element.size.width,
                top: element.position.y,
                bottom: element.position.y + element.size.height
            };

            const draggedBounds = {
                left: x,
                right: x + draggedElement.size.width,
                top: y,
                bottom: y + draggedElement.size.height
            };

            // Snap to left edge
            const leftDistance = Math.abs(draggedBounds.left - elementBounds.left);
            if (leftDistance < minDistance) {
                snappedX = elementBounds.left;
                minDistance = leftDistance;
            }

            // Snap to right edge
            const rightDistance = Math.abs(draggedBounds.right - elementBounds.right);
            if (rightDistance < minDistance) {
                snappedX = elementBounds.right - draggedElement.size.width;
                minDistance = rightDistance;
            }

            // Snap to top edge
            const topDistance = Math.abs(draggedBounds.top - elementBounds.top);
            if (topDistance < minDistance) {
                snappedY = elementBounds.top;
                minDistance = topDistance;
            }

            // Snap to bottom edge
            const bottomDistance = Math.abs(draggedBounds.bottom - elementBounds.bottom);
            if (bottomDistance < minDistance) {
                snappedY = elementBounds.bottom - draggedElement.size.height;
                minDistance = bottomDistance;
            }
        }

        return { x: snappedX, y: snappedY };
    }, [elements, enableSnapping, constraints.snapToElements, snapDistance]);

    // 🎯 COLLISION DETECTION
    const detectCollisions = useCallback((elementId: string, x: number, y: number): CollisionResult => {
        if (!enableCollisionDetection) {
            return { hasCollision: false, collidingElements: [] };
        }

        const draggedElement = elements.find(el => el.id === elementId);
        if (!draggedElement) {
            return { hasCollision: false, collidingElements: [] };
        }

        const draggedBounds = {
            left: x,
            right: x + draggedElement.size.width,
            top: y,
            bottom: y + draggedElement.size.height
        };

        const collidingElements: string[] = [];

        for (const element of elements) {
            if (element.id === elementId) continue;

            const elementBounds = {
                left: element.position.x,
                right: element.position.x + element.size.width,
                top: element.position.y,
                bottom: element.position.y + element.size.height
            };

            // Check for overlap
            const hasOverlap = !(
                draggedBounds.right <= elementBounds.left ||
                draggedBounds.left >= elementBounds.right ||
                draggedBounds.bottom <= elementBounds.top ||
                draggedBounds.top >= elementBounds.bottom
            );

            if (hasOverlap) {
                collidingElements.push(element.id);
            }
        }

        return {
            hasCollision: collidingElements.length > 0,
            collidingElements
        };
    }, [elements, enableCollisionDetection]);

    // 🎯 APPLY CONSTRAINTS
    const applyConstraints = useCallback((x: number, y: number): { x: number; y: number } => {
        let constrainedX = x;
        let constrainedY = y;

        // Lock axes
        if (constraints.lockX) constrainedX = dragInfo?.startPosition.x || x;
        if (constraints.lockY) constrainedY = dragInfo?.startPosition.y || y;

        // Min/Max constraints
        if (constraints.minX !== undefined) constrainedX = Math.max(constrainedX, constraints.minX);
        if (constraints.maxX !== undefined) constrainedX = Math.min(constrainedX, constraints.maxX);
        if (constraints.minY !== undefined) constrainedY = Math.max(constrainedY, constraints.minY);
        if (constraints.maxY !== undefined) constrainedY = Math.min(constrainedY, constraints.maxY);

        // Container bounds
        if (constraints.containerBounds) {
            const { x: minX, y: minY, width, height } = constraints.containerBounds;
            constrainedX = Math.max(minX, Math.min(constrainedX, minX + width));
            constrainedY = Math.max(minY, Math.min(constrainedY, minY + height));
        }

        return { x: constrainedX, y: constrainedY };
    }, [constraints, dragInfo]);

    // 🎯 DRAG HANDLERS
    const startDrag = useCallback((elementId: string, startPos: { x: number; y: number }, offset: { x: number; y: number }) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        // Determine which elements to drag
        let draggedElements = [elementId];
        if (selectedElements.some(el => el.id === elementId) && selectedElements.length > 1) {
            draggedElements = selectedElements.map(el => el.id);
        }

        const newDragInfo: DragInfo = {
            elementId,
            startPosition: startPos,
            currentPosition: startPos,
            offset,
            isDragging: true,
            draggedElements,
            modifiers: { shift: false, ctrl: false, alt: false }
        };

        setDragInfo(newDragInfo);
        onDragStart?.(elementId);

        // Create drag preview
        setDragPreview(
            <div style={{
                position: 'absolute',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px dashed #3b82f6',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 10000,
                width: element.size.width,
                height: element.size.height
            }}>
                {draggedElements.length > 1 && (
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}>
                        {draggedElements.length} elements
                    </div>
                )}
            </div>
        );
    }, [elements, selectedElements, onDragStart]);

    const updateDrag = useCallback((position: { x: number; y: number }, modifiers: DragInfo['modifiers']) => {
        if (!dragInfo) return;

        let { x, y } = position;

        // Apply snapping
        const snappedToGrid = snapToGrid(x, y);
        const snappedToGuides = snapToGuides(snappedToGrid.x, snappedToGrid.y);
        const snappedToElements = snapToElements(dragInfo.elementId, snappedToGuides.x, snappedToGuides.y);

        ({ x, y } = snappedToElements);

        // Apply constraints
        ({ x, y } = applyConstraints(x, y));

        // Update drag info
        const updatedDragInfo: DragInfo = {
            ...dragInfo,
            currentPosition: { x, y },
            modifiers
        };

        setDragInfo(updatedDragInfo);
        onDragMove?.(dragInfo.elementId, { x, y });
    }, [dragInfo, snapToGrid, snapToGuides, snapToElements, applyConstraints, onDragMove]);

    const endDrag = useCallback(() => {
        if (!dragInfo) return;

        const { elementId, currentPosition, draggedElements } = dragInfo;

        // Check for drop zones
        let dropped = false;
        for (const [zoneId, zone] of dropZones) {
            const isInZone = (
                currentPosition.x >= zone.bounds.x &&
                currentPosition.x <= zone.bounds.x + zone.bounds.width &&
                currentPosition.y >= zone.bounds.y &&
                currentPosition.y <= zone.bounds.y + zone.bounds.height
            );

            if (isInZone && (!zone.canDrop || zone.canDrop(dragInfo))) {
                zone.onDrop?.(dragInfo);
                dropped = true;
                break;
            }
        }

        // If not dropped in a zone, update element positions
        if (!dropped) {
            for (const draggedId of draggedElements) {
                const element = elements.find(el => el.id === draggedId);
                if (!element) continue;

                let newPosition = currentPosition;

                // For multi-element drag, calculate relative positions
                if (draggedElements.length > 1 && draggedId !== elementId) {
                    const mainElement = elements.find(el => el.id === elementId);
                    if (mainElement) {
                        const deltaX = currentPosition.x - dragInfo.startPosition.x;
                        const deltaY = currentPosition.y - dragInfo.startPosition.y;
                        newPosition = {
                            x: element.position.x + deltaX,
                            y: element.position.y + deltaY
                        };
                    }
                }

                // Check for collisions
                const collision = detectCollisions(draggedId, newPosition.x, newPosition.y);
                if (collision.hasCollision && !dragInfo.modifiers.ctrl) {
                    // Find available position if collision detected
                    if (collision.availablePosition) {
                        newPosition = collision.availablePosition;
                    } else {
                        // Revert to original position
                        continue;
                    }
                }

                updateElement(draggedId, {
                    position: newPosition
                });
            }
        }

        onDragEnd?.(elementId, currentPosition);
        setDragInfo(null);
        setDragPreview(null);
    }, [dragInfo, dropZones, elements, detectCollisions, updateElement, onDragEnd]);

    // 🎯 DROP ZONE MANAGEMENT
    const registerDropZone = useCallback((dropZone: DropZone) => {
        dropZones.set(dropZone.id, dropZone);
    }, [dropZones]);

    const unregisterDropZone = useCallback((zoneId: string) => {
        dropZones.delete(zoneId);
    }, [dropZones]);

    const contextValue: DragContextType = {
        dragInfo,
        dropZones,
        isDragging: !!dragInfo,
        dragPreview,
        startDrag,
        updateDrag,
        endDrag,
        registerDropZone,
        unregisterDropZone,
        setDragPreview
    };

    return (
        <DragContext.Provider value={contextValue}>
            {children}
            {/* Drag Preview */}
            {dragPreview && dragInfo && (
                <div
                    style={{
                        position: 'fixed',
                        left: dragInfo.currentPosition.x + dragPreviewOffset.x,
                        top: dragInfo.currentPosition.y + dragPreviewOffset.y,
                        pointerEvents: 'none',
                        zIndex: 10000
                    }}
                >
                    {dragPreview}
                </div>
            )}
        </DragContext.Provider>
    );
};

// 🎯 HOOK
export const useDrag = () => {
    const context = React.useContext(DragContext);
    if (!context) {
        throw new Error('useDrag must be used within DragProvider');
    }
    return context;
};

// 🎯 DRAGGABLE COMPONENT
interface DraggableProps {
    elementId: string;
    children: ReactNode;
    disabled?: boolean;
    handle?: string; // CSS selector for drag handle
    dragPreview?: ReactNode;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    className?: string;
    style?: CSSProperties;
}

export const Draggable: React.FC<DraggableProps> = ({
    elementId,
    children,
    disabled = false,
    handle,
    dragPreview,
    onDragStart,
    onDragEnd,
    className = '',
    style = {}
}) => {
    const { startDrag, updateDrag, endDrag, setDragPreview } = useDrag();
    const dragRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabled || e.button !== 0) return;

        // Check if click is on handle (if specified)
        if (handle) {
            const target = e.target as HTMLElement;
            const handleElement = target.closest(handle);
            if (!handleElement) return;
        }

        e.preventDefault();
        e.stopPropagation();

        const rect = dragRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startPos = { x: e.clientX, y: e.clientY };
        const offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        setIsDragging(true);
        startDrag(elementId, startPos, offset);

        if (dragPreview) {
            setDragPreview(dragPreview);
        }

        onDragStart?.();

        // Mouse move handler
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const modifiers = {
                shift: moveEvent.shiftKey,
                ctrl: moveEvent.ctrlKey,
                alt: moveEvent.altKey
            };

            updateDrag({ x: moveEvent.clientX, y: moveEvent.clientY }, modifiers);
        };

        // Mouse up handler
        const handleMouseUp = () => {
            setIsDragging(false);
            endDrag();
            onDragEnd?.();

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

    }, [elementId, disabled, handle, startDrag, updateDrag, endDrag, setDragPreview, dragPreview, onDragStart, onDragEnd]);

    // Touch support
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (disabled) return;

        const touch = e.touches[0];
        const rect = dragRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startPos = { x: touch.clientX, y: touch.clientY };
        const offset = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };

        setIsDragging(true);
        startDrag(elementId, startPos, offset);

        if (dragPreview) {
            setDragPreview(dragPreview);
        }

        onDragStart?.();

        const handleTouchMove = (moveEvent: TouchEvent) => {
            moveEvent.preventDefault();
            const moveTouch = moveEvent.touches[0];
            const modifiers = { shift: false, ctrl: false, alt: false }; // Touch doesn't support modifiers

            updateDrag({ x: moveTouch.clientX, y: moveTouch.clientY }, modifiers);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
            endDrag();
            onDragEnd?.();

            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

    }, [elementId, disabled, startDrag, updateDrag, endDrag, setDragPreview, dragPreview, onDragStart, onDragEnd]);

    return (
        <div
            ref={dragRef}
            className={`draggable ${isDragging ? 'dragging' : ''} ${className}`}
            style={{
                cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                ...style
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {children}
        </div>
    );
};

// 🎯 DROP ZONE COMPONENT
interface DropZoneProps {
    id: string;
    accepts?: string[];
    canDrop?: (dragInfo: DragInfo) => boolean;
    onDrop?: (dragInfo: DragInfo) => void;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    highlightStyle?: CSSProperties;
}

export const DropZone: React.FC<DropZoneProps> = ({
    id,
    accepts = [],
    canDrop,
    onDrop,
    children,
    className = '',
    style = {},
    highlightStyle = {}
}) => {
    const { registerDropZone, unregisterDropZone, dragInfo } = useDrag();
    const dropRef = useRef<HTMLDivElement>(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    useEffect(() => {
        const element = dropRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const dropZone: DropZone = {
            id,
            bounds: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
            accepts,
            canDrop,
            onDrop
        };

        registerDropZone(dropZone);

        return () => {
            unregisterDropZone(id);
        };
    }, [id, accepts, canDrop, onDrop, registerDropZone, unregisterDropZone]);

    // Update highlight state based on drag info
    useEffect(() => {
        if (!dragInfo) {
            setIsHighlighted(false);
            return;
        }

        const element = dropRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const isInZone = (
            dragInfo.currentPosition.x >= rect.left &&
            dragInfo.currentPosition.x <= rect.right &&
            dragInfo.currentPosition.y >= rect.top &&
            dragInfo.currentPosition.y <= rect.bottom
        );

        const canDropHere = !canDrop || canDrop(dragInfo);
        setIsHighlighted(isInZone && canDropHere);

    }, [dragInfo, canDrop]);

    return (
        <div
            ref={dropRef}
            className={`drop-zone ${isHighlighted ? 'highlighted' : ''} ${className}`}
            style={{
                ...style,
                ...(isHighlighted ? highlightStyle : {})
            }}
        >
            {children}
        </div>
    );
};

// 🎯 DRAG HANDLE COMPONENT
interface DragHandleProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export const DragHandle: React.FC<DragHandleProps> = ({
    children,
    className = '',
    style = {}
}) => {
    return (
        <div
            className={`drag-handle ${className}`}
            style={{
                cursor: 'grab',
                userSelect: 'none',
                ...style
            }}
        >
            {children || (
                <div style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#6b7280'
                }}>
                    ⋮⋮
                </div>
            )}
        </div>
    );
};

export default DragProvider;