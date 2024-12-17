const STORAGE_PREFIX = 'whatsapp';

export const createStorageKey = (key: string): string =>
  `${STORAGE_PREFIX}:${key}`;

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
      })) as T;
    }

    return parsed;
  } catch (error) {
    console.error(`Error reading from storage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    // @ts-ignore
    const serialized = JSON.stringify(value, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    localStorage.setItem(createStorageKey(key), serialized);
  } catch (error) {
    console.error(`Error writing to storage:`, error);
  }
};
