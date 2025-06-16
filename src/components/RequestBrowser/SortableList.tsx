import { useEffect, useState } from 'react'
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    Modifier
} from '@dnd-kit/core'
import {
    // arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
    restrictToVerticalAxis,
    restrictToWindowEdges
} from '@dnd-kit/modifiers';
import {useDataStore} from "../../hooks/useDataStore.tsx";
import { FlattenedRequestItem } from "../../types/Api.tsx";
import { flattenRequestItems } from "../../libs/utils.ts";
import SortableItem from "./SortableItem.tsx";
import {initDatabase, updateParentId} from "../../libs/db.ts";
import DragOverItem from "./DragOverItem.tsx";
import {createPortal} from "react-dom";

export default function SortableList() {
    const { items, dragEvent, setDragEvent } = useDataStore()
    const [ flattenedItems, setFlattenedItems ] = useState<FlattenedRequestItem[]>([])

    useEffect(() => {
        const fItems = flattenRequestItems(items as FlattenedRequestItem[])
        console.log(fItems)
        setFlattenedItems(fItems)
    }, [items])

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const shiftOverlayToPointer: Modifier = ({transform, activatorEvent, activeNodeRect }) => {
        if (
            !activatorEvent ||
            !('offsetX' in activatorEvent) ||
            !('offsetY' in activatorEvent) ||
            (typeof activatorEvent.offsetX !== 'number') ||
            (typeof activatorEvent.offsetY !== 'number') ||
            !activeNodeRect
        ) {
            return transform;
        }

        const offsetX = activatorEvent.offsetX
        const offsetY = activatorEvent.offsetY

        /**
         * padding must match with the SortableItem ancestor padding
         */
        const paddingX = (dragEvent.activeAncestors) * 13
        return {
            ...transform,
            x: transform.x + offsetX + paddingX,
            y: transform.y + offsetY,
        };
    };

    function handleDragOver(event: DragOverEvent) {
        const active = parseInt(event.active.id.toString())
        const activeData = event?.active?.data?.current || undefined
        const over = parseInt((event?.over?.id || 0).toString())
        const overData = event?.over?.data?.current || undefined

        let activeAncestors = 0
        let overChild = 0

        if (activeData !== undefined) {
            activeAncestors = (activeData?.ancestors || []).length
        }
        if (overData !== undefined) {
            overChild = (overData?.children || []).length
        }

        setDragEvent(active, activeAncestors, over, overChild)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (over == null) return
        if (active.id === over.id) return

        console.log( over.data )

        const { ancestors: overAncestors = [], type: overType = 'request' } = over.data.current || {}
        // const { ancestorIds: activeAncestorIds = [] } = active.data.current || {}

        console.log('handleDragEnd', active.id, over.id, overAncestors)

        if (overAncestors.includes(active.id)) {
            console.log('Cannot drop item into its descendant')
            return
        }
        if (overType === "request") {
            console.log('Cannot drop item into request')
            return
        }

        updateParentId(
            parseInt(active.id.toString()),
            parseInt(over.id.toString())
        ).then(() => {
            console.info('parentId updated')
            initDatabase().then(() => console.info('data loaded'))
        })

        setDragEvent(0, 0, 0, 0)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[]}
        >
            <SortableContext
                items={flattenedItems}
                strategy={verticalListSortingStrategy}
            >
                {flattenedItems.length &&
                    flattenedItems.map((i) => <SortableItem key={i.id} item={i} over={dragEvent.over} fade={false} dropHere={dragEvent.over === i.id && dragEvent.overChild === 0} />)}
            </SortableContext>

            {createPortal(
                <DragOverlay
                    className={'text-left'}
                    modifiers={[shiftOverlayToPointer]}
                >
                    {dragEvent.active > 0 ? (
                        <DragOverItem key={dragEvent.active} item={ flattenedItems.find(fitem => fitem.id === dragEvent.active) } />
                    ): null}
                </DragOverlay>,
                document.body,
            )}
        </DndContext>
    )
}