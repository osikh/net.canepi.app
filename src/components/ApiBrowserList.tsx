import ApiBrowserItemComponent from "./ApiBrowserItem";
import {RequestItem} from "../types/Api.tsx";

type Props = {
    active: boolean
    items: RequestItem[]
    search: string
    level: number
}

export default function ApiBrowserList({ items, search, level, active }: Props) {
    return (
        <div className={`flex flex-col gap-1 ${active ? 'block' : 'hidden'}`}>
            {items
                .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
                .map(item => (
                    <ApiBrowserItemComponent key={item.id} item={item} level={level} />
                ))}
        </div>
    )
}