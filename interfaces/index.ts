export type Status = "Todo" | "In Progress" | "Done" | string;
export type Priority = "High" | "Medium" | "Low" | string;
export type Label = "General" | "Work" | "Personal" | string;

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