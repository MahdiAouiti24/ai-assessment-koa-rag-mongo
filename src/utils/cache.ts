const store = new Map<string, { value: any; expiresAt: number }>();

export function setCache<T>(key: string, value: T, ttlSec = 900) {
  store.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
}

export function getCache<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}
