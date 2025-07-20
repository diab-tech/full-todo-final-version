'use server'

import { PrismaClient } from '@prisma/client'
import { TodoFormValues } from '@/schema'
import { revalidatePath } from 'next/cache'
import { ITodo, UpdateTodoData } from '@/interfaces';
import { error } from 'console';

const prisma = new PrismaClient()


export const createTodoAction = async ({title, description, status, priority, label, user_id}: TodoFormValues) => {
    try {
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
        revalidatePath('/');
        return newTodo;
    } catch (error) {
        throw new Error(`Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export const getUserTodoAction = async (userId: string): Promise<ITodo[]> => {
    const todos = await prisma.todo.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return todos.map(todo => {
        const status = todo.status as 'Todo' | 'In Progress' | 'Done' | 'Canceled';
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
