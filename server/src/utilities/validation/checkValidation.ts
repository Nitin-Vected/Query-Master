import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from '../../config';

export const checkValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};