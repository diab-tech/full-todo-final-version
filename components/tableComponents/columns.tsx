"use client";

import React from "react";
import { TodoFormValues } from "@/schema";
import { ColumnDef, Column, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { STATUSES, PRIORITIES } from "@/lib/constants";

// Extend TodoFormValues to include all required fields for table rows
interface TodoRowData extends TodoFormValues {
  id: string;
  status: string;
  label: string;
  priority: string;
  createdAt: Date;
  updatedAt?: Date; // Made optional with ?
  isDone: boolean;
}

export const columns: Array<ColumnDef<TodoRowData>> = [
  {
    id: "select",
    header: ({ table }: { table: Table<TodoRowData> }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }: { row: { getIsSelected: () => boolean; toggleSelected: (value: boolean) => void } }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }: { column: Column<TodoRowData> }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }: { row: { id: string } }) => row.id,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }: { column: Column<TodoRowData> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const todo = row.original;
      console.log('Todo data in cell:', todo); // Debug
      
      // Access label directly from the todo object
      const label = todo.label || todo['label'] || '';
      
      return (
        <div className="flex items-center space-x-2">
          {label && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
              {label}
            </span>
          )}
          <span className="max-w-[400px] truncate font-medium">
            {todo.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: { column: Column<TodoRowData> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const todo = row.original;
      const status = todo.status || 'Todo';
      const statusInfo = STATUSES.find(s => s.value === status) || { label: status };
      
      return (
        <div className="flex w-[100px] items-center">
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
            status === 'Done' ? 'bg-green-100 text-green-700' : 
            status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {statusInfo.label}
          </span>
        </div>
      );
    },
    filterFn: (row, id: string, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }: { column: Column<TodoRowData> }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priorityValue = row.getValue("priority") as string;
      const priority = PRIORITIES.find(
        (p) => p.value === priorityValue
      );

      if (!priority) {
        return <span className="text-muted-foreground">-</span>;
      }

      // Create a safe render for the icon
      const PriorityIcon = 'icon' in priority ? priority.icon as React.ComponentType<{ className?: string }> : undefined;

      return (
        <div className="flex items-center">
          {PriorityIcon && <PriorityIcon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id: string, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Properly type the row parameter for DataTableRowActions
      return <DataTableRowActions row={row} />;
    },
  },
];
