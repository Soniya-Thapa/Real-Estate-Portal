import { Response } from 'express';

export const successResponse = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res: Response, message: string, errors?: string[], statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};