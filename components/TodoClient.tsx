"use client";

import { useState, useCallback } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/TodoColumns";
import { ITodo } from "@/interfaces";
import { deleteTodoAction, getTodoAction } from "@/actions/todoActions";
import { useToast } from "@/components/ui/use-toast";

export default function TodoClient({ initialTodos }: { initialTodos: ITodo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Omit<ITodo, 'id'> & { id: string | '' }>({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    label: "General",
    createdAt: new Date(),
    updatedAt: new Date(),
    id: ""
  });
  const { toast } = useToast();

  const refreshTodos = useCallback(async () => {
    try {
      const updatedTodos = await getTodoAction();
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Failed to refresh todos:', error);
      toast({
        title: "Error",
        description: "Failed to refresh todos",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEdit = useCallback((todo: ITodo) => {
    setEditingTodo({
      ...todo,
      description: todo.description || "",
      id: todo.id || ""
    });
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTodoAction(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleAddClick = () => {
    setEditingTodo({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      label: "General",
      createdAt: new Date(),
      updatedAt: null,
      id: ""
    });
    setIsDialogOpen(true);
  };

  // Handle dialog success will be called after a todo is added or updated
  const handleDialogSuccess = useCallback(() => {
    refreshTodos();
  }, [refreshTodos]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-end">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>
      
      <DataTable
        columns={columns}
        data={todos}
        onEdit={handleEdit}
        onDeleteSuccess={handleDelete}
      />
      
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={editingTodo }
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
