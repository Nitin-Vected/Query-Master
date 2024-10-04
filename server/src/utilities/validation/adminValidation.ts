import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { checkValidation } from './checkValidation';

// Combined validation and error handling middleware
export const adminValidateStatusName = [
  body("statusName")
    .notEmpty()
    .withMessage("Status Name is required")
    .isString()
    .withMessage("Status Name must be a string"),

  // Middleware to handle errors
  checkValidation,
];
