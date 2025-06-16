import {useState} from "react";
import {IconButton} from "./Button.tsx";
import SortableList from "./RequestBrowser/SortableList.tsx";

export default function RequestBrowser() {
    const [search, setSearch] = useState("")
    return (
        <div className="w-64 bg-zinc-900 text-white h-full flex flex-col p-2">
            <div className="flex gap-2 mb-2 border-b-1 border-b-gray-700">
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-2 px-3 text-xs h-[24px] w-full rounded bg-zinc-800 text-white"
                />
                <IconButton className={'h-[24px] border-1 border-gray-500'} icon={'material-symbols-light:create-new-folder-outline-rounded'} iconSize={24} />
            </div>
            <SortableList />
        </div>
    )
}