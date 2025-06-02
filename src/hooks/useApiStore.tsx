import { create } from 'zustand'
import Database from '@tauri-apps/plugin-sql'
import { nanoid } from 'nanoid'
import debounce from 'lodash.debounce'
import {RequestItem} from "../types/Api.tsx";

interface ApiBrowserStore {
    items: RequestItem[]
    selected: string
    activeCategory: string
    activeRename: string
    getItem: (id: string) => RequestItem | undefined
    setItems: (items: RequestItem[]) => void
    addItem: (item: Partial<RequestItem>) => void
    updateItem: (id: string, data: Partial<RequestItem>) => void
    removeItem: (id: string) => void
    requestRename: (id: string) => void
    selectItem: (id: string) => void
    toggleCategory: (id: string) => void
}

const flattenItems = (items: RequestItem[], parent_id = '0', order_id = 0): RequestItem[] => {
    let result: RequestItem[] = []
    items.forEach((item, index) => {
        const flatItem = {
            ...item,
            parent_id,
            order_id: index,
            children: undefined
        }
        result.push(flatItem)
        if (item.children?.length) {
            result = result.concat(flattenItems(item.children, item.id, 0))
        }
    })
    return result
}

const persistToDB = debounce(async (items: RequestItem[]) => {
    const db = await Database.load('sqlite:canepi.db')

    const tx = await db.execute('DELETE FROM requests')
    const flat = flattenItems(items)
    for (const item of flat) {
        await db.execute(
            `INSERT INTO requests (id, parent_id, order_id, type, name, method, data, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [item.id, item.parent_id, item.order_id, item.type, item.name, item.method, JSON.stringify(item.data)]
        )
    }
}, 1000)

export const useApiStore = create<ApiBrowserStore>((set, get) => ({
    items: [],
    selected: "",
    activeCategory: "",
    activeRename: "",
    getItem: (id) => {
        return get().items.find((item) => item.id === id)
    },
    setItems: (items) => {
        set({ items })
        persistToDB(items)
    },
    addItem: (item) => {
        const newItem: RequestItem = {
            id: nanoid(),
            parent_id: item.parent_id || '0',
            order_id: 0,
            type: item.type || 'request',
            name: item.name || 'New',
            method: item.method || null,
            data: item.data || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            children: item.type === 'category' ? [] : undefined
        }
        console.log("newItem::", newItem)
        const updated = [...get().items, newItem]
        get().setItems(updated)
    },
    updateItem: (id, data) => {
        const updated = get().items.map((item) =>
            item.id === id ? { ...item, ...data, updated_at: new Date().toISOString() } : item
        )
        get().setItems(updated)
    },
    removeItem: (id) => {
        const removeRecursively = (items: RequestItem[]): RequestItem[] => {
            return items
                .filter((item) => item.id !== id)
                .map((item) => ({
                    ...item,
                    children: item.children ? removeRecursively(item.children) : undefined
                }))
        }
        get().setItems(removeRecursively(get().items))
    },
    requestRename: (id) => { set({ activeRename: id }) },
    selectItem: (id) => { set({ selected: id }) },
    toggleCategory: (id) => {
        if (get().activeCategory === id) {
            set({ activeCategory: "" })
        } else {
            set({ activeCategory: id })
        }
    }
}))

export async function initDatabase() {
    const db = await Database.load('sqlite:canepi.db')

    await db.execute(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      parent_id TEXT DEFAULT '0',
      order_id INTEGER DEFAULT 0,
      type TEXT CHECK(type IN ('category', 'request')) NOT NULL,
      name TEXT NOT NULL,
      method TEXT DEFAULT NULL,
      data TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      name TEXT,
      data TEXT
    )
  `)

    await db.execute(`
    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      name TEXT,
      key TEXT,
      value TEXT
    )
  `)

    const result = await db.select<RequestItem[]>('SELECT * FROM requests')

    const map = new Map<string, RequestItem>()
    const roots: RequestItem[] = []

    for (const row of result) {
        map.set(row.id, { ...row, children: [] })
    }

    for (const row of result) {
        const parent = map.get(row.parent_id)
        if (parent) {
            parent.children?.push(map.get(row.id)!)
        } else if (row.parent_id === '0') {
            roots.push(map.get(row.id)!)
        }
    }

    console.log(roots)

    useApiStore.getState().setItems(roots)
}
