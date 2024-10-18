import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateCreateUser = [
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("leadEmail")
    .optional()
    .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email must be in a valid format"),
  body("contactNumber")
    .optional()
    .isString()
    .withMessage("Contact number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be exactly 10 digits")
    .matches(/^[0-9]+$/)
    .withMessage("Contact number must contain only digits (0-9)"),
  checkValidation,
];

export const validateUserId = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^USER\d{4}$/)
    .withMessage('User ID must follow the format "USER" followed by 4 digits, e.g., "USER0001"'),
  checkValidation,
];
