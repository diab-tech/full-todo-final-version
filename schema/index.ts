import { z } from "zod";
import { PRIORITIES, LABELS, STATUSES } from "@/lib/constants";

// Extract priority values for the enum
export const priorityLevels = PRIORITIES.map(p => p.value) as [string, ...string[]];
export const labelLevels = LABELS.map(l => l.value) as [string, ...string[]];
export const statusLevels = STATUSES.map(s => s.value) as [string, ...string[]];

export const FormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(50),
  description: z.string().max(200, "Description longer than 200 characters").optional(),
  priority: z.enum(priorityLevels).default("Medium"),
  label: z.enum(labelLevels).default("General"),
  status: z.enum(statusLevels).default("Todo"),
});

export type TodoFormValues = z.infer<typeof FormSchema>