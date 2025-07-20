import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { deleteTodoAction } from "@/actions/todoActions";

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteTodoAction(id);
        },
        onSuccess: () => {
            // Invalidate and refetch the todos query
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        },
        onError: (error: Error) => {
            console.error("Error deleting todo:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete task",
                variant: "destructive",
            });
            throw error;
        },
    });
}
