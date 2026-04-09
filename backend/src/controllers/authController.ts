import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { generateToken } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { validateEmail, validatePassword, sanitizeString } from '../utils/validation';
import { UUID } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Email, password, and name are required');
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase();
    const sanitizedName = sanitizeString(name);

    if (!validateEmail(sanitizedEmail)) {
      return errorResponse(res, 'Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return errorResponse(res, 'Invalid password', passwordValidation.errors);
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [sanitizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Email already registered', undefined, 409);
    }

    // Hash password with salt
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user - UUID generated automatically by PostgreSQL
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, role, created_at`,
      [sanitizedEmail, passwordHash, sanitizedName]
    );

    const user = result.rows[0];
    const token = generateToken(user.id as UUID, user.email);

    successResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 'Internal server error', undefined, 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required');
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase();

    // Get user with password hash
    const result = await pool.query(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Invalid credentials', undefined, 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid credentials', undefined, 401);
    }

    const token = generateToken(user.id as UUID, user.email);

    // Don't send password hash in response
    const { password_hash, ...userWithoutPassword } = user;

    successResponse(res, {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Internal server error', undefined, 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    successResponse(res, { user: req.user });
  } catch (error) {
    errorResponse(res, 'Internal server error', undefined, 500);
  }
};