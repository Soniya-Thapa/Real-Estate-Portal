import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { errorResponse } from '../utils/response';
import { UUID } from '../types';

interface JwtPayload {
  userId: UUID;     
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Access token required', undefined, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Verify user still exists in DB
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [decoded.userId]  // Now passing UUID string
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'User no longer exists', undefined, 401);
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 'Token expired', undefined, 401);
    }
    return errorResponse(res, 'Invalid token', undefined, 401);
  }
};

export const generateToken = (userId: UUID, email: string): string => {  
  
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
  );
};