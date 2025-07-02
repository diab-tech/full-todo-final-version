"use client";

import { useState, useCallback } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import TodoTable from "@/components/TodoTable";
import { ITodo } from "@/interfaces";
import { getTodoAction } from "@/actions/todoActions";

export default function TodoClient({ initialTodos }: { initialTodos: ITodo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>({
    title:"",
    description:"",
    status:"Todo",
    priority:"Medium",
    label:"General",
    createdAt: new Date(),
    updatedAt: null,
    id: ""
  });

  const refreshTodos = useCallback(async () => {
    const updatedTodos = await getTodoAction();
    setTodos(updatedTodos);
  }, []);

  const handleEditClick = (todo: ITodo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingTodo({
      title:"",
      description:"",
      status:"Todo",
      priority:"Medium",
      label:"General",
      createdAt: new Date(),
      updatedAt: null,
      id: ""
    });
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refreshTodos();
  };

  const handleDeleteSuccess = useCallback(() => {
    refreshTodos();
  }, [refreshTodos]);

  return (
    <>
      <div className="w-full flex justify-end">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>
      <TodoTable 
        todos={todos} 
        onEditClick={handleEditClick} 
        onDeleteSuccess={handleDeleteSuccess} 
      />
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={editingTodo || undefined}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
}
