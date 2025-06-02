import Database from "@tauri-apps/plugin-sql";
import { nanoid } from "nanoid";
import { create } from "zustand";
import debounce from "lodash.debounce";
import { Category, ApiRequest} from "../types/Db.tsx";

export let db: any;

export async function initDB() {
    db = await Database.load("sqlite:requests.db");

    await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      type TEXT,
      curl TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT
    );
  `);
}

export async function fetchInitialData() {
    const categories: Category[] = await db.select("SELECT * FROM categories");
    const requests: ApiRequest[] = await db.select("SELECT * FROM requests");
    return { categories, requests };
}

export const useAppStore = create<{
    categories: Category[];
    requests: ApiRequest[];
    setCategories: (categories: Category[]) => void;
    setRequests: (requests: ApiRequest[]) => void;
    addCategory: (name: string, parent_id?: string | null) => void;
    addRequest: (
        name: string,
        category?: string | 'none',
        curl?: string | '',
        parent_id?: string | 'none',
        type?: string | 'GET'
    ) => void;
}>((set, get) => ({
    categories: [],
    requests: [],

    setCategories: (categories) => {
        set({ categories });
        debouncedSync();
    },

    setRequests: (requests) => {
        set({ requests });
        debouncedSync();
    },

    addCategory: (name, parent_id = null) => {
        const id = nanoid();
        const newCategory: Category = {
            id,
            name,
            parent_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        get().setCategories([...get().categories, newCategory]);
    },

    addRequest: (name, category = 'none', curl = '', parent_id = 'none', type = 'GET') => {
        const id = nanoid();
        const newRequest: ApiRequest = {
            id,
            name,
            category,
            type,
            curl,
            parent_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        get().setRequests([...get().requests, newRequest]);
    },
}));

const debouncedSync = debounce(async () => {
    const { categories, requests } = useAppStore.getState();

    await db.execute("DELETE FROM categories");
    await db.execute("DELETE FROM requests");

    for (const cat of categories) {
        await db.execute(
            "INSERT INTO categories (id, parent_id, name) VALUES (?, ?, ?)",
            [cat.id, cat.parent_id, cat.name]
        );
    }

    for (const req of requests) {
        await db.execute(
            "INSERT INTO requests (id, parent_id, name, category, type, curl) VALUES (?, ?, ?, ?, ?, ?)",
            [req.id, req.parent_id, req.name, req.category, req.type, req.curl]
        );
    }
}, 1000);

export async function hydrateStore() {
    const { categories, requests } = await fetchInitialData();
    const store = useAppStore.getState();
    store.setCategories(categories);
    store.setRequests(requests);
}