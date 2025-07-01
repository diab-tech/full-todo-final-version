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
}

const TodosTableAction = ({ todo, onEditClick }: IProps) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mr-2"
        onClick={onEditClick}
      >
        <Pen />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          setLoading(true);
          await deleteTodoAction(todo.id as string);
          setLoading(false);
        }}
      >
        {loading ? <Spinner /> : <Trash />}
      </Button>
    </>
  );
};

export default TodosTableAction;
