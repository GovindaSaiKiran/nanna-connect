import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(initialValue)) {
          if (!Array.isArray(parsed)) {
            window.localStorage.setItem(key, JSON.stringify(initialValue));
            return initialValue;
          }
          return parsed;
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
