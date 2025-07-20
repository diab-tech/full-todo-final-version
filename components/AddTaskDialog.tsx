"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, TodoFormValues } from "@/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import * as React from "react";
import { ITodo } from "@/interfaces";
import { useToast } from "./ui/use-toast";
import Spinner from "./Spinner";
import { Status, Priority, Label } from "@/interfaces";
import { useUpdateTodo } from "@/app/hooks/useUpdateTodo";
import { useCreateTodo } from "@/app/hooks/useCreateTodo";

import { Button } from "./ui/button";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ITodo;
  onSuccess?: () => void;
  userId: string | null; // تأكيد إن userId ممكن يكون null
}

export function AddTaskDialog({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  userId,
}: AddTaskDialogProps) {
  const { toast } = useToast();
  const updateTodo = useUpdateTodo();
  const createTodo = useCreateTodo();


  // Define default values with a fallback for userId
  const defaultValues: TodoFormValues = {
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    label: "General",
    user_id: userId || "", // Will be validated by the form schema
  };

  // Initialize form with default values
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      ...(initialValues
        ? {
            ...initialValues,
            status: initialValues.status as Status,
            priority: initialValues.priority as Priority,
            label: initialValues.label as Label,
            user_id: userId || "", // Ensure user_id is always a string
          }
        : {}),
    },
    mode: "onChange",
  });

  // Reset form when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
        user_id: userId || "", // Ensure user_id is always a string
        status: initialValues.status as Status,
        priority: initialValues.priority as Priority,
        label: initialValues.label as Label,
      });
    }
  }, [initialValues, form, userId]);

  const onSubmit = async (data: TodoFormValues) => {
    onOpenChange(false);
    try {
      // Ensure user_id is always a string
      const validatedUserId = userId || "";
      
      if (initialValues?.id) {
        // Update existing todo
        const updatedTodo = {
          ...data,
          id: initialValues.id,
          user_id: validatedUserId, // Use validated user_id
        };
        await updateTodo.mutateAsync(updatedTodo);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const todoData = {
          ...data,
          user_id: validatedUserId,
          description: data.description || null // This ensures description is either string or null
        };
        // Create new todo using the mutation
        await createTodo.mutateAsync(todoData);
      }
      form.reset({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        label: "General",
        user_id: validatedUserId,
      });
      
      onSuccess?.();
    } catch (error) {
      
      onOpenChange(true);
      console.error("Error saving task:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to save task.",
          variant: "destructive",
        });
      }
      
      console.error(
        `Failed to ${initialValues?.id ? "update" : "create"} todo:`,
        error
      );
    }
  };

  // Handle case where userId is not provided
  if (!userId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>User ID is required to add or edit a TODO.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription>
            {initialValues
              ? "Update the task details below."
              : "Fill in the details below to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter description"
                      {...field}
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                      <SelectItem value="Enhancement">Enhancement</SelectItem>
                      <SelectItem value="Feature">Feature</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : initialValues?.id ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}