declare global {
    type HistoryInteract = {
        id: string;
        type: "modify" | "delete" | "create" | "update" | "login";
        action: string;
        collection: string;
        time: string;
        user: string;
        description: string;
        role: "moderator" | "admin" | "user";
    };
}
export {};
