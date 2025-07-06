export type Status = "Todo" | "In Progress" | "Done" | "Canceled";
export type Priority = "High" | "Medium" | "Low";
export type Label = "General" | "Work" | "Personal" | "Documentation" | "Enhancement" | "Feature" | "Bug";

export interface ITodo {
    id: string;
    title: string;
    description: string | null;
    priority: Priority;
    label: Label;
    status: Status;
    user_id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}