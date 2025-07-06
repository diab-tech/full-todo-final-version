"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, TodoFormValues } from "@/schema";
import { createTodoAction, updateTodoAction } from "@/actions/todoActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { ITodo } from "@/interfaces";
import { useToast } from "@/components/ui/use-toast";

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
            status: initialValues.status as "Todo" | "In Progress" | "Done" | "Canceled",
            priority: initialValues.priority as "High" | "Medium" | "Low",
            label: initialValues.label as
              | "General"
              | "Work"
              | "Personal"
              | "Documentation"
              | "Enhancement"
              | "Feature"
              | "Bug",
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
        status: initialValues.status as "Todo" | "In Progress" | "Done" | "Canceled",
        priority: initialValues.priority as "High" | "Medium" | "Low",
        label: initialValues.label as
          | "General"
          | "Work"
          | "Personal"
          | "Documentation"
          | "Enhancement"
          | "Feature"
          | "Bug",
      });
    }
  }, [initialValues, form, userId]);

  const onSubmit = async (data: TodoFormValues) => {
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
        await updateTodoAction(updatedTodo);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        // Create new todo
        await createTodoAction({
          ...data,
          user_id: validatedUserId, // Use validated user_id
        });
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      form.reset({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        label: "General",
        user_id: validatedUserId,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
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
                      value={field.value || ''} 
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
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
              <Button type="submit">{initialValues?.id ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}