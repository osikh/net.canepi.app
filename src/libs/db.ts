import Database from "@tauri-apps/plugin-sql";
import {RequestItem} from "../types/Api.tsx";
import {useDataStore} from "../hooks/useDataStore.tsx";
import debounce from "lodash.debounce";

export const persistToDB = debounce(async (items: RequestItem[]) => {
    const db = await Database.load('sqlite:%USERPROFILE%/.canepi/personal.db')

    const flat = flattenItems(items)

    for (const item of flat) {
        await db.execute(
            `INSERT INTO requests (id, parent_id, order_id, type, name, method, data, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         parent_id = excluded.parent_id,
         order_id = excluded.order_id,
         type = excluded.type,
         name = excluded.name,
         method = excluded.method,
         data = excluded.data,
         updated_at = CURRENT_TIMESTAMP
      `,
            [
                item.id,
                item.parent_id,
                item.order_id,
                item.type,
                item.name,
                item.method,
                JSON.stringify(item.data ?? {})
            ]
        )
    }
}, 1000)

export async function initDatabase() {
    const db = await Database.load('sqlite:canepi.db')

    await db.execute(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER DEFAULT 0,
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

    const result = await db.select<RequestItem[]>('SELECT * FROM requests ORDER BY type,name')

    const map = new Map<number, RequestItem>()
    const roots: RequestItem[] = []

    for (const row of result) {
        map.set(row.id, { ...row, children: [] })
    }

    for (const row of result) {
        const parent = map.get(row.parent_id)
        if (parent) {
            parent.children?.push(map.get(row.id)!)
        } else if (row.parent_id == 0) {
            roots.push(map.get(row.id)!)
        }
    }

    console.log(roots)

    useDataStore.getState().setItems(roots)
}

export async function updateParentId(id: number, newParentId: number) {
    const db = await Database.load('sqlite:canepi.db')

    await db.execute(
        `UPDATE requests SET parent_id = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2`,
        [newParentId, id]
    )
}