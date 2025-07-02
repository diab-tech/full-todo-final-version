"use client";
import { Pen, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { deleteTodoAction } from "@/actions/todoActions";
import Spinner from "./Spinner";
import { useState } from "react";
import { ITodo } from "@/interfaces";

interface IProps {
  todo: ITodo;
  onEditClick: () => void;
  onDeleteSuccess: () => void;
}

const TodosTableAction = ({ todo, onEditClick, onDeleteSuccess }: IProps) => {
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTodoAction(todo.id as string);
      // Call the success callback to refresh the todos
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mr-2"
        onClick={onEditClick}
        disabled={loading}
      >
        <Pen />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? <Spinner /> : <Trash />}
      </Button>
    </>
  );
};

export default TodosTableAction;
