import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: "low" | "medium" | "high";
  due?: string;
  done: boolean;
  createdAt: number;
};

export type ThreadMeta = {
  id: string;
  title: string;
  updatedAt: number;
};
