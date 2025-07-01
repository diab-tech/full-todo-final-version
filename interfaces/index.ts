export type Status = "Todo" | "In Progress" | "Done";
export type Priority = "High" | "Medium" | "Low";
export type Label = "General" | "Work" | "Personal";

export interface ITodo {
    id?: string;
    title: string;
    description?: string;
    priority: Priority;
    label: Label;
    status: Status;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}