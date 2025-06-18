import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  // TODOS fake Data
  await prisma.todo.createMany(
    {
      data: Array.from({length: 25}, () => (
        {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        // isDone: faker.datatype.boolean(),
        // createdAt: faker.date.past(),
      }
    ))
  }
  )
  
    // await prisma.user.createMany(
    //   {
    //     data: Array.from({length: 14}, () => (
    //       {
    //       email: faker.internet.email(),
    //       name: faker.person.firstName(),
    //       address:{
    //         city: faker.location.city(),
    //         state: faker.location.state(),
    //         zip: faker.location.zipCode(),
    //         street: faker.location.street(),
    //       }
    //     }
    //   ))
    // }
    // )
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })