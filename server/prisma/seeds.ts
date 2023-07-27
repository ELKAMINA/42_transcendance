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
      hash: await argon.hash('Acliclas'),
      status: 'Offline',
      fA: 'cava',
      faEnabled: true,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const post2 = await prisma.user.upsert({
    where: { login: 'Fuma' },
    update: {},
    create: {
      login: 'Fuma',
      hash: await argon.hash('Fumafuma'),
      status: 'Offline',
      fA: '',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const post3 = await prisma.user.upsert({
    where: { login: 'Naykee' },
    update: {},
    create: {
      login: 'Naykee',
      hash: await argon.hash('Naykee'),
      status: 'Offline',
      fA: 'salutcava',
      faEnabled: true,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const CasperLeFantome = await prisma.user.upsert({
    where: { login: 'CasperLeFantome' },
    update: {},
    create: {
      login: 'CasperLeFantome',
      hash: await argon.hash('CasperLeFantome'),
      status: 'Offline',
      fA: 'salutcava',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const cersei_lannister = await prisma.user.upsert({
    where: { login: 'cersei_lannister' },
    update: {},
    create: {
      login: 'cersei_lannister',
      hash: await argon.hash('cersei_lannister'),
      status: 'Offline',
      fA: 'more wine!',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      // friends: {
      // connect: [
      // {login : 'arya_stark'},
      // {login : 'jamie_lannister'},
      // {login : 'jon_snow'},
      // ]
      // },
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const arya_stark = await prisma.user.upsert({
    where: { login: 'arya_stark' },
    update: {},
    create: {
      login: 'arya_stark',
      hash: await argon.hash('arya_stark'),
      status: 'Offline',
      fA: 'salutcava',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      // friends: {
      // connect: [
      // {login : 'cersei_lannister'},
      // {login : 'jamie_lannister'},
      // {login : 'jon_snow'},
      // ]
      // },
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const jamie_lannister = await prisma.user.upsert({
    where: { login: 'jamie_lannister' },
    update: {},
    create: {
      login: 'jamie_lannister',
      hash: await argon.hash('jamie_lannister'),
      status: 'Offline',
      fA: 'salutcava',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      //   friends: {
      // connect: [
      // {login : 'cersei_lannister'},
      // {login : 'arya_stark'},
      // {login : 'jon_snow'},
      // ]
      // },
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const jon_snow = await prisma.user.upsert({
    where: { login: 'jon_snow' },
    update: {},
    create: {
      login: 'jon_snow',
      hash: await argon.hash('jon_snow'),
      status: 'Offline',
      fA: 'salutcava',
      faEnabled: false,
      rank: 0,
      level: 0,
      totalloss: 0,
      totalWins: 0,
      totalMatches: 0,
      // friends: {
      // connect: [
      // {login : 'cersei_lannister'},
      // {login : 'arya_stark'},
      // {login : 'jamie_lannister'},
      // ]
      // },
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU,',
    },
  });

  const globalInfo = await prisma.globalInformation.upsert({
    where: { pid: '1' },
    update: {},
    create: {
      totalPlayers: 4,
    },
  });

  const WelcomeChannel = await prisma.channel.upsert({
    where: { name: 'WelcomeChannel' },
    update: {},
    create: {
      name: 'WelcomeChannel',
      members: { connect: { login: 'CasperLeFantome' } },
      admins: { connect: { login: 'CasperLeFantome' } },
      type: 'public',
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
