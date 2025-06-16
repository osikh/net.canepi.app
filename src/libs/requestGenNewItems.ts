import {FlattenedRequestItem, RequestItem} from "../types/Api.tsx";

let ActiveItem: RequestItem | null = null

function findActiveItem(items: RequestItem[], activeId: number) {
    items.forEach((item) => {
        if (item.id === activeId) {
            ActiveItem = { ...item }
            return
        }
        if (item.children) {
            findActiveItem(item.children, activeId)
        }
    })
}

function insertActiveItem(
    items: RequestItem[],
    activeId: number,
    activeIndex: number,
    overId: number,
    overIndex: number,
    insertFirst: boolean
): RequestItem[] {
    let hasOverId = false
    const newItems = items.map((item): RequestItem & { isActive?: boolean } => {
        if (item.id === activeId) {
            return { ...item, isActive: true } // 标记 active 以便后面 filter
        }
        if (item.id === overId) {
            hasOverId = true
        }
        return {
            ...item,
            children: item.children
                ? insertActiveItem(
                    item.children,
                    activeId,
                    activeIndex,
                    overId,
                    overIndex,
                    insertFirst
                )
                : item.children,
        }
    })

    if (hasOverId && ActiveItem) {
        const overItemIndex = newItems.findIndex((item) => item.id === overId)
        // console.log('overItemIndex', overItemIndex, insertFirst, ActiveItem)
        if (overItemIndex === 0 && insertFirst) {
            newItems.unshift(ActiveItem)
        } else if (overItemIndex > -1) {
            const startIndex =
                activeIndex < overIndex ? overItemIndex + 1 : overItemIndex
            newItems.splice(startIndex, 0, ActiveItem)
        }
    }

    return newItems.filter((item) => !item.isActive)
}

export default function requestGenNewItems(
    items: RequestItem[],
    flattenedItems: FlattenedRequestItem[],
    activeId: number,
    overId: number
): RequestItem[] {
    const activeIndex = flattenedItems.findIndex((i) => i.id === activeId)
    const overIndex = flattenedItems.findIndex((i) => i.id === overId)

    let insertFirst = false
    if (activeIndex < overIndex) {
        const over = flattenedItems[overIndex]
        const nextOver = flattenedItems[overIndex + 1]
        if (nextOver && nextOver.ancestors?.includes(over.id)) {
            overId = nextOver.id
            insertFirst = true
        }
    }

    // 1. Find the active item
    ActiveItem = null
    findActiveItem(items, activeId)
    if (ActiveItem === null) {
        return items
    }

    // 2. Insert the active item into the new position, and return the new items
    // 3. Return the new items
    return insertActiveItem(
        items,
        activeId,
        activeIndex,
        overId,
        overIndex,
        insertFirst
    )
}
