export type RequestType = 'category' | 'request'
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestItem {
    id: number
    parent_id: number
    order_id: number
    type: RequestType
    name: string
    method: RequestMethod
    data: any
    created_at: Date
    updated_at: Date
    children?: RequestItem[] // for UI nesting
}

export type FlattenedRequestItem = RequestItem & { ancestors: number[] }