export interface Commentaire {
    id?: number;
    taskId: number;
    content: string;
    authorId: number;
    authorName?: string;
    createdAt: string;
}
