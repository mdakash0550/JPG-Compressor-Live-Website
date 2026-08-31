import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshotClin = () => JSON.stringify(initialValue);

  const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  };

  const rawState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshotClin);
  const state: T = JSON.parse(rawState);

  const setValue = (val: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  };

  return [state, setValue];
}
