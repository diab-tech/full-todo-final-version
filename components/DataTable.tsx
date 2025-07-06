"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "./TableFilters";
import { cn } from "@/lib/utils";

export interface DataTableMeta<TData> {
  onEdit?: (todo: TData) => void;
  onDeleteSuccess?: (id: string) => void;
  deletingId?: string;
  selectedRows?: Set<string>;
  onToggleSelect?: (id: string) => void;
  showDateTime?: boolean;
  onToggleDateTime?: () => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: DataTableMeta<TData>;
  addButton?: React.ReactNode;
  className?: string;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  meta = {},
  addButton,
  className,
}: DataTableProps<TData, TValue>) {
  const { 
    onEdit, 
    onDeleteSuccess, 
    deletingId, 
    selectedRows = new Set<string>(), 
    onToggleSelect,
    showDateTime,
    onToggleDateTime,
  } = meta;
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  
  // Update row selection when selectedRows prop changes
  const internalRowSelection = useMemo<RowSelectionState>(() => {
    const selection: RowSelectionState = {};
    data.forEach((row: TData & { id: string }) => {
      if (selectedRows.has(row.id)) {
        selection[row.id] = true;
      }
    });
    return selection;
  }, [data, selectedRows]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: internalRowSelection,
    },
    meta: {
      onEdit,
      onDeleteSuccess,
      deletingId,
      selectedRows,
      onToggleSelect,
      showDateTime,
      onToggleDateTime,
    },
    enableRowSelection: true,
  });

  // Update parent selection state when row selection changes
  React.useEffect(() => {
    if (onToggleSelect) {
      const selectedIds = Object.keys(rowSelection)
        .filter(id => rowSelection[id])
        .map(id => id);
      
      // Only update if there's an actual change to prevent infinite loops
      const currentIds = Array.from(selectedRows);
      if (selectedIds.length !== currentIds.length || 
          !selectedIds.every(id => currentIds.includes(id))) {
        selectedIds.forEach(id => {
          if (!selectedRows.has(id)) {
            onToggleSelect(id);
          }
        });
        
        // Handle deselection
        currentIds.forEach(id => {
          if (!selectedIds.includes(id)) {
            onToggleSelect(id);
          }
        });
      }
    }
  }, [rowSelection, onToggleSelect, selectedRows]);

  return (
    <div className={cn("space-y-4", className)}>
      <DataTableToolbar table={table} addButton={addButton} />
      <div className="rounded-md">
        <div className="relative w-full overflow-auto">
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "hover:bg-muted/50",
                      deletingId === row.original.id && "opacity-50",
                      (row.original as { status?: string }).status === 'Done' && 'bg-muted/20',
                      'transition-opacity duration-200'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No TODOs found. Create one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
