import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './slices/canvasSlice';
import dragReducer from './slices/dragSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    drag: dragReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
