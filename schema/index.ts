import { z } from "zod";

export const FormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(50),
  description: z.string().max(200, "Description longer than 200 characters").optional(),
  isDone: z.boolean().optional(),
});
export type TodoFormValues = z.infer<typeof FormSchema>