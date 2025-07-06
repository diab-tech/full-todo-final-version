import { Row, Table } from "@tanstack/react-table";
import { ITodo, Priority, Status, Label } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle } from "lucide-react";
import { updateTodoAction } from "@/actions/todoActions";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import TodosTableAction from "./TodosTableAction";
import { useState } from "react";

type RowType = Row<ITodo>;

// Type guard to check if a value is a valid Status
const isStatus = (value: unknown): value is Status => {
  return ['Todo', 'In Progress', 'Done', 'Canceled'].includes(value as string);
};

// Type guard to check if a value is a valid Priority
const isPriority = (value: unknown): value is Priority => {
  return ['Low', 'Medium', 'High'].includes(value as string);
};

// Type guard to check if a value is a valid Label
const isLabel = (value: unknown): value is Label => {
  return ['General', 'Work', 'Personal', 'Documentation', 'Enhancement', 'Feature', 'Bug'].includes(value as string);
};

// Define the type for the table meta
type TableMeta = {
  onEdit?: (todo: ITodo) => void;
  onDeleteSuccess?: (id: string) => void;
  deletingId?: string;
};

// Status update component to handle the status toggle
const StatusUpdate = ({
  todo,
  onUpdateSuccess,
  table,
  row,
}: {
  todo: ITodo;
  onUpdateSuccess?: () => void;
  table: Table<ITodo>;
  row: RowType;
}) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const isDone = todo.status === 'Done';
  const meta = table.options.meta as TableMeta | undefined;

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    
    try {
      setIsUpdating(true);
      const newStatus: Status = isDone ? 'Todo' : 'Done';
      
      // Create the update data with the correct types that match UpdateTodoData
      const updateData = {
        id: todo.id,
        title: todo.title,
        description: todo.description || null,
        status: newStatus as 'Todo' | 'In Progress' | 'Done' | 'Canceled',
        priority: (isPriority(todo.priority) ? todo.priority : 'Medium') as 'High' | 'Medium' | 'Low',
        label: (isLabel(todo.label) ? todo.label : 'General') as 'General' | 'Work' | 'Personal' | 'Documentation' | 'Enhancement' | 'Feature' | 'Bug',
        user_id: todo.user_id,
      };
      
      await updateTodoAction(updateData);
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      toast({
        title: `Todo marked as ${newStatus}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to update todo status:', error);
      toast({
        title: "Error",
        description: "Failed to update todo status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant={isDone ? "outline" : "ghost"}
        size="sm"
        className={cn(
          "h-8 w-8 p-0 rounded-full transition-all",
          isDone 
            ? "text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" 
            : "hover:bg-muted",
          isUpdating && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleStatusToggle}
        disabled={isUpdating}
        title={isDone ? "Mark as not done" : "Mark as done"}
      >
        {isDone ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>
      <TodosTableAction
        todo={todo}
        onEditClick={() => meta?.onEdit?.(row.original)}
        onDeleteSuccess={(id: string) => meta?.onDeleteSuccess?.(id)}
        isDeleting={meta?.deletingId === row.original.id}
      />
    </div>
  );
};

interface TodoColumnsProps {
  onUpdateSuccess?: () => void;
  showDateTime?: boolean;
  onEdit?: (todo: ITodo) => void;
  onDelete?: (id: string) => void;
}

export const getColumns = ({ onUpdateSuccess, showDateTime = false }: TodoColumnsProps = {}) => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: RowType }) => {
      const todo = row.original as ITodo;
      const isDone = todo.status === 'Done';
      
      return (
        <div className="flex flex-col max-w-[500px]">
          <span 
            className={cn(
              "font-medium truncate",
              isDone && "line-through opacity-80"
            )}
          >
            {row.getValue("title")}
          </span>
          {showDateTime && todo.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(todo.createdAt).toLocaleString()}
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-[500px] min-w-[300px] flex-shrink-0",
    },
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }: { row: RowType }) => {
      const labelValue = row.getValue("label");
      const label: Label = isLabel(labelValue) ? labelValue : 'General';
      
      return (
        <Badge variant="outline" className="text-xs">
          {label}
        </Badge>
      );
    },
    filterFn: (row: RowType, id: string, value: Label[]) => {
      const rowValue = row.getValue(id);
      return isLabel(rowValue) ? value.includes(rowValue) : false;
    },
    meta: {
      className: "w-[100px] text-center",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: RowType }) => {
      const statusValue = row.getValue("status");
      const status: Status = isStatus(statusValue) ? statusValue : 'Todo';
      const isDone = status === 'Done';
      
      return (
        <Badge
          variant={
            isDone
              ? "doneTodo"
              : status === "In Progress"
              ? "secondary"
              : "default"
          }
          className={cn(
            isDone && "opacity-80"
          )}
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row: RowType, id: string, value: Status[]) => {
      const rowValue = row.getValue(id);
      return isStatus(rowValue) ? value.includes(rowValue) : false;
    },
    meta: {
      className: "w-[120px]",
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }: { row: RowType }) => {
      const priorityValue = row.getValue("priority");
      const priority: Priority = isPriority(priorityValue) ? priorityValue : 'Medium';
      const isDone = row.original.status === 'Done';
      
      return (
        <Badge
          variant={
            priority === "High"
              ? "destructive"
              : priority === "Medium"
              ? "secondary"
              : "default"
          }
          className={cn(
            isDone && "opacity-80"
          )}
        >
          {priority}
        </Badge>
      );
    },
    filterFn: (row: RowType, id: string, value: Priority[]) => {
      const rowValue = row.getValue(id);
      return isPriority(rowValue) ? value.includes(rowValue) : false;
    },
    meta: {
      className: "w-[100px]",
    },
  },
  {
    id: "actions",
    cell: ({ row, table }: { row: RowType; table: Table<ITodo> }) => {
      const todo = row.original;
      const isDone = todo.status === 'Done';
      
      return (
        <div className={cn(
          "flex items-center justify-end gap-2",
          isDone && "opacity-80"
        )}>
          <StatusUpdate
            todo={todo}
            onUpdateSuccess={onUpdateSuccess}
            table={table}
            row={row}
          />
        </div>
      );
    },
    meta: {
      className: "w-[120px] text-right",
    },
  },
];
