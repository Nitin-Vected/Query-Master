import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from '../../config';

export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Here we go !!");
  const errors = validationResult(req);
  console.log("Errors : ",errors)
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};