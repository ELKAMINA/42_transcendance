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
        "Offline",
      fA: 'cava',
      faEnabled: true,
      rank: 2,
      level: 100,
      totalloss: 20,
      totalWins: 60,
      totalMatches: 80,
    },
  });

  const post2 = await prisma.user.upsert({
    where: { login: 'Fuma' },
    update: {},
    create: {
      login: 'Fuma',
      hash: await argon.hash('lululululu'),
      status:
        'Online',
      fA: '',
      faEnabled: false,
      rank: 3,
      level: 250,
      totalloss: 80,
      totalWins: 50,
      totalMatches: 130,
    },
  });

  const post3 = await prisma.user.upsert({
    where: { login: 'Naykee' },
    update: {},
    create: {
      login: 'Naykee',
      hash: await argon.hash('rhoooooooooooooooooo'),
      status: 'Playing',
      fA: 'salutcava',
      faEnabled: true,
      rank: 1,
      level: 950,
      totalloss: 10,
      totalWins: 150,
      totalMatches: 160,
    },
  });

  const globalInfo = await prisma.globalInformation.upsert({
    where: { pid: '1' },
    update: {},
    create: {
      totalPlayers: 4,
    },
  })

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
