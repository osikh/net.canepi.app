export type RequestType = 'category' | 'request'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | null

export interface RequestItem {
    id: string
    parent_id: string
    order_id: number
    type: RequestType
    name: string
    method: HttpMethod
    data: any
    created_at: string
    updated_at: string
    children?: RequestItem[] // for UI nesting
}