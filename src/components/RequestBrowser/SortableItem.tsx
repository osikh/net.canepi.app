import { useSortable } from "@dnd-kit/sortable";
import { useDataStore } from "../../hooks/useDataStore.tsx";
import { FlattenedRequestItem } from "../../types/Api.tsx";
import { Icon } from "@iconify/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import {IconButton} from "../Button.tsx";

export default function SortableItem(props: { item: FlattenedRequestItem, over: number, fade: boolean, dropHere: boolean }) {
    const { item, fade, over, dropHere } = props;
    const { id, name, ancestors, type, order_id, children } = item;
    const ancestorIdsLength = item.ancestors?.length || 0;
    const { addItem, updateItem, removeItem } = useDataStore();
    const [hover, setHover] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id: id, data: { ancestors, type, order_id, children } })

    const lineHeight = '40px'

    function rename(id: number): void {
        let newName = prompt("New Name?");
        if (!newName) newName = name;
        // updateItem(id, { name: newName });
    }

    function duplicate(id: number): void {
        // addItem(
        //     item,
        //     ancestorIdsLength > 0 ? ancestors[ancestorIdsLength - 1] : 0
        // );
    }

    function remove(id: number): void {
        // removeItem(id)
    }

    return (
        <>
            <div
                ref={setNodeRef}
                className={`flex items-center select-none text-sm border-none ${fade ? 'opacity-25 bg-gray-800' : 'opacity-100'}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onDoubleClick={() => { rename(id) }}
            >
                { (ancestors && ancestors.length > 0) && ancestors.map((i) => <div
                    key={nanoid()}
                   className={`border-l-1 w-[13px] h-full ${i===over ? 'border-gray-400' : 'border-gray-700'}`}></div>
                )}
                <p ref={setActivatorNodeRef} {...attributes} {...listeners} className={'pl-0 grow'}>{name}</p>
                { type === 'category' &&
                    <div className={'contents'}>
                        <IconButton className={'h-[24px]'} icon={'material-symbols-light:add'} iconSize={24}/>
                        <IconButton className={'h-[24px]'} icon={'material-symbols-light:create-new-folder-outline'}
                                    iconSize={24}/>
                        <IconButton className={'h-[24px]'} icon={'material-symbols-light:close'} iconSize={24}/>
                    </div>
                }
            </div>
            {(dropHere && type === 'category') && <div className={'flex items-center select-none text-sm text-gray-400'}>
                {(ancestors && ancestors.length > 0) && ancestors.map((i) => <div
                    key={nanoid()}
                    className={`border-l-1 w-[13px] h-full ${i === over ? 'border-gray-400' : 'border-gray-700'}`}></div>
                )}
                <div className={`px-2 border-1 border-dashed border-gray-400 grow`}>
                    Drop Here
                </div>
            </div>}
        </>
    );
}
