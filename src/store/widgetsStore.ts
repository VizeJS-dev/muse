import { create } from 'zustand'

export type WidgetType = 'placeholder' | string

export interface WidgetItem {
  id: string
  title: string
  type: WidgetType
  // Grid layout props compatible with react-grid-layout
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

interface WidgetsState {
  items: WidgetItem[]
  add: (partial?: Partial<WidgetItem>) => void
  remove: (id: string) => void
  updateLayout: (next: Pick<WidgetItem, 'id' | 'x' | 'y' | 'w' | 'h'>[]) => void
  reset: () => void
}

const STORAGE_KEY = 'muse.widgets.v1'

function loadInitial(): WidgetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function persist(items: WidgetItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useWidgetsStore = create<WidgetsState>((set, get) => ({
  items: loadInitial(),
  add: (partial = {}) => {
    const id = crypto.randomUUID()
    const next: WidgetItem = {
      id,
      title: partial.title ?? 'New Widget',
      type: partial.type ?? 'placeholder',
      // place new widgets at top-left; RGL will auto-place if collision occurs
      x: 0,
      y: Infinity, // put at the bottom
      w: partial.w ?? 4,
      h: partial.h ?? 4,
      minW: 2,
      minH: 2,
      ...partial,
      id, // ensure id isn't overridden
    }
    const items = [...get().items, next]
    persist(items)
    set({ items })
  },
  remove: (id) => {
    const items = get().items.filter(i => i.id !== id)
    persist(items)
    set({ items })
  },
  updateLayout: (nextLayouts) => {
    const map = new Map(nextLayouts.map(l => [l.id, l]))
    const items = get().items.map(item => {
      const n = map.get(item.id)
      return n ? { ...item, x: n.x, y: n.y, w: n.w, h: n.h } : item
    })
    persist(items)
    set({ items })
  },
  reset: () => {
    persist([])
    set({ items: [] })
  },
}))
