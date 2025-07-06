import { getTodoAction } from "@/actions/todoActions";
import TodoClient from "@/components/TodoClient";
import { ITodo } from "@/interfaces";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  let todos: ITodo[] = [];
  const { userId } = await auth();
  
  try {
    todos = await getTodoAction(userId as string);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    // In a real app, you might want to handle this error more gracefully
    return (
      <div className="container px-4 md:px-8 lg:px-12  py-3">
        <div className="text-red-500">Failed to load todos. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 lg:px-12  py-3">
      <TodoClient initialTodos={todos} userId={userId as string}/>
    </div>
  );
}
