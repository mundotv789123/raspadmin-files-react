'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const isClient = typeof window !== 'undefined';

  const [state, setState] = useState<T>(() => {
    if (!isClient) 
      return initialValue;
    
    const storedValue = localStorage.getItem(key);
    return storedValue ? { ...initialValue, ...JSON.parse(storedValue) } : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}