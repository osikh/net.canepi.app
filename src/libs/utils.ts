import {FlattenedRequestItem} from "../types/Api.tsx";

export function flattenRequestItems(items: FlattenedRequestItem[]): FlattenedRequestItem[] {
    return items.reduce<FlattenedRequestItem[]>((acc, item) => {
        acc.push(item)
        if (item.children) {
            const children = item.children.map((i) => ({
                ...i,
                ancestors: [...(item.ancestors || []), item.id], // add ancestorIds
            }))
            acc.push(...flattenRequestItems(children))
        }
        return acc
    }, [])
}