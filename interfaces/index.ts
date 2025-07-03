export type Status = "Todo" | "In Progress" | "Done" | "Canceled" | string;
export type Priority = "High" | "Medium" | "Low" | string;
export type Label = "General" | "Work" | "Personal" | "Documentation" | "Enhancement" | "Feature" | "Bug" | string;

export interface ITodo {
    id: string;
    title: string;
    description: string | null;
    priority: Priority;
    label: Label;
    status: Status;
    createdAt: Date | null;
    updatedAt: Date | null;
}