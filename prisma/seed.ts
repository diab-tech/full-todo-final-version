import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clear existing todos
  await prisma.todo.deleteMany({});

  // Generate a fixed user ID for all todos
  const testUserId = '507f1f77bcf86cd799439011'; // Fixed ObjectId format for MongoDB

  // Create sample todos
  await prisma.todo.createMany({
    data: Array.from({ length: 25 }, () => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['Todo', 'In Progress', 'Done', 'Canceled']),
      priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
      label: faker.helpers.arrayElement([
        'General',
        'Work',
        'Personal',
        'Documentation',
        'Enhancement',
        'Feature',
        'Bug'
      ]),
      user_id: testUserId, // Use the fixed user ID
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })),
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })