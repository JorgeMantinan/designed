import { parseDesignSpec } from '@designed/schema';
import type { DesignSpec } from '@designed/schema';

/**
 * Tiny external store around the localStorage save, consumed with
 * `useSyncExternalStore` (SSR-safe via `getSavedServerSnapshot`) — the
 * React-blessed pattern instead of setState inside an effect.
 */

const STORAGE_KEY = 'designed:v1';

let cache: string | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeSaved(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (): void => {
    cache = read();
    listener();
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

/** Current raw save (read once, then kept in a module-level cache). */
export function getSavedRaw(): string | null {
  if (!hydrated) {
    cache = read();
    hydrated = true;
  }
  return cache;
}

/** Server snapshot: no localStorage during SSR. */
export function getSavedServerRaw(): string | null {
  return null;
}

/** Writes the design and notifies subscribers (used by the autosave). */
export function writeSaved(spec: DesignSpec): void {
  try {
    const raw = JSON.stringify(spec);
    localStorage.setItem(STORAGE_KEY, raw);
    cache = raw;
    hydrated = true;
    notify();
  } catch {
    // Storage full or unavailable: the JSON export still works.
  }
}

export function clearSaved(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore: nothing to clear.
  }
  cache = null;
  hydrated = true;
  notify();
}

/** Parses a raw save into a valid spec (null when missing or corrupt). */
export function parseSaved(raw: string | null): DesignSpec | null {
  if (!raw) return null;
  try {
    const result = parseDesignSpec(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
