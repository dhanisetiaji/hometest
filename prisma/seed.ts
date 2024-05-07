import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User 1',
      password: '$2a$10$GF2AnYMtC9fhXPwwlPgD/emieCBYxT.EudtZGGLiVoIT.iiZWomGG',
      balances: 1100,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User 2',
      password: '$2a$10$GF2AnYMtC9fhXPwwlPgD/emieCBYxT.EudtZGGLiVoIT.iiZWomGG',
      balances: 2000,
    },
  });

  // Insert Transactions
  await prisma.transaction.create({
    data: {
      order_id: 'order1',
      amount: 100,
      type: 'DEPOSIT',
      status: 'COMPLETED',
      current_balance: 1000,
      user_id: user1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
