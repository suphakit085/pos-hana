// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// ป้องกันการสร้าง PrismaClient หลายตัวในโหมด development
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices

// PrismaClient ถูกแชร์ระหว่าง invocations ใน development environment
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// ในโหมด production ให้สร้าง client ใหม่ทุกครั้ง
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;