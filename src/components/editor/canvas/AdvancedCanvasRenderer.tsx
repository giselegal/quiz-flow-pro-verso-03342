/**
 * 🎨 ADVANCED CANVAS RENDERER - FASE 2
 * 
 * Sistema de renderização modular com:
 * ✅ Multi-layer rendering system
 * ✅ Advanced zoom and pan controls
 * ✅ Intelligent grid and snapping
 * ✅ Performance-optimized viewport culling
 * ✅ Real-time element manipulation
 * ✅ Responsive design preview modes
 */

import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo,
    CSSProperties
} from 'react';
import { useEditorCore, useEditorElements, useEditorViewport, useEditorSelection } from './EditorCore';

// 🎯 LAYER SYSTEM
export interface RenderLayer {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
    blendMode: string;
    elements: string[];
    zIndex: number;
}

export interface CanvasGrid {
    enabled: boolean;
    type: 'dots' | 'lines' | 'adaptive';
    size: number;
    color: string;
    opacity: number;
    snapToGrid: boolean;
    showGrid: boolean;
}

export interface CanvasGuides {
    enabled: boolean;
    horizontal: number[];
    vertical: number[];
    snapDistance: number;
    color: string;
    opacity: number;
}

export interface ViewportSettings {
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    panSensitivity: number;
    smoothZoom: boolean;
    boundaryClamping: boolean;
}

// 🎯 CANVAS RENDERER COMPONENT
interface AdvancedCanvasRendererProps {
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    layers?: RenderLayer[];
    grid?: CanvasGrid;
    guides?: CanvasGuides;
    viewportSettings?: ViewportSettings;
    devicePreview?: 'desktop' | 'tablet' | 'mobile' | 'custom';
    showElementBounds?: boolean;
    showElementNames?: boolean;
    enableInteractions?: boolean;
    onElementClick?: (elementId: string, event: React.MouseEvent) => void;
    onElementDoubleClick?: (elementId: string, event: React.MouseEvent) => void;
    onElementContextMenu?: (elementId: string, event: React.MouseEvent) => void;
    onCanvasClick?: (position: { x: number; y: number }, event: React.MouseEvent) => void;
    onViewportChange?: (viewport: any) => void;
}

