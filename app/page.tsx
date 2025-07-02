import { getTodoAction } from "@/actions/todoActions";
import TodoClient from "@/components/TodoClient";

export default async function Home() {
  const todos = await getTodoAction();
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16  font-[family-name:var(--font-geist-sans)]">
      <TodoClient initialTodos={todos} />
    </div>
  );
}
