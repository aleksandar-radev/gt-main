export interface Comment {
    id: number;
    gameId: number;
    username: string;
    text: string;
    timestamp: string;
}

export interface Game {
    id: number;
    name: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
    comments?: Comment[];
}

export interface User {
    id: number;
    username: string | null;
    password: string;
    email: string;
    created_at: string;
    updated_at: string;
    role: string;
    last_active: string;
}
