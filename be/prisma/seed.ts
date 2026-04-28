import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const userIdsByEmail = new Map<string, string>();
  const users = [
    {
      name: 'Admin Shortener',
      email: 'admin@shortener.local',
      password: 'admin123',
    },
    {
      name: 'Demo User',
      email: 'demo@shortener.local',
      password: 'demo123',
    },
  ];

  const urls = [
    {
      shortCode: 'openai',
      originalUrl: 'https://openai.com',
      clickCount: 12,
      expiresAt: null,
    },
    {
      shortCode: 'nestjs',
      originalUrl: 'https://docs.nestjs.com',
      clickCount: 7,
      expiresAt: null,
    },
    {
      shortCode: 'promo30',
      originalUrl: 'https://example.com/promo',
      clickCount: 3,
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
    },
  ];

  for (const user of users) {
    const savedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashPassword(user.password),
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashPassword(user.password),
      },
    });

    userIdsByEmail.set(user.email, savedUser.id);
  }

  for (const url of urls) {
    await prisma.url.upsert({
      where: { shortCode: url.shortCode },
      update: {
        originalUrl: url.originalUrl,
        clickCount: url.clickCount,
        expiresAt: url.expiresAt,
        userId: userIdsByEmail.get('demo@shortener.local'),
      },
      create: {
        ...url,
        userId: userIdsByEmail.get('demo@shortener.local'),
      },
    });
  }

  console.log('Seed completed');
  console.log('Users:');
  console.log('- admin@shortener.local / admin123');
  console.log('- demo@shortener.local / demo123');
  console.log('URLs:');
  console.log('- /openai');
  console.log('- /nestjs');
  console.log('- /promo30');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
