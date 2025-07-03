import { ColumnDef } from "@tanstack/react-table";
import { ITodo } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import TodosTableAction from "./TodosTableAction";

export const columns: ColumnDef<ITodo>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.getValue("title"),
    meta: {
      className: "w-full min-w-[200px]",
    },
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("label") || 'General'}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      className: "w-[100px] text-center",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || 'Todo';
      return (
        <Badge
          variant={
            status === "Done"
              ? "doneTodo"
              : status === "In Progress"
              ? "secondary"
              : "default"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      className: "w-[100px] text-center",
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = (row.getValue("priority") as string) || 'Medium';
      return (
        <Badge
          variant={
            priority === "High"
              ? "destructive"
              : priority === "Medium"
              ? "secondary"
              : "default"
          }
        >
          {priority}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      className: "w-[100px] text-center",
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <div className="text-right">
        <TodosTableAction
          todo={row.original}
          onEditClick={() => {
            // @ts-ignore
            table.options.meta?.onEdit(row.original);
          }}
          onDeleteSuccess={(id: string) => {
            // @ts-expect-error
            table.options.meta?.onDeleteSuccess(id);
          }}
          isDeleting={
            // @ts-expect-error
            table.options.meta?.deletingId === row.original.id
          }
        />
      </div>
    ),
    meta: {
      className: "w-[100px] text-right",
    },
  },
];
