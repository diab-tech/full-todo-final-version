"use client";

import { useState, useCallback, useEffect } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { getTodoAction } from "@/actions/todoActions";
import TodoTable from "@/components/TodoTable";
import { ITodo } from "@/interfaces";
import { TodoFormValues } from "@/schema";



export default function Home() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoFormValues | null>(
    {
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      label: "General",
    }
  );

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const fetchedTodos = await getTodoAction();
      setTodos(fetchedTodos);
    };
    fetchTodos();
  }, []);

  const refreshTodos = useCallback(async () => {
    const updatedTodos = await getTodoAction();
    setTodos(updatedTodos);
  }, []);

  const handleEditClick = (todo: ITodo) => {
    const formValues: TodoFormValues = {
      title: todo.title,
      description: todo.description || undefined,
      status: todo.status,
      priority: todo.priority,
      label: todo.label
    };
    setEditingTodo(formValues);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingTodo({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      label: "General",
    });
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refreshTodos();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-end">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>
      
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={editingTodo || undefined}
        onSuccess={handleDialogSuccess}
      />
      
      <TodoTable 
        todos={todos} 
        onEditClick={handleEditClick}
      />
    </div>
  );
}
