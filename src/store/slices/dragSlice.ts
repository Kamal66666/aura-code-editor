import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DragState, ComponentType, Position } from '../../types/editor';

const initialState: DragState = {
  isDragging: false,
  draggedComponent: null,
  draggedComponentId: null,
  dragOffset: { x: 0, y: 0 },
  dropZone: null,
};

const dragSlice = createSlice({
  name: 'drag',
  initialState,
  reducers: {
    startDrag: (state, action: PayloadAction<{ 
      componentType?: ComponentType; 
      componentId?: string; 
      offset: Position 
    }>) => {
      const { componentType, componentId, offset } = action.payload;
      state.isDragging = true;
      state.draggedComponent = componentType || null;
      state.draggedComponentId = componentId || null;
      state.dragOffset = offset;
    },
    
    updateDragPosition: (state, action: PayloadAction<Position>) => {
      // This can be used for visual feedback during drag
      const { x, y } = action.payload;
      state.dragOffset = { x, y };
    },
    
    setDropZone: (state, action: PayloadAction<'canvas' | 'palette' | null>) => {
      state.dropZone = action.payload;
    },
    
    endDrag: (state) => {
      state.isDragging = false;
      state.draggedComponent = null;
      state.draggedComponentId = null;
      state.dragOffset = { x: 0, y: 0 };
      state.dropZone = null;
    },
  },
});

export const {
  startDrag,
  updateDragPosition,
  setDropZone,
  endDrag,
} = dragSlice.actions;

export default dragSlice.reducer;
