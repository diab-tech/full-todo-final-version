export const STATUSES = [
  {
    value: 'Todo',
    label: 'Todo',
  },
  {
    value: 'In Progress',
    label: 'In Progress',
  },
  {
    value: 'Done',
    label: 'Done',
  },
] as const;

export const PRIORITIES = [
  {
    value: 'Low',
    label: 'Low',
  },
  {
    value: 'Medium',
    label: 'Medium',
  },
  {
    value: 'High',
    label: 'High',
  },
] as const;

export const LABELS = [
  {
    value: 'General',
    label: 'General',
  },
  {
    value: 'Work',
    label: 'Work',
  },
  {
    value: 'Personal',
    label: 'Personal',
  },
] as const;

// Extract the string literal types for TypeScript
export type Status = typeof STATUSES[number]['value'];
export type Priority = typeof PRIORITIES[number]['value'];
export type Label = typeof LABELS[number]['value'];
