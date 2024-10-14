import { body, param } from "express-validator";
import { checkValidation } from "./checkValidation";

export const validateUpdateProfile = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isString()
    .withMessage("User ID must be a string")
    .matches(/^USER\d{4}$/)
    .withMessage('User ID must follow the format "USER" followed by 4 digits, e.g., "USER0001"'),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("userEmail")
    .optional()
    .isEmail()
    .withMessage("User email must be a valid email"),
  body("contactNumber")
    .optional()
    .isString()
    .withMessage("Contact number must be a string"),
  body("roleId").optional().isString().withMessage("Role ID must be a string")
    .matches(/^ROLE\d{4}$/)
    .withMessage('Role ID must follow the format "ROLE" followed by 4 digits, e.g., "ROLE0001"'),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  checkValidation,
];
