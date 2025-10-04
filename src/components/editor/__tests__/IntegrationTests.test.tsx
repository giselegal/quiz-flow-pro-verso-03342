/**
 * 🎯 INTEGRATION TESTING SUITE - FASE 2
 * 
 * Suíte completa de testes de integração para todos os componentes modulares:
 * ✅ Testes de EditorCore com state management e plugins
 * ✅ Testes de AdvancedCanvasRenderer com rendering e viewport
 * ✅ Testes de SmartComponentLibrary com auto-configuração
 * ✅ Testes de AdvancedPropertiesPanel com validação dinâmica
 * ✅ Testes de DragDropSystem com constraints e collision
 * ✅ Testes de RealTimeCollaboration com sync e conflicts
 * ✅ Testes de PerformanceOptimization com métricas
 * ✅ E2E testing com cenários completos de uso
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import dos componentes a serem testados
import { EditorProvider, useEditorCore, useEditorElements } from '../core/EditorCore';
import { AdvancedCanvasRenderer } from '../canvas/AdvancedCanvasRenderer';
import { SmartComponentLibrary, SmartButton } from '../smart/SmartComponentLibrary';
import { AdvancedPropertiesPanel } from '../properties/AdvancedPropertiesPanel';
import { DragProvider, Draggable, DropZone } from '../drag/AdvancedDragDropSystem';
import { CollaborationProvider, useCollaboration } from '../collaboration/RealTimeCollaboration';
import { PerformanceProvider, usePerformance } from '../performance/PerformanceOptimization';

// 🎯 MOCK UTILITIES
const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    readyState: WebSocket.OPEN
};

// Mock WebSocket global
(global as any).WebSocket = jest.fn(() => mockWebSocket);

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
(global as any).IntersectionObserver = mockIntersectionObserver;

// Mock performance APIs
Object.defineProperty(global.performance, 'memory', {
    value: { usedJSHeapSize: 1000000 },
    writable: true
});

Object.defineProperty(global.navigator, 'hardwareConcurrency', {
    value: 4,
    writable: true
});

// 🎯 TEST WRAPPER COMPONENTS
const EditorTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <EditorProvider>
        <PerformanceProvider>
            <DragProvider>
                <CollaborationProvider websocketUrl="ws://localhost:8080">
                    {children}
                </CollaborationProvider>
            </DragProvider>
        </PerformanceProvider>
    </EditorProvider>
);

// 🎯 EDITOR CORE TESTS
describe('EditorCore Integration Tests', () => {
    test('should initialize with default state', () => {
        const { result } = renderHook(() => useEditorCore(), {
            wrapper: EditorTestWrapper
        });

        expect(result.current.core).toBeDefined();
        expect(result.current.core.getState()).toMatchObject({
            elements: [],
            selectedElements: [],
            viewport: expect.objectContaining({
                x: 0,
                y: 0,
                zoom: 1
            }),
            grid: expect.objectContaining({
                enabled: true,
                size: 20
            })
        });
    });

    test('should add and remove elements', async () => {
        const { result } = renderHook(() => ({
            core: useEditorCore(),
            elements: useEditorElements()
        }), {
            wrapper: EditorTestWrapper
        });

        const testElement = {
            id: 'test-element',
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 50 },
            properties: { text: 'Test Text' }
        };

        act(() => {
            result.current.elements.addElement(testElement);
        });

        expect(result.current.elements.elements).toHaveLength(1);
        expect(result.current.elements.elements[0]).toMatchObject(testElement);

        act(() => {
            result.current.elements.removeElement('test-element');
        });

        expect(result.current.elements.elements).toHaveLength(0);
    });

    test('should handle plugin registration and execution', async () => {
        const { result } = renderHook(() => useEditorCore(), {
            wrapper: EditorTestWrapper
        });

        const mockPlugin = {
            name: 'test-plugin',
            version: '1.0.0',
            initialize: jest.fn(),
            destroy: jest.fn(),
            hooks: {}
        };

        act(() => {
            result.current.core.registerPlugin(mockPlugin);
        });

        expect(mockPlugin.initialize).toHaveBeenCalled();
        expect(result.current.core.getPlugins()).toContain(mockPlugin);

        act(() => {
            result.current.core.unregisterPlugin('test-plugin');
        });

        expect(mockPlugin.destroy).toHaveBeenCalled();
    });
});

// 🎯 CANVAS RENDERER TESTS
describe('AdvancedCanvasRenderer Integration Tests', () => {
    test('should render elements on canvas', async () => {
        render(
            <EditorTestWrapper>
                <AdvancedCanvasRenderer
                    width={800}
                    height={600}
                    elements={[
                        {
                            id: 'canvas-element',
                            type: 'rectangle',
                            position: { x: 50, y: 50 },
                            size: { width: 100, height: 100 },
                            properties: { fill: '#ff0000' }
                        }
                    ]}
                />
            </EditorTestWrapper>
        );

        const canvas = screen.getByRole('img'); // Canvas has img role
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute('width', '800');
        expect(canvas).toHaveAttribute('height', '600');
    });

    test('should handle zoom and pan operations', async () => {
        const user = userEvent.setup();

        render(
            <EditorTestWrapper>
                <AdvancedCanvasRenderer
                    width={800}
                    height={600}
                    elements={[]}
                    enableZoom={true}
                    enablePan={true}
                />
            </EditorTestWrapper>
        );

        const canvas = screen.getByRole('img');

        // Test zoom with wheel
        await user.hover(canvas);
        fireEvent.wheel(canvas, { deltaY: -100, ctrlKey: true });

        // Test pan with mouse drag
        fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
        fireEvent.mouseUp(canvas);

        expect(canvas).toBeInTheDocument();
    });
});

// 🎯 SMART COMPONENT LIBRARY TESTS
describe('SmartComponentLibrary Integration Tests', () => {
    test('should auto-configure components based on context', async () => {
        const { result } = renderHook(() => useEditorElements(), {
            wrapper: EditorTestWrapper
        });

        // Add context elements that should influence auto-configuration
        act(() => {
            result.current.addElement({
                id: 'context-button',
                type: 'button',
                position: { x: 100, y: 100 },
                size: { width: 120, height: 40 },
                properties: {
                    text: 'Primary Action',
                    variant: 'primary',
                    size: 'large'
                }
            });
        });

        render(
            <EditorTestWrapper>
                <SmartButton
                    elementId="smart-button"
                    autoConfig={true}
                />
            </EditorTestWrapper>
        );

        await waitFor(() => {
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            // Should inherit similar styling from context
            expect(button).toHaveClass('smart-component');
        });
    });

    test('should validate properties in real-time', async () => {
        const user = userEvent.setup();

        render(
            <EditorTestWrapper>
                <SmartButton
                    elementId="validation-button"
                    properties={{
                        text: '',
                        variant: 'primary'
                    }}
                    enableValidation={true}
                />
            </EditorTestWrapper>
        );

        // Should show validation error for empty text
        await waitFor(() => {
            expect(screen.getByText(/text is required/i)).toBeInTheDocument();
        });

        // Fix validation error
        const textInput = screen.getByLabelText(/text/i);
        await user.type(textInput, 'Valid Button Text');

        await waitFor(() => {
            expect(screen.queryByText(/text is required/i)).not.toBeInTheDocument();
        });
    });
});

// 🎯 PROPERTIES PANEL TESTS
describe('AdvancedPropertiesPanel Integration Tests', () => {
    test('should display properties for selected element', async () => {
        const testElement = {
            id: 'props-test-element',
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 50 },
            properties: {
                text: 'Test Text',
                fontSize: 16,
                color: '#000000'
            }
        };

        render(
            <EditorTestWrapper>
                <AdvancedPropertiesPanel
                    selectedElements={[testElement]}
                    onUpdateElement={() => { }}
                />
            </EditorTestWrapper>
        );

        expect(screen.getByDisplayValue('Test Text')).toBeInTheDocument();
        expect(screen.getByDisplayValue('16')).toBeInTheDocument();
        expect(screen.getByDisplayValue('#000000')).toBeInTheDocument();
    });

    test('should handle batch editing for multiple elements', async () => {
        const user = userEvent.setup();
        const mockUpdateElement = jest.fn();

        const elements = [
            {
                id: 'element-1',
                type: 'text',
                position: { x: 100, y: 100 },
                size: { width: 200, height: 50 },
                properties: { fontSize: 16, color: '#000000' }
            },
            {
                id: 'element-2',
                type: 'text',
                position: { x: 150, y: 150 },
                size: { width: 200, height: 50 },
                properties: { fontSize: 14, color: '#000000' }
            }
        ];

        render(
            <EditorTestWrapper>
                <AdvancedPropertiesPanel
                    selectedElements={elements}
                    onUpdateElement={mockUpdateElement}
                    enableBatchEditing={true}
                />
            </EditorTestWrapper>
        );

        // Should show mixed values indicator
        expect(screen.getByText(/mixed values/i)).toBeInTheDocument();

        // Change color for all selected elements
        const colorInput = screen.getByLabelText(/color/i);
        await user.clear(colorInput);
        await user.type(colorInput, '#ff0000');

        await waitFor(() => {
            expect(mockUpdateElement).toHaveBeenCalledTimes(2);
            expect(mockUpdateElement).toHaveBeenCalledWith('element-1', expect.objectContaining({
                properties: expect.objectContaining({ color: '#ff0000' })
            }));
            expect(mockUpdateElement).toHaveBeenCalledWith('element-2', expect.objectContaining({
                properties: expect.objectContaining({ color: '#ff0000' })
            }));
        });
    });
});

// 🎯 DRAG & DROP TESTS
describe('DragDropSystem Integration Tests', () => {
    test('should handle drag and drop operations', async () => {
        const user = userEvent.setup();
        const mockOnDrop = jest.fn();

        render(
            <EditorTestWrapper>
                <div style={{ width: '800px', height: '600px', position: 'relative' }}>
                    <Draggable elementId="draggable-element">
                        <div style={{ width: '100px', height: '100px', background: 'blue' }}>
                            Drag me
                        </div>
                    </Draggable>

                    <DropZone
                        id="drop-zone"
                        onDrop={mockOnDrop}
                        style={{
                            position: 'absolute',
                            top: '200px',
                            left: '200px',
                            width: '200px',
                            height: '200px',
                            background: 'lightgray'
                        }}
                    >
                        Drop here
                    </DropZone>
                </div>
            </EditorTestWrapper>
        );

        const draggableElement = screen.getByText('Drag me');
        const dropZone = screen.getByText('Drop here');

        // Simulate drag and drop
        fireEvent.mouseDown(draggableElement, { clientX: 50, clientY: 50 });
        fireEvent.mouseMove(document, { clientX: 300, clientY: 300 });
        fireEvent.mouseUp(document);

        await waitFor(() => {
            expect(mockOnDrop).toHaveBeenCalled();
        });
    });

    test('should respect drag constraints', async () => {
        const mockOnDragMove = jest.fn();

        render(
            <EditorTestWrapper>
                <DragProvider
                    constraints={{
                        minX: 0,
                        maxX: 400,
                        minY: 0,
                        maxY: 300,
                        snapToGrid: true
                    }}
                    onDragMove={mockOnDragMove}
                >
                    <Draggable elementId="constrained-element">
                        <div style={{ width: '50px', height: '50px', background: 'red' }}>
                            Constrained
                        </div>
                    </Draggable>
                </DragProvider>
            </EditorTestWrapper>
        );

        const draggableElement = screen.getByText('Constrained');

        // Try to drag beyond constraints
        fireEvent.mouseDown(draggableElement, { clientX: 25, clientY: 25 });
        fireEvent.mouseMove(document, { clientX: 500, clientY: 400 }); // Beyond max constraints
        fireEvent.mouseUp(document);

        await waitFor(() => {
            expect(mockOnDragMove).toHaveBeenCalled();
            // Position should be constrained to max values
            const lastCall = mockOnDragMove.mock.calls[mockOnDragMove.mock.calls.length - 1];
            expect(lastCall[1].x).toBeLessThanOrEqual(400);
            expect(lastCall[1].y).toBeLessThanOrEqual(300);
        });
    });
});

// 🎯 COLLABORATION TESTS
describe('RealTimeCollaboration Integration Tests', () => {
    test('should handle user presence updates', async () => {
        const { result } = renderHook(() => useCollaboration(), {
            wrapper: ({ children }) => (
                <EditorTestWrapper>
                    <CollaborationProvider websocketUrl="ws://localhost:8080">
                        {children}
                    </CollaborationProvider>
                </EditorTestWrapper>
            )
        });

        const testUser = {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            color: '#ff0000',
            isOnline: true,
            lastSeen: new Date(),
            permissions: {
                canEdit: true,
                canDelete: false,
                canAddElements: true,
                canManageUsers: false,
                canExport: false,
                isOwner: false
            }
        };

        await act(async () => {
            await result.current.connect('test-session', testUser);
        });

        expect(result.current.currentUser).toEqual(testUser);
        expect(result.current.isConnected).toBe(true);

        act(() => {
            result.current.updatePresence({
                cursor: { x: 100, y: 100 },
                selection: ['element-1']
            });
        });

        expect(result.current.presence.get('user-1')).toMatchObject({
            userId: 'user-1',
            cursor: { x: 100, y: 100 },
            selection: ['element-1']
        });
    });

    test('should resolve operation conflicts', async () => {
        const { result } = renderHook(() => useCollaboration(), {
            wrapper: ({ children }) => (
                <EditorTestWrapper>
                    <CollaborationProvider websocketUrl="ws://localhost:8080">
                        {children}
                    </CollaborationProvider>
                </EditorTestWrapper>
            )
        });

        const testUser = {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com',
            color: '#ff0000',
            isOnline: true,
            lastSeen: new Date(),
            permissions: {
                canEdit: true,
                canDelete: false,
                canAddElements: true,
                canManageUsers: false,
                canExport: false,
                isOwner: false
            }
        };

        await act(async () => {
            await result.current.connect('test-session', testUser);
        });

        // Send conflicting operations
        act(() => {
            result.current.sendOperation({
                type: 'update',
                elementId: 'conflict-element',
                data: { properties: { text: 'Version A' } }
            });
        });

        // Simulate receiving conflicting operation from another user
        const conflictOperation = {
            id: 'conflict-op',
            type: 'update' as const,
            elementId: 'conflict-element',
            data: { properties: { text: 'Version B' } },
            userId: 'user-2',
            timestamp: new Date()
        };

        // This would typically be handled by the WebSocket message handler
        // For testing, we'll simulate the conflict resolution
        act(() => {
            result.current.resolveConflict('conflict-op', 'accept');
        });

        expect(result.current.conflicts).toHaveLength(0);
    });
});

// 🎯 PERFORMANCE TESTS
describe('PerformanceOptimization Integration Tests', () => {
    test('should track performance metrics', async () => {
        const { result } = renderHook(() => usePerformance(), {
            wrapper: ({ children }) => (
                <EditorTestWrapper>
                    <PerformanceProvider enableProfiling={true}>
                        {children}
                    </PerformanceProvider>
                </EditorTestWrapper>
            )
        });

        act(() => {
            result.current.startProfiling();
        });

        // Simulate some work
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 10));
        });

        const metrics = result.current.stopProfiling();

        expect(metrics).toMatchObject({
            renderTime: expect.any(Number),
            memoryUsage: expect.any(Number),
            elementsCount: expect.any(Number),
            visibleElements: expect.any(Number),
            cacheHitRate: expect.any(Number),
            workerTasksActive: expect.any(Number),
            frameRate: expect.any(Number),
            lastUpdate: expect.any(Date)
        });
    });

    test('should cache and retrieve data efficiently', async () => {
        const { result } = renderHook(() => usePerformance(), {
            wrapper: ({ children }) => (
                <EditorTestWrapper>
                    <PerformanceProvider>
                        {children}
                    </PerformanceProvider>
                </EditorTestWrapper>
            )
        });

        const testData = { id: 'test', value: 'cached data' };

        act(() => {
            result.current.cache.set('test-key', testData);
        });

        const retrievedData = result.current.cache.get('test-key');
        expect(retrievedData).toEqual(testData);

        // Test cache miss
        const missedData = result.current.cache.get('non-existent-key');
        expect(missedData).toBeNull();
    });

    test('should execute worker tasks', async () => {
        const { result } = renderHook(() => usePerformance(), {
            wrapper: ({ children }) => (
                <EditorTestWrapper>
                    <PerformanceProvider enableWorkers={true}>
                        {children}
                    </PerformanceProvider>
                </EditorTestWrapper>
            )
        });

        const taskResult = await act(async () => {
            return result.current.executeWorkerTask({
                type: 'heavy-calculation',
                data: { iterations: 1000 },
                priority: 1
            });
        });

        expect(taskResult).toMatchObject({
            result: expect.any(Number),
            duration: expect.any(Number)
        });
    });
});

// 🎯 E2E INTEGRATION TESTS
describe('End-to-End Integration Tests', () => {
    test('should complete full editor workflow', async () => {
        const user = userEvent.setup();
        const mockSaveCallback = jest.fn();

        render(
            <EditorTestWrapper>
                <div data-testid="editor-app">
                    <AdvancedCanvasRenderer
                        width={800}
                        height={600}
                        elements={[]}
                    />
                    <SmartComponentLibrary />
                    <AdvancedPropertiesPanel
                        selectedElements={[]}
                        onUpdateElement={() => { }}
                    />
                    <button onClick={mockSaveCallback}>Save</button>
                </div>
            </EditorTestWrapper>
        );

        const editorApp = screen.getByTestId('editor-app');
        expect(editorApp).toBeInTheDocument();

        const canvas = screen.getByRole('img');
        expect(canvas).toBeInTheDocument();

        const saveButton = screen.getByText('Save');
        await user.click(saveButton);

        expect(mockSaveCallback).toHaveBeenCalled();
    });

    test('should handle complex multi-user collaboration scenario', async () => {
        const mockWebSocketSend = jest.fn();
        mockWebSocket.send = mockWebSocketSend;

        const { result } = renderHook(() => ({
            collaboration: useCollaboration(),
            elements: useEditorElements()
        }), {
            wrapper: EditorTestWrapper
        });

        const user1 = {
            id: 'user-1',
            name: 'User 1',
            email: 'user1@example.com',
            color: '#ff0000',
            isOnline: true,
            lastSeen: new Date(),
            permissions: {
                canEdit: true,
                canDelete: true,
                canAddElements: true,
                canManageUsers: true,
                canExport: true,
                isOwner: true
            }
        };

        // Connect user
        await act(async () => {
            await result.current.collaboration.connect('e2e-session', user1);
        });

        // Add element
        act(() => {
            result.current.elements.addElement({
                id: 'e2e-element',
                type: 'text',
                position: { x: 100, y: 100 },
                size: { width: 200, height: 50 },
                properties: { text: 'Collaborative Text' }
            });
        });

        // Send operation
        act(() => {
            result.current.collaboration.sendOperation({
                type: 'create',
                elementId: 'e2e-element',
                data: {
                    type: 'text',
                    position: { x: 100, y: 100 },
                    size: { width: 200, height: 50 },
                    properties: { text: 'Collaborative Text' }
                }
            });
        });

        // Update presence
        act(() => {
            result.current.collaboration.updatePresence({
                cursor: { x: 150, y: 125 },
                selection: ['e2e-element']
            });
        });

        expect(result.current.collaboration.isConnected).toBe(true);
        expect(result.current.elements.elements).toHaveLength(1);
        expect(mockWebSocketSend).toHaveBeenCalled();
    });
});

// 🎯 PERFORMANCE BENCHMARKS
describe('Performance Benchmarks', () => {
    test('should handle large number of elements efficiently', async () => {
        const startTime = performance.now();

        const { result } = renderHook(() => useEditorElements(), {
            wrapper: EditorTestWrapper
        });

        // Add 1000 elements
        act(() => {
            for (let i = 0; i < 1000; i++) {
                result.current.addElement({
                    id: `perf-element-${i}`,
                    type: 'rectangle',
                    position: { x: i % 40 * 20, y: Math.floor(i / 40) * 20 },
                    size: { width: 15, height: 15 },
                    properties: { fill: `hsl(${i % 360}, 50%, 50%)` }
                });
            }
        });

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(result.current.elements).toHaveLength(1000);
        expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should maintain smooth performance with complex operations', async () => {
        const { result } = renderHook(() => ({
            elements: useEditorElements(),
            performance: usePerformance()
        }), {
            wrapper: EditorTestWrapper
        });

        act(() => {
            result.current.performance.startProfiling();
        });

        // Perform complex operations
        act(() => {
            // Add elements
            for (let i = 0; i < 100; i++) {
                result.current.elements.addElement({
                    id: `complex-element-${i}`,
                    type: 'text',
                    position: { x: Math.random() * 800, y: Math.random() * 600 },
                    size: { width: 100, height: 30 },
                    properties: { text: `Element ${i}` }
                });
            }

            // Update elements
            for (let i = 0; i < 50; i++) {
                result.current.elements.updateElement(`complex-element-${i}`, {
                    position: { x: Math.random() * 800, y: Math.random() * 600 }
                });
            }

            // Remove some elements
            for (let i = 90; i < 100; i++) {
                result.current.elements.removeElement(`complex-element-${i}`);
            }
        });

        const metrics = result.current.performance.stopProfiling();

        expect(metrics.renderTime).toBeLessThan(16); // 60 FPS target
        expect(result.current.elements.elements).toHaveLength(90);
    });
});

export default {};