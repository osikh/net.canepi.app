import {create} from 'zustand'
import {RequestItem} from "../types/Api.tsx";

// import {persistToDB} from "../libs/db.ts";

interface DataStore {
    items: RequestItem[]
    dragEvent: {active: number, activeAncestors: number, over: number, overChild: number}
    setDragEvent: (active: number, activeAncestors: number, over: number, overChild: number) => void
    getItem: (id: number) => RequestItem | undefined
    setItems: (items: RequestItem[]) => void
    addItem: (item: Partial<RequestItem>) => void
    updateItem: (id: number, data: Partial<RequestItem>) => void
    removeItem: (id: number) => void
    selected: number
    selectItem: (id: number) => void
    activeCategory: number
    toggleCategory: (id: number) => void
}

function updateRecursive(items: RequestItem[], id: number, data: Partial<RequestItem>): RequestItem[] {
    return items.map((item): RequestItem => {
        if (item.id === id) {
            return {...item, ...data}
        } else if (item.children) {
            return {...item, children: updateRecursive(item.children, id, data)}
        }
        return item
    })
}

export const useDataStore = create<DataStore>((set, get) => ({
    items: [],
    selected: 0,
    activeCategory: -1, // -1 = root
    dragEvent: {active: 0, activeAncestors: 0, over: 0, overChild: 0},
    setDragEvent: (active: number, activeAncestors: number, over: number, overChild: number) => {
        set({dragEvent: {active, activeAncestors, over, overChild}})
    },
    getItem: (id) => {
        return get().items.find((item) => item.id === id)
    },
    setItems: (items) => {
        set({items})
    },
    addItem: (item) => {
        const newItem: RequestItem = {
            id: get().items.length + 1,
            parent_id: item.parent_id || 0,
            order_id: item.order_id || 0,
            type: item.type || 'request',
            name: item.name || 'New',
            method: item.method || 'GET',
            data: item.data || null,
            created_at: new Date(),
            updated_at: new Date(),
            children: item.type === 'category' ? [] : undefined
        }
        console.log("newItem::", newItem)
        const updated = [...get().items, newItem]
        get().setItems(updated)
    },
    updateItem: (id, data) => {
        const updated = updateRecursive(get().items, id, data)
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
    selectItem: (id) => {
        set({selected: id})
    },
    toggleCategory: (id) => {
        if (get().activeCategory === id) {
            set({ activeCategory: -1 })
        } else {
            set({ activeCategory: id })
        }
    }
}))