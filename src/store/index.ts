import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from './storage';
import canvasReducer from './slices/canvasSlice';
import uiReducer from './slices/uiSlice';
import dragReducer from './slices/dragSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['canvas', 'ui'], // Only persist canvas and ui state, not drag state
  version: 1,
};

// Combine reducers
const rootReducer = combineReducers({
  canvas: canvasReducer,
  ui: uiReducer,
  drag: dragReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
