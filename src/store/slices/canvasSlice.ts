import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CanvasState, EditorComponent, Position, Size } from '../../types/editor';

const initialState: CanvasState = {
  components: [],
  selectedComponentId: null,
  canvasSize: { width: 800, height: 600 },
  zoom: 1,
  gridEnabled: true,
  snapToGrid: true,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<EditorComponent>) => {
      state.components.push(action.payload);
    },
    
    updateComponent: (state, action: PayloadAction<{ id: string; updates: Partial<EditorComponent> }>) => {
      const { id, updates } = action.payload;
      const componentIndex = state.components.findIndex(comp => comp.id === id);
      if (componentIndex !== -1) {
        Object.assign(state.components[componentIndex], updates);
      }
    },
    
    deleteComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(comp => comp.id !== action.payload);
      if (state.selectedComponentId === action.payload) {
        state.selectedComponentId = null;
      }
    },
    
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },
    
    moveComponent: (state, action: PayloadAction<{ id: string; position: Position }>) => {
      const { id, position } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        component.position = position;
      }
    },
    
    resizeComponent: (state, action: PayloadAction<{ id: string; size: Size }>) => {
      const { id, size } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        component.size = size;
      }
    },
    
    setCanvasSize: (state, action: PayloadAction<Size>) => {
      state.canvasSize = action.payload;
    },
    
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(3, action.payload));
    },
    
    toggleGrid: (state) => {
      state.gridEnabled = !state.gridEnabled;
    },
    
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    
    clearCanvas: (state) => {
      state.components = [];
      state.selectedComponentId = null;
    },
  },
});

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  selectComponent,
  moveComponent,
  resizeComponent,
  setCanvasSize,
  setZoom,
  toggleGrid,
  toggleSnapToGrid,
  clearCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer;
