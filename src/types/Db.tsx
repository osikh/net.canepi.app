export interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ApiRequest {
    id: string;
    parent_id: string | null;
    name: string;
    category: string;
    type: string;
    curl: string;
    created_at: string;
    updated_at: string;
}