import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { STATUSES, PRIORITIES, LABELS } from '../lib/constants';

const prisma = new PrismaClient();

// Helper function to get random value from an array
const getRandomValue = <T extends { value: string }>(arr: readonly T[]): string => {
  return arr[Math.floor(Math.random() * arr.length)].value;
};

async function main() {
  // TODOS fake Data
  await prisma.todo.createMany({
    data: Array.from({ length: 25 }, () => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      status: getRandomValue(STATUSES),
      label: getRandomValue(LABELS),
      priority: getRandomValue(PRIORITIES),
      isDone: false,
    }))
  });
  
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