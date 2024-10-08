import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';

const app =express();

export const prisma = new PrismaClient();
app.use(express.json());

app.use('/api/auth', authRoutes);

export default app;