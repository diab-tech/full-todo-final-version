import { getTodoAction } from "@/actions/todoActions";
import TodoClient from "@/components/TodoClient";
import { ITodo } from "@/interfaces";

export default async function Home() {
  let todos: ITodo[] = [];
  
  try {
    todos = await getTodoAction();
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    // In a real app, you might want to handle this error more gracefully
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">Failed to load todos. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <TodoClient initialTodos={todos} />
    </div>
  );
}
