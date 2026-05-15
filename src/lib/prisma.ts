import { PrismaClient } from '@prisma/client';

// Mencegah Next.js membuat koneksi baru setiap kali Hot Reload (Save file)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;