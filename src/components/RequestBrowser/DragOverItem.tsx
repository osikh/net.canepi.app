import { useEffect, useState } from 'react';
import {FlattenedRequestItem} from "../../types/Api.tsx";

interface Position {
    x: number;
    y: number;
}

export default function DragOverItem(props: { item: FlattenedRequestItem }) {
    const { item } = props;
    const { name } = item;

    return (
        <div
            className="text-sm text-white bg-gray-700 px-2"
        >
            {name}
        </div>
    );
}
