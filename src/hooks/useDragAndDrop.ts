import { useCallback, useRef, useState } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { startDrag, endDrag, updateDragPosition } from '../store/slices/dragSlice';
import { addComponent, moveComponent } from '../store/slices/canvasSlice';
import type { PaletteItem, EditorComponent, Position } from '../types/editor';

interface DragState {
  isDragging: boolean;
  dragType: 'palette' | 'canvas' | null;
  dragData: PaletteItem | EditorComponent | null;
  startPosition: Position;
  currentPosition: Position;
  offset: Position;
}

export const useDragAndDrop = () => {
  const dispatch = useAppDispatch();
  const { zoom } = useAppSelector((state) => state.canvas);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    dragType: null,
    dragData: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const [ghostElement, setGhostElement] = useState<HTMLElement | null>(null);

  // Calculate position relative to canvas with zoom
  const calculateCanvasPosition = useCallback((clientX: number, clientY: number, canvasRect: DOMRect): Position => {
    const x = (clientX - canvasRect.left) / zoom;
    const y = (clientY - canvasRect.top) / zoom;
    return { x, y };
  }, [zoom]);

  // Apply boundary constraints
  const applyBoundaryConstraints = useCallback((position: Position, componentSize: { width: number; height: number }, canvasSize: { width: number; height: number }): Position => {
    return {
      x: Math.max(0, Math.min(position.x, canvasSize.width - componentSize.width)),
      y: Math.max(0, Math.min(position.y, canvasSize.height - componentSize.height)),
    };
  }, []);

  // Create ghost element for visual feedback
  const createGhostElement = useCallback((element: HTMLElement, dragType: 'palette' | 'canvas'): HTMLElement => {
    const ghost = element.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.7';
    ghost.style.transform = 'rotate(5deg) scale(0.8)';
    ghost.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    
    // Ensure consistent sizing for drag preview
    if (dragType === 'palette') {
      ghost.style.width = '80px';
      ghost.style.height = '60px';
      ghost.style.backgroundColor = '#3b82f6';
      ghost.style.color = 'white';
      ghost.style.border = '2px dashed #1d4ed8';
      ghost.style.display = 'flex';
      ghost.style.alignItems = 'center';
      ghost.style.justifyContent = 'center';
      ghost.style.fontSize = '12px';
      ghost.style.borderRadius = '4px';
    } else {
      // For canvas components, make a smaller, consistent ghost
      ghost.style.width = '100px';
      ghost.style.height = '80px';
      ghost.style.border = '2px solid #3b82f6';
      ghost.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      ghost.style.display = 'flex';
      ghost.style.alignItems = 'center';
      ghost.style.justifyContent = 'center';
      ghost.style.fontSize = '12px';
      ghost.style.borderRadius = '4px';
      ghost.style.color = '#3b82f6';
      ghost.style.fontWeight = 'bold';
      
      // Clear the content and show a simple indicator
      ghost.innerHTML = '📦 Moving';
    }
    
    document.body.appendChild(ghost);
    return ghost;
  }, []);

  // Update ghost element position
  const updateGhostPosition = useCallback((ghost: HTMLElement, x: number, y: number) => {
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  }, []);

  // Remove ghost element
  const removeGhostElement = useCallback(() => {
    if (ghostElement) {
      document.body.removeChild(ghostElement);
      setGhostElement(null);
    }
  }, [ghostElement]);

  // Start drag from palette
  const startPaletteDrag = useCallback((e: React.MouseEvent, paletteItem: PaletteItem) => {
    e.preventDefault();
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    dragStateRef.current = {
      isDragging: true,
      dragType: 'palette',
      dragData: paletteItem,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
      offset,
    };

    const ghost = createGhostElement(e.target as HTMLElement, 'palette');
    setGhostElement(ghost);
    updateGhostPosition(ghost, e.clientX - offset.x, e.clientY - offset.y);

    dispatch(startDrag({
      componentType: paletteItem.type,
      offset,
    }));
  }, [createGhostElement, updateGhostPosition, dispatch]);

  // Start drag from canvas component
  const startCanvasDrag = useCallback((e: React.MouseEvent, component: EditorComponent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    dragStateRef.current = {
      isDragging: true,
      dragType: 'canvas',
      dragData: component,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
      offset,
    };

    const ghost = createGhostElement(e.target as HTMLElement, 'canvas');
    setGhostElement(ghost);
    updateGhostPosition(ghost, e.clientX - offset.x, e.clientY - offset.y);

    dispatch(startDrag({
      componentId: component.id,
      offset,
    }));
  }, [createGhostElement, updateGhostPosition, dispatch]);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;

    const currentPosition = { x: e.clientX, y: e.clientY };
    dragStateRef.current.currentPosition = currentPosition;

    if (ghostElement) {
      updateGhostPosition(
        ghostElement,
        e.clientX - dragStateRef.current.offset.x,
        e.clientY - dragStateRef.current.offset.y
      );
    }

    dispatch(updateDragPosition(currentPosition));
  }, [ghostElement, updateGhostPosition, dispatch]);

  // Handle mouse up (drop)
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;

    const { dragType, dragData } = dragStateRef.current;
    
    // Find canvas element
    const canvasElement = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvasElement) {
      removeGhostElement();
      dragStateRef.current.isDragging = false;
      dispatch(endDrag());
      return;
    }

    const canvasRect = canvasElement.getBoundingClientRect();
    const isOverCanvas = (
      e.clientX >= canvasRect.left &&
      e.clientX <= canvasRect.right &&
      e.clientY >= canvasRect.top &&
      e.clientY <= canvasRect.bottom
    );

    if (isOverCanvas) {
      const canvasPosition = calculateCanvasPosition(e.clientX, e.clientY, canvasRect);

      if (dragType === 'palette' && dragData) {
        // Create new component from palette
        const paletteItem = dragData as PaletteItem;
        const newComponent: EditorComponent = {
          ...paletteItem.defaultProps,
          id: `${paletteItem.type}-${Date.now()}`,
          position: applyBoundaryConstraints(
            canvasPosition,
            paletteItem.defaultProps.size || { width: 100, height: 50 },
            { width: 800, height: 600 } // TODO: Get actual canvas size
          ),
        } as EditorComponent;

        dispatch(addComponent(newComponent));
      } else if (dragType === 'canvas' && dragData) {
        // Move existing component
        const component = dragData as EditorComponent;
        const newPosition = applyBoundaryConstraints(
          {
            x: canvasPosition.x - dragStateRef.current.offset.x / zoom,
            y: canvasPosition.y - dragStateRef.current.offset.y / zoom,
          },
          component.size,
          { width: 800, height: 600 } // TODO: Get actual canvas size
        );

        dispatch(moveComponent({
          id: component.id,
          position: newPosition,
        }));
      }
    }

    removeGhostElement();
    dragStateRef.current.isDragging = false;
    dispatch(endDrag());
  }, [calculateCanvasPosition, applyBoundaryConstraints, removeGhostElement, dispatch, zoom]);

  // Set up global mouse event listeners
  const setupGlobalListeners = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    startPaletteDrag,
    startCanvasDrag,
    setupGlobalListeners,
    isDragging: dragStateRef.current.isDragging,
  };
};
