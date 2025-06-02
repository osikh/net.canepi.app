// import { useApiBrowserStore } from "../hooks/useApiBrowserStore"
import ApiBrowserList from './ApiBrowserList'
import { useState } from 'react'
import { useApiStore } from "../hooks/useApiStore.tsx";

export default function ApiBrowser() {
    // const { items, addItem } = useApiBrowserStore()
    const { items, selected, getItem, addItem } = useApiStore()
    const [search, setSearch] = useState('')

    const handleAdd = (type: 'category' | 'request') => {
        const name = prompt(`Enter ${type} name:`)
        console.log("AddItem::", {name, type, parent_id: getItem(selected)?.type === "category" ? selected : ""})
        if (name) addItem({name, type, parent_id: getItem(selected)?.type === "category" ? selected : ""})
    }

    return (
        <div className="w-64 bg-zinc-900 text-white h-full flex flex-col p-2">
            <div className="flex gap-2 mb-2">
                <button onClick={() => handleAdd('request')} className="bg-zinc-700 px-2 py-1 rounded">+ Request</button>
                <button onClick={() => handleAdd('category')} className="bg-zinc-700 px-2 py-1 rounded">+ Folder</button>
            </div>
            <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2 p-1 w-full rounded bg-zinc-800 text-white"
            />
            <ApiBrowserList items={items} search={search} level={0} active={true} />
        </div>
    )
}