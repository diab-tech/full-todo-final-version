"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { STATUSES, PRIORITIES, LABELS } from "@/lib/filters";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  addButton?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  addButton,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-9 w-full sm:w-[200px]"
        />
        
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "status", title: "Status", options: STATUSES },
            { id: "priority", title: "Priority", options: PRIORITIES },
            { id: "label", title: "Label", options: LABELS },
          ].map(
            (filter) =>
              table.getColumn(filter.id) && (
                <DataTableFacetedFilter
                  key={filter.id}
                  column={table.getColumn(filter.id)}
                  title={filter.title}
                  options={filter.options}
                />
              )
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3 text-xs sm:text-sm"
              size="sm"
            >
              Reset
              <X className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} tasks
        </div>
        <div className="flex items-center gap-2">
          {addButton}
          <DataTableViewOptions table={table} />
        </div>
      </div>  
    </div>
  );
}
