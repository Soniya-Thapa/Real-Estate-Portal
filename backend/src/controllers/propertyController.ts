import { Request, Response } from 'express';
import pool from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get all properties with favourite status for current user
    const result = await pool.query(
      `SELECT 
        p.*,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favourite
       FROM properties p
       LEFT JOIN favourites f ON p.id = f.property_id AND f.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    successResponse(res, result.rows);
  } catch (error) {
    console.error('Get properties error:', error);
    errorResponse(res, 'Failed to fetch properties', undefined, 500);
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT 
        p.*,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favourite
       FROM properties p
       LEFT JOIN favourites f ON p.id = f.property_id AND f.user_id = $2
       WHERE p.id = $1`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Property not found', undefined, 404);
    }

    successResponse(res, result.rows[0]);
  } catch (error) {
    errorResponse(res, 'Failed to fetch property', undefined, 500);
  }
};