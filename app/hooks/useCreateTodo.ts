import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodoAction } from "@/actions/todoActions";
import { ITodo } from "@/interfaces";
import { useToast } from "@/components/ui/use-toast";

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (todo: Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await createTodoAction(todo);
    },
    onSuccess: () => {
      // Invalidate and refetch the todos query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error creating todo:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
      throw error;
    },
  });
}
