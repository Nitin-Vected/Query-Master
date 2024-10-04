import { body } from 'express-validator';
import { checkValidation } from './checkValidation';

// Combined validation and error handling middleware
export const adminValidateStatusName = [
  body("statusName")
    .notEmpty()
    .withMessage("Status Name is required")
    .isString()
    .withMessage("Status Name must be a string")
    .matches(/[a-zA-Z]{2,}/)
    .withMessage("Status Name must contain at least two letters and not be only numbers"),

  // Middleware to handle errors
  checkValidation,
];
