
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import favouriteRoutes from './routes/favourites';
import { errorResponse } from './utils/response';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favourites', favouriteRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  errorResponse(res, 'Route not found', undefined, 404);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  errorResponse(res, 'Internal server error', undefined, 500);
});

app.listen(PORT, () => {
  console.log(`----------  Server running on port ${PORT}  ------------`);
});