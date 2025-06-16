import {FlattenedRequestItem} from "../../types/Api.tsx";

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
