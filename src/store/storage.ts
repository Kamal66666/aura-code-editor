import localforage from 'localforage';

// Configure IndexedDB storage
const storage = localforage.createInstance({
  name: 'AuraEditor',
  storeName: 'editorState',
  driver: localforage.INDEXEDDB,
  description: 'Visual Editor State Storage'
});

// Fallback to localStorage if IndexedDB is not available
storage.config({
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
});

export default storage;
