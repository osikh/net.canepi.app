// import { ApiBrowserItem } from '../types/Api.tsx'
// import { nanoid } from 'nanoid'
// import { useState } from 'react'
//
// export function useApiBrowserStore() {
//     const [items, setItems] = useState<ApiBrowserItem[]>([])
//
//     const addItem = (type: 'folder' | 'request', parentId?: string, name?: string) => {
//         const newItem: ApiBrowserItem = {
//             id: nanoid(),
//             type,
//             name: name || (type === 'folder' ? 'New Folder' : 'New Request'),
//             children: type === 'folder' ? [] : undefined,
//         }
//
//         console.log(`new ${newItem.type}: ${newItem.name} - ${newItem.id}`)
//
//         if (!parentId) {
//             setItems([...items, newItem])
//         } else {
//             const updated = addToParent(items, parentId, newItem)
//             setItems(updated)
//         }
//
//         console.info( items )
//     }
//
//     const updateName = (id: string, newName: string) => {
//         setItems(renameItem(items, id, newName))
//     }
//
//     const remove = (id: string) => {
//         console.log(`remove: ${id}`)
//         console.info( items )
//         setItems(prev => removeItem(prev, id))
//     }
//
//
//     return {
//         items,
//         setItems,
//         addItem,
//         updateName,
//         remove
//     }
// }
//
// function addToParent(list: ApiBrowserItem[], parentId: string, item: ApiBrowserItem): ApiBrowserItem[] {
//     return list.map(entry => {
//         if (entry.id === parentId && entry.type === 'folder') {
//             return { ...entry, children: [...(entry.children || []), item] }
//         } else if (entry.children) {
//             return { ...entry, children: addToParent(entry.children, parentId, item) }
//         }
//         return entry
//     })
// }
//
// function renameItem(list: ApiBrowserItem[], id: string, name: string): ApiBrowserItem[] {
//     return list.map(entry => {
//         if (entry.id === id) return { ...entry, name }
//         else if (entry.children) return { ...entry, children: renameItem(entry.children, id, name) }
//         return entry
//     })
// }
//
// function removeItem(items: ApiBrowserItem[], id: string): ApiBrowserItem[] {
//     console.info( items )
//
//     return items
//         .filter(item => item.id !== id)
//         .map(item => {
//             if (item.children) {
//                 return { ...item, children: removeItem(item.children, id) }
//             }
//             return item
//         })
// }