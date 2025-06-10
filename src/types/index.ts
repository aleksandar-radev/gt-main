export interface Game {
    id: number;
    name: string;
    title: string;
    description: string;
    logoUrl: string;
    type: string;
    status: string;
    bigLogoUrl: string;
    url: string;
    category: string;
    isFeatured: boolean;
    /** Derived from the status field, true when status is 'active' */
    isActive?: boolean;
    rating: number;
    comments?: Comment[];
}

export interface Comment {
    id?: number;
    gameId: number;
    user: User;
    content: string;
    status?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    // Include username for display purposes in the UI
    username?: string; // This might come from the User relation
    // If you need reactions in the frontend
    reactions?: CommentReaction[];
}

// Optional interface for reaction data if needed
export interface CommentReaction {
    id?: number;
    commentId: number;
    userId: number;
    type: string; // like, dislike, etc.
    createdAt?: string;
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

export interface Feedback {
    id?: number;
    name: string;
    email: string;
    message: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
