import { Request, Response } from 'express';
import pool from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

export const getMyFavourites = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        p.*,
        f.created_at as favourited_at
       FROM favourites f
       JOIN properties p ON f.property_id = p.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    successResponse(res, result.rows);
  } catch (error) {
    console.error('Get favourites error:', error);
    errorResponse(res, 'Failed to fetch favourites', undefined, 500);
  }
};

export const addFavourite = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.body;

    if (!propertyId) {
      return errorResponse(res, 'Property ID is required');
    }

    // Verify property exists
    const propertyCheck = await pool.query(
      'SELECT id FROM properties WHERE id = $1',
      [propertyId]
    );

    if (propertyCheck.rows.length === 0) {
      return errorResponse(res, 'Property not found', undefined, 404);
    }

    // Insert favourite (will fail if already exists due to UNIQUE constraint)
    try {
      const result = await pool.query(
        `INSERT INTO favourites (user_id, property_id) 
         VALUES ($1, $2) 
         RETURNING id, created_at`,
        [userId, propertyId]
      );

      successResponse(
        res,
        { favourite: result.rows[0] },
        'Added to favourites',
        201
      );
    } catch (dbError: any) {
      if (dbError.code === '23505') { // Unique violation
        return errorResponse(res, 'Property already in favourites', undefined, 409);
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Add favourite error:', error);
    errorResponse(res, 'Failed to add favourite', undefined, 500);
  }
};

export const removeFavourite = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const result = await pool.query(
      `DELETE FROM favourites 
       WHERE user_id = $1 AND property_id = $2
       RETURNING id`,
      [userId, propertyId]
    );

    if (result.rowCount === 0) {
      return errorResponse(res, 'Favourite not found', undefined, 404);
    }

    successResponse(res, null, 'Removed from favourites');
  } catch (error) {
    console.error('Remove favourite error:', error);
    errorResponse(res, 'Failed to remove favourite', undefined, 500);
  }
};

export const checkFavouriteStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const result = await pool.query(
      'SELECT id FROM favourites WHERE user_id = $1 AND property_id = $2',
      [userId, propertyId]
    );

    successResponse(res, { isFavourite: result.rows.length > 0 });
  } catch (error) {
    errorResponse(res, 'Failed to check favourite status', undefined, 500);
  }
};