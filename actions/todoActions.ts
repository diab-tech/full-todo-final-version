'use server'

import { PrismaClient } from '@prisma/client'
import { TodoFormValues } from '@/schema'
import { revalidatePath } from 'next/cache'
import { ITodo } from '@/interfaces';

const prisma = new PrismaClient()


export const createTodoAction = async ({title,description,status,priority,label}: TodoFormValues) => {
     await prisma.todo.create({
        data: {
            title,
            description,
            status,
            priority,
            label,
        }
    })
    revalidatePath('/');
}


export const getTodoAction = async (): Promise<ITodo[]> => {
    const todos = await prisma.todo.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    // Ensure the returned data matches the ITodo interface with proper type assertions
    return todos.map(todo => {
        // Type assertion for status, priority, and label to match ITodo
        const status = todo.status as 'Todo' | 'In Progress' | 'Done';
        const priority = todo.priority as 'High' | 'Medium' | 'Low';
        const label = todo.label as 'General' | 'Work' | 'Personal';
        
        return {
            ...todo,
            status,
            priority,
            label,
            description: todo.description || undefined,
            createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
            updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : null
        };
    });
}


export const updateTodoAction = async(todo:ITodo)=>{
     await prisma.todo.update({
        where: {
            id:todo.id,
        },
        data: {
            title:todo.title,
            description:todo.description,
            status:todo.status,
            priority:todo.priority,
            label:todo.label,
        }
    })
    revalidatePath('/');
}


export const deleteTodoAction = async (id: string) => {
     await prisma.todo.delete({
      where: {
        id,
    },
})
revalidatePath('/');
}
