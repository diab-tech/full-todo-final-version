"use client";

import { useState, useCallback, useMemo } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { DataTable } from "@/components/DataTable";
import { getColumns } from "@/components/TodoColumns";
import { ITodo } from "@/interfaces";
import { deleteTodoAction, getTodoAction } from "@/actions/todoActions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

interface TodoClientProps {
  initialTodos: ITodo[];
  userId: string;
}

export default function TodoClient({ initialTodos, userId }: TodoClientProps) {
  const [todos, setTodos] = useState<ITodo[]>(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showDateTime, setShowDateTime] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);

  const { toast } = useToast();

  const refreshTodos = useCallback(async () => {
    try {
      const updatedTodos = await getTodoAction(userId);
      setTodos(updatedTodos);
      setSelectedRows(new Set()); // Clear selection on refresh
    } catch (error) {
      console.error("Failed to refresh todos:", error);
      toast({
        title: "Error",
        description: "Failed to refresh todos",
        variant: "destructive",
      });
    }
  }, [userId, toast]);

  // Status toggle is now handled in the TodoColumns component

  const handleDelete = useCallback(async (id: string) => {
    try {
      setDeletingIds(prev => new Set([...prev, id]));
      await deleteTodoAction(id);
      await refreshTodos();
      toast({
        title: "Todo deleted",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [refreshTodos, toast]);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  }, []);

  // Select all functionality is now handled in the DataTable component

  const handleBulkDelete = useCallback(async () => {
    try {
      const idsToDelete = Array.from(selectedRows);
      setDeletingIds(prev => new Set([...prev, ...idsToDelete]));
      
      await Promise.all(idsToDelete.map(id => deleteTodoAction(id)));
      
      await refreshTodos();
      setSelectedRows(new Set());
      
      toast({
        title: `${idsToDelete.length} ${idsToDelete.length === 1 ? 'todo' : 'todos'} deleted`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete todos:', error);
      toast({
        title: "Error",
        description: "Failed to delete todos",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(new Set());
    }
  }, [selectedRows, refreshTodos, toast]);

  // Edit functionality is now handled in the handleEditClick function

  const filteredTodos = useMemo(() => {
    return showCompleted ? todos : todos.filter(todo => todo.status !== 'Done');
  }, [todos, showCompleted]);

  const handleEditTodo = useCallback((todo: ITodo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    handleDelete(id);
  }, [handleDelete]);

  // Set up the columns with proper typing
  const columns = useMemo<ColumnDef<ITodo>[]>(() => getColumns({
    onUpdateSuccess: refreshTodos,
    showDateTime,
    onEdit: handleEditTodo,
    onDelete: handleDeleteTodo,
  }), [refreshTodos, showDateTime, handleEditTodo, handleDeleteTodo]);

  return (
    <div className="container mx-auto py-10">
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
            setEditingTodo(null);
          }
        }}
        onSuccess={refreshTodos}
        initialValues={editingTodo || undefined}
        userId={userId}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowDateTime(!showDateTime)}
            >
              {showDateTime ? "Hide Date/Time" : "Show Date/Time"}
            </Button>
            {selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-destructive hover:bg-destructive/10"
                  onClick={handleBulkDelete}
                  disabled={deletingIds.size > 0}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => {
              setEditingTodo(null);
              setIsDialogOpen(true);
            }}
          >
            Add Todo
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredTodos}
          meta={{
            onEdit: handleEditTodo,
            onDeleteSuccess: handleDelete,
            deletingId: Array.from(deletingIds)[0],
            selectedRows,
            onToggleSelect: toggleRowSelection,
            showDateTime,
            onToggleDateTime: () => setShowDateTime(!showDateTime),
          }}
          className={cn(
            "transition-opacity",
            deletingIds.size > 0 && "opacity-70 pointer-events-none"
          )}
        />
      </div>
    </div>
  );
}
