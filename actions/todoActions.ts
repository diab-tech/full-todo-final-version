'use server'

import { PrismaClient } from '@prisma/client'
import { TodoFormValues } from '@/schema'
import { revalidatePath } from 'next/cache'
import { ITodo } from '@/interfaces';

const prisma = new PrismaClient()


export const createTodoAction = async ({title, description, status, priority, label, user_id}: TodoFormValues) => {
    try {
        console.log('Creating todo with data:', { title, user_id });
        
        if (!user_id) {
            throw new Error('User ID is required to create a todo');
        }

        const newTodo = await prisma.todo.create({
            data: {
                title,
                description: description || null,
                status,
                priority,
                label,
                user_id
            }
        });
        
        console.log('Successfully created todo:', newTodo.id);
        revalidatePath('/');
        return newTodo;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw new Error(`Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export const getTodoAction = async (userId: string): Promise<ITodo[]> => {
    const todos = await prisma.todo.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Ensure the returned data matches the ITodo interface with proper type assertions
    return todos.map(todo => {
        // Type assertion for status, priority, and label to match ITodo
        const status = todo.status as 'Todo' | 'In Progress' | 'Done';
        const priority = todo.priority as 'High' | 'Medium' | 'Low';
        const label = todo.label as 'General' | 'Work' | 'Personal' | 'Documentation' | 'Enhancement' | 'Feature' | 'Bug';
        
        return {
            ...todo,
            status,
            priority,
            label,
            description: todo.description || null,
            createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
            updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : null
        };
    });
}


interface UpdateTodoData {
    id: string;
    title: string;
    description?: string | null;
    status: 'Todo' | 'In Progress' | 'Done' | 'Canceled';
    priority: 'High' | 'Medium' | 'Low';
    label: 'General' | 'Work' | 'Personal' | 'Documentation' | 'Enhancement' | 'Feature' | 'Bug';
    user_id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export const updateTodoAction = async(todo: UpdateTodoData) => {
    if (!todo.id) {
        throw new Error('Cannot update todo: Missing todo ID');
    }
    
    const { id, ...updateData } = todo;
    
    try {
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                title: updateData.title,
                description: updateData.description ?? null,
                status: updateData.status,
                priority: updateData.priority,
                label: updateData.label,
                ...(updateData.user_id ? { user_id: updateData.user_id } : {})
            }
        });
        
        revalidatePath('/');
        return updatedTodo;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}


export const deleteTodoAction = async (id: string) => {
    const deletedTodo = await prisma.todo.delete({
        where: {
            id,
        },
    });
    revalidatePath('/');
    return deletedTodo.id;
}
