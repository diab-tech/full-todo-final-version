'use server'

import { PrismaClient } from '@prisma/client'
import { TodoFormValues } from '@/schema'
const prisma = new PrismaClient()


export const createTodoAction = async ({title,description,isDone}: TodoFormValues) => {
    return await prisma.todo.create({
        data: {
            title,
            description,
            isDone,
            
            
        }
    })
}


export const getTodoAction = async()=>{
    return await prisma.todo.findMany()
    
}


export const updateTodoAction = async({title,description,isDone}: TodoFormValues)=>{
    return await prisma.todo.update({
        where: {
            id: '1'
        },
        data: {
            title: 'Updated Todo',
            description: 'Updated Todo Description',
            isDone,
            createdAt: new Date(),
        }
    })
}


export const deleteTodoAction = async()=>{
    return await prisma.todo.deleteMany({
        where: {
            id: '1'
        }
    })
}
