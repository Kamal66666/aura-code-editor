import storage from '../store/storage';

// Utility functions for manual storage operations
export const clearEditorData = async (): Promise<void> => {
  try {
    await storage.clear();
    console.log('Editor data cleared successfully');
  } catch (error) {
    console.error('Failed to clear editor data:', error);
  }
};

export const exportEditorData = async (): Promise<string | null> => {
  try {
    const data = await storage.getItem('persist:root');
    return data ? JSON.stringify(data, null, 2) : null;
  } catch (error) {
    console.error('Failed to export editor data:', error);
    return null;
  }
};

export const importEditorData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);
    await storage.setItem('persist:root', data);
    console.log('Editor data imported successfully');
    return true;
  } catch (error) {
    console.error('Failed to import editor data:', error);
    return false;
  }
};

export const getStorageInfo = async (): Promise<{
  keys: string[];
  estimatedSize: number;
}> => {
  try {
    const keys = await storage.keys();
    let estimatedSize = 0;
    
    for (const key of keys) {
      const item = await storage.getItem(key);
      if (item) {
        estimatedSize += JSON.stringify(item).length;
      }
    }
    
    return { keys, estimatedSize };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return { keys: [], estimatedSize: 0 };
  }
};
