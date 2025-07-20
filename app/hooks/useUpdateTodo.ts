import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoAction } from "@/actions/todoActions";

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodoAction, // دي الفانكشن اللي بتبعت الـ API
    // 💥 دي بقى طريقة optimistic update
    onMutate: async (newTodo) => {
      // 1. وقف أي fetch شغال لتاسكات معينة
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 2. احفظ نسخة قديمة للـ rollback
      const previousTodos = queryClient.getQueryData(['todos']);

      // 3. عدل التاسكات في الـ cache مباشرة
      queryClient.setQueryData(['todos'], (old: any) => {
        return old?.map((todo: any) =>
          todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
        );
      });

      // 4. رجع النسخة القديمة عشان لو حبينا نرجعها لو حصل error
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // حصل خطأ؟ رجع النسخة القديمة
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },
    onSettled: () => {
      // بعد ما تخلص (سواء نجحت أو فشلت)، اعمل refetch للـ data من السيرفر
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
