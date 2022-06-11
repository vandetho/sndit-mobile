export interface Notification {
    id: number;
    createdAt: string;
    isRead: boolean;
    title: string;
    body: string;
    data: { [key: string]: string };
}
