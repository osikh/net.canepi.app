import ApiBrowserList from "./ApiBrowserList.tsx";
import {Icon} from "@iconify/react";
import {RequestItem, RequestType} from "../types/Api.tsx";
import {useApiStore} from "../hooks/useApiStore.tsx";
import {useState} from "react";

type Props = {
    item: RequestItem
    level: number
}

export default function ApiBrowserItemComponent({ item, level }: Props) {
    const [ renameVal, setRenameVal ] = useState("");
    const { activeCategory, toggleCategory, selected, selectItem, updateItem, removeItem, activeRename, requestRename } = useApiStore()

    const handleOnClick = (id: string, type: RequestType) => {
        selectItem(id)
        if (type === "category" && selected === id && activeRename !== id) toggleCategory(id)
    }

    return (
        <div className="">
            <div
                className={`flex items-center gap-1 py-1 ${selected === item.id ? 'bg-gray-700' : 'bg-none'} hover:bg-gray-700`}
                onClick={() => handleOnClick(item.id, item.type)} onDoubleClick={() => requestRename(item.id)}
            >
                <div style={{width: `${level * 5}px`}}></div>
                <Icon icon={'material-symbols-light:arrow-forward-ios'} width={20} height={15} style={{
                    transform: activeCategory === item.id ? "rotate(90deg)" : "",
                    display: item.type === "category" ? "block" : "none"
                }}/>
                <Icon
                    icon={item.type === 'category' ? 'material-symbols-light:folder-data' : 'material-symbols-light:play-arrow-rounded'}
                    width={20} height={20}/>
                <span className={`flex-grow text-sm ${activeRename===item.id ? 'hidden' : ''}`}>{item.name}</span>
                <input
                    className={`flex-grow select-all bg-gray-700 text-white text-sm py-0 px-2 ${activeRename===item.id ? '' : 'hidden'}`}
                    type="text"
                    placeholder={item.name}
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            requestRename("")
                            if (renameVal) updateItem(item.id, { name: renameVal })
                        }

                        if (e.key === "Esc") {
                            requestRename("")
                        }
                    }}
                />
                <button onClick={() => removeItem(item.id)} className="opacity-100">
                    <Icon icon="material-symbols-light:delete-forever-rounded" width={20} height={20}/>
                </button>
            </div>
            {item.children && item.children.length > 0 && (
                <ApiBrowserList items={item.children} search="" level={level + 1} active={activeCategory === item.id}/>
            )}
        </div>
    )
}