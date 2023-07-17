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

  const CasperLeFantome = await prisma.user.upsert({
    where: { login: 'CasperLeFantome' },
    update: {},
    create: {
      login: 'CasperLeFantome',
      hash: await argon.hash('CasperLeFantome'),
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

  const cersei_lannister = await prisma.user.upsert({
	where: { login: 'cersei_lannister' },
	update: {},
	create: {
		login: 'cersei_lannister',
		hash: await argon.hash('cersei_lannister'),
		status: 'Playing',
		fA: 'more wine!',
		faEnabled: true,
		rank: 1,
		level: 950,
		totalloss: 10,
		totalWins: 150,
		totalMatches: 160,
		// friends: {
			// connect: [ 
				// {login : 'arya_stark'},
				// {login : 'jamie_lannister'},
				// {login : 'jon_snow'},
			// ]
		// },
    },
  });

  const arya_stark = await prisma.user.upsert({
	where: { login: 'arya_stark' },
	update: {},
	create: {
		login: 'arya_stark',
		hash: await argon.hash('arya_stark'),
		status: 'Playing',
		fA: 'salutcava',
		faEnabled: true,
		rank: 1,
		level: 950,
		totalloss: 10,
		totalWins: 150,
		totalMatches: 160,
		// friends: {
			// connect: [ 
				// {login : 'cersei_lannister'},
				// {login : 'jamie_lannister'},
				// {login : 'jon_snow'},
			// ]
		// },
	},
  });

  const jamie_lannister = await prisma.user.upsert({
    where: { login: 'jamie_lannister' },
    update: {},
    create: {
      login: 'jamie_lannister',
      hash: await argon.hash('jamie_lannister'),
      status: 'Playing',
      fA: 'salutcava',
      faEnabled: true,
      rank: 1,
      level: 950,
      totalloss: 10,
      totalWins: 150,
      totalMatches: 160,
	//   friends: {
		// connect: [ 
			// {login : 'cersei_lannister'},
			// {login : 'arya_stark'},
			// {login : 'jon_snow'},
		// ]
		// },
    },
  });

  const jon_snow = await prisma.user.upsert({
	where: { login: 'jon_snow' },
	update: {},
	create: {
		login: 'jon_snow',
		hash: await argon.hash('jon_snow'),
		status: 'Playing',
		fA: 'salutcava',
		faEnabled: true,
		rank: 1,
		level: 950,
		totalloss: 10,
		totalWins: 150,
		totalMatches: 160,
		// friends: {
			// connect: [ 
				// {login : 'cersei_lannister'},
				// {login : 'arya_stark'},
				// {login : 'jamie_lannister'},
			// ]
		// },
	},
		
  });

  const globalInfo = await prisma.globalInformation.upsert({
    where: { pid: '1' },
    update: {},
    create: {
      totalPlayers: 4,
    },
  })

  const WelcomeChannel = await prisma.channel.upsert({
    where: { name: 'WelcomeChannel' },
    update: {},
    create: {
      name: 'WelcomeChannel',
      members: {connect: {login: 'CasperLeFantome'}},
      admins: {connect: {login: 'CasperLeFantome'}},
      type: 'public',
    },
  });

  const Breakfast_in_Westeros = await prisma.channel.upsert({
    where: { name: 'Breakfast in Westeros' },
    update: {},
    create: {
      name: 'Breakfast in Westeros',
	  members: {
		connect: [
		  { login: 'arya_stark' },
		  { login: 'cersei_lannister' },
		  { login: 'jamie_lannister' },
		],
	  },
      admins: {connect: {login: 'CasperLeFantome'}},
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
