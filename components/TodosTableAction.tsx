"use client";
import { Pen, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import { ITodo } from "@/interfaces";

interface IProps {
  todo: ITodo;
  onEditClick: () => void;
  onDeleteSuccess: (id: string) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

const TodosTableAction = ({ todo, onEditClick, onDeleteSuccess, isDeleting = false, disabled = false }: IProps) => {
  
  const handleDelete = async () => {
    try {
      onDeleteSuccess(todo.id as string);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };
  
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-transparent"
        onClick={onEditClick}
        disabled={disabled || isDeleting}
        aria-disabled={disabled || isDeleting}
        data-disabled={disabled || isDeleting}
      >
        <Pen className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:bg-transparent hover:text-destructive/80"
        onClick={handleDelete}
        disabled={disabled || isDeleting}
        aria-disabled={disabled || isDeleting}
        data-disabled={disabled || isDeleting}
      >
        {isDeleting ? (
          <Spinner />
        ) : (
          <Trash className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default TodosTableAction;
