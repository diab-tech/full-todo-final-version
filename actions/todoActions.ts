'use server'

import { PrismaClient } from '@prisma/client'
import { TodoFormValues } from '@/schema'
const prisma = new PrismaClient()


export const createTodoAction = async ({title,description,priority,label,status}: TodoFormValues) => {
    return await prisma.todo.create({
        data: {
            title,
            description,
            createdAt: new Date(),
            priority,
            label,
            status,

            
            
        }
    })
}


export const getTodoAction = async()=>{
    return await prisma.todo.findMany()
    
}


export const updateTodoAction = async({title,description,priority,label,status}: TodoFormValues)=>{
    return await prisma.todo.update({
        where: {
            id: '1'
        },
        data: {
            title,
            description,
            createdAt: new Date(),
            priority,
            label,
            status,
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
