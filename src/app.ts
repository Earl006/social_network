import express from 'express';
import { PrismaClient } from '@prisma/client';
const app =express();

export const prisma = new PrismaClient();
app.use(express.json());

export default app;