export const AdvancedCanvasRenderer: React.FC<AdvancedCanvasRendererProps> = ({
    width = 1200,
    height = 800,
    className = '',
    style = {},
    layers = [],
    grid = {
        enabled: true,
        type: 'dots',
        size: 20,
        color: '#e5e5e5',
        opacity: 0.5,
        snapToGrid: true,
        showGrid: true
    },
    guides = {
        enabled: true,
        horizontal: [],
        vertical: [],
        snapDistance: 10,
        color: '#3b82f6',
        opacity: 0.8
    },
    viewportSettings = {
        minZoom: 0.1,
        maxZoom: 5,
        zoomStep: 0.1,
        panSensitivity: 1,
        smoothZoom: true,
        boundaryClamping: false
    },
    devicePreview = 'desktop',
    showElementBounds = true,
    showElementNames = true,
    enableInteractions = true,
    onElementClick,
    onElementDoubleClick,
    onElementContextMenu,
    onCanvasClick,
    onViewportChange
}) => {
    const { core, state } = useEditorCore();
    const { elements } = useEditorElements();
    const { viewport, setViewport, zoomIn, zoomOut } = useEditorViewport();
    const { selection, selectElement, clearSelection } = useEditorSelection();

    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isTransforming, setIsTransforming] = useState(false);

    // 🎯 DEVICE PREVIEW DIMENSIONS
    const deviceDimensions = useMemo(() => {
        switch (devicePreview) {
            case 'mobile':
                return { width: 375, height: 667, name: 'iPhone' };
            case 'tablet':
                return { width: 768, height: 1024, name: 'iPad' };
            case 'desktop':
                return { width: 1440, height: 900, name: 'Desktop' };
            default:
                return { width, height, name: 'Custom' };
        }
    }, [devicePreview, width, height]);

    // 🎯 GRID PATTERN GENERATOR
    const generateGridPattern = useCallback(() => {
        const { size, color, opacity, type } = grid;
        const scaledSize = size * viewport.zoom;

        if (!grid.showGrid || scaledSize < 5) return undefined;

        const patternId = `grid-${type}-${size}-${viewport.zoom}`;

        const gridSVG = `
            <svg width="${scaledSize}" height="${scaledSize}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="${patternId}" width="${scaledSize}" height="${scaledSize}" patternUnits="userSpaceOnUse">
                        ${type === 'dots'
                ? `<circle cx="${scaledSize / 2}" cy="${scaledSize / 2}" r="1" fill="${color}" opacity="${opacity}" />`
                : `<path d="M ${scaledSize} 0 L 0 0 0 ${scaledSize}" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}" />`
            }
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#${patternId})" />
            </svg>
        `;

        return `url("data:image/svg+xml,${encodeURIComponent(gridSVG)}")`;
    }, [grid, viewport.zoom]);

    // 🎯 COORDINATE TRANSFORMATION
    const screenToCanvas = useCallback((screenX: number, screenY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };

        const x = (screenX - rect.left - viewport.x) / viewport.zoom;
        const y = (screenY - rect.top - viewport.y) / viewport.zoom;

        return { x, y };
    }, [viewport]);

    const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
        return {
            x: canvasX * viewport.zoom + viewport.x,
            y: canvasY * viewport.zoom + viewport.y
        };
    }, [viewport]);

    // 🎯 SNAP TO GRID
    const snapToGrid = useCallback((x: number, y: number) => {
        if (!grid.snapToGrid) return { x, y };

        const snappedX = Math.round(x / grid.size) * grid.size;
        const snappedY = Math.round(y / grid.size) * grid.size;

        return { x: snappedX, y: snappedY };
    }, [grid]);

    // 🎯 SNAP TO GUIDES
    const snapToGuides = useCallback((x: number, y: number) => {
        if (!guides.enabled) return { x, y };

        let snappedX = x;
        let snappedY = y;

        // Snap to vertical guides
        for (const guide of guides.vertical) {
            if (Math.abs(x - guide) <= guides.snapDistance) {
                snappedX = guide;
                break;
            }
        }

        // Snap to horizontal guides
        for (const guide of guides.horizontal) {
            if (Math.abs(y - guide) <= guides.snapDistance) {
                snappedY = guide;
                break;
            }
        }

        return { x: snappedX, y: snappedY };
    }, [guides]);

    // 🎯 VIEWPORT CULLING
    const getVisibleElements = useCallback(() => {
        const viewBounds = {
            left: -viewport.x / viewport.zoom,
            top: -viewport.y / viewport.zoom,
            right: (-viewport.x + width) / viewport.zoom,
            bottom: (-viewport.y + height) / viewport.zoom
        };

        return elements.filter(element => {
            const elementBounds = {
                left: element.position.x,
                top: element.position.y,
                right: element.position.x + element.size.width,
                bottom: element.position.y + element.size.height
            };

            return !(
                elementBounds.right < viewBounds.left ||
                elementBounds.left > viewBounds.right ||
                elementBounds.bottom < viewBounds.top ||
                elementBounds.top > viewBounds.bottom
            );
        });
    }, [elements, viewport, width, height]);

    // 🎯 MOUSE EVENTS
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left mouse button

        const canvasPos = screenToCanvas(e.clientX, e.clientY);

        // Check if clicking on an element
        const clickedElement = elements.find(element => {
            const bounds = {
                left: element.position.x,
                top: element.position.y,
                right: element.position.x + element.size.width,
                bottom: element.position.y + element.size.height
            };

            return (
                canvasPos.x >= bounds.left &&
                canvasPos.x <= bounds.right &&
                canvasPos.y >= bounds.top &&
                canvasPos.y <= bounds.bottom
            );
        });

        if (clickedElement) {
            selectElement(clickedElement.id);
            onElementClick?.(clickedElement.id, e);
        } else {
            clearSelection();
            onCanvasClick?.(canvasPos, e);

            // Start panning
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [elements, screenToCanvas, selectElement, clearSelection, onElementClick, onCanvasClick]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setViewport({
            x: viewport.x + deltaX,
            y: viewport.y + deltaY
        });

        setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragStart, viewport, setViewport]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(
            viewportSettings.minZoom,
            Math.min(viewportSettings.maxZoom, viewport.zoom * scaleFactor)
        );

        if (newZoom !== viewport.zoom) {
            const zoomRatio = newZoom / viewport.zoom;
            const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
            const newY = mouseY - (mouseY - viewport.y) * zoomRatio;

            setViewport({
                x: newX,
                y: newY,
                zoom: newZoom
            });

            onViewportChange?.({ ...viewport, x: newX, y: newY, zoom: newZoom });
        }
    }, [viewport, viewportSettings, setViewport, onViewportChange]);

    // 🎯 KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '=':
                    case '+':
                        e.preventDefault();
                        zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        zoomOut();
                        break;
                    case '0':
                        e.preventDefault();
                        setViewport({ zoom: 1, x: 0, y: 0 });
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomIn, zoomOut, setViewport]);

    // 🎯 RENDER ELEMENT
    const renderElement = useCallback((element: any) => {
        const isSelected = selection.elements.includes(element.id);
        const screenPos = canvasToScreen(element.position.x, element.position.y);

        const elementStyle: CSSProperties = {
            position: 'absolute',
            left: screenPos.x,
            top: screenPos.y,
            width: element.size.width * viewport.zoom,
            height: element.size.height * viewport.zoom,
            zIndex: element.zIndex,
            opacity: element.visible ? 1 : 0.3,
            pointerEvents: element.locked ? 'none' : 'auto',
            transform: viewport.zoom !== 1 ? `scale(${viewport.zoom})` : undefined,
            transformOrigin: '0 0',
            ...element.styles
        };

        return (
            <div
                key={element.id}
                className={`canvas-element ${isSelected ? 'selected' : ''} ${element.type}`}
                style={elementStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onElementClick?.(element.id, e);
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onElementDoubleClick?.(element.id, e);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onElementContextMenu?.(element.id, e);
                }}
            >
                {/* Element content */}
                <div className="element-content">
                    {renderElementContent(element)}
                </div>

                {/* Selection bounds */}
                {isSelected && showElementBounds && (
                    <div className="element-bounds" style={{
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        border: '2px solid #3b82f6',
                        borderRadius: '4px',
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Element name */}
                {showElementNames && (
                    <div className="element-name" style={{
                        position: 'absolute',
                        top: -24,
                        left: 0,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none'
                    }}>
                        {element.type} ({element.id.slice(-4)})
                    </div>
                )}
            </div>
        );
    }, [selection, viewport, canvasToScreen, showElementBounds, showElementNames, onElementClick, onElementDoubleClick, onElementContextMenu]);

    // 🎯 RENDER ELEMENT CONTENT
    const renderElementContent = useCallback((element: any) => {
        switch (element.type) {
            case 'text':
                return (
                    <div style={{
                        ...element.styles,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {element.properties.content || 'Text Element'}
                    </div>
                );

            case 'button':
                return (
                    <button style={{
                        ...element.styles,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        background: '#3b82f6',
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}>
                        {element.properties.text || 'Button'}
                    </button>
                );

            case 'image':
                return (
                    <img
                        src={element.properties.src || '/placeholder.svg'}
                        alt={element.properties.alt || 'Image'}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            ...element.styles
                        }}
                    />
                );

            case 'container':
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '12px',
                        ...element.styles
                    }}>
                        Container
                    </div>
                );

            default:
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>
                        {element.type}
                    </div>
                );
        }
    }, []);

    // 🎯 RENDER GUIDES
    const renderGuides = useCallback(() => {
        if (!guides.enabled) return null;

        return (
            <div className="canvas-guides" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000
            }}>
                {/* Horizontal guides */}
                {guides.horizontal.map((y, index) => (
                    <div
                        key={`h-${index}`}
                        style={{
                            position: 'absolute',
                            top: canvasToScreen(0, y).y,
                            left: 0,
                            width: '100%',
                            height: '1px',
                            background: guides.color,
                            opacity: guides.opacity
                        }}
                    />
                ))}

                {/* Vertical guides */}
                {guides.vertical.map((x, index) => (
                    <div
                        key={`v-${index}`}
                        style={{
                            position: 'absolute',
                            left: canvasToScreen(x, 0).x,
                            top: 0,
                            width: '1px',
                            height: '100%',
                            background: guides.color,
                            opacity: guides.opacity
                        }}
                    />
                ))}
            </div>
        );
    }, [guides, canvasToScreen]);

    const visibleElements = getVisibleElements();
    const gridPattern = generateGridPattern();

    return (
        <div
            ref={canvasRef}
            className={`advanced-canvas-renderer ${className}`}
            style={{
                width: deviceDimensions.width,
                height: deviceDimensions.height,
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff',
                backgroundImage: gridPattern,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                ...style
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            {/* Canvas content */}
            <div className="canvas-content" style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}>
                {/* Render elements */}
                {visibleElements.map(renderElement)}

                {/* Render guides */}
                {renderGuides()}
            </div>

            {/* Viewport info */}
            <div className="viewport-info" style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace',
                pointerEvents: 'none'
            }}>
                {Math.round(viewport.zoom * 100)}% | {deviceDimensions.name} | {visibleElements.length} elements
            </div>
        </div>
    );
};

export default AdvancedCanvasRenderer;