import { LucideIcon } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
  color?: string;
}

export const STATUSES: FilterOption[] = [
  { label: "Todo", value: "Todo" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
  { label: "Canceled", value: "Canceled" },
];

export const PRIORITIES: FilterOption[] = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const LABELS: FilterOption[] = [
  { label: "Bug", value: "Bug" },
  { label: "Feature", value: "Feature" },
  { label: "Enhancement", value: "Enhancement" },
  { label: "Documentation", value: "Documentation" },
  {label:"General",value:"General"},
  {label:"Personal",value:"Personal"},
  {label:"Work",value:"Work"}
];
