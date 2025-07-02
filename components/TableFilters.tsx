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
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        
        {[
          { id: "status", title: "Status", options: STATUSES },
          { id: "priority", title: "Priority", options: PRIORITIES },
          { id: "label", title: "Label", options: LABELS },
        ].map((filter) => (
          table.getColumn(filter.id) && (
            <DataTableFacetedFilter
              key={filter.id}
              column={table.getColumn(filter.id)}
              title={filter.title}
              options={filter.options}
            />
          )
        ))}
        
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {/* <AddTaskDialog /> */}
      </div>
    </div>
  );
}
