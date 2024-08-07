export interface User {
    id: string;
    name: string;
    score: number;
}

export interface AuthState {
    token: string | null;
    isLoading: boolean;
}
