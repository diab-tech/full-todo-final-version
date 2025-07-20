import { getUserTodoAction } from "@/actions/todoActions";
import TodoClient from "@/components/TodoClient";
import { ITodo } from "@/interfaces";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  let todos: ITodo[] = [];
  const { userId } = await auth();

  todos = await getUserTodoAction(userId as string);

  

  return (
    <div className="container px-4 md:px-8 lg:px-12  py-3">
      <TodoClient initialTodos={todos} userId={userId as string} />
    </div>
  );
}
