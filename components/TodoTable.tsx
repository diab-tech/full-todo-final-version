import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITodo } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import TodosTableAction from "./TodosTableAction";

function TodoTable({
  todos,
  onEditClick,
  onDeleteSuccess,
}: {
  todos: ITodo[];
  onEditClick: (todo: ITodo) => void;
  onDeleteSuccess: () => void;
}) {
  if (!todos || !Array.isArray(todos)) {
    return <div>No todos available.</div>;
  }
  return (
    <Table>
      <TableCaption>A list of your recent TODOs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo: ITodo) => (
          <TableRow key={todo.id}>
            <TableCell className="font-medium ">
              <Badge variant="outline" className="mr-3 w-16 text-xs">{todo.label}</Badge>
              {todo.title}
            </TableCell>
            <TableCell>
              {todo.status === "Todo" ? (
                <Badge variant="default">{todo.status}</Badge>
              ) : todo.status === "In Progress" ? (
                <Badge variant="secondary">{todo.status}</Badge>
              ) : todo.status === "Done" ? (
                <Badge variant="doneTodo">{todo.status}</Badge>
              ) : null}
            </TableCell>
            <TableCell>
              {todo.priority === "High" ? (
                <Badge variant="destructive">{todo.priority}</Badge>
              ) : todo.priority === "Medium" ? (
                <Badge variant="secondary">{todo.priority}</Badge>
              ) : todo.priority === "Low" ? (
                <Badge variant="default">{todo.priority}</Badge>
              ) : (
                <Badge variant="default">{todo.priority}</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <TodosTableAction
                todo={todo}
                onEditClick={() => onEditClick(todo)}
                onDeleteSuccess={onDeleteSuccess}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TodoTable;
