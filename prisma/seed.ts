// prisma/seed.ts
import { PrismaClient, User, Category } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Buat Role
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Participant' },
    ],
    skipDuplicates: true,
  });

  // Password default semua user
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Buat 2 Admin
  const adminUsers: User[] = [];
  for (let i = 1; i <= 2; i++) {
    const admin = await prisma.user.create({
      data: {
        username: `admin${i}`,
        email: `admin${i}@example.com`,
        password: passwordHash,
        roleId: 1,
        profile: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            image: faker.image.avatar(),
            description: 'Administrator account',
          },
        },
        address: {
          create: {
            city: faker.location.city(),
            district: faker.location.street(),
          },
        },
      },
    });
    adminUsers.push(admin);
  }

  // 3. Buat 98 Participant
  const participantUsers: User[] = [];
  for (let i = 1; i <= 98; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: passwordHash,
        roleId: 2,
        profile: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            image: faker.image.avatar(),
            description: faker.lorem.sentence(),
          },
        },
        address: {
          create: {
            city: faker.location.city(),
            district: faker.location.street(),
          },
        },
      },
    });
    participantUsers.push(user);
  }

  const allUsers: User[] = [...adminUsers, ...participantUsers];

  // 4. Buat 5 kategori
  const categories: Category[] = [];
  const categoryNames = ['Music', 'Sport', 'Technology', 'Art', 'Food'];
  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: { name },
    });
    categories.push(category);
  }

  // 5. Buat 50 event
  for (let i = 1; i <= 50; i++) {
    await prisma.event.create({
      data: {
        userId: faker.helpers.arrayElement(allUsers).id,
        categoryId: faker.helpers.arrayElement(categories).id,
        name: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        quota: faker.number.int({ min: 50, max: 500 }),
        address: faker.location.streetAddress(),
        poster: faker.image.urlLoremFlickr({ category: 'event' }),
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
