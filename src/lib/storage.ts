import { useSyncExternalStore } from 'react'

const FAVORITES_KEY = 'agent-architect:favorites'
const READING_KEY = 'agent-architect:reading-list'

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function makeStore(key: string) {
  const listeners = new Set<() => void>()
  let cache: string[] | null = null
  const emit = () => listeners.forEach((fn) => fn())
  return {
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    get() {
      if (!cache) cache = read(key)
      return cache
    },
    toggle(id: string) {
      const next = this.get().includes(id) ? this.get().filter((x) => x !== id) : [...this.get(), id]
      cache = next
      try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* storage unavailable */ }
      emit()
    },
    clear() {
      cache = []
      try { localStorage.removeItem(key) } catch { /* storage unavailable */ }
      emit()
    },
  }
}

export const favoritesStore = makeStore(FAVORITES_KEY)
export const readingListStore = makeStore(READING_KEY)

export function useFavorites(): string[] {
  return useSyncExternalStore(favoritesStore.subscribe, () => favoritesStore.get(), () => [])
}

export function useReadingList(): string[] {
  return useSyncExternalStore(readingListStore.subscribe, () => readingListStore.get(), () => [])
}

export function useIsFavorite(id: string): boolean {
  return useFavorites().includes(id)
}

export function useIsInReadingList(id: string): boolean {
  return useReadingList().includes(id)
}
