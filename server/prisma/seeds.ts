// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';


// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.user.upsert({
    where: { login: 'Acliclas' },
    update: {},
    create: {
      login: 'Acliclas',
      hash: await argon.hash('tutututututu'),
      status:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      fA: "cava",
      faEnabled: true,
    },
  });

  const post2 = await prisma.user.upsert({
    where: { login: "Fuma" },
    update: {},
    create: {
      login: "Fuma",
      hash: await argon.hash('lululululu'),
      status:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      fA: "",
      faEnabled: false,
    },
  });

  const post3 = await prisma.user.upsert({
    where: { login: "Naykee" },
    update: {},
    create: {
      login: "Naykee",
      hash: await argon.hash('rhoooooooooooooooooo'),
      status:
        'kikou',
      fA: "salutcava",
      faEnabled: true,
    },
  });

  // console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });