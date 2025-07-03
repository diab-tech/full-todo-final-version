import { z } from "zod";

export const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters long").max(50),
  description: z.string().max(200, "Description longer than 200 characters").nullable().optional(),
  status: z.enum(["Todo", "In Progress", "Done","Canceled"]),
  priority: z.enum(["High", "Medium", "Low"]),
  label: z.enum(["General", "Work", "Personal","Documentation","Enhancement","Feature","Bug"]),
});
export type TodoFormValues = z.infer<typeof FormSchema>