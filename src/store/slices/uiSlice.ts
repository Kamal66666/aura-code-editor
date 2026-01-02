import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '../../types/editor';

const initialState: UIState = {
  leftPanelWidth: 20, // percentage
  rightPanelWidth: 20, // percentage
  showGrid: true,
  showRulers: false,
  isMobile: false,
  panelsCollapsed: {
    left: false,
    right: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLeftPanelWidth: (state, action: PayloadAction<number>) => {
      state.leftPanelWidth = Math.max(10, Math.min(40, action.payload));
    },
    
    setRightPanelWidth: (state, action: PayloadAction<number>) => {
      state.rightPanelWidth = Math.max(10, Math.min(40, action.payload));
    },
    
    toggleLeftPanel: (state) => {
      state.panelsCollapsed.left = !state.panelsCollapsed.left;
    },
    
    toggleRightPanel: (state) => {
      state.panelsCollapsed.right = !state.panelsCollapsed.right;
    },
    
    setMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      if (action.payload) {
        // Auto-collapse panels on mobile
        state.panelsCollapsed.left = true;
        state.panelsCollapsed.right = true;
      }
    },
    
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    
    toggleRulers: (state) => {
      state.showRulers = !state.showRulers;
    },
  },
});

export const {
  setLeftPanelWidth,
  setRightPanelWidth,
  toggleLeftPanel,
  toggleRightPanel,
  setMobileView,
  toggleGrid,
  toggleRulers,
} = uiSlice.actions;

export default uiSlice.reducer;